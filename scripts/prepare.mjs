// 由 content/script.json 生成：簡體內容、雙字幕、旁白稿、字型子集清單、媒體清單；並執行用詞及事實護欄檢查。
import fs from "node:fs";
import path from "node:path";
import * as OpenCC from "opencc-js";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const p = (...s) => path.join(root, ...s);
const readJson = (f) => JSON.parse(fs.readFileSync(p(f), "utf8"));
const ensureDir = (d) => fs.mkdirSync(p(d), { recursive: true });

const script = readJson("content/script.json");
// 'tw' → 'cn'：只做字形轉換，不做詞彙替換，保留兩岸通用用詞
const toHans = OpenCC.Converter({ from: "tw", to: "cn" });

// ---------- 1. 用詞及事實護欄檢查 ----------
const banned = [
  ["條形碼", "用「條碼」"], ["移動終端", "用「手持設備」"], ["行動電腦", "用「手持設備」"],
  ["應用程式", "用「App」"], ["應用", "用「App」"], ["數據", "用「結果」"], ["資料", "用「結果」"],
  ["網絡", "避免"], ["網路", "避免"], ["軟件", "避免"], ["軟體", "避免"], ["視頻", "避免"],
  ["影片", "避免"], ["質量", "避免"], ["品質", "避免"],
  ["最快", "絕對化"], ["最安全", "絕對化"], ["100%", "絕對化"], ["百分之百", "絕對化"],
  ["準確率", "不得自行提供數字"], ["所有", "接近絕對化"], ["毫秒", "不得自行提供速度"],
];
const lintTexts = [];
for (const s of script.scenes) {
  lintTexts.push([`${s.id}.narration`, s.narration]);
  s.subs.forEach((x, i) => lintTexts.push([`${s.id}.subs[${i}]`, x.text]));
}
for (const [k, v] of Object.entries(script.ui)) lintTexts.push([`ui.${k}`, v]);

