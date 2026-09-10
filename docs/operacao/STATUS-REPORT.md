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

## 2026-09-10 — Claude (Arquiteto) — sessão 11
- **Tarefa / ID:** governança — libera OPS-01/SEC-01 em paralelo + adianta
  Landing Page (TAREFA-002)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** nenhuma nova — Reinaldo confirmou
  os 4 pontos nesta sessão (registrados em DEC-023, DEC-024, DEC-025).
- **Entregas:**
  - `DECISOES.md`: DEC-023 (OPS-01/SEC-01 em paralelo), DEC-024 (advisory
    `rls_auto_enable()` → revoke execute; Codex autorizado a fazer as duas
    escritas no Supabase), DEC-025 (Landing Page comercial adiantada).
  - `BACKLOG-OPERACIONAL.md`: SEC-01 → `Revisao` (dependência de OPS-01
    suspensa para este par); OPS-01 nota a autorização das 2 escritas;
    TAREFA-002 → `Especificacao` com OT redigida e aprovada; NEG-01 com
    apontador para o insumo parcial.
  - `ciclos/CICLO-01.md`: registrado o insumo parcial de `NEG-01` (Modelo de
    Entrada/LocalStorage, Gestão Lite R$69,90, Gestão Online escalando até
    Essencial/Premium) — mensagem do Reinaldo veio cortada, faltam valores de
    Essencial/Premium e critérios de teste/trial.
  - `docs/operacao/ordens/OT-TAREFA-002.md` (novo): Landing Page comercial em
    rota nova `app/(marketing)/`. **Corrigido durante a redação:** a OT
    inicial apontava para `app/(site)/`, que já existe e é o site público da
    Igreja Siloé (`lib/site-content.ts`, feature PUB-01) — trocado antes de
    liberar, para não colidir com esse arquivo.
  - `lib/brand.ts` (novo, branch `tarefa/TAREFA-002-landing`, a partir de
    `main`): fundação mínima do Arquiteto para a Landing Page não ter string
    de marca solta. Campos de contato como `[EM DEFINIÇÃO]` até `NEG-01`
    fechar. Validado (`tsc --noEmit` e `npm run build`, após limpar `.next/`
    que tinha tipos gerados da branch anterior) antes de commitar.
- **Evidência:** commits `4ab1b8d` (governança, `tarefa/OPS-01-homologacao`)
  e `4e8e7ec` (`lib/brand.ts`, `tarefa/TAREFA-002-landing`).
- **Portão automático:** types ok · build ok · lint não rodado nesta branch
  (arquivo novo isolado, sem risco) · testes n/a · isolamento n/a.
- **Pendências:**
  - Codex: deploy `homolog-echo` + `revoke execute` em `rls_auto_enable()`
    (DEC-024) — kickoff enviado a Reinaldo para repassar no terminal do
    Codex.
  - Antigravity: Landing Page (`OT-TAREFA-002`) — kickoff enviado a Reinaldo
    para repassar.
  - Reinaldo: completar `NEG-01` (valores de Essencial/Premium e critérios de
    teste) antes do aceite final da Landing Page.
  - Arquiteto: seguir com `next.config.ts` + `.htaccess` do OPS-01 (próxima
    ação desta sessão).
  - Revisão de segurança do SEC-01 por agente distinto do implementador
    (§12/DEC-007) ainda não agendada.
- **Riscos / bloqueios:** nenhum novo.
- **Próximo passo:** Arquiteto inicia `next.config.ts`/`.htaccess` do OPS-01;
  Reinaldo repassa os kickoffs a Codex e Antigravity.
- **Arquivos tocados:** `docs/operacao/DECISOES.md`,
  `docs/operacao/BACKLOG-OPERACIONAL.md`, `docs/operacao/ciclos/CICLO-01.md`,
  `docs/operacao/ordens/OT-TAREFA-002.md`, `lib/brand.ts` (branch separada).

---

