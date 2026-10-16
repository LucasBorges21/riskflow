/* ==========================================================
   Questionário de Mapeamento — 52 perguntas em 6 blocos
   As perguntas vêm de QUESTIONNAIRE (assets/js/data.js).
   As respostas são salvas automaticamente no navegador.
   ========================================================== */

const STEPS = [{ id: 'ID', title: 'Identificação' }, ...QUESTIONNAIRE];
const TOTAL = QUESTIONNAIRE.reduce((n, b) => n + b.questions.length, 0);
let answers, step;

function initPage() {
  answers = Store.get('answers') || {};
  answers._respondent = answers._respondent || {};
  step = Store.get('draftStep') ?? 0;

  $('#btnBack').onclick = () => go(step - 1);
  $('#btnNext').onclick = () => (step === STEPS.length - 1 ? finish() : go(step + 1));
  $('#btnSave').onclick = () => { save(); toast('Rascunho salvo neste navegador.'); };
  render();
}

function save() {
  // Ao editar, os dados deixam de ser o exemplo
  Store.set('answers', answers);
  Store.set('draftStep', step);
}

function answered(q) {
  const v = answers[q.id];
  return Array.isArray(v) ? v.length > 0 : v !== undefined && v !== '' && v !== null;
}
const answeredCount = () => QUESTIONNAIRE.flatMap(b => b.questions).filter(answered).length;

