import { Bars, QR } from "./codes";
import { cartons, codes, FLOOR_Y, PALLET, WORLD, type Camera, type Viewport } from "../data/pallet";

// 程式繪製的收貨區：背景貨架、地面、棧板及 12 箱貨。按鏡頭縮放進任意視窗。
export const PalletWorld: React.FC<{ cam: Camera; vp: Viewport }> = ({ cam, vp }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: vp.w, height: vp.h, overflow: "hidden", background: "#C9D0D6" }}>
    <div
      style={{
        position: "absolute",
        width: WORLD.w,
        height: WORLD.h,
        transformOrigin: "0 0",
        transform: `translate(${vp.w / 2 - cam.cx * cam.scale}px, ${vp.h / 2 - cam.cy * cam.scale}px) scale(${cam.scale})`,
      }}
    >
      <Backdrop />
      {/* 棧板 */}
      <div style={{ position: "absolute", left: PALLET.x - 10, top: PALLET.y, width: PALLET.w + 20, height: 18, background: "#2E3236", borderRadius: 3 }} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: PALLET.x + i * (PALLET.w / 2 - 40), top: PALLET.y + 18, width: 80, height: PALLET.h - 18, background: "#23272A" }} />
      ))}
      <div style={{ position: "absolute", left: PALLET.x - 10, top: PALLET.y + PALLET.h - 10, width: PALLET.w + 20, height: 12, background: "#2E3236" }} />
      {cartons.map((c) => (
        <div key={c.n}>
          <div style={{ position: "absolute", left: c.x, top: c.y, width: c.w, height: c.h, background: c.n % 2 ? "#BE9361" : "#B3874F", borderRadius: 3, boxShadow: "inset 0 -8px 0 rgba(0,0,0,0.10), inset 0 6px 0 rgba(255,255,255,0.10)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: "46%", height: 14, background: "rgba(255,255,255,0.10)" }} />
            {/* 易碎、向上標誌 */}
            <div style={{ position: "absolute", right: 14, top: 14, display: "flex", gap: 4 }}>
              {[0, 1].map((k) => (
                <div key={k} style={{ width: 18, height: 18, border: "2px solid rgba(40,30,20,0.55)", borderRadius: 2 }} />
              ))}
            </div>
          </div>
          {/* 收貨標籤：文字行用灰條示意（畫面不出現可讀文字） */}
          <div style={{ position: "absolute", left: c.label.x, top: c.label.y, width: c.label.w, height: c.label.h, background: "#FAFAFA", borderRadius: 2, boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
            <div style={{ position: "absolute", left: 14, top: 10, width: 90, height: 8, background: "#9AA1A8" }} />
            <div style={{ position: "absolute", left: 14, top: 64, width: 60, height: 6, background: "#B8BEC4" }} />
            <div style={{ position: "absolute", left: 108, top: 82, width: 36, height: 6, background: "#B8BEC4" }} />
          </div>
        </div>
      ))}
      {codes.map((k) => (
        <div key={k.id} style={{ position: "absolute", left: k.x, top: k.y, width: k.w, height: k.h, background: "#FFF", outline: k.type === "QR" ? "6px solid #FFF" : undefined }}>
          {k.type === "1D" ? <Bars seed={k.id} w={k.w} h={k.h} /> : <QR seed={k.id} size={k.w} />}
        </div>
      ))}
    </div>
  </div>
);

// 背景：牆、遠處貨架（低對比）、地面
const Backdrop: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: -400, top: -200, width: WORLD.w + 800, height: FLOOR_Y + 200, background: "linear-gradient(#BFC7CE, #D5DADF)" }} />
    {[-260, 260, 1500, 2020].map((x) => (
      <div key={x} style={{ position: "absolute", left: x, top: 60, width: 420, height: FLOOR_Y - 60, opacity: 0.45 }}>
        {[0, 1, 2].map((r) => (
          <div key={r} style={{ position: "absolute", left: 0, right: 0, top: 120 + r * 260, height: 14, background: "#7E8892" }} />
        ))}
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((k) => (
            <div key={`${r}-${k}`} style={{ position: "absolute", left: 20 + k * 132, top: 120 + r * 260 - 110, width: 110, height: 110, background: "#B08A60", opacity: 0.7 }} />
          )),
        )}
        <div style={{ position: "absolute", left: 0, top: 0, width: 16, height: "100%", background: "#6E7882" }} />
        <div style={{ position: "absolute", right: 0, top: 0, width: 16, height: "100%", background: "#6E7882" }} />
      </div>
    ))}
    <div style={{ position: "absolute", left: -400, top: FLOOR_Y, width: WORLD.w + 800, height: 600, background: "linear-gradient(#8E969D, #747C83)" }} />
    <div style={{ position: "absolute", left: -400, top: FLOOR_Y + 70, width: WORLD.w + 800, height: 10, background: "#E8C547", opacity: 0.8 }} />
  </>
);
