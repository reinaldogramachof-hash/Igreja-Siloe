# Status Report — Gestão de Igrejas (SaaS)

Arquivo append-only. Entrada mais recente no topo. Uma entrada por sessão de
agente. Template em `CEREBRO-OPERACIONAL.md` §7.

```
## AAAA-MM-DD — <Agente> — sessão <n>
- Tarefa / ID: <ID do backlog> — <título>
- Tipo: 1 | 2
- Decisões solicitadas ao Orquestrador: <lista ou "nenhuma">
- Entregas: <o que ficou pronto>
- Evidência: <PRs, prints, vídeos, saída de testes>
- Portão automático: lint <ok/n> · types <ok/n> · build <ok/n> · testes <ok/n> · isolamento <ok/n/a>
- Pendências: <o que falta>
- Riscos / bloqueios: <...>
- Próximo passo: <...>
- Arquivos tocados: <lista>
```

---

## 2026-09-08 — Claude (Arquiteto) — sessão 6
- **Tarefa / ID:** OPS-01 (preparação) — revalidação do acesso ao Supabase e
  redação da OT
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador (todas resolvidas nesta sessão):**
  1. Projeto Supabase — **Reinaldo: usar o base "Gestão Igreja Pro"
     (`wkovbmrvpzukszmgfctd`)**, com objetos de teste no schema `homolog` e
     removidos ao fim.
  2. Aprovação de `OT-OPS-01` — **aprovada item a item em 2026-09-08.**
  3. cPanel do Plano M — **Reinaldo executa via o agente Claude do Chrome**,
     a partir do roteiro gerado nesta sessão.
  4. `.mcp.json` — **Reinaldo autorizou versionar.** Registrado em DEC-021;
     commitado no 2º PR de governança.
  5. Merge do PR de governança — Arquiteto autorizado a commitar, dar push e
     abrir o PR #2; o **merge é de Reinaldo** (DEC-006).
- **Entregas:**
  - Acesso ao Supabase **revalidado nesta sessão** (fechou a pendência da sessão
    5). Servidor MCP `supabase` conectado; `mcp__supabase__*` carregados.
  - `docs/operacao/ordens/OT-OPS-01.md` redigida e **aprovada**; ajustada para o
    projeto-base "Gestão Igreja Pro", schema `homolog` isolado, cleanup no aceite
    e tratamento do advisory `public.rls_auto_enable()`.
  - Roteiro do subdomínio `homolog.plenaaplicativos.com.br` (cPanel) e passo a
    passo do merge de governança entregues no chat da sessão.
- **Evidência:**
  - `get_project_url` → `https://wkovbmrvpzukszmgfctd.supabase.co`.
  - `execute_sql` (`select version()`) → PostgreSQL 17.6, db `postgres`, usuário
    `supabase_read_only_user` (conexão `read_only=true`).
  - `list_tables(public)` → 0 tabelas; `list_migrations` → 0 migrations. **Mas**
    `get_advisors(security)` acusa `public.rls_auto_enable()` (`SECURITY DEFINER`,
    executável por `anon` e `authenticated` via `/rest/v1/rpc/`) — 2 WARN. Tratar
    dentro do OPS-01 ou abrir item de backlog.
  - `get_publishable_keys` → publishable `sb_publishable_amrp4s45eL5-8SBZYaz39g__odS7qiW`
    (+ anon JWT legado). URL `https://wkovbmrvpzukszmgfctd.supabase.co`.
  - Reinaldo informou o domínio disponível e validado na HostGator:
    `www.plenaaplicativos.com.br`. Confirmou o projeto-base: "Gestão Igreja Pro".
  - Git: PR #1 (`chore/cerebro-operacional-v1`) **já mesclado** em `origin/main`
    (commit `04d75d6`). PR #2 aberto com a continuação; `main` local desatualizada.
  - **Infra de homologação (agente Claude do Chrome, 2026-09-08):** conta cPanel
    `hg2fbe99` (`/home2/hg2fbe99`, domínio primário `plenainformatica.com.br`);
    `plenaaplicativos.com.br` confirmado nessa conta. Subdomínio
    `homolog.plenaaplicativos.com.br` **criado**, document root
    `/home2/hg2fbe99/homolog` (caminho inferido do relativo `/homolog` —
    reconfirmar no deploy). SSL AutoSSL/Let's Encrypt **válido** (expira
    2026-12-07, renovação automática). HTTPS responde 200 (página vazia). PHP 8.3.
    Servidor: **provável Apache** pelos logs; **não confirmado por header
    `Server:`** (HostGator compartilhado costuma ser LiteSpeed — ambos honram
    `.htaccess`/`mod_rewrite`, então não bloqueia).
