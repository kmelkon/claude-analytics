import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { PATHS } from "../config.js";
import type { ProjectSessions, SessionsIndex } from "../types.js";

export function readSessions(): ProjectSessions[] {
  if (!existsSync(PATHS.projects)) return [];

  const dirs = readdirSync(PATHS.projects, { withFileTypes: true }).filter((d) =>
    d.isDirectory()
  );

  const results: ProjectSessions[] = [];

  for (const dir of dirs) {
    const indexPath = join(PATHS.projects, dir.name, "sessions-index.json");
    if (!existsSync(indexPath)) continue;

    const raw = readFileSync(indexPath, "utf-8");
    const index = JSON.parse(raw) as SessionsIndex;

    results.push({
      projectDirName: dir.name,
      projectPath: index.originalPath ?? dir.name.replace(/-/g, "/"),
      sessions: index.entries,
    });
  }

  return results;
}
