# TC501 EP01：Gemini 影片生成 Prompt（每段 10 秒）· 第 9 版

> 2026-10-20 重寫。**R1 以用戶認可的首格圖 `assets/frames/r1-first-frame.jpg` 為準**，包括拍攝角度、棧板、箱數、標籤位置和 TC22 握法。R2–R5 沿用同一個棧板。舊版改動紀錄見文末。

## 核心規則（所有片段都適用）
| 項目 | 規則 |
|---|---|
| 場景 | 與 `r1-first-frame.jpg` 相同：從工人右肩後方高位拍；黑色膠卡板上放素色啡紙箱，3 箱闊、3 層高、2 箱深（正面 9 箱） |
| 標籤 | 同一批貨，**每箱貼一模一樣的標籤**，在正面左半邊，每箱只有一張：頂部一行細字、左邊 4 條一維條碼、右上角 1 個 Data Matrix。不可另貼其他貼紙，不可有認證標誌，不可有可讀文字 |
| TC22 握法 | **像看手機一樣**：單手拿，機向後斜約 45 度，螢幕向著自己，機頂向前斜指標籤。正面整面螢幕，**沒有鍵盤** |
| TC22 讀碼 | 按黃色側鍵時，機頂射出紅色光暈加中心一粒紅點，落在**一個**條碼正中，嗶一聲即熄。機身和螢幕不發紅光。只可在指著條碼時按鍵，不可讀空氣 |
| TC501 讀碼 | 用後相機加 Zebra AI 讀碼，**不投射任何光**。綠框和勾號**只出現在 TC501 螢幕上**；箱上的標籤永遠是黑白的，不會自己變色或出勾號 |
| 寫實 | 不是科幻片：每段一個連續鏡頭，不換場景；每個動作都有原因和目的 |
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
**做法**：在 Gemini 選「影片」，上傳 `assets/frames/r1-first-frame.jpg` 作為**第一格**，再貼上以下 Prompt。這張圖已經合格，**不要修改，也不要重新生成**。

**要讀的標籤**：最上一層、中間那一箱的標籤。原因是：
- 機頂正向它斜指
- 整張標籤沒有被手和機遮住，觀眾看得清楚紅點逐個移動

中間一層、中間那一箱的標籤被機遮住了一部分，所以不讀它。
```
Animate this image as ONE continuous 10-second shot. The camera stays exactly where it is. Keep the same worker, pallet, cartons, labels and lighting. The only things that change are his hand movement, the red scan light and the phone screen.
He keeps exactly the same grip as in the image: the phone held in his right hand the way a person reads a phone, tilted back, screen facing him, top edge angled forward toward the cartons.
He reads the barcodes on ONE label only — the label on the middle carton of the TOP row — in order, one at a time, slowly and carefully. This method is deliberately slow and a little tedious. Between reads he moves the phone only a few centimetres.
Each read: he presses the yellow side button; a soft red glow with one small sharp red dot appears ON THAT LABEL, on the centre of one barcode only; a short beep; the light switches off at once; one new row with a small green check appears in the app on the phone screen; he glances at the screen, then aims at the next barcode.
0–2 s: the first 1D barcode (top of the label's left column).
2–4 s: the second 1D barcode, directly below.
4–6 s: the third 1D barcode.
6–8 s: the fourth 1D barcode (bottom of the left column).
8–10 s: the square Data Matrix in the label's top-right corner. Then he releases the button and looks at the screen. He does not press the button again.
The red dot never leaves this one label: never on another carton, never between barcodes, never on text or cardboard. The phone body and screen never show red light. The labels on the cartons never change colour and never show check marks; the check marks appear only in the app on the phone screen. No cuts, no new objects, no graphics in the scene.
Audio: quiet warehouse ambience and one short scanner beep per read; no speech, no music.
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
The labels: every carton carries one large white multi-barcode label, using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
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
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
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
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
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
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
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
   - 每讀一個，螢幕多一行勾號
   - 讀完最後一個就鬆開按鍵看螢幕，沒有再按
4. **R2–R5**：TC501 不投射任何光；綠框同時出現，再出勾號，**只在螢幕上**；箱上標籤沒有變色
5. **人物**：與 `worker.png` 同一人，沒有鬚，沒有望鏡頭
6. **後期**：Logo 和字幕用 `scripts/overlay-brand.sh` 加；AI 畫面本身沒有 Logo 或文字

合格後下載，命名為 `r1.mp4` … `r5.mp4`，上傳給我。

---

## 版本紀錄
- 第 9 版（2026-10-20）：以 `r1-first-frame.jpg` 為準重寫。R1 改為相片轉影片，只讀最上一層中間那箱的標籤；棧板改為 3×3×2；寫明綠框和勾號只在 TC501 螢幕上
- 第 8 版：TC22 握法改為像看手機一樣（用戶確認），取消「平放、像遙控器」
- 第 7 版：所有箱同一款標籤；R1 分為首格圖和相片轉影片兩步
- 第 6 版：新增寫實規則；每箱只貼一張標籤；機身不可有紅燈；最後不可再按鍵
- 第 5 版：12 箱全部貼標籤；設備縮至手機大小；螢幕顯示收貨 App；Logo 和字幕改為後期疊加
- 第 4 版：TC22 瞄準光改為紅色光暈加中心紅點（SE4710 規格）；TC501 不投射光
- 第 3 版：貨物留在棧板上讀；TC22／TC501 正面沒有鍵盤；不再附標籤樣本（會被抄字）
- 第 2 版：TC22 像手機、沒有槍柄；多條碼標籤；TC501 一次讀完
