import { Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { media } from "../content";

// 在場景內 at 秒播放一個合成音效（audio/sfx/<name>.wav）；檔案不存在時不發聲
export const Sfx: React.FC<{ at: number; name: string; volume?: number }> = ({ at, name, volume = 1 }) => {
  const { fps } = useVideoConfig();
  if (!media.sfx.includes(name)) return null;
  return (
    <Sequence from={Math.round(at * fps)} layout="none" name={`sfx:${name}`}>
      <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={volume} />
    </Sequence>
  );
};
