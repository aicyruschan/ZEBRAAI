"""自動追蹤 Kling 片段中的白色收貨標籤，供 TC501 螢幕上的綠框對齊實景。

做法：逐格把低飽和、高亮度區域（白色標籤）找出來 → 按面積、長寬比、填充率篩選 →
以最近距離配對成穩定的追蹤 ID → 移動平均平滑 → 去掉太短的軌跡。

用法：python3 -I scripts/track-labels.py assets/clips/r3.mp4 [更多片段…]
輸出：assets/clips/r3.labels.json（座標以片段寬高歸一化，0–1）
"""
import json
import sys

import cv2
import numpy as np

MIN_TRACK_RATIO = 0.3  # 軌跡至少要出現在 30% 的格數
SMOOTH = 5  # 移動平均窗口（格）


def detect(frame):
    h, w = frame.shape[:2]
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    mask = cv2.inRange(hsv, (0, 0, 185), (180, 45, 255))
    k = max(3, w // 480)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((k * 3, k * 3), np.uint8))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((k, k), np.uint8))
    # RETR_CCOMP：白色牆面等大區塊的「洞」裏面的標籤仍算頂層輪廓；只取沒有父輪廓的（白色區塊外框）
    contours, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    boxes = []
    for i, c in enumerate(contours):
        if hier is not None and hier[0][i][3] != -1:
            continue
        x, y, bw, bh = cv2.boundingRect(c)
        area = bw * bh
        if not (0.0008 * w * h <= area <= 0.04 * w * h):
            continue
        ratio = bw / bh
        if not (0.7 <= ratio <= 2.6):
            continue
        if cv2.contourArea(c) / area < 0.7:
            continue
        boxes.append((x / w, y / h, bw / w, bh / h))
    if boxes:
        # 去掉明顯比典型標籤小很多的白色區塊（例如 QR 小貼紙、反光）
        med = np.median([b[2] * b[3] for b in boxes])
        boxes = [b for b in boxes if b[2] * b[3] >= 0.45 * med]
    return boxes


def track(per_frame):
    tracks = []  # {id, boxes: {frame: box}}
    next_id = 0
    for f, boxes in enumerate(per_frame):
        used = set()
        live = [t for t in tracks if f - t["last"] <= 5]
        pairs = []
        for ti, t in enumerate(live):
            px, py, pw, ph = t["boxes"][t["last"]]
            for bi, (x, y, w, h) in enumerate(boxes):
                d = np.hypot((x + w / 2) - (px + pw / 2), (y + h / 2) - (py + ph / 2))
                if d < max(pw, ph) * 0.8:
                    pairs.append((d, ti, bi))
        taken_t = set()
        for d, ti, bi in sorted(pairs):
            if ti in taken_t or bi in used:
                continue
            live[ti]["boxes"][f] = boxes[bi]
            live[ti]["last"] = f
            taken_t.add(ti)
            used.add(bi)
        for bi, b in enumerate(boxes):
            if bi not in used:
                tracks.append({"id": next_id, "boxes": {f: b}, "last": f})
                next_id += 1
    n = len(per_frame)
    return [t for t in tracks if len(t["boxes"]) >= MIN_TRACK_RATIO * n]


def fill_and_smooth(t, n):
    frames = sorted(t["boxes"])
    arr = np.full((n, 4), np.nan)
    for f in frames:
        arr[f] = t["boxes"][f]
    # 線性補洞（只在首尾出現範圍內）
    idx = np.arange(n)
    for j in range(4):
        valid = ~np.isnan(arr[:, j])
        arr[frames[0]:frames[-1] + 1, j] = np.interp(idx[frames[0]:frames[-1] + 1], idx[valid], arr[valid, j])
    kernel = np.ones(SMOOTH) / SMOOTH
    for j in range(4):
        seg = arr[frames[0]:frames[-1] + 1, j]
        if len(seg) >= SMOOTH:
            padded = np.pad(seg, SMOOTH // 2, mode="edge")
            arr[frames[0]:frames[-1] + 1, j] = np.convolve(padded, kernel, mode="valid")
    return arr


def process(path):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    per_frame = []
    w = h = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break
        h, w = frame.shape[:2]
        per_frame.append(detect(frame))
    cap.release()
    n = len(per_frame)
    if n == 0:
        raise SystemExit(f"讀不到影格：{path}")
    tracks = track(per_frame)
    # 依首次出現時的位置排序（由上而下、由左至右），重新編號
    def first_pos(t):
        f0 = min(t["boxes"])
        x, y, bw, bh = t["boxes"][f0]
        return (round((y + bh / 2) * 8), x)

    tracks.sort(key=first_pos)
    labels = []
    for i, t in enumerate(tracks):
        arr = fill_and_smooth(t, n)
        labels.append({
            "id": i,
            "frames": [None if np.isnan(r[0]) else [round(float(v), 5) for v in r] for r in arr],
        })
    out = path.rsplit(".", 1)[0] + ".labels.json"
    with open(out, "w") as fh:
        json.dump({"fps": fps, "width": w, "height": h, "frameCount": n, "labels": labels}, fh)
    counts = [len(b) for b in per_frame]
    print(f"✓ {out}：{n} 格，追蹤到 {len(labels)} 個標籤（單格偵測數 中位 {int(np.median(counts))}，最少 {min(counts)}，最多 {max(counts)}）")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    for p in sys.argv[1:]:
        process(p)
