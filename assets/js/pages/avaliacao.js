/* Avaliação de Riscos — maturidade, matriz de calor e riscos prioritários */

function initPage() {
  if (!hasRisks()) { emptyState('#page'); return; }
  const a = Store.get('answers');
  const risks = Engine.enriched();
  const cut = Engine.criticalCut(a);

  // Maturidade
  const m = Engine.maturity(a), lvl = Engine.maturityLevel(m);
  $('#kMat').textContent = m + '%';
  $('#kMatBar').style.width = m + '%';
  const prio = risks.filter(r => r.level === 'Crítico' || r.level === 'Alto').length;
  $('#kMatLvl').textContent = `Nível ${lvl.n} — ${lvl.name} · ${prio} riscos prioritários`;

  // Controles
  const count = s => risks.filter(r => r.status === s).length;
  $('#kImp').textContent = count('Implementado');
  $('#kPar').textContent = count('Parcial');
  $('#kPen').textContent = count('Pendente');

  // Matriz 5×5 (linha = probabilidade 5→1, coluna = impacto 1→5)
  $('#cut').textContent = cut;
  let html = '';
  for (let p = 5; p >= 1; p--) {
    html += `<div class="ax">${p}</div>`;
    for (let i = 1; i <= 5; i++) {
      const exp = p * i, n = risks.filter(r => r.p === p && r.i === i).length;
      const cls = exp >= cut ? 'h-crit' : exp >= 10 ? 'h-high' : exp >= 5 ? 'h-med' : 'h-low';
      const names = risks.filter(r => r.p === p && r.i === i).map(r => r.id + ' ' + r.risk).join('\n');
      html += `<div class="cell ${cls}" title="${esc(names || 'Sem riscos')}"><small>${exp}</small>${n || ''}</div>`;
    }
  }
  html += `<div></div>` + [1, 2, 3, 4, 5].map(i => `<div class="ax">${i}</div>`).join('');
  $('#heat').innerHTML = html;

  // Maturidade por cláusula
  const block = QUESTIONNAIRE.find(b => b.id === 'E');
  $('#clauses').innerHTML = block.questions.map(q => {
    const v = Number(a[q.id]) || 0;
    return `<div class="hbar" title="${esc(q.text)}"><span>${q.clause}</span><div class="track"><span style="width:${v * 20}%"></span></div><strong>${v || '—'}</strong></div>`;
  }).join('');

  // Tabela
  const top = risks.filter(r => r.level !== 'Baixo').slice(0, 10);
  $('#rows').innerHTML = top.map(r => `
    <tr><td><strong>${esc(r.risk)}</strong></td><td>${esc(r.owner)}</td><td>${r.p} × ${r.i} = <strong>${r.exp}</strong></td>
    <td>${badge(r.level)}</td><td class="desc">${esc(r.control)}</td></tr>`).join('');
}
