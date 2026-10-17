import { AbsoluteFill } from "remotion";
import { Bars, DM, QR } from "./codes";
import { codeCenter, codeSizeOf, items, PLANK_T, PLANKS, WORLD, type Camera, type Item } from "../data/shelf";

// 程式繪製的貨架場景（取代 AI 寫實片段）。整個世界按鏡頭平移縮放。
export const ShelfWorld: React.FC<{ cam: Camera }> = ({ cam }) => (
  <AbsoluteFill style={{ background: "linear-gradient(#C9D0D6, #DCE1E5 60%, #B7BEC5)", overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        width: WORLD.w,
        height: WORLD.h,
        transformOrigin: "0 0",
        transform: `translate(${960 - cam.cx * cam.scale}px, ${540 - cam.cy * cam.scale}px) scale(${cam.scale})`,
      }}
    >
      {/* 牆面燈光 */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)" }} />
      {/* 立柱 */}
      {[20, WORLD.w - 50].map((x) => (
        <div key={x} style={{ position: "absolute", left: x, top: 40, width: 30, height: WORLD.h, background: "#56606A" }} />
      ))}
      {items.map((it) => (
        <ItemView key={it.id} it={it} />
      ))}
      {/* 層板（畫在貨品之上，遮住底邊） */}
      {PLANKS.map((y) => (
        <div key={y} style={{ position: "absolute", left: 0, top: y, width: WORLD.w, height: PLANK_T, background: "linear-gradient(#8A949E, #69737D)", boxShadow: "0 8px 16px rgba(0,0,0,0.25)" }} />
      ))}
      {items.filter((it) => it.kind === "tag").map((it) => (
        <ItemView key={it.id} it={it} />
      ))}
    </div>
  </AbsoluteFill>
);

const ItemView: React.FC<{ it: Item }> = ({ it }) => {
  const top = it.base - it.h;
  const [cx, cy] = codeCenter(it);
  const [cw, ch] = codeSizeOf(it.code);
  const code = (
    <div style={{ position: "absolute", left: cx - cw / 2, top: cy - ch / 2, width: cw, height: ch, background: "#FFF" }}>
      {it.code === "1D" ? <Bars seed={it.id} w={cw} h={ch} /> : it.code === "QR" ? <QR seed={it.id} size={cw} /> : <DM seed={it.id} size={cw} />}
    </div>
  );
  const labelPad = it.kind === "tag" ? 0 : 14;
  if (it.kind === "tag") {
    return (
      <>
        <div style={{ position: "absolute", left: it.x - it.w / 2, top, width: it.w, height: it.h, background: "#FFFFFF", borderRadius: 4, boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
          <div style={{ position: "absolute", left: 10, top: 14, width: 34, height: 8, background: "#B8BEC4" }} />
          <div style={{ position: "absolute", left: 10, top: 30, width: 26, height: 22, background: "#3A3F44" }} />
        </div>
        {code}
      </>
    );
  }
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: it.x - it.w / 2,
          top,
          width: it.w,
          height: it.h,
          background: it.color,
          borderRadius: it.kind === "product" ? 6 : 3,
          boxShadow: "inset 0 -10px 0 rgba(0,0,0,0.08)",
        }}
      >
        {it.kind === "parcel" && <div style={{ position: "absolute", left: "44%", width: "12%", top: 0, height: "100%", background: "rgba(255,255,255,0.12)" }} />}
        {it.kind === "product" && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26, background: "rgba(255,255,255,0.22)", borderRadius: "6px 6px 0 0" }} />
            <div style={{ position: "absolute", left: 24, right: 24, top: 60, height: 70, borderRadius: 40, background: "rgba(255,255,255,0.28)" }} />
          </>
        )}
      </div>
      {/* 白色標籤底 */}
      <div style={{ position: "absolute", left: cx - cw / 2 - labelPad, top: cy - ch / 2 - labelPad, width: cw + labelPad * 2, height: ch + labelPad * 2 + (it.kind === "parcel" ? 18 : 0), background: "#FAFAFA", borderRadius: 2 }} />
      {code}
    </>
  );
};
