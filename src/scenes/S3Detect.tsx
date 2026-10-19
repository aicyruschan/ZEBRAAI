import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CameraScreen } from "../components/CameraScreen";
import { DemoBadge } from "../components/DemoBadge";
import { Device } from "../components/Device";
import { CodeBox, LabelBox, LabelTick } from "../components/Overlays";
import { PalletWorld } from "../components/PalletWorld";
import { RealClip } from "../components/RealClip";
import {
  RealScreen,
  hasRealScreen,
  trackedCount,
} from "../components/RealScreen";
import { Panel } from "../components/Panel";
import { Sfx } from "../components/Sfx";
import { colors } from "../brand";
import { cartons, codes, FULL, SPLIT } from "../data/pallet";
import { DEVICE_CX } from "./S2Reveal";
import type { SceneProps } from "./types";

// 一次對準整堆貨：28 個條碼在約 1.4 秒內幾乎同時被框選（亂序出現，表現「同時讀取」）
// TC501 背面相機一次過讀完：全部條碼同一刻出綠框，之後每張標籤出勾號
export const READ_AT = 1.0;
export const TICK_AT = 1.6;
export const readSec = () => READ_AT;
const tickSec = (n: number) => TICK_AT + (n % 3) * 0.04;

export const S3Detect: React.FC<SceneProps> = ({ c, ff, real }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const useReal = real && hasRealScreen("r3");
  // 寫實版：每個追蹤到的標籤同一刻變綠
  const n = useReal ? trackedCount("r3") : codes.length;
  const realSec = () => READ_AT;
  const shown = t >= READ_AT ? n : 0;
  const label = c.ui.s3Read.replace("{n}", String(shown));
  return (
    <AbsoluteFill>
      {real ? (
        <RealClip
          id="r3"
          label={c.ui.realPlaceholder}
          hint={c.ui.realHint}
          ff={ff}
        />
      ) : (
        <PalletWorld cam={SPLIT} vp={FULL} />
      )}
      <Device cx={DEVICE_CX} cy={540} screenOn={1}>
        {(vp) =>
          useReal ? (
            <RealScreen
              id="r3"
              vp={vp}
              ff={ff}
              status={shown ? label : c.ui.s2Status}
            >
              {(rects) =>
                rects.map((r) => (
                  <LabelBox
                    key={r.id}
                    r={r}
                    appear={interpolate(t - realSec(), [0, 0.2], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    })}
                  />
                ))
              }
            </RealScreen>
          ) : (
            <CameraScreen
              vp={vp}
              ff={ff}
              status={shown ? label : c.ui.s2Status}
            >
              {(cam) => (
                <>
                  {codes.map((k) => (
                    <CodeBox
                      key={k.id}
                      code={k}
                      cam={cam}
                      vp={vp}
                      appear={interpolate(t - READ_AT, [0, 0.15], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}
                    />
                  ))}
                  {cartons.map((k) => (
                    <LabelTick
                      key={k.n}
                      carton={k}
                      cam={cam}
                      vp={vp}
                      appear={interpolate(t - tickSec(k.n), [0, 0.2], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      })}
                    />
                  ))}
                </>
              )}
            </CameraScreen>
          )
        }
      </Device>
      {shown > 0 && (
        <Panel style={{ left: 64, top: 64, borderLeftColor: colors.success }}>
          <div style={{ fontFamily: ff, fontSize: 40, fontWeight: 700 }}>
            {label}
          </div>
        </Panel>
      )}
      <DemoBadge text={c.ui.demoBadge} fontFamily={ff} />
      <Sfx at={READ_AT} name="ui-on" volume={0.6} />
      <Sfx at={TICK_AT} name="confirm" volume={0.6} />
    </AbsoluteFill>
  );
};
