import type { DashboardData } from "../../types.js";

export function renderHeatmap(data: DashboardData): string {
  const { activity } = data;
  const heatmap = activity.heatmapData || [];

  // Build date->count map
  const countMap = new Map<string, number>();
  for (const d of heatmap) countMap.set(d.date, d.count);

  // Determine range: last 52 weeks ending today
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 363 - dayOfWeek); // ~52 weeks back, aligned to Monday

  // Align to Monday (ISO week start)
  const startDay = startDate.getDay();
  if (startDay !== 1) {
    startDate.setDate(startDate.getDate() - ((startDay + 6) % 7));
  }

  // Compute max for scale
  let maxCount = 1;
  for (const d of heatmap) if (d.count > maxCount) maxCount = d.count;

  function getLevel(count: number): number {
    if (count === 0) return 0;
    const ratio = count / maxCount;
    if (ratio <= 0.25) return 1;
    if (ratio <= 0.5) return 2;
    if (ratio <= 0.75) return 3;
    return 4;
  }

  function fmtDate(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  function fmtDisplay(d: Date): string {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // Generate cells column by column (each column = 1 week)
  let cells = "";
  const monthPositions: { label: string; col: number }[] = [];
  let lastMonth = -1;
  const cursor = new Date(startDate);
  let col = 0;

  while (cursor <= endDate) {
    const m = cursor.getMonth();
    if (m !== lastMonth) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      monthPositions.push({ label: monthNames[m], col });
      lastMonth = m;
    }

    for (let row = 0; row < 7; row++) {
      const d = new Date(cursor);
      d.setDate(d.getDate() + row);
      if (d > endDate) break;

      const dateStr = fmtDate(d);
      const count = countMap.get(dateStr) || 0;
      const level = getLevel(count);
      cells += `<div class="heatmap-cell heatmap-level-${level}" data-date="${fmtDisplay(d)}" data-count="${count}"></div>`;
    }

    cursor.setDate(cursor.getDate() + 7);
    col++;
  }

  // Month labels
  const totalCols = col;
  let monthsHtml = "";
  for (let i = 0; i < monthPositions.length; i++) {
    const next = i + 1 < monthPositions.length ? monthPositions[i + 1].col : totalCols;
    const span = next - monthPositions[i].col;
    monthsHtml += `<span class="heatmap-month" style="min-width:${span * 17}px">${monthPositions[i].label}</span>`;
  }

  // Day labels (Mon, Wed, Fri)
  const dayLabels = `
    <div class="heatmap-labels">
      <span></span>
      <span>Mon</span>
      <span></span>
      <span>Wed</span>
      <span></span>
      <span>Fri</span>
      <span></span>
    </div>`;

  const avgPerDay = activity.activeDays > 0
    ? (activity.totalMessages / activity.activeDays).toFixed(1)
    : "0";

  return `
    <h2 class="section-title">Activity</h2>
    <div class="summary-grid">
      <div class="summary-card">
        <div class="label">Total Messages</div>
        <div class="value">${fmt(activity.totalMessages)}</div>
      </div>
      <div class="summary-card">
        <div class="label">Active Days</div>
        <div class="value">${activity.activeDays}</div>
        <div class="sub">out of ${activity.totalDays} days</div>
      </div>
      <div class="summary-card">
        <div class="label">Longest Streak</div>
        <div class="value">${activity.streaks.longest} days</div>
        <div class="sub">current: ${activity.streaks.current}</div>
      </div>
      <div class="summary-card">
        <div class="label">Avg / Active Day</div>
        <div class="value">${avgPerDay}</div>
        <div class="sub">messages</div>
      </div>
    </div>
    <div class="card">
      <div class="heatmap-months">${monthsHtml}</div>
      <div class="heatmap-wrapper">
        ${dayLabels}
        <div class="heatmap-container">
          <div class="heatmap-grid">${cells}</div>
        </div>
      </div>
      <div class="heatmap-legend">
        <span>Less</span>
        <div class="heatmap-cell heatmap-level-0"></div>
        <div class="heatmap-cell heatmap-level-1"></div>
        <div class="heatmap-cell heatmap-level-2"></div>
        <div class="heatmap-cell heatmap-level-3"></div>
        <div class="heatmap-cell heatmap-level-4"></div>
        <span>More</span>
      </div>
    </div>
    <div id="heatmap-tooltip" class="heatmap-tooltip"></div>`;
}

function fmt(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "k";
  return n.toString();
}
