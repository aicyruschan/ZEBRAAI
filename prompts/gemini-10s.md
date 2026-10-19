# TC501 EP01：Gemini 影片生成 Prompt（每段 10 秒）· 第 5 版

> **第 5 版改動（2026-10-19，按 R1 第二次試片）**：只改 R1
> 1. **12 箱全部貼標籤**：試片只有左邊一列有標籤
> 2. **設備縮小到普通手機大小**：試片的機太大
> 3. **握法改正**：掃描窗在機頂。機要差不多平放，螢幕向上對著他，機頂指向條碼。試片是螢幕對著標籤，紅光從螢幕射出，最後還像相機一樣直舉
> 4. **螢幕顯示 Android 收貨 App**：每讀一個條碼就多一行綠色勾號，進度條前進一格
> 5. **Zebra Logo（右上）和字幕「用 Zebra TC22 收貨」（右下）改為後期疊加**：用 `scripts/overlay-brand.sh`，不交給 AI 畫
> 6. **其他試片問題**：
>    - 標籤印出可讀的「Zebra TC22」字樣
>    - 標籤的二維碼是 QR，不是 Data Matrix
>    - 紅光落在紙箱空白處
>    - 紅光一直亮著
>    - 最後他伸手碰紙箱、走出畫面
>    
>    以上全部已寫入 Avoid


> **第 4 版改動（2026-10-19，按用戶提供的「TC22 vs TC501 Scanning Visuals」參考文件，已核實部分）**
> 1. TC22 的瞄準光由「紅色激光線」改為**紅色光暈加中心一粒小紅點**，按鍵時才亮，嗶一聲即熄。根據是 Zebra SE4710 規格表：610 nm LED 瞄準、660 nm Hyper Red LED 照明，並以「細小清晰的瞄準點」從一堆條碼中選讀單一條碼。
> 2. TC501 本身**有掃描引擎和瞄準器**，但 Zebra AI 讀碼用的是**後相機**，不是掃描引擎，所以片中不顯示它的瞄準光。R2–R5 寫明 TC501 **不向紙箱投射任何光**，Avoid 已寫明。旁白和字幕**不可**說「TC501 沒有瞄準器」或「TC501 沒有掃描器」。
> 3. TC22 也有 SE55 遠距引擎的配置，SE55 的瞄準樣式未核實。本片按 SE4710 的外觀拍攝。


> **第 3 版改動（2026-10-19，按第 2 版 R1 試片的三個問題）**
> 1. 試片中工作人員**把紙箱拿起來**讀。這版改為貨物留在棧板上，他站在棧板前，對準其中一箱的標籤讀，**不碰紙箱**。
> 2. 試片中紅色瞄準光**照在條碼之間和文字上**。這版逐秒寫明紅光要落在哪一個條碼的正中，順序是左邊第 1 條至第 4 條一維條碼，最後是右上角的 Data Matrix，每讀一個有一聲「嗶」。
> 3. 試片中的設備**有實體鍵盤、螢幕細小**，不是 TC22。這版寫明 TC22 和 TC501 都是**整面觸控螢幕、正面沒有任何按鍵**。參考圖也改為**兩張同一設備的官方圖**，標籤樣本不再附上（理由見下文「參考圖改動」）。

> **參考圖改動**：試片抄了樣本上的「Part No 7D 22814 09B」、「Quantity 3000」、「Qisda」和無鉛標誌。可見只要附上樣本，Prompt 怎樣禁止也擋不住。所以 R1、R3–R5 都不再附上 `multi barcode label sample.jpeg`，標籤版式改為只靠文字描述。把騰出的名額給第二張設備圖，讓設備外形更準。

---

