import type { DashboardData } from "../../types.js";

export function renderAtAGlance(data: DashboardData): string {
  if (!data.llm?.atAGlance) return "";

  const g = data.llm.atAGlance;

  return `
    <h2 class="section-title">At a Glance</h2>
    <div class="glance-card">
      <div class="glance-section">
        <span class="glance-label glance-working">What's working:</span>
        ${md(g.whatsWorking)}
        <a href="#impressive" class="glance-link">Impressive Things You Did &rarr;</a>
      </div>
      <div class="glance-section">
        <span class="glance-label glance-hindering">What's hindering you:</span>
        ${md(g.whatsHindering)}
        <a href="#wrong" class="glance-link">Where Things Go Wrong &rarr;</a>
      </div>
      <div class="glance-section">
        <span class="glance-label glance-quickwins">Quick wins to try:</span>
        ${md(g.quickWins)}
        <a href="#features" class="glance-link">Features to Try &rarr;</a>
      </div>
      <div class="glance-section">
        <span class="glance-label glance-ambitious">Ambitious workflows:</span>
        ${md(g.ambitiousWorkflows)}
      </div>
    </div>`;
}

function md(text: string): string {
  // Escape HTML then convert **bold** to <strong>
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
