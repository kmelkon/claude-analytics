import { readFileSync } from "fs";
import { PATHS } from "../config.js";
import type { StatsCache } from "../types.js";

export function readStats(): StatsCache {
  const raw = readFileSync(PATHS.statsCache, "utf-8");
  return JSON.parse(raw) as StatsCache;
}
