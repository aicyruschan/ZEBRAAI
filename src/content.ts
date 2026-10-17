import generated from "./generated/content.json";
import media from "./generated/media.json";
import type { Variant } from "./brand";

export const FPS = generated.fps;
export const DURATION_SEC = generated.durationSec;
export { media };

export type SceneId = "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7";

export const contentFor = (v: Variant) => generated[v];

export const scene = (id: SceneId) => {
  const s = generated.hant.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`missing scene ${id}`);
  return { from: Math.round(s.start * FPS), durationInFrames: Math.round((s.end - s.start) * FPS) };
};
