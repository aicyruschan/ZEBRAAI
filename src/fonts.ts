import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import fonts from "./generated/fonts.json";

// 只載入 scripts/prepare.mjs 按實際用字挑出的 Noto Sans 分片
for (const f of fonts) {
  loadFont({
    family: f.family,
    url: staticFile(f.url),
    weight: f.weight,
    unicodeRange: f.unicodeRange,
    format: "woff2",
  });
}
