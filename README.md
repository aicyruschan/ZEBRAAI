# Zebra TC501 · AI 條碼解碼器 · EP01（62 秒）

用 Remotion（React）**以程式碼繪製的動態圖形片**，不使用任何像素生成模型（Kling、Sora 等）。輸出 1920×1080、30fps：
- `out/tc501-ep01-barcode.mp4`（燒入繁體字幕）
- `out/tc501-ep01-barcode-hans.mp4`（燒入簡體字幕）

## 目錄
| 路徑 | 內容 |
|---|---|
| `content/script.json` | **唯一內容來源**：旁白、字幕時間、畫面文字、示範結果（繁體） |
| `brand/brand.json` | 品牌值及來源。影片只讀 `render` 區塊 |
| `research/facts.md`、`research/selfcheck.md` | 事實清單、渲染前自我檢查 |
| `src/data/pallet.ts` | 收貨區「世界座標」：棧板 12 箱、28 個條碼、收貨單、鏡頭換算 |
| `src/components/PalletWorld.tsx` | 程式繪製的收貨區場景 |
| `src/components/Device.tsx`、`CameraScreen.tsx` | TC501 官方渲染圖＋螢幕內的 App 示意畫面 |
| `src/components/Overlays.tsx` | 綠色條碼框（已讀取）、整箱勾號（與收貨單對得上） |
| `src/scenes/S1Pain … S7Outro.tsx` | 每個場景一個組件 |
| `assets/products/tc501/` | TC501 官方渲染圖（S2、S6、S7 使用） |
| `assets/brand/logo.png` | Zebra 官方標誌（用戶提供，已轉透明背景；也可換成 `logo.svg`） |
| `audio/music/bgm.wav`、`audio/sfx/` | 程式合成的背景音樂及音效（`scripts/make-audio.py`） |
| `src/components/Sfx.tsx` | 音效組件；各場景用自己的動畫計時觸發，確保音畫同步 |
| `subs/`、`audio/script.txt` | 雙字幕、TTS 旁白稿（自動生成） |

## 常用指令
```bash
npm install
npm run prep          # 護欄檢查 + 生成簡體、字幕、旁白稿、字型子集、媒體清單
npm run dev           # Remotion Studio 預覽
npm run render        # 繁體版
npm run render:hans   # 簡體版
```
`prep` 不通過就不會渲染。它會攔截：
- 禁用詞
- 暗示 TC53 不支援的句子
- 距離、速度、準確率數字
- 字幕與旁白不一致

> 雲端容器渲染時要加 `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`，本機不需要。

## 改畫面
- **貨物及收貨單**：編輯 `src/data/pallet.ts`（`COLS`、`TIERS`、`ORDER`）。條碼數和箱數會自動反映在畫面計數上。
- **鏡頭**：`CLOSE`（S1 特寫）、`SPLIT`（S2–S5 左側實景）、`screenCam`（TC501 螢幕內畫面）。
- **TC501 去背圖**：`assets/products/tc501/2-cutout.png` 由 `2.jpg` 以 flood fill 去白底生成。

## 音樂及音效
- 全部以 numpy/scipy 程式合成，**沒有第三方素材，不涉版權**。
- BGM 為 120 BPM、A 小調（Am–F–C–G）。每小節 2 秒，場景切換點都落在小節線上。
- 段落安排：
  - S1：低調墊音
  - S2：漸強升音
  - S3–S5：主段落
  - S6：去掉底鼓
  - S7：C 大調收結並淡出
- 重新生成：`python3 -I scripts/make-audio.py && npm run prep`（需要 `pip install numpy scipy`）。
- 音量在 `src/Video.tsx`：`BGM_LEVEL`（無旁白時 0.75，全片約 -16 LUFS）、`BGM_DUCKED`（有 `audio/vo.wav` 時，旁白區段自動壓到 0.3）。
- 各音效的音量在對應場景的 `<Sfx volume>` 調整。
- 想改用商用曲庫音樂：把 `audio/music/bgm.wav` 換成授權音樂即可（長度 62 秒）。

## 修改旁白
1. 修改 `content/script.json` 的 `narration` 和 `subs`（兩者拼合後必須一致）。
2. 有 Azure 金鑰時：`AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=eastasia npm run tts`，生成 `audio/vo.wav`。腳本未實測。
3. 沒有金鑰時：把配音存為 `audio/vo.wav`（62 秒，按 `audio/script.txt` 的開始秒數對齊）。
4. `npm run prep && npm run render`。

## 修改品牌
只改 `brand/brand.json` → `render`。目前全部值都是 **unverified**：
- 主色 #0073E6 來自搜尋摘要
- Noto Sans 是 Proxima Nova 的替代字體
