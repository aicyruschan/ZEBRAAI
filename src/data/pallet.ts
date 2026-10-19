// 收貨區「世界座標」（1920 × 1080）：一個棧板疊放 12 箱貨（3 列 × 4 層）。
// 每箱貼一張多條碼標籤（版式參照用戶提供的樣本，內容全部虛構）：
// 頂部一行說明文字、左邊 4 條一維條碼（各有欄位名稱及一行字）、右上角 Data Matrix、右下角留空。
// 鏡頭（Camera）把世界座標換算成任意視窗（全畫面或 TC501 螢幕），圖形與邊界框因此永遠對齊。
export type CodeType = "1D" | "DM";
export type Role = "b1" | "b2" | "b3" | "b4" | "dm";

export type Code = { id: string; carton: number; role: Role; type: CodeType; x: number; y: number; w: number; h: number };
export type Carton = { n: number; x: number; y: number; w: number; h: number; sku: string; qty: number; label: { x: number; y: number; w: number; h: number } };

export const WORLD = { w: 1920, h: 1080 };
export const FLOOR_Y = 930;
export const PALLET = { x: 570, y: 900, w: 780, h: 56 };

const COLS = 3;
const TIERS = 4;
const CW = 254;
const CH = 186;

// 收貨單上的 4 個 SKU（虛構示範）及每箱數量
export const ORDER = [
  { sku: "DEMO-A101", perBox: 24 },
  { sku: "DEMO-B205", perBox: 12 },
  { sku: "DEMO-C310", perBox: 36 },
  { sku: "DEMO-D412", perBox: 18 },
];

// 多條碼標籤版式（世界座標，像素）：4 行一維條碼的 y 位置及闊度、Data Matrix 邊長
export const LABEL = {
  w: 200,
  h: 150,
  pad: 12,
  barH: 16,
  dm: 50,
  rows: [
    { y: 27, w: 118 },
    { y: 58, w: 76 },
    { y: 89, w: 128 },
    { y: 120, w: 76 },
  ],
};

const jitter = [0, 5, -4, 3, -6, 2, 6, -3, 1, -5, 4, -2];
export const cartons: Carton[] = [];
export const codes: Code[] = [];

for (let tier = 0; tier < TIERS; tier++) {
  for (let col = 0; col < COLS; col++) {
    const n = tier * COLS + col + 1; // 1–12，由下而上、由左至右
    const w = CW - (n % 3) * 4;
    const h = CH - (n % 2) * 6;
    const x = PALLET.x + col * (CW + 9) + (CW - w) / 2 + jitter[n - 1];
    const y = PALLET.y - (tier + 1) * (CH + 2) + (CH - h);
    const o = ORDER[(n - 1) % ORDER.length];
    const label = { x: x + (w - LABEL.w) / 2, y: y + (h - LABEL.h) / 2, w: LABEL.w, h: LABEL.h };
    cartons.push({ n, x, y, w, h, sku: o.sku, qty: o.perBox, label });
    LABEL.rows.forEach((r, i) => {
      codes.push({ id: `c${n}-b${i + 1}`, carton: n, role: `b${i + 1}` as Role, type: "1D", x: label.x + LABEL.pad, y: label.y + r.y, w: r.w, h: LABEL.barH });
    });
    codes.push({ id: `c${n}-dm`, carton: n, role: "dm", type: "DM", x: label.x + label.w - LABEL.pad - LABEL.dm, y: label.y + LABEL.pad, w: LABEL.dm, h: LABEL.dm });
  }
}

// 示範清單：n 箱，SKU 按收貨單循環分配（與 cartons 的分配規則一致）
export const demoItems = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ n: i + 1, sku: ORDER[i % ORDER.length].sku, qty: ORDER[i % ORDER.length].perBox }));

export type Camera = { cx: number; cy: number; scale: number };
export type Viewport = { w: number; h: number };
export const FULL: Viewport = { w: 1920, h: 1080 };

export const toView = (cam: Camera, vp: Viewport, x: number, y: number): [number, number] => [
  (x - cam.cx) * cam.scale + vp.w / 2,
  (y - cam.cy) * cam.scale + vp.h / 2,
];

export const lerpCam = (a: Camera, b: Camera, t: number): Camera => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  scale: a.scale + (b.scale - a.scale) * t,
});

// 鏡頭
// S1 特寫：對準 TARGET_CARTON 的標籤，標籤偏左上，右下留位置給 TC22
export const TARGET_CARTON = 5;
const tl = cartons[TARGET_CARTON - 1].label;
export const CLOSE: Camera = { cx: tl.x + tl.w / 2 + 60, cy: tl.y + tl.h / 2 + 90, scale: 2.2 };
export const SPLIT: Camera = { cx: 1320, cy: 540, scale: 1 }; // S2–S5 左側實景（棧板在畫面左半）
// TC501 螢幕內的相機畫面：讓整個棧板塞滿螢幕寬度
export const screenCam = (vp: Viewport): Camera => ({ cx: PALLET.x + PALLET.w / 2, cy: 545, scale: vp.w / 860 });
