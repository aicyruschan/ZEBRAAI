import { colors, rgba } from "../brand";
import { toView, type Camera, type Carton, type Code, type Viewport } from "../data/pallet";

// 條碼邊界框（綠色＝已讀取），座標由世界座標經鏡頭換算到視窗
export const CodeBox: React.FC<{ code: Code; cam: Camera; vp: Viewport; appear: number }> = ({ code, cam, vp, appear }) => {
  const [x, y] = toView(cam, vp, code.x, code.y);
  const pad = 3;
  const w = code.w * cam.scale + pad * 2;
  const h = code.h * cam.scale + pad * 2;
  const s = 1.4 - 0.4 * appear;
  return (
    <div
      style={{
        position: "absolute",
        left: x - pad,
        top: y - pad,
        width: w,
        height: h,
        border: `2px solid ${colors.success}`,
        background: rgba(colors.success, 0.28),
        borderRadius: 3,
        opacity: appear,
        transform: `scale(${s})`,
        boxSizing: "border-box",
      }}
    />
  );
};

// 整箱核對結果（綠色填充＋勾號＝與收貨單對得上）
export const CartonBox: React.FC<{ carton: Carton; cam: Camera; vp: Viewport; appear: number }> = ({ carton, cam, vp, appear }) => {
  const [x, y] = toView(cam, vp, carton.x, carton.y);
  const w = carton.w * cam.scale;
  const h = carton.h * cam.scale;
  const d = Math.min(w, h) * 0.36;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: appear }}>
      <div style={{ position: "absolute", inset: 0, border: `3px solid ${colors.success}`, background: rgba(colors.success, 0.42), borderRadius: 4, boxSizing: "border-box" }} />
      <div
        style={{
          position: "absolute",
          left: w / 2 - d / 2,
          top: h / 2 - d / 2,
          width: d,
          height: d,
          borderRadius: "50%",
          background: colors.successDark,
          transform: `scale(${0.6 + 0.4 * appear})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={d * 0.6} height={d * 0.6} viewBox="0 0 24 24">
          <path d="M4 12.5 L10 18 L20 6" fill="none" stroke="#FFF" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};
