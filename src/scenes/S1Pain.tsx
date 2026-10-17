import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DemoBadge } from "../components/DemoBadge";
import { Panel } from "../components/Panel";
import { PalletWorld } from "../components/PalletWorld";
import { ScannerGun } from "../components/Scanner";
import { Sfx } from "../components/Sfx";
import { colors } from "../brand";
import { CLOSE, codes, FULL, toView } from "../data/pallet";
import type { SceneProps } from "./types";

const TARGETS = ["c4-sku", "c5-sku", "c8-sku", "c9-sku"].map((id) => codes.find((k) => k.id === id)!);
const FIRST = 0.8;
const EVERY = 1.9;
const MUZZLE_OFFSET: [number, number] = [210, 110];
export const GUN_SCALE = 1.4;

// 掃描槍狀態：在目標之間移動，槍口相對目標固定偏移
export const gunState = (t: number) => {
  const pts = TARGETS.map((k) => toView(CLOSE, FULL, k.x + k.w / 2, k.y + k.h / 2));
  let i = 0;
  for (let n = 0; n < TARGETS.length; n++) if (t >= FIRST + n * EVERY - 0.7) i = n;
  const prev = pts[Math.max(0, i - 1)];
  const move = interpolate(t, [FIRST + i * EVERY - 0.7, FIRST + i * EVERY - 0.1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const tx = prev[0] + (pts[i][0] - prev[0]) * move;
  const ty = prev[1] + (pts[i][1] - prev[1]) * move;
  const mx = tx + MUZZLE_OFFSET[0];
  const my = ty + MUZZLE_OFFSET[1];
  const angle = (Math.atan2(ty - my, tx - mx) * 180) / Math.PI - 180;
  const laser = t >= FIRST + i * EVERY && t < FIRST + i * EVERY + 0.9 ? i : -1;
  return { tx, ty, mx, my, angle, laser };
};

// S1 痛點：舊式掃描槍逐箱逐個條碼掃描，計數緩慢增加
export const S1Pain: React.FC<SceneProps> = ({ c, ff }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const count = t < FIRST ? 0 : Math.min(TARGETS.length, 1 + Math.floor((t - FIRST) / EVERY));
  const sinceTick = t < FIRST ? 99 : ((t - FIRST) % EVERY) * fps;
  const pulse = interpolate(sinceTick, [0, 8], [1.12, 1], { extrapolateRight: "clamp" });
  const g = gunState(t);
  const target = g.laser >= 0 ? TARGETS[g.laser] : null;
  const cw = target ? target.w * CLOSE.scale : 0;
  const ch = target ? target.h * CLOSE.scale : 0;
  const sweep = target ? ((t - (FIRST + g.laser * EVERY)) / 0.9) * 2 - 1 : 0;
  return (
    <AbsoluteFill>
      <PalletWorld cam={CLOSE} vp={FULL} />
      {target && (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <line x1={g.mx} y1={g.my} x2={g.tx} y2={g.ty} stroke="#FF2B2B" strokeWidth={3} opacity={0.35} />
          <line x1={g.tx - cw / 2 - 20} x2={g.tx + cw / 2 + 20} y1={g.ty + sweep * ch * 0.3} y2={g.ty + sweep * ch * 0.3} stroke="#FF2B2B" strokeWidth={5} style={{ filter: "drop-shadow(0 0 6px #FF2B2B)" }} />
        </svg>
      )}
      <ScannerGun x={g.mx} y={g.my} angle={g.angle} scale={GUN_SCALE} />
      <Panel style={{ left: 64, top: 64 }}>
        <div style={{ fontFamily: ff, fontSize: 30, opacity: 0.8 }}>{c.ui.s1Counter}</div>
        <div style={{ fontFamily: ff, fontSize: 96, fontWeight: 700, lineHeight: 1.05, transform: `scale(${pulse})`, transformOrigin: "left center", color: count ? colors.paper : "rgba(255,255,255,0.4)" }}>
          {count}
        </div>
      </Panel>
      <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
      {TARGETS.map((_, k) => (
        <Sfx key={k} at={FIRST + k * EVERY} name="beep" volume={0.55} />
      ))}
    </AbsoluteFill>
  );
};
