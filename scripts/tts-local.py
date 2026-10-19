# 離線普通話旁白（試聽稿）：用 PyPI 套件 zhtts 內附的 FastSpeech2 + MB-MelGAN 模型（標貝女聲），
# 按 src/generated/content.json 的簡體字幕逐句合成，每句放在字幕開始時間，太長就加快語速塞進字幕窗口。
# 輸出 audio/vo.wav（48 kHz 單聲道，62 秒）。
#
# 安裝（不需要 TensorFlow，用 LiteRT 執行 tflite）：
#   python3 -m venv .venv-tts && .venv-tts/bin/pip install ai-edge-litert pypinyin numpy scipy && .venv-tts/bin/pip install --no-deps zhtts==0.0.1
#   .venv-tts/bin/python -I scripts/tts-local.py
#
# 注意：模型由標貝（DataBaker）中文標準女聲音庫訓練，該音庫的授權條款未核實（可能僅限非商業用途），
# 對外發佈前請改用 Azure（scripts/tts-azure.mjs）或真人配音。
import importlib.util
import json
import re
import sys
from pathlib import Path

import numpy as np
from ai_edge_litert import schema_py_generated as S
from ai_edge_litert.interpreter import Interpreter
from scipy.io import wavfile
from scipy.signal import resample_poly

ROOT = Path(__file__).resolve().parent.parent
PKG = Path(importlib.util.find_spec("zhtts").submodule_search_locations[0])
sys.path.insert(0, str(PKG))  # 只借用 zhtts 的文字前端（拼音、數字讀法）和模型檔，推理自己做
from tensorflow_tts.processor import BakerProcessor  # noqa: E402

SR_MODEL, SR_OUT = 24000, 48000
GAP = 0.12        # 下一句開始前最少留白（秒）
MIN_SPEED = 0.78  # speed_ratio 是時長倍數，再低（更快）會含糊
PAUSE = 0.14      # 句內逗號停頓

# 只改「讀法」，字幕不變：模型只懂漢語拼音，英文字母和品牌名用近音字代讀
SAY = [
    (r"Zebra", "泽布拉"),
    (r"TC501", "提西五零一"),
    (r"\bAI\b", "诶爱"),
    (r"\bApp\b", "爱普"),
    # pypinyin 讀錯的字：一的變調、輕聲「得」、框讀第四聲（同音字代入，只影響讀音）
    (r"对得上", "对的上"),
    (r"一目了然", "宜目了然"),
    (r"拍一下", "拍宜下"),
    (r"框选", "况选"),
]



def inference_mode(path: Path) -> bytes:
    """FastSpeech2 模型在轉換時留下了訓練用的 dropout：x * (1/(1-p)) * (RandomUniform >= p)。
    RandomUniform 是 Flex 運算，LiteRT 不支援。這裡在記憶體中把它改成推理時的等價形式：
    遮罩改為 FILL(shape, 1.0)，縮放常數 1/(1-p) 改為 1.0，即 x 原樣通過（與 Keras training=False 相同）。
    不改動磁碟上的模型檔。"""
    m = S.ModelT.InitFromObj(S.Model.GetRootAsModel(path.read_bytes(), 0))
    g = m.subgraphs[0]
    flex = [i for i, oc in enumerate(m.operatorCodes) if oc.customCode == b"FlexRandomUniform"]
    if not flex:
        return path.read_bytes()
    fill = S.OperatorCodeT()
    fill.builtinCode = fill.deprecatedBuiltinCode = S.BuiltinOperator.FILL
    fill.version = 1
    m.operatorCodes.append(fill)
    one = None
    for i, op in enumerate(g.operators):
        if op.opcodeIndex not in flex:
            continue
        mask, = op.outputs
        ge = next(o for o in g.operators if mask in list(o.inputs))  # GREATER_EQUAL(mask, p)
        cast = next(o for o in g.operators if ge.outputs[0] in list(o.inputs))
        apply = next(o for o in g.operators if cast.outputs[0] in list(o.inputs))  # MUL(x * scale, mask)
        scaled = next(o for o in g.operators if apply.inputs[0] in list(o.outputs))  # MUL(x, scale)
        scale = scaled.inputs[1]
        m.buffers[g.tensors[scale].buffer].data = np.frombuffer(np.float32(1.0).tobytes(), np.uint8)
        one = scale
        op.opcodeIndex = len(m.operatorCodes) - 1
        op.inputs = np.array([op.inputs[0], one], np.int32)
        op.customOptions = None
        op.builtinOptionsType = S.BuiltinOptions.FillOptions
        op.builtinOptions = S.FillOptionsT()
    import flatbuffers
    b = flatbuffers.Builder(0)
    b.Finish(m.Pack(b), file_identifier=b"TFL3")
    return bytes(b.Output())


