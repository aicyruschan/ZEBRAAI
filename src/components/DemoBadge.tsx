import { AbsoluteFill } from "remotion";

// 所有 UI 示範畫面右上角的「示意畫面」標示
export const DemoBadge: React.FC<{ text: string; fontFamily: string }> = ({ text, fontFamily }) => (
  <AbsoluteFill style={{ alignItems: "flex-end", padding: 36, pointerEvents: "none" }}>
    <div
      style={{
        fontFamily,
        fontSize: 24,
        color: "rgba(255,255,255,0.92)",
        background: "rgba(0,0,0,0.55)",
        border: "1px solid rgba(255,255,255,0.35)",
        padding: "6px 16px",
        borderRadius: 4,
        letterSpacing: 2,
      }}
    >
      {text}
    </div>
  </AbsoluteFill>
);
