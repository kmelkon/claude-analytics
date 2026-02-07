import type { DashboardData } from "../../types.js";

export function renderProjects(data: DashboardData): string {
  const projects = data.projects || [];
  const sorted = [...projects].sort((a, b) => b.sessionCount - a.sessionCount);
  const totalSessions = projects.reduce((s, p) => s + p.sessionCount, 0);
  const mostActive = sorted[0];

  const rows = sorted
    .map(
      (p) => `
    <tr>
      <td style="color:#fff;font-weight:500">${esc(p.name)}</td>
      <td>${p.sessionCount}</td>
      <td>${fmt(p.messageCount)}</td>
      <td>${fmtDate(p.firstUsed)}</td>
      <td>${fmtDate(p.lastUsed)}</td>
    </tr>`
    )
    .join("");

  return `
    <h2 class="section-title">Projects</h2>
    <div class="summary-grid">
      <div class="summary-card">
        <div class="label">Total Projects</div>
        <div class="value">${projects.length}</div>
      </div>
      <div class="summary-card">
        <div class="label">Most Active</div>
        <div class="value" style="font-size:1.2rem">${mostActive ? esc(mostActive.name) : "-"}</div>
        <div class="sub">${mostActive ? mostActive.sessionCount + " sessions" : ""}</div>
      </div>
      <div class="summary-card">
        <div class="label">Total Sessions</div>
        <div class="value">${fmt(totalSessions)}</div>
      </div>
    </div>
    <div class="chart-container" style="height:${Math.min(sorted.length, 15) * 36 + 60}px">
      <canvas id="chart-projects"></canvas>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th class="sortable">Project <span class="sort-arrow">↕</span></th>
            <th class="sortable">Sessions <span class="sort-arrow">↕</span></th>
            <th class="sortable">Messages <span class="sort-arrow">↕</span></th>
            <th class="sortable">First Used <span class="sort-arrow">↕</span></th>
            <th class="sortable">Last Used <span class="sort-arrow">↕</span></th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmt(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
  return n.toString();
}

function fmtDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