## 2026-09-10 — Claude (Arquiteto) — sessão 10
- **Tarefa / ID:** governança — separação da colisão de branch (SEC-01 × OPS-01)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** nenhuma nova.
- **Entregas:**
  - `tarefa/OPS-01-homologacao` limpa: commit `c8c9ab2` (atualização de
    backlog/status do OPS-01) fica só nela.
  - Criada `tarefa/SEC-01-auth` a partir de `origin/main` (não de OPS-01, para
    não misturar histórico). Trabalho de Auth do Codex (sessão 8) movido para
    lá via `git stash` seletivo por caminho.
  - Validado antes de commitar (DEC-022): `tsc --noEmit` limpo; `npm run
    build` ok (rotas passam a **dinâmicas** por causa do `proxy.ts` —
    middleware não roda em export estático, risco já registrado na sessão 8);
    `npm run lint` no mesmo baseline pré-existente (27 erros / 88 avisos,
    dívida do QUA-01, sem regressão nova).
  - Commit `04e32d1` em `tarefa/SEC-01-auth`, autoria de Codex identificada na
    mensagem, co-autoria do Arquiteto conforme regra.
  - `docs/operacao/BACKLOG-OPERACIONAL.md`: linha SEC-01 atualizada — branch
    existe, mas **não segue para revisão/QA até OPS-01 ser Aceita** (a
    dependência SEC-01 → OPS-01 do quadro não foi satisfeita; o código já
    existe por ter sido implementado fora de ordem na sessão 8).
- **Evidência:** saída de `tsc`/`build`/`lint` acima; `git log` das duas
  branches.
- **Portão automático:** lint n/a (baseline pré-existente, não bloqueante
  aqui) · types ok · build ok · testes n/a (sem suíte automatizada ainda) ·
  isolamento n/a.
- **Pendências:** nenhuma branch foi enviada ao `origin` ainda — aguardando
  autorização de Reinaldo para o push (§10). Decisão a confirmar: SEC-01
  formalmente entra em Execução agora (fora de ordem) ou a branch fica
  parada até OPS-01 ser aceita, conforme o quadro do backlog manda.
- **Riscos / bloqueios:** nenhum novo; risco de arquitetura do `proxy.ts` ×
  export estático permanece registrado, a resolver no desenho do
  `next.config.ts` do OPS-01.
- **Próximo passo:** confirmar com Reinaldo se `tarefa/SEC-01-auth` pode ir a
  `origin`; soltar as próximas tarefas para Codex e Antigravity.
- **Arquivos tocados (nesta branch):** `docs/operacao/BACKLOG-OPERACIONAL.md`,
  `docs/operacao/STATUS-REPORT.md`.

## 2026-09-10 — Claude (Arquiteto) — sessão 9
- **Tarefa / ID:** governança — commit centralizado no Arquiteto (DEC-022)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** nenhuma nova — Reinaldo já
  confirmou a mudança nesta sessão.
