import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraScreen } from "../components/CameraScreen";
import { DemoBadge } from "../components/DemoBadge";
import { Device } from "../components/Device";
import { CartonBox, CodeBox } from "../components/Overlays";
import { PalletWorld } from "../components/PalletWorld";
import { RealClip } from "../components/RealClip";
import { Panel } from "../components/Panel";
import { Sfx } from "../components/Sfx";
import { colors } from "../brand";
import { cartons, codes, FULL, ORDER, SPLIT } from "../data/pallet";
import { DEVICE_CX } from "./S2Reveal";
import type { SceneProps } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// 由上而下、由左至右逐箱與收貨單比對
const matchOrder = [...cartons].sort((a, b) => a.y - b.y || a.x - b.x);
const matchSec = (i: number) => 1.0 + i * 0.35;

// S5 收貨核對：螢幕上逐箱變綠（與收貨單對得上），左側收貨單同步打勾
export const S5UseCase: React.FC<SceneProps> = ({ c, ff, real }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const back = interpolate(t, [0, 0.4], [0, 1], clamp);
  const matched = matchOrder.filter((_, i) => t >= matchSec(i));
  const status = c.ui.s5Done.replace("{n}", String(matched.length)).replace("{total}", String(cartons.length));
  return (
    <AbsoluteFill>
      {real ? <RealClip id="r5" label={c.ui.realPlaceholder} hint={c.ui.realHint} ff={ff} /> : <PalletWorld cam={SPLIT} vp={FULL} />}
      <AbsoluteFill style={{ background: `rgba(0,0,0,${0.45 * back})` }} />
      <Device cx={DEVICE_CX} cy={540} screenOn={1}>
        {(vp) => (
          <CameraScreen vp={vp} ff={ff} status={status}>
            {(cam) => (
              <>
                {codes.map((k) => (
                  <CodeBox key={k.id} code={k} cam={cam} vp={vp} appear={1} />
                ))}
                {matchOrder.map((k, i) => (
                  <CartonBox key={k.n} carton={k} cam={cam} vp={vp} appear={interpolate(t - matchSec(i), [0, 0.2], [0, 1], clamp)} />
                ))}
              </>
            )}
          </CameraScreen>
        )}
      </Device>
      <Panel style={{ left: 110, top: 150, width: 720, padding: "28px 34px", opacity: back, borderLeftColor: colors.success }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: ff }}>
          <span style={{ fontSize: 42, fontWeight: 700 }}>{c.ui.s5OrderTitle}</span>
          <span style={{ fontSize: 24, opacity: 0.7 }}>{c.ui.s5OrderNo}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 160px", fontFamily: ff, fontSize: 24, opacity: 0.65, margin: "20px 0 6px" }}>
          <span>{c.ui.s4Sku}</span>
          <span>{c.ui.s5Expected}</span>
          <span>{c.ui.s5Received}</span>
        </div>
        {ORDER.map((o) => {
          const expected = cartons.filter((k) => k.sku === o.sku).length;
          const got = matched.filter((k) => k.sku === o.sku).length;
          const done = got === expected;
          return (
            <div key={o.sku} style={{ display: "grid", gridTemplateColumns: "1fr 120px 160px", alignItems: "center", fontFamily: ff, fontSize: 32, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.15)" }}>
              <span style={{ fontWeight: 700 }}>{o.sku}</span>
              <span>{expected}</span>
              <span style={{ fontWeight: 700, color: done ? colors.success : colors.paper }}>
                {got} / {expected} {done ? "✓" : ""}
              </span>
            </div>
          );
        })}
        <div style={{ fontFamily: ff, fontSize: 36, fontWeight: 700, marginTop: 18, color: matched.length === cartons.length ? colors.success : colors.paper }}>{status}</div>
        <div style={{ fontFamily: ff, fontSize: 20, opacity: 0.7, marginTop: 6 }}>{c.ui.s5Note}</div>
      </Panel>
      <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
      {matchOrder.map((_, i) => (
        <Sfx key={i} at={matchSec(i)} name={`tick-${i % 6}`} volume={0.28} />
      ))}
      <Sfx at={matchSec(matchOrder.length - 1) + 0.35} name="confirm" volume={0.6} />
    </AbsoluteFill>
  );
};
