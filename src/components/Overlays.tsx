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

// 寫實版：按追蹤到的標籤位置畫綠框；checked 時加填充及勾號（與收貨單對得上）
export const LabelBox: React.FC<{ r: { x: number; y: number; w: number; h: number }; appear: number; checked?: number }> = ({ r, appear, checked = 0 }) => {
  const d = Math.min(r.w, r.h) * 0.55;
  return (
    <div style={{ position: "absolute", left: r.x - 3, top: r.y - 3, width: r.w + 6, height: r.h + 6, opacity: appear, transform: `scale(${1.3 - 0.3 * appear})` }}>
      <div style={{ position: "absolute", inset: 0, border: `2px solid ${colors.success}`, background: rgba(colors.success, 0.25 + 0.25 * checked), borderRadius: 3, boxSizing: "border-box" }} />
      {checked > 0 && (
        <div style={{ position: "absolute", left: (r.w + 6) / 2 - d / 2, top: (r.h + 6) / 2 - d / 2, width: d, height: d, borderRadius: "50%", background: colors.successDark, opacity: checked, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={d * 0.6} height={d * 0.6} viewBox="0 0 24 24">
            <path d="M4 12.5 L10 18 L20 6" fill="none" stroke="#FFF" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
};

// 標籤讀取完成：綠色勾號放在標籤右下角（樣本版式中留空的位置）
export const LabelTick: React.FC<{ carton: Carton; cam: Camera; vp: Viewport; appear: number }> = ({ carton, cam, vp, appear }) => {
  const r = 26;
  const [x, y] = toView(cam, vp, carton.label.x + carton.label.w - 14 - r, carton.label.y + carton.label.h - 14 - r);
  const d = r * 2 * cam.scale;
  return (
    <div
      style={{
        position: "absolute",
        left: x - d / 2,
        top: y - d / 2,
        width: d,
        height: d,
        borderRadius: "50%",
        background: colors.successDark,
        border: `2px solid ${colors.success}`,
        opacity: appear,
        transform: `scale(${0.5 + 0.5 * appear})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <svg width={d * 0.62} height={d * 0.62} viewBox="0 0 24 24">
        <path d="M4 12.5 L10 18 L20 6" fill="none" stroke="#FFF" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};
