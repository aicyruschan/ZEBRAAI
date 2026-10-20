# TC501 EP01：Gemini 影片生成 Prompt（每段 10 秒）· 第 12 版

> 2026-10-20 重寫。**R1 以用戶認可的首格圖 `assets/frames/r1-first-frame.jpg` 為準**，包括拍攝角度、棧板、箱數、標籤位置和 TC22 握法。R2–R5 沿用同一個棧板。舊版改動紀錄見文末。

## 核心規則（所有片段都適用）
| 項目 | 規則 |
|---|---|
| 場景 | 與 `r1-first-frame.jpg` 相同：從工人右肩後方高位拍；黑色膠卡板上放素色啡紙箱，3 箱闊、3 層高、2 箱深（正面 9 箱） |
| 標籤 | 同一批貨，**正面 9 箱全部貼一模一樣的標籤**（不可有無標籤的箱）；紙箱不印箭咀或任何符號；二維碼是 Data Matrix 不是 QR。，在正面左半邊，每箱只有一張：頂部一行細字、左邊 4 條一維條碼、右上角 1 個 Data Matrix。不可另貼其他貼紙，不可有認證標誌，不可有可讀文字 |
| TC22 握法 | **像看手機一樣**：單手拿，機向後斜約 45 度，螢幕向著自己，機頂向前斜指標籤。正面整面螢幕，**沒有鍵盤** |
| TC22 讀碼 | **只有按黃色側鍵才會讀碼**：工人不用手指按螢幕；紅光和嗶聲只在按側鍵、機頂指著目標標籤時出現。按側鍵時，機頂射出紅色光暈加中心一粒紅點，落在**一個**條碼正中，嗶一聲即熄。機身和螢幕不發紅光。只可在指著條碼時按鍵，不可讀空氣 |
| TC501 讀碼 | 用後相機加 Zebra AI 讀碼，**不投射任何光**。綠框和勾號**只出現在 TC501 螢幕上**；箱上的標籤永遠是黑白的，不會自己變色或出勾號 |
| 寫實 | 不是科幻片：每段一個連續鏡頭，不換場景；每個動作都有原因和目的 |
| 寫 Prompt | **不要點名不想出現的東西**，連「no」、「never」、「avoid」句子也不要寫，只正面描述想要的樣子。R1 不可出現 check mark、green、tick 等字 |
| 品牌 | Zebra Logo（右上角）和字幕（右下角）用 `scripts/overlay-brand.sh` 後期疊加，不交給 AI 畫 |

用法：在 Gem「Zebra AI Video Generation」先貼「開場訊息」一次。R1 用「相片轉影片」；R2–R5 逐段貼上，並附上該段列出的參考圖。

## 片段與影片時間軸的對應
| 片段 | 場景（影片時間） | 畫面重點 | 後期處理 |
|---|---|---|---|
| R1 | S1 痛點（0–10 秒） | TC22 只讀**同一張標籤**，依次逐個讀，示範這種方法慢 | 原速；後期加 Logo 和字幕 |
| R2 | S2 登場（8–16 秒） | 放下 TC22，拿起 TC501 | 取頭 8 秒 |
| R3 | S3 同時讀取（16–28 秒） | TC501 背面相機對準標籤，**螢幕上全部條碼同時出綠框，再出勾號** | 放慢至 0.83 倍 |
| R4 | S4 移動追蹤（28–38 秒） | 移向下一批紙箱，**螢幕上**綠框跟隨，新標籤在螢幕上即時出綠框和勾號 | 原速 |
| R5 | S5 收貨核對（38–48 秒） | 螢幕顯示整個棧板每張標籤都打勾，工作人員點頭 | 原速 |
| — | S6、S7（48–62 秒） | 官方產品圖，不用 Gemini | — |

---

## 第 0 步：人物設定圖 `worker.png`（Gemini 圖片生成，只需做一次）
```
Character reference sheet for a photorealistic corporate video. One single person shown in three views side by side on one image, left to right: full-body front view, full-body three-quarter view, full-body left side profile. Exactly the same person, outfit and proportions in all three views.
The person: an East Asian man in his early 30s, average build, about 175 cm tall, short neat black hair, clean-shaven, friendly calm expression, natural skin texture.
Outfit: plain dark grey work jacket with a zip front and matching dark grey work trousers, plain black crew-neck T-shirt underneath, black safety work shoes. No logos, no name badge, no text, no patterns on the clothing. Empty hands relaxed at his sides.
Pose: standing naturally, feet slightly apart, looking straight ahead in each view (not at the camera in the side view).
Background: plain seamless light grey studio background, soft even studio lighting, no shadows on the background, no props.
Style: photorealistic, sharp focus, true-to-life colours, 16:9 landscape image, high resolution.
Avoid: text, labels, watermarks, logos, extra people, different outfits between views, cartoon or illustration style, distorted hands, extra fingers.
```