function go(n) {
  if (n < 0 || n >= STEPS.length) return;
  step = n; save(); render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function render() {
  // Etapas
  $('#steps').innerHTML = STEPS.map((s, i) => {
    const done = i > 0 && s.questions.every(answered);
    const label = i === 0 ? '1. Identificação' : `${i + 1}. ${s.id} — ${s.title}`;
    return `<button type="button" class="step ${i === step ? 'active' : done ? 'done' : ''}" data-i="${i}">${label}</button>`;
  }).join('');
  $$('#steps .step').forEach(b => b.onclick = () => go(Number(b.dataset.i)));

  // Progresso
  const n = answeredCount();
  $('#progressText').textContent = `${n} de ${TOTAL} respondidas`;
  $('#progressBar').style.width = `${Math.round((n / TOTAL) * 100)}%`;

  // Botões
  $('#btnBack').disabled = step === 0;
  $('#btnNext').textContent = step === STEPS.length - 1 ? 'Gerar Registro de Riscos ✓' : 'Avançar →';

  // Conteúdo
  const card = $('#stepCard');
  if (step === 0) { card.innerHTML = identificationHTML(); bindIdentification(); return; }

  const block = STEPS[step];
  let html = `<h2>Bloco ${block.id} — ${block.title}</h2><p class="sub">${block.lead}</p>`;
  if (block.scale) {
    html += `<div class="scale-legend" style="margin-bottom:12px">${block.scale.map((s, i) => `<div><b>${i + 1}</b> = ${s}</div>`).join('')}</div>`;
  }
  html += block.questions.map(questionHTML).join('');
  card.innerHTML = html;
  bindQuestions(block);
}

function identificationHTML() {
  const r = answers._respondent;
  const f = (id, label, ph, type = 'text') => `
    <div class="field"><label for="${id}">${label}</label>
    <input class="input" id="${id}" type="${type}" placeholder="${ph}" value="${esc(r[id] || '')}"></div>`;
  return `
    <h2>Identificação do respondente</h2>
    <p class="sub">O questionário leva cerca de 25 minutos. Responda pensando na empresa como um todo; perguntas sem resposta conhecida podem ficar em branco.</p>
    <div class="grid g2">
      ${f('nome', 'Nome', 'Seu nome')}
      ${f('cargo', 'Cargo', 'Ex.: Diretor Financeiro')}
      ${f('area', 'Área', 'Ex.: Diretoria, Compliance, TI')}
      ${f('email', 'E-mail', 'nome@empresa.com.br', 'email')}
    </div>
    <div class="alert info" style="margin-top:20px">As respostas são tratadas conforme a LGPD e usadas apenas para gerar o diagnóstico de riscos.</div>`;
}

function bindIdentification() {
  ['nome', 'cargo', 'area', 'email'].forEach(id => {
    $('#' + id).addEventListener('input', e => { answers._respondent[id] = e.target.value; save(); });
  });
}

function questionHTML(q) {
  const v = answers[q.id];
  let body = '';
  if (q.type === 'text' || q.type === 'num') {
    body = `<input class="input" data-q="${q.id}" type="${q.type === 'num' ? 'number' : 'text'}" min="0" placeholder="${q.placeholder || ''}" value="${esc(v ?? '')}">`;
  } else if (q.type === 'one' || q.type === 'many') {
    const kind = q.type === 'one' ? 'radio' : 'checkbox';
    const hint = q.type === 'one' ? 'Marque uma opção' : 'Marque todas que se aplicam';
    body = `<div class="q-hint">${hint}</div><div class="opts">${q.options.map(o => {
      const checked = q.type === 'one' ? v === o : Array.isArray(v) && v.includes(o);
      return `<label class="opt"><input type="${kind}" name="${q.id}" value="${esc(o)}" ${checked ? 'checked' : ''}><span>${esc(o)}</span></label>`;
    }).join('')}</div>`;
  } else if (q.type === 'scale') {
    body = `<div class="scale">${[1, 2, 3, 4, 5].map(n =>
      `<label class="opt"><input type="radio" name="${q.id}" value="${n}" ${Number(v) === n ? 'checked' : ''}><span>${n}</span></label>`).join('')}</div>
      <div class="clause">ISO 31000 · ${q.clause}</div>`;
  }
  return `<div class="q"><div class="q-head"><span class="q-id">${q.id}</span><span class="q-text">${esc(q.text)}</span></div>${body}</div>`;
}

function bindQuestions(block) {
  block.questions.forEach(q => {
    if (q.type === 'text' || q.type === 'num') {
      $(`[data-q="${q.id}"]`).addEventListener('input', e => {
        answers[q.id] = q.type === 'num' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
        save(); updateProgress();
      });
      return;
    }
    $$(`input[name="${q.id}"]`).forEach(inp => inp.addEventListener('change', () => {
      if (q.type === 'many') {
        let vals = $$(`input[name="${q.id}"]:checked`).map(i => i.value);
        // "Nenhum" é exclusivo
        if (inp.value === 'Nenhum' && inp.checked) vals = ['Nenhum'];
        else vals = vals.filter(x => x !== 'Nenhum');
        $$(`input[name="${q.id}"]`).forEach(i => (i.checked = vals.includes(i.value)));
        answers[q.id] = vals;
      } else {
        answers[q.id] = q.type === 'scale' ? Number(inp.value) : inp.value;
      }
      save(); updateProgress();
    }));
  });
}

function updateProgress() {
  const n = answeredCount();
  $('#progressText').textContent = `${n} de ${TOTAL} respondidas`;
  $('#progressBar').style.width = `${Math.round((n / TOTAL) * 100)}%`;
  $$('#steps .step').forEach((b, i) => {
    if (i > 0 && i !== step) b.classList.toggle('done', STEPS[i].questions.every(answered));
  });
}

function finish() {
  const missing = TOTAL - answeredCount();
  if (missing > 0 && !confirm(`Ainda há ${missing} pergunta(s) sem resposta. Perguntas em branco podem deixar riscos de fora do registro. Deseja gerar o Registro de Riscos mesmo assim?`)) return;

  answers._completed = true;
  answers._completedAt = new Date().toISOString();
  Store.set('answers', answers);
  Store.set('risks', Engine.buildRisks(answers));
  Store.remove('sample');
  Store.remove('draftStep');
  Store.remove('audit');

  const hist = Store.get('history') || [];
  const label = new Date().toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  hist.push({ label: label.charAt(0).toUpperCase() + label.slice(1), value: Engine.maturity(answers) });
  Store.set('history', hist.slice(-6));

  location.href = 'registro.html?novo=1';
}
