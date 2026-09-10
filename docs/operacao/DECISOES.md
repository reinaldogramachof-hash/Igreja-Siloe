# Registro de decisões (ADR leve)

Uma linha de vida por decisão. Decisões Tipo 1 (ver `CEREBRO-OPERACIONAL.md` §4)
são sempre de Reinaldo, registradas aqui antes ou no momento da execução.

Formato de cada entrada: número, data, decisão, contexto, alternativas
consideradas, quem decidiu, impacto no plano estratégico.

---

## DEC-001 — Papéis dos agentes
- **Data:** 2026-09-08
- **Decisão:** Claude = Arquiteto Sênior; Codex = Dev Sênior (Backend);
  Antigravity = Dev Sênior (Frontend); Reinaldo = Orquestrador Geral + QA
  Validador. Gemma sai do time.
- **Contexto:** transformação do protótipo em produto SaaS exige separar
  arquitetura de implementação e concentrar aceite em Reinaldo.
- **Alternativas:** manter a organização da §9.3.1 do plano (Codex coordena,
  Claude implementa módulos, Antigravity explora experiência, Gemma documenta).
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** substitui a §9.3.1 do `PLANO-ESTRATEGICO-SAAS-2026-09-06.md`.

## DEC-002 — Escopo do Arquiteto
- **Data:** 2026-09-08
- **Decisão:** Claude desenha contratos, modelo de dados e RLS, revisa
  segurança/financeiro/arquitetura e implementa **apenas** fundações
  cross-cutting, com aval prévio de Reinaldo.
- **Alternativas:** Arquiteto só desenha e revisa; ou Arquiteto também é dev líder
  de módulos.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** detalha a frente "Arquitetura, desenvolvimento, testes e
  publicação" do §9.3 do plano.

## DEC-003 — Divisão de trabalho por camada
- **Data:** 2026-09-08
- **Decisão:** divisão fixa — Codex em backend/domínio/dados/integrações/cobrança;
  Antigravity em frontend/UI/PWA/site público.
- **Alternativas:** atribuição de módulos inteiros por ciclo; manter papéis da
  §9.3.1.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** operacionaliza o §9.3.1.

## DEC-004 — Taxonomia de decisões Tipo 1 / Tipo 2
- **Data:** 2026-09-08
- **Decisão:** ver `CEREBRO-OPERACIONAL.md` §4. Na dúvida, trata-se como Tipo 1.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum; complementa a governança do §9.3.

## DEC-005 — Portão automático antes do QA humano
- **Data:** 2026-09-08
- **Decisão:** lint sem erros, typecheck, build, testes e testes de isolamento
  (§8.3 do plano) verdes antes de o QA de Reinaldo começar.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** reforça QUA-01 e os casos de teste do §8.3.

## DEC-006 — Merge para `main`
- **Data:** 2026-09-08
- **Decisão:** só Reinaldo autoriza e executa o merge; `main` protegida; cópia de
  trabalho isolada por tarefa.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum.

