import { Img, staticFile } from "remotion";
import { productBoxes, SOURCE_SIZE } from "../data/products";

// 以機身範圍為基準縮放官方產品圖，使機身高度等於 height
// clip：裁切至機身範圍；multiply：白底透明化，可疊在場景上
export const ProductImage: React.FC<{ src: string; height: number; style?: React.CSSProperties; clip?: boolean; multiply?: boolean }> = ({
  src,
  height,
  style,
  clip = false,
  multiply = false,
}) => {
  const name = src.split("/").pop() ?? "";
  const [x0, y0, x1, y1] = productBoxes[name] ?? [0, 0, SOURCE_SIZE[0], SOURCE_SIZE[1]];
  const k = height / (y1 - y0);
  const w = (x1 - x0) * k;
  return (
    <div style={{ position: "relative", width: w, height, overflow: clip ? "hidden" : "visible", borderRadius: clip ? 64 * k : 0, ...style }}>
      <Img
        src={staticFile(src)}
        style={{ position: "absolute", width: SOURCE_SIZE[0] * k, height: SOURCE_SIZE[1] * k, left: -x0 * k, top: -y0 * k, maxWidth: "none", mixBlendMode: multiply ? "multiply" : "normal" }}
      />
    </div>
  );
};
