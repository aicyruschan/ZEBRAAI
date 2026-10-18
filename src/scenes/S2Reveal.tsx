import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraScreen } from "../components/CameraScreen";
import { DemoBadge } from "../components/DemoBadge";
import { Device } from "../components/Device";
import { PalletWorld } from "../components/PalletWorld";
import { RealClip } from "../components/RealClip";
import { ScannerGun } from "../components/Scanner";
import { Sfx } from "../components/Sfx";
import { CLOSE, FULL, lerpCam, SPLIT } from "../data/pallet";
import { gunState, GUN_SCALE } from "./S1Pain";
import type { SceneProps } from "./types";

export const DEVICE_CX = 1480;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

// S2 登場：掃描槍退場、鏡頭後退；TC501 從右側升起，螢幕亮起顯示相機畫面
export const S2Reveal: React.FC<SceneProps> = ({ c, ff, real }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const at = (a: number, b: number, from = 0, to = 1) => interpolate(t, [a, b], [from, to], { ...clamp, easing: ease });
  const cam = lerpCam(CLOSE, SPLIT, at(0.5, 3.0));
  const g = gunState(8);
  const gunOut = at(0, 1.2);
  const screenOn = at(4.0, 4.6);
  return (
    <AbsoluteFill>
      {real ? <RealClip id="r2" label={c.ui.realPlaceholder} hint={c.ui.realHint} ff={ff} /> : <PalletWorld cam={cam} vp={FULL} />}
      {!real && gunOut < 1 && <ScannerGun x={g.mx + gunOut * 700} y={g.my + gunOut * 700} angle={g.angle} scale={GUN_SCALE} />}
      <Device cx={DEVICE_CX} cy={540 + at(2.2, 3.6, 1000, 0)} screenOn={screenOn}>
        {(vp) => <CameraScreen vp={vp} ff={ff} status={c.ui.s2Status} />}
      </Device>
      {screenOn > 0 && (
        <AbsoluteFill style={{ opacity: screenOn }}>
          <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
        </AbsoluteFill>
      )}
      <Sfx at={0.5} name="whoosh-down" volume={0.45} />
      <Sfx at={2.2} name="whoosh" volume={0.5} />
      <Sfx at={3.5} name="impact" volume={0.35} />
      <Sfx at={4.0} name="ui-on" volume={0.6} />
    </AbsoluteFill>
  );
};