const errors = [];
for (const [where, text] of lintTexts) {
  for (const [term, why] of banned) {
    if (text.includes(term)) errors.push(`${where}: 「${term}」(${why}) → ${text}`);
  }
  if (/TC53[^。；]*?(不支援|不能|無法|做不到|不行)/.test(text)) {
    errors.push(`${where}: 暗示 TC53 不支援 → ${text}`);
  }
  if (/\d+\s*(公尺|米|cm|公分|秒|ms|%)/.test(text.replace(/\d+MP/g, ""))) {
    errors.push(`${where}: 含距離/速度/準確率數字，需官方來源 → ${text}`);
  }
}
// 字幕必須與旁白逐字一致
for (const s of script.scenes) {
  const joined = s.subs.map((x) => x.text).join("");
  if (joined.replace(/\s/g, "") !== s.narration.replace(/\s/g, "")) errors.push(`${s.id}: 字幕拼合與旁白不一致\n  旁白: ${s.narration}\n  字幕: ${joined}`);
  for (const x of s.subs) {
    if (x.start < s.start || x.end > s.end || x.end <= x.start) errors.push(`${s.id}: 字幕時間越界 ${x.start}-${x.end}`);
  }
}
if (!script.ui.demoBadge.includes("示意畫面")) errors.push("ui.demoBadge 必須為「示意畫面」");
if (errors.length) {
  console.error("✗ 護欄檢查失敗：\n" + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✓ 護欄檢查通過（${lintTexts.length} 段文字）`);

// ---------- 2. 繁簡內容 ----------
const convertDeep = (v) =>
  typeof v === "string" ? toHans(v) : Array.isArray(v) ? v.map(convertDeep) : v && typeof v === "object"
    ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, k === "sources" || k === "id" ? x : convertDeep(x)]))
    : v;
const pick = (s) => ({ scenes: s.scenes.map(({ id, start, end, narration, subs }) => ({ id, start, end, narration, subs })), ui: s.ui });
const hant = pick(script);
const hans = convertDeep(hant);
ensureDir("src/generated");
fs.writeFileSync(
  p("src/generated/content.json"),
  JSON.stringify({ fps: script.fps, durationSec: script.durationSec, hant, hans }, null, 2),
);

// ---------- 3. SRT ----------
const ts = (sec) => {
  const ms = Math.round(sec * 1000);
  const pad = (n, w = 2) => String(n).padStart(w, "0");
  return `${pad(Math.floor(ms / 3600000))}:${pad(Math.floor(ms / 60000) % 60)}:${pad(Math.floor(ms / 1000) % 60)},${pad(ms % 1000, 3)}`;
};
const srt = (c) =>
  c.scenes.flatMap((s) => s.subs).map((x, i) => `${i + 1}\n${ts(x.start)} --> ${ts(x.end)}\n${x.text}\n`).join("\n");
ensureDir("subs");
fs.writeFileSync(p("subs/zh-Hant.srt"), srt(hant));
fs.writeFileSync(p("subs/zh-Hans.srt"), srt(hans));

// ---------- 4. 旁白稿（TTS 用，簡體，普通話） ----------
ensureDir("audio");
fs.writeFileSync(
  p("audio/script.txt"),
  "# Zebra TC501 EP01 旁白稿（普通話，中性口音）。格式：場景 | 開始秒 | 文本\n" +
    hans.scenes.map((s) => `${s.id} | ${s.subs[0].start.toFixed(1)} | ${s.narration}`).join("\n") + "\n",
);

// ---------- 5. 媒體：旁白、產品圖、標誌 ----------
const copyDir = (from, to, re) => {
  if (!fs.existsSync(p(from))) return [];
  ensureDir(to);
  return fs.readdirSync(p(from)).filter((f) => re.test(f)).sort().map((f) => {
    fs.copyFileSync(p(from, f), p(to, f));
    return `${to.replace(/^public\//, "")}/${f}`;
  });
};
let vo = null;
if (fs.existsSync(p("audio/vo.wav"))) {
  ensureDir("public/audio");
  fs.copyFileSync(p("audio/vo.wav"), p("public/audio/vo.wav"));
  vo = "audio/vo.wav";
}
const img = /\.(jpe?g|png|webp)$/i;
const media = {
  vo,
  tc501: copyDir("assets/products/tc501", "public/products/tc501", img),
  logo: (() => {
    const f = ["logo.svg", "logo.png"].find((n) => fs.existsSync(p("assets/brand", n)));
    if (!f) return null;
    ensureDir("public/brand");
    fs.copyFileSync(p("assets/brand", f), p("public/brand", f));
    return `brand/${f}`;
  })(),
  // 合成音樂及音效（scripts/make-audio.py 生成）
  bgm: copyDir("audio/music", "public/audio/music", /\.wav$/).find((f) => f.endsWith("bgm.wav")) ?? null,
  sfx: copyDir("audio/sfx", "public/audio/sfx", /\.wav$/).map((f) => path.basename(f, ".wav")),
};
fs.writeFileSync(p("src/generated/media.json"), JSON.stringify(media, null, 2));

// ---------- 6. 字型子集（只複製用到的 unicode 分片） ----------
const allText = (c) =>
  JSON.stringify([c.ui, c.scenes.map((s) => s.subs.map((x) => x.text))]) +
  "0123456789/·：,.()+-ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const parseRanges = (str) =>
  str.split(",").map((r) => r.trim().replace(/^U\+/i, "")).map((r) => {
    const [a, b] = r.split("-");
    return [parseInt(a, 16), parseInt(b ?? a, 16)];
  });
const fonts = [];
for (const [variant, pkg, family] of [["hant", "noto-sans-tc", "Noto Sans TC"], ["hans", "noto-sans-sc", "Noto Sans SC"]]) {
  const dir = p("node_modules/@fontsource", pkg);
  const unicode = JSON.parse(fs.readFileSync(path.join(dir, "unicode.json"), "utf8"));
  const cps = new Set([...allText(variant === "hant" ? hant : hans)].map((ch) => ch.codePointAt(0)));
  const needed = Object.entries(unicode).filter(([, ranges]) => {
    const rs = parseRanges(ranges);
    for (const cp of cps) if (rs.some(([a, b]) => cp >= a && cp <= b)) return true;
    return false;
  });
  ensureDir("public/fonts");
  for (const weight of [400, 700]) {
    for (const [key, ranges] of needed) {
      const sub = key.replace(/^\[|\]$/g, "");
      const file = `${pkg}-${sub}-${weight}-normal.woff2`;
      fs.copyFileSync(path.join(dir, "files", file), p("public/fonts", file));
      fonts.push({ variant, family, weight: String(weight), url: `fonts/${file}`, unicodeRange: ranges });
    }
  }
}
fs.writeFileSync(p("src/generated/fonts.json"), JSON.stringify(fonts, null, 2));

console.log(`✓ 已生成：subs/zh-Hant.srt、subs/zh-Hans.srt、audio/script.txt、${fonts.length} 個字型分片`);
console.log(`  旁白：${vo ? "✓" : "靜音占位"}；背景音樂：${media.bgm ? "✓" : "無"}；音效 ${media.sfx.length} 個；TC501 圖 ${media.tc501.length} 張；標誌：${media.logo ? "✓" : "占位"}`);
