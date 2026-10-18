import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import "./fonts";
import { fontFamily, type Variant } from "./brand";
import { contentFor, media, scene, type SceneId } from "./content";
import { Subtitles } from "./components/Subtitles";
import { S1Pain } from "./scenes/S1Pain";
import { S2Reveal } from "./scenes/S2Reveal";
import { S3Detect } from "./scenes/S3Detect";
import { S4Track } from "./scenes/S4Track";
import { S5UseCase } from "./scenes/S5UseCase";
import { S6Camera } from "./scenes/S6Camera";
import { S7Outro } from "./scenes/S7Outro";
import type { SceneProps } from "./scenes/types";

// real：寫實版（S1–S5 背景用 Kling 片段，片尾加「部分畫面由 AI 生成」）
export type VideoProps = { variant: Variant; burnSubtitles: boolean; real: boolean };

const SCENES: [SceneId, React.FC<SceneProps>][] = [
  ["s1", S1Pain],
  ["s2", S2Reveal],
  ["s3", S3Detect],
  ["s4", S4Track],
  ["s5", S5UseCase],
  ["s6", S6Camera],
  ["s7", S7Outro],
];

// 背景音樂音量：無旁白時 0.75（全片約 -16 LUFS）；有旁白時，旁白區段壓到 0.3（前後 0.25 秒漸變）
const BGM_LEVEL = 0.75;
const BGM_DUCKED = 0.3;

export const Video: React.FC<VideoProps> = ({ variant, burnSubtitles, real }) => {
  const c = contentFor(variant);
  const ff = fontFamily(variant);
  const { fps } = useVideoConfig();
  const subs = c.scenes.flatMap((s) => s.subs);
  const bgmVolume = (f: number) => {
    if (!media.vo) return BGM_LEVEL;
    const t = f / fps;
    const near = Math.max(0, ...subs.map((s) => interpolate(t, [s.start - 0.25, s.start, s.end, s.end + 0.25], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
    return BGM_LEVEL + (BGM_DUCKED - BGM_LEVEL) * near;
  };
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SCENES.map(([id, Comp]) => (
        <Sequence key={id} name={id.toUpperCase()} {...scene(id)}>
          <Comp c={c} ff={ff} real={real} />
        </Sequence>
      ))}
      {media.bgm && <Audio src={staticFile(media.bgm)} volume={bgmVolume} />}
      {media.vo && <Audio src={staticFile(media.vo)} />}
      {burnSubtitles && <Subtitles subs={subs} fontFamily={ff} centerX={(t) => (t >= 9 && t < 48 ? 600 : 960)} />}
    </AbsoluteFill>
  );
};
