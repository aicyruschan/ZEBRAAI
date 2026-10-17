import { colors } from "../brand";

// UI 疊加用的深色資訊面板
export const Panel: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      position: "absolute",
      background: "rgba(0,0,0,0.72)",
      borderLeft: `6px solid ${colors.primary}`,
      color: colors.paper,
      padding: "20px 28px",
      borderRadius: 6,
      ...style,
    }}
  >
    {children}
  </div>
);
