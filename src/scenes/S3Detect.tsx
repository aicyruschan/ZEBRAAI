import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraScreen } from "../components/CameraScreen";
import { DemoBadge } from "../components/DemoBadge";
import { Device } from "../components/Device";
import { CodeBox } from "../components/Overlays";
import { PalletWorld } from "../components/PalletWorld";
import { Panel } from "../components/Panel";
import { Sfx } from "../components/Sfx";
import { colors } from "../brand";
import { codes, FULL, SPLIT } from "../data/pallet";
import { DEVICE_CX } from "./S2Reveal";
import type { SceneProps } from "./types";

// 一次對準整堆貨：28 個條碼在約 1.4 秒內幾乎同時被框選（亂序出現，表現「同時讀取」）
const order = codes.map((_, i) => (i * 11) % codes.length);
export const readSec = (i: number) => 1.0 + order[i] * 0.05;

export const S3Detect: React.FC<SceneProps> = ({ c, ff }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const shown = codes.filter((_, i) => t >= readSec(i)).length;
  const label = c.ui.s3Read.replace("{n}", String(shown));
  return (
    <AbsoluteFill>
      <PalletWorld cam={SPLIT} vp={FULL} />
      <Device cx={DEVICE_CX} cy={540} screenOn={1}>
        {(vp) => (
          <CameraScreen vp={vp} ff={ff} status={shown ? label : c.ui.s2Status}>
            {(cam) =>
              codes.map((k, i) => (
                <CodeBox key={k.id} code={k} cam={cam} vp={vp} appear={interpolate(t - readSec(i), [0, 0.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
              ))
            }
          </CameraScreen>
        )}
      </Device>
      {shown > 0 && (
        <Panel style={{ left: 64, top: 64, borderLeftColor: colors.success }}>
          <div style={{ fontFamily: ff, fontSize: 40, fontWeight: 700 }}>{label}</div>
        </Panel>
      )}
      <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
      {[0, 4, 8, 12, 16, 20, 24].map((i, k) => (
        <Sfx key={i} at={1.0 + i * 0.05} name={`tick-${k % 6}`} volume={0.3} />
      ))}
      <Sfx at={1.0 + codes.length * 0.05 + 0.2} name="confirm" volume={0.55} />
    </AbsoluteFill>
  );
};
