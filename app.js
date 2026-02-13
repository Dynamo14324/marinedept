const state = { filesByYear: {}, charts: {}, dynamicCharts: [] };

const COLORS = {
  vessels: '#0078D4',
  vesselsDark: '#003D82',
  nc: '#00B4D8',
  ncQuarter: '#FF9500',
  audits: '#A8A8A8',
  trend: '#FF0000'
};

const CATEGORY_NC_KEYS = [
  { name: 'Internal Audit', keys: ['nc'] },
  { name: 'Safety Inspection', keys: ['nc_si'] },
  { name: 'Navigational Audit', keys: ['nc_nav'] },
  { name: 'Environmental Audit', keys: ['nc_env'] },
  { name: 'Cargo & Ballast', keys: ['nc_cargo'] },
  { name: 'ISPS', keys: ['nc_isps'] },
  { name: 'Mooring', keys: ['nc_mooring'] }
];

const COLUMN_ALIAS = {
  nc: ['nc'],
  nc_si: ['nc_si', 'nc.0', 'nc.1a'],
  nc_nav: ['nc_nav', 'nc.1'],
  nc_env: ['nc_env', 'nc.1.1', 'nc.1b'],
  nc_cargo: ['nc_cargo', 'nc.2'],
  nc_isps: ['nc_isps', 'nc.3'],
  nc_mooring: ['nc_mooring', 'nc.4']
};

const DATA_SHEET_HINTS = ['dry data', 'tanker data', 'ia-si', 'planner', 'category'];

const kpiGrid = document.getElementById('kpiGrid');
const sourcePanel = document.getElementById('sourcePanel');
const fileBadges = document.getElementById('fileBadges');
const sheetChartGrid = document.getElementById('sheetChartGrid');
const periodFilter = document.getElementById('periodFilter');

document.getElementById('excelInput').addEventListener('change', async (e) => {
  for (const file of [...e.target.files]) await loadWorkbook(file);
  e.target.value = '';
  refreshDashboard();
});

periodFilter.addEventListener('change', refreshDashboard);

document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = { exportedAt: new Date().toISOString(), periodFilter: periodFilter.value, files: state.filesByYear };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'marine-dashboard-export.json';
  a.click();
});

async function loadWorkbook(file) {
  const year = Number((file.name.match(/(20\d{2})/) || [])[1]) || guessNextYear();
  const wb = XLSX.read(await file.arrayBuffer(), { cellDates: true, raw: false });
  const sheets = wb.SheetNames.map((name) => ({ name, rows: XLSX.utils.sheet_to_json(wb.Sheets[name], { defval: null, raw: false }) }));
  state.filesByYear[year] = { year, name: file.name, sizeKb: Math.round(file.size / 1024), loadedAt: new Date().toISOString(), sheets };
}

function refreshDashboard() {
  renderBadges();
  renderSources();
  const model = buildModel(periodFilter.value);
  renderKpis(model);
  renderMandatoryCharts(model);
  renderComparisonTable(model);
  renderDynamicSheetCharts(model);
  document.getElementById('exportBtn').disabled = !Object.keys(state.filesByYear).length;
}

function buildModel(period) {
  const years = Object.keys(state.filesByYear).map(Number).sort((a, b) => a - b);
  const summary = { Fleet: {}, Tanker: {}, Dry: {} };
  const quarter = { Fleet: {}, Tanker: {}, Dry: {} };
  const categories = { Fleet: {}, Tanker: {}, Dry: {} };

  for (const yr of years) {
    summary.Fleet[yr] = initStat();
    summary.Tanker[yr] = initStat();
    summary.Dry[yr] = initStat();
    for (const c of CATEGORY_NC_KEYS) {
      categories.Fleet[c.name] ??= {}; categories.Fleet[c.name][yr] = 0;
      categories.Tanker[c.name] ??= {}; categories.Tanker[c.name][yr] = 0;
      categories.Dry[c.name] ??= {}; categories.Dry[c.name][yr] = 0;
    }

    for (const sheet of state.filesByYear[yr].sheets) {
      if (!isLikelyDataSheet(sheet)) continue;
      for (const row of sheet.rows) {
        if (!isLikelyDataRow(row)) continue;
        const fleet = detectFleet(row, sheet.name);
        const dt = extractDate(row);
        if (period === 'H1' && dt && dt.getMonth() > 5) continue;

        const nc = sumAllNc(row);
        const audits = countAuditEvents(row);
        const vessel = extractVessel(row);

        applyRow(summary[fleet][yr], nc, audits, vessel);
        applyRow(summary.Fleet[yr], nc, audits, vessel);

        if (dt) {
          const q = `Q${Math.floor(dt.getMonth() / 3) + 1}`;
          quarter[fleet][`${yr}-${q}`] ??= initStat();
          quarter.Fleet[`${yr}-${q}`] ??= initStat();
          applyRow(quarter[fleet][`${yr}-${q}`], nc, audits, vessel);
          applyRow(quarter.Fleet[`${yr}-${q}`], nc, audits, vessel);
        }

        for (const c of CATEGORY_NC_KEYS) {
          const cNc = sumCategoryNc(row, c.keys);
          categories[fleet][c.name][yr] += cNc;
          categories.Fleet[c.name][yr] += cNc;
        }
      }
    }
  }

  return { years, summary, quarter, categories, period };
}

