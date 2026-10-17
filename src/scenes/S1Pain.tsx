import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DemoBadge } from "../components/DemoBadge";
import { Sfx } from "../components/Sfx";
import { Panel } from "../components/Panel";
import { ScannerGun } from "../components/Scanner";
import { ShelfWorld } from "../components/ShelfWorld";
import { colors } from "../brand";
import { codeCenter, codeSizeOf, items, toScreen, type Camera } from "../data/shelf";
import type { SceneProps } from "./types";

export const CLOSE: Camera = { cx: 800, cy: 520, scale: 1.7 };
const TARGETS = ["B2", "B3", "B4", "A4"].map((id) => items.find((i) => i.id === id)!);
const FIRST = 0.8;
const EVERY = 1.9;
const MUZZLE_OFFSET: [number, number] = [210, 110];
export const GUN_SCALE = 1.4;

// 掃描槍狀態：在目標之間移動，槍口相對目標固定偏移
export const gunState = (t: number) => {
  const pts = TARGETS.map((it) => toScreen(CLOSE, ...codeCenter(it)));
  let i = 0;
  for (let k = 0; k < TARGETS.length; k++) if (t >= FIRST + k * EVERY - 0.7) i = k;
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

// S1 痛點：舊式掃描槍逐一掃描，計數緩慢增加
export const S1Pain: React.FC<SceneProps> = ({ c, ff }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const count = t < FIRST ? 0 : Math.min(TARGETS.length, 1 + Math.floor((t - FIRST) / EVERY));
  const sinceTick = t < FIRST ? 99 : ((t - FIRST) % EVERY) * fps;
  const pulse = interpolate(sinceTick, [0, 8], [1.12, 1], { extrapolateRight: "clamp" });
  const g = gunState(t);
  const target = g.laser >= 0 ? TARGETS[g.laser] : null;
  const [cw, ch] = target ? codeSizeOf(target.code).map((v) => v * CLOSE.scale) : [0, 0];
  const sweep = target ? ((t - (FIRST + g.laser * EVERY)) / 0.9) * 2 - 1 : 0; // 掃描線上下掃動
  return (
    <AbsoluteFill>
      <ShelfWorld cam={CLOSE} />
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
