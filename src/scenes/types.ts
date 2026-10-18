import type { contentFor } from "../content";

// real：寫實版（S1–S5 背景改用 Kling 片段）
export type SceneProps = { c: ReturnType<typeof contentFor>; ff: string; real: boolean };
