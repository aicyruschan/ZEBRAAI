// 收貨區「世界座標」（1920 × 1080）：一個棧板疊放 12 箱貨（3 列 × 4 層）。
// 每箱標籤有兩個一維條碼（SKU、數量），其中 4 箱另貼 QR 運輸標籤。
// 鏡頭（Camera）把世界座標換算成任意視窗（全畫面或 TC501 螢幕），圖形與邊界框因此永遠對齊。
export type CodeType = "1D" | "QR";
export type Role = "sku" | "qty" | "ship";

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
    const label = { x: x + w * 0.07, y: y + h * 0.2, w: 158, h: 118 };
    cartons.push({ n, x, y, w, h, sku: o.sku, qty: o.perBox, label });
    codes.push({ id: `c${n}-sku`, carton: n, role: "sku", type: "1D", x: label.x + 14, y: label.y + 26, w: 130, h: 34 });
    codes.push({ id: `c${n}-qty`, carton: n, role: "qty", type: "1D", x: label.x + 14, y: label.y + 76, w: 86, h: 28 });
    if (n % 3 === 2) codes.push({ id: `c${n}-ship`, carton: n, role: "ship", type: "QR", x: x + w - 52, y: y + h - 56, w: 40, h: 40 });
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
export const CLOSE: Camera = { cx: 960, cy: 520, scale: 1.55 }; // S1 特寫
export const SPLIT: Camera = { cx: 1320, cy: 540, scale: 1 }; // S2–S5 左側實景（棧板在畫面左半）
// TC501 螢幕內的相機畫面：讓整個棧板塞滿螢幕寬度
export const screenCam = (vp: Viewport): Camera => ({ cx: PALLET.x + PALLET.w / 2, cy: 545, scale: vp.w / 860 });
