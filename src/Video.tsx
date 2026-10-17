import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
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

export type VideoProps = { variant: Variant; burnSubtitles: boolean };

const SCENES: [SceneId, React.FC<SceneProps>][] = [
  ["s1", S1Pain],
  ["s2", S2Reveal],
  ["s3", S3Detect],
  ["s4", S4Track],
  ["s5", S5UseCase],
  ["s6", S6Camera],
  ["s7", S7Outro],
];

export const Video: React.FC<VideoProps> = ({ variant, burnSubtitles }) => {
  const c = contentFor(variant);
  const ff = fontFamily(variant);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {SCENES.map(([id, Comp]) => (
        <Sequence key={id} name={id.toUpperCase()} {...scene(id)}>
          <Comp c={c} ff={ff} />
        </Sequence>
      ))}
      {media.vo && <Audio src={staticFile(media.vo)} />}
      {burnSubtitles && <Subtitles subs={c.scenes.flatMap((s) => s.subs)} fontFamily={ff} />}
    </AbsoluteFill>
  );
};
