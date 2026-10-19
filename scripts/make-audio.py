"""合成 EP01 背景音樂及音效（純程式合成，無第三方素材，無版權問題）。

輸出：
  audio/music/bgm.wav  62 秒，48 kHz 立體聲
  audio/sfx/*.wav      各種音效
用法：python3 -I scripts/make-audio.py
"""
import os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rng = np.random.default_rng(501)

# 120 BPM：1 拍 0.5 秒、1 小節 2 秒，場景切換點（8/16/28/38/48/56 秒）都在小節線上
BPM = 120
BEAT = 60 / BPM
BAR = BEAT * 4
DUR = 62.0


def t_of(sec):
    return np.arange(int(sec * SR)) / SR


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, "low", fs=SR, output="sos"), x)


def hp(x, hz, order=2):
    return sosfilt(butter(order, hz, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def env(n, a, d, s=0.0, r=0.0, hold=None):
    """ADSR（秒）；hold 為維持段長度，None 表示 attack+decay 後直接 release。"""
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    h_n = int(hold * SR) if hold is not None else 0
    e = np.concatenate([
        np.linspace(0, 1, max(a_n, 1)),
        np.linspace(1, s, max(d_n, 1)),
        np.full(h_n, s),
        np.linspace(s, 0, max(r_n, 1)),
    ])
    out = np.zeros(n)
    m = min(n, len(e))
    out[:m] = e[:m]
    return out


def saw(f, t):
    return 2 * ((f * t) % 1.0) - 1


def tri(f, t):
    return 2 * np.abs(2 * ((f * t) % 1.0) - 1) - 1


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def place(buf, x, at, gain=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    m = min(len(x), len(buf) - i)
    buf[i:i + m] += x[:m] * gain


def reverb(x, sec=2.2, mix=0.25):
    n = int(sec * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lp(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2))
    wet = fftconvolve(x, ir)[: len(x)]
    return x * (1 - mix) + wet * mix


def norm_peak(x, db):
    peak = np.max(np.abs(x)) or 1.0
    return x / peak * 10 ** (db / 20)


def write(path, x):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    wavfile.write(path, SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))


# ---------------------------------------------------------------- 音效
def sfx_beep():
    # 傳統掃描槍「嗶」：約 2.7 kHz，帶少量方波泛音
    t = t_of(0.11)
    x = np.sin(2 * np.pi * 2700 * t) + 0.25 * np.sign(np.sin(2 * np.pi * 2700 * t))
    return norm_peak(lp(x, 6000) * env(len(t), 0.003, 0.02, 0.8, 0.03, hold=0.05), -6)


def sfx_tick(note):
    # 框選提示音：短促三角波，音高由五聲音階遞增
    t = t_of(0.12)
    f = midi(note)
    x = tri(f, t) * 0.6 + np.sin(2 * np.pi * 2 * f * t) * 0.4
    return norm_peak(lp(x, 7000) * env(len(t), 0.002, 0.09), -9)


def sfx_pop():
    t = t_of(0.18)
    f = 520 * np.exp(-t * 18) + 180
    x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return norm_peak(x * env(len(t), 0.002, 0.15), -8)


def sfx_whoosh(sec=0.9, up=True):
    t = t_of(sec)
    noise = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    steps = 24
    for k in range(steps):
        a, b = k * len(t) // steps, (k + 1) * len(t) // steps
        p = k / (steps - 1)
        c = 400 + (3600 * p if up else 3600 * (1 - p))
        out[a:b] = bp(noise, c * 0.6, c * 1.4)[a:b]
    shape = np.sin(np.pi * np.linspace(0, 1, len(t))) ** 1.5
    return norm_peak(out * shape, -8)


def sfx_click(up=False):
    r = np.random.default_rng(22 if up else 21)  # 獨立種子，不影響其他音效
    # 實體按鍵：按下＝短促噪聲瞬態＋低沉機身共鳴；放開＝較輕較高
    t = t_of(0.05)
    tr = bp(r.standard_normal(len(t)), 2500 if up else 1800, 7000 if up else 5000) * env(len(t), 0.0005, 0.006)
    body = np.sin(2 * np.pi * (520 if up else 340) * t) * env(len(t), 0.001, 0.02) * 0.5
    return norm_peak(tr + body, -14 if up else -9)


def sfx_shutter():
    r = np.random.default_rng(23)
    # 相機快門：兩下機械聲相隔約 45 ms，帶少量空氣聲
    out = np.zeros(int(0.2 * SR))
    for at, g in [(0, 1.0), (0.045, 0.7)]:
        t = t_of(0.04)
        x = bp(r.standard_normal(len(t)), 1500, 9000) * env(len(t), 0.0005, 0.012)
        place(out, x, at, g)
    return norm_peak(reverb(out, 0.4, 0.12), -8)


def sfx_ui_on():
    # 螢幕亮起：兩個上行音
    a = sfx_tick(84)
    b = sfx_tick(91)
    out = np.zeros(int(0.3 * SR))
    place(out, a, 0)
    place(out, b, 0.08)
    return norm_peak(reverb(out, 0.8, 0.2), -8)


def sfx_impact():
    t = t_of(0.6)
    f = 90 * np.exp(-t * 6) + 40
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.003, 0.5)
    air = hp(rng.standard_normal(len(t)), 3000) * env(len(t), 0.001, 0.08) * 0.3
    return norm_peak(reverb(body + air, 1.2, 0.2), -6)


def sfx_confirm():
    # 偵測完成：大三和弦琶音
    out = np.zeros(int(0.9 * SR))
    for i, n in enumerate([76, 80, 83, 88]):
        place(out, sfx_tick(n), i * 0.06)
    return norm_peak(reverb(out, 1.2, 0.3), -8)


def sfx_alert():
    # 放錯位置提示：雙音下行，柔和不刺耳
    out = np.zeros(int(0.7 * SR))
    for i, n in enumerate([81, 76]):
        t = t_of(0.22)
        x = tri(midi(n), t) * env(len(t), 0.005, 0.2)
        place(out, lp(x, 4000), i * 0.18)
    return norm_peak(reverb(out, 0.8, 0.2), -7)


def sfx_chime():
    # 片尾標誌音：鐘聲和弦（FM）
    t = t_of(3.0)
    out = np.zeros(len(t))
    for n, g in [(72, 1.0), (76, 0.7), (79, 0.6), (84, 0.5)]:
        f = midi(n)
        mod = np.sin(2 * np.pi * f * 3.5 * t) * 2.0 * np.exp(-t * 3)
        out += g * np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 1.6)
    return norm_peak(reverb(out, 2.5, 0.35), -5)


