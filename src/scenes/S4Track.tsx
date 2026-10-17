import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BarcodeBox } from "../components/BarcodeBox";
import { DemoBadge } from "../components/DemoBadge";
import { Panel } from "../components/Panel";
import { ShelfWorld } from "../components/ShelfWorld";
import { Viewfinder } from "../components/Viewfinder";
import { colors } from "../brand";
import { demoResults } from "../content";
import { inView, items, lerpCam, WIDE, type Camera } from "../data/shelf";
import type { SceneProps } from "./types";

export const PAN_END: Camera = { cx: 1300, cy: 540, scale: 1 };

// S4 移動追蹤：鏡頭平移，邊界框跟隨；離開畫面的框淡出、新進入的框淡入；左側逐行列出解碼結果（虛構示範）
export const S4Track: React.FC<SceneProps> = ({ c, ff }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const camAt = (f: number) =>
    lerpCam(WIDE, PAN_END, interpolate(f, [0, durationInFrames - fps], [0, 1], { easing: Easing.inOut(Easing.sin), extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const cam = camAt(frame);
  const rowAt = (i: number) => Math.round((1.0 + i * 0.9) * fps);
  return (
    <AbsoluteFill>
      <ShelfWorld cam={cam} />
      <Viewfinder />
      {items.map((it) => {
        // 最近 6 幀在畫面內的比例 → 平滑進出場
        let n = 0;
        for (let k = 0; k < 6; k++) if (inView(camAt(frame - k), it)) n++;
        return n > 0 ? <BarcodeBox key={it.id} it={it} cam={cam} fontFamily={ff} appear={n / 6} /> : null;
      })}
      <Panel style={{ left: 48, top: 120, width: 560, padding: "24px 28px" }}>
        <div style={{ fontFamily: ff, fontSize: 34, fontWeight: 700 }}>{c.ui.s4ListTitle}</div>
        <div style={{ fontFamily: ff, fontSize: 20, opacity: 0.7, marginBottom: 14 }}>{c.ui.s4ListNote}</div>
        {demoResults.map((r, i) => {
          const a = interpolate(frame - rowAt(i), [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", borderTop: "1px solid rgba(255,255,255,0.15)", opacity: a, transform: `translateX(${(1 - a) * 30}px)`, fontFamily: ff }}
            >
              <span style={{ background: colors.primary, color: colors.paper, fontWeight: 700, fontSize: 20, padding: "2px 8px", borderRadius: 4, minWidth: 44, textAlign: "center" }}>{r.type}</span>
              <span style={{ fontSize: 20, opacity: 0.75, width: 130 }}>{r.symbology}</span>
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: 0.5 }}>{r.value}</span>
            </div>
          );
        })}
      </Panel>
      <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
    </AbsoluteFill>
  );
};
