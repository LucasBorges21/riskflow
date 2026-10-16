/* Registro de Riscos — lista editável gerada pelas regras R-01 a R-19 */

function initPage() {
  if (!hasRisks()) { emptyState('#page'); return; }
  if (new URLSearchParams(location.search).get('novo')) toast('Registro de Riscos gerado a partir das suas respostas.');

  const cats = [...new Set(Store.get('risks').map(r => r.cat))].sort();
  $('#filterCat').innerHTML += cats.map(c => `<option>${c}</option>`).join('');
  $('#filterCat').onchange = render;
  $('#btnExport').onclick = exportRisksCSV;
  $('#btnAdd').onclick = () => $('#modal').classList.add('open');
  $('#btnCancel').onclick = () => $('#modal').classList.remove('open');
  $('#formAdd').onsubmit = addRisk;
  render();
}

function render() {
  const cat = $('#filterCat').value;
  const list = Engine.enriched().filter(r => !cat || r.cat === cat);
  $('#count').textContent = `${list.length} riscos mapeados`;
  $('#rows').innerHTML = list.map(r => `
    <tr data-id="${r.id}">
      <td class="small muted nowrap">${r.id}</td>
      <td style="min-width:220px"><strong>${esc(r.risk)}</strong><div class="small muted">${r.cat}</div></td>
      <td class="desc">${esc(r.control)}</td>
      <td>${r.freq}</td>
      <td>${esc(r.owner)}</td>
      <td class="num"><input type="number" min="1" max="5" value="${r.p}" data-f="p"></td>
      <td class="num"><input type="number" min="1" max="5" value="${r.i}" data-f="i"></td>
      <td><strong>${r.exp}</strong> ${badge(r.level)}</td>
      <td><select data-f="status">${['Implementado', 'Parcial', 'Pendente'].map(s => `<option ${s === r.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
      <td class="no-print"><button class="link-btn danger" data-del title="Remover">Remover</button></td>
    </tr>`).join('');

  $$('#rows [data-f]').forEach(el => el.addEventListener('change', e => {
    const id = e.target.closest('tr').dataset.id;
    const f = e.target.dataset.f;
    let val = e.target.value;
    if (f !== 'status') val = Math.min(5, Math.max(1, Number(val) || 1));
    update(id, { [f]: val });
  }));
  $$('#rows [data-del]').forEach(b => b.onclick = e => {
    const id = e.target.closest('tr').dataset.id;
    if (confirm('Remover este risco do registro?')) {
      Store.set('risks', Store.get('risks').filter(r => r.id !== id)); render();
    }
  });
}

function update(id, patch) {
  Store.set('risks', Store.get('risks').map(r => (r.id === id ? { ...r, ...patch } : r)));
  render();
}

function addRisk(e) {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const risks = Store.get('risks');
  const n = risks.filter(r => r.id.startsWith('M-')).length + 1;
  const item = {
    id: 'M-' + String(n).padStart(2, '0'), risk: f.risk, cat: f.cat, control: f.control, freq: f.freq,
    owner: f.owner, from: 'Manual', p: Number(f.p), i: Number(f.i), status: 'Pendente',
    action: f.action, actionStatus: 'Não iniciado', created: new Date().toISOString().slice(0, 10),
  };
  item.due = Engine.dueDate(item, Store.get('answers'));
  risks.push(item);
  Store.set('risks', risks);
  e.target.reset();
  $('#modal').classList.remove('open');
  toast('Risco adicionado.');
  render();
}
