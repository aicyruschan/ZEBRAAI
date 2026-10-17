// 產品圖量度（像素，原圖 1920×1280），由 PIL 偵測得出
export const productBoxes: Record<string, [number, number, number, number]> = {
  "1.jpg": [729, 103, 1169, 1194],
  "2.jpg": [699, 113, 1223, 1196],
  "3.jpg": [736, 106, 1174, 1201],
  "4.jpg": [743, 107, 1184, 1196],
};
export const SOURCE_SIZE: [number, number] = [1920, 1280];

// 2.jpg（正面）螢幕可視範圍
export const FRONT_SCREEN: [number, number, number, number] = [735, 204, 1188, 1106];
// 1.jpg（背面）後鏡頭模組（綠框）
export const BACK_CAMERA_MODULE: [number, number, number, number] = [744, 178, 806, 358];
