/* Relatório executivo (imprimir / salvar em PDF) */

function initPage() {
  if (!hasRisks()) { emptyState('#page'); return; }
  const a = Store.get('answers');
  const risks = Engine.enriched();
  const m = Engine.maturity(a), lvl = Engine.maturityLevel(m);
  const r = a._respondent || {};
  const count = l => risks.filter(x => x.level === l).length;

  $('#report').innerHTML = `
    <div class="row between">
      <div><h2 style="font-size:20px;margin:0">Relatório de Gestão de Riscos</h2>
      <div class="muted">${esc(a.A1 || 'Empresa')} · emitido em ${new Date().toLocaleDateString('pt-BR')}</div></div>
      <div class="brand" style="color:var(--navy);padding:0"><span class="logo"></span>RiskFlow</div>
    </div>

    <h3>1. Contexto</h3>
    <p>Setor ${esc(a.A2 || '—')}, ${esc(a.A3 || '—')} funcionários, faturamento ${esc(a.A4 || '—')}, ${esc(a.A6 || '—')} unidade(s).
    Apetite a risco: <strong>${esc(a.F3 || 'Moderado')}</strong> (crítico a partir de exposição ${Engine.criticalCut(a)}).
    Respondente: ${esc(r.nome || '—')}${r.cargo ? ', ' + esc(r.cargo) : ''}.</p>

    <h3>2. Resultado</h3>
    <div class="grid g4">
      <div><div class="muted small">Maturidade</div><div style="font-size:24px;font-weight:700">${m}%</div><div class="small">${lvl.name}</div></div>
      <div><div class="muted small">Riscos mapeados</div><div style="font-size:24px;font-weight:700">${risks.length}</div></div>
      <div><div class="muted small">Críticos / Altos</div><div style="font-size:24px;font-weight:700">${count('Crítico')} / ${count('Alto')}</div></div>
      <div><div class="muted small">Ações concluídas</div><div style="font-size:24px;font-weight:700">${risks.filter(x => x.actionStatus === 'Concluído').length}</div></div>
    </div>
    <p class="small muted">Recomendação para o nível atual: ${lvl.tip}.</p>

    <h3>3. Registro de Riscos e plano de tratamento</h3>
    <div class="table-wrap"><table>
      <thead><tr><th>ID</th><th>Risco</th><th>Exposição</th><th>Nível</th><th>Ação</th><th>Responsável</th><th>Prazo</th><th>Status</th></tr></thead>
      <tbody>${risks.map(x => `<tr><td class="small">${x.id}</td><td>${esc(x.risk)}</td><td class="num">${x.exp}</td><td>${badge(x.level)}</td>
        <td class="desc">${esc(x.action)}</td><td>${esc(x.owner)}</td><td>${fmtDate(x.due)}</td><td>${badge(x.actionStatus)}</td></tr>`).join('')}</tbody>
    </table></div>

    <p class="small muted" style="margin-top:20px">Metodologia: ABNT NBR ISO 31000:2018. Exposição = probabilidade × impacto (escala 1 a 5). Este relatório é um diagnóstico inicial e não constitui certificação ou parecer jurídico/contábil.</p>`;

  if (new URLSearchParams(location.search).get('print')) setTimeout(() => window.print(), 400);
}
