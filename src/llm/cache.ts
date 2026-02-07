import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { join } from "path";
import { PATHS } from "../config.js";
import type { SessionFacet } from "../types.js";

function ensureDir(): void {
  mkdirSync(PATHS.facetsDir, { recursive: true });
}

export function readFacet(sessionId: string): SessionFacet | null {
  const filePath = join(PATHS.facetsDir, `${sessionId}.json`);
  try {
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as SessionFacet;
  } catch {
    return null;
  }
}

export function writeFacet(sessionId: string, facet: SessionFacet): void {
  ensureDir();
  const filePath = join(PATHS.facetsDir, `${sessionId}.json`);
  writeFileSync(filePath, JSON.stringify(facet, null, 2));
}

export function clearCache(): void {
  if (existsSync(PATHS.facetsDir)) {
    rmSync(PATHS.facetsDir, { recursive: true, force: true });
  }
  ensureDir();
}
