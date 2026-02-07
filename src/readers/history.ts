import { readFileSync, existsSync } from "fs";
import { PATHS } from "../config.js";
import type { HistoryEntry } from "../types.js";

export function readHistory(): HistoryEntry[] {
  if (!existsSync(PATHS.history)) return [];

  const raw = readFileSync(PATHS.history, "utf-8");
  return raw
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line) as HistoryEntry);
}
