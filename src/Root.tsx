import { Composition } from "remotion";
import { DURATION_SEC, FPS } from "./content";
import { Video } from "./Video";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="TC501-EP01"
      component={Video}
      durationInFrames={DURATION_SEC * FPS}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ variant: "hant", burnSubtitles: true }}
    />
    <Composition
      id="TC501-EP01-Hans"
      component={Video}
      durationInFrames={DURATION_SEC * FPS}
      fps={FPS}
      width={1920}
      height={1080}
      defaultProps={{ variant: "hans", burnSubtitles: true }}
    />
  </>
);
