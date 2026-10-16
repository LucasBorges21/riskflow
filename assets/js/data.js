/* ==========================================================
   RiskFlow — Dados do questionário, regras e exemplo
   Fonte: "Questionário de Mapeamento — RiskFlow v0.1"
   Para alterar perguntas, edite o array QUESTIONNAIRE.
   Para alterar riscos gerados, edite o array RULES.
   ========================================================== */

const QUESTIONNAIRE = [
  {
    id: 'A', title: 'Perfil da empresa',
    lead: 'Informações gerais sobre a empresa e seus objetivos (contexto — ISO 31000, 6.3).',
    questions: [
      { id: 'A1', text: 'Qual o nome da empresa?', type: 'text', placeholder: 'Ex.: Nexora Tecnologia S.A.' },
      { id: 'A2', text: 'Qual o principal setor de atuação?', type: 'one', options: ['Tecnologia/SaaS', 'Serviços', 'Indústria', 'Varejo', 'Financeiro', 'Saúde', 'Energia', 'Outro'] },
      { id: 'A3', text: 'Quantos funcionários a empresa tem?', type: 'num', placeholder: 'Ex.: 350' },
      { id: 'A4', text: 'Qual a faixa de faturamento anual?', type: 'one', options: ['Até R$ 4,8 milhões', 'De R$ 4,8 a 30 milhões', 'De R$ 30 a 300 milhões', 'Acima de R$ 300 milhões'] },
      { id: 'A5', text: 'Quanto a receita cresceu nos últimos 12 meses?', type: 'one', options: ['Menos de 10%', 'De 10% a 30%', 'De 30% a 50%', 'Mais de 50%'] },
      { id: 'A6', text: 'Em quantas unidades ou cidades a empresa opera?', type: 'num', placeholder: 'Ex.: 3' },
      { id: 'A7', text: 'Qual a estrutura de capital?', type: 'one', options: ['Fechado, sem investidores', 'Com investidores (VC/PE)', 'Planeja IPO em até 24 meses', 'Capital aberto'] },
      { id: 'A8', text: 'Quais os objetivos estratégicos para os próximos 24 meses?', type: 'many', options: ['Expansão geográfica', 'Novos produtos', 'Captação de recursos', 'IPO', 'Fusão ou aquisição', 'Internacionalização', 'Eficiência e redução de custos'] },
    ],
  },
  {
    id: 'B', title: 'Estrutura, processos e pessoas',
    lead: 'Como a empresa está organizada e como seus processos funcionam.',
    questions: [
      { id: 'B1', text: 'Quais departamentos existem?', type: 'many', options: ['Financeiro', 'Contabilidade', 'Recursos Humanos', 'Tecnologia da Informação', 'Segurança da Informação', 'Comercial', 'Jurídico e Compliance', 'Operações', 'Outro'] },
      { id: 'B2', text: 'Quem cuida de riscos e compliance hoje?', type: 'one', options: ['Ninguém', 'Alguém acumula a função', 'Área dedicada'] },
      { id: 'B3', text: 'Os processos críticos estão documentados?', type: 'one', options: ['Nenhum', 'Alguns', 'A maioria', 'Todos'] },
      { id: 'B4', text: 'Quem aprova um pagamento é diferente de quem o executa?', type: 'one', options: ['Sim', 'Parcialmente', 'Não'] },
      { id: 'B5', text: 'Qual a rotatividade anual de funcionários?', type: 'one', options: ['Menos de 10%', 'De 10% a 20%', 'Mais de 20%'] },
      { id: 'B6', text: 'Existe processo importante que só uma pessoa sabe executar?', type: 'one', options: ['Sim', 'Não'] },
      { id: 'B7', text: 'Planilhas são usadas em processos críticos (fechamento, folha, precificação)?', type: 'one', options: ['Sim', 'Não'] },
      { id: 'B8', text: 'Quais instrumentos de integridade existem?', type: 'many', options: ['Código de conduta', 'Canal de denúncia', 'Treinamento periódico', 'Nenhum'] },
      { id: 'B9', text: 'Existe plano de continuidade de negócios?', type: 'one', options: ['Sim, testado', 'Sim, não testado', 'Em elaboração', 'Não'] },
    ],
  },
  {
    id: 'C', title: 'Tecnologia, dados e segurança',
    lead: 'Sistemas, dados pessoais e práticas de segurança da informação.',
    questions: [
      { id: 'C1', text: 'Quais sistemas a empresa usa?', type: 'many', options: ['ERP', 'CRM', 'Google Workspace ou Microsoft 365', 'GitHub ou GitLab', 'Jira', 'Folha de pagamento', 'BI', 'Outro'] },
      { id: 'C2', text: 'Onde a infraestrutura está hospedada?', type: 'one', options: ['Própria (on-premise)', 'Nuvem', 'Híbrida'] },
      { id: 'C3', text: 'A empresa trata dados pessoais?', type: 'one', options: ['Não', 'Só de colaboradores', 'De clientes também', 'Inclui dados sensíveis (saúde, biometria etc.)'] },
      { id: 'C4', text: 'O que existe para a LGPD?', type: 'many', options: ['Encarregado de dados (DPO)', 'Inventário de dados pessoais', 'Política de privacidade', 'Nenhum'] },
      { id: 'C5', text: 'A autenticação em dois fatores (MFA) está ativa nos sistemas críticos?', type: 'one', options: ['Em todos', 'Em parte', 'Não'] },
      { id: 'C6', text: 'Com que frequência os acessos de usuários são revisados?', type: 'one', options: ['Nunca', 'Anualmente', 'Semestralmente ou mais'] },
      { id: 'C7', text: 'Como são os backups?', type: 'one', options: ['Não há backup', 'Existem, sem teste de restauração', 'Existem e são testados'] },
      { id: 'C8', text: 'Como são tratadas vulnerabilidades e atualizações?', type: 'one', options: ['Não há processo', 'Pontualmente', 'Processo contínuo'] },
      { id: 'C9', text: 'Existe plano de resposta a incidentes de segurança?', type: 'one', options: ['Sim', 'Não'] },
      { id: 'C10', text: 'Houve incidente de segurança nos últimos 24 meses?', type: 'one', options: ['Sim', 'Não'] },
      { id: 'C11', text: 'A empresa desenvolve software entregue a clientes?', type: 'one', options: ['Sim', 'Não'] },
    ],
  },
  {
    id: 'D', title: 'Regulatório, financeiro e terceiros',
    lead: 'Obrigações regulatórias, saúde financeira e dependência de fornecedores.',
    questions: [
      { id: 'D1', text: 'A empresa responde a algum órgão regulador?', type: 'many', options: ['BACEN', 'CVM', 'ANPD', 'ANATEL', 'ANS ou ANVISA', 'Outro', 'Nenhum'] },
      { id: 'D2', text: 'As demonstrações financeiras são auditadas externamente?', type: 'one', options: ['Não', 'Pontualmente', 'Anualmente'] },
      { id: 'D3', text: 'Há processos judiciais relevantes em andamento?', type: 'many', options: ['Trabalhistas', 'Tributários', 'Cíveis', 'Nenhum'] },
      { id: 'D4', text: 'Quanto o maior cliente representa da receita?', type: 'one', options: ['Menos de 10%', 'De 10% a 20%', 'Mais de 20%'] },
      { id: 'D5', text: 'Por quantos meses o caixa cobre as despesas sem nova receita?', type: 'one', options: ['Menos de 3 meses', 'De 3 a 6 meses', 'De 6 a 12 meses', 'Mais de 12 meses'] },
      { id: 'D6', text: 'A empresa tem dívidas relevantes (acima de 20% do faturamento)?', type: 'one', options: ['Sim', 'Não'] },
      { id: 'D7', text: 'Qual parte das receitas ou custos está em moeda estrangeira?', type: 'one', options: ['Nenhuma', 'Menos de 20%', '20% ou mais'] },
      { id: 'D8', text: 'Existe fornecedor crítico sem alternativa imediata?', type: 'one', options: ['Sim', 'Não'] },
      { id: 'D9', text: 'Os contratos com fornecedores críticos têm cláusulas de SLA, segurança e LGPD?', type: 'one', options: ['Todos', 'Alguns', 'Nenhum'] },
      { id: 'D10', text: 'A empresa recebeu multa ou notificação de órgão regulador nos últimos 3 anos?', type: 'one', options: ['Sim', 'Não'] },
    ],
  },
  {
    id: 'E', title: 'Maturidade em gestão de riscos',
    lead: 'Dê uma nota de 1 a 5 para cada afirmação. As notas formam o índice de maturidade.',
    scale: ['Não existe', 'Informal, depende de pessoas', 'Definido, mas aplicado só em parte', 'Aplicado e acompanhado', 'Aplicado, medido e melhorado'],
    questions: [
      { id: 'E1', text: 'A alta direção patrocina a gestão de riscos e cobra resultados.', type: 'scale', clause: '5.2 Liderança e comprometimento' },
      { id: 'E2', text: 'Riscos são considerados nas decisões de negócio (orçamento, projetos, contratações).', type: 'scale', clause: '5.3 Integração' },
      { id: 'E3', text: 'Existe política de riscos com papéis e responsabilidades definidos.', type: 'scale', clause: '5.4 Concepção' },
      { id: 'E4', text: 'Há pessoas, tempo e ferramentas dedicados a gerir riscos.', type: 'scale', clause: '5.4.4 Recursos' },
      { id: 'E5', text: 'Riscos são comunicados e discutidos entre as áreas.', type: 'scale', clause: '6.2 Comunicação e consulta' },
      { id: 'E6', text: 'Existem critérios definidos de probabilidade, impacto e apetite a risco.', type: 'scale', clause: '6.3 Escopo, contexto e critérios' },
      { id: 'E7', text: 'Os riscos são identificados de forma estruturada e periódica.', type: 'scale', clause: '6.4.2 Identificação' },
      { id: 'E8', text: 'Os riscos são analisados e priorizados com método consistente.', type: 'scale', clause: '6.4.3–6.4.4 Análise e avaliação' },
      { id: 'E9', text: 'Riscos prioritários têm plano de ação com responsável e prazo.', type: 'scale', clause: '6.5 Tratamento' },
      { id: 'E10', text: 'Riscos e ações são monitorados, registrados e revisados periodicamente.', type: 'scale', clause: '6.6–6.7 Monitoramento e registro' },
    ],
  },
  {
    id: 'F', title: 'Critérios e apetite a risco',
    lead: 'Estas respostas ajustam a matriz de probabilidade × impacto à realidade da empresa.',
    questions: [
      { id: 'F1', text: 'A partir de qual perda financeira o impacto seria grave para a empresa?', type: 'one', options: ['0,5% do faturamento', '1% do faturamento', '2% do faturamento', '5% ou mais do faturamento'] },
      { id: 'F2', text: 'Quanto tempo um sistema crítico pode ficar parado sem causar dano grave?', type: 'one', options: ['Menos de 4 horas', '1 dia', '3 dias', '1 semana'] },
      { id: 'F3', text: 'Qual o perfil da empresa diante de riscos?', type: 'one', options: ['Conservador', 'Moderado', 'Arrojado'] },
      { id: 'F4', text: 'Em quais temas a tolerância a risco é zero?', type: 'many', options: ['Legal e regulatório', 'Segurança de dados', 'Reputação', 'Saúde e segurança das pessoas'] },
    ],
  },
];

