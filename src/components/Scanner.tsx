// 舊式手持掃描槍（扁平圖形），槍口在 (0,0)，指向左上方
export const ScannerGun: React.FC<{ x: number; y: number; angle: number; scale?: number }> = ({ x, y, angle, scale = 1 }) => (
  <svg
    width={420}
    height={420}
    viewBox="-40 -40 420 420"
    style={{ position: "absolute", left: x - 40, top: y - 40, transformOrigin: "40px 40px", transform: `rotate(${angle}deg) scale(${scale})`, overflow: "visible" }}
  >
    {/* 機頭 */}
    <path d="M0 -26 L230 -40 Q262 -40 262 -8 L262 40 Q262 62 240 62 L120 62 L0 30 Z" fill="#2B2F33" />
    <rect x={-6} y={-22} width={14} height={48} rx={4} fill="#111" />
    <rect x={-4} y={-14} width={8} height={30} rx={2} fill="#E53935" opacity={0.85} />
    {/* 握把 */}
    <path d="M140 58 L200 58 L232 250 Q236 272 212 272 L186 272 Q170 272 166 256 Z" fill="#202326" />
    {/* 扳機 */}
    <path d="M128 66 Q118 96 140 110 L150 70 Z" fill="#3A3F44" />
    <rect x={150} y={-30} width={70} height={10} rx={5} fill="#3A3F44" />
  </svg>
);
