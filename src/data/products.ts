// 產品圖量度（像素，原圖 1920×1280），由 PIL 偵測得出
export const productBoxes: Record<string, [number, number, number, number]> = {
  "1.jpg": [729, 103, 1169, 1194],
  "2.jpg": [699, 113, 1223, 1196],
  "2-cutout.png": [699, 113, 1223, 1196], // 2.jpg 去背版（scripts 內 PIL flood fill 生成）
  "3.jpg": [736, 106, 1174, 1201],
  "4.jpg": [743, 107, 1184, 1196],
};
export const SOURCE_SIZE: [number, number] = [1920, 1280];

// TC22（TC22／TC27 共用官方渲染圖）背面去背版：機身範圍、機頂中點（掃描窗）、機身自帶傾斜角
export const TC22_BACK = {
  file: "1-back-cutout.png",
  box: [610, 67, 1237, 1194] as [number, number, number, number],
  top: [868, 77] as [number, number],
  tiltDeg: -8.9,
};

// 2.jpg（正面）螢幕可視範圍
export const FRONT_SCREEN: [number, number, number, number] = [735, 204, 1188, 1106];
// 1.jpg（背面）後鏡頭模組（綠框）
export const BACK_CAMERA_MODULE: [number, number, number, number] = [744, 178, 806, 358];
