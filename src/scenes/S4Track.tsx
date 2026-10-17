import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraScreen } from "../components/CameraScreen";
import { DemoBadge } from "../components/DemoBadge";
import { Device } from "../components/Device";
import { CodeBox } from "../components/Overlays";
import { PalletWorld } from "../components/PalletWorld";
import { Sfx } from "../components/Sfx";
import { colors } from "../brand";
import { cartons, codes, FULL, screenCam, SPLIT, type Viewport } from "../data/pallet";
import { DEVICE_CX } from "./S2Reveal";
import type { SceneProps } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LIST_AT = 4.8; // 螢幕切換到結果清單

// S4 移動追蹤：手持設備移動，螢幕上的框跟隨；隨後列出每箱的解碼結果（虛構示範）
export const S4Track: React.FC<SceneProps> = ({ c, ff }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const drift = interpolate(t, [0, 2.2, 4.4], [0, 1, 0], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const list = interpolate(t, [LIST_AT, LIST_AT + 0.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const status = c.ui.s3Read.replace("{n}", String(codes.length));
  return (
    <AbsoluteFill>
      <PalletWorld cam={SPLIT} vp={FULL} />
      <Device cx={DEVICE_CX + drift * -24} cy={540 + drift * 10} screenOn={1} style={{ transform: `rotate(${drift * -2}deg)` }}>
        {(vp) => {
          const base = screenCam(vp);
          const cam = { cx: base.cx + drift * 70, cy: base.cy - drift * 20, scale: base.scale * (1 + drift * 0.08) };
          return (
            <>
              <CameraScreen vp={vp} ff={ff} status={status} cam={cam}>
                {(k) => codes.map((code) => <CodeBox key={code.id} code={code} cam={k} vp={vp} appear={1} />)}
              </CameraScreen>
              {list > 0 && <ResultList vp={vp} ff={ff} c={c} t={t - LIST_AT} progress={list} />}
            </>
          );
        }}
      </Device>
      <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
      <Sfx at={LIST_AT} name="whoosh" volume={0.35} />
      {[0, 3, 6, 9].map((i) => (
        <Sfx key={i} at={LIST_AT + 0.3 + i * 0.22} name="pop" volume={0.35} />
      ))}
    </AbsoluteFill>
  );
};

// 結果清單：每箱一張卡（SKU、數量），逐張出現並向上捲動
const ResultList: React.FC<{ vp: Viewport; ff: string; c: SceneProps["c"]; t: number; progress: number }> = ({ vp, ff, c, t, progress }) => {
  const cardH = 66;
  const gap = 8;
  const top = 74;
  const total = cartons.length * (cardH + gap);
  const scroll = interpolate(t, [2.8, 4.6], [0, Math.max(0, total - (vp.h - top - 20))], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <div style={{ position: "absolute", inset: 0, background: "#F2F4F5", transform: `translateY(${(1 - progress) * 40}px)`, opacity: progress, fontFamily: ff }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: colors.successDark, color: colors.paper, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", zIndex: 2 }}>
        <span style={{ fontSize: 22, fontWeight: 700 }}>{c.ui.s4ListTitle}</span>
        <span style={{ fontSize: 14, opacity: 0.85 }}>{c.ui.s4ListNote}</span>
      </div>
      <div style={{ position: "absolute", left: 12, right: 12, top: top - scroll }}>
        {[...cartons].sort((a, b) => a.n - b.n).map((k, i) => {
          const a = interpolate(t, [0.3 + i * 0.12, 0.5 + i * 0.12], [0, 1], clamp);
          return (
            <div key={k.n} style={{ height: cardH, marginBottom: gap, background: "#FFF", borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.12)", display: "flex", justifyContent: "space-between", overflow: "hidden", opacity: a, transform: `translateX(${(1 - a) * 20}px)` }}>
              <div style={{ padding: "8px 12px", fontSize: 16, lineHeight: 1.45, color: "#555" }}>
                <div>
                  {c.ui.s4Sku}：<b style={{ color: "#111" }}>{k.sku}</b>
                </div>
                <div>
                  {c.ui.s4Qty}：<b style={{ color: "#111" }}>{k.qty}</b>
                </div>
              </div>
              <div style={{ background: colors.successDark, color: colors.paper, fontSize: 16, fontWeight: 700, padding: "0 14px", display: "flex", alignItems: "center", borderBottomLeftRadius: 10 }}>
                {c.ui.s4Box.replace("{n}", String(k.n))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
