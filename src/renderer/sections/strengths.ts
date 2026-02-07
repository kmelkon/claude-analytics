import type { DashboardData } from "../../types.js";

export function renderStrengths(data: DashboardData): string {
  if (!data.llm || !data.llm.impressiveThings.length) return "";

  const cards = data.llm.impressiveThings
    .map(
      (item) => `
    <div class="insight-card accent-success">
      <h3>${esc(item.title)}</h3>
      <p class="detail">${esc(item.detail)}</p>
      ${item.evidence ? `<p class="evidence">${esc(item.evidence)}</p>` : ""}
    </div>`
    )
    .join("");

  return `
    <h2 class="section-title">Impressive Things You Did</h2>
    <p class="section-subtitle">Patterns where you consistently excel</p>
    <div class="insight-grid">${cards}</div>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
