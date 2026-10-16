/* Dashboard consolidado */

const LEVEL_COLORS = { 'Crítico': '#7F1D1D', 'Alto': '#C62828', 'Médio': '#D97706', 'Baixo': '#2F6FED' };
const CTRL_COLORS = { 'Implementado': '#2E7D32', 'Parcial': '#B45309', 'Pendente': '#C62828' };

function stack(target, legend, counts, colors) {
  const total = Object.values(counts).reduce((s, n) => s + n, 0) || 1;
  $(target).innerHTML = Object.entries(counts).map(([k, n]) =>
    `<span style="width:${(n / total) * 100}%;background:${colors[k]}" title="${k}: ${n}"></span>`).join('');
  $(legend).innerHTML = Object.entries(counts).map(([k, n]) =>
    `<span><i style="background:${colors[k]}"></i>${k}: ${n} (${Math.round((n / total) * 100)}%)</span>`).join('');
}

function initPage() {
  if (!hasRisks()) { emptyState('#page'); return; }
  const a = Store.get('answers');
  const risks = Engine.enriched();
  const today = new Date().toISOString().slice(0, 10);

  // Maturidade
  const m = Engine.maturity(a), hist = Store.get('history') || [];
  $('#kMat').textContent = m + '%';
  const prev = hist.length > 1 ? hist[hist.length - 2].value : null;
  $('#kMatHint').textContent = `Nível ${Engine.maturityLevel(m).name}` + (prev !== null ? ` · ${m - prev >= 0 ? '+' : ''}${m - prev} pts desde a última avaliação` : '');

  // Ações
  const done = risks.filter(r => r.actionStatus === 'Concluído').length;
  $('#kActions').textContent = `${done} / ${risks.length}`;

  // Críticos
  const crit = risks.filter(r => r.level === 'Crítico').length;
  $('#kCrit').textContent = crit;
  $('#kCritHint').textContent = `${risks.filter(r => r.level === 'Alto').length} de nível alto`;

  // Próximo prazo
  const next = risks.filter(r => r.actionStatus !== 'Concluído' && r.due).sort((x, y) => x.due.localeCompare(y.due))[0];
  if (next) {
    $('#kDue').textContent = fmtDate(next.due).slice(0, 5);
    $('#kDue').classList.toggle('c-red', next.due < today);
    $('#kDueHint').textContent = next.action;
  }

  // Barras empilhadas
  const lv = { 'Crítico': 0, 'Alto': 0, 'Médio': 0, 'Baixo': 0 };
  risks.forEach(r => lv[r.level]++);
  stack('#levelStack', '#levelLegend', lv, LEVEL_COLORS);
  const ct = { 'Implementado': 0, 'Parcial': 0, 'Pendente': 0 };
  risks.forEach(r => ct[r.status]++);
  stack('#ctrlStack', '#ctrlLegend', ct, CTRL_COLORS);

  // Evolução
  const hMax = Math.max(1, ...hist.map(h => h.value));
  $('#history').innerHTML = hist.map(h =>
    `<div class="col"><div class="bar" style="height:${Math.max(4, (h.value / hMax) * 85)}%"></div><div class="lbl">${h.label} · ${h.value}%</div></div>`).join('');

  // Categorias
  const cats = {};
  risks.forEach(r => (cats[r.cat] = (cats[r.cat] || 0) + 1));
  const max = Math.max(...Object.values(cats));
  $('#cats').innerHTML = Object.entries(cats).sort((x, y) => y[1] - x[1]).map(([c, n]) =>
    `<div class="hbar"><span>${c}</span><div class="track"><span style="width:${(n / max) * 100}%"></span></div><strong>${n}</strong></div>`).join('');
}
