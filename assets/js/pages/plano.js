/* Plano de Tratamento — ações, prioridades, responsáveis e prazos */

const PRIORITY = { 'Crítico': 'Crítica', 'Alto': 'Alta', 'Médio': 'Média', 'Baixo': 'Baixa' };
const PRIO_CLASS = { 'Crítica': 'b-crit', 'Alta': 'b-red', 'Média': 'b-amber', 'Baixa': 'b-blue' };

function initPage() {
  if (!hasRisks()) { emptyState('#page'); return; }
  $('#filterStatus').onchange = render;
  $('#btnExport').onclick = exportRisksCSV;
  render();
}

function render() {
  const today = new Date().toISOString().slice(0, 10);
  const all = Engine.enriched();
  const f = $('#filterStatus').value;
  const list = all.filter(r => !f || r.actionStatus === f);

  const done = all.filter(r => r.actionStatus === 'Concluído').length;
  $('#kTotal').textContent = all.length;
  $('#kDone').textContent = done;
  $('#kDonePct').textContent = `${Math.round((done / all.length) * 100)}% do plano`;
  $('#kDoing').textContent = all.filter(r => r.actionStatus === 'Em andamento').length;
  $('#kLate').textContent = all.filter(r => r.actionStatus !== 'Concluído' && r.due && r.due < today).length;

  $('#rows').innerHTML = list.map(r => {
    const prio = PRIORITY[r.level];
    const late = r.actionStatus !== 'Concluído' && r.due < today;
    return `<tr data-id="${r.id}">
      <td><strong>${esc(r.action)}</strong><div class="small muted">${r.id} · ${esc(r.risk)}</div></td>
      <td>${badge(prio, PRIO_CLASS[prio])}</td>
      <td><input data-f="owner" value="${esc(r.owner)}" style="width:170px"></td>
      <td><input data-f="due" type="date" value="${r.due}" ${late ? 'style="border-color:var(--red);color:var(--red)"' : ''}></td>
      <td><select data-f="actionStatus">${['Não iniciado', 'Em andamento', 'Concluído'].map(s => `<option ${s === r.actionStatus ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
    </tr>`;
  }).join('');

  $$('#rows [data-f]').forEach(el => el.addEventListener('change', e => {
    const id = e.target.closest('tr').dataset.id;
    const patch = { [e.target.dataset.f]: e.target.value };
    // Ação concluída => controle passa a "Implementado"
    if (patch.actionStatus === 'Concluído') patch.status = 'Implementado';
    if (patch.actionStatus === 'Em andamento') patch.status = 'Parcial';
    Store.set('risks', Store.get('risks').map(r => (r.id === id ? { ...r, ...patch } : r)));
    render();
  }));
}
