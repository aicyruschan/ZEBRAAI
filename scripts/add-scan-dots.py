"""在 AI 片段上準確疊加 TC22 的紅色瞄準點和嗶聲（EP01 最重要規則：紅點一定落在條碼上）。

AI 影片模型無法保證紅點位置，所以 AI 片段只生成手部動作（Prompt 寫明不出紅光、不出嗶聲），
紅點、光暈和嗶聲全部在這裡按條碼的實際座標加上。

做法：在參考格選取標籤範圍作模板 → 逐格用模板匹配找出標籤位移（處理鏡頭輕微移動）→
在每次讀碼的時間，把紅點畫在條碼座標加位移的位置 → 在同一時間加嗶聲。

用法：python3 -I scripts/add-scan-dots.py 輸入.mp4 讀碼設定.json 輸出.mp4
設定檔格式見 prompts/scan-dots/r1.example.json；座標為參考格的像素。
"""
import json
import subprocess
import sys
import wave

import cv2
import numpy as np

BEEP_HZ = 2700  # 嗶聲頻率（示意值，非 TC22 實測）
BEEP_SEC = 0.09


def glow_layer(h, w, cx, cy, scale):
    """紅色光暈（柔和橢圓）＋中心細小紅點，回傳 BGR float 圖層。"""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    rx, ry = 34 * scale, 22 * scale
    wash = np.exp(-(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2) * 2.0) * 0.55
    core = np.exp(-(((xx - cx) ** 2 + (yy - cy) ** 2) / (2 * (2.2 * scale) ** 2))) * 1.0
    a = np.clip(wash + core, 0, 1)
    layer = np.zeros((h, w, 3), np.float32)
    layer[..., 2] = 255 * a  # 紅
    layer[..., 1] = 60 * core  # 中心略帶橙白，像 LED 實際亮點
    layer[..., 0] = 40 * core
    return layer, a


def write_beeps(path, times, total_sec, sr=48000):
    n = int(total_sec * sr)
    out = np.zeros(n, np.float32)
    t = np.arange(int(BEEP_SEC * sr)) / sr
    env = np.minimum(1, np.minimum(t / 0.005, (BEEP_SEC - t) / 0.01))
    tone = 0.35 * np.sin(2 * np.pi * BEEP_HZ * t) * env
    for s in times:
        i = int(s * sr)
        out[i : i + len(tone)] += tone[: max(0, n - i)]
    with wave.open(path, "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes((np.clip(out, -1, 1) * 32767).astype(np.int16).tobytes())


def main(src, cfg_path, dst):
    cfg = json.load(open(cfg_path, encoding="utf-8"))
    cap = cv2.VideoCapture(src)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    frames = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        frames.append(f)
    total = len(frames) / fps

    tx, ty, tw, th = cfg["template"]
    ref = frames[int(cfg["ref_time"] * fps)]
    tmpl = cv2.cvtColor(ref[ty : ty + th, tx : tx + tw], cv2.COLOR_BGR2GRAY)
    search = cfg.get("search", 40)
    scale = cfg.get("scale", 1.0) * w / 1280

    # 逐格找出標籤位移
    offsets = []
    for f in frames:
        g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
        x0, y0 = max(0, tx - search), max(0, ty - search)
        win = g[y0 : min(h, ty + th + search), x0 : min(w, tx + tw + search)]
        r = cv2.matchTemplate(win, tmpl, cv2.TM_CCOEFF_NORMED)
        _, score, _, loc = cv2.minMaxLoc(r)
        offsets.append((x0 + loc[0] - tx, y0 + loc[1] - ty) if score > 0.5 else None)
    # 被手或機遮住時沿用上一個可靠位移
    last = (0, 0)
    for i, o in enumerate(offsets):
        offsets[i] = last = o if o is not None else last

    reads = cfg["reads"]
    for i, f in enumerate(frames):
        now = i / fps
        for rd in reads:
            dur = rd.get("dur", 0.45)
            if rd["t"] <= now < rd["t"] + dur:
                dx, dy = offsets[i]
                layer, a = glow_layer(h, w, rd["x"] + dx, rd["y"] + dy, scale)
                base = f.astype(np.float32)
                f[:] = np.clip(base * (1 - a[..., None] * 0.35) + layer * 0.85, 0, 255).astype(np.uint8)

    tmp_v = dst + ".video.mp4"
    tmp_a = dst + ".beep.wav"
    vw = cv2.VideoWriter(tmp_v, cv2.VideoWriter_fourcc(*"mp4v"), fps, (w, h))
    for f in frames:
        vw.write(f)
    vw.release()
    write_beeps(tmp_a, [rd["t"] + 0.05 for rd in reads], total)
    keep = cfg.get("original_audio_volume", 0.4)
    has_audio = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", src],
        capture_output=True, text=True).stdout.strip() != ""
    mix = f"[1:a]volume={keep}[o];[o][2:a]amix=inputs=2:normalize=0[a]" if has_audio else "[2:a]anull[a]"
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-y", "-i", tmp_v, "-i", src, "-i", tmp_a, "-filter_complex", mix,
         "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", dst],
        check=True,
    )
    subprocess.run(["rm", "-f", tmp_v, tmp_a])
    print(f"✓ {dst}：{len(reads)} 次讀碼")


if __name__ == "__main__":
    main(*sys.argv[1:4])
