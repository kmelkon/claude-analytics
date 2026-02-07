import type { DashboardData } from "../../types.js";

export function renderImprovements(data: DashboardData): string {
  if (!data.llm || !data.llm.whereThingsGoWrong.length) return "";

  const cards = data.llm.whereThingsGoWrong
    .map(
      (item) => `
    <div class="insight-card accent-warning">
      <h3>${esc(item.title)}</h3>
      <p class="detail">${esc(item.detail)}</p>
      ${item.suggestion ? `<p class="suggestion">${esc(item.suggestion)}</p>` : ""}
    </div>`
    )
    .join("");

  return `
    <h2 class="section-title">Where Things Go Wrong</h2>
    <p class="section-subtitle">Recurring friction patterns to address</p>
    <div class="insight-grid">${cards}</div>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
