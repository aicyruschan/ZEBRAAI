import { Composition } from "remotion";
import { DURATION_SEC, FPS } from "./content";
import { TrackerTest } from "./dev/TrackerTest";
import { Video, type VideoProps } from "./Video";

// 動態圖形版（全程式繪製）及寫實版（S1–S5 用 Kling 片段），各有繁簡兩版
const VERSIONS: [string, VideoProps][] = [
  ["TC501-EP01", { variant: "hant", burnSubtitles: true, real: false }],
  ["TC501-EP01-Hans", { variant: "hans", burnSubtitles: true, real: false }],
  ["TC501-EP01-Real", { variant: "hant", burnSubtitles: true, real: true }],
  ["TC501-EP01-Real-Hans", { variant: "hans", burnSubtitles: true, real: true }],
];

export const RemotionRoot: React.FC = () => (
  <>
    {VERSIONS.map(([id, props]) => (
      <Composition key={id} id={id} component={Video} durationInFrames={DURATION_SEC * FPS} fps={FPS} width={1920} height={1080} defaultProps={props} />
    ))}
    <Composition id="Dev-TrackerTest" component={TrackerTest} durationInFrames={180} fps={30} width={1920} height={1080} />
  </>
);
