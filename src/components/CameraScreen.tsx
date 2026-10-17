import { colors } from "../brand";
import { PalletWorld } from "./PalletWorld";
import { Viewfinder } from "./Viewfinder";
import { screenCam, type Camera, type Viewport } from "../data/pallet";

// TC501 螢幕上的相機畫面（App 示意）：實景＋觀景框＋頂部狀態列，children 為疊加層
export const CameraScreen: React.FC<{
  vp: Viewport;
  ff: string;
  status: string;
  cam?: Camera;
  children?: (cam: Camera) => React.ReactNode;
}> = ({ vp, ff, status, cam, children }) => {
  const c = cam ?? screenCam(vp);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <PalletWorld cam={c} vp={vp} />
      {children?.(c)}
      <Viewfinder inset={14} size={34} thickness={3} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0))" }} />
      <div style={{ position: "absolute", left: "50%", top: 22, transform: "translateX(-50%)", fontFamily: ff, fontSize: 20, fontWeight: 700, color: colors.paper, background: colors.successDark, padding: "4px 16px", borderRadius: 999, whiteSpace: "nowrap" }}>
        {status}
      </div>
    </div>
  );
};
