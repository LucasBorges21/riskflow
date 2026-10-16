/* ==========================================================
   RiskFlow — Núcleo compartilhado
   - Armazenamento local (localStorage)
   - Motor de riscos (regras ISO 31000)
   - Layout (menu lateral e cabeçalho)
   - Utilitários (badges, exportação CSV)
   ========================================================== */

/* ---------- Armazenamento ---------- */
const Store = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem('rf_' + key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem('rf_' + key, JSON.stringify(value)); } catch (e) { /* sem storage */ }
  },
  remove(key) { try { localStorage.removeItem('rf_' + key); } catch (e) {} },
};

/* Carrega o exemplo da Nexora na primeira visita */
function ensureData() {
  if (!Store.get('answers')) {
    Store.set('answers', SAMPLE_ANSWERS);
    Store.set('sample', true);
  }
  const ans = Store.get('answers');
  if (!Store.get('risks')) {
    let risks = ans._completed ? Engine.buildRisks(ans) : [];
    if (Store.get('sample')) risks = risks.map(r => SAMPLE_STATUS[r.id] ? { ...r, status: SAMPLE_STATUS[r.id][0], actionStatus: SAMPLE_STATUS[r.id][1] } : r);
    Store.set('risks', risks);
  }
  if (!Store.get('users')) Store.set('users', SAMPLE_USERS);
  if (!Store.get('history') && ans._completed) {
    const m = Engine.maturity(Store.get('answers'));
    Store.set('history', [
      { label: 'Ago', value: Math.max(0, m - 9) }, { label: 'Set', value: Math.max(0, m - 6) },
      { label: 'Out', value: Math.max(0, m - 3) }, { label: 'Nov', value: m },
    ]);
  }
}

function resetData() {
  ['answers', 'risks', 'users', 'history', 'sample', 'audit', 'draftStep'].forEach(k => Store.remove(k));
  ensureData();
}

/* ---------- Motor de riscos ---------- */
const Engine = {
  /* Índice de maturidade: ((soma E1..E10) − 10) / 40 × 100 */
  maturity(a) {
    const ids = ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9', 'E10'];
    const vals = ids.map(id => Number(a?.[id]) || 1);
    const sum = vals.reduce((s, v) => s + v, 0);
    return Math.round(((sum - 10) / 40) * 100);
  },

  maturityLevel(idx) {
    if (idx <= 20) return { n: 1, name: 'Inexistente', tip: 'Começar por política e responsável' };
    if (idx <= 40) return { n: 2, name: 'Inicial', tip: 'Formalizar critérios e registro' };
    if (idx <= 60) return { n: 3, name: 'Em estruturação', tip: 'Garantir aplicação em todas as áreas' };
    if (idx <= 80) return { n: 4, name: 'Gerenciado', tip: 'Medir eficácia dos controles' };
    return { n: 5, name: 'Otimizado', tip: 'Integrar ao planejamento estratégico' };
  },

  criticalCut(a) { return CRITICAL_CUT[a?.F3] || 15; },

  /* Classificação da exposição (P × I) */
  level(exp, cut = 15) {
    if (exp >= cut) return 'Crítico';
    if (exp >= 10) return 'Alto';
    if (exp >= 5) return 'Médio';
    return 'Baixo';
  },

  buildRisks(a) {
    if (!a) return [];
    const zeroCats = (a.F4 || []).flatMap(t => F4_MAP[t] || []);
    const today = new Date();
    return RULES.filter(r => { try { return r.when(a); } catch (e) { return false; } }).map(r => {
      let p = r.p, i = r.i;
      if ((r.id === 'R-09' && a.C10 === 'Sim') || (r.id === 'R-15' && a.D10 === 'Sim')) p++;
      if (r.id === 'R-07' && a.C7 === 'Existem e são testados') p--;
      if (r.id === 'R-06' && String(a.C3 || '').startsWith('Inclui dados sensíveis')) i++;
      if (zeroCats.includes(r.cat)) i = Math.max(i, 4);
      p = Math.min(5, Math.max(1, p)); i = Math.min(5, Math.max(1, i));
      return {
        id: r.id, risk: r.risk, cat: r.cat, control: r.control, freq: r.freq,
        owner: r.owner, from: r.from, p, i, status: 'Pendente',
        action: r.action, actionStatus: 'Não iniciado', due: null,
        created: today.toISOString().slice(0, 10),
      };
    }).map(x => ({ ...x, due: Engine.dueDate(x, a) }));
  },

  dueDate(risk, a) {
    const lvl = Engine.level(risk.p * risk.i, Engine.criticalCut(a));
    const days = { 'Crítico': 30, 'Alto': 60, 'Médio': 90, 'Baixo': 180 }[lvl];
    const d = new Date(); d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  },

  /* Riscos enriquecidos com exposição e nível */
  enriched() {
    const a = Store.get('answers') || {};
    const cut = Engine.criticalCut(a);
    return (Store.get('risks') || []).map(r => {
      const exp = r.p * r.i;
      return { ...r, exp, level: Engine.level(exp, cut) };
    }).sort((x, y) => y.exp - x.exp);
  },
};

