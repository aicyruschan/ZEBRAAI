import { AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig } from "remotion";
import { colors } from "../brand";
import { media } from "../content";

type ClipInfo = { src: string; sec: number | null };
const clips = media.clips as Record<string, ClipInfo>;

// 寫實版背景：Kling 生成的片段（assets/clips/r1–r5.mp4）。缺片時顯示灰色占位。
// 片段本身靜音，聲音由合成 BGM／音效負責，避免 AI 環境聲與音效打架。
export const RealClip: React.FC<{ id: "r1" | "r2" | "r3" | "r4" | "r5"; label: string; hint: string; ff: string }> = ({ id, label, hint, ff }) => {
  const { durationInFrames, fps } = useVideoConfig();
  const clip = clips[id];
  if (clip) {
    const sceneSec = durationInFrames / fps;
    const playbackRate = clip.sec && clip.sec < sceneSec ? clip.sec / sceneSec : 1;
    return (
      <AbsoluteFill>
        <OffthreadVideo src={staticFile(clip.src)} muted playbackRate={playbackRate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ backgroundColor: colors.placeholder, justifyContent: "flex-end", padding: 48 }}>
      <div style={{ fontFamily: ff, color: "rgba(255,255,255,0.6)", fontSize: 30, lineHeight: 1.4 }}>
        <div style={{ fontWeight: 700 }}>{`${label} · ${id.toUpperCase()}`}</div>
        <div style={{ fontSize: 24 }}>{hint}</div>
      </div>
    </AbsoluteFill>
  );
};