proc = BakerProcessor(data_dir=None, loaded_mapper_path=PKG / "asset" / "baker_mapper.json")
acoustic = Interpreter(model_content=inference_mode(PKG / "asset" / "fastspeech2_quan.tflite"))
vocoder = Interpreter(model_path=str(PKG / "asset" / "mb_melgan.tflite"))


def speak(text: str, speed: float) -> np.ndarray:
    ids = np.array([proc.text_to_sequence(text, inference=True)], np.int32)
    inp = acoustic.get_input_details()
    acoustic.resize_tensor_input(inp[0]["index"], ids.shape)
    acoustic.allocate_tensors()
    for d, v in zip(inp, [ids, np.array([0], np.int32), np.array([speed], np.float32),
                          np.array([1.0], np.float32), np.array([1.0], np.float32)]):
        acoustic.set_tensor(d["index"], v)
    acoustic.invoke()
    mel = acoustic.get_tensor(acoustic.get_output_details()[1]["index"])
    vin = vocoder.get_input_details()[0]
    vocoder.resize_tensor_input(vin["index"], mel.shape)
    vocoder.allocate_tensors()
    vocoder.set_tensor(vin["index"], mel)
    vocoder.invoke()
    return vocoder.get_tensor(vocoder.get_output_details()[0]["index"])[0, :, 0]


def trim(a: np.ndarray, thr=0.01) -> np.ndarray:
    idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0:
        return a
    pad = int(0.02 * SR_MODEL)
    return a[max(0, idx[0] - pad): idx[-1] + pad]


def phrase(text: str, speed: float) -> np.ndarray:
    for pat, rep in SAY:
        text = re.sub(pat, rep, text)
    parts = [p for p in re.split(r"[，、。！？\s]+", text) if p]
    out = []
    for i, p in enumerate(parts):
        out.append(trim(speak(p, speed)))
        if i < len(parts) - 1:
            out.append(np.zeros(int(PAUSE * speed * SR_MODEL), np.float32))
    return np.concatenate(out)


content = json.loads((ROOT / "src/generated/content.json").read_text("utf8"))
dur = content["durationSec"]
cues = [(c, s["end"]) for s in content["hans"]["scenes"] for c in s["subs"]]
track = np.zeros(int(dur * SR_MODEL) + SR_MODEL, np.float32)
report = []
prev_end = 0.0
for i, (c, scene_end) in enumerate(cues):
    nxt = cues[i + 1][0]["start"] if i + 1 < len(cues) else scene_end
    window = min(nxt, scene_end) - c["start"] - GAP
    a = phrase(c["text"], 1.0)
    speed = 1.0
    if len(a) / SR_MODEL > window:
        speed = max(MIN_SPEED, window / (len(a) / SR_MODEL))
        a = phrase(c["text"], speed)
    # 上一句仍未說完就順延（最多約 0.2 秒），避免兩句重疊
    at = max(c["start"], prev_end + GAP)
    start = int(at * SR_MODEL)
    track[start:start + len(a)] += a
    prev_end = at + len(a) / SR_MODEL
    report.append((at, round(len(a) / SR_MODEL, 2), round(window, 2), round(speed, 2), c["text"]))
    if prev_end > scene_end:
        print(f"⚠ {c['start']}s 超出場景結尾 {prev_end - scene_end:.2f}s：{c['text']}")

track = track[: int(dur * SR_MODEL)]
track *= 10 ** (-1.5 / 20) / max(1e-6, np.abs(track).max())  # 峰值 -1.5 dBFS
out = resample_poly(track, SR_OUT, SR_MODEL).astype(np.float32)
(ROOT / "audio").mkdir(exist_ok=True)
wavfile.write(ROOT / "audio/vo.wav", SR_OUT, (np.clip(out, -1, 1) * 32767).astype(np.int16))
for r in report:
    print(f"{r[0]:5.1f}s  長 {r[1]:4.2f}s / 窗 {r[2]:4.2f}s  速 {r[3]:.2f}  {r[4]}")
print("✓ audio/vo.wav")
