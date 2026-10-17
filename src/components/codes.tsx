// 示意條碼圖案：以 id 為種子的確定性隨機圖形，不可解碼，只作視覺示意
const rng = (seedStr: string) => {
  let s = 0;
  for (const ch of seedStr) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const INK = "#1A1A1A";

export const Bars: React.FC<{ seed: string; w: number; h: number }> = ({ seed, w, h }) => {
  const r = rng(seed);
  const bars: [number, number][] = [];
  let x = 0;
  while (x < w) {
    const bw = 1.5 + Math.floor(r() * 4) * 1.5;
    if (r() > 0.42) bars.push([x, Math.min(bw, w - x)]);
    x += bw + 1.5 + Math.floor(r() * 2) * 1.5;
  }
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      {bars.map(([bx, bw], i) => (
        <rect key={i} x={bx} y={0} width={bw} height={h} fill={INK} />
      ))}
    </svg>
  );
};

const Grid: React.FC<{ seed: string; size: number; n: number; finder: "qr" | "dm" }> = ({ seed, size, n, finder }) => {
  const r = rng(seed);
  const c = size / n;
  const cells: [number, number][] = [];
  const inFinder = (i: number, j: number) =>
    finder === "qr" && ((i < 8 && j < 8) || (i < 8 && j >= n - 8) || (i >= n - 8 && j < 8));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++) {
      if (finder === "dm") {
        const solid = j === 0 || i === n - 1;
        const clock = (i === 0 && j % 2 === 0) || (j === n - 1 && i % 2 === 1);
        if (solid || clock) cells.push([i, j]);
        else if (i > 0 && j < n - 1 && r() > 0.5) cells.push([i, j]);
      } else if (!inFinder(i, j) && r() > 0.52) cells.push([i, j]);
    }
  const eye = (x: number, y: number) => (
    <g key={`${x}-${y}`}>
      <rect x={x * c} y={y * c} width={7 * c} height={7 * c} fill={INK} />
      <rect x={(x + 1) * c} y={(y + 1) * c} width={5 * c} height={5 * c} fill="#FFF" />
      <rect x={(x + 2) * c} y={(y + 2) * c} width={3 * c} height={3 * c} fill={INK} />
    </g>
  );
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      {cells.map(([i, j]) => (
        <rect key={`${i}-${j}`} x={j * c} y={i * c} width={c + 0.3} height={c + 0.3} fill={INK} />
      ))}
      {finder === "qr" && [eye(0, 0), eye(n - 7, 0), eye(0, n - 7)]}
    </svg>
  );
};

export const QR: React.FC<{ seed: string; size: number }> = ({ seed, size }) => <Grid seed={seed} size={size} n={21} finder="qr" />;
export const DM: React.FC<{ seed: string; size: number }> = ({ seed, size }) => <Grid seed={seed} size={size} n={14} finder="dm" />;
