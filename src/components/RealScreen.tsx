import { OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../brand";
import { media } from "../content";
import labelsData from "../generated/labels.json";
import { Viewport as VP } from "../data/pallet";
import { Viewfinder } from "./Viewfinder";

type ClipInfo = { src: string; sec: number | null };
type Track = { id: number; frames: ([number, number, number, number] | null)[] };
type Labels = { fps: number; width: number; height: number; frameCount: number; labels: Track[] };

const clips = media.clips as Record<string, ClipInfo>;
const allLabels = labelsData as unknown as Record<string, Labels>;

export type ScreenRect = { id: number; x: number; y: number; w: number; h: number };
export type RealClipId = "r2" | "r3" | "r4" | "r5";

export const hasRealScreen = (id: RealClipId) => Boolean(clips[id]);
export const trackedCount = (id: RealClipId) => allLabels[id]?.labels.length ?? 0;

// 裁切範圍（歸一化）：包住所有標籤軌跡，按螢幕直向比例擴展；沒有追蹤結果時取畫面左側三分之二中央
const cropFor = (id: RealClipId, vp: VP) => {
  const L = allLabels[id];
  const clipW = L?.width ?? 1920;
  const clipH = L?.height ?? 1080;
  let x0 = 0.12, y0 = 0.1, x1 = 0.62, y1 = 0.9;
  if (L && L.labels.length) {
    const boxes = L.labels.flatMap((t) => t.frames.filter((b): b is [number, number, number, number] => Boolean(b)));
    x0 = Math.min(...boxes.map((b) => b[0]));
    y0 = Math.min(...boxes.map((b) => b[1]));
    x1 = Math.max(...boxes.map((b) => b[0] + b[2]));
    y1 = Math.max(...boxes.map((b) => b[1] + b[3]));
  }
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  let w = (x1 - x0) * 1.15;
  let h = (w * clipW * (vp.h / vp.w)) / clipH;
  if (h < (y1 - y0) * 1.15) {
    h = (y1 - y0) * 1.15;
    w = (h * clipH * (vp.w / vp.h)) / clipW;
  }
  // 填滿螢幕：裁切高度不超過片段高度（避免上下黑邊），左右可能裁掉部分畫面
  if (h > 1) {
    w = (w * 1) / h;
    h = 1;
  }
  const x = Math.min(Math.max(cx - w / 2, 0), 1 - w);
  const y = Math.min(Math.max(cy - h / 2, 0), 1 - h);
  return { x, y, w, h, clipW, clipH };
};

// 寫實版 TC501 螢幕：顯示同一段 Kling 片段的裁切實景，children 取得當格每個標籤在螢幕上的位置
export const RealScreen: React.FC<{
  id: RealClipId;
  vp: VP;
  ff: string;
  status: string;
  children?: (rects: ScreenRect[]) => React.ReactNode;
}> = ({ id, vp, ff, status, children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const clip = clips[id];
  if (!clip) return null;
  const sceneSec = durationInFrames / fps;
  const rate = clip.sec && clip.sec < sceneSec ? clip.sec / sceneSec : 1;
  const crop = cropFor(id, vp);
  const k = vp.w / (crop.w * crop.clipW);
  const L = allLabels[id];
  const lf = L ? Math.min(L.frameCount - 1, Math.round((frame / fps) * rate * L.fps)) : 0;
  const rects: ScreenRect[] = (L?.labels ?? []).flatMap((t) => {
    const b = t.frames[lf];
    if (!b) return [];
    return [{ id: t.id, x: (b[0] - crop.x) * crop.clipW * k, y: (b[1] - crop.y) * crop.clipH * k, w: b[2] * crop.clipW * k, h: b[3] * crop.clipH * k }];
  });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#000" }}>
      <OffthreadVideo
        src={staticFile(clip.src)}
        muted
        playbackRate={rate}
        style={{ position: "absolute", width: crop.clipW * k, height: crop.clipH * k, left: -crop.x * crop.clipW * k, top: -crop.y * crop.clipH * k, maxWidth: "none" }}
      />
      {children?.(rects)}
      <Viewfinder inset={14} size={34} thickness={3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0))" }} />
      <div style={{ position: "absolute", left: "50%", top: 22, transform: "translateX(-50%)", fontFamily: ff, fontSize: 20, fontWeight: 700, color: colors.paper, background: colors.successDark, padding: "4px 16px", borderRadius: 999, whiteSpace: "nowrap" }}>
        {status}
      </div>
    </div>
  );
};
