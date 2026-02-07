export function getScripts(): string {
  return `
    (function() {
      const data = window.__data;
      if (!data) return;

      // ── Helpers ──
      function fmt(n) {
        if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
        if (n >= 1e3) return (n / 1e3).toFixed(1) + 'k';
        return n.toString();
      }

      function fmtCost(n) {
        return '$' + n.toFixed(2);
      }

      const chartColors = [
        '#6C63FF', '#00D9FF', '#FF6B6B', '#4ECB71', '#FFB86C',
        '#BD93F9', '#FF79C6', '#8BE9FD', '#F1FA8C', '#50FA7B',
        '#FF5555', '#44475A', '#6272A4', '#CAA9FA', '#FF6E6E'
      ];

      // ── Chart.js defaults ──
      if (typeof Chart !== 'undefined') {
        Chart.defaults.color = '#8888aa';
        Chart.defaults.borderColor = 'rgba(42,42,74,0.5)';
        Chart.defaults.font.family = "system-ui, -apple-system, sans-serif";

        // Projects bar chart
        const projCanvas = document.getElementById('chart-projects');
        if (projCanvas && data.projects) {
          const sorted = [...data.projects].sort((a, b) => b.sessionCount - a.sessionCount).slice(0, 15);
          new Chart(projCanvas, {
            type: 'bar',
            data: {
              labels: sorted.map(p => p.name.length > 25 ? p.name.slice(0, 22) + '...' : p.name),
              datasets: [{
                label: 'Sessions',
                data: sorted.map(p => p.sessionCount),
                backgroundColor: '#6C63FF',
                borderRadius: 6,
                borderSkipped: false,
                barThickness: 20
              }]
            },
            options: {
              indexAxis: 'y',
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: '#222244',
                  titleColor: '#fff',
                  bodyColor: '#e0e0e0',
                  borderColor: '#2a2a4a',
                  borderWidth: 1,
                  cornerRadius: 8,
                  padding: 10
                }
              },
              scales: {
                x: { grid: { color: 'rgba(42,42,74,0.3)' }, ticks: { color: '#8888aa' } },
                y: { grid: { display: false }, ticks: { color: '#b0b0cc', font: { size: 12 } } }
              }
            }
          });
        }

        // Cost doughnut
        const costCanvas = document.getElementById('chart-cost-doughnut');
        if (costCanvas && data.costs && data.costs.costByModel) {
          const models = Object.entries(data.costs.costByModel)
            .map(([name, d]) => ({ name, total: d.total }))
            .sort((a, b) => b.total - a.total);
          new Chart(costCanvas, {
            type: 'doughnut',
            data: {
              labels: models.map(m => m.name),
              datasets: [{
                data: models.map(m => m.total),
                backgroundColor: chartColors.slice(0, models.length),
                borderWidth: 0,
                hoverOffset: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              cutout: '65%',
              plugins: {
                legend: {
                  position: 'right',
                  labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10, font: { size: 11 } }
                },
                tooltip: {
                  backgroundColor: '#222244',
                  borderColor: '#2a2a4a',
                  borderWidth: 1,
                  cornerRadius: 8,
                  padding: 10,
                  callbacks: {
                    label: function(ctx) {
                      return ctx.label + ': $' + ctx.parsed.toFixed(2);
                    }
                  }
                }
              }
            }
          });
        }

        // Daily cost line chart
        const dailyCanvas = document.getElementById('chart-daily-cost');
        if (dailyCanvas && data.costs && data.costs.dailyCost) {
          const ctx = dailyCanvas.getContext('2d');
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(108, 99, 255, 0.3)');
          gradient.addColorStop(1, 'rgba(108, 99, 255, 0)');
          new Chart(dailyCanvas, {
            type: 'line',
            data: {
              labels: data.costs.dailyCost.map(d => d.date),
              datasets: [{
                label: 'Daily Cost ($)',
                data: data.costs.dailyCost.map(d => d.cost),
                borderColor: '#6C63FF',
                backgroundColor: gradient,
                fill: true,
                tension: 0.35,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#6C63FF',
                borderWidth: 2
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              interaction: { mode: 'index', intersect: false },
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: '#222244',
                  borderColor: '#2a2a4a',
                  borderWidth: 1,
                  cornerRadius: 8,
                  padding: 10,
                  callbacks: {
                    label: function(ctx) { return '$' + ctx.parsed.y.toFixed(2); }
                  }
                }
              },
              scales: {
                x: {
                  grid: { display: false },
                  ticks: { color: '#8888aa', maxTicksLimit: 12, font: { size: 11 } }
                },
                y: {
                  grid: { color: 'rgba(42,42,74,0.3)' },
                  ticks: {
                    color: '#8888aa',
                    callback: function(v) { return '$' + v.toFixed(2); }
                  }
                }
              }
            }
          });
        }
      }

      // ── Sidebar active tracking ──
      const navLinks = document.querySelectorAll('.sidebar a');
      const sections = document.querySelectorAll('main section[id]');

      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const link = document.querySelector('.sidebar a[href="#' + entry.target.id + '"]');
            if (link) link.classList.add('active');
          }
        });
      }, { rootMargin: '-20% 0px -60% 0px' });

      sections.forEach(s => observer.observe(s));

      // ── Heatmap tooltips ──
      const tooltip = document.getElementById('heatmap-tooltip');
      if (tooltip) {
        document.querySelectorAll('.heatmap-cell[data-date]').forEach(cell => {
          cell.addEventListener('mouseenter', e => {
            const date = cell.getAttribute('data-date');
            const count = cell.getAttribute('data-count');
            tooltip.textContent = date + ': ' + count + ' message' + (count === '1' ? '' : 's');
            tooltip.style.display = 'block';
            const rect = cell.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - 32 + 'px';
          });
          cell.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
          });
        });
      }

      // ── Session explorer ──
      const searchInput = document.getElementById('session-search');
      const projectFilter = document.getElementById('session-project-filter');
      const sessionBody = document.getElementById('session-tbody');
      const loadMoreBtn = document.getElementById('load-more-btn');
      let sessionData = data.sessions || [];
      let filteredSessions = [...sessionData];
      let visibleCount = 50;

      function truncate(s, len) {
        if (!s) return '';
        return s.length > len ? s.slice(0, len) + '...' : s;
      }

      function formatDate(d) {
        if (!d) return '';
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }

      function renderSessions() {
        if (!sessionBody) return;
        const showing = filteredSessions.slice(0, visibleCount);
        let html = '';
        showing.forEach((s, i) => {
          const proj = s.projectPath ? s.projectPath.split('/').pop() : '';
          html += '<tr class="expandable-row" data-idx="' + i + '">'
            + '<td>' + formatDate(s.created) + '</td>'
            + '<td>' + escapeHtml(proj) + '</td>'
            + '<td>' + escapeHtml(truncate(s.firstPrompt, 80)) + '</td>'
            + '<td>' + s.messageCount + '</td>'
            + '<td>' + escapeHtml(s.gitBranch || '-') + '</td>'
            + '</tr>'
            + '<tr class="expanded-row"><td colspan="5" class="expanded-content" id="expand-' + i + '">'
            + escapeHtml(s.firstPrompt || 'No prompt recorded')
            + '</td></tr>';
        });
        sessionBody.innerHTML = html;

        if (loadMoreBtn) {
          loadMoreBtn.style.display = filteredSessions.length > visibleCount ? 'block' : 'none';
          loadMoreBtn.textContent = 'Show more (' + (filteredSessions.length - visibleCount) + ' remaining)';
        }

        sessionBody.querySelectorAll('.expandable-row').forEach(row => {
          row.addEventListener('click', () => {
            const idx = row.getAttribute('data-idx');
            const el = document.getElementById('expand-' + idx);
            if (el) el.classList.toggle('open');
          });
        });
      }

      function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      }

      function filterSessions() {
        const q = (searchInput ? searchInput.value : '').toLowerCase();
        const proj = projectFilter ? projectFilter.value : '';
        filteredSessions = sessionData.filter(s => {
          const matchSearch = !q || (s.firstPrompt && s.firstPrompt.toLowerCase().includes(q));
          const matchProj = !proj || s.projectPath === proj;
          return matchSearch && matchProj;
        });
        visibleCount = 50;
        renderSessions();
      }

      if (searchInput) searchInput.addEventListener('input', filterSessions);
      if (projectFilter) projectFilter.addEventListener('change', filterSessions);
      if (loadMoreBtn) loadMoreBtn.addEventListener('click', () => { visibleCount += 50; renderSessions(); });

      renderSessions();

      // ── Table sorting ──
      document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => {
          const table = th.closest('table');
          const tbody = table.querySelector('tbody');
          const idx = Array.from(th.parentNode.children).indexOf(th);
          const rows = Array.from(tbody.querySelectorAll('tr:not(.expanded-row)'));
          const asc = th.classList.contains('sorted-asc');

          table.querySelectorAll('th').forEach(h => {
            h.classList.remove('sorted', 'sorted-asc', 'sorted-desc');
          });
          th.classList.add('sorted', asc ? 'sorted-desc' : 'sorted-asc');

          rows.sort((a, b) => {
            let va = a.children[idx]?.textContent?.trim() || '';
            let vb = b.children[idx]?.textContent?.trim() || '';
            const na = parseFloat(va.replace(/[^0-9.-]/g, ''));
            const nb = parseFloat(vb.replace(/[^0-9.-]/g, ''));
            if (!isNaN(na) && !isNaN(nb)) {
              return asc ? nb - na : na - nb;
            }
            return asc ? vb.localeCompare(va) : va.localeCompare(vb);
          });

          rows.forEach(row => {
            const next = row.nextElementSibling;
            tbody.appendChild(row);
            if (next && next.classList.contains('expanded-row')) {
              tbody.appendChild(next);
            }
          });
        });
      });
    })();
  `;
}
