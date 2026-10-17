import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BarcodeBox } from "../components/BarcodeBox";
import { DemoBadge } from "../components/DemoBadge";
import { Panel } from "../components/Panel";
import { ShelfWorld } from "../components/ShelfWorld";
import { Viewfinder } from "../components/Viewfinder";
import { codeCenter, inView, items, WIDE } from "../data/shelf";
import type { SceneProps } from "./types";

// 畫面內的條碼，由左至右逐一框選
const visible = items.filter((it) => inView(WIDE, it)).sort((a, b) => codeCenter(a)[0] - codeCenter(b)[0]);
const appearAt = (i: number, fps: number) => Math.round((1.0 + i * 0.22) * fps);

// S3 一次框選：邊界框逐一出現，計數至 18
export const S3Detect: React.FC<SceneProps> = ({ c, ff }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = visible.filter((_, i) => frame >= appearAt(i, fps)).length;
  return (
    <AbsoluteFill>
      <ShelfWorld cam={WIDE} />
      <Viewfinder />
      {visible.map((it, i) => (
        <BarcodeBox
          key={it.id}
          it={it}
          cam={WIDE}
          fontFamily={ff}
          appear={interpolate(frame - appearAt(i, fps), [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      ))}
      {shown > 0 && (
        <Panel style={{ left: 64, top: 64 }}>
          <div style={{ fontFamily: ff, fontSize: 40, fontWeight: 700 }}>{c.ui.s3Detected.replace("{n}", String(shown))}</div>
        </Panel>
      )}
      <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
    </AbsoluteFill>
  );
};
