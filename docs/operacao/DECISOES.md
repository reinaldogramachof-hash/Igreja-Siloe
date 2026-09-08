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
