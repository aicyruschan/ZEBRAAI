import { ProductImage } from "./ProductImage";
import { media } from "../content";
import { FRONT_SCREEN, productBoxes } from "../data/products";
import type { Viewport } from "../data/pallet";

// TC501 正面官方渲染圖，螢幕範圍內放入程式繪製的 App 畫面
export const DEVICE_H = 900;

export const deviceGeometry = (H = DEVICE_H) => {
  const [dx0, dy0, dx1, dy1] = productBoxes["2.jpg"];
  const k = H / (dy1 - dy0);
  const [sx0, sy0, sx1, sy1] = FRONT_SCREEN;
  return {
    k,
    w: (dx1 - dx0) * k,
    h: H,
    screen: { left: (sx0 - dx0) * k, top: (sy0 - dy0) * k, w: (sx1 - sx0) * k, h: (sy1 - sy0) * k },
  };
};

export const Device: React.FC<{
  cx: number;
  cy: number;
  H?: number;
  style?: React.CSSProperties;
  screenOn: number;
  children: (vp: Viewport) => React.ReactNode;
}> = ({ cx, cy, H = DEVICE_H, style, screenOn, children }) => {
  const g = deviceGeometry(H);
  const front = media.tc501.find((f) => f.endsWith("2-cutout.png")) ?? media.tc501.find((f) => f.endsWith("2.jpg"));
  if (!front) return null;
  return (
    <div style={{ position: "absolute", left: cx - g.w / 2, top: cy - H / 2, width: g.w, height: H, filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.35))", ...style }}>
      <ProductImage src={front} height={H} clip={front.endsWith(".jpg")} />
      <div style={{ position: "absolute", left: g.screen.left, top: g.screen.top, width: g.screen.w, height: g.screen.h, overflow: "hidden", borderRadius: 14 * g.k, background: "#000", opacity: screenOn }}>
        {children({ w: g.screen.w, h: g.screen.h })}
      </div>
    </div>
  );
};
