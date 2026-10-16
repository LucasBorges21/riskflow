/* Usuários e permissões (salvos no navegador) */

function initPage() {
  $('#btnInvite').onclick = () => openModal();
  $('#btnCancel').onclick = () => $('#modal').classList.remove('open');
  $('#formInvite').onsubmit = saveUser;
  render();
}

function render() {
  const users = Store.get('users') || [];
  $('#count').textContent = `${users.length} usuários com acesso à conta`;
  $('#rows').innerHTML = users.map((u, i) => `
    <tr><td><strong>${esc(u.nome)}</strong></td><td class="desc">${esc(u.email)}</td><td>${badge(u.perfil)}</td>
    <td>${badge(u.status, u.status === 'Pendente' ? 'b-amber' : 'b-green')}</td>
    <td><button class="link-btn" data-edit="${i}">Editar</button><button class="link-btn danger" data-del="${i}">Remover</button></td></tr>`).join('');
  $$('[data-edit]').forEach(b => b.onclick = () => openModal(Number(b.dataset.edit)));
  $$('[data-del]').forEach(b => b.onclick = () => {
    const list = Store.get('users');
    if (list.filter(u => u.perfil === 'Administrador').length === 1 && list[b.dataset.del].perfil === 'Administrador') { toast('A conta precisa de ao menos um administrador.'); return; }
    if (confirm(`Remover ${list[b.dataset.del].nome}?`)) { list.splice(b.dataset.del, 1); Store.set('users', list); render(); }
  });
}

function openModal(idx) {
  const f = $('#formInvite'); f.reset();
  f.idx.value = idx ?? '';
  $('#modalTitle').textContent = idx === undefined ? 'Convidar usuário' : 'Editar usuário';
  if (idx !== undefined) {
    const u = Store.get('users')[idx];
    f.nome.value = u.nome; f.email.value = u.email; f.perfil.value = u.perfil;
  }
  $('#modal').classList.add('open');
}

function saveUser(e) {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const list = Store.get('users') || [];
  if (f.idx === '') {
    list.push({ nome: f.nome, email: f.email, perfil: f.perfil, status: 'Pendente' });
    toast(`Convite enviado para ${f.email} (simulação).`);
  } else {
    Object.assign(list[f.idx], { nome: f.nome, email: f.email, perfil: f.perfil });
  }
  Store.set('users', list);
  $('#modal').classList.remove('open');
  render();
}
