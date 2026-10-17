// Azure 普通話神經語音：逐場景合成，再按 script.json 的字幕開始時間拼成 audio/vo.wav
// 用法：AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=eastasia [AZURE_VOICE=zh-CN-XiaoxiaoNeural] npm run tts
// 注意：此腳本未在本環境實測（沒有金鑰）。需要 ffmpeg。
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const key = process.env.AZURE_SPEECH_KEY;
const region = process.env.AZURE_SPEECH_REGION ?? "eastasia";
const voice = process.env.AZURE_VOICE ?? "zh-CN-XiaoxiaoNeural";
if (!key) {
  console.error("未設定 AZURE_SPEECH_KEY；旁白稿見 audio/script.txt，時間軸維持靜音占位。");
  process.exit(1);
}

const { hans, durationSec } = JSON.parse(fs.readFileSync(path.join(root, "src/generated/content.json"), "utf8"));
const tmp = path.join(root, "audio/.tts");
fs.mkdirSync(tmp, { recursive: true });

const parts = [];
for (const s of hans.scenes) {
  const ssml = `<speak version="1.0" xml:lang="zh-CN"><voice name="${voice}"><prosody rate="0%">${s.narration}</prosody></voice></speak>`;
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "riff-48khz-16bit-mono-pcm",
    },
    body: ssml,
  });
  if (!res.ok) throw new Error(`${s.id}: ${res.status} ${await res.text()}`);
  const file = path.join(tmp, `${s.id}.wav`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  parts.push({ file, start: s.subs[0].start, id: s.id, sceneEnd: s.end });
  console.log(`✓ ${s.id}`);
}

// 每段延遲到字幕開始時間，混合為一條 62 秒音軌
const args = parts.flatMap((x) => ["-i", x.file]);
const filters = parts.map((x, i) => `[${i}]adelay=${Math.round(x.start * 1000)}:all=1[a${i}]`).join(";");
const mix = parts.map((_, i) => `[a${i}]`).join("") + `amix=inputs=${parts.length}:normalize=0,apad,atrim=0:${durationSec}`;
execFileSync("ffmpeg", ["-y", ...args, "-filter_complex", `${filters};${mix}`, path.join(root, "audio/vo.wav")], { stdio: "inherit" });

for (const x of parts) {
  const d = parseFloat(String(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", x.file])));
  if (x.start + d > x.sceneEnd) console.warn(`⚠ ${x.id} 旁白 ${d.toFixed(1)}s 超出場景結尾，請調整 content/script.json 時間或語速`);
}
console.log("✓ audio/vo.wav 已生成，請執行 npm run prepare 後重新渲染");