## 第 0.5 步：上傳標籤樣本 `multi barcode label sample.jpeg`
上傳到 Gem 的知識檔案，檔名保持不變。Gem 用它理解標籤版式；**第 3 版起不再把它附到任何片段**，因為試片證明附上後會被抄字。

**這張圖只用來說明「多條碼標籤長甚麼樣子」**，影片中**不可出現**樣本上的真實資料。以下內容全部不准複製：
- 料號、數量、批號、日期、Reel ID
- 條碼本身的圖案
- Qisda 公司名稱和無鉛標誌

每段 Prompt 已寫明：只沿用版式（頂部一行說明文字、左邊 4 條一維條碼、右上角 Data Matrix），所有文字一律是看不清的通用字樣，條碼是新的通用圖案。

---

## 開場訊息（只需貼一次）
```
For this session, every clip is 10 seconds long, 16:9, photorealistic, 1080p if available. Ignore the 8-second default in your instructions. Follow the timed beats in each request. Generate one clip per message. Keep the same worker (worker.png), the same pallet and the same warehouse in every clip.
Device rules — never break them:
1. Zebra TC22 = a slim rugged handheld mobile computer; it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front face, with only a thin bezel and an earpiece slot at the top; NO physical keypad, NO number keys, NO navigation keys, NO buttons of any kind on the front; NO pistol grip, NO handle, NO trigger. The only colour accent is a small yellow scan button on the side edge. The scan window is on the top edge. He holds it in one hand the way a person reads a phone: tilted back about 45 degrees, screen facing him, TOP EDGE angled forward toward the label. only while the button is pressed, the scan window on the top edge projects a soft red LED glow onto the label with one small, sharp red aiming dot in its centre. It reads ONE barcode at a time. The small red aiming dot lands on the centre of exactly ONE barcode at a time — never in the gaps between barcodes, never on the printed text, never on the bare carton. At each beep the red light switches off at once; between reads no light is projected. It is a dot, not a laser line.
2. Zebra TC501 = a slim rugged handheld mobile computer; it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front, a thin top bezel with the earpiece and two small green indicator lights, a white ZEBRA wordmark on the bottom bezel; NO physical keypad, NO number keys, NO buttons of any kind on the front; NO pistol grip; green buttons on both side edges; rear camera on the back. It is held upright like taking a photo; its rear camera captures every barcode in view at once, and its screen shows the live camera view with a bright green box around every barcode and then a large green check mark.
3. Match both devices exactly to the uploaded Zebra renders. If a device in the clip has a keypad, number keys or a small screen, it is wrong.
Pallet rule: the pallet is the one in r1-first-frame.jpg — 3 cartons across, 3 high, 2 deep, every carton with an identical label. The cartons always stay stacked on the pallet. The worker reads the labels on the cartons where they are; he never lifts, picks up or holds a carton.
Realism rule: this is a real product film, not science fiction. Real labels and cartons never glow, change colour or show icons; green boxes and check marks appear ONLY on the TC501 screen, never on the real labels. One continuous shot per clip, no cuts. Every action has a physical cause and a purpose — no scanning empty air, no pointless gestures.
Label rule: one label per carton only, on the left half of the front face; no extra stickers or certification marks. "multi barcode label sample.jpeg" is ONLY an example of what a multi-barcode label looks like. Copy its layout (caption line, four stacked 1D barcodes on the left, one Data Matrix top-right). Never reproduce its data — no part number, quantity, lot number, dates, reel ID, company name, symbols or barcode patterns. I will NOT attach it to the clips; follow the written label description instead.
```

---

## R1 痛點：TC22 逐個讀同一張標籤（10 秒）
**做法（第 11 版改）**：
1. 開一個**普通 Gemini 對話**，**不要用 Gem**。原因見下面「為甚麼標籤會出綠勾」第 3 點。
2. 在工具選「影片」，上傳 `assets/frames/r1-first-frame.jpg`，看到圖片預覽後才貼 Prompt。
3. 生成後先看**第一格**，應該與 `r1-first-frame.jpg` 一模一樣。

這張首格圖已經合格，**不要修改，也不要重新生成**。

