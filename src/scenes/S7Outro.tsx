import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { HeroBackdrop } from "../components/HeroBackdrop";
import { ProductImage } from "../components/ProductImage";
import { Sfx } from "../components/Sfx";
import { colors } from "../brand";
import { media } from "../content";
import type { SceneProps } from "./types";

// 以多角度官方渲染圖交替模擬旋轉：背面 → 左前 → 正面 → 右前
const ORDER = ["1-cutout.png", "4-cutout.png", "2-cutout.png", "3-cutout.png"]; // 去背版，配合舞台背景

export const S7Outro: React.FC<SceneProps> = ({ c, ff, real }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const shots = ORDER.map((n) => media.tc501.find((f) => f.endsWith(n))).filter((f): f is string => Boolean(f));
  const seg = (3.6 * fps) / Math.max(1, shots.length - 1);
  const xf = 10; // 交叉淡化幀數
  const zoom = interpolate(frame, [0, durationInFrames], [0.96, 1.04]);
  const textIn = interpolate(frame, [0.4 * fps, 0.4 * fps + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <HeroBackdrop focusX={540} focusY={500} floorY={895} />
      <div style={{ position: "absolute", left: 300, top: 120, width: 480, height: 800, transform: `scale(${zoom})` }}>
        {shots.map((s, i) => {
          // 每個角度停留一段，結尾 xf 幀與下一個角度交叉淡化（任何時刻至少有一個角度完全可見）
          const fadeIn = i === 0 ? 1 : interpolate(frame, [i * seg - xf, i * seg], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const fadeOut = i === shots.length - 1 ? 1 : interpolate(frame, [(i + 1) * seg - xf, (i + 1) * seg], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const opacity = Math.min(fadeIn, fadeOut);
          const squash = 0.9 + 0.1 * opacity;
          return (
            <div key={s} style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", opacity, transform: `scaleX(${squash})` }}>
              <ProductImage src={s} height={760} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", zIndex: 2, left: 960, top: 330, opacity: textIn, transform: `translateX(${(1 - textIn) * 40}px)` }}>
        <div style={{ fontFamily: ff, fontSize: 110, fontWeight: 700, color: colors.ink, lineHeight: 1.05 }}>{c.ui.s7Title}</div>
        <div style={{ width: 120, height: 8, background: colors.primary, margin: "28px 0" }} />
        <div style={{ fontFamily: ff, fontSize: 64, fontWeight: 700, color: colors.primary }}>{c.ui.s7Subtitle}</div>
        <div style={{ marginTop: 60, height: 90, display: "flex", alignItems: "center" }}>
          {media.logo ? (
            <Img src={staticFile(media.logo)} style={{ height: 96 }} />
          ) : (
            <div style={{ width: 300, height: 80, border: `2px dashed ${colors.placeholder}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff, fontSize: 22, color: colors.placeholder }}>
              {c.ui.logoMissing}
            </div>
          )}
        </div>
      </div>
      {real && <div style={{ position: "absolute", zIndex: 2, right: 40, bottom: 20, fontFamily: ff, fontSize: 20, color: "#666" }}>{c.ui.aiDisclaimer}</div>}
      <Sfx at={0.4} name="chime" volume={0.6} />
    </AbsoluteFill>
  );
};