- **Portão automático:** n/a (documentação + verificação de acesso).
- **Pendências:**
  - **Segurança:** chave SSH `id_rsa` pré-existente e não-autorizada foi
    **autorizada pelo agente do Chrome** sem identificar o dono; o agente também
    tentou baixar a chave privada. Reinaldo precisa confirmar a autoria e
    **revogar se não for dele**; não baixar/expor a chave privada (§17.3).
  - `homolog.plenaaplicativos.com.br` sem **Force HTTPS Redirect** (visto
    desativado) — resolver no `.htaccess` ou ligar no cPanel.
  - Confirmar `mod_rewrite`/`.htaccess` no primeiro deploy (não verificado).
  - Definir o caminho de escrita no Supabase para a migração/Edge Function/bucket
    (dashboard / CLI / conector com `apply_migration` na conta dona).
  - Merge do PR #2 por Reinaldo (DEC-006).
- **Riscos / bloqueios:** `main` local desatualizada — `git pull` antes de seguir.
  Next.js desta versão tem breaking changes no export estático — ler
  `node_modules/next/dist/docs/` antes de tocar `next.config.ts`. Prova no
  projeto-base: isolamento (`schema homolog`) e cleanup obrigatórios. Chave SSH
  em aberto (acima).
- **Próximo passo:** Reinaldo resolve a chave SSH e mescla o PR #2; define o
  caminho de escrita no Supabase; então abre-se `tarefa/OPS-01-homologacao`
  (Arquiteto: `next.config.ts` + `.htaccess` + runbook; Dev Backend: schema
  `homolog` + Edge Function + bucket).
- **Arquivos tocados:** `docs/operacao/ordens/OT-OPS-01.md` (novo), `.mcp.json`
  (novo), `docs/operacao/DECISOES.md` (DEC-021), `docs/operacao/STATUS-REPORT.md`,
  `docs/operacao/BACKLOG-OPERACIONAL.md`, `docs/operacao/ciclos/CICLO-01.md`.

## 2026-09-08 — Claude (Arquiteto) — sessão 5
- **Tarefa / ID:** OPS-01 (preparação) — conexão ao Supabase
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** onde commitar o `.mcp.json`;
  autenticação do MCP (só Reinaldo pode fazer).
- **Entregas:** `.mcp.json` criado com o servidor MCP `supabase` project-scoped
  (`project_ref=wkovbmrvpzukszmgfctd`, `read_only=true`) via `claude mcp add`.
- **Evidência:** `.mcp.json` no working tree; `claude mcp add` retornou exit 0.
- **Validação externa (2026-09-08):** chamadas de leitura ao projeto-alvo pelo
  conector claude.ai Supabase — `get_project("wkovbmrvpzukszmgfctd")` e
  `list_tables("wkovbmrvpzukszmgfctd")` — retornaram
  `MCP error -32600: You do not have permission to perform this action`.
  Esse conector está preso a outra conta e não serve para o projeto-alvo.
- **Autenticação do servidor `supabase` (2026-09-08):** Reinaldo autenticou via
  `claude /mcp`. `claude mcp list` mostra
  `supabase: https://mcp.supabase.com/mcp?project_ref=wkovbmrvpzukszmgfctd... - ✔ Connected`.
  Os tools `mcp__supabase__*` só carregam numa **nova sessão** (o servidor foi
  adicionado com a sessão já em andamento). Revalidar o acesso na próxima sessão.
- **Portão automático:** n/a.
- **Pendências / bloqueios:** não autenticado — `claude /mcp` exige terminal
  interativo (Reinaldo). O conector claude.ai Supabase pré-existente está logado
  em OUTRA conta (org `djuzpjjyxvtsqnubwzzc`: "Plena Gastro Manager",
  "Gestao Fit", "Plena Informática", "Tem No Bairro") e **não** enxerga o projeto
  `wkovbmrvpzukszmgfctd`. Portanto, não há acesso ao projeto-alvo nesta sessão.
- **Próximo passo:** Reinaldo autentica o MCP `supabase` com a conta dona do
  projeto; decidir commit do `.mcp.json`.
- **Arquivos tocados:** `.mcp.json`, `docs/operacao/STATUS-REPORT.md`.

## 2026-09-08 — Claude (Arquiteto) — sessão 4
- **Tarefa / ID:** CICLO-01 — onboarding dos devs e redação das OTs
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** aprovação de `OT-PLAN-12` e
  `OT-TAREFA-001`; confirmação do ruling OPS-01 não depende de SIL-01; insumos
  para `OT-OPS-01` e `OT-SIL-01`.
- **Entregas:** revisão e aceite dos read-backs de Codex e Antigravity;
  `ordens/OT-PLAN-12.md` e `ordens/OT-TAREFA-001.md` redigidas;
  `ciclos/CICLO-01.md` atualizado (situação, ruling de dependência, insumos
  pendentes); `BACKLOG-OPERACIONAL.md` — PLAN-12 e TAREFA-001 em `Especificacao`,
  OPS-01 com dependência ajustada.
- **Evidência:** working tree na branch `chore/cerebro-operacional-v1`.
- **Portão automático:** n/a (documentação).
- **Pendências:** aprovação das duas OTs por Reinaldo; insumos de OPS-01 e SIL-01;
  merge do PR de governança.
