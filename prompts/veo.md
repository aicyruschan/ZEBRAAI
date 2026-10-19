# TC501 EP01 寫實版：Claude 劇本 → Gemini / Veo 逐段 Prompt

> ⚠ **已停用（2026-10-19）**：本檔的 R1–R5 Prompt 不符合用戶訂立的三個原則：
> - 沒有寫明 TC22 外形似手機、沒有槍柄
> - 標籤只有單一條碼
> - TC501 螢幕背向鏡頭
>
> 請改用 **`prompts/gemini-10s.md` 第 2 版**。本檔只保留作記錄（規格表及 Veo 限制說明仍然有效）。


> 流程：Claude 寫劇本及 Prompt（本檔）→ 你在 Gemini（Veo）逐段生成 → 下載 MP4，改名為 `r1.mp4` … `r5.mp4` 上傳給我 → 我放入 `assets/clips/`，追蹤標籤、合成 TC501 螢幕畫面、加字幕、音樂和音效，渲染 `TC501-EP01-Real`。

## 規格（2026-10-19 核實）
| 項目 | 內容 | 來源 |
|---|---|---|
| 每段長度 | Veo 3.1 可選 4／6／8 秒；**用參考圖生成時只支援 8 秒** | [Google Cloud：Veo 3.1](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate) |
| 參考圖 | 最多 3 張 | [Gemini API：Veo](https://ai.google.dev/gemini-api/docs/veo) |
| 比例 | 16:9（預設） | 同上 |
| 原生音效 | Veo 會自動生成聲音；**放入專案後會被靜音**，聲音由專案的音樂和音效負責 | 同上 |
| Gemini App 每日次數 | 第三方資料：Pro 每日約 3 段、Ultra 約 5 段（**未核實**，以 App 顯示為準） | [第三方](https://www.veo3ai.io/blog/gemini-omni-video-length-limit) |

**每段 8 秒和場景長度的配合**：專案會自動把較短的片段放慢播放。
- S1、S2：場景 8 秒，正常速度
- S4、S5：場景 10 秒，0.8 倍
- S3：場景 12 秒，0.67 倍。所以 R3 刻意寫成「幾乎靜止的持機畫面」，放慢後也不易察覺。如果你的 Gemini 可以生成 10 秒，就生成 10 秒。

**參考圖**：如果 Gemini App 只接受一張圖，請改用 Google Flow 的「以素材生成影片」（Ingredients），它最多支援 3 張參考圖。功能名稱以介面為準，我未能核實。

## Gemini 筆記本中的官方參考圖（用戶已上傳，2026-10-19）
| 機型 | 角度 | 檔名 |
|---|---|---|
| TC22 | 背面右傾 | `tc22-tc27-photography-product-eight-pin-back-right-tilted-view-3x2-3600.jpg.imgw.1920.1920.jpg` |
| TC22 | 正面 | `tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg` |
| TC22 | 左側 | `tc22-tc27-photography-product-left-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg` |
| TC22 | 右側 | `tc22-tc27-photography-product-right-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg` |
| TC501 | 背面左側 | `tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg` |
| TC501 | 正面 | `tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg` |
| TC501 | 左前 | `tc501-photography-website-render-utility-front-left-3x2-3600.jpg.imgw.1920.1920.jpg` |
| TC501 | 右前 | `tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg` |

TC22 的官方檔名寫明是 `tc22-tc27`，即兩款共用同一組渲染圖，這解釋了為何正面圖螢幕上有 5G 圖示。

### 開場訊息（第一次在筆記本生成前先貼上，讓 Gemini 記住檔案對照）
```
I have uploaded official Zebra product renders to this notebook. Please use them as visual references and match the devices exactly:
- Zebra TC22 (black body, yellow side scan button): tc22-tc27-photography-product-eight-pin-back-right-tilted-view-3x2-3600.jpg.imgw.1920.1920.jpg, tc22-tc27-photography-product-front-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg, tc22-tc27-photography-product-left-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg, tc22-tc27-photography-product-right-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg
- Zebra TC501 (black body, green-accented side buttons, ZEBRA wordmark under the screen): tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg, tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg, tc501-photography-website-render-utility-front-left-3x2-3600.jpg.imgw.1920.1920.jpg, tc501-photography-website-render-utility-front-right-3x2-3600.jpg.imgw.1920.1920.jpg
I will ask for five separate 8-second 16:9 video clips (R1 to R5). Generate one clip per request, keep the same worker, pallet and warehouse across all clips, and never invent device details that are not in these renders.
```

---

## 第 0 步：人物設定圖（Gemini 圖片生成）→ `worker.png`
先生成一張人物設定圖，作為 R1–R5 共用的人物參考，令五段都是同一個人。描述與每段 Veo Prompt 中的 "The worker" 完全一致。

```
Character reference sheet for a photorealistic corporate video. One single person shown in three views side by side on one image, left to right: full-body front view, full-body three-quarter view, full-body left side profile. Exactly the same person, outfit and proportions in all three views.
The person: an East Asian man in his early 30s, average build, about 175 cm tall, short neat black hair, clean-shaven, friendly calm expression, natural skin texture.
Outfit: plain dark grey work jacket with a zip front and matching dark grey work trousers, plain black crew-neck T-shirt underneath, black safety work shoes. No logos, no name badge, no text, no patterns on the clothing. Empty hands relaxed at his sides.
Pose: standing naturally, feet slightly apart, looking straight ahead in each view (not at the camera in the side view).
Background: plain seamless light grey studio background, soft even studio lighting, no shadows on the background, no props.
Style: photorealistic, sharp focus, true-to-life colours, 16:9 landscape image, high resolution.
Avoid: text, labels, watermarks, logos, extra people, different outfits between views, cartoon or illustration style, distorted hands, extra fingers.
```
**檢查重點**：
- 三個角度是否同一個人：髮型、臉形、衣服顏色一致
- 衣服上不可有任何標誌或文字
- 雙手正常（五隻手指）

滿意後下載，存為 `worker.png`，上傳到同一個 Gemini 筆記本。

> 這是 AI 虛構的人物，不要以真人照片作參考，以免涉及肖像權。

---

## 全片劇本（62 秒）
| 場景 | 時間 | 旁白（普通話） | 實景片段（Veo） | 後期疊加（Remotion） |
|---|---|---|---|---|
| S1 痛點 | 0–8 | 貨架上、包裹上、標籤上，到處都是條碼。傳統做法，只能一個一個掃。 | **R1**：工作人員用 TC22 逐箱掃描 | 「已掃描」計數 |
| S2 登場 | 8–16 | 現在，用 Zebra TC501 拍一下就好。 | **R2**：放下 TC22，舉起 TC501 對準棧板 | 12 秒起，右側 TC501 螢幕亮起 |
| S3 同時讀取 | 16–28 | AI 條碼解碼器自動找出畫面中的一維和二維條碼，逐一框選，同時解碼。 | **R3**：穩定持機對準棧板 | 螢幕實景上的標籤同時變綠，左上角顯示「已讀取 N 個條碼」 |
| S4 移動追蹤 | 28–38 | 鏡頭移動，框選即時跟隨，結果馬上列出。 | **R4**：持機由左至右掃視 | 綠框跟隨移動，再切換到結果清單 |
| S5 收貨核對 | 38–48 | 配合 App 與收貨單比對，對得上的貨物即時變綠，收貨一目了然。 | **R5**：看螢幕、點頭 | 收貨單逐箱打勾 |
| S6 相機規格 | 48–56 | TC501 配備五千萬像素主相機，並可選配一千三百萬像素超廣角後鏡頭。 | 不用 Veo | 官方產品圖＋規格 |
| S7 結尾 | 56–62 | Zebra TC501，讓 AI 走到第一線。 | 不用 Veo | 產品圖、標誌、「部分畫面由 AI 生成」 |

---

## 使用方法
1. 先貼上方的「開場訊息」一次。之後每段只要**整塊複製下面的英文 Prompt**，人物、棧板和風格已經寫在每一段內，確保五段一致。Veo 對英文 Prompt 的理解一般較穩定。
2. **人物要一致**：先按「第 0 步」生成人物設定圖 `worker.png`，上傳到同一個筆記本。R1–R5 的 Prompt 都已寫明要參考它。
3. 每段都選 **16:9、8 秒**。
4. **生成後要檢查**：
   - TC501 和 TC22 的外觀是否與官方圖相符：鏡頭位置、側鍵顏色、ZEBRA 字樣
   - 標籤上有沒有出現亂碼文字
   - 人物有沒有望向鏡頭

   不合格就重新生成。

---

## R1 痛點（8 秒 → `r1.mp4`）
**參考圖（3 張）**：`worker.png`、`tc22-tc27-photography-product-eight-pin-back-right-tilted-view-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc22-tc27-photography-product-right-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg`
```
Medium side shot, static camera. The worker from worker.png stands in front of a pallet holding a Zebra TC22 handheld mobile computer (match the reference images tc22-tc27-photography-product-eight-pin-back-right-tilted-view-3x2-3600.jpg.imgw.1920.1920.jpg and tc22-tc27-photography-product-right-facing-with-shadow-3x2-3600.jpg.imgw.1920.1920.jpg exactly: black body, yellow side scan button). He scans the cartons one at a time: a thin red aiming line lights up a single barcode label, he presses the yellow side scan button, then bends and turns to the next carton. Repetitive, slightly tired movement.
The worker: an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with 12 brown corrugated cartons, 3 across and 4 high. Each carton has one white shipping label showing barcodes only, no readable text, with clear space between the label and any other sticker.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, shallow depth of field, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: readable text, subtitles, watermarks, extra logos, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R2 登場（8 秒 → `r2.mp4`）
**參考圖（3 張）**：`worker.png`（第 0 步人物設定圖）、`tc22-tc27-photography-product-eight-pin-back-right-tilted-view-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`
```
Slow gimbal pull-back. The same worker as in worker.png places a Zebra TC22 (match tc22-tc27-photography-product-eight-pin-back-right-tilted-view-3x2-3600.jpg.imgw.1920.1920.jpg exactly: black body, yellow side scan button) on a small cart beside him, picks up a Zebra TC501 handheld mobile computer (match tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg exactly: black body, green-accented side buttons), takes two steps back and raises it with both hands, rear camera aimed at the whole pallet, with a relaxed, confident expression. The worker and pallet occupy the left two-thirds of the frame; the right third is softly blurred racking.
The worker: an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with 12 brown corrugated cartons, 3 across and 4 high. Each carton has one white shipping label showing barcodes only, no readable text, with clear space between the label and any other sticker.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, shallow depth of field, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: readable text, subtitles, watermarks, extra logos, distorted hands, extra fingers, warped devices, anyone looking at the camera.
```

## R3 同時讀取（8 秒 → `r3.mp4`，播放時放慢至 0.67 倍）
**參考圖（3 張）**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg`
```
The device is a Zebra TC501; match the reference images tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg exactly. The worker is the same person as in worker.png.
Steady three-quarter rear view from slightly behind the worker's left shoulder, very slow push-in, almost no movement. The worker holds the Zebra TC501 at chest height with both hands, rear camera aimed at the pallet; the device screen faces away from the camera and is not visible. The pallet fills about 90% of the frame height and sits in the left two-thirds of the frame; every white label is clearly visible and in focus. The right third is softly blurred racking.
The worker: an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with 12 brown corrugated cartons, 3 across and 4 high. Each carton has one white shipping label showing barcodes only, no readable text, with clear space between the label and any other sticker.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: readable text, subtitles, watermarks, extra logos, distorted hands, extra fingers, warped devices, anyone looking at the camera, visible device screen.
```

## R4 移動追蹤（8 秒 → `r4.mp4`，播放時放慢至 0.8 倍）
**參考圖（3 張）**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg`
```
The device is a Zebra TC501; match the reference images tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg exactly. The worker is the same person as in worker.png.
Same framing as a three-quarter rear view from behind the worker's left shoulder. The worker slowly sweeps the Zebra TC501 from left to right across the pallet in one smooth motion, as if scanning the whole stack; the device screen faces away from the camera. The camera follows with a gentle, slow pan. The pallet fills about 90% of the frame height in the left two-thirds of the frame; every white label stays clearly visible.
The worker: an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with 12 brown corrugated cartons, 3 across and 4 high. Each carton has one white shipping label showing barcodes only, no readable text, with clear space between the label and any other sticker.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: readable text, subtitles, watermarks, extra logos, distorted hands, extra fingers, warped devices, anyone looking at the camera, visible device screen.
```

## R5 收貨核對（8 秒 → `r5.mp4`，播放時放慢至 0.8 倍）
**參考圖（3 張）**：`worker.png`、`tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg`、`tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg`
```
The device is a Zebra TC501; match the reference images tc501-photography-website-render-utility-front-3x2-3600.jpg.imgw.1920.1920.jpg and tc501-photography-website-render-utility-back-left-3x2-3600.jpg.imgw.1920.1920.jpg exactly. The worker is the same person as in worker.png.
Locked-off camera on the same pallet. The worker looks down at the Zebra TC501 (screen angled away from the camera), gives a small satisfied nod, then lowers the device to his side. The pallet fills about 90% of the frame height in the left two-thirds of the frame; every white label stays clearly visible; the right third is clean, softly blurred racking.
The worker: an East Asian man in his early 30s, short black hair, clean-shaven, dark grey work jacket and matching trousers.
The pallet: a black plastic pallet stacked with 12 brown corrugated cartons, 3 across and 4 high. Each carton has one white shipping label showing barcodes only, no readable text, with clear space between the label and any other sticker.
Photorealistic corporate product film. Modern warehouse receiving area, grey concrete floor with yellow safety lines, tidy metal racking softly blurred in the background. Clean LED light mixed with daylight, neutral colour grade, 16:9.
Audio: quiet warehouse ambience only, no speech, no music.
Avoid: readable text, subtitles, watermarks, extra logos, distorted hands, extra fingers, warped devices, anyone looking at the camera, visible device screen.
```

---

## 備註
- **人物**：我設定為「30 歲出頭的東亞男性」，因為五段分開生成，需要寫明確的外貌才能保持一致。想改性別或外貌的話，五段都要改成同一個描述。
- **TC22**：按你的決定使用，風險見 `research/selfcheck.md`。旁白和字幕都沒有寫 TC22「舊」或「做不到」。
- **生成順序建議**：先只生成 R3。它最考驗標籤追蹤和 TC501 外觀，上傳給我確認效果後再生成其餘四段。