/* ----------------------------------------------------------
   Regras R-01 a R-19: quando "when(a)" é verdadeiro, o risco
   entra no Registro com P e I iniciais (1 a 5).
   a = respostas; has(a,id,valor) verifica múltipla escolha.
   ---------------------------------------------------------- */
const has = (a, id, v) => Array.isArray(a[id]) && a[id].includes(v);
const is = (a, id, ...vs) => vs.includes(a[id]);

const RULES = [
  { id: 'R-01', from: 'A5', cat: 'Estratégico', p: 4, i: 3, owner: 'Diretoria',
    risk: 'Controles e estrutura não acompanham o crescimento',
    control: 'Revisão semestral de estrutura, alçadas e controles', freq: 'Semestral',
    action: 'Mapear alçadas e controles-chave frente ao novo porte',
    when: a => is(a, 'A5', 'De 30% a 50%', 'Mais de 50%') },
  { id: 'R-02', from: 'A6', cat: 'Operacional', p: 3, i: 3, owner: 'Operações',
    risk: 'Falta de padronização de processos entre unidades',
    control: 'Procedimentos corporativos únicos aplicados em todas as unidades', freq: 'Contínua',
    action: 'Padronizar procedimentos críticos entre as unidades',
    when: a => Number(a.A6) > 1 },
  { id: 'R-03', from: 'B5, B6', cat: 'Operacional', p: 3, i: 4, owner: 'Recursos Humanos',
    risk: 'Perda de conhecimento pela saída de pessoas-chave',
    control: 'Plano de sucessão e documentação de processos críticos', freq: 'Anual',
    action: 'Definir backups de função e plano de sucessão',
    when: a => is(a, 'B5', 'Mais de 20%') || is(a, 'B6', 'Sim') },
  { id: 'R-04', from: 'B3', cat: 'Operacional', p: 4, i: 3, owner: 'Operações',
    risk: 'Falhas operacionais por processos críticos não documentados',
    control: 'Procedimentos operacionais padrão (POP) aprovados', freq: 'Contínua',
    action: 'Documentar os 10 processos mais críticos',
    when: a => is(a, 'B3', 'Nenhum', 'Alguns') },
  { id: 'R-05', from: 'B4', cat: 'Financeiro', p: 3, i: 4, owner: 'Financeiro',
    risk: 'Fraude ou erro em pagamentos por falta de segregação de funções',
    control: 'Aprovação dupla obrigatória em pagamentos acima de R$ 10 mil', freq: 'Contínua',
    action: 'Formalizar política de segregação de funções',
    when: a => is(a, 'B4', 'Parcialmente', 'Não') },
  { id: 'R-06', from: 'C3, C4, D9', cat: 'Regulatório', p: 3, i: 5, owner: 'Jurídico e Compliance',
    risk: 'Não conformidade com a LGPD e vazamento de dados pessoais',
    control: 'Encarregado (DPO) nomeado e inventário de dados pessoais', freq: 'Contínua',
    action: 'Nomear DPO e concluir inventário de dados pessoais',
    when: a => !is(a, 'C3', 'Não', undefined) && (!has(a, 'C4', 'Encarregado de dados (DPO)') || !has(a, 'C4', 'Inventário de dados pessoais') || is(a, 'D9', 'Alguns', 'Nenhum')) },
  { id: 'R-07', from: 'B9, C7', cat: 'Tecnológico', p: 3, i: 5, owner: 'Tecnologia da Informação',
    risk: 'Interrupção prolongada sem recuperação de dados ou serviços',
    control: 'Backups testados e plano de continuidade de negócios', freq: 'Trimestral',
    action: 'Testar restauração de backup e aprovar plano de continuidade',
    when: a => !is(a, 'B9', 'Sim, testado') || !is(a, 'C7', 'Existem e são testados') },
  { id: 'R-08', from: 'C5, C6', cat: 'Tecnológico', p: 4, i: 4, owner: 'Segurança da Informação',
    risk: 'Acesso indevido a sistemas e informações',
    control: 'MFA em sistemas críticos e revisão trimestral de acessos', freq: 'Trimestral',
    action: 'Ativar MFA e automatizar revisão trimestral de acessos',
    when: a => is(a, 'C5', 'Em parte', 'Não') || is(a, 'C6', 'Nunca', 'Anualmente') },
  { id: 'R-09', from: 'C8, C9, C10', cat: 'Tecnológico', p: 3, i: 5, owner: 'Segurança da Informação',
    risk: 'Ataque cibernético (ex.: ransomware)',
    control: 'Gestão contínua de vulnerabilidades e plano de resposta a incidentes', freq: 'Contínua',
    action: 'Implantar gestão de vulnerabilidades e plano de resposta a incidentes',
    when: a => !is(a, 'C8', 'Processo contínuo') || is(a, 'C9', 'Não') || is(a, 'C10', 'Sim') },
  { id: 'R-10', from: 'C2, D8, D9', cat: 'Operacional', p: 3, i: 4, owner: 'Operações',
    risk: 'Falha ou dependência de fornecedor crítico',
    control: 'Contratos com SLA e plano de contingência para fornecedores críticos', freq: 'Anual',
    action: 'Revisar contratos críticos e definir fornecedor alternativo',
    when: a => is(a, 'D8', 'Sim') || is(a, 'D9', 'Alguns', 'Nenhum') },
  { id: 'R-11', from: 'D4', cat: 'Financeiro', p: 3, i: 4, owner: 'Comercial',
    risk: 'Perda de receita por concentração em poucos clientes',
    control: 'Meta de diversificação da carteira acompanhada mensalmente', freq: 'Mensal',
    action: 'Definir plano de diversificação de clientes',
    when: a => is(a, 'D4', 'Mais de 20%') },
  { id: 'R-12', from: 'D5, D6', cat: 'Financeiro', p: 3, i: 5, owner: 'Financeiro',
    risk: 'Falta de liquidez para honrar compromissos',
    control: 'Fluxo de caixa projetado de 12 meses revisado mensalmente', freq: 'Mensal',
    action: 'Implantar projeção de caixa e política de reserva mínima',
    when: a => is(a, 'D5', 'Menos de 3 meses', 'De 3 a 6 meses') || is(a, 'D6', 'Sim') },
  { id: 'R-13', from: 'A7, D2', cat: 'Financeiro', p: 3, i: 4, owner: 'Contabilidade',
    risk: 'Erros relevantes nas demonstrações financeiras',
    control: 'Checklist de fechamento com aprovação do controller e auditoria anual', freq: 'Mensal',
    action: 'Padronizar checklist de fechamento mensal',
    when: a => is(a, 'D2', 'Não', 'Pontualmente') || is(a, 'A7', 'Planeja IPO em até 24 meses', 'Capital aberto') },
  { id: 'R-14', from: 'D3', cat: 'Legal', p: 3, i: 3, owner: 'Jurídico e Compliance',
    risk: 'Perdas com processos judiciais',
    control: 'Acompanhamento trimestral de contingências com provisão', freq: 'Trimestral',
    action: 'Criar relatório trimestral de contingências judiciais',
    when: a => Array.isArray(a.D3) && a.D3.some(v => v !== 'Nenhum') },
  { id: 'R-15', from: 'A2, D1, D10', cat: 'Regulatório', p: 3, i: 4, owner: 'Jurídico e Compliance',
    risk: 'Descumprimento de norma do regulador do setor',
    control: 'Matriz de obrigações regulatórias com responsáveis', freq: 'Trimestral',
    action: 'Montar matriz de obrigações regulatórias',
    when: a => is(a, 'A2', 'Financeiro', 'Saúde', 'Energia') || (Array.isArray(a.D1) && a.D1.some(v => v !== 'Nenhum')) || is(a, 'D10', 'Sim') },
  { id: 'R-16', from: 'B8', cat: 'Reputacional', p: 2, i: 4, owner: 'Jurídico e Compliance',
    risk: 'Desvios de conduta e dano à reputação',
    control: 'Código de conduta e canal de denúncia independente', freq: 'Contínua',
    action: 'Publicar código de conduta e canal de denúncia',
    when: a => !has(a, 'B8', 'Canal de denúncia') || !has(a, 'B8', 'Código de conduta') },
  { id: 'R-17', from: 'D7', cat: 'Financeiro', p: 3, i: 3, owner: 'Financeiro',
    risk: 'Perdas por variação cambial',
    control: 'Política de hedge cambial', freq: 'Mensal',
    action: 'Avaliar política de proteção cambial',
    when: a => is(a, 'D7', '20% ou mais') },
  { id: 'R-18', from: 'B7', cat: 'Operacional', p: 4, i: 3, owner: 'Financeiro',
    risk: 'Erro em informações críticas mantidas em planilhas',
    control: 'Planilhas críticas com versão, proteção e dupla checagem', freq: 'Mensal',
    action: 'Inventariar planilhas críticas e aplicar dupla checagem',
    when: a => is(a, 'B7', 'Sim') },
  { id: 'R-19', from: 'C11', cat: 'Operacional', p: 3, i: 4, owner: 'Tecnologia da Informação',
    risk: 'Falha no software entregue ao cliente (qualidade, SLA)',
    control: 'Testes automatizados e revisão de código antes de cada release', freq: 'Contínua',
    action: 'Definir esteira de testes e monitoramento de SLA',
    when: a => is(a, 'C11', 'Sim') },
];

