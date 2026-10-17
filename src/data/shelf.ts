// 貨架「世界座標」：寬 2600 × 高 1080。所有場景共用同一份陳設，
// 鏡頭（Camera）把世界座標換算成畫面座標，邊界框與圖形因此永遠對齊。
export type CodeType = "1D" | "QR" | "DM";
export type Kind = "parcel" | "product" | "tag";

export type Item = {
  id: string;
  kind: Kind;
  x: number; // 中心 x
  base: number; // 底部 y（擺放的層板頂面）
  w: number;
  h: number;
  code: CodeType;
  color: string;
};

export const WORLD = { w: 2600, h: 1080 };
export const PLANKS = [330, 700, 1000]; // 層板頂面 y
export const PLANK_T = 22;

const CARTON = "#B98E5E";
const CARTON_DARK = "#A47B4E";
const PRODUCT_A = "#8C9AA8"; // 灰藍：B1–B3 一組
const PRODUCT_B = "#6E9E97"; // 灰綠：B4–B6 一組
const PRODUCT_C = "#9C8FB0";

const parcel = (id: string, x: number, w: number, h: number, code: CodeType, base = PLANKS[0]): Item => ({
  id, kind: "parcel", x, base, w, h, code, color: id.charCodeAt(1) % 2 ? CARTON : CARTON_DARK,
});
const product = (id: string, x: number, h: number, code: CodeType, color: string): Item => ({
  id, kind: "product", x, base: PLANKS[1], w: 180, h, code, color,
});
const tag = (id: string, x: number): Item => ({
  id, kind: "tag", x, base: PLANKS[1] + PLANK_T + 72, w: 120, h: 72, code: "DM", color: "#FFFFFF",
});

export const items: Item[] = [
  parcel("A1", 230, 280, 230, "QR"),
  parcel("A2", 530, 240, 200, "1D"),
  parcel("A3", 820, 280, 250, "QR"),
  parcel("A4", 1110, 240, 210, "1D"),
  parcel("A5", 1420, 290, 240, "QR"),
  parcel("A6", 1720, 250, 210, "1D"),
  parcel("A7", 2080, 280, 230, "QR"),
  parcel("A8", 2380, 250, 220, "1D"),
  product("B1", 260, 290, "1D", PRODUCT_A),
  product("B2", 520, 270, "1D", PRODUCT_A),
  product("B3", 780, 300, "1D", PRODUCT_A),
  product("B4", 1040, 280, "QR", PRODUCT_B),
  product("B5", 1300, 290, "1D", PRODUCT_A), // 放錯位置：灰藍商品混在灰綠區
  product("B6", 1560, 270, "1D", PRODUCT_B),
  product("B7", 2010, 290, "1D", PRODUCT_C),
  product("B8", 2260, 280, "1D", PRODUCT_C),
  product("B9", 2480, 300, "QR", PRODUCT_C),
  tag("T1", 330),
  tag("T2", 730),
  tag("T3", 1130),
  tag("T4", 1530),
  tag("T5", 2040),
  tag("T6", 2400),
  parcel("C1", 450, 300, 170, "DM", PLANKS[2]),
  parcel("C2", 1300, 280, 160, "1D", PLANKS[2]),
  parcel("C3", 2200, 300, 170, "1D", PLANKS[2]),
];

export const MISPLACED_ID = "B5";

const codeSize: Record<CodeType, [number, number]> = { "1D": [130, 58], QR: [80, 80], DM: [52, 52] };
export const codeSizeOf = (t: CodeType) => codeSize[t];

// 條碼中心（世界座標）
export const codeCenter = (it: Item): [number, number] => {
  const top = it.base - it.h;
  if (it.kind === "tag") return [it.x + 26, top + it.h / 2];
  if (it.kind === "product") return [it.x, it.base - 58];
  return [it.x, top + it.h * 0.48];
};

export type Camera = { cx: number; cy: number; scale: number };
export const WIDE: Camera = { cx: 960, cy: 540, scale: 1 };

export const toScreen = (cam: Camera, x: number, y: number): [number, number] => [
  (x - cam.cx) * cam.scale + 960,
  (y - cam.cy) * cam.scale + 540,
];

export const lerpCam = (a: Camera, b: Camera, t: number): Camera => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  scale: a.scale + (b.scale - a.scale) * t,
});

// 條碼是否完整在畫面內（用於追蹤時的進出場）
export const inView = (cam: Camera, it: Item, margin = 20) => {
  const [x, y] = toScreen(cam, ...codeCenter(it));
  const [w, h] = codeSizeOf(it.code).map((v) => (v / 2) * cam.scale);
  return x - w >= margin && x + w <= 1920 - margin && y - h >= margin && y + h <= 1080 - margin;
};