> 以下為第 2 版說明，保留作紀錄。

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
1. Zebra TC22 = a slim rugged handheld mobile computer; it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front face, with only a thin bezel and an earpiece slot at the top; NO physical keypad, NO number keys, NO navigation keys, NO buttons of any kind on the front; NO pistol grip, NO handle, NO trigger. The only colour accent is a small yellow scan button on the side edge. The scan window is on the top edge. It is held in one hand like a phone, top edge pointed at the label; only while the button is pressed, the scan window on the top edge projects a soft red LED glow onto the label with one small, sharp red aiming dot in its centre. It reads ONE barcode at a time. The small red aiming dot lands on the centre of exactly ONE barcode at a time — never in the gaps between barcodes, never on the printed text, never on the bare carton. At each beep the red light switches off at once; between reads no light is projected. It is a dot, not a laser line.
2. Zebra TC501 = a slim rugged handheld mobile computer; it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front, a thin top bezel with the earpiece and two small green indicator lights, a white ZEBRA wordmark on the bottom bezel; NO physical keypad, NO number keys, NO buttons of any kind on the front; NO pistol grip; green buttons on both side edges; rear camera on the back. It is held upright like taking a photo; its rear camera captures every barcode in view at once, and its screen shows the live camera view with a bright green box around every barcode and then a large green check mark.
3. Match both devices exactly to the uploaded Zebra renders. If a device in the clip has a keypad, number keys or a small screen, it is wrong.
Pallet rule: the 12 cartons always stay stacked on the pallet. The worker reads the labels on the cartons where they are; he never lifts, picks up or holds a carton.
Label rule: "multi barcode label sample.jpeg" is ONLY an example of what a multi-barcode label looks like. Copy its layout (caption line, four stacked 1D barcodes on the left, one Data Matrix top-right). Never reproduce its data — no part number, quantity, lot number, dates, reel ID, company name, symbols or barcode patterns. I will NOT attach it to the clips; follow the written label description instead.
```

---

## R1 痛點：TC22 逐個讀（10 秒）· 第 5 版
**附上參考圖**：`worker.png`、`tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc22-tc27-photography-product-right-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg`
（兩張都是 TC22：正面圖說明「整面螢幕、沒有鍵盤」，右側圖說明黃色掃描鍵的位置。不附標籤樣本，以免抄到真實資料）

**後期才加（不要叫 AI 畫）**：右上角 Zebra Logo、右下角字幕「用 Zebra TC22 收貨」。AI 畫 Logo 和中文字會變形，所以生成後用以下指令疊加：
`scripts/overlay-brand.sh r1.mp4 r1-branded.mp4 "用 Zebra TC22 收貨"`
這條指令用官方 Logo 檔 `assets/brand/logo.png`，Logo 轉為白色加陰影；字幕是白字配半透明黑底。
```
Generate a 10-second 16:9 video clip.
Camera: three-quarter view from behind and slightly to the right of the worker, at shoulder height, static. In the foreground, the TC22 screen in his hand is clearly visible and readable as an app layout; in the background, the whole front of the pallet is in frame, top row to bottom row, with every label visible. Leave the top-right corner and the bottom-right corner of the frame visually calm (plain racking or floor), with nothing important there.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high. EVERY one of the 12 cartons — all three columns and all four rows — carries one white label on its front face, in the same position (upper-left of the face). No carton is without a label. The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
Device: a Zebra TC22 — a compact phone-sized rugged handheld with a 6-inch screen, the size of an ordinary smartphone: it fits entirely inside his palm and is no longer than his hand. It looks like a modern all-touchscreen smartphone in a rugged black case: one touchscreen covers almost the entire front, with a thin bezel and an earpiece slot at the top; NO physical keypad, NO number keys, NO buttons of any kind on the front; NO pistol grip, NO handle, NO trigger. The only colour accent is a small yellow scan button on the side edge. Match tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg and tc22-tc27-photography-product-right-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg exactly.
How he holds it — this matters: the scan window is on the TOP EDGE of the device. He holds the TC22 in his right hand in front of his chest, almost flat, screen facing UP toward his face, tilted only slightly forward, so that the TOP EDGE points straight at the label like the tip of a pointer. He glances down at the screen between reads. The screen never faces the label, and the device is never held upright like a camera.
Scan light: only while he presses the yellow side button, a soft red LED glow comes out of the TOP EDGE and lands on the label, with one small, sharp red aiming dot in its centre. The red dot lands on the centre of exactly ONE barcode at a time — never between barcodes, never on text, never on the bare carton. At each beep the light switches off at once. The screen itself never glows red. It is a dot, not a laser line.
Screen content: a simple Android receiving app in light mode — a coloured app bar at the top, below it a list of rows, each row a small barcode icon and a short grey text bar, and a thin progress bar at the bottom. Each time a barcode is read, one new row slides in at the top of the list with a small green check mark and the progress bar grows one step. All on-screen text is tiny and unreadable. No keyboard, no dial pad, no camera view on the screen.
Action, timed — he reads the barcodes on ONE label (the middle carton of the second row from the top) strictly one at a time, top to bottom, a short beep at each read:
0–2 s: red dot on the centre of the FIRST 1D barcode (top of the label's left column); beep; one new row with a green check appears on the screen.
2–4 s: he tilts the device slightly so the top edge points lower; red dot on the SECOND 1D barcode; beep; new row.
4–6 s: THIRD 1D barcode; beep; new row.
6–8 s: FOURTH 1D barcode; beep; new row. Then he points the top edge up and to the right at the centre of the square Data Matrix code in the label's top-right corner; beep; new row. He looks slightly tired.
8–10 s: keeping the same flat grip, he takes one small step to his right and points the top edge at the label of the next carton in the same row, without touching it. He stays in frame.
The labels: large white multi-barcode labels, laid out like a typical component reel label: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner (a Data Matrix has a solid L-shaped border on two sides — it is NOT a QR code with three corner squares), and an empty bottom-right corner. All printed characters are tiny, generic and unreadable; no words, no brand names, no model names on the labels.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience and a short scanner beep at each read; no speech, no music.
Avoid: cartons without labels, oversized device, tablet, device larger than a phone, screen facing the label, holding the device upright like a camera, red glow on the screen, light coming from the back or the screen, QR codes, readable words on labels, the words "Zebra" or "TC22" on labels, keyboard or dial pad on screen, pistol-grip scanner, gun-shaped scanner, handle, trigger, physical keypad, number keys, feature phone, lifting, holding or touching a carton, horizontal laser line, red line, green dot, light staying on between reads, red dot between barcodes or on text or on bare cardboard, logos or text anywhere in the frame, watermarks, distorted hands, extra fingers, warped devices, walking out of frame, anyone looking at the camera.
```

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
The labels: every carton carries one large white multi-barcode label, using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high, every label facing the camera.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: pistol-grip scanner, gun-shaped scanner, handle, trigger, keypad, number keys, small screen, feature phone, lifting or holding a carton, readable text, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R3 同時讀取：TC501 一次過讀完（10 秒）⭐ 建議先生成這段
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg`（兩張都是 TC501，不附標籤樣本）
```
Generate a 10-second 16:9 video clip.
Over-the-shoulder shot from behind the worker's right shoulder, very slow push-in toward the device screen. Both the TC501 screen and the real cartons behind it are visible and in focus.
Device: a Zebra TC501 — it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front, a thin top bezel with the earpiece and two small green indicator lights, a white ZEBRA wordmark on the bottom bezel; NO physical keypad, NO number keys, NO buttons of any kind on the front; NO pistol grip; green buttons on both side edges; match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg exactly. He holds it upright with both hands like taking a photo, rear camera aimed at the front of the pallet so that four to six carton labels are in the camera view.
Screen content: the live camera view of those labels — clean, minimal camera-app interface, no readable text on the screen.
Action, timed:
0–3 s: he holds the device steady; the screen shows the labels with no boxes yet.
3–4 s: at the same instant, a bright green rectangle appears around EVERY barcode on EVERY label in view — all four 1D barcodes and the square 2D code on each label, all together, not one by one.
4–6 s: a large green check mark appears on each label on the screen.
6–10 s: he keeps holding steady; the green boxes and check marks stay locked on the barcodes.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high. The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
Photorealistic corporate product film. Modern warehouse receiving area, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: any light projected from the device onto the cartons (no red dot, no red glow, no laser line, no green crosshair, no flash), pistol-grip scanner, keypad, number keys, small screen, feature phone, lifting or holding a carton, boxes appearing one at a time, readable text on screen or labels, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R4 移動追蹤：綠框跟隨（10 秒）
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg`（兩張都是 TC501，不附標籤樣本）
```
Generate a 10-second 16:9 video clip.
Over-the-shoulder shot from behind the worker's right shoulder; the camera follows with a gentle, slow pan. The TC501 screen and the real cartons are both visible.
Device: a Zebra TC501 — it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front, a thin top bezel with the earpiece and two small green indicator lights, a white ZEBRA wordmark on the bottom bezel; NO physical keypad, NO number keys, NO buttons of any kind on the front; NO pistol grip; green buttons on both side edges; match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg exactly. Held upright, rear camera aimed at the cartons.
Screen content: live camera view with bright green rectangles around every barcode in view and a green check mark on every completed label; clean, minimal interface, no readable text.
Action, timed:
0–2 s: he holds the device on the left column of cartons; all their labels already show green boxes and check marks.
2–8 s: he slowly moves the device from left to right across the pallet in one smooth motion; on the screen the green boxes stay locked onto each barcode as it moves, and every new label entering the view instantly gets green boxes on all its barcodes and then a check mark.
8–10 s: he holds steady on the right column; every label on screen shows green boxes and a check mark.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high. The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
Photorealistic corporate product film. Modern warehouse receiving area, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: any light projected from the device onto the cartons (no red dot, no red glow, no laser line, no green crosshair, no flash), pistol-grip scanner, keypad, number keys, small screen, feature phone, lifting or holding a carton, readable text on screen or labels, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R5 收貨核對：整個棧板打勾（10 秒）
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg`（兩張都是 TC501，不附標籤樣本）
```
Generate a 10-second 16:9 video clip.
Over-the-shoulder shot from behind the worker's right shoulder, then a slow pull-back to a medium shot; locked-off feel, very little movement.
Device: a Zebra TC501 — it looks like a modern all-touchscreen smartphone in a rugged black case: one large touchscreen covers almost the entire front, a thin top bezel with the earpiece and two small green indicator lights, a white ZEBRA wordmark on the bottom bezel; NO physical keypad, NO number keys, NO buttons of any kind on the front; NO pistol grip; green buttons on both side edges; match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg exactly.
Screen content: the live camera view of the whole pallet; every one of the 12 labels shows green boxes on all its barcodes and a green check mark; clean, minimal interface, no readable text.
Action, timed:
0–4 s: he holds the TC501 aimed at the whole pallet; the screen shows all 12 labels checked in green.
4–6 s: he looks at the screen and gives a small, satisfied nod.
6–8 s: he slowly lowers the device to his side.
8–10 s: he looks calmly at the pallet, standing still.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high. The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
Photorealistic corporate product film. Modern warehouse receiving area, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: any light projected from the device onto the cartons (no red dot, no red glow, no laser line, no green crosshair, no flash), pistol-grip scanner, keypad, number keys, small screen, feature phone, lifting or holding a carton, readable text on screen or labels, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

---

## 生成後檢查（每段）
1. **設備外形**：TC22 和 TC501 都像手機、**沒有槍柄**，正面是**整面螢幕、沒有實體鍵盤**；側鍵顏色正確（TC22 黃色、TC501 綠色）
2. **R1**：TC22 每次按鍵只**閃一下**紅光：紅色光暈加中心一粒小紅點，**不是激光線、不是綠點**，嗶一聲後即熄。紅點每次只落在**一個**條碼正中，順序是左邊第 1 至第 4 條，最後是 Data Matrix。紅光不可落在條碼之間或文字上
2a. **棧板**：12 箱**全部有標籤**；紙箱一直留在棧板上，工作人員**沒有拿起或觸碰任何紙箱**
2b. **R1 握法**：機和普通手機一樣大；螢幕向上對著他，**機頂**指向條碼；紅光只從機頂射出，螢幕不發紅光；螢幕顯示收貨 App，每讀一個多一行勾號
2c. **標籤**：二維碼是 Data Matrix（L 形邊框），不是 QR；標籤上沒有可讀文字（例如「Zebra」、「TC22」）
2d. **後期**：用 `scripts/overlay-brand.sh` 加 Logo 和字幕，AI 生成的畫面本身不應有任何 Logo 或文字
3. **R2–R5**：TC501 不向紙箱投射任何光（沒有紅點、紅光、激光線、閃光燈）。**R3–R5**：綠框**同時**出現在全部條碼上，然後出現勾號；螢幕上沒有亂碼文字
4. **標籤**：左邊 4 條一維條碼加右上角 Data Matrix。**不可出現樣本上的任何真實資料**：料號 7D.22814.09B、數量 3000、批號、日期、Reel ID、Qisda、無鉛標誌。如果看到這些字樣，就要重新生成
5. **人物**：與 `worker.png` 是同一人，沒有望向鏡頭

合格後下載，命名為 `r1.mp4` … `r5.mp4`，上傳給我。
