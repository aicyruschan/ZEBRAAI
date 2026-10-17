import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

type Sub = { start: number; end: number; text: string };

// 燒入字幕：與 subs/*.srt 同一來源
export const Subtitles: React.FC<{ subs: Sub[]; fontFamily: string }> = ({ subs, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const current = subs.find((s) => t >= s.start && t < s.end);
  if (!current) return null;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}>
      <div
        style={{
          fontFamily,
          fontSize: 46,
          fontWeight: 700,
          color: "#FFFFFF",
          background: "rgba(0,0,0,0.6)",
          padding: "8px 28px",
          borderRadius: 6,
          letterSpacing: 1,
        }}
      >
        {current.text}
      </div>
    </AbsoluteFill>
  );
};