**要讀的標籤**：最上一層、中間那一箱（已確認）。

### 為甚麼標籤會出綠勾（2026-10-20 第 7 次試片）
試片中，每張標籤的**右下角**陸續出現綠色勾號。我在 Prompt 裡找到四個原因：
1. **Prompt 裡寫了「勾號」**：第 10 版 R1 Prompt 三次提到 green check 或 check marks。其中一句是「labels never show check marks」，把「標籤」和「勾號」放在同一句。影片模型不太理解「never」、「no」這類否定字，反而把「標籤 + 勾號」畫了出來。多份第三方 Veo 教學都提到這個現象，我未能讀到 Google 官方原文核實。之前反覆出現的鍵盤、QR 碼，很可能也是 Avoid 清單點名所致。
2. **標籤描述留了一個空位**：Gem 的標籤描述寫明「右下角留空」。模型就用勾號填滿這個空位，所以勾號都出現在右下角。
3. **Gem 的指示混入了 TC501 的效果**：Gem 指示裡有 R3「每張標籤出一個大綠勾」（指 TC501 螢幕）。在 Gem 內生成時，這些字全部是背景資料，Gemini 改寫 Prompt 時可能把它帶進 R1。這一點是推斷，未經證實。
4. **第一格又不是 `r1-first-frame.jpg`**：背景變成捲閘門。沒有首格圖鎖定畫面，模型便自由發揮。

**改法**：
- R1 Prompt 完全不提勾號、綠色、顏色變化，也不再列出不要的東西。只用正面描述想要的樣子，例如「標籤是普通印刷紙，每一格都一模一樣」。
- 標籤右下角改為「一小段灰色細字」，不留空位。
- App 每讀一次只「多一行灰字」，不用綠勾。綠勾只屬於 TC501 的片段。
- 不經 Gem 生成。

```
Animate this image as one continuous 10-second shot. The camera stays exactly where it is, and the worker, pallet, cartons, labels and lighting stay exactly as in the image.
The labels are ordinary printed paper shipping labels: black ink on white paper. They look exactly the same in every frame from the first to the last. Each label has a short line of fine text at the top, four black 1D barcodes stacked in its left column, one black square Data Matrix code in its top-right corner, and a small block of fine grey text in its bottom-right corner.
He keeps the same grip as in the image: the phone in his right hand, held the way a person reads a phone, tilted back, screen facing him, top edge angled toward the cartons. His left hand stays relaxed at his side. His right thumb rests on the yellow button on the side of the phone.
His target is ONE label: the white label on the middle carton of the top row, the label just above and slightly to the left of the phone in the image. Before every press he turns the phone a little to the left and up, so that its top edge points straight into that white label. Every red dot lands inside the white area of that label, right on the black bars of the barcode being read.
He reads that label one barcode at a time, slowly and carefully, in this order:
0–2 s: first 1D barcode, the top barcode in the label's left column — the red dot sits on its black bars.
2–4 s: second 1D barcode, directly below it.
4–6 s: third 1D barcode, the third barcode from the top in the left column — the red dot sits on its black bars.
6–8 s: fourth 1D barcode, at the bottom of the left column.
8–10 s: the square Data Matrix code in the label's top-right corner. Then he takes his thumb off the yellow button and looks at the screen.
Each read is the same small sequence: he aims, holds still for a moment, then his thumb presses the yellow side button; a small red dot with a soft red glow appears on the black bars of that one barcode, inside the white label, and stays there for half a second; a short beep; the red light goes out; a new line of grey text appears at the top of the list in the app on the phone screen; he moves the phone a few centimetres to aim at the next barcode. The red dot appears only during a thumb press and only on that top-middle label.
The phone screen shows a simple white list app with a coloured title bar.
Audio: quiet warehouse ambience and one short scanner beep per read.
```
**後期**：`scripts/overlay-brand.sh r1.mp4 r1-branded.mp4 "用 Zebra TC22 收貨"`

**長度**：據 Google 2025 年 7 月公布，「相片轉影片」每段約 8 秒。如果只出 8 秒，就把每個條碼改為 1.6 秒（0–1.6、1.6–3.2、3.2–4.8、4.8–6.4、6.4–8 秒）。

---

