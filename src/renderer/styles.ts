export function getStyles(): string {
  return `
    :root {
      --bg-deep: #0f0f1a;
      --bg-card: #1a1a2e;
      --bg-card-hover: #1e1e35;
      --border: #2a2a4a;
      --border-light: #33335a;
      --primary: #6C63FF;
      --primary-dim: rgba(108, 99, 255, 0.15);
      --primary-glow: rgba(108, 99, 255, 0.3);
      --secondary: #00D9FF;
      --secondary-dim: rgba(0, 217, 255, 0.12);
      --accent: #FF6B6B;
      --accent-dim: rgba(255, 107, 107, 0.12);
      --success: #4ECB71;
      --success-dim: rgba(78, 203, 113, 0.12);
      --text: #e0e0e0;
      --text-secondary: #b0b0cc;
      --muted: #8888aa;
      --sidebar-bg: #0a0a14;
      --font: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --radius: 12px;
      --radius-sm: 8px;
      --shadow: 0 2px 12px rgba(0,0,0,0.3);
      --shadow-lg: 0 8px 32px rgba(0,0,0,0.4);
      --transition: 0.2s ease;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font);
      background: var(--bg-deep);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-deep); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--muted); }

    /* ── Sidebar ── */
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 240px;
      height: 100vh;
      background: var(--sidebar-bg);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      z-index: 100;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 28px 24px 20px;
      border-bottom: 1px solid var(--border);
    }

    .sidebar-header h1 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.02em;
    }

    .sidebar-header .subtitle {
      font-size: 0.75rem;
      color: var(--muted);
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .sidebar a {
      display: flex;
      align-items: center;
      padding: 10px 24px;
      color: var(--muted);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all var(--transition);
      border-left: 3px solid transparent;
    }

    .sidebar a:hover {
      color: var(--text);
      background: rgba(108, 99, 255, 0.06);
    }

    .sidebar a.active {
      color: var(--primary);
      border-left-color: var(--primary);
      background: var(--primary-dim);
    }

    /* ── Main Content ── */
    main {
      margin-left: 240px;
      max-width: 1200px;
      padding: 32px 40px 80px;
    }

    section {
      margin-bottom: 56px;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
    }

    .section-subtitle {
      font-size: 0.875rem;
      color: var(--muted);
      margin-top: -16px;
      margin-bottom: 24px;
    }

    /* ── Cards ── */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: var(--shadow);
      transition: border-color var(--transition), box-shadow var(--transition);
    }

    .card:hover {
      border-color: var(--border-light);
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }

    .summary-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px 24px;
      box-shadow: var(--shadow);
      transition: transform var(--transition), border-color var(--transition);
    }

    .summary-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-light);
    }

    .summary-card .label {
      font-size: 0.75rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 6px;
    }

    .summary-card .value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.03em;
      line-height: 1.2;
    }

    .summary-card .sub {
      font-size: 0.8rem;
      color: var(--muted);
      margin-top: 4px;
    }

    /* ── Hero Overview ── */
    .hero-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }

    .hero-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 28px 24px;
      text-align: center;
      box-shadow: var(--shadow);
      transition: transform var(--transition), border-color var(--transition), box-shadow var(--transition);
      position: relative;
      overflow: hidden;
    }

    .hero-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--primary);
      opacity: 0;
      transition: opacity var(--transition);
    }

    .hero-card:hover {
      transform: translateY(-3px);
      border-color: var(--primary);
      box-shadow: var(--shadow-lg);
    }

    .hero-card:hover::before { opacity: 1; }

    .hero-card .hero-value {
      font-size: 2.25rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }

    .hero-card .hero-label {
      font-size: 0.8rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-top: 8px;
    }

    /* ── Tables ── */
    .table-wrap {
      overflow-x: auto;
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    thead th {
      background: var(--bg-card);
      color: var(--muted);
      font-weight: 600;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.06em;
      padding: 12px 16px;
      text-align: left;
      position: sticky;
      top: 0;
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
      cursor: default;
    }

    thead th.sortable { cursor: pointer; user-select: none; }
    thead th.sortable:hover { color: var(--text); }
    thead th .sort-arrow { margin-left: 4px; opacity: 0.4; }
    thead th.sorted .sort-arrow { opacity: 1; color: var(--primary); }

    tbody td {
      padding: 10px 16px;
      border-bottom: 1px solid rgba(42, 42, 74, 0.5);
      color: var(--text-secondary);
      vertical-align: middle;
    }

    tbody tr { transition: background var(--transition); }
    tbody tr:nth-child(even) { background: rgba(26, 26, 46, 0.4); }
    tbody tr:hover { background: rgba(108, 99, 255, 0.05); }

    .expandable-row { cursor: pointer; }
    .expanded-content {
      display: none;
      padding: 16px;
      background: rgba(108, 99, 255, 0.04);
      border-bottom: 1px solid var(--border);
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.7;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .expanded-content.open { display: table-cell; }

    /* ── Charts ── */
    .chart-container {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      margin-bottom: 24px;
    }

    .chart-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }

    /* ── Heatmap ── */
    .heatmap-container {
      overflow-x: auto;
      padding: 8px 0;
    }

    .heatmap-grid {
      display: inline-grid;
      grid-template-rows: repeat(7, 14px);
      grid-auto-columns: 14px;
      grid-auto-flow: column;
      gap: 3px;
    }

    .heatmap-cell {
      width: 14px;
      height: 14px;
      border-radius: 3px;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      position: relative;
    }

    .heatmap-cell:hover {
      transform: scale(1.4);
      box-shadow: 0 0 8px rgba(108, 99, 255, 0.4);
      z-index: 5;
    }

    .heatmap-level-0 { background: var(--bg-card); border: 1px solid var(--border); }
    .heatmap-level-1 { background: rgba(108, 99, 255, 0.2); }
    .heatmap-level-2 { background: rgba(108, 99, 255, 0.4); }
    .heatmap-level-3 { background: rgba(108, 99, 255, 0.6); }
    .heatmap-level-4 { background: rgba(108, 99, 255, 0.85); }

    .heatmap-labels {
      display: flex;
      gap: 3px;
      flex-direction: column;
      font-size: 0.65rem;
      color: var(--muted);
      margin-right: 8px;
    }

    .heatmap-labels span {
      height: 14px;
      display: flex;
      align-items: center;
    }

    .heatmap-wrapper {
      display: flex;
      align-items: flex-start;
    }

    .heatmap-months {
      display: flex;
      font-size: 0.65rem;
      color: var(--muted);
      margin-bottom: 6px;
      margin-left: 28px;
    }

    .heatmap-month { flex: 1; min-width: 0; }

    .heatmap-legend {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 12px;
      font-size: 0.7rem;
      color: var(--muted);
      justify-content: flex-end;
    }

    .heatmap-legend .heatmap-cell { cursor: default; }
    .heatmap-legend .heatmap-cell:hover { transform: none; box-shadow: none; }

    .heatmap-tooltip {
      position: fixed;
      background: #222244;
      color: var(--text);
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      pointer-events: none;
      z-index: 1000;
      box-shadow: var(--shadow-lg);
      white-space: nowrap;
      display: none;
    }

    /* ── Insight Cards ── */
    .insight-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 20px;
    }

    .insight-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: var(--shadow);
      position: relative;
      overflow: hidden;
      transition: transform var(--transition), border-color var(--transition);
    }

    .insight-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-light);
    }

    .insight-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .insight-card.accent-success::before { background: linear-gradient(90deg, var(--success), #2dd4bf); }
    .insight-card.accent-warning::before { background: linear-gradient(90deg, var(--accent), #ff9a56); }
    .insight-card.accent-info::before { background: linear-gradient(90deg, var(--secondary), #6C63FF); }

    .insight-card h3 {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }

    .insight-card .detail {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 12px;
    }

    .insight-card .evidence {
      font-size: 0.8rem;
      color: var(--muted);
      font-style: italic;
      padding-left: 12px;
      border-left: 2px solid var(--success);
      line-height: 1.5;
    }

    .insight-card .suggestion {
      font-size: 0.8rem;
      color: var(--accent);
      background: var(--accent-dim);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      line-height: 1.5;
    }

    .insight-card .how-to-use {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.78rem;
      color: var(--secondary);
      background: rgba(0, 217, 255, 0.06);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      line-height: 1.5;
      border: 1px solid rgba(0, 217, 255, 0.15);
    }

    /* ── Filters ── */
    .filter-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .filter-bar input,
    .filter-bar select {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 10px 16px;
      color: var(--text);
      font-size: 0.85rem;
      font-family: var(--font);
      outline: none;
      transition: border-color var(--transition);
    }

    .filter-bar input:focus,
    .filter-bar select:focus {
      border-color: var(--primary);
    }

    .filter-bar input { flex: 1; min-width: 200px; }
    .filter-bar select { min-width: 180px; }

    .load-more-btn {
      display: block;
      width: 100%;
      padding: 12px;
      margin-top: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      color: var(--primary);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all var(--transition);
      font-family: var(--font);
    }

    .load-more-btn:hover {
      background: var(--primary-dim);
      border-color: var(--primary);
    }

    /* ── At a Glance (warm card) ── */
    .glance-card {
      background: linear-gradient(135deg, #fdf6e3 0%, #fef9ef 100%);
      border: 1px solid #e8dcc8;
      border-radius: var(--radius);
      padding: 32px 36px;
      box-shadow: 0 2px 16px rgba(0,0,0,0.08);
      color: #3d3632;
      line-height: 1.75;
      font-size: 0.92rem;
    }

    .glance-section {
      margin-bottom: 24px;
    }

    .glance-section:last-child {
      margin-bottom: 0;
    }

    .glance-label {
      font-weight: 700;
      font-size: 0.95rem;
      display: inline;
    }

    .glance-working { color: #5b4a1e; }
    .glance-hindering { color: #8b2500; }
    .glance-quickwins { color: #2e7d32; }
    .glance-ambitious { color: #4a148c; }

    .glance-card strong {
      font-weight: 700;
      color: #1a1a1a;
    }

    .glance-link {
      display: inline-block;
      margin-top: 6px;
      color: #6C63FF;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      transition: color 0.15s;
    }

    .glance-link:hover {
      color: #5548d4;
      text-decoration: underline;
    }

    /* ── Empty state ── */
    .empty-state {
      text-align: center;
      padding: 48px 24px;
      color: var(--muted);
      font-size: 0.9rem;
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        width: 100%;
        height: auto;
        flex-direction: row;
        overflow-x: auto;
        overflow-y: hidden;
        border-right: none;
        border-bottom: 1px solid var(--border);
      }

      .sidebar-header {
        padding: 12px 16px;
        border-bottom: none;
        border-right: 1px solid var(--border);
        white-space: nowrap;
      }

      .sidebar-header .subtitle { display: none; }

      .sidebar a {
        padding: 12px 16px;
        border-left: none;
        border-bottom: 3px solid transparent;
        white-space: nowrap;
      }

      .sidebar a.active {
        border-left-color: transparent;
        border-bottom-color: var(--primary);
      }

      main {
        margin-left: 0;
        margin-top: 56px;
        padding: 20px 16px 60px;
      }

      .hero-grid { grid-template-columns: repeat(2, 1fr); }
      .chart-row { grid-template-columns: 1fr; }
      .insight-grid { grid-template-columns: 1fr; }
      .summary-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 480px) {
      .hero-grid { grid-template-columns: 1fr; }
      .summary-grid { grid-template-columns: 1fr; }
    }
  `;
}
