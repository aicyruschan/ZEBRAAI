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
| `src/data/pallet.ts` | 收貨區「世界座標」：棧板 12 箱、每箱一張多條碼標籤（`LABEL` 版式：4 條一維＋1 個 Data Matrix，共 60 個條碼）、收貨單、鏡頭換算 |
| `src/components/PalletWorld.tsx` | 程式繪製的收貨區場景 |
| `src/components/Device.tsx`、`CameraScreen.tsx` | TC501 官方渲染圖＋螢幕內的 App 示意畫面 |
| `src/components/Overlays.tsx` | 綠色條碼框（已讀取）、標籤勾號（整張標籤讀完）、整箱勾號（與收貨單對得上） |
| `src/components/TC22Device.tsx` | S1 的 TC22（官方正面渲染圖去背＋右手握持，拇指按黃色掃描鍵，螢幕為掃描 App 示意） |
| `src/components/HeroBackdrop.tsx` | S6、S7 的產品舞台背景 |
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

## 寫實版（AI 寫實片段：Veo 或 Kling）
- **建議流程：Gemini／Veo 手動生成**
  1. 按 `prompts/gemini-10s.md`（第 2 版）逐段生成 R1–R5（每段 10 秒；Gem 設定見 `prompts/gemini-gem.md`）
  2. 下載後存為 `assets/clips/r1.mp4` … `r5.mp4`
  3. 執行 `python3 -I scripts/track-labels.py assets/clips/r3.mp4 assets/clips/r4.mp4 assets/clips/r5.mp4 && npm run render:real`
- **Kling API 自動生成（備用）**：見下文，需要 API 資源包。

- Composition：`TC501-EP01-Real`（繁）、`TC501-EP01-Real-Hans`（簡）。
- 與動態圖形版共用旁白、字幕、TC501 螢幕示意、收貨單、S6、S7 和音樂。分別在於：
  - S1–S5 背景改用 Kling 片段
  - 片尾加「部分畫面由 AI 生成」
- 步驟：
  1. 按 `prompts/gemini-10s.md` 生成 R1–R5，存為 `assets/clips/r1.mp4` … `r5.mp4`
  2. 執行 `npm run render:real`

  缺少的片段顯示灰色占位。片段比場景短時會自動放慢播放（需要 ffprobe）。
- 片段會被靜音，聲音由合成 BGM 和音效負責。
- **批量生成**：`KLING_API_KEY=... npm run kling -- --only r3`（不加 `--only` 即生成全部；`--dry-run` 只輸出請求）。設定在 `prompts/kling-shots.json`。npm script 已加 `NODE_USE_ENV_PROXY=1`，讓 Node fetch 經雲端環境的代理連線。
- **API 格式已驗證**（2026-10-18，零餘額帳戶）：`POST /v1/videos/omni-video`，`model_name: kling-v3-omni`，參考圖用 `image_list[].image_url`（base64）。
- **螢幕實景**：`python3 -I scripts/track-labels.py assets/clips/r3.mp4 …` 用 OpenCV 追蹤白色收貨標籤，輸出 `rN.labels.json`。
  - 寫實版的 TC501 螢幕會顯示同一段片段的直向裁切，綠框按追蹤結果貼在標籤上
  - 開發測試用 Composition：`Dev-TrackerTest`

## 改畫面
- **貨物及收貨單**：編輯 `src/data/pallet.ts`（`COLS`、`TIERS`、`ORDER`）。條碼數和箱數會自動反映在畫面計數上。
- **讀碼規則**：S1 的 TC22 逐個條碼讀（`S1Pain.tsx` 的 `READS`）；S3 的 TC501 全部條碼同一刻出綠框（`READ_AT`），再出勾號（`TICK_AT`）。
- **鏡頭**：`CLOSE`（S1 特寫，對準 `TARGET_CARTON` 的標籤）、`SPLIT`（S2–S5 左側實景）、`screenCam`（TC501 螢幕內畫面）。
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
- **音效對齊讀碼動作**（時間直接取自動畫常數，改動畫時會自動跟隨）：

  | 場景 | 動作 | 音效 |
  |---|---|---|
  | S1 TC22 | 拇指按到底（`at(k) - 0.04`） | `click` |
  | S1 TC22 | 解碼成功、計數 +1（`at(k)`） | `beep`（共 5 聲，每個條碼一聲） |
  | S1 TC22 | 拇指放開（`at(k) + 0.24`） | `click-up` |
  | S3 TC501 | 背面相機拍一下，60 個綠框同時出現（`READ_AT`） | `shutter` → `beep`（只有 1 聲）→ `ui-on` |
  | S3 TC501 | 每張標籤出勾號（`TICK_AT`） | `confirm` |
  | S4 / S5 | 清單逐行出現／逐箱與收貨單對得上 | `pop` ／ `tick-0…5`＋`confirm` |
- 想改用商用曲庫音樂：把 `audio/music/bgm.wav` 換成授權音樂即可（長度 62 秒）。

## 修改旁白
1. 修改 `content/script.json` 的 `narration` 和 `subs`（兩者拼合後必須一致）。
2. 生成 `audio/vo.wav`（三選一）：
   - **離線試聽稿**（目前檔案即由此生成）：`npm run tts:local`。
     - 用 PyPI 套件 zhtts 內附的 FastSpeech2 模型（標貝女聲），逐句按字幕開始時間放置，太長會自動加快語速。
     - 英文字用近音字代讀：Zebra → 泽布拉，TC501 → 提西五零一，AI → 诶爱，App → 爱普。只影響讀音，字幕不變。
     - 安裝步驟見 `scripts/tts-local.py` 檔頭（需要 tensorflow-cpu）。
     - ⚠ 訓練音庫的授權條款未核實，可能僅限非商業用途。**對外發佈前必須換成下面兩種之一。**
   - Azure：`AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=eastasia npm run tts`。腳本未實測。
   - 真人配音：存為 `audio/vo.wav`（62 秒，按 `audio/script.txt` 的開始秒數對齊）。
4. `npm run prep && npm run render`。

## 修改品牌
只改 `brand/brand.json` → `render`。目前全部值都是 **unverified**：
- 主色 #0073E6 來自搜尋摘要
- Noto Sans 是 Proxima Nova 的替代字體
