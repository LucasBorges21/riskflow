# RiskFlow — Protótipo navegável (MVP)

Protótipo do RiskFlow, plataforma de gestão de riscos corporativos alinhada à **ABNT NBR ISO 31000:2018**.
Projeto acadêmico: Lucas Borges Corado, Leandro Riccieli Tirabassi de Oliveira, Matheus Geraldi da Silva e Thiago Felix.

Site estático (HTML, CSS e JavaScript puros). Não precisa de build nem de servidor.

## Páginas

| Arquivo | Tela | Etapa do Desenho da Solução |
| --- | --- | --- |
| `index.html` | Login | — |
| `cadastro.html` | Criar conta | — |
| `dashboard.html` | Dashboard consolidado | 5. Relatórios e Dashboard |
| `questionario.html` | Questionário de Mapeamento (52 perguntas, blocos A–F) | 1. Questionário Inicial |
| `registro.html` | Registro de Riscos (gerado pelas regras R-01 a R-19) | 2. Geração do Registro |
| `avaliacao.html` | Avaliação: maturidade, matriz P × I, prioritários | 3. Avaliação de Riscos |
| `plano.html` | Plano de Tratamento: ações, responsáveis e prazos | 4. Plano de Tratamento |
| `relatorios.html` | Relatório executivo (PDF via impressão) e Excel | 5. Relatórios |
| `pre-auditoria.html` | Pré-auditoria dos controles (agente simulado) | 6. Pré-Auditoria |
| `usuarios.html` | Usuários e permissões | — |

## Estrutura

```
assets/
  css/style.css          estilos e cores (variáveis no topo)
  js/data.js             perguntas do questionário, regras de risco e dados de exemplo
  js/app.js              armazenamento, motor de riscos, menu e utilitários
  js/pages/<pagina>.js   lógica de cada tela
```

- **Mudar perguntas:** edite `QUESTIONNAIRE` em `assets/js/data.js`.
- **Mudar riscos gerados:** edite `RULES` no mesmo arquivo (cada regra tem P e I iniciais, controle, ação e condição `when`).
- **Mudar o menu:** edite `NAV` em `assets/js/app.js`.

## Como funciona

1. O questionário salva as respostas no navegador (`localStorage`).
2. Ao concluir, as regras geram o Registro de Riscos com probabilidade (P) e impacto (I).
3. Exposição = P × I. O corte de "Crítico" depende do apetite (F3): Conservador ≥ 12, Moderado ≥ 15, Arrojado ≥ 20.
4. Índice de maturidade = ((soma de E1 a E10) − 10) / 40 × 100.
5. O plano de tratamento sugere prazos: Crítico 30 dias, Alto 60, Médio 90, Baixo 180.

Na primeira visita, o app carrega um **exemplo da Nexora Tecnologia**. Use "Restaurar exemplo" no rodapé do menu para voltar a ele.

> Protótipo: login, convites e agente de pré-auditoria são simulados; os dados ficam só no navegador de quem acessa.

## Publicar no GitHub Pages

1. Crie um repositório e envie todos os arquivos desta pasta (incluindo `.nojekyll`).
2. No GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Escolha a branch `main` e a pasta `/ (root)` e salve.
4. Em 1–2 minutos o site fica em `https://<seu-usuario>.github.io/<nome-do-repositorio>/`.

Para testar localmente, basta abrir `index.html` no navegador.
