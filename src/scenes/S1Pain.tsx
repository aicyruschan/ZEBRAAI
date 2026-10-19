import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DemoBadge } from "../components/DemoBadge";
import { Panel } from "../components/Panel";
import { PalletWorld } from "../components/PalletWorld";
import { RealClip } from "../components/RealClip";
import { Sfx } from "../components/Sfx";
import { TC22Device } from "../components/TC22Device";
import { colors } from "../brand";
import { CLOSE, codes, FULL, TARGET_CARTON, toView } from "../data/pallet";
import type { SceneProps } from "./types";

// TC22 逐個條碼讀：同一張標籤的 4 條一維條碼 → Data Matrix，最後移向下一箱（不讀）
const READS = ["b1", "b2", "b3", "b4", "dm"].map((r) => codes.find((k) => k.id === `c${TARGET_CARTON}-${r}`)!);
const NEXT = codes.find((k) => k.id === `c${TARGET_CARTON + 1}-b1`)!;
const PATH = [...READS, NEXT];
const FIRST = 0.8;
const EVERY = 1.35;
const TOP_OFFSET: [number, number] = [170, 240]; // 機頂掃描窗相對目標條碼的位置（畫面像素）
export const TC22_H = 540;

const at = (i: number) => FIRST + i * EVERY;

// TC22 狀態：機頂位置、朝向、正在讀的條碼
export const deviceState = (t: number) => {
  const pts = PATH.map((k) => toView(CLOSE, FULL, k.x + k.w / 2, k.y + k.h / 2));
  let i = 0;
  for (let n = 0; n < PATH.length; n++) if (t >= at(n) - 0.5) i = n;
  const prev = pts[Math.max(0, i - 1)];
  const move = interpolate(t, [at(i) - 0.5, at(i) - 0.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
  const tx = prev[0] + (pts[i][0] - prev[0]) * move;
  const ty = prev[1] + (pts[i][1] - prev[1]) * move;
  const mx = tx + TOP_OFFSET[0];
  const my = ty + TOP_OFFSET[1];
  const angle = (Math.atan2(tx - mx, -(ty - my)) * 180) / Math.PI;
  const reading = i < READS.length && t >= at(i) && t < at(i) + 0.8 ? i : -1;
  return { tx, ty, mx, my, angle, reading };
};

// S1 痛點：TC22 對準同一張多條碼標籤，一個條碼讀一次
export const S1Pain: React.FC<SceneProps> = ({ c, ff, real }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const count = READS.filter((_, i) => t >= at(i)).length;
  const last = count ? at(count - 1) : -99;
  const pulse = interpolate((t - last) * fps, [0, 8], [1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const g = deviceState(t);
  const target = g.reading >= 0 ? READS[g.reading] : null;
  const cw = target ? target.w * CLOSE.scale : 0;
  const ch = target ? target.h * CLOSE.scale : 0;
  const sweep = target ? ((t - at(g.reading)) / 0.8) * 2 - 1 : 0;
  return (
    <AbsoluteFill>
      {real ? <RealClip id="r1" label={c.ui.realPlaceholder} hint={c.ui.realHint} ff={ff} /> : <PalletWorld cam={CLOSE} vp={FULL} />}
      {!real && target && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line x1={g.mx} y1={g.my} x2={g.tx} y2={g.ty} stroke="#FF2B2B" strokeWidth={3} opacity={0.3} />
          <line x1={g.tx - cw / 2 - 14} x2={g.tx + cw / 2 + 14} y1={g.ty + sweep * ch * 0.3} y2={g.ty + sweep * ch * 0.3} stroke="#FF2B2B" strokeWidth={5} style={{ filter: "drop-shadow(0 0 6px #FF2B2B)" }} />
        </svg>
      )}
      {!real && <TC22Device x={g.mx} y={g.my} angle={g.angle} height={TC22_H} />}
      <Panel style={{ left: 64, top: 64 }}>
        <div style={{ fontFamily: ff, fontSize: 30, opacity: 0.8 }}>{c.ui.s1Counter}</div>
        <div style={{ fontFamily: ff, fontSize: 96, fontWeight: 700, lineHeight: 1.05, transform: `scale(${pulse})`, transformOrigin: "left center", color: count ? colors.paper : "rgba(255,255,255,0.4)" }}>
          {count}
        </div>
      </Panel>
      <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
      {READS.map((_, k) => (
        <Sfx key={k} at={at(k)} name="beep" volume={0.55} />
      ))}
    </AbsoluteFill>
  );
};
