# 渲染前自我檢查（第 8 節）· 2026-10-17（第 3 版：棧板「同時讀取＋收貨單核對」示範、刪去片尾聲明）

## A. 事實護欄逐條核對
| 護欄 | 結果 | 說明 |
|---|---|---|
| 不得說或暗示 TC53 做不到 AI 解碼 | ✅ | 已按用戶決定取消 TC53 對比，影片中不再提及 TC53；regex 攔截仍保留 |
| 不得用最快、最安全、100% 準確等字眼 | ✅ | 自動攔截。另刪去原稿 S3 的「所有」 |
| 不得編造距離、速度、準確率 | ✅ | 影片中的數字只有 50MP / 13MP（規格表），以及示範計數 28 個條碼、12 箱。SKU、數量、收貨單號均為虛構（DEMO-…、PO-DEMO-1017） |
| UI 示範畫面角落標「示意畫面」 | ✅ | S1、S2（螢幕亮起後）、S3、S4、S5 右上角 |
| 片尾小字「部分畫面由 AI 生成」 | 已按用戶決定刪去 | 全片已沒有 AI 生成的寫實畫面（全部為程式繪製及官方產品渲染圖），刪去後陳述仍然準確 |
| 兩岸用詞 | ✅ | 自動攔截禁用詞 |
| 邊界框樣式 | ⚠ 按用戶新要求調整 | 改為綠色（取自 TC501 機身強調色 #7CD641）：外框＝已讀取，填充＋勾號＝與收貨單對得上。TC501 螢幕上框太小，沒有逐框標 1D/QR |
| 色彩、字型取自 brand.json | ✅（值未核實） | 全部來自 `brand.render`，值本身是 unverified |

## B. 每句旁白的官方來源
| 場景 | 旁白（修訂版） | 來源 | 核實等級 |
|---|---|---|---|
| S1 | 貨架上、包裹上、標籤上，到處都是條碼。傳統做法，只能一個一個掃。（用戶選用原稿） | 情境描述。⚠ Zebra 部分掃描器支援多條碼模式，「只能」可被反駁 | — |
| S2 | 現在，用 Zebra TC501 拍一下就好。 | https://techdocs.zebra.com/ai-datacapture/4-0/model/barcode-localizer/ （TC501 列於 Q-6690 支援機型） | A（搜尋摘要） |
| S3 | AI 條碼解碼器自動找出畫面中的一維和二維條碼，逐一框選，同時解碼。 | 同上（1D/2D、偵測加解碼一步）；https://techdocs.zebra.com/ai-datacapture/3-1/entity/ （邊界框） | A（搜尋摘要） |
| S4 | 鏡頭移動，框選即時跟隨，結果馬上列出。 | https://techdocs.zebra.com/ai-datacapture/4-0/about/ 、 https://techdocs.zebra.com/ai-datacapture/latest/camerax/ （EntityTrackerAnalyzer 即時追蹤） | A（搜尋摘要） |
| S5 | 配合 App 與收貨單比對，對得上的貨物即時變綠，收貨一目了然。 | 條碼解碼：同 S3。「與收貨單比對」屬 App 端邏輯，旁白已寫明「配合 App」。官方 Showcase 有「AI Pallet Checker (Beta)」箱級核對示範：https://techdocs.zebra.com/showcase-app/latest/usage-ai/ | A / 推論 |
| S6 | TC501 配備五千萬像素主相機，並可選配一千三百萬像素超廣角後鏡頭。 | https://www.zebra.com/content/dam/zebra_dam/en/spec-sheets/tc501-spec-sheet-en-us.pdf （50MP 後鏡；可選 13MP 超廣角） | A（搜尋摘要） |
| S7 | Zebra TC501，讓 AI 走到第一線。 | 品牌標語 | — |

**限制：** zebra.com 和 techdocs.zebra.com 被本環境封鎖。以上「A」級都是官方網址的搜尋摘要，**並未直接打開原文逐字核對**。發佈前應由人工打開每個 URL 確認。