- **Riscos / bloqueios:** devs prontos e ociosos até a primeira OT aprovada.
- **Próximo passo:** com `OT-TAREFA-001` aprovada, Antigravity e Arquiteto abrem
  `tarefa/TAREFA-001-desmarcacao`; com insumos, redijo `OT-OPS-01` e `OT-SIL-01`.
- **Arquivos tocados:** `docs/operacao/ordens/OT-PLAN-12.md`,
  `docs/operacao/ordens/OT-TAREFA-001.md`, `docs/operacao/ciclos/CICLO-01.md`,
  `docs/operacao/BACKLOG-OPERACIONAL.md`, `docs/operacao/STATUS-REPORT.md`.

## 2026-09-08 — Claude (Arquiteto) — sessão 3
- **Tarefa / ID:** governança — roadmap de execução (DEC-020)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** DEC-020 — roadmap A–H e desvio de
  sequência (TEN-01 antes das rotinas); aprovada por Reinaldo.
- **Entregas:** `docs/operacao/ROADMAP-EXECUCAO.md`; `docs/operacao/agentes/KICKOFF.md`
  (prompts de onboarding de Codex e Antigravity); `CEREBRO-OPERACIONAL.md` §20
  atualizada e v1.2; DEC-020 no `DECISOES.md`.
- **Evidência:** working tree na branch `chore/cerebro-operacional-v1`.
- **Portão automático:** n/a (documentação).
- **Pendências:** merge do PR de governança; Reinaldo confirma o Ciclo 1 e envia
  insumos de OPS-01 e SIL-01; Arquiteto redige as OTs do Ciclo 1.
- **Riscos / bloqueios:** nenhum.
- **Próximo passo:** com o Ciclo 1 confirmado, redigir `OT-PLAN-12`,
  `OT-TAREFA-001`, `OT-OPS-01`, `OT-SIL-01`.
- **Arquivos tocados:** `CEREBRO-OPERACIONAL.md`, `docs/operacao/DECISOES.md`,
  `docs/operacao/STATUS-REPORT.md`, `docs/operacao/ROADMAP-EXECUCAO.md`,
  `docs/operacao/agentes/KICKOFF.md`.

## 2026-09-08 — Claude (Arquiteto) — sessão 2
- **Tarefa / ID:** governança — estrutura de execução e distribuição (DEC-019)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** DEC-019 — aprovada por Reinaldo.
- **Entregas:** `docs/operacao/BACKLOG-OPERACIONAL.md`;
  `agentes/{ARQUITETO,DEV-BACKEND,DEV-FRONTEND,ORQUESTRADOR-QA}.md`;
  `templates/{ORDEM-DE-TRABALHO,PULL-REQUEST,MODULO-README,MODELAGEM-DE-AMEACA}.md`;
  `ordens/README.md`; `ciclos/README.md`; `ciclos/CICLO-01.md` (esqueleto);
  `CEREBRO-OPERACIONAL.md` §20 e v1.1.
- **Evidência:** working tree na branch `chore/cerebro-operacional-v1`.
- **Portão automático:** n/a (documentação).
- **Pendências:** Reinaldo prioriza e data o Ciclo 1 em `ciclos/CICLO-01.md`;
  Arquiteto redige as OTs dos IDs escolhidos.
- **Riscos / bloqueios:** nenhum.
- **Próximo passo:** aprovar/mesclar o PR; abrir o Ciclo 1.
- **Arquivos tocados:** `CEREBRO-OPERACIONAL.md`, `docs/operacao/DECISOES.md`,
  `docs/operacao/STATUS-REPORT.md`, `docs/operacao/BACKLOG-OPERACIONAL.md`,
  `docs/operacao/agentes/*`, `docs/operacao/templates/*`,
  `docs/operacao/ordens/README.md`, `docs/operacao/ciclos/*`.

## 2026-09-08 — Claude (Arquiteto) — sessão 1
- **Tarefa / ID:** governança — abertura do Cérebro Operacional
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** DEC-001 a DEC-018 — todas aprovadas
  expressamente por Reinaldo.
- **Entregas:** `CEREBRO-OPERACIONAL.md` v1.0 vigente; `docs/operacao/DECISOES.md`
  com DEC-001 a DEC-018; este arquivo; `docs/operacao/deploys/README.md`;
  ponteiro para o Cérebro Operacional adicionado ao `AGENTS.md`.
- **Evidência:** arquivos no working tree; sem commit (aguardando autorização).
- **Portão automático:** n/a (mudança só de documentação).
- **Pendências:** revisão v1.2 do plano estratégico (DEC-014); TAREFA-001
  (desvinculação da marca Siloé) a iniciar no próximo ciclo.
- **Riscos / bloqueios:** nenhum.
- **Próximo passo:** Reinaldo autoriza o commit desta abertura; em seguida,
  especificar TAREFA-001 e a prova de compatibilidade OPS-01 (HostGator Plano M).
- **Arquivos tocados:** `CEREBRO-OPERACIONAL.md`, `AGENTS.md`,
  `docs/operacao/DECISOES.md`, `docs/operacao/STATUS-REPORT.md`,
  `docs/operacao/deploys/README.md`.
