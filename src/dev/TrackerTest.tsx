import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PalletWorld } from "../components/PalletWorld";
import { FULL, SPLIT } from "../data/pallet";

// 開發用：產生平移＋推近的棧板片段，測試 scripts/track-labels.py
export const TrackerTest: React.FC = () => {
  const f = useCurrentFrame();
  const cam = { cx: SPLIT.cx + interpolate(f, [0, 180], [0, -160]), cy: 540, scale: interpolate(f, [0, 180], [0.95, 1.12]) };
  return (
    <AbsoluteFill>
      <PalletWorld cam={cam} vp={FULL} />
    </AbsoluteFill>
  );
};
