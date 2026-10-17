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
| `src/data/shelf.ts` | 貨架「世界座標」：26 件貨品及條碼位置、鏡頭換算 |
| `src/components/ShelfWorld.tsx` | 程式繪製的貨架場景 |
| `src/components/BarcodeBox.tsx` | 邊界框（由世界座標經鏡頭換算，永遠對齊條碼） |
| `src/scenes/S1Pain … S7Outro.tsx` | 每個場景一個組件 |
| `assets/products/tc501/` | TC501 官方渲染圖（S2、S6、S7 使用） |
| `assets/brand/logo.svg` | 官方標誌（放入後自動取代占位框） |
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
- **貨品陳設**：編輯 `src/data/shelf.ts` 的 `items`。廣角鏡頭 `WIDE` 下可見的條碼數會自動成為 S3 的「偵測到 N 個條碼」，請同步確認旁白。
- **鏡頭運動**：
  - S1 特寫：`CLOSE`（`S1Pain.tsx`）
  - S4 平移終點：`PAN_END`（`S4Track.tsx`）
- **放錯位置的商品**：`MISPLACED_ID`。

## 修改旁白
1. 修改 `content/script.json` 的 `narration` 和 `subs`（兩者拼合後必須一致）。
2. 有 Azure 金鑰時：`AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=eastasia npm run tts`，生成 `audio/vo.wav`。腳本未實測。
3. 沒有金鑰時：把配音存為 `audio/vo.wav`（62 秒，按 `audio/script.txt` 的開始秒數對齊）。
4. `npm run prep && npm run render`。

## 修改品牌
只改 `brand/brand.json` → `render`。目前全部值都是 **unverified**：
- 主色 #0073E6 來自搜尋摘要
- Noto Sans 是 Proxima Nova 的替代字體
