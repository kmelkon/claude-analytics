import type { DashboardData } from "../../types.js";

export function renderFeatures(data: DashboardData): string {
  if (!data.llm || !data.llm.featuresToTry.length) return "";

  const cards = data.llm.featuresToTry
    .map(
      (item) => `
    <div class="insight-card accent-info">
      <h3>${esc(item.title)}</h3>
      <p class="detail">${esc(item.detail)}</p>
      ${item.howToUse ? `<div class="how-to-use">${esc(item.howToUse)}</div>` : ""}
    </div>`
    )
    .join("");

  return `
    <h2 class="section-title">Features to Try</h2>
    <p class="section-subtitle">Claude Code capabilities that could level up your workflow</p>
    <div class="insight-grid">${cards}</div>`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