## DEC-007 — Revisão de segurança e financeiro
- **Data:** 2026-09-08
- **Decisão:** revisão do Arquiteto **e** de um agente diferente do implementador.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** aplica a regra do §9.3.1 ("quem implementa não deve ser a
  única fonte de validação").

## DEC-008 — Status Report
- **Data:** 2026-09-08
- **Decisão:** arquivo único append-only em `docs/operacao/STATUS-REPORT.md`, uma
  entrada por sessão de agente, template no `CEREBRO-OPERACIONAL.md` §7.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum.

## DEC-009 — Pacotes de deploy
- **Data:** 2026-09-08
- **Decisão:** pacote datado em `docs/operacao/deploys/DEPLOY-AAAA-MM-DD-vX.Y.md`,
  com linha de aprovação expressa de Reinaldo. Sem automação de deploy.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** operacionaliza "documentar publicação e reversão" (A10).

## DEC-010 — Cadência
- **Data:** 2026-09-08
- **Decisão:** ciclos de duas semanas; QA de Reinaldo nos dias 4–5; recalibrar
  prazo após dois ciclos reais.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** confirma o §9.3.2.

## DEC-011 — Fonte de IDs de trabalho
- **Data:** 2026-09-08
- **Decisão:** o backlog do §8.2 do plano estratégico é a fonte de IDs; o Status
  Report referencia esses IDs.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum.

## DEC-012 — Ponteiro em `AGENTS.md`
- **Data:** 2026-09-08
- **Decisão:** `AGENTS.md` passa a apontar para `CEREBRO-OPERACIONAL.md` como
  leitura obrigatória de início de sessão. Aplicado fora do bloco gerado
  `nextjs-agent-rules`.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum.

## DEC-013 — Desvinculação da marca Igreja Siloé
- **Data:** 2026-09-08
- **Decisão:** remover nome, textos e referências visuais da Igreja Siloé do
  código. Primeira tarefa rastreada (TAREFA-001), tipo 1, backlog A9/QUA-01.
- **Contexto:** o projeto será desvinculado para se tornar produto SaaS.
- **Alternativas:** manter a marca até a entrega personalizada da Siloé, conforme
  sequência original do plano (§2.2, §8).
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** contraria a sequência "Siloé primeiro, SaaS depois";
  ver DEC-014.

## DEC-014 — Repositório passa a ser a linha SaaS
- **Data:** 2026-09-08
- **Decisão:** este repositório é a linha de produto SaaS; a Igreja Siloé deixa de
  ser entrega separada e passa a primeiro cliente/tenant. O plano estratégico
  recebe uma revisão **v1.2** registrando a mudança (tarefa à parte).
- **Alternativas:** manter as duas entregas comerciais distintas descritas no
  plano v1.1.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** revisão v1.2 das seções 2.2, 8 e 8.1.

## DEC-015 — Estrutura de código em vertical slice
- **Data:** 2026-09-08
- **Decisão:** `src/modules/<modulo>/` com todas as camadas dentro
  (`domain/`, `services/`, `data/`, `api/`, `ui/`, `types.ts`, `index.ts`,
  `README.md`, `__tests__/`); `src/shared/` para transversal; `app/` só compõe
  rotas. `src/modules/_template/` como modelo replicável. Migração do layout atual
  entra no início da fundação de código (SEC-01/TEN-01), não na TAREFA-001.
- **Alternativas:** camadas por tipo no topo; manter `app/` + `lib/` + `components/`
  agrupando por módulo.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** detalha a arquitetura modular citada no §5.3.

## DEC-016 — POO no domínio, funcional na UI
- **Data:** 2026-09-08
- **Decisão:** POO em `domain/` e `services/` (classes, value objects, injeção por
  construtor, interfaces de repositório); React funcional em `ui/`; utilitários
  como funções puras.
- **Alternativas:** POO em toda a base; abordagem predominantemente funcional.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum.

## DEC-017 — Padrões de Clean Code, mojibake e segurança
- **Data:** 2026-09-08
- **Decisão:** consolidados no `CEREBRO-OPERACIONAL.md` §14 (Clean Code), §16
  (codificação de texto e prevenção de mojibake) e §17 (segurança de dados e
  cibersegurança).
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** complementa as seções 5.4, 6, 7 e 8.3.

## DEC-018 — Sequenciamento da fundação de tooling
- **Data:** 2026-09-08
- **Decisão:** `.editorconfig`, `.gitattributes`, Prettier, verificador de
  mojibake, scanner de segredos e `npm audit` no portão entram junto da fundação
  de código (SEC-01/TEN-01), não antes da TAREFA-001. Nos ciclos iniciais, o risco
  de mojibake é mitigado por verificação manual registrada no Status Report.
- **Alternativas:** TAREFA-000 de tooling antes de tudo; dobrar o tooling dentro
  da TAREFA-001.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum.

## DEC-019 — Estrutura de execução e distribuição
- **Data:** 2026-09-08
- **Decisão:** criada a estrutura operacional em `docs/operacao/` —
  `BACKLOG-OPERACIONAL.md` (board vivo), `agentes/` (briefing por papel),
  `templates/` (ordem de trabalho, PR, README de módulo, modelagem de ameaça),
  `ordens/` (OT versionada por tarefa) e `ciclos/` (plano e retrospecto por
  ciclo). Documentada na §20 do `CEREBRO-OPERACIONAL.md` (v1.1).
- **Contexto:** operacionalizar as seções 7 a 9 e 12 do Cérebro Operacional
  aprovado, dando um fluxo concreto de distribuição de tarefas aos agentes.
- **Alternativas:** usar GitHub Issues/Projects como board em vez de markdown
  versionado no repositório.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum; implementa a governança já aprovada.

## DEC-020 — Roadmap de execução e desvio de sequência
- **Data:** 2026-09-08
- **Decisão:** aprovado o `docs/operacao/ROADMAP-EXECUCAO.md` — fases A a H com
  gates e alocação por ciclo. Inclui um **desvio de sequência**: TEN-01
  (isolamento multi-tenant) é executado **antes** das rotinas MEM-01/CEL-01/
  ROT-01/FIN-01, não depois.
- **Contexto:** situar os agentes e destravar o Ciclo 1. O §8.2 do plano
  permitia rotinas single-tenant para a Siloé com endurecimento posterior; a
  DEC-014 (repo = linha SaaS, Siloé = tenant #1) torna o multi-tenant um
  pré-requisito para evitar retrabalho.
- **Alternativas:** seguir a ordem literal do §8.2, construindo as rotinas antes
  de TEN-01.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** ajusta a ordem de execução das etapas 2 e 4; o escopo das
  entregas permanece o do plano. A revisão v1.2 (PLAN-12) registra isso no
  documento estratégico.

## DEC-021 — MCP `supabase` read-only versionado; projeto-base "Gestão Igreja Pro"
- **Data:** 2026-09-08
- **Decisão:** o arquivo `.mcp.json` na raiz é versionado. Ele declara um único
  servidor MCP `supabase`, HTTP, project-scoped em
  `project_ref=wkovbmrvpzukszmgfctd` (projeto "Gestão Igreja Pro") e
  `read_only=true`. O projeto "Gestão Igreja Pro" é o projeto-base do produto;
  a homologação do OPS-01 roda nele, isolada em um schema `homolog` e removida ao
  fim. Qualquer escrita no Supabase (migração, Edge Function, bucket, policy)
  continua sendo decisão Tipo 1, caso a caso.
- **Contexto:** o conector claude.ai Supabase pré-existente está autenticado em
  outra conta (org `djuzpjjyxvtsqnubwzzc`) e não enxerga o projeto-alvo. O
  servidor `supabase` do `.mcp.json` foi autenticado por Reinaldo via
  `claude /mcp` e validado em sessão nova (sessão 6): leitura OK, usuário
  `supabase_read_only_user`.
- **Alternativas:** manter `.mcp.json` fora do versionamento (`.gitignore` +
  `.mcp.json.example`); criar um projeto Supabase novo e dedicado só para
  homologação.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum no escopo; operacionaliza o acesso de leitura ao
  Supabase para todos os agentes/sessões. A URL não contém segredo
  (`project_ref` é público; autenticação é OAuth fora do repositório).

## DEC-022 — Commit centralizado no Arquiteto
- **Data:** 2026-09-10
- **Decisão:** Codex e Antigravity continuam trabalhando em cópia de trabalho
  isolada por tarefa (branch/worktree), mas **não commitam nem dão push** —
  terminam a tarefa, rodam o portão automático localmente e avisam o Arquiteto.
  O Arquiteto (Claude) passa a ser o **único agente que commita**: valida a
  entrega (revisão + portão automático) e commita, identificando o agente
  responsável na mensagem do commit. Push, merge para `main` e deploy
  continuam exigindo autorização expressa de Reinaldo (nenhuma mudança aí).
- **Contexto:** na sessão de 2026-09-08 (Status Report, sessão 8), Codex
  deixou mudanças de Auth (SEC-01) não commitadas na branch de OPS-01 do
  Arquiteto — sinal de que "cada agente commita e dá push por conta própria"
  gera mistura de escopo. Reinaldo propôs unificar em uma única branch com
  commits controlados; o Arquiteto apontou que o risco real não é revisão e
  sim edição concorrente no mesmo diretório de trabalho, e propôs manter a
  cópia isolada por tarefa mas remover o commit/push da responsabilidade dos
  devs.
- **Alternativas:** manter cada agente commitando na própria branch (situação
  anterior, v1.2); unificar tudo em uma única branch com todos os agentes
  commitando nela diretamente.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum no escopo do produto; atualiza a governança do
  `CEREBRO-OPERACIONAL.md` v1.3 (§2, §3, §6, §8, §10).

## DEC-023 — OPS-01 e SEC-01 seguem em paralelo
- **Data:** 2026-09-10
- **Decisão:** a dependência do quadro (`SEC-01` esperar `OPS-01` **Aceita**)
  é suspensa para este par: `tarefa/SEC-01-auth` segue para revisão em
  paralelo ao fechamento do OPS-01, em vez de ficar parada.
- **Contexto:** o código de Auth já existe (implementado fora de ordem na
  sessão 8) e já passou pelo portão automático do Arquiteto (DEC-022). Manter
  a branch parada só adiaria a revisão sem reduzir risco.
- **Alternativas:** manter a ordem original (SEC-01 só entra em revisão após
  OPS-01 Aceita).
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** revisão de segurança do SEC-01 (Arquiteto + agente
  distinto do implementador, §12/DEC-007) ainda pendente antes do QA — não
  dispensada, só deixa de bloquear no tempo.

## DEC-024 — Tratamento do advisory `public.rls_auto_enable()` e escritas do OPS-01
- **Data:** 2026-09-10
- **Decisão:** revogar `EXECUTE` de `anon`, `authenticated` e `public` na
  função `public.rls_auto_enable()` (em vez de mudar para `SECURITY
  INVOKER`). Codex autorizado a executar as duas escritas pendentes no
  Supabase do projeto-base "Gestão Igreja Pro": deploy da Edge Function
  `homolog-echo` e o `revoke execute` acima.
- **Contexto:** advisory de segurança pré-existente (`get_advisors(security)`),
  registrado desde a sessão 6/`OT-OPS-01`, com a decisão de tratamento em
  aberto. Codex confirmou acesso de escrita ao projeto via terminal.
- **Alternativas:** `SECURITY INVOKER` na função (rejeitada — muda
  comportamento da função sem necessidade clara; revoke é mudança mínima e
  reversível).
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** fecha um item de aceite pendente da `OT-OPS-01`.

## DEC-025 — Landing Page comercial adiantada para o Ciclo 1
- **Data:** 2026-09-10
- **Decisão:** Antigravity começa a construção da Landing Page do produto
  (conteúdo comercial, planos e preços) agora, adiantando o essencial de
  `TAREFA-002` (site comercial do SaaS, originalmente Fase F do roadmap) para
  o Ciclo 1 — sem esperar `TAREFA-001` (desvinculação da marca) nem as fases
  B–E completas.
- **Contexto:** Reinaldo forneceu a primeira definição dos planos comerciais
  (ver `NEG-01` no backlog) e quer a página pronta cedo. Tecnicamente, a
  Landing Page depende de `lib/brand.ts` existir (fundação do Arquiteto,
  escopo já descrito em `TAREFA-001`/`CEREBRO-OPERACIONAL.md` §13) — o
  Arquiteto cria uma versão mínima dele como parte desta OT, sem esperar
  `TAREFA-001` inteira.
- **Alternativas:** manter a sequência original do roadmap (Landing Page só
  na Fase F, depois de TAREFA-001 e do MVP).
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** desvio de sequência análogo ao DEC-020 (TEN-01
  antecipado); `ROADMAP-EXECUCAO.md` e `BACKLOG-OPERACIONAL.md` atualizados
  para registrar. `NEG-01` (preços e níveis) ainda precisa ser fechado por
  Reinaldo antes do conteúdo final da página — ver pendência no Status
  Report.

## DEC-026 — Igreja Siloé sai do repositório; produto volta a ser SaaS puro
- **Data:** 2026-09-10
- **Decisão:** o produto da Igreja Siloé **migrou para outro projeto**. Este
  repositório deixa de carregar qualquer conteúdo/rota específica da Siloé.
  Removidos `app/(site)/page.tsx` (site público da Siloé) e
  `lib/site-content.ts`. `app/(app)/site/page.tsx` (gestão de conteúdo de
  site institucional, feature genérica `PUB-01`, sem dado da Siloé) foi
  mantido.
- **Contexto:** supera a premissa da DEC-013/DEC-014 ("Siloé vira tenant #1
  do SaaS, produto único"). Não há mais tenant Siloé para especificar ou
  homologar neste repositório.
- **Alternativas:** manter a Siloé como tenant #1 conforme DEC-014 (a
  premissa que motivou `PLAN-12` e `SIL-01`).
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:**
  - `PLAN-12` (revisão v1.2 do plano, "Siloé vira tenant") fica **obsoleta**
    — cancelada, não mais redigida/aprovada. `OT-PLAN-12.md` não segue.
  - `SIL-01` (especificar sistema/personalizações da Siloé) fica **obsoleta**
    — cancelada.
  - `SIL-02` (homologar entrega Siloé) e o restante das dependências que
    citavam "Siloé (tenant #1)" no `BACKLOG-OPERACIONAL.md` ficam sem objeto
    — a via "SaaS" de cada dependência passa a ser a única.
  - `TAREFA-001` (desvinculação da marca) muda de escopo: já não é
    "neutralizar strings/assets para não identificar a Siloé", é limpeza de
    dado fictício remanescente (mock-data, holidays) — revisão a fazer numa
    OT futura.
  - Reforça, sem alternativa, que o repositório é a única linha de produto
    (o que a DEC-014 já apontava, agora sem ambiguidade de tenant).

## DEC-027 — Escopo do console do proprietário (ADM-01) expandido e adiantado
- **Data:** 2026-09-10
- **Decisão:** o console exclusivo do proprietário (`ADM-01` no backlog)
  passa a cobrir, explicitamente: gestão completa de vendas, controle de
  licenças, gestão de clientes (tenants) e gestão de módulos contratados por
  cliente — além do MFA já previsto. Entra na conversa de priorização do
  Ciclo 1/2, ao lado da Landing Page, em vez de esperar a Fase F inteira.
- **Contexto:** Reinaldo definiu que, com a Landing Page, o produto também
  precisa do lado operacional/comercial (o dono vender, controlar licença e
  cliente) cedo — não só a vitrine.
- **Alternativas:** manter `ADM-01` como estava, dependente de `TEN-01`
  (isolamento multi-tenant) e só entrando na Fase F do roadmap.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** `BACKLOG-OPERACIONAL.md` (descrição de `ADM-01`
  ampliada) e `ROADMAP-EXECUCAO.md` (prioridade a recalibrar) atualizados.
  **Ainda em aberto:** se o console entra antes ou depois de `TEN-01`/`SEC-01`
  fecharem — dependência técnica real (licença e cliente pressupõem alguma
  noção de tenant/organização) a decidir com Reinaldo antes de abrir a OT.

## DEC-028 — Sequência do ADM-01 expandido: mantém dependência de TEN-01
- **Data:** 2026-09-10
- **Decisão:** Reinaldo delegou ao Arquiteto a definição da sequência
  ("conforme melhor definição para o projeto"). Decisão: `ADM-01` **continua
  dependendo de `TEN-01`** — não pula a fila. Em vez disso, o **kickoff do
  `ADM-01`** (especificação e modelo de dados) entra junto da Fase D, em
  paralelo ao desenho do `TEN-01`, para que o modelo de organização/tenant já
  nasça contemplando cliente, licença e módulo contratado. A conclusão de
  `ADM-01` (telas, fluxos, MFA) permanece na Fase F.
- **Contexto:** "cliente" no sentido comercial (quem compra licença) e
  "tenant" no sentido técnico (organização isolada por RLS) são, na prática,
  a mesma entidade neste produto. Especificar `ADM-01` antes de `TEN-01`
  existir arriscaria desenhar esse modelo duas vezes — exatamente o
  retrabalho que a DEC-020 (TEN-01 antes das rotinas) já evitou para
  MEM-01/CEL-01/ROT-01/FIN-01. Tratar os dois em paralelo na especificação
  (sem esperar TEN-01 pronto para começar a pensar em ADM-01) equilibra
  urgência comercial com risco técnico.
- **Alternativas:** implementar ADM-01 completo antes de TEN-01 (modelo de
  tenant improvisado, risco de retrabalho); esperar ADM-01 inteiro para a
  Fase F sem paralelizar a especificação (perde tempo de calendário à toa).
- **Quem decidiu:** Arquiteto, dentro da delegação de Reinaldo nesta sessão.
- **Impacto no plano:** `ROADMAP-EXECUCAO.md` Fase D atualizada (kickoff do
  ADM-01 em paralelo ao desenho do TEN-01); Fase F mantém a conclusão.

## DEC-029 — Preço do Modelo de Entrada vitalício
- **Data:** 2026-09-10
- **Decisão:** preço do "Modelo de Entrada" (LocalStorage, pagamento único,
  licença vitalícia) fixado em **R$ 399,90**. Aplicado em `lib/plans.ts`
  (branch `tarefa/TAREFA-002-landing`, commit `81ec3fd`).
- **Contexto:** parte de `NEG-01`. Essencial e Premium (Gestão Online) ainda
  não têm preço — Antigravity está pesquisando preço de concorrentes para
  embasar (`ordens/OT-NEG-01-PESQUISA.md`) antes de Reinaldo fechar esses
  dois valores.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum além do conteúdo da Landing Page.

## DEC-030 — Gateway de pagamento: Mercado Pago
- **Data:** 2026-09-10
- **Decisão:** `FAT-01` (assinaturas, cobrança, webhooks) é desenhado em
  cima da API do Mercado Pago.
- **Contexto:** resposta à pergunta 1 de `ADM-01-ESTRUTURA-PROPOSTA.md`.
  Define o formato de referência externa em `licenses` e o contrato do
  webhook a especificar na OT do `FAT-01`.
- **Alternativas:** Stripe, Pagar.me — não escolhidas.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** direciona a implementação futura do `FAT-01`.

## DEC-031 — Todo plano gera licença rastreada, inclusive o Modelo de Entrada
- **Data:** 2026-09-10
- **Decisão:** o Modelo de Entrada (vitalício) também gera um registro em
  `licenses` — não é venda avulsa sem acompanhamento. `licenses` distingue
  tipo vitalícia (sem ciclo de renovação) de recorrente (com ciclo).
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** modelo de dados do `ADM-01`/`TEN-01` já contempla
  isso (ver `ADM-01-ESTRUTURA-PROPOSTA.md` §2).

## DEC-032 — Console do proprietário: controle de acesso desde a v1
- **Data:** 2026-09-10
- **Decisão:** mesmo com só Reinaldo usando o console hoje, o desenho já
  prevê `console_users`/controle de acesso extensível (não um papel único
  hardcoded) — para permitir, no futuro, mais gente (sócio, suporte) sem
  redesenhar o modelo de permissão.
- **Contexto:** resposta à pergunta 3 de `ADM-01-ESTRUTURA-PROPOSTA.md`.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhuma tela nova agora — só o modelo de dados já
  nasce preparado (mesmo raciocínio da DEC-028: construir certo uma vez).

## DEC-033 — Preços de Gestão Online (Essencial e Premium) fechados
- **Data:** 2026-09-10
- **Decisão:** **Essencial: R$ 129,90/mês. Premium: R$ 249,90/mês.**
  Aplicado em `lib/plans.ts` (branch `tarefa/TAREFA-002-landing`, commit
  `28bd65e`). `NEG-01` fica com os 4 níveis do portfólio precificados:
  Entrada R$ 399,90 (vitalício), Lite R$ 69,90/mês, Essencial R$ 129,90/mês,
  Premium R$ 249,90/mês.
- **Contexto:** com base na pesquisa de mercado do Antigravity
  (`docs/operacao/pesquisas/NEG-01-PRECOS.md`, 9 concorrentes mapeados com
  fontes públicas), que sugeriu R$ 129,90 e R$ 249,90 como pontos centrais
  das faixas levantadas.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** fecha `NEG-01`. Libera a Landing Page para
  publicação (sem mais campo `[EM DEFINIÇÃO]` em `lib/plans.ts`).

## DEC-034 — Caminho de teste (OT-CODEX-DEMO): execução única pelo Codex
- **Data:** 2026-09-10
- **Decisão:** em vez da divisão em três (Arquiteto/Codex/Antigravity)
  proposta originalmente, Reinaldo concentra toda a implementação do
  caminho de teste via Landing Page no Codex — inclusive `proxy.ts` e
  `app/(app)/layout.tsx` (normalmente domínio do Arquiteto, §3). O
  Arquiteto segue como responsável de integração: revisa e valida antes de
  commitar, mesmo não escrevendo o código.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** `OT-CODEX-DEMO.md` atualizada com o escopo completo
  para o Codex.

## DEC-035 — ADM-01: Arquiteto estrutura, Antigravity executa
- **Data:** 2026-09-10
- **Decisão:** para o painel administrativo (`ADM-01`), o Arquiteto produz a
  estrutura técnica (modelo de dados, rotas, contratos) e o Antigravity
  executa a implementação — divisão diferente do padrão usual (`ADM-01` é
  backend-pesado, tipicamente domínio do Codex, mas Reinaldo optou por
  Antigravity como executor).
- **Contexto:** a execução em si continua represada pela DEC-028 (ADM-01
  depende de `TEN-01`, que depende de `SEC-01` fechar) — esta decisão define
  **quem** executa quando chegar a hora, não **quando**.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhuma mudança de sequência; só de responsável.

## DEC-036 — Nome da rota do console do proprietário: `/backoffice`
- **Data:** 2026-09-10
- **Decisão:** o console exclusivo do proprietário (`ADM-01`) fica em
  `/backoffice`, distinto do `/admin` já existente (papel dentro do app de
  uma igreja).
- **Contexto:** resposta à pergunta 4 de `ADM-01-ESTRUTURA-PROPOSTA.md`
  (última em aberto). Sugestão do Arquiteto, confirmada por Reinaldo.
- **Alternativas:** `/proprietario` (equivalente em português) — não
  escolhida.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** fecha as 4 perguntas de `ADM-01-ESTRUTURA-PROPOSTA.md`
  — modelo de dados, segurança e estrutura de rotas totalmente aprovados.

## DEC-037 — Correção do achado crítico do SEC-01: papel fixo em "membro"
- **Data:** 2026-09-10
- **Decisão:** até o `TEN-01` trazer o modelo de papel via RLS
  (usuário↔organização↔papel no banco), todo login real (com credenciais
  Supabase) fixa o papel do usuário em `"membro"` — a seleção de papel na
  tela de login é removida do fluxo de autenticação real. Codex autorizado a
  executar (`OT-SEC-01-CORRECOES.md`), junto dos outros 4 achados da revisão
  de segurança (open redirect, cadastro simulado, marca residual, link
  morto).
- **Contexto:** achado crítico da revisão de segurança do Arquiteto
  (sessão 15) — papel era escolhido no cliente sem verificação de servidor,
  violando §17.1.
- **Alternativas:** esperar o `TEN-01` inteiro para liberar login real
  (atrasaria o SEC-01 sem necessidade); implementar uma tabela de papel
  simplificada só para o SEC-01 (rejeitada — risco de retrabalho quando o
  TEN-01 chegar, mesmo raciocínio da DEC-028).
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** destrava `SEC-01` de `Bloqueada` assim que a
  correção for aplicada e revisada.

## DEC-038 — Regra dura de isolamento de pasta para o Antigravity
- **Data:** 2026-09-10
- **Decisão:** regra expressa e obrigatória, registrada em
  `CEREBRO-OPERACIONAL.md` v1.4 §2.3: Antigravity trabalha exclusivamente em
  `C:\Projetos\gestao-igreja-antigravity`; proibido copiar arquivo entre a
  pasta principal e a worktree por qualquer meio; confirmação do diretório
  de trabalho é a primeira ação de toda sessão; entrega feita fora da pasta
  certa não é aceita até ser corrigida e refeita na worktree.
- **Contexto:** duas ocorrências na mesma sessão de trabalho do Antigravity
  na pasta principal (`C:\Projetos\Gestão Igreja`), a segunda envolvendo
  cópia manual de arquivo entre as duas pastas (`Copy-Item`) para editar e
  depois validar — nada foi perdido nas duas vezes, mas o risco de colisão
  de working tree que a DEC-022/worktrees deveriam ter eliminado continuou
  presente. Uma instrução no kickoff não bastou; a regra formal e o
  bloqueio de aceite são o próximo degrau de reforço.
- **Alternativas:** aceitar o padrão de "editar na pasta principal, Arquiteto
  revisa e limpa depois" como fluxo real de trabalho do Antigravity — não
  escolhida, mantém o risco de colisão em aberto indefinidamente.
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** nenhum no escopo do produto; reforça a governança
  de isolamento já estabelecida (worktrees, sessão desta mesma data).

## DEC-039 — QA da Landing Page aprovado; início da criação do logotipo
- **Data:** 2026-09-10
- **Decisão:** `TAREFA-002` (Landing Page) aprovada no QA de Reinaldo, com
  um ajuste: 6º card ("Eventos & Conferências") em Áreas da Igreja, para
  fechar a grade 3×2. Aplicado e validado (commit `0f767ba`). Reinaldo
  também autoriza o início da criação de um logotipo vetorial real para o
  produto — `logo.svg` atual é uma imagem PNG antiga em base64, não um
  logotipo de verdade.
- **Contexto:** a identidade visual final era considerada fora de escopo
  em DEC-013 ("depende da definição de marca"). Reinaldo decide avançar
  nisso agora, via Codex gerando o SVG (`OT-CODEX-LOGO.md`).
- **Quem decidiu:** Reinaldo.
- **Impacto no plano:** `TAREFA-002` → `Aceita`. Nova frente `MARCA-LOGO`
  no backlog. Resultado visual do logotipo ainda pendente de aprovação
  final de Reinaldo (decisão de marca, §4).
