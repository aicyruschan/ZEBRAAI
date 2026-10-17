import { AbsoluteFill } from "remotion";
import { colors } from "../brand";

// 相機觀景框四角，表示「這是 TC501 相機看到的畫面」
export const Viewfinder: React.FC<{ opacity?: number; inset?: number }> = ({ opacity = 1, inset = 28 }) => {
  const L = 90;
  const t = 6;
  const c = colors.paper;
  const corner = (style: React.CSSProperties) => <div style={{ position: "absolute", width: L, height: L, ...style }} />;
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {corner({ left: inset, top: inset, borderLeft: `${t}px solid ${c}`, borderTop: `${t}px solid ${c}` })}
      {corner({ right: inset, top: inset, borderRight: `${t}px solid ${c}`, borderTop: `${t}px solid ${c}` })}
      {corner({ left: inset, bottom: inset, borderLeft: `${t}px solid ${c}`, borderBottom: `${t}px solid ${c}` })}
      {corner({ right: inset, bottom: inset, borderRight: `${t}px solid ${c}`, borderBottom: `${t}px solid ${c}` })}
    </AbsoluteFill>
  );
};