## R2 登場：換上 TC501（10 秒）
**附上參考圖**：`worker.png`、`tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg`
```
Generate a 10-second 16:9 video clip.
Slow gimbal pull-back from a medium shot to a wider shot that shows the whole pallet.
Devices: the Zebra TC22 he puts down: it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front face, with only a thin bezel and an earpiece slot at the top; NO physical keypad, NO number keys, NO navigation keys, NO buttons of any kind on the front; NO pistol grip, NO handle, NO trigger. The only colour accent is a small yellow scan button on the side edge. The scan window is on the top edge (match tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg). The Zebra TC501 he picks up: it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front, a thin top bezel with the earpiece and two small green indicator lights, a white ZEBRA wordmark on the bottom bezel; NO physical keypad, NO number keys, NO buttons of any kind on the front; NO pistol grip; green buttons on both side edges; rear camera on the back (match tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg exactly).
The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
Action, timed:
0–3 s: the worker places the TC22 face-up on a small cart beside him.
3–6 s: he picks up the TC501 from the cart and takes two steps back from the pallet.
6–8 s: he raises the TC501 upright with both hands like taking a photo, its rear camera facing the cartons, relaxed and confident.
8–10 s: he holds it steady, aimed at the cartons; no light of any kind comes out of the TC501.
The labels: every carton carries one large white multi-barcode label, using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and a small block of fine grey text in the bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 18 plain brown corrugated cartons: 3 across, 3 high and 2 deep, so the front face shows 9 cartons (the same pallet as in r1-first-frame.jpg), every label facing the camera.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Realism rules — this is a real product film, not science fiction: ONE continuous shot, no cuts, no change of location, camera angle, pallet, lighting or worker. The physical world never changes by itself: real labels and cartons never glow, change colour or show check marks, icons, frames or corner brackets; no holograms, no floating graphics, no AR overlays in the real scene. Green boxes and check marks exist ONLY on the device screen. The device screen and body never show a red light. Every action has a real cause and purpose: the scan button is pressed only while the top edge is pointed at a barcode — never scanning empty air, never a pointless gesture.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: pistol-grip scanner, gun-shaped scanner, handle, trigger, keypad, number keys, small screen, feature phone, lifting or holding a carton, readable text, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera, labels changing colour or showing check marks, corner brackets or frames on labels, floating graphics, cuts or scene changes, a second sticker or separate QR code beside the label, EAC, CE or recycling marks, beard or stubble.
```