/* Categorias afetadas por "tolerância zero" (F4) */
const F4_MAP = {
  'Legal e regulatório': ['Regulatório', 'Legal'],
  'Segurança de dados': ['Tecnológico'],
  'Reputação': ['Reputacional'],
  'Saúde e segurança das pessoas': [],
};

/* Corte de "crítico" conforme apetite (F3) */
const CRITICAL_CUT = { 'Conservador': 12, 'Moderado': 15, 'Arrojado': 20 };

/* Respostas de exemplo — Nexora Tecnologia (Termo de Abertura v0.3) */
const SAMPLE_ANSWERS = {
  A1: 'Nexora Tecnologia S.A.', A2: 'Tecnologia/SaaS', A3: 350, A4: 'De R$ 30 a 300 milhões', A5: 'De 30% a 50%', A6: 3,
  A7: 'Com investidores (VC/PE)', A8: ['Expansão geográfica', 'Novos produtos', 'Captação de recursos'],
  B1: ['Financeiro', 'Contabilidade', 'Recursos Humanos', 'Tecnologia da Informação', 'Segurança da Informação', 'Comercial', 'Jurídico e Compliance', 'Operações'],
  B2: 'Alguém acumula a função', B3: 'Alguns', B4: 'Parcialmente', B5: 'De 10% a 20%', B6: 'Sim', B7: 'Sim',
  B8: ['Código de conduta'], B9: 'Não',
  C1: ['ERP', 'CRM', 'Google Workspace ou Microsoft 365', 'GitHub ou GitLab', 'Jira'], C2: 'Nuvem', C3: 'De clientes também',
  C4: ['Política de privacidade'], C5: 'Em parte', C6: 'Anualmente', C7: 'Existem, sem teste de restauração',
  C8: 'Pontualmente', C9: 'Não', C10: 'Não', C11: 'Sim',
  D1: ['ANPD'], D2: 'Anualmente', D3: ['Trabalhistas'], D4: 'De 10% a 20%', D5: 'De 6 a 12 meses', D6: 'Não',
  D7: 'Nenhuma', D8: 'Sim', D9: 'Alguns', D10: 'Não',
  E1: 3, E2: 2, E3: 2, E4: 2, E5: 3, E6: 1, E7: 2, E8: 2, E9: 2, E10: 2,
  F1: '1% do faturamento', F2: '1 dia', F3: 'Moderado', F4: ['Legal e regulatório', 'Segurança de dados'],
  _respondent: { nome: 'Matheus Geraldi', cargo: 'Diretoria', area: 'Diretoria', email: 'matheus@nexora.com.br' },
  _completed: true,
};

