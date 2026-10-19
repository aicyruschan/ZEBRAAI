import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, rgba } from "../brand";
import { Bars } from "./codes";

// 產品舞台背景（S6、S7）：淺灰漸層、產品後方聚光、地台與倒影陰影、淡淡的條碼紋理緩慢移動、
// 一道斜向光帶掃過，底部品牌藍→綠色細條。全部程式繪製，沒有文字。
export const HeroBackdrop: React.FC<{ focusX: number; focusY: number; floorY: number }> = ({ focusX, focusY, floorY }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, -120]);
  const sweep = interpolate(frame, [0, durationInFrames], [-900, 2400]);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "linear-gradient(160deg, #F8FAFB 0%, #EBEFF3 55%, #DCE3E9 100%)" }}>
      {/* 條碼紋理：右上方，極淡，緩慢向左移 */}
      <div style={{ position: "absolute", left: 980 + drift, top: -60, opacity: 0.05, transform: "rotate(-8deg)" }}>
        <Bars seed="hero-a" w={1300} h={520} />
      </div>
      <div style={{ position: "absolute", left: 1150 + drift * 0.6, top: 560, opacity: 0.035, transform: "rotate(-8deg)" }}>
        <Bars seed="hero-b" w={1100} h={360} />
      </div>
      {/* 地台 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: floorY, bottom: 0, background: "linear-gradient(#E3E8ED, #D3DAE1)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: floorY, height: 2, background: "rgba(255,255,255,0.9)" }} />
      {/* 產品後方聚光 */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${focusX}px ${focusY}px, rgba(255,255,255,0.95) 0px, rgba(255,255,255,0.55) 260px, rgba(255,255,255,0) 560px)` }} />
      {/* 品牌色光暈（極淡） */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${focusX - 220}px ${focusY + 260}px, ${rgba(colors.primary, 0.1)} 0px, ${rgba(colors.primary, 0)} 420px)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at ${focusX + 260}px ${focusY - 300}px, ${rgba(colors.success, 0.1)} 0px, ${rgba(colors.success, 0)} 380px)` }} />
      {/* 產品落地陰影 */}
      <div style={{ position: "absolute", left: focusX - 260, top: floorY - 30, width: 520, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(20,30,40,0.28) 0%, rgba(20,30,40,0) 70%)" }} />
      {/* 斜向光帶掃過 */}
      <div style={{ position: "absolute", top: -400, left: sweep, width: 260, height: 2000, transform: "rotate(18deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.45), rgba(255,255,255,0))" }} />
      {/* 底部品牌色細條 */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: `linear-gradient(90deg, ${colors.primary}, ${colors.success})` }} />
    </AbsoluteFill>
  );
};
