# TC501 EP01：Gemini 影片生成 Prompt（每段 10 秒）

> 用法：在你建立的 Gem「Zebra AI Video Generation」中，先貼「開場訊息」一次，之後逐段貼上 R1 → R5。
> 如果 Gem 內不能生成影片，就把同一段 Prompt 貼到 Gemini 的影片生成，並附上該段列出的參考圖。
> 每段都是 **16:9、10 秒**。如果介面最長只有 8 秒，也可以照用，專案會自動配合。

## 片段與影片時間軸的對應
| 片段 | 場景（影片時間） | 後期怎樣用這 10 秒 |
|---|---|---|
| R1 | S1 痛點（0–8 秒） | 取頭 8 秒，所以主要動作要在 8 秒內完成 |
| R2 | S2 登場（8–16 秒） | 取頭 8 秒 |
| R3 | S3 同時讀取（16–28 秒） | 放慢至 0.83 倍，補足 12 秒 |
| R4 | S4 移動追蹤（28–38 秒） | 原速，剛好 10 秒 |
| R5 | S5 收貨核對（38–48 秒） | 原速，剛好 10 秒 |
| — | S6、S7（48–62 秒） | 不用 Gemini，用官方產品圖製作 |

---

## 開場訊息（只需貼一次）
```
For this session, every clip is 10 seconds long, 16:9, photorealistic. Ignore the 8-second default in your instructions. Follow the timed beats in each request so the main action happens at the stated seconds. Generate one clip per message. Keep the same worker (worker.png), the same pallet and the same warehouse in every clip, and match the Zebra devices exactly to the uploaded reference renders.
```

---

## R1 痛點（10 秒）
**附上參考圖**：`worker.png`、`tc22-tc27-photography-product-eight-pin-back-right-tilted-view-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc22-tc27-photography-product-right-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg`
```
Generate a 10-second 16:9 video clip.
Medium side shot, static camera.
Device: a Zebra TC22 handheld mobile computer — match tc22-tc27-photography-product-eight-pin-back-right-tilted-view-3x2-3600.jpg.imgw.1920.1920.jpg and tc22-tc27-photography-product-right-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg exactly (black body, yellow side scan button).
Action, timed:
0–3 s: the worker aims the TC22 at one carton's barcode label; a thin red aiming line lights up that single label; he presses the yellow side scan button.
3–6 s: he turns to the next carton and scans its label the same way, one label at a time.
6–8 s: he bends down to a lower carton and scans it, looking slightly tired.
8–10 s: he straightens up and reaches toward the next carton.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with 12 brown corrugated cartons, 3 across and 4 high. Each carton has one white shipping label showing barcodes only, no readable text, with clear space between the label and any other sticker.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: readable text, subtitles, watermarks, extra logos, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R2 登場（10 秒）
**附上參考圖**：`worker.png`、`tc22-tc27-photography-product-eight-pin-back-right-tilted-view-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`
```
Generate a 10-second 16:9 video clip.
Slow gimbal pull-back.
Devices: the Zebra TC22 he puts down must match tc22-tc27-photography-product-eight-pin-back-right-tilted-view-3x2-3600.jpg.imgw.1920.1920.jpg (black body, yellow side scan button); the Zebra TC501 he picks up must match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg exactly (black body, green-accented side buttons).
Action, timed:
0–3 s: the worker places the TC22 on a small cart beside him.
3–6 s: he picks up the TC501 from the cart and takes two steps back from the pallet.
6–8 s: he raises the TC501 with both hands, rear camera aimed at the whole pallet, relaxed and confident.
8–10 s: he holds the device steady, aimed at the pallet.
The worker and pallet occupy the left two-thirds of the frame; the right third is softly blurred racking.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with 12 brown corrugated cartons, 3 across and 4 high. Each carton has one white shipping label showing barcodes only, no readable text, with clear space between the label and any other sticker.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: readable text, subtitles, watermarks, extra logos, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R3 同時讀取（10 秒）⭐ 建議先生成這段
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg`
```
Generate a 10-second 16:9 video clip.
Steady three-quarter rear view from slightly behind the worker's left shoulder, very slow push-in over the full 10 seconds, almost no other movement.
Device: a Zebra TC501 — match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg exactly. The worker holds it at chest height with both hands, rear camera aimed at the pallet; the device screen faces away from the camera and is never visible.
Action, timed:
0–10 s: the worker holds the TC501 perfectly steady, aimed at the whole pallet; only tiny natural breathing movement.
Framing (important for post-production): the pallet fills about 90% of the frame height and sits in the left two-thirds of the frame; all 12 white labels stay sharp, fully visible and unobstructed for the whole clip. The right third is softly blurred racking.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with 12 brown corrugated cartons, 3 across and 4 high. Each carton has one white shipping label showing barcodes only, no readable text, with clear space between the label and any other sticker.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: readable text, subtitles, watermarks, extra logos, distorted hands, extra fingers, warped devices, anyone looking at the camera, visible device screen.
```

## R4 移動追蹤（10 秒）
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg`
```
Generate a 10-second 16:9 video clip.
Same three-quarter rear framing from behind the worker's left shoulder; the camera follows with a gentle, slow pan.
Device: a Zebra TC501 — match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg exactly; the screen faces away from the camera and is never visible.
Action, timed:
0–2 s: the worker holds the TC501 aimed at the left side of the pallet.
2–8 s: he slowly sweeps the TC501 from left to right across the whole pallet in one smooth, continuous motion.
8–10 s: he holds it steady at the right side of the pallet.
Framing: the pallet fills about 90% of the frame height in the left two-thirds of the frame; all white labels stay visible and unobstructed throughout.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with 12 brown corrugated cartons, 3 across and 4 high. Each carton has one white shipping label showing barcodes only, no readable text, with clear space between the label and any other sticker.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: readable text, subtitles, watermarks, extra logos, distorted hands, extra fingers, warped devices, anyone looking at the camera, visible device screen.
```

## R5 收貨核對（10 秒）
**附上參考圖**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg`
```
Generate a 10-second 16:9 video clip.
Locked-off camera on the same pallet.
Device: a Zebra TC501 — match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg exactly; the screen is angled away from the camera and never visible.
Action, timed:
0–3 s: the worker looks down at the TC501 in his hands.
3–5 s: he gives a small, satisfied nod.
5–8 s: he slowly lowers the device to his side.
8–10 s: he looks calmly at the pallet, standing still.
Framing: the pallet fills about 90% of the frame height in the left two-thirds of the frame; all white labels stay visible; the right third is clean, softly blurred racking.
The worker: the same person as in worker.png — an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with 12 brown corrugated cartons, 3 across and 4 high. Each carton has one white shipping label showing barcodes only, no readable text, with clear space between the label and any other sticker.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: readable text, subtitles, watermarks, extra logos, distorted hands, extra fingers, warped devices, anyone looking at the camera, visible device screen.
```

---

## 生成後檢查（每段）
1. 機身外觀與參考圖一致：鏡頭位置、側鍵顏色、ZEBRA 字樣
2. 標籤沒有亂碼文字
3. 與 `worker.png` 是同一人，沒有望向鏡頭
4. R3–R5：棧板佔畫面高度約九成、位於左側三分之二，12 個白色標籤全程清晰、沒有被手或設備遮住

合格後下載，命名為 `r1.mp4` … `r5.mp4`，上傳給我。
