import { Bars, DM } from "./codes";
import { cartons, codes, FLOOR_Y, LABEL, PALLET, WORLD, type Camera, type Viewport } from "../data/pallet";

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
          </div>
          {/* 多條碼標籤：文字一律用灰條示意（畫面不出現可讀文字或真實資料） */}
          <div style={{ position: "absolute", left: c.label.x, top: c.label.y, width: c.label.w, height: c.label.h, background: "#FAFAFA", borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
            <div style={{ position: "absolute", left: LABEL.pad, top: 9, width: 112, height: 4, background: "#8E959C" }} />
            {LABEL.rows.map((r, i) => (
              <div key={i}>
                <div style={{ position: "absolute", left: LABEL.pad, top: r.y - 6, width: 34 + (i % 2) * 18, height: 3, background: "#A7AEB5" }} />
                <div style={{ position: "absolute", left: LABEL.pad + 18, top: r.y + LABEL.barH + 2, width: r.w * 0.7, height: 3, background: "#A7AEB5" }} />
              </div>
            ))}
          </div>
        </div>
      ))}
      {codes.map((k) => (
        <div key={k.id} style={{ position: "absolute", left: k.x, top: k.y, width: k.w, height: k.h, background: "#FFF" }}>
          {k.type === "1D" ? <Bars seed={k.id} w={k.w} h={k.h} /> : <DM seed={k.id} size={k.w} />}
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