- **Entregas:**
  - `CEREBRO-OPERACIONAL.md` v1.3: Codex e Antigravity continuam em cópia de
    trabalho isolada por tarefa, mas não commitam nem dão push — entregam
    pronto e avisam o Arquiteto. O Arquiteto valida (revisão + portão
    automático) e commita toda entrega, identificando o agente responsável na
    mensagem. Push/merge/deploy continuam exigindo autorização expressa de
    Reinaldo (sem mudança aí). Seções alteradas: §2.1–§2.3, §3, §6, §8, §10,
    §21.
  - `docs/operacao/DECISOES.md`: DEC-022 registrada com contexto (mistura de
    escopo Codex/Claude na branch `tarefa/OPS-01-homologacao` na sessão 8) e
    alternativas consideradas.
  - **OPS-01:** Reinaldo adicionou `homolog` em Exposed schemas (Data API →
    Settings) no Supabase. Verificado pelo Arquiteto via `curl` com a chave
    publicável: `Accept-Profile: homolog` deixou de dar 406 ("Invalid
    schema") e passou a dar 401/`42501 permission denied for schema homolog`
    — esperado, pois a migração só dá grant ao papel `authenticated` (sem
    login, é o comportamento correto). `homolog-echo` segue 404 (Edge
    Function ainda não deployada — depende do Codex).
- **Evidência:** diff dos arquivos listados abaixo; saída dos `curl` de
  verificação (não commitada, comando ad-hoc).
- **Portão automático:** n/a (mudança de documentação/governança + checagem
  de API).
- **Pendências:** a colisão de branch da sessão 8 (mudanças de Auth do Codex
  não commitadas em `tarefa/OPS-01-homologacao`) ainda não foi resolvida —
  próxima sessão aplica a regra nova: Arquiteto valida e commita esse
  trabalho em branch própria de SEC-01. Deploy de `homolog-echo` e `revoke
  execute` em `public.rls_auto_enable()` — a cargo do Codex, aguardando ele
  executar.
- **Riscos / bloqueios:** nenhum novo.
- **Próximo passo:** separar e commitar o trabalho de Auth do Codex (SEC-01)
  numa branch própria, seguindo a regra v1.3; Codex prossegue com o deploy da
  Edge Function e o `revoke execute`; Arquiteto segue com `next.config.ts` +
  `.htaccess` do OPS-01.
- **Arquivos tocados:** `CEREBRO-OPERACIONAL.md`,
  `docs/operacao/DECISOES.md`, `docs/operacao/STATUS-REPORT.md`.

## 2026-09-08 — Claude (Arquiteto) — sessão 8
- **Tarefa / ID:** OPS-01 — validação do banco (schema `homolog`)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** autorização para 2 escritas no
  "Gestão Igreja Pro" via conector MCP — deploy da Edge Function `homolog-echo`
  e `revoke execute on function public.rls_auto_enable() from anon, authenticated,
  public`. Aguardando.
- **Entregas:**
  - Conector claude.ai Supabase reautenticado por Reinaldo — agora enxerga a org
    "Gestão Igrejas" / projeto "Gestão Igreja Pro". Escrita disponível.
  - Verificado via MCP que a migração `homolog` **já estava aplicada e correta**.
  - `supabase/validate/validate_homolog.sql` — script de validação (estrutura +
    isolamento RLS A/B em transação revertida). Check de FK via `pg_constraint`
    (ajuste do Codex — `information_schema` deu falso negativo cross-schema).
  - Cópia solta `validate_homolog.sql` da raiz removida.
- **Evidência (rodada pelo Codex via conector, equivalente ao psql):**
  - Estrutura/RLS/grants/storage: **14/14 PASS**.
  - Isolamento RLS A/B (transação com ROLLBACK): **6/6 PASS**; sem resíduo
    (`homolog_ping_rows=0`, `homolog_test_users=0`).
  - HTTP: `exposed-schema` → **406** (falta `homolog` em Exposed schemas);
    `homolog-echo` → **404** (Edge Function ainda não deployada).
  - `get_advisors(security)`: só os 2 WARN pré-existentes de
    `public.rls_auto_enable()`.
- **Portão automático:** n/a (validação de banco).
- **Pendências:**
  - Reinaldo: adicionar `homolog` em **Settings → API → Exposed schemas**.
  - Autorizar as 2 escritas MCP (deploy `homolog-echo` + `revoke execute`).
  - Arquiteto: `next.config.ts` export + `.htaccess` + rota de homologação +
    runbook + `DEPLOY-*`; depois a prova A/B pelo frontend.
- **Riscos / bloqueios:** **colisão de branch** — Codex trabalhou em
  `tarefa/OPS-01-homologacao` (branch do Arquiteto/OPS-01) e deixou mudanças de
  Auth **não commitadas** (`proxy.ts`, `lib/supabase/`, `app/auth/`,
  `package.json`, `tsconfig.json`...). Isso é SEC-01, não OPS-01 (§3: uma branch
  por dono). Precisa separar. Além disso, `proxy.ts` (middleware) **não roda em
  static export** — decisão de arquitetura para a prova de auth no Plano M.
- **Próximo passo:** Reinaldo separa a frente do Codex; autoriza as escritas;
  Arquiteto segue com o export estático.
- **Arquivos tocados:** `supabase/validate/validate_homolog.sql` (novo),
  `docs/operacao/BACKLOG-OPERACIONAL.md`, `docs/operacao/STATUS-REPORT.md`,
  `supabase/README.md`.

## 2026-09-08 — Codex (Dev Backend) — sessão 1
- **Tarefa / ID:** Auth Supabase + rotas protegidas — continuação de OPS-01/SEC-01
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** nenhuma nova além do pedido direto desta sessão; nenhuma escrita nova foi feita no Supabase.
- **Entregas:** dependências oficiais `@supabase/ssr` e `@supabase/supabase-js`; clients Supabase browser/server/proxy; `proxy.ts` protegendo rotas internas; layout interno com checagem server-side de usuário; login/logout usando Supabase Auth; callback `/auth/callback`; `.env.example` versionável; `tsconfig` excluindo Edge Functions Deno do typecheck do app.
- **Evidência:** projeto Supabase `Gestão Igreja Pro` (`wkovbmrvpzukszmgfctd`) ativo; tabela `homolog.homolog_ping` com RLS lida via conector; `npx tsc --noEmit --incremental false` ok; `npm run build` ok; dev server local validou `/dashboard` sem sessão redirecionando para `/login?next=%2Fdashboard` e `/login` respondendo 200.
- **Portão automático:** lint falhou no baseline conhecido (27 erros/88 avisos); types ok; build ok; testes n/a; isolamento parcial por rota sem sessão ok.
- **Pendências:** criar/validar usuários Auth reais no Supabase; definir modelo de organizações/vínculos/perfis com RLS em TEN-01/SEC-01; resolver advisory `public.rls_auto_enable()` executável por `anon`/`authenticated`; corrigir baseline de lint; tratar `npm audit` moderado em `qs`.
- **Riscos / bloqueios:** `proxy.ts` não é suportado em static export puro; para HostGator estático, a proteção server-side não roda e será preciso desenho alternativo client/RLS ou hospedagem com runtime. Perfis do menu continuam demonstrativos em `localStorage`, não autorização de produção.
- **Próximo passo:** revisar arquitetura de Auth/tenant com o Arquiteto e criar users/perfis de teste para prova A/B real.
- **Arquivos tocados:** `.gitignore`, `.env.example`, `app/(app)/layout.tsx`, `app/(auth)/login/page.tsx`, `app/auth/callback/route.ts`, `components/layout/sidebar.tsx`, `lib/supabase/*`, `proxy.ts`, `package.json`, `package-lock.json`, `tsconfig.json`, `docs/operacao/STATUS-REPORT.md`.

## 2026-09-08 — Claude (Arquiteto) — sessão 7
- **Tarefa / ID:** OPS-01 — início da execução (artefatos de banco)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** caminho de escrita no Supabase —
  Reinaldo pediu "via conector"; testado e **indisponível** (o conector claude.ai
  Supabase só enxerga a org "Plena informática", não o "Gestão Igreja Pro" —
  `get_project` → permission denied). Reinaldo optou por **aplicar o SQL
  manualmente pelo SQL Editor**. Dependência do Supabase CLI (Tipo 1) fica adiada.
- **Entregas:**
  - PR #2 mesclado (`8891a15`); `main` local sincronizada; branch de governança
    apagada.
  - Branch `tarefa/OPS-01-homologacao` criada de `main`.
  - `supabase/migrations/20260908183000_homolog.sql` — schema `homolog`
    isolado, tabela `homolog_ping` (RLS por `owner = auth.uid()`, 4 policies,
    grants só a `authenticated`), bucket privado `homolog` + 4 policies em
    `storage.objects` escopadas a `bucket_id='homolog'`. Idempotente.
  - `supabase/rollback/20260908183000_homolog_rollback.sql` — fora de
    `migrations/` de propósito.
  - `supabase/functions/homolog-echo/index.ts` — Edge Function de prova.
  - `supabase/README.md` — como aplicar e reverter.
- **Evidência:** working tree na branch `tarefa/OPS-01-homologacao`.
- **Portão automático:** n/a (SQL/Deno; lint/tsc/build do projeto não cobrem
  `supabase/`). Validação real = aplicar no projeto + prova A/B pelo frontend.
- **Pendências:**
  - Reinaldo aplica `20260908183000_homolog.sql` no SQL Editor; adiciona
    `homolog` em Exposed schemas; faz deploy da `homolog-echo`.
  - Arquiteto: `next.config.ts` com `output: 'export'`, `.htaccess` (rewrite SPA +
    cabeçalhos + Force HTTPS), rota de homologação mínima, runbook
    `OPS-01-HOMOLOGACAO.md`, pacote `DEPLOY-*`.
  - Prova ponta a ponta com dois usuários (login, insert/select, negação A/B,
    Edge Function, Storage, recarga de rota, update do PWA).
  - Advisory `public.rls_auto_enable()` — decidir tratamento.
- **Riscos / bloqueios:** insert pelo SQL Editor falha (`auth.uid()` nulo) — a
  prova é pelo frontend. Servidor do subdomínio não confirmado (Apache × LiteSpeed
  — ambos ok para `.htaccess`).
- **Próximo passo:** aplicar o SQL; abrir PR da branch `tarefa/OPS-01-homologacao`;
  seguir com `next.config.ts` + `.htaccess`.
- **Arquivos tocados:** `supabase/migrations/20260908183000_homolog.sql` (novo),
  `supabase/rollback/20260908183000_homolog_rollback.sql` (novo),
  `supabase/functions/homolog-echo/index.ts` (novo), `supabase/README.md` (novo),
  `docs/operacao/BACKLOG-OPERACIONAL.md`, `docs/operacao/ciclos/CICLO-01.md`,
  `docs/operacao/STATUS-REPORT.md`.

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
