# TC501 EP01：Gemini 影片生成 Prompt（每段 10 秒）· 第 2 版

> **第 2 版改動（2026-10-19，按用戶三個原則）**
> 1. R1 的設備必須是 **TC22**：外形像手機，**沒有槍柄**，掃描窗在機頂。第 1 版生成出槍形掃描器，所以這版逐點寫明外形。
> 2. 每箱貼的是 **多條碼標籤**，樣式參照用戶提供的樣本：左邊 4 條一維條碼，右上角 1 個 Data Matrix 二維碼。
> 3. **TC22 要對準每一個條碼逐個讀**。**TC501 用背面相機一次過讀完**，螢幕顯示每個條碼的綠框，再出現一個綠色勾號。所以 R3–R5 改為**看得見螢幕**，取消「螢幕背向鏡頭」的設定。
>
> 用法：在 Gem「Zebra AI Video Generation」先貼「開場訊息」一次，之後逐段貼上 R1 → R5。如果 Gem 內不能生成影片，就貼到 Gemini 的影片生成，並附上該段列出的參考圖。可以選 1080p 就選 1080p（第 1 版只有 720p）。

## 片段與影片時間軸的對應
| 片段 | 場景（影片時間） | 畫面重點 | 後期處理 |
|---|---|---|---|
| R1 | S1 痛點（0–8 秒） | TC22 對準一張標籤上的條碼，**逐個讀** | 取頭 8 秒 |
| R2 | S2 登場（8–16 秒） | 放下 TC22，拿起 TC501 | 取頭 8 秒 |
| R3 | S3 同時讀取（16–28 秒） | TC501 背面相機對準標籤，**螢幕上全部條碼同時出綠框，再出勾號** | 放慢至 0.83 倍 |
| R4 | S4 移動追蹤（28–38 秒） | 移向下一批紙箱，綠框跟隨，新標籤即時變綠打勾 | 原速 |
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
上傳到 Gem 的知識檔案，檔名保持不變。R1–R5 都會引用它。

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
1. Zebra TC22 = a slim, phone-shaped rugged handheld mobile computer with NO pistol grip, NO handle and NO trigger. Black body, touchscreen on the front, yellow scan button on the side, scan window on the top edge. It is held flat in one hand like a phone; the top edge points at the barcode and a thin red aiming line comes out of the top edge. It reads ONE barcode at a time.
2. Zebra TC501 = a slim, phone-shaped rugged handheld mobile computer with NO pistol grip. Black body, green-accented side buttons, ZEBRA wordmark below the screen, rear camera on the back. It is held upright like taking a photo; its rear camera captures every barcode in view at once, and its screen shows the live camera view with a bright green box around every barcode and then a large green check mark.
3. Match both devices exactly to the uploaded Zebra renders.
Label rule: "multi barcode label sample.jpeg" is ONLY an example of what a multi-barcode label looks like. Copy its layout (caption line, four stacked 1D barcodes on the left, one Data Matrix top-right). Never reproduce its data — no part number, quantity, lot number, dates, reel ID, company name, symbols or barcode patterns.
```

---

## R1 痛點：TC22 逐個讀（10 秒）
**附上參考圖**：`worker.png`、`tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg`、`multi barcode label sample.jpeg`
（如果只可附 3 張：用 TC22 正面圖，因為它最能說明「沒有槍柄、像手機」的外形）
```
Generate a 10-second 16:9 video clip.
Medium close-up side shot, static camera, framed so one carton label and the worker's hand are clearly visible.
Device: a Zebra TC22 — a slim, phone-shaped rugged handheld mobile computer with NO pistol grip, NO handle and NO trigger; black body, touchscreen on the front, yellow scan button on the side, scan window on the top edge. Match tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg exactly. He holds it flat in one hand like a phone, top edge pointed at the label, and presses the yellow side button with his thumb; a thin red aiming line comes out of the top edge.
Action, timed — he must read the barcodes on ONE label strictly one at a time:
0–2 s: the red line lands on the first barcode only; he presses the button.
2–4 s: he moves the device down to the second barcode only and presses again.
4–6 s: third barcode only, press again.
6–8 s: fourth barcode only, press again, then he aims at the square 2D code alone; he looks slightly tired.
8–10 s: he lowers the device and turns to the next carton's label.
The label: One large white multi-barcode label, using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high, every carton with one such label facing the camera.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: pistol-grip scanner, gun-shaped scanner, handle, trigger, red line covering more than one barcode, readable text, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R2 登場：換上 TC501（10 秒）
**附上參考圖**：`worker.png`、`tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg`
```
Generate a 10-second 16:9 video clip.
Slow gimbal pull-back from a medium shot to a wider shot that shows the whole pallet.
Devices: the Zebra TC22 he puts down is a slim phone-shaped handheld with NO pistol grip (match tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg). The Zebra TC501 he picks up is a slim phone-shaped rugged handheld with NO pistol grip, black body, green-accented side buttons, rear camera on the back (match tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg exactly).
Action, timed:
0–3 s: the worker places the TC22 face-up on a small cart beside him.
3–6 s: he picks up the TC501 from the cart and takes two steps back from the pallet.
6–8 s: he raises the TC501 upright with both hands like taking a photo, its rear camera facing the cartons, relaxed and confident.
8–10 s: he holds it steady, aimed at the cartons.
The labels: every carton carries one large white multi-barcode label, using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high, every label facing the camera.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: pistol-grip scanner, gun-shaped scanner, handle, trigger, readable text, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R3 同時讀取：TC501 一次過讀完（10 秒）⭐ 建議先生成這段
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`multi barcode label sample.jpeg`
```
Generate a 10-second 16:9 video clip.
Over-the-shoulder shot from behind the worker's right shoulder, very slow push-in toward the device screen. Both the TC501 screen and the real cartons behind it are visible and in focus.
Device: a Zebra TC501 — slim phone-shaped rugged handheld, NO pistol grip, black body, green-accented side buttons, ZEBRA wordmark below the screen; match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg exactly. He holds it upright with both hands like taking a photo, rear camera aimed at the front of the pallet so that four to six carton labels are in the camera view.
Screen content: the live camera view of those labels — clean, minimal camera-app interface, no readable text on the screen.
Action, timed:
0–3 s: he holds the device steady; the screen shows the labels with no boxes yet.
3–4 s: at the same instant, a bright green rectangle appears around EVERY barcode on EVERY label in view — all four 1D barcodes and the square 2D code on each label, all together, not one by one.
4–6 s: a large green check mark appears on each label on the screen.
6–10 s: he keeps holding steady; the green boxes and check marks stay locked on the barcodes.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high.
Photorealistic corporate product film. Modern warehouse receiving area, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: red laser line, pistol-grip scanner, boxes appearing one at a time, readable text on screen or labels, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R4 移動追蹤：綠框跟隨（10 秒）
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`multi barcode label sample.jpeg`
```
Generate a 10-second 16:9 video clip.
Over-the-shoulder shot from behind the worker's right shoulder; the camera follows with a gentle, slow pan. The TC501 screen and the real cartons are both visible.
Device: a Zebra TC501 — slim phone-shaped rugged handheld, NO pistol grip, black body, green-accented side buttons, ZEBRA wordmark below the screen; match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg exactly. Held upright, rear camera aimed at the cartons.
Screen content: live camera view with bright green rectangles around every barcode in view and a green check mark on every completed label; clean, minimal interface, no readable text.
Action, timed:
0–2 s: he holds the device on the left column of cartons; all their labels already show green boxes and check marks.
2–8 s: he slowly moves the device from left to right across the pallet in one smooth motion; on the screen the green boxes stay locked onto each barcode as it moves, and every new label entering the view instantly gets green boxes on all its barcodes and then a check mark.
8–10 s: he holds steady on the right column; every label on screen shows green boxes and a check mark.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high.
Photorealistic corporate product film. Modern warehouse receiving area, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: red laser line, pistol-grip scanner, readable text on screen or labels, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R5 收貨核對：整個棧板打勾（10 秒）
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`multi barcode label sample.jpeg`
```
Generate a 10-second 16:9 video clip.
Over-the-shoulder shot from behind the worker's right shoulder, then a slow pull-back to a medium shot; locked-off feel, very little movement.
Device: a Zebra TC501 — slim phone-shaped rugged handheld, NO pistol grip, black body, green-accented side buttons, ZEBRA wordmark below the screen; match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg exactly.
Screen content: the live camera view of the whole pallet; every one of the 12 labels shows green boxes on all its barcodes and a green check mark; clean, minimal interface, no readable text.
Action, timed:
0–4 s: he holds the TC501 aimed at the whole pallet; the screen shows all 12 labels checked in green.
4–6 s: he looks at the screen and gives a small, satisfied nod.
6–8 s: he slowly lowers the device to his side.
8–10 s: he looks calmly at the pallet, standing still.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high.
Photorealistic corporate product film. Modern warehouse receiving area, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: red laser line, pistol-grip scanner, readable text on screen or labels, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

---

## 生成後檢查（每段）
1. **設備外形**：TC22 和 TC501 都像手機、**沒有槍柄**；側鍵顏色正確（TC22 黃色、TC501 綠色）
2. **R1**：紅色瞄準光每次只照**一個**條碼
3. **R3–R5**：綠框**同時**出現在全部條碼上，然後出現勾號；螢幕上沒有亂碼文字
4. **標籤**：左邊 4 條一維條碼加右上角 Data Matrix。**不可出現樣本上的任何真實資料**：料號 7D.22814.09B、數量 3000、批號、日期、Reel ID、Qisda、無鉛標誌。如果看到這些字樣，就要重新生成
5. **人物**：與 `worker.png` 是同一人，沒有望向鏡頭

合格後下載，命名為 `r1.mp4` … `r5.mp4`，上傳給我。