function initStat() { return { nc: 0, audits: 0, vessels: new Set() }; }
function applyRow(stat, nc, audits, vessel) { stat.nc += nc; stat.audits += audits; if (vessel) stat.vessels.add(vessel); }
function statVessels(stat) { return stat?.vessels?.size || 0; }

function renderKpis(model) {
  kpiGrid.innerHTML = '';
  if (!model.years.length) return;
  const y = model.years.at(-1);
  const s = model.summary.Fleet[y];
  const cards = [
    { t: `Fleet NC (${y})`, v: round(s.nc), src: src(y) },
    { t: `Fleet Audits (${y})`, v: s.audits, src: src(y) },
    { t: `Fleet Vessels (${y})`, v: statVessels(s), src: src(y) },
    { t: `NC x Insp (${y})`, v: ratio(s.nc, s.audits).toFixed(2), src: src(y) },
    { t: 'Period Filter', v: model.period, src: '📊 User selected' },
    { t: 'Years Loaded', v: model.years.join(', '), src: '📊 File names' }
  ];
  cards.forEach((c) => {
    const el = document.createElement('article');
    el.className = 'kpi';
    el.innerHTML = `<div class="title">${c.t}</div><div class="value">${c.v}</div><div class="src">${c.src}</div>`;
    kpiGrid.appendChild(el);
  });
}

function renderMandatoryCharts(model) {
  drawSet(model, 'Fleet', 'fleetYearlyChart', 'fleetQuarterlyChart', 'fleetCategoryChart');
  drawSet(model, 'Tanker', 'tankerYearlyChart', 'tankerQuarterlyChart', 'tankerCategoryChart');
  drawSet(model, 'Dry', 'dryYearlyChart', 'dryQuarterlyChart', 'dryCategoryChart');
}

function drawSet(model, fleetKey, yearlyId, quarterlyId, categoryId) {
  const ys = model.years;
  const rows = ys.map((y) => model.summary[fleetKey][y] || initStat());
  draw(yearlyId, {
    labels: ys,
    datasets: [
      { type: 'bar', label: 'No. of NC', data: rows.map(r => round(r.nc)), backgroundColor: COLORS.nc },
      { type: 'bar', label: 'No. of Vessels', data: rows.map(r => statVessels(r)), backgroundColor: COLORS.vesselsDark },
      { type: 'bar', label: 'No. of Audits', data: rows.map(r => r.audits), backgroundColor: COLORS.audits },
      { type: 'line', label: 'NC x Insp', data: rows.map(r => ratio(r.nc, r.audits)), borderColor: COLORS.trend, yAxisID: 'y1' }
    ]
  });

  const qKeys = Object.keys(model.quarter[fleetKey]).sort();
  const qRows = qKeys.map((k) => model.quarter[fleetKey][k]);
  draw(quarterlyId, {
    labels: qKeys,
    datasets: [
      { type: 'bar', label: 'No. of Vessels', data: qRows.map(statVessels), backgroundColor: COLORS.vessels },
      { type: 'bar', label: 'No. of NC', data: qRows.map(r => round(r.nc)), backgroundColor: COLORS.ncQuarter },
      { type: 'bar', label: 'No. of Audits', data: qRows.map(r => r.audits), backgroundColor: COLORS.audits },
      { type: 'line', label: 'Average NC per Audits', data: qRows.map(r => ratio(r.nc, r.audits)), borderColor: COLORS.trend, yAxisID: 'y1' }
    ]
  }, true);

  const catNames = Object.keys(model.categories[fleetKey]);
  draw(categoryId, {
    labels: catNames,
    datasets: ys.map((y, i) => ({
      type: 'bar', label: String(y), data: catNames.map((c) => round(model.categories[fleetKey][c][y] || 0)),
      backgroundColor: i === 0 ? '#0078D4' : '#004B87'
    }))
  });
}