## R3 同時讀取：TC501 一次過讀完（10 秒）⭐ 建議先生成這段
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg`（兩張都是 TC501，不附標籤樣本）
```
Generate a 10-second 16:9 video clip.
Over-the-shoulder shot from behind the worker's right shoulder, very slow push-in toward the device screen. Both the TC501 screen and the real cartons behind it are visible and in focus.
Device: a Zebra TC501 — it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front, a thin top bezel with the earpiece and two small green indicator lights, a white ZEBRA wordmark on the bottom bezel; NO physical keypad, NO number keys, NO buttons of any kind on the front; NO pistol grip; green buttons on both side edges; match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg exactly. He holds it upright with both hands like taking a photo, rear camera aimed at the front of the pallet so that four to six carton labels are in the camera view.
Screen content: the live camera view of those labels — clean, minimal camera-app interface, no readable text on the screen. The green boxes and check marks are drawn ONLY on the TC501 screen; the real labels on the cartons always stay plain black and white and never change.
Action, timed:
0–3 s: he holds the device steady; the screen shows the labels with no boxes yet.
3–4 s: at the same instant, a bright green rectangle appears around EVERY barcode on EVERY label in view — all four 1D barcodes and the square 2D code on each label, all together, not one by one.
4–6 s: a large green check mark appears on each label on the screen.
6–10 s: he keeps holding steady; the green boxes and check marks stay locked on the barcodes.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and a small block of fine grey text in the bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 18 plain brown corrugated cartons: 3 across, 3 high and 2 deep, so the front face shows 9 cartons (the same pallet as in r1-first-frame.jpg). The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
Photorealistic corporate product film. Modern warehouse receiving area, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Realism rules — this is a real product film, not science fiction: ONE continuous shot, no cuts, no change of location, camera angle, pallet, lighting or worker. The physical world never changes by itself: real labels and cartons never glow, change colour or show check marks, icons, frames or corner brackets; no holograms, no floating graphics, no AR overlays in the real scene. Green boxes and check marks exist ONLY on the device screen. The device screen and body never show a red light. Every action has a real cause and purpose: the scan button is pressed only while the top edge is pointed at a barcode — never scanning empty air, never a pointless gesture.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: any light projected from the device onto the cartons (no red dot, no red glow, no laser line, no green crosshair, no flash), pistol-grip scanner, keypad, number keys, small screen, feature phone, lifting or holding a carton, boxes appearing one at a time, readable text on screen or labels, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera, labels changing colour or showing check marks, corner brackets or frames on labels, floating graphics, cuts or scene changes, a second sticker or separate QR code beside the label, EAC, CE or recycling marks, beard or stubble.
```

## R4 移動追蹤：綠框跟隨（10 秒）
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg`（兩張都是 TC501，不附標籤樣本）
```
Generate a 10-second 16:9 video clip.
Over-the-shoulder shot from behind the worker's right shoulder; the camera follows with a gentle, slow pan. The TC501 screen and the real cartons are both visible.
Device: a Zebra TC501 — it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front, a thin top bezel with the earpiece and two small green indicator lights, a white ZEBRA wordmark on the bottom bezel; NO physical keypad, NO number keys, NO buttons of any kind on the front; NO pistol grip; green buttons on both side edges; match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg exactly. Held upright, rear camera aimed at the cartons.
Screen content: live camera view with bright green rectangles around every barcode in view and a green check mark on every completed label; clean, minimal interface, no readable text. The green boxes and check marks are drawn ONLY on the TC501 screen; the real labels on the cartons always stay plain black and white and never change.
Action, timed:
0–2 s: he holds the device on the left column of cartons; all their labels already show green boxes and check marks.
2–8 s: he slowly moves the device from left to right across the pallet in one smooth motion; on the screen the green boxes stay locked onto each barcode as it moves, and every new label entering the view instantly gets green boxes on all its barcodes and then a check mark.
8–10 s: he holds steady on the right column; every label on screen shows green boxes and a check mark.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and a small block of fine grey text in the bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 18 plain brown corrugated cartons: 3 across, 3 high and 2 deep, so the front face shows 9 cartons (the same pallet as in r1-first-frame.jpg). The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
Photorealistic corporate product film. Modern warehouse receiving area, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Realism rules — this is a real product film, not science fiction: ONE continuous shot, no cuts, no change of location, camera angle, pallet, lighting or worker. The physical world never changes by itself: real labels and cartons never glow, change colour or show check marks, icons, frames or corner brackets; no holograms, no floating graphics, no AR overlays in the real scene. Green boxes and check marks exist ONLY on the device screen. The device screen and body never show a red light. Every action has a real cause and purpose: the scan button is pressed only while the top edge is pointed at a barcode — never scanning empty air, never a pointless gesture.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: any light projected from the device onto the cartons (no red dot, no red glow, no laser line, no green crosshair, no flash), pistol-grip scanner, keypad, number keys, small screen, feature phone, lifting or holding a carton, readable text on screen or labels, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera, labels changing colour or showing check marks, corner brackets or frames on labels, floating graphics, cuts or scene changes, a second sticker or separate QR code beside the label, EAC, CE or recycling marks, beard or stubble.
```