/* ---------- Utilitários ---------- */
const LEVEL_CLASS = { 'Crítico': 'b-crit', 'Alto': 'b-red', 'Médio': 'b-amber', 'Baixo': 'b-blue' };
const STATUS_CLASS = {
  'Implementado': 'b-green', 'Parcial': 'b-amber', 'Pendente': 'b-red',
  'Concluído': 'b-green', 'Em andamento': 'b-amber', 'Não iniciado': 'b-grey',
  'Ativo': 'b-green', 'OK': 'b-green', 'Evidência insuficiente': 'b-amber', 'Falha': 'b-red',
  'Administrador': 'b-purple', 'Edição': 'b-blue', 'Leitura': 'b-grey',
};
const badge = (text, cls) => `<span class="badge ${cls || LEVEL_CLASS[text] || STATUS_CLASS[text] || 'b-grey'}">${esc(text)}</span>`;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = iso => iso ? iso.split('-').reverse().join('/') : '—';
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* Exporta CSV com ";" e BOM — abre direto no Excel em português */
function exportCSV(filename, header, rows) {
  const line = arr => arr.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(';');
  const csv = '﻿' + [line(header), ...rows.map(line)].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportRisksCSV() {
  const rows = Engine.enriched().map(r => [r.id, r.risk, r.cat, r.control, r.freq, r.owner, r.p, r.i, r.exp, r.level, r.status, r.action, r.actionStatus, fmtDate(r.due)]);
  exportCSV('riskflow-registro-de-riscos.csv',
    ['ID', 'Risco', 'Categoria', 'Controle recomendado', 'Frequência', 'Responsável', 'Probabilidade', 'Impacto', 'Exposição', 'Nível', 'Status do controle', 'Ação de tratamento', 'Status da ação', 'Prazo'], rows);
}

function toast(msg) {
  let t = $('#toast');
  if (!t) { t = Object.assign(document.createElement('div'), { id: 'toast', className: 'toast' }); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Layout ---------- */
const NAV = [
  { page: 'dashboard', href: 'dashboard.html', label: 'Dashboard' },
  { page: 'questionario', href: 'questionario.html', label: 'Questionário de Mapeamento' },
  { page: 'registro', href: 'registro.html', label: 'Registro de Riscos' },
  { page: 'avaliacao', href: 'avaliacao.html', label: 'Avaliação de Riscos' },
  { page: 'plano', href: 'plano.html', label: 'Plano de Tratamento' },
  { page: 'relatorios', href: 'relatorios.html', label: 'Relatórios' },
  { page: 'pre-auditoria', href: 'pre-auditoria.html', label: 'Pré-Auditoria (Agente)' },
  { page: 'usuarios', href: 'usuarios.html', label: 'Usuários e Permissões' },
];

function renderShell() {
  const body = document.body;
  const page = body.dataset.page;
  const a = Store.get('answers') || {};
  const company = a.A1 || 'Sua empresa';
  const resp = a._respondent || {};
  const initials = (resp.nome || company).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const side = $('#sidebar');
  if (side) {
    side.innerHTML = `
      <a class="brand" href="dashboard.html"><span class="logo"></span>RiskFlow</a>
      <nav>${NAV.map(n => `<a href="${n.href}" class="${n.page === page ? 'active' : ''}"><span class="dot"></span>${n.label}</a>`).join('')}</nav>
      <div class="side-foot">
        <a href="index.html">Sair</a>
        <button type="button" id="btnReset" title="Restaura os dados de exemplo">Restaurar exemplo</button>
      </div>`;
    $('#btnReset').onclick = () => { if (confirm('Apagar os dados salvos neste navegador e voltar ao exemplo da Nexora?')) { resetData(); location.reload(); } };
  }

  const top = $('#topbar');
  if (top) {
    top.innerHTML = `
      <button class="menu-btn" type="button" aria-label="Abrir menu">☰</button>
      <div><div class="crumb">${esc(body.dataset.crumb || 'RiskFlow · Gestão de Riscos')}</div>
      <h1>${esc(body.dataset.title || document.title)}</h1></div>
      <div class="user"><div class="u-text"><strong>${esc(company)}</strong><span>${esc(resp.cargo || 'ISO 31000')}</span></div>
      <div class="avatar">${esc(initials)}</div></div>`;
    $('.menu-btn', top).onclick = () => document.body.classList.toggle('nav-open');
  }

  if (Store.get('sample') && $('.content')) {
    const bar = document.createElement('div');
    bar.className = 'alert info sample-bar';
    bar.innerHTML = `Você está vendo <strong>dados de exemplo da Nexora Tecnologia</strong>. Responda o <a href="questionario.html">questionário</a> para gerar os dados da sua empresa.`;
    $('.content').prepend(bar);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page && document.body.dataset.page !== 'auth') {
    ensureData();
    renderShell();
  }
  if (typeof initPage === 'function') initPage();
});

/* Mensagem para páginas que dependem do questionário */
function hasRisks() { return (Store.get('risks') || []).length > 0; }
function emptyState(target) {
  const el = typeof target === 'string' ? $(target) : target;
  el.innerHTML = `<div class="card" style="text-align:center;padding:48px 24px">
    <h2 style="margin-bottom:8px">Nenhum risco mapeado ainda</h2>
    <p class="muted" style="margin:0 0 20px">Responda o Questionário de Mapeamento para gerar o Registro de Riscos da sua empresa.</p>
    <a class="btn primary" href="questionario.html">Ir para o questionário →</a></div>`;
}
