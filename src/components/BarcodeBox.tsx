import { interpolate } from "remotion";
import { colors, rgba } from "../brand";
import { codeCenter, codeSizeOf, toScreen, type Camera, type Item } from "../data/shelf";

// 邊界框：品牌主色描邊、半透明填充、左上角標示條碼類型。位置由世界座標經鏡頭換算。
export const BarcodeBox: React.FC<{
  it: Item;
  cam: Camera;
  appear: number; // 0 → 1
  fontFamily: string;
  color?: string;
  dim?: number;
  caption?: string;
}> = ({ it, cam, appear, fontFamily, color = colors.primary, dim = 1, caption }) => {
  const [x, y] = toScreen(cam, ...codeCenter(it));
  const [cw, ch] = codeSizeOf(it.code);
  const pad = 12;
  const w = cw * cam.scale + pad * 2;
  const h = ch * cam.scale + pad * 2;
  const scale = interpolate(appear, [0, 1], [1.35, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        border: `4px solid ${color}`,
        backgroundColor: rgba(color, colors.primaryFillAlpha),
        borderRadius: 6,
        opacity: appear * dim,
        transform: `scale(${scale})`,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -4,
          top: -34,
          padding: "2px 10px",
          background: color,
          color: color === colors.warn ? colors.ink : colors.paper,
          fontFamily,
          fontWeight: 700,
          fontSize: 22,
          borderRadius: "4px 4px 4px 0",
          whiteSpace: "nowrap",
        }}
      >
        {caption ? `${it.code} · ${caption}` : it.code}
      </div>
    </div>
  );
};
