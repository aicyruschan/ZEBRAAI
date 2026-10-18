// Kling 批量生成 R1–R5 → assets/clips/rN.mp4，然後自動追蹤標籤（r3–r5）。
//
// 用法：
//   KLING_API_KEY=... node scripts/kling-generate.mjs            # 生成全部
//   KLING_API_KEY=... node scripts/kling-generate.mjs --only r3  # 只生成一段
//   node scripts/kling-generate.mjs --dry-run                    # 不連網，只輸出請求內容到 prompts/kling-requests/
//
// ⚠ 未實測：本環境的網絡政策封鎖 Kling，官方文件也讀不到。端點及請求格式依搜尋所得
//   （Singapore 端點、Bearer API key、Omni 用 contents 陣列），第一次連通後必須對照
//   https://kling.ai/document-api 修正 buildBody() 及 pickVideoUrl()。
//   金鑰只從環境變數讀取，不寫入任何檔案或日誌。
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const p = (...s) => path.join(root, ...s);
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const allowMissingRefs = args.includes("--allow-missing-refs");

const BASE = process.env.KLING_BASE ?? "https://api-singapore.klingai.com";
const CREATE_PATH = process.env.KLING_CREATE_PATH ?? "/omni-video/kling-3.0-omni";
const QUERY_PATH = process.env.KLING_QUERY_PATH ?? "/tasks/{id}";
const KEY = process.env.KLING_API_KEY;
if (!dryRun && !KEY) {
  console.error("未設定 KLING_API_KEY（只從環境變數讀取）。可先用 --dry-run 檢查請求內容。");
  process.exit(1);
}

const cfg = JSON.parse(fs.readFileSync(p("prompts/kling-shots.json"), "utf8"));
const img = /\.(jpe?g|png|webp)$/i;
const resolveRefs = (refs) =>
  refs.flatMap((r) => {
    const full = p(r);
    if (!fs.existsSync(full)) return [];
    if (fs.statSync(full).isDirectory()) return fs.readdirSync(full).filter((f) => img.test(f)).sort().map((f) => path.join(full, f));
    return [full];
  });
const b64 = (file) => fs.readFileSync(file).toString("base64");

// ---- 請求格式（待官方文件確認）--------------------------------------------
function buildBody(shot, refFiles, startImage) {
  const contents = [{ type: "text", text: `${shot.prompt}\n${cfg.shared}` }];
  for (const f of refFiles) contents.push({ type: "image", role: "reference", image: b64(f) });
  if (startImage) contents.push({ type: "image", role: "first_frame", image: b64(startImage) });
  return {
    model_name: cfg.model,
    contents,
    negative_prompt: cfg.negative_prompt,
    duration: String(shot.duration),
    aspect_ratio: cfg.aspect_ratio,
    mode: cfg.mode,
    sound: cfg.sound ? "on" : "off",
  };
}
const pickTaskId = (j) => j?.data?.task_id ?? j?.task_id ?? j?.id;
const pickStatus = (j) => j?.data?.task_status ?? j?.status ?? j?.data?.status;
// 在回應中遞迴找第一個 .mp4 網址
const pickVideoUrl = (j) => {
  let found = null;
  const walk = (v) => {
    if (found || v == null) return;
    if (typeof v === "string" && /^https?:\/\/.+\.mp4(\?|$)/.test(v)) found = v;
    else if (typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(j);
  return found;
};
// ---------------------------------------------------------------------------

const logDir = p("assets/clips/kling-log");
fs.mkdirSync(logDir, { recursive: true });
const log = (name, obj) => fs.writeFileSync(path.join(logDir, name), JSON.stringify(obj, null, 2));
const headers = () => ({ Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(method, url, body) {
  const res = await fetch(url, { method, headers: headers(), body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!res.ok) throw new Error(`${method} ${url} → HTTP ${res.status}\n${text.slice(0, 800)}`);
  return json;
}

const lastFrame = (mp4, out) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-sseof", "-0.1", "-i", mp4, "-frames:v", "1", out]);

let prevClip = null;
for (const shot of cfg.shots) {
  const target = p("assets/clips", `${shot.id}.mp4`);
  if (only && shot.id !== only) {
    if (fs.existsSync(target)) prevClip = target;
    continue;
  }
  const refFiles = resolveRefs(shot.refs ?? []);
  const missing = (shot.refs ?? []).filter((r) => resolveRefs([r]).length === 0);
  if (missing.length && !allowMissingRefs) {
    console.error(`✗ ${shot.id}：缺少參考圖 ${missing.join("、")}。請放入官方產品圖，或加 --allow-missing-refs（AI 會自行想像外觀）。`);
    process.exit(1);
  }
  let startImage = null;
  if (shot.start_from_previous && prevClip) {
    startImage = p("assets/clips/kling-log", `${shot.id}-start.png`);
    lastFrame(prevClip, startImage);
  }
  const body = buildBody(shot, refFiles, startImage);
  if (dryRun) {
    const outDir = p("prompts/kling-requests");
    fs.mkdirSync(outDir, { recursive: true });
    const preview = JSON.parse(JSON.stringify(body, (k, v) => (k === "image" && typeof v === "string" ? `<base64 ${v.length} 字元>` : v)));
    fs.writeFileSync(path.join(outDir, `${shot.id}.json`), JSON.stringify({ url: BASE + CREATE_PATH, body: preview }, null, 2));
    console.log(`• ${shot.id}：參考圖 ${refFiles.length} 張${startImage ? "＋起始幀" : ""}（dry-run，未連網）`);
    continue;
  }
  console.log(`▶ ${shot.id}：提交生成（${shot.duration} 秒，參考圖 ${refFiles.length} 張）…`);
  const created = await api("POST", BASE + CREATE_PATH, body);
  log(`${shot.id}-create.json`, created);
  const id = pickTaskId(created);
  if (!id) throw new Error(`${shot.id}：回應中找不到 task_id，請看 assets/clips/kling-log/${shot.id}-create.json`);
  let url = null;
  for (let i = 0; i < 80 && !url; i++) {
    await sleep(15000);
    const q = await api("GET", BASE + QUERY_PATH.replace("{id}", id));
    log(`${shot.id}-query.json`, q);
    const st = String(pickStatus(q) ?? "").toLowerCase();
    if (/fail|error|cancel/.test(st)) throw new Error(`${shot.id}：生成失敗（${st}），詳見 kling-log`);
    url = pickVideoUrl(q);
    process.stdout.write(`  ${shot.id} 狀態：${st || "?"}\r`);
  }
  if (!url) throw new Error(`${shot.id}：20 分鐘內未完成`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${shot.id}：下載失敗 HTTP ${res.status}（${new URL(url).host} 可能未在允許網域內）`);
  fs.writeFileSync(target, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${shot.id} → ${path.relative(root, target)}`);
  prevClip = target;
  if (["r3", "r4", "r5"].includes(shot.id)) execFileSync("python3", ["-I", p("scripts/track-labels.py"), target], { stdio: "inherit" });
}
if (!dryRun) console.log("完成。下一步：npm run render:real");
