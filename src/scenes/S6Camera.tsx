import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ProductImage } from "../components/ProductImage";
import { Sfx } from "../components/Sfx";
import { colors } from "../brand";
import { media } from "../content";
import { BACK_CAMERA_MODULE, productBoxes } from "../data/products";
import type { SceneProps } from "./types";

const H = 840;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// S6 相機規格：TC501 背面，框出後鏡頭模組並列出官方規格
export const S6Camera: React.FC<SceneProps> = ({ c, ff }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const at = (s: number, d = 12) => interpolate(frame, [s * fps, s * fps + d], [0, 1], clamp);
  const back = media.tc501.find((f) => f.endsWith("1.jpg")) ?? media.tc501[0];
  const [dx0, dy0, , dy1] = productBoxes["1.jpg"];
  const k = H / (dy1 - dy0);
  const [mx0, my0, mx1, my1] = BACK_CAMERA_MODULE;
  const devLeft = 380;
  const devTop = (1080 - H) / 2 - 20;
  const mod = { left: devLeft + (mx0 - dx0) * k - 14, top: devTop + (my0 - dy0) * k - 14, w: (mx1 - mx0) * k + 28, h: (my1 - my0) * k + 28 };
  const lineY = mod.top + mod.h / 2;
  const textLeft = 1000;
  const draw = at(0.8, 15);
  return (
    <AbsoluteFill style={{ backgroundColor: colors.paper }}>
      {back && (
        <div style={{ position: "absolute", left: devLeft, top: devTop, opacity: at(0), transform: `translateY(${(1 - at(0)) * 30}px)` }}>
          <ProductImage src={back} height={H} />
        </div>
      )}
      <div style={{ position: "absolute", zIndex: 2, left: mod.left, top: mod.top, width: mod.w, height: mod.h, border: `4px solid ${colors.primary}`, borderRadius: 10, opacity: at(0.6) }} />
      <div style={{ position: "absolute", zIndex: 2, left: mod.left + mod.w, top: lineY - 2, height: 4, width: (textLeft - 30 - mod.left - mod.w) * draw, background: colors.primary }} />
      <div style={{ position: "absolute", zIndex: 2, left: textLeft, top: lineY - 70, fontFamily: ff, color: colors.ink }}>
        <div style={{ fontSize: 56, fontWeight: 700, opacity: at(0.3) }}>{c.ui.s6Model}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 30, opacity: at(1.2) }}>
          <span style={{ fontSize: 150, fontWeight: 700, color: colors.primary, lineHeight: 1 }}>{c.ui.s6Main}</span>
          <span style={{ fontSize: 48, fontWeight: 700 }}>{c.ui.s6MainLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20, marginTop: 36, opacity: at(3.3) }}>
          <span style={{ fontSize: 96, fontWeight: 700, color: colors.primary, lineHeight: 1 }}>{c.ui.s6Wide}</span>
          <span style={{ fontSize: 40, fontWeight: 700 }}>{c.ui.s6WideLabel}</span>
        </div>
      </div>
      <div style={{ position: "absolute", zIndex: 2, right: 40, bottom: 20, fontFamily: ff, fontSize: 18, color: "#666" }}>{c.ui.s6Source}</div>
      <Sfx at={0} name="whoosh" volume={0.4} />
      <Sfx at={0.8} name="whoosh-down" volume={0.25} />
      <Sfx at={1.2} name="pop" volume={0.5} />
      <Sfx at={3.3} name="pop" volume={0.45} />
    </AbsoluteFill>
  );
};
