# TC501 EP01：事實清單（研究日期 2026-10-17）

> 狀態：zebra.com 和 techdocs.zebra.com 被本雲端環境的網絡政策封鎖。
> 以下「證據」欄全部來自搜尋引擎對官方頁面的摘要，**並非直接讀取原文**。
> 等級：A = 官方網域的摘要，內容與你的護欄一致；B = 只有第三方來源；C = 未找到。

## 1. AI 條碼解碼器（Barcode Decoder）

| # | 事實 | 等級 | 來源 |
|---|---|---|---|
| F1 | Barcode Decoder（前稱 Barcode Localizer），v5.0.3 起把偵測與解碼合併為一步 | A | https://techdocs.zebra.com/ai-datacapture/4-0/model/barcode-localizer/ |
| F2 | 可在單張影像中偵測並解碼 1D 及 2D 條碼 | A | 同上 |
| F3 | 每個條碼輸出邊界框（left/top/right/bottom，像素座標） | A | https://techdocs.zebra.com/ai-datacapture/3-1/entity/ |
| F4 | QC6490：TC53、TC58、TC73、TC78、ET60、ET65；Q-6690：TC501、TC701 | A | https://techdocs.zebra.com/ai-datacapture/4-0/model/barcode-localizer/ |
| F5 | 需要 AI Data Capture SDK 4.0.0 或以上 | A | 同上 |
| F6 | 支援的條碼類型清單（UPC/EAN、DM、QR、PDF417、Aztec） | **C** | 摘要只提到「Supported Barcode Symbologies」頁，具體清單未讀到 |
| F7 | 較大的輸入影像能提高小型或遠距離物件的偵測準確度 | **B** | 只在 Zebra 開發者部落格找到類似說法（https://developer.zebra.com/blog/practical-guide-zebra-frontline-ai-enablers），techdocs 原句未讀到 |
| F8 | EntityTrackerAnalyzer：CameraX 即時偵測、解碼、追蹤，並分配持續 ID（支持 S4「框選跟隨」） | A | https://techdocs.zebra.com/ai-datacapture/4-0/about/ 、 https://techdocs.zebra.com/ai-datacapture/latest/camerax/ |
| F9 | 官方頁有效能表（偵測/解碼時間、30 cm 最大距離） | — | 未讀到。按護欄，影片**不使用**任何相關數字 |

## 2. TC501 / TC53 規格

| # | 事實 | 等級 | 來源 |
|---|---|---|---|
| F10 | TC501 後鏡 50MP（PDAF）；可選 13MP 超廣角後鏡；前鏡 8MP | A | https://www.zebra.com/content/dam/zebra_dam/en/spec-sheets/tc501-spec-sheet-en-us.pdf |
| F11 | TC501 為 6.0 吋 AMOLED，2160×1080；**600 nits 典型、1000 nits HBM、1500 nits 峰值** | A | 同上 |
| F12 | TC501 晶片：Qualcomm Dragonwing Q-6690 | A | 同上 |
| F13 | TC53 後鏡 16MP | **C** | 本輪未核實，需讀 TC53 spec sheet |

## 3. 我發現的護欄 / 稿件問題（需你決定）

1. **1500 nits 是峰值**（F11）。寫成「1500 nits」會被誤讀為持續亮度，應寫「峰值 1500 nits」。目前這個數字不在旁白和畫面中，只影響護欄文件本身。
2. **S3「找出畫面中所有…條碼」**：「所有」接近絕對化用詞，等於暗示 100%，與護欄有衝突。建議改為「自動找出畫面中的一維和二維條碼」。
3. **S5「放錯位置」**：Barcode Decoder 只輸出條碼內容和邊界框；判斷「放錯位置」要靠 App 端的比對邏輯，例如與貨架圖對照。建議旁白加入「配合 App」，例如「配合 App，放錯位置的商品直接在畫面標示」，否則觀眾會以為這是內建功能。
4. **S6「畫面細節更多」**：比較的是像素數（16MP vs 50MP），屬客觀規格；「細節更多」是推論。建議改為「TC501 配備五千萬像素主相機」，或者接上 F7 的官方原句（F7 要先核實到 A 級）。
5. F6 的具體條碼類型清單和 F13（TC53 16MP）都未核實，渲染前要補上。

## 4. 無法完成的研究項目
- 首頁、TC501 頁、AI 軟件頁的 HTML/CSS：被封鎖，按鈕和標題樣式全部 unverified
- TC501 / TC53 官方產品圖下載：被封鎖，`assets/products/` 目前是空的
- `assets/products/tc501/`：你的 5 張渲染圖尚未放入