function renderComparisonTable(model) {
  const wrap = document.getElementById('comparisonTableWrap');
  if (model.years.length < 2) return (wrap.innerHTML = '<p class="muted">Load at least 2 years for YoY comparison.</p>');
  const rows = [];
  for (let i = 1; i < model.years.length; i++) {
    const y0 = model.years[i - 1], y1 = model.years[i];
    const a = model.summary.Fleet[y0], b = model.summary.Fleet[y1];
    rows.push({
      p: `${y0} → ${y1}`,
      nc: pct(b.nc, a.nc),
      audits: pct(b.audits, a.audits),
      vessels: pct(statVessels(b), statVessels(a)),
      nci: pct(ratio(b.nc, b.audits), ratio(a.nc, a.audits))
    });
  }
  wrap.innerHTML = `<table><thead><tr><th>Period</th><th>NC %</th><th>Audits %</th><th>Vessels %</th><th>NC x Insp %</th></tr></thead><tbody>${rows.map(r =>
    `<tr><td>${r.p}</td><td class="${sign(r.nc)}">${fmtPct(r.nc)}</td><td class="${sign(r.audits)}">${fmtPct(r.audits)}</td><td class="${sign(r.vessels)}">${fmtPct(r.vessels)}</td><td class="${sign(r.nci)}">${fmtPct(r.nci)}</td></tr>`).join('')}</tbody></table>`;
}

function renderDynamicSheetCharts(model) {
  state.dynamicCharts.forEach(c => c.destroy());
  state.dynamicCharts = [];
  sheetChartGrid.innerHTML = '';

  for (const year of model.years) {
    const file = state.filesByYear[year];
    for (const sheet of file.sheets) {
      const numCols = detectNumericColumns(sheet.rows).slice(0, 3);
      for (const col of numCols) {
        const id = `dyn-${year}-${sheet.name.replace(/\W+/g, '')}-${col.replace(/\W+/g, '')}`;
        const card = document.createElement('article');
        card.className = 'chart-card';
        card.innerHTML = `<h3>${year} • ${sheet.name} • ${col}</h3><canvas id="${id}"></canvas>`;
        sheetChartGrid.appendChild(card);
        const bins = bucketByMonth(sheet.rows, col, model.period);
        const chart = new Chart(document.getElementById(id), {
          type: 'bar',
          data: { labels: Object.keys(bins), datasets: [{ label: col, data: Object.values(bins), backgroundColor: '#0078D4' }] },
          options: baseOptions(false)
        });
        state.dynamicCharts.push(chart);
      }
    }
  }
}

function draw(id, data, stacked = false) {
  if (state.charts[id]) state.charts[id].destroy();
  state.charts[id] = new Chart(document.getElementById(id), { type: 'bar', data, options: baseOptions(stacked) });
}

function baseOptions(stacked) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked, ticks: { color: '#94a3b8' } },
      y: { stacked, ticks: { color: '#94a3b8' } },
      y1: { position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#fca5a5' } }
    },
    plugins: { legend: { labels: { color: '#cbd5e1' } } }
  };
}

function renderBadges() {
  fileBadges.innerHTML = '';
  Object.values(state.filesByYear).sort((a, b) => a.year - b.year).forEach((f) => {
    const b = document.createElement('div');
    b.className = 'badge';
    b.innerHTML = `✓ ${f.year} 📄 ${f.name} <button class="close">✕</button>`;
    b.querySelector('button').onclick = () => { delete state.filesByYear[f.year]; refreshDashboard(); };
    fileBadges.appendChild(b);
  });
}

