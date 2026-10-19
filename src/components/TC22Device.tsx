import { Img, staticFile } from "remotion";
import { media } from "../content";
import { SOURCE_SIZE, TC22_BACK } from "../data/products";

// TC22 官方背面渲染圖（去背）：機頂掃描窗位於 (x, y)，機身朝 angle 方向（0° = 機頂向上）
export const TC22Device: React.FC<{ x: number; y: number; angle: number; height: number }> = ({ x, y, angle, height }) => {
  const src = media.tc22.find((f) => f.endsWith(TC22_BACK.file));
  if (!src) return null;
  const [x0, y0, , y1] = TC22_BACK.box;
  const k = height / (y1 - y0);
  const topX = (TC22_BACK.top[0] - x0) * k;
  const topY = (TC22_BACK.top[1] - y0) * k;
  return (
    <div
      style={{
        position: "absolute",
        left: x - topX,
        top: y - topY,
        transformOrigin: `${topX}px ${topY}px`,
        transform: `rotate(${angle - TC22_BACK.tiltDeg}deg)`,
        filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))",
      }}
    >
      <Img src={staticFile(src)} style={{ position: "absolute", left: -x0 * k, top: -y0 * k, width: SOURCE_SIZE[0] * k, height: SOURCE_SIZE[1] * k, maxWidth: "none" }} />
    </div>
  );
};