# ---------------------------------------------------------------- 背景音樂
CHORDS = {  # A 小調：Am F C G（MIDI）
    "Am": [57, 60, 64], "F": [53, 57, 60], "C": [55, 60, 64], "G": [55, 59, 62],
}
ROOTS = {"Am": 45, "F": 41, "C": 48, "G": 43}
PROG = ["Am", "F", "C", "G"]


def bgm():
    n = int(DUR * SR)
    pad = np.zeros(n)
    bass = np.zeros(n)
    drums = np.zeros(n)
    pluck = np.zeros(n)
    riser = np.zeros(n)

    bars = int(DUR / BAR)
    for b in range(bars):
        start = b * BAR
        name = "C" if start >= 56 else PROG[b % 4]
        # ---- 墊音：每小節一和弦，3 聲部微走音鋸齒波
        hold = BAR if start < 56 else DUR - 56 - 1.0
        tt = t_of(hold + 0.8)
        chord = np.zeros(len(tt))
        for note in CHORDS[name] + [CHORDS[name][0] + 12]:
            for cents in (-7, 0, 7):
                chord += saw(midi(note) * 2 ** (cents / 1200), tt)
        level = 0.55 if start < 8 else 1.0
        pad_env = env(len(tt), 0.35, 0.2, 0.85, 0.8, hold=max(hold - 0.55, 0))
        place(pad, lp(chord, 900 if start < 16 else 1500) * pad_env, start, level)
        if start >= 56:
            break

        # ---- 低音：S1 長音；主段落八分音符
        root = midi(ROOTS[name])
        if start < 16:
            tt = t_of(BAR)
            place(bass, np.sin(2 * np.pi * root * tt) * env(len(tt), 0.05, 0.3, 0.7, 0.3, hold=1.3), start, 0.8)
        elif start < 48:
            for k in range(8):
                tt = t_of(BEAT / 2)
                x = (np.sin(2 * np.pi * root * tt) + 0.3 * lp(saw(root, tt), 600)) * env(len(tt), 0.005, 0.2, 0.0)
                place(bass, x, start + k * BEAT / 2, 0.9 if k % 2 == 0 else 0.6)

        # ---- 鼓：S1 只有輕微踩鑔；16–48 秒四拍底鼓；S6 去掉底鼓
        for k in range(4):
            beat_t = start + k * BEAT
            if 16 <= start < 48:
                tt = t_of(0.35)
                f = 110 * np.exp(-tt * 30) + 45
                kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, 0.33)
                place(drums, kick, beat_t, 0.9)
            if start >= 4:
                tt = t_of(0.04)
                hat = hp(rng.standard_normal(len(tt)), 7000) * env(len(tt), 0.001, 0.035)
                place(drums, hat, beat_t + BEAT / 2, 0.25 if start < 16 else 0.35)
            if 16 <= start < 48 and k in (1, 3):
                tt = t_of(0.18)
                clap = bp(rng.standard_normal(len(tt)), 900, 3500) * env(len(tt), 0.002, 0.16)
                place(drums, clap, beat_t, 0.35)

        # ---- 撥弦琶音：主段落及 S6
        if start >= 16:
            notes = CHORDS[name] + [CHORDS[name][1] + 12]
            for k in range(8):
                tt = t_of(0.3)
                f = midi(notes[k % 4] + 12)
                x = lp(saw(f, tt) * 0.5 + tri(f, tt) * 0.5, 2600) * env(len(tt), 0.003, 0.25)
                place(pluck, x, start + k * BEAT / 2, 0.5 if k % 2 == 0 else 0.35)

    # ---- S2（8–16 秒）漸強升音
    tt = t_of(8.0)
    noise = rng.standard_normal(len(tt))
    rise = np.zeros(len(tt))
    for k in range(32):
        a, b2 = k * len(tt) // 32, (k + 1) * len(tt) // 32
        c = 300 + 5000 * (k / 31) ** 2
        rise[a:b2] = bp(noise, c * 0.7, c * 1.3)[a:b2]
    rise *= np.linspace(0, 1, len(tt)) ** 2
    place(riser, rise, 8.0, 0.35)

    pad = reverb(pad, 2.5, 0.35)
    pluck = reverb(pluck, 1.8, 0.3)
    left = pad * 0.30 + bass * 0.45 + drums * 0.55 + pluck * 0.22 + riser
    right = pad * 0.30 + bass * 0.45 + drums * 0.55 + np.roll(pluck, int(0.012 * SR)) * 0.22 + riser
    mix = np.stack([left, right], axis=1)
    # 結尾 60–62 秒淡出
    fade = np.ones(n)
    fade[int(60 * SR):] = np.linspace(1, 0, n - int(60 * SR))
    mix *= fade[:, None]
    return norm_peak(mix, -3)


def main():
    write(os.path.join(ROOT, "audio/music/bgm.wav"), bgm())
    sfx = {
        "beep": sfx_beep(),
        "pop": sfx_pop(),
        "whoosh": sfx_whoosh(0.9, True),
        "whoosh-down": sfx_whoosh(0.7, False),
        "ui-on": sfx_ui_on(),
        "impact": sfx_impact(),
        "confirm": sfx_confirm(),
        "alert": sfx_alert(),
        "chime": sfx_chime(),
    }
    for i, note in enumerate([72, 74, 76, 79, 81, 84]):
        sfx[f"tick-{i}"] = sfx_tick(note)
    # 第 5.2 版新增（放在最後，避免改變共用亂數序列而令舊音效變動）
    sfx["click"] = sfx_click()
    sfx["click-up"] = sfx_click(up=True)
    sfx["shutter"] = sfx_shutter()
    for name, x in sfx.items():
        write(os.path.join(ROOT, f"audio/sfx/{name}.wav"), x)
    print(f"✓ audio/music/bgm.wav（{DUR:.0f} 秒）＋ {len(sfx)} 個音效")


if __name__ == "__main__":
    main()
