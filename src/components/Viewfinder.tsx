import { AbsoluteFill } from "remotion";
import { colors } from "../brand";

// 相機觀景框四角
export const Viewfinder: React.FC<{ opacity?: number; inset?: number; size?: number; thickness?: number }> = ({ opacity = 1, inset = 28, size = 90, thickness = 6 }) => {
  const b = `${thickness}px solid ${colors.paper}`;
  const corner = (style: React.CSSProperties) => <div style={{ position: "absolute", width: size, height: size, ...style }} />;
  return (
    <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
      {corner({ left: inset, top: inset, borderLeft: b, borderTop: b })}
      {corner({ right: inset, top: inset, borderRight: b, borderTop: b })}
      {corner({ left: inset, bottom: inset, borderLeft: b, borderBottom: b })}
      {corner({ right: inset, bottom: inset, borderRight: b, borderBottom: b })}
    </AbsoluteFill>
  );
};
