/* Pré-auditoria (simulação do agente).
   Regra: Implementado => OK (salvo evidência fraca no questionário),
          Parcial => Evidência insuficiente, Pendente => Falha. */

const WEAK_EVIDENCE = {
  'R-07': a => a.C7 !== 'Existem e são testados',
  'R-08': a => a.C6 !== 'Semestralmente ou mais',
  'R-13': a => a.D2 !== 'Anualmente',
};
const RESIDUAL_CLASS = { 'Baixo': 'b-blue', 'Médio': 'b-amber', 'Alto': 'b-red', 'Crítico': 'b-crit' };

function initPage() {
  if (!hasRisks()) { emptyState('#page'); return; }
  $('#btnRun').onclick = run;
  const saved = Store.get('audit');
  if (saved) show(saved);
}

function run() {
  const btn = $('#btnRun');
  btn.disabled = true; btn.textContent = 'Analisando controles…';
  $('#rows').innerHTML = `<tr><td colspan="4" class="muted" style="text-align:center;padding:32px">O agente está verificando ${Store.get('risks').length} controles…</td></tr>`;

  setTimeout(() => {
    const a = Store.get('answers');
    const items = Engine.enriched().map(r => {
      let status, note, residual;
      const weak = WEAK_EVIDENCE[r.id]?.(a);
      if (r.status === 'Implementado' && !weak) {
        status = 'OK'; note = 'Evidências completas nos últimos 3 meses.'; residual = 'Baixo';
      } else if (r.status === 'Implementado' || r.status === 'Parcial') {
        status = 'Evidência insuficiente';
        note = weak ? 'Controle declarado, mas sem registro de teste ou execução periódica.' : 'Controle aplicado só em parte das áreas; faltam registros do último ciclo.';
        residual = r.level === 'Crítico' ? 'Alto' : 'Médio';
      } else {
        status = 'Falha'; note = 'Controle ainda não implementado.'; residual = r.level;
      }
      return { id: r.id, control: r.control, risk: r.risk, status, note, residual };
    });
    const result = { at: new Date().toISOString(), items };
    Store.set('audit', result);
    btn.disabled = false; btn.textContent = '▶ Executar novamente';
    show(result);
    toast('Pré-auditoria concluída.');
  }, 1200);
}

function show(res) {
  $('#summary').hidden = false;
  $('#sOk').textContent = res.items.filter(i => i.status === 'OK').length;
  $('#sIns').textContent = res.items.filter(i => i.status === 'Evidência insuficiente').length;
  $('#sFail').textContent = res.items.filter(i => i.status === 'Falha').length;
  $('#rows').innerHTML = res.items.map(i => `
    <tr><td><strong>${esc(i.control)}</strong><div class="small muted">${i.id} · ${esc(i.risk)}</div></td>
    <td>${badge(i.status)}</td><td class="desc">${esc(i.note)}</td><td>${badge(i.residual, RESIDUAL_CLASS[i.residual])}</td></tr>`).join('');
  $('#lastRun').textContent = `Última execução: ${new Date(res.at).toLocaleString('pt-BR')}. Os resultados alimentam o Dashboard na próxima revisão do registro.`;
}
