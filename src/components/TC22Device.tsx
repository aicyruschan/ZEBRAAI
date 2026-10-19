import { Img, staticFile } from "remotion";
import { colors } from "../brand";
import { media } from "../content";
import { SOURCE_SIZE, TC22_FRONT } from "../data/products";

const SKIN = "#E2B48C";
const SKIN_SHADE = "#C8956C";
const SLEEVE = "#3A3F45";

// TC22 官方正面渲染圖（去背）＋右手握持：機頂掃描窗位於 (x, y)，機身朝 angle 方向（0° = 機頂向上）。
// press 0→1：拇指按下左側黃色掃描鍵；reads：已讀條碼數（螢幕清單逐行變綠）；flash：讀取成功閃綠。
export const TC22Device: React.FC<{ x: number; y: number; angle: number; height: number; press: number; reads: number; total: number; flash: number }> = ({
  x,
  y,
  angle,
  height,
  press,
  reads,
  total,
  flash,
}) => {
  const src = media.tc22.find((f) => f.endsWith(TC22_FRONT.file));
  if (!src) return null;
  const [x0, y0, x1, y1] = TC22_FRONT.box;
  const k = height / (y1 - y0);
  const w = (x1 - x0) * k;
  const h = height;
  const topX = (TC22_FRONT.top[0] - x0) * k;
  const topY = (TC22_FRONT.top[1] - y0) * k;
  const [sx0, sy0, sx1, sy1] = TC22_FRONT.screen;
  const scr = { left: (sx0 - x0) * k, top: (sy0 - y0) * k, w: (sx1 - sx0) * k, h: (sy1 - sy0) * k };
  const [bx, by0, by1] = TC22_FRONT.leftButton;
  const btn = { x: (bx - x0) * k, y: ((by0 + by1) / 2 - y0) * k, len: (by1 - by0) * k };
  const push = press * w * 0.025; // 拇指按下時向機身內移
  return (
    <div style={{ position: "absolute", left: x - topX, top: y - topY, width: w, height: h, transformOrigin: `${topX}px ${topY}px`, transform: `rotate(${angle}deg)` }}>
      {/* 手掌及前臂（在機身後面） */}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <path
          d={`M ${w * 0.45} ${h * 0.86} L ${w * 1.05} ${h * 1.5} L ${w * 0.35} ${h * 1.62} L ${w * 0.02} ${h * 0.98} Z`}
          fill={SLEEVE}
        />
        <ellipse cx={w * 0.5} cy={h * 0.66} rx={w * 0.62} ry={h * 0.25} fill={SKIN_SHADE} />
        <ellipse cx={w * 0.47} cy={h * 0.64} rx={w * 0.58} ry={h * 0.23} fill={SKIN} />
      </svg>
      <div style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.35))" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: -x0 * k, top: -y0 * k, width: SOURCE_SIZE[0] * k, height: SOURCE_SIZE[1] * k, maxWidth: "none" }} />
      </div>
      {/* 螢幕：掃描 App 示意（沒有文字），每讀一個條碼，清單一行變綠 */}
      <div style={{ position: "absolute", left: scr.left, top: scr.top, width: scr.w, height: scr.h, background: "#12161A", borderRadius: 6 * k * 3, overflow: "hidden", boxShadow: `inset 0 0 0 ${4 * flash}px ${colors.success}` }}>
        <div style={{ height: scr.h * 0.07, background: colors.successDark }} />
        <svg width={scr.w} height={scr.h * 0.28} viewBox="0 0 100 40" style={{ display: "block", marginTop: scr.h * 0.04 }}>
          {[6, 10, 13, 18, 21, 26, 30, 33, 38, 42, 47, 50, 54, 59, 62, 66, 71, 74, 78, 83, 86, 90].map((bx2, i) => (
            <rect key={i} x={bx2} y={8} width={i % 3 === 0 ? 2.4 : 1.2} height={24} fill="#E9EDF0" opacity={0.85} />
          ))}
          <rect x={4} y={19} width={92} height={2} fill="#FF2B2B" opacity={0.8} />
        </svg>
        {Array.from({ length: total }, (_, i) => {
          const done = i < reads;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: scr.w * 0.05, margin: `${scr.h * 0.022}px ${scr.w * 0.08}px` }}>
              <div style={{ width: scr.w * 0.09, height: scr.w * 0.09, borderRadius: "50%", background: done ? colors.success : "#2A3138" }} />
              <div style={{ flex: 1, height: scr.h * 0.022, borderRadius: 4, background: done ? "#5E6B75" : "#262D33" }} />
            </div>
          );
        })}
      </div>
      {/* 手指（由機身背面繞到右側邊緣）及拇指（按左側黃色掃描鍵） */}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {[0.46, 0.55, 0.64, 0.73].map((fy, i) => (
          <rect key={i} x={w * 0.9} y={h * fy} width={w * 0.2} height={h * 0.075} rx={h * 0.037} fill={i % 2 ? SKIN : SKIN_SHADE} />
        ))}
        <rect x={btn.x - w * 0.02} y={btn.y - btn.len / 2} width={w * 0.04} height={btn.len} rx={w * 0.02} fill="#F2C200" />
        <rect x={btn.x - w * 0.05} y={btn.y - btn.len / 2 - w * 0.03} width={w * 0.1} height={btn.len + w * 0.06} rx={w * 0.05} fill="#FFD84D" opacity={0.55 * press} style={{ filter: "blur(3px)" }} />
        <g transform={`translate(${push} 0)`}>
          <path
            d={`M ${-w * 0.2} ${h * 0.74} C ${-w * 0.16} ${h * 0.56}, ${-w * 0.1} ${btn.y + h * 0.06}, ${btn.x - w * 0.02} ${btn.y - h * 0.02}
                C ${btn.x + w * 0.07} ${btn.y - h * 0.035}, ${btn.x + w * 0.09} ${btn.y + h * 0.04}, ${btn.x + w * 0.03} ${btn.y + h * 0.075}
                C ${-w * 0.02} ${h * 0.6}, ${-w * 0.04} ${h * 0.7}, ${-w * 0.02} ${h * 0.8} Z`}
            fill={SKIN}
            stroke="#A8744E"
            strokeWidth={2.5}
          />
          <ellipse cx={btn.x + w * 0.035} cy={btn.y + h * 0.012} rx={w * 0.03} ry={h * 0.022} fill="#F0D2BA" opacity={0.9} />
        </g>
      </svg>
    </div>
  );
};
