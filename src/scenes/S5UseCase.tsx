import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BarcodeBox } from "../components/BarcodeBox";
import { DemoBadge } from "../components/DemoBadge";
import { Panel } from "../components/Panel";
import { ShelfWorld } from "../components/ShelfWorld";
import { Viewfinder } from "../components/Viewfinder";
import { colors } from "../brand";
import { inView, items, MISPLACED_ID, type Kind } from "../data/shelf";
import { PAN_END } from "./S4Track";
import type { SceneProps } from "./types";

const cam = PAN_END;
const visible = items.filter((it) => inView(cam, it));
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// S5 應用場景：前半段盤點計數，後半段一個商品框轉黃並標示「放錯位置」
export const S5UseCase: React.FC<SceneProps> = ({ c, ff }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const half = 5 * fps;
  const countUp = interpolate(frame, [0.5 * fps, 3 * fps], [0, 1], clamp);
  const warnIn = interpolate(frame, [half, half + 10], [0, 1], clamp);
  const countPanel = interpolate(frame, [half - 10, half + 5], [1, 0], clamp);
  const n = (k: Kind) => Math.round(visible.filter((b) => b.kind === k).length * countUp);
  const rows: [string, number][] = [
    [c.ui.s5Parcel, n("parcel")],
    [c.ui.s5Product, n("product")],
    [c.ui.s5Tag, n("tag")],
  ];
  return (
    <AbsoluteFill>
      <ShelfWorld cam={cam} />
      <Viewfinder />
      {visible.map((it) => {
        const isWarn = it.id === MISPLACED_ID && warnIn > 0;
        return (
          <BarcodeBox
            key={it.id}
            it={it}
            cam={cam}
            fontFamily={ff}
            appear={1}
            color={isWarn ? colors.warn : colors.primary}
            dim={it.id === MISPLACED_ID ? 1 : interpolate(warnIn, [0, 1], [1, 0.35])}
            caption={isWarn ? c.ui.s5Misplaced : undefined}
          />
        );
      })}
      {countPanel > 0 && (
        <Panel style={{ left: 64, top: 64, width: 380, opacity: countPanel }}>
          <div style={{ fontFamily: ff, fontSize: 34, fontWeight: 700, marginBottom: 10 }}>{c.ui.s5CountTitle}</div>
          {rows.map(([label, v]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontFamily: ff, fontSize: 30, padding: "4px 0" }}>
              <span style={{ opacity: 0.8 }}>{label}</span>
              <span style={{ fontWeight: 700 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: ff, fontSize: 34, fontWeight: 700, borderTop: "1px solid rgba(255,255,255,0.3)", marginTop: 8, paddingTop: 8 }}>
            <span>{c.ui.s5Total}</span>
            <span>{rows.reduce((a, [, v]) => a + v, 0)}</span>
          </div>
        </Panel>
      )}
      {warnIn > 0 && (
        <Panel style={{ left: 64, top: 64, opacity: warnIn, borderLeftColor: colors.warn }}>
          <div style={{ fontFamily: ff, fontSize: 40, fontWeight: 700, color: colors.warn }}>{c.ui.s5Misplaced}</div>
          <div style={{ fontFamily: ff, fontSize: 24, opacity: 0.8 }}>{c.ui.s5AppNote}</div>
        </Panel>
      )}
      <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
    </AbsoluteFill>
  );
};
