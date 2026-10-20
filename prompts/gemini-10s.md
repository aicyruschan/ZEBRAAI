# TC501 EP01：Gemini 影片生成 Prompt（每段 10 秒）· 第 7 版

> **第 7 版改動（2026-10-20，按 R1 第四次試片）**
> 1. **全部箱貼同一款標籤**：同一批貨，每箱的標籤一模一樣，位置相同，大小相同
> 2. **R1 只讀同一箱同一張標籤**：依次讀第 1 至第 4 條一維條碼，最後讀 Data Matrix，節奏刻意放慢
> 3. **R1 改為兩步**：先做首格圖（R1-A），再用相片轉影片（R1-B）
> 4. **紙箱不印任何符號**：試片的箱印了向上箭咀和雨傘等搬運符號，令畫面雜亂


> **第 6 版改動（2026-10-20，按 R1 第三次試片）**
> 1. 每箱只貼**一張**多條碼標籤，在正面左半邊；刪除旁邊另貼的二維碼貼紙
> 2. 機身和螢幕**不可出現紅燈**，紅光只會出現在標籤上
> 3. **新增「寫實規則」，R1–R5 全部適用**：這不是科幻片。實物標籤不會自己變綠、出勾號或出框；綠框和勾號只可在螢幕上出現；全片一個鏡頭，中途不可換場景；按掃描鍵時機頂一定要指着條碼，不可讀空氣，也不可有無意義的動作
> 4. R1 最後 2 秒改為：放鬆按鍵，把機放低看螢幕上的紀錄，不再按鍵
> 5. 握法改為「像拿電視遙控器指向標籤」：試片中機是直立的，機頂朝天，紅光卻落在紙箱上，物理上不可能
> 6. 其他試片問題，全部已寫入 Avoid：
>    - 第 7 秒突然換場景
>    - 工人有鬚，與 worker.png 不符
>    - 標籤上有 EAC 認證和回收標誌
>    - 標籤上出現取景框
>    - 紅光落在兩箱之間的縫
>    - 箱側也貼了標籤


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
Realism rule: this is a real product film, not science fiction. Real labels and cartons never glow, change colour or show icons; green boxes and check marks appear ONLY on a device screen. One continuous shot per clip, no cuts. Every action has a physical cause and a purpose — no scanning empty air, no pointless gestures.
Label rule: one label per carton only, on the left half of the front face; no extra stickers or certification marks. "multi barcode label sample.jpeg" is ONLY an example of what a multi-barcode label looks like. Copy its layout (caption line, four stacked 1D barcodes on the left, one Data Matrix top-right). Never reproduce its data — no part number, quantity, lot number, dates, reel ID, company name, symbols or barcode patterns. I will NOT attach it to the clips; follow the written label description instead.
```

---

## R1 痛點：TC22 逐個讀（10 秒）· 第 7 版：先做首格圖，再生成影片

> **為甚麼改做法**：第 3、4 次試片都出現同樣三個問題。模型每次都把機直立拿著，紅光就沒有來源；紅光在不同紙箱之間亂跳；有些箱沒有標籤。原因是 Prompt 要同時顧及太多東西：整個棧板、App、紅光和節拍。
>
> 第 7 版分兩步做：
> 1. **R1-A**：先用 Gemini 圖片生成一張「首格圖」，把握法、標籤、設備全部固定。靜態圖改錯很便宜，不合格就重做。
> 2. **R1-B**：用 Gemini 的「相片轉影片」功能，把 R1-A 的圖作為**第一格**，Prompt 只描述動作。
>
> 鏡頭也收窄了：只拍一箱的標籤加工人的手和機，旁邊只露出部分箱。在這個鏡頭裡，紅點沿同一張標籤由上至下移動，觀眾看得清楚，「逐個讀、很慢」的效果也更明顯。整個棧板的全景交給 R2 的拉遠鏡頭。

### R1-A 首格圖（Gemini 圖片生成）
**附上參考圖**：`worker.png`、`tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc22-tc27-photography-product-right-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg`
```
Photorealistic 16:9 still frame from a corporate product film.
Camera: high over-the-shoulder view from behind the worker's right shoulder, looking down past his right hand toward one carton. The carton's label fills the right half of the frame and is sharp; parts of the neighbouring cartons on the same pallet are visible around it.
The worker: the same person as in worker.png — East Asian man in his early 30s, short black hair, clean-shaven with no beard or stubble, dark grey work jacket. Only his right shoulder, arm, hand and the side of his head are visible.
The device: a Zebra TC22, matching the two TC22 reference images exactly — a phone-sized rugged handheld with a 6-inch all-touchscreen front, no keypad, no buttons on the front, no pistol grip, a small yellow scan button on the side. It is the size of an ordinary smartphone, no longer than his hand.
The grip — most important: he holds the TC22 like a TV remote control pointed at the label. The device lies roughly HORIZONTAL in his right hand, about 30 cm in front of the label, screen facing UP toward the camera, and the TOP EDGE of the device points straight at the label. The screen is clearly visible from this camera angle.
The screen: a simple Android receiving app in light mode — coloured app bar, an empty list area, a thin empty progress bar. All text tiny and unreadable.
The labels: every carton is the same product from the same shipment, so EVERY visible carton carries an IDENTICAL copy of the same white label, in the same position (left half of the front face) and the same size. The label: a small caption line at the top, four horizontal 1D barcodes stacked in the left column (each with a tiny caption above and a tiny line of digits below), one square Data Matrix code in the top-right corner (solid L-shaped border on two sides, not a QR code), empty bottom-right corner. All characters tiny, generic and unreadable. Exactly one label per carton, no other stickers, no printed symbols on the cartons, plain brown cardboard.
No light is on yet: no red glow, no red dot.
Setting: modern warehouse receiving area, grey concrete floor, metal racking softly blurred far behind. Clean LED light mixed with daylight, neutral colour grade. Top-right and bottom-right corners of the frame visually calm.
Avoid: device held upright, screen facing the label, oversized device, keypad, pistol grip, cartons without labels, labels that differ from each other, QR codes, readable words, logos, EAC or CE marks, printed symbols on cartons, beard or stubble, distorted hands, extra fingers.
```
**R1-A 合格條件（要全部做到才進 R1-B）**：
- 機是**橫放**的，螢幕向上、看得見，機頂指着標籤
- 機的大小與普通手機一樣，正面沒有鍵盤
- 看得見的每箱都有**一模一樣**的標籤，每箱只有一張
- 沒有紅光，沒有可讀文字
- 人沒有鬚

### R1-B 影片（Gemini「相片轉影片」：附上 R1-A 的圖作為第一格）
```
Animate this image as ONE continuous 10-second shot. The camera stays still. Nothing in the scene changes except his hand, the red scan light and the phone screen.
He reads the barcodes on THIS ONE label only, in order, one at a time, slowly and carefully — this method is deliberately slow and a little tedious. The device stays horizontal, screen up, top edge pointed at the label; he moves it only a few centimetres between reads.
Each read: he presses the yellow side button; a soft red glow with one small sharp red dot appears ON THE LABEL, exactly where the top edge points, on the centre of that barcode only; a short beep; the light switches off at once; one new row with a small green check appears on the phone screen; he glances down at the screen, then re-aims.
0–2 s: first barcode (top of the label's left column).
2–4 s: second barcode, directly below.
4–6 s: third barcode.
6–8 s: fourth barcode (bottom of the left column).
8–10 s: the square Data Matrix in the label's top-right corner; then he releases the button and looks down at the five checked rows on the screen. He does not scan again.
The red dot never leaves this label, never lands between barcodes, on text or on cardboard, and never goes to another carton. The phone itself never shows a red light. Real labels never change colour or show check marks; the check marks exist only on the phone screen. No cuts, no new objects, no graphics in the scene.
Audio: quiet warehouse ambience and one short scanner beep per read; no speech, no music.
```
**R1-B 檢查**：
- 紅點順序：第 1 → 2 → 3 → 4 條 → Data Matrix，全部在同一張標籤上
- 每讀一個，螢幕多一行勾號
- 機一直橫放
- 沒有換鏡頭
- 最後沒有再按鍵

**長度注意**：Google 2025 年 7 月公布的「相片轉影片」每段約 **8 秒**。如果你用的介面只出 8 秒，就把節拍改為每個條碼 1.5 秒，或者在後期把影片放慢至 0.8 倍。

**後期**：`scripts/overlay-brand.sh r1.mp4 r1-branded.mp4 "用 Zebra TC22 收貨"`

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
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high, every label facing the camera.
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
Screen content: the live camera view of those labels — clean, minimal camera-app interface, no readable text on the screen.
Action, timed:
0–3 s: he holds the device steady; the screen shows the labels with no boxes yet.
3–4 s: at the same instant, a bright green rectangle appears around EVERY barcode on EVERY label in view — all four 1D barcodes and the square 2D code on each label, all together, not one by one.
4–6 s: a large green check mark appears on each label on the screen.
6–10 s: he keeps holding steady; the green boxes and check marks stay locked on the barcodes.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high. The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
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
Screen content: live camera view with bright green rectangles around every barcode in view and a green check mark on every completed label; clean, minimal interface, no readable text.
Action, timed:
0–2 s: he holds the device on the left column of cartons; all their labels already show green boxes and check marks.
2–8 s: he slowly moves the device from left to right across the pallet in one smooth motion; on the screen the green boxes stay locked onto each barcode as it moves, and every new label entering the view instantly gets green boxes on all its barcodes and then a check mark.
8–10 s: he holds steady on the right column; every label on screen shows green boxes and a check mark.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high. The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
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
Screen content: the live camera view of the whole pallet; every one of the 12 labels shows green boxes on all its barcodes and a green check mark; clean, minimal interface, no readable text.
Action, timed:
0–4 s: he holds the TC501 aimed at the whole pallet; the screen shows all 12 labels checked in green.
4–6 s: he looks at the screen and gives a small, satisfied nod.
6–8 s: he slowly lowers the device to his side.
8–10 s: he looks calmly at the pallet, standing still.
The labels: large white multi-barcode labels, each using "multi barcode label sample.jpeg" ONLY as a layout example: a small caption line at the top, four horizontal 1D barcodes stacked on the left half (each with a tiny caption above and a tiny human-readable line below), one large square 2D Data Matrix code in the top-right corner, and an empty bottom-right corner. Do NOT reproduce any data from the sample: no part number, quantity, lot number, dates, reel ID, company name or symbols; all printed characters are generic, tiny and unreadable, and the barcode patterns are new, generic patterns. Each carton carries exactly ONE label: the multi-barcode label on the left half of its front face. No second sticker, no separate QR or Data Matrix sticker beside it, nothing on the side or top faces, and no certification or recycling marks (no EAC, CE or recycling symbols).
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with exactly 12 brown corrugated cartons, 3 across and 4 high. The cartons stay stacked on the pallet the whole time: he never lifts, picks up, holds, pulls out or touches any carton.
Photorealistic corporate product film. Modern warehouse receiving area, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Realism rules — this is a real product film, not science fiction: ONE continuous shot, no cuts, no change of location, camera angle, pallet, lighting or worker. The physical world never changes by itself: real labels and cartons never glow, change colour or show check marks, icons, frames or corner brackets; no holograms, no floating graphics, no AR overlays in the real scene. Green boxes and check marks exist ONLY on the device screen. The device screen and body never show a red light. Every action has a real cause and purpose: the scan button is pressed only while the top edge is pointed at a barcode — never scanning empty air, never a pointless gesture.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: any light projected from the device onto the cartons (no red dot, no red glow, no laser line, no green crosshair, no flash), pistol-grip scanner, keypad, number keys, small screen, feature phone, lifting or holding a carton, readable text on screen or labels, company logos, watermarks, distorted hands, extra fingers, warped devices, anyone looking at the camera, labels changing colour or showing check marks, corner brackets or frames on labels, floating graphics, cuts or scene changes, a second sticker or separate QR code beside the label, EAC, CE or recycling marks, beard or stubble.
```

---

## 生成後檢查（每段）
1. **設備外形**：TC22 和 TC501 都像手機、**沒有槍柄**，正面是**整面螢幕、沒有實體鍵盤**；側鍵顏色正確（TC22 黃色、TC501 綠色）
2. **R1**：TC22 每次按鍵只**閃一下**紅光：紅色光暈加中心一粒小紅點，**不是激光線、不是綠點**，嗶一聲後即熄。紅點每次只落在**一個**條碼正中，順序是左邊第 1 至第 4 條，最後是 Data Matrix。紅光不可落在條碼之間或文字上
2a. **棧板**：每箱都貼**同一款**標籤，位置和大小相同；12 箱**全部有標籤**；紙箱一直留在棧板上，工作人員**沒有拿起或觸碰任何紙箱**
2b. **R1 握法**：機和普通手機一樣大；螢幕向上對著他，**機頂**指向條碼；紅光只從機頂射出，螢幕不發紅光；螢幕顯示收貨 App，每讀一個多一行勾號
2c. **標籤**：二維碼是 Data Matrix（L 形邊框），不是 QR；標籤上沒有可讀文字（例如「Zebra」、「TC22」）
2e. **寫實**：全片一個鏡頭、沒有換場景；實物標籤沒有變色、勾號或取景框；沒有讀空氣或無意義動作；工人沒有鬚；每箱只有一張標籤，沒有 EAC 等認證標誌
2d. **後期**：用 `scripts/overlay-brand.sh` 加 Logo 和字幕，AI 生成的畫面本身不應有任何 Logo 或文字
3. **R2–R5**：TC501 不向紙箱投射任何光（沒有紅點、紅光、激光線、閃光燈）。**R3–R5**：綠框**同時**出現在全部條碼上，然後出現勾號；螢幕上沒有亂碼文字
4. **標籤**：左邊 4 條一維條碼加右上角 Data Matrix。**不可出現樣本上的任何真實資料**：料號 7D.22814.09B、數量 3000、批號、日期、Reel ID、Qisda、無鉛標誌。如果看到這些字樣，就要重新生成
5. **人物**：與 `worker.png` 是同一人，沒有望向鏡頭

合格後下載，命名為 `r1.mp4` … `r5.mp4`，上傳給我。