const SAMPLE_USERS = [
  { nome: 'Matheus Geraldi', email: 'matheus@nexora.com.br', perfil: 'Administrador', status: 'Ativo' },
  { nome: 'Lucas Borges', email: 'lucas@nexora.com.br', perfil: 'Edição', status: 'Ativo' },
  { nome: 'Leandro Riccieli', email: 'leandro@nexora.com.br', perfil: 'Edição', status: 'Ativo' },
  { nome: 'Thiago Felix', email: 'thiago@nexora.com.br', perfil: 'Leitura', status: 'Pendente' },
  { nome: 'Ana Ribeiro (Auditoria Externa)', email: 'ana.ribeiro@auditorxp.com', perfil: 'Leitura', status: 'Ativo' },
  { nome: 'Carlos Nogueira (TI)', email: 'carlos@nexora.com.br', perfil: 'Edição', status: 'Ativo' },
];

/* Situação de exemplo dos controles e ações (só para o exemplo da Nexora) */
const SAMPLE_STATUS = {
  'R-05': ['Parcial', 'Em andamento'], 'R-08': ['Parcial', 'Em andamento'], 'R-13': ['Implementado', 'Concluído'],
  'R-16': ['Parcial', 'Em andamento'], 'R-19': ['Implementado', 'Concluído'], 'R-10': ['Implementado', 'Concluído'],
  'R-02': ['Parcial', 'Não iniciado'], 'R-14': ['Implementado', 'Concluído'],
};
