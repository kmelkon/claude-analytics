import type { DashboardData } from "../../types.js";

export function renderSessions(data: DashboardData): string {
  const sessions = data.sessions || [];

  // Unique project paths for filter dropdown
  const projectPaths = [
    ...new Set(sessions.map((s) => s.projectPath).filter(Boolean)),
  ].sort();

  const options = projectPaths
    .map((p) => {
      const name = p.split("/").pop() || p;
      return `<option value="${esc(p)}">${esc(name)}</option>`;
    })
    .join("");

  return `
    <h2 class="section-title">Sessions</h2>
    <p class="section-subtitle">${sessions.length} total sessions — click a row to expand</p>
    <div class="filter-bar">
      <input type="text" id="session-search" placeholder="Search prompts..." />
      <select id="session-project-filter">
        <option value="">All projects</option>
        ${options}
      </select>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th class="sortable">Date <span class="sort-arrow">↕</span></th>
            <th class="sortable">Project <span class="sort-arrow">↕</span></th>
            <th>First Prompt</th>
            <th class="sortable">Messages <span class="sort-arrow">↕</span></th>
            <th>Branch</th>
          </tr>
        </thead>
        <tbody id="session-tbody"></tbody>
      </table>
    </div>
    <button id="load-more-btn" class="load-more-btn" style="display:none">Show more</button>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
