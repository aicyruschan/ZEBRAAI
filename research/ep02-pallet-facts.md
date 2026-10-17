# EP02「棧板收貨」研究筆記（2026-10-17，未開始製作）

> zebra.com 和 techdocs.zebra.com 仍被本環境封鎖。以下全部來自搜尋摘要，等級標準同 facts.md。

| # | 事實 | 等級 | 來源 |
|---|---|---|---|
| P1 | SDK 有 Pallet and Box Localizer 模型（v1.0.5） | A | https://techdocs.zebra.com/ai-datacapture/latest/setup/ |
| P2 | Showcase App 有「AI Pallet Checker (Beta)」：定位棧板紙箱、解碼條碼、核對箱級庫存 | A | https://techdocs.zebra.com/showcase-app/latest/usage-ai/ |
| P3 | EntityTrackerAnalyzer 跨幀追蹤並分配同一 ID | A | https://techdocs.zebra.com/ai-datacapture/4-0/about/ |
| P4 | Showcase 示範需要 Android 14 或以上；建議使用有 DSP 的設備 | A | https://techdocs.zebra.com/showcase-app/latest/about/ |
| P5 | 「同一箱兩個條碼自動綁定」的具體 API 及做法 | **C** | 未找到官方說明；原片只是示範效果 |
| P6 | Pallet Checker 是 **Beta**，影片需要註明 | A | 同 P2 |

## 參考稿中不可沿用的說法（違反 EP01 護欄）
100% Match、零雲端延遲、毫秒級、4 倍以上細節、絕不漏掃、最高等級隱私、IP68 / 2.4 米抗摔（未核實），以及把 Localizer 和 Decoder 寫成兩個並列功能。
