import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DemoBadge } from "../components/DemoBadge";
import { ProductImage } from "../components/ProductImage";
import { ScannerGun } from "../components/Scanner";
import { ShelfWorld } from "../components/ShelfWorld";
import { Viewfinder } from "../components/Viewfinder";
import { colors } from "../brand";
import { media } from "../content";
import { lerpCam, WIDE } from "../data/shelf";
import { FRONT_SCREEN, productBoxes } from "../data/products";
import { CLOSE, gunState, GUN_SCALE } from "./S1Pain";
import type { SceneProps } from "./types";

const H = 760; // 機身直立高度
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

// S2 登場：掃描槍退場、鏡頭後退；TC501 升起轉橫向，螢幕顯示相機畫面，推近接 S3
export const S2Reveal: React.FC<SceneProps> = ({ c, ff }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const at = (a: number, b: number, from = 0, to = 1) => interpolate(t, [a, b], [from, to], { ...clamp, easing: ease });

  const cam = lerpCam(CLOSE, WIDE, at(0.5, 3.0));
  const g = gunState(8);
  const gunOut = at(0, 1.2);
  const dim = at(2.0, 3.0, 0, 0.55) * (1 - at(6.6, 7.4));

  const front = media.tc501.find((f) => f.endsWith("2.jpg"));
  const [dx0, dy0, dx1, dy1] = productBoxes["2.jpg"];
  const k = H / (dy1 - dy0);
  const devW = (dx1 - dx0) * k;
  const [sx0, sy0, sx1, sy1] = FRONT_SCREEN;
  const scr = { left: (sx0 - dx0) * k, top: (sy0 - dy0) * k, w: (sx1 - sx0) * k, h: (sy1 - sy0) * k };

  const rise = at(2.2, 3.6, 900, 0);
  const rot = at(3.8, 4.8, 0, -90);
  const screenOn = at(4.8, 5.3);
  const zoomTarget = 1920 / scr.h; // 橫向後螢幕寬度 = scr.h
  const zoom = at(6.0, 7.6, 1, zoomTarget);
  const deviceOpacity = 1 - at(7.1, 7.8);
  const contentScale = scr.h / 1920;

  return (
    <AbsoluteFill>
      <ShelfWorld cam={cam} />
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${dim})` }} />
      {gunOut < 1 && <ScannerGun x={g.mx + gunOut * 700} y={g.my + gunOut * 700} angle={g.angle} scale={GUN_SCALE} />}
      <Viewfinder opacity={at(7.0, 7.8)} />
      {front && deviceOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            left: 960 - devW / 2,
            top: 540 - H / 2 + rise,
            width: devW,
            height: H,
            opacity: deviceOpacity,
            transform: `rotate(${rot}deg) scale(${zoom})`,
          }}
        >
          <ProductImage src={front} height={H} clip multiply />
          <div style={{ position: "absolute", left: scr.left, top: scr.top, width: scr.w, height: scr.h, overflow: "hidden", borderRadius: 14 * k, opacity: screenOn, background: "#000" }}>
            <div
              style={{
                position: "absolute",
                width: scr.h,
                height: scr.w,
                left: (scr.w - scr.h) / 2,
                top: (scr.h - scr.w) / 2,
                transform: "rotate(90deg)",
                overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", width: 1920, height: 1080, left: 0, top: (scr.w - 1080 * contentScale) / 2, transformOrigin: "0 0", transform: `scale(${contentScale})` }}>
                <ShelfWorld cam={WIDE} />
                <Viewfinder />
                <div style={{ position: "absolute", left: 60, top: 50, fontFamily: ff, fontSize: 44, fontWeight: 700, color: colors.paper, background: colors.primary, padding: "6px 22px", borderRadius: 6 }}>
                  {c.ui.s2Viewfinder}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {screenOn > 0 && (
        <AbsoluteFill style={{ opacity: screenOn }}>
          <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
