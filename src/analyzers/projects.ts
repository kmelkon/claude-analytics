import type { ProjectSessions, ProjectAnalysis } from "../types.js";

function extractName(projectPath: string, projectDirName: string): string {
  if (!projectPath) return projectDirName || "Unknown";
  const parts = projectPath.split("/");
  const projectsIdx = parts.indexOf("Projects");
  if (projectsIdx !== -1 && projectsIdx < parts.length - 1) {
    return parts.slice(projectsIdx + 1).join("/");
  }
  // Fallback: take last two segments for context
  if (parts.length >= 2) {
    return parts.slice(-2).join("/");
  }
  return projectDirName || projectPath;
}

export function analyzeProjects(
  projectSessions: ProjectSessions[]
): ProjectAnalysis[] {
  const results: ProjectAnalysis[] = projectSessions.map((ps) => {
    const sessions = ps.sessions;
    let messageCount = 0;
    let firstUsed = "";
    let lastUsed = "";

    for (const s of sessions) {
      messageCount += s.messageCount;
      if (!firstUsed || s.created < firstUsed) firstUsed = s.created;
      if (!lastUsed || s.modified > lastUsed) lastUsed = s.modified;
    }

    const durationMs =
      firstUsed && lastUsed
        ? new Date(lastUsed).getTime() - new Date(firstUsed).getTime()
        : 0;

    return {
      name: extractName(ps.projectPath, ps.projectDirName),
      path: ps.projectPath,
      sessionCount: sessions.length,
      messageCount,
      firstUsed,
      lastUsed,
      durationMs,
    };
  });

  results.sort((a, b) => b.sessionCount - a.sessionCount);
  return results;
}