function renderSources() {
  sourcePanel.innerHTML = '';
  const files = Object.values(state.filesByYear).sort((a, b) => a.year - b.year);
  if (!files.length) return (sourcePanel.innerHTML = '<p class="muted">No files loaded yet.</p>');
  files.forEach((f) => {
    const el = document.createElement('div');
    el.className = 'source-item';
    el.textContent = `📊 ${f.year}: ${f.name} | ${f.sizeKb} KB | loaded ${new Date(f.loadedAt).toLocaleString()} | sheets ${f.sheets.length}`;
    sourcePanel.appendChild(el);
  });
}

function detectFleet(row, sheet) {
  const t = `${sheet} ${Object.keys(row).join(' ')} ${Object.values(row).join(' ')}`.toLowerCase();
  if (t.includes('tanker')) return 'Tanker';
  return 'Dry';
}

function isLikelyDataSheet(sheet) {
  const name = String(sheet.name || '').toLowerCase();
  if (DATA_SHEET_HINTS.some((h) => name.includes(h))) return true;
  return sheet.rows && sheet.rows.length > 0;
}

function isLikelyDataRow(row) {
  const keys = Object.keys(row).map((k) => normalizeKey(k));
  const hasNC = keys.some((k) => k.startsWith('nc'));
  const hasVessel = keys.some((k) => k.includes('vessel'));
  const hasDate = keys.some((k) => k.includes('date'));
  return hasNC || hasVessel || hasDate;
}

function countAuditEvents(row) {
  let c = 0;
  for (const [k, v] of Object.entries(row)) {
    const key = String(k).toLowerCase();
    if (key.includes('date') && v && !isNaN(new Date(v))) c += 1;
  }
  return c;
}

function extractVessel(row) {
  for (const [k, v] of Object.entries(row)) if (String(k).toLowerCase().includes('vessel') && v) return String(v).trim();
  return null;
}

function extractDate(row) {
  for (const v of Object.values(row)) {
    const d = new Date(v);
    if (!isNaN(d)) return d;
  }
  return null;
}

function sumAllNc(row) {
  const ncKeys = new Set([
    ...COLUMN_ALIAS.nc,
    ...COLUMN_ALIAS.nc_si,
    ...COLUMN_ALIAS.nc_nav,
    ...COLUMN_ALIAS.nc_env,
    ...COLUMN_ALIAS.nc_cargo,
    ...COLUMN_ALIAS.nc_isps,
    ...COLUMN_ALIAS.nc_mooring
  ]);
  return Object.entries(row).reduce((s, [k, v]) => {
    const key = normalizeKey(k);
    if (!ncKeys.has(key)) return s;
    const n = Number(v);
    return Number.isFinite(n) ? s + n : s;
  }, 0);
}

function sumCategoryNc(row, includes) {
  const accepted = new Set(includes.flatMap((k) => COLUMN_ALIAS[k] || [k]));
  return Object.entries(row).reduce((s, [k, v]) => {
    const key = normalizeKey(k);
    if (!accepted.has(key)) return s;
    const n = Number(v);
    return Number.isFinite(n) ? s + n : s;
  }, 0);
}

function normalizeKey(key) {
  return String(key).toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9.]/g, '');
}

function detectNumericColumns(rows) {
  if (!rows.length) return [];
  return Object.keys(rows[0]).filter((k) => rows.slice(0, 80).filter(r => Number.isFinite(Number(r[k]))).length > 5);
}

function bucketByMonth(rows, col, period) {
  const out = {};
  rows.forEach((r) => {
    const d = extractDate(r);
    if (!d) return;
    if (period === 'H1' && d.getMonth() > 5) return;
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const n = Number(r[col]);
    if (!Number.isFinite(n)) return;
    out[key] = (out[key] || 0) + n;
  });
  return Object.keys(out).length ? out : { 'No dated values': 0 };
}

function guessNextYear() { const ys = Object.keys(state.filesByYear).map(Number); return ys.length ? Math.max(...ys) + 1 : new Date().getFullYear(); }
function ratio(a, b) { return b ? a / b : 0; }
function pct(curr, prev) { return prev ? ((curr - prev) / Math.abs(prev)) * 100 : 0; }
function sign(n) { return n >= 0 ? 'positive' : 'negative'; }
function fmtPct(n) { return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`; }
function round(n) { return Math.round((n + Number.EPSILON) * 100) / 100; }
function src(year) { return `📊 ${state.filesByYear[year]?.name || year}`; }
