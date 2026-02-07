import type { DashboardData } from "../../types.js";

export function renderCosts(data: DashboardData): string {
  const { costs } = data;
  const totalTokens =
    costs.totalTokens.input +
    costs.totalTokens.output +
    costs.totalTokens.cacheRead +
    costs.totalTokens.cacheWrite;

  const models = Object.entries(costs.costByModel).sort(
    ([, a], [, b]) => b.total - a.total
  );
  const topModel = models[0]?.[0] || "-";

  const rows = Object.entries(costs.tokensByModel)
    .map(([model, t]) => {
      const cost = costs.costByModel[model];
      return `
      <tr>
        <td style="color:#fff;font-weight:500">${esc(model)}</td>
        <td>${fmt(t.input)}</td>
        <td>${fmt(t.output)}</td>
        <td>${fmt(t.cacheRead)}</td>
        <td>${fmt(t.cacheWrite)}</td>
        <td style="color:#4ECB71;font-weight:600">$${cost ? cost.total.toFixed(2) : "0.00"}</td>
      </tr>`;
    })
    .join("");

  return `
    <h2 class="section-title">Costs</h2>
    <div class="summary-grid">
      <div class="summary-card">
        <div class="label">Total Cost</div>
        <div class="value" style="color:#4ECB71">$${costs.totalCost.toFixed(2)}</div>
      </div>
      <div class="summary-card">
        <div class="label">Total Tokens</div>
        <div class="value">${fmt(totalTokens)}</div>
      </div>
      <div class="summary-card">
        <div class="label">Most Used Model</div>
        <div class="value" style="font-size:1rem">${esc(topModel)}</div>
      </div>
    </div>
    <div class="chart-row">
      <div class="chart-container" style="height:320px">
        <canvas id="chart-cost-doughnut"></canvas>
      </div>
      <div class="chart-container" style="height:320px">
        <canvas id="chart-daily-cost"></canvas>
      </div>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Model</th>
            <th class="sortable">Input Tokens <span class="sort-arrow">↕</span></th>
            <th class="sortable">Output Tokens <span class="sort-arrow">↕</span></th>
            <th class="sortable">Cache Read <span class="sort-arrow">↕</span></th>
            <th class="sortable">Cache Write <span class="sort-arrow">↕</span></th>
            <th class="sortable">Cost <span class="sort-arrow">↕</span></th>
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
