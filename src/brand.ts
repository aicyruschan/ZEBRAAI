import brand from "../brand/brand.json";

// 影片所用的品牌值全部來自 brand/brand.json 的 render 區塊
const r = brand.render;

export const colors = {
  primary: r.colors.primary.value,
  primaryFillAlpha: r.colors.primaryFillAlpha.value,
  ink: r.colors.ink.value,
  paper: r.colors.paper.value,
  warn: r.colors.warn.value,
  placeholder: r.colors.placeholder.value,
};

export type Variant = "hant" | "hans";

export const fontFamily = (v: Variant) =>
  `"${v === "hant" ? r.fonts.hant.value : r.fonts.hans.value}", ${r.fonts.latinFallback.value}, sans-serif`;

export const rgba = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};