## R5 收貨核對：整個棧板打勾（10 秒）
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg`（兩張都是 TC501，不附標籤樣本）
```
Generate a 10-second 16:9 video clip.
Over-the-shoulder shot from behind the worker's right shoulder, then a slow pull-back to a medium shot; locked-off feel, very little movement.
Device: a Zebra TC501 — it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front, a thin top bezel with the earpiece and two small green indicator lights, a white ZEBRA wordmark on the bottom bezel; NO physical keypad, NO number keys, NO buttons of any kind on the front; NO pistol grip; green buttons on both side edges; match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg exactly.
Screen content: the live camera view of the whole pallet; every one of the 9 front labels shows green boxes on all its barcodes and a green check mark; clean, minimal interface, no readable text. The green boxes and check marks are drawn ONLY on the TC501 screen; the real labels on the cartons always stay plain black and white and never change.
Action, timed:
0–4 s: he holds the TC501 aimed at the whole pallet; the screen shows all 9 front labels checked in green.
4–6 s: he looks at the screen and gives a small, satisfied nod.
6–8 s: he slowly lowers the device to his side.
8–10 s: he looks calmly at the pallet, standing still.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and a small block of fine grey text in the bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 18 plain brown corrugated cartons: 3 across, 3 high and 2 deep, so the front face shows 9 cartons (the same pallet as in r1-first-frame.jpg). The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
Photorealistic corporate product film. Modern warehouse receiving area, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Realism rules — this is a real product film, not science fiction: ONE continuous shot, no cuts, no change of location, camera angle, pallet, lighting or worker. The physical world never changes by itself: real labels and cartons never glow, change colour or show check marks, icons, frames or corner brackets; no holograms, no floating graphics, no AR overlays in the real scene. Green boxes and check marks exist ONLY on the device screen. The device screen and body never show a red light. Every action has a real cause and purpose: the scan button is pressed only while the top edge is pointed at a barcode — never scanning empty air, never a pointless gesture.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: any light projected from the device onto the cartons (no red dot, no red glow, no laser line, no green crosshair, no flash), pistol-grip scanner, keypad, number keys, small screen, feature phone, lifting or holding a carton, readable text on screen or labels, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera, labels changing colour or showing check marks, corner brackets or frames on labels, floating graphics, cuts or scene changes, a second sticker or separate QR code beside the label, EAC, CE or recycling marks, beard or stubble.
```

---

## 生成後檢查（每段）
1. **場景**：與 `r1-first-frame.jpg` 是同一個棧板（3 闊、3 高、2 深）、同一個角度；全段一個鏡頭，沒有換場景
2. **標籤**：每箱一張，全部一模一樣；沒有另貼的二維碼；沒有認證標誌；沒有可讀文字
3. **R1**：
   - 握法一直像看手機一樣（斜拿、螢幕向著自己），正面沒有鍵盤
   - 紅點只落在最上一層、中間那一箱的標籤，次序是第 1、2、3、4 條一維條碼，最後是 Data Matrix
   - 機身沒有紅光
   - **每一次**紅點都落在白色標籤內、條碼的黑線上（第 8 次試片第 1、3 次落在標籤外）
   - 只用拇指按黃色側鍵；沒有用手指按螢幕；不按側鍵時沒有紅光、沒有嗶聲
   - 第一格與 `r1-first-frame.jpg` 相同；正面 9 箱全部有同一款標籤
   - 每讀一個，螢幕 App 多一行灰字（R1 不用綠勾）
   - **標籤由頭到尾沒有任何變化**：沒有勾號、沒有顏色
   - 讀完最後一個就鬆開按鍵看螢幕，沒有再按
4. **R2–R5**：TC501 不投射任何光；綠框同時出現，再出勾號，**只在螢幕上**；箱上標籤沒有變色
5. **人物**：與 `worker.png` 同一人，沒有鬚，沒有望鏡頭
6. **後期**：Logo 和字幕用 `scripts/overlay-brand.sh` 加；AI 畫面本身沒有 Logo 或文字

合格後下載，命名為 `r1.mp4` … `r5.mp4`，上傳給我。

---

## 版本紀錄
- 第 12 版（2026-10-20）：第 8 次試片的第 1、3 次讀碼紅點落在標籤外的紙皮上。R1 寫明目標是「圖中機上方偏左那張白色標籤」、每次按鍵前先把機頂轉向標籤、紅點落在條碼的黑線上並停半秒
- 第 11 版（2026-10-20）：找出標籤出綠勾的原因（Prompt 提及勾號、否定句、標籤右下角留空、Gem 混入 TC501 效果、首格圖未生效）；R1 改為只用正面描述，不提勾號，不列 Avoid；標籤右下角改為灰色細字；R1 不經 Gem 生成
- 第 10 版（2026-10-20）：只有按黃色側鍵才讀碼，不用手指按螢幕，不按側鍵時沒有紅光和嗶聲；正面 9 箱全部貼同一款標籤；檢查第一格是否就是首格圖
- 第 9 版（2026-10-20）：以 `r1-first-frame.jpg` 為準重寫。R1 改為相片轉影片，只讀最上一層中間那箱的標籤；棧板改為 3×3×2；寫明綠框和勾號只在 TC501 螢幕上
- 第 8 版：TC22 握法改為像看手機一樣（用戶確認），取消「平放、像遙控器」
- 第 7 版：所有箱同一款標籤；R1 分為首格圖和相片轉影片兩步
- 第 6 版：新增寫實規則；每箱只貼一張標籤；機身不可有紅燈；最後不可再按鍵
- 第 5 版：12 箱全部貼標籤；設備縮至手機大小；螢幕顯示收貨 App；Logo 和字幕改為後期疊加
- 第 4 版：TC22 瞄準光改為紅色光暈加中心紅點（SE4710 規格）；TC501 不投射光
- 第 3 版：貨物留在棧板上讀；TC22／TC501 正面沒有鍵盤；不再附標籤樣本（會被抄字）
- 第 2 版：TC22 像手機、沒有槍柄；多條碼標籤；TC501 一次讀完
