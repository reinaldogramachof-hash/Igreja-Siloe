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

## 2026-09-10 — Claude (Arquiteto) — sessão 20
- **Tarefa / ID:** TEN-01 — confirma isolamento real no Supabase (independente)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** nenhuma.
- **Entregas:**
  - Codex aplicou a migração no projeto real ("Gestão Igreja Pro") e rodou
    `supabase/tests/ten_01_isolation.sql` contra o banco de fato — 5/5
    casos do §8.3 passaram (A só lê A; A não lê/edita B; forjar
    `organization_id` falha pela `WITH CHECK`; usuário sem membership não
    vê nada).
  - **Confirmado de forma independente pelo Arquiteto** (não só no relato
    do Codex, DEC-022): `list_migrations` mostra `20260910213004` aplicada;
    `list_tables` mostra `organizations`/`memberships` com `rls_enabled`;
    query direta em `pg_class` confirma `relforcerowsecurity = true` nas
    duas (RLS realmente forçada, não só habilitada); `get_advisors(security)`
    → `[]` (nenhum achado novo); `ten_01_isolation_probe` não existe no
    banco (rollback da transação de teste não deixou resíduo).
  - `BACKLOG-OPERACIONAL.md`: `TEN-01` → `QA` — falta só a tela mínima em
    `/backoffice` (fase 3) e o QA de Reinaldo.
- **Evidência:** saídas de `list_migrations`, `list_tables`,
  `execute_sql` (pg_class) e `get_advisors` acima.
- **Portão automático:** isolamento **confirmado em ambiente real**
  (não só estático) · demais itens já verdes desde a sessão 19.
- **Pendências:** tela mínima em `/backoffice` (criar organização, vincular
  primeiro admin); QA de Reinaldo.
- **Riscos / bloqueios:** nenhum.
- **Próximo passo:** decidir quem/quando faz a fase 3 (`/backoffice`
  mínimo) — liga com o kickoff do `ADM-01` (DEC-035, Antigravity executa a
  tela).
- **Arquivos tocados:** `docs/operacao/BACKLOG-OPERACIONAL.md`,
  `docs/operacao/STATUS-REPORT.md`.

---

## 2026-09-10 — Claude (Arquiteto) — sessão 19
- **Tarefa / ID:** TEN-01 — revisão e correção de origem de branch
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** nenhuma.
- **Entregas:**
  - **Revisão de código completa** (auth + RLS, sensível): migração
    (`organizations`/`memberships`, RLS habilitada e **forçada**, grants
    explícitos pós-RLS — cobre a mudança recente da Supabase Data API sobre
    tabelas não expostas automaticamente —, funções helper `SECURITY
    DEFINER` com `search_path=''` em `app_private`, revogadas de
    `anon`/`public`), `proxy.ts`/`layout.tsx` (fail-closed sem membership
    ativa), tela de login (verifica membership pós-login, `signOut` +
    mensagem clara se não houver organização), `lib/prototype-auth.tsx`
    (sessão real tem precedência sobre role client-side — fecha a mesma
    classe de vulnerabilidade do achado crítico do SEC-01, agora nesta
    rota também). Qualidade alta, sem achado bloqueante.
  - **Corrigido problema de origem de branch:** Codex criou `tarefa/TEN-01`
    a partir de `main` (que ainda não tem o SEC-01) e trouxe os arquivos do
    SEC-01 manualmente por cima — geraria conflito de histórico quando as
    duas branches fossem mescladas depois. Reconstruída a partir de
    `tarefa/SEC-01-auth` via stash tagueado + `branch -f` + reaplicação
    (4 conflitos, todos resolvidos pegando a versão final do Codex, já
    confirmada idêntica ao SEC-01 + delta genuíno do TEN-01, arquivo a
    arquivo). Commit `330a77b`, push feito.
  - Bônus incidental: lint global melhorou (26 erros/85 avisos, era
    27/88) — fix de `icon: any` → `LucideIcon` no sidebar.
- **Evidência:** `npm run build` ok; `node --test
  tests/ten-01-migration.test.mjs` ok (4/4); `npm run lint` 26/85; diff
  arquivo a arquivo contra `tarefa/SEC-01-auth` conferido antes de
  commitar.
- **Portão automático:** build ok · types ok · testes ok (estáticos) ·
  lint melhorou · isolamento **parcial** — `ten_01_isolation.sql` escrito e
  validado estaticamente, mas não executado contra banco real (Codex tem
  escrita no Supabase; Arquiteto só tem conector read-only).
- **Pendências:** aplicar a migração no Supabase real e rodar
  `supabase/tests/ten_01_isolation.sql` de fato — a cargo do Codex.
  Fase 3 (tela mínima em `/backoffice`) e fase 4 (documentar teste real)
  seguem depois.
- **Riscos / bloqueios:** nenhum novo.
- **Próximo passo:** Codex aplica a migração + roda o teste de isolamento
  real; Arquiteto confirma de forma independente via `get_advisors`/query
  read-only assim que aplicado.
- **Arquivos tocados:** `docs/operacao/BACKLOG-OPERACIONAL.md`,
  `docs/operacao/STATUS-REPORT.md` (branch OPS-01); migração, RLS,
  `proxy.ts`, `layout.tsx`, `lib/supabase/membership.ts`,
  `lib/prototype-auth.tsx`, `lib/types.ts`, testes (branch TEN-01, commit
  `330a77b`).

---

## 2026-09-10 — Claude (Arquiteto) — sessão 18
- **Tarefa / ID:** MARCA-LOGO — valida logotipo vetorial do Codex
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** aprovação visual final do
  logotipo (decisão de marca, §4) — aguardando.
- **Entregas:**
  - Revisão do `logo.svg` do Codex: SVG vetorial puro (688 bytes, sem
    `<image>`/base64/`xlink:href`), casa/abrigo estilizado com três
    pessoas (comunidade acolhida), cores do design system (`--primary`
    `#0e7a8f`, `--accent` `#2fa8bd`, dourado `#c99a3e` já usado no tema).
  - Inspeção visual: `icon-512x512.png` (símbolo limpo e legível) e
    `favicon-32x32.png` (silhueta da casa ainda reconhecível em 32px).
  - **Achado de processo corrigido:** Codex tinha gerado o logo na worktree
    dele, mas ela estava com a branch `tarefa/SEC-01-auth` ainda
    selecionada — misturaria marca com auth. Movido para branch própria
    `tarefa/MARCA-LOGO` (a partir de `main`) via stash tagueado
    (`git stash push -u -m` + `apply <sha>` + `drop <sha>`, conforme regra
    de stash compartilhado entre worktrees). Worktree do Codex devolvida
    limpa em `tarefa/SEC-01-auth` para o próximo trabalho dele.
  - Commit `9f549b7` em `tarefa/MARCA-LOGO`, push feito.
  - `BACKLOG-OPERACIONAL.md`: `MARCA-LOGO` → `Revisao`.
- **Evidência:** leitura do SVG; inspeção visual dos PNGs gerados; `npm run
  build` ok na branch limpa.
- **Portão automático:** build ok · types ok (parte do build) · lint n/a
  (só asset, sem código) · testes n/a · isolamento n/a.
- **Pendências:** aprovação visual final de Reinaldo.
- **Riscos / bloqueios:** nenhum.
- **Próximo passo:** Reinaldo aprova (ou pede ajuste) o logotipo.
- **Arquivos tocados:** `docs/operacao/BACKLOG-OPERACIONAL.md`,
  `docs/operacao/STATUS-REPORT.md` (branch OPS-01); `logo.svg`,
  `public/logo.svg`, `public/icons/*`, `public/apple-touch-icon.png`,
  `public/favicon-32x32.png` (branch MARCA-LOGO, commit `9f549b7`).

---

## 2026-09-10 — Claude (Arquiteto) — sessão 17
- **Tarefa / ID:** SEC-01 — valida correções dos 5 achados de segurança
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** nenhuma nova.
- **Entregas:**
  - Revisão independente da correção do Codex (`OT-SEC-01-CORRECOES.md`):
    todos os 5 achados corrigidos corretamente. Crítico: seleção de papel
    removida do formulário de login real, `setStoredRole("membro")` fixo,
    com nota transparente na UI explicando a limitação temporária até o
    `TEN-01`. Alto: `getSafeNextPath` valida `next` (rejeita vazio,
    absoluto, `//...`) tanto em `/auth/callback` quanto no próprio login.
    Médios: cadastro trocado por botão desabilitado ("Cadastro por convite
    em breve"), marca Siloé removida (confirmado por `grep`, zero
    ocorrências). Baixo: "Esqueceu a senha" virou texto informativo, não
    mais link morto.
  - Validado pelo Arquiteto (independente do relato do Codex, DEC-022):
    `npm run build` ok, `grep` confirma zero resíduo de Siloé nos arquivos
    tocados.
  - Commit `aad13a3` em `tarefa/SEC-01-auth`.
  - `BACKLOG-OPERACIONAL.md`: `SEC-01` → `Revisao`, pronto para o QA de
    Reinaldo.
- **Evidência:** build e grep acima; leitura completa do arquivo
  `app/(auth)/login/page.tsx` e `app/auth/callback/route.ts`.
- **Portão automático:** build ok · lint focado nos arquivos alterados ok
  (lint global segue com baseline pré-existente QUA-01, fora de escopo) ·
  types ok (parte do build) · testes n/a · isolamento n/a.
- **Pendências:** QA de Reinaldo no SEC-01; recuperação de senha e convite
  reais continuam fora de escopo até `TEN-01`.
- **Riscos / bloqueios:** nenhum novo.
- **Próximo passo:** Reinaldo faz o QA do SEC-01 (login real, ida e volta
  de sessão) quando conveniente.
- **Arquivos tocados:** `docs/operacao/BACKLOG-OPERACIONAL.md`,
  `docs/operacao/STATUS-REPORT.md` (branch OPS-01);
  `app/(auth)/login/page.tsx`, `app/auth/callback/route.ts` (branch
  SEC-01-auth, commit `aad13a3`).

---

## 2026-09-10 — Antigravity (Dev Frontend) — sessão 3
- **Tarefa / ID:** TAREFA-002 / OT-LANDING-LAPIDACAO — Lapidação visual da Landing Page para o público-alvo pastoral
- **Tipo:** 2 (refinamento visual e de tom de voz)
- **Decisões solicitadas ao Orquestrador:** nenhuma.
- **Entregas:**
  - `app/(marketing)/_components/hero.tsx`: eliminação de jargões técnicos ("SaaS", "Painel corporativo"), headline focada em *"Mais tempo para cuidar das pessoas. Menos tempo em planilhas"*, badge calorosa e mockup humanizado centrado no cuidado com famílias, células nos lares, cultos/escalas e prestação de contas com transparência.
  - `app/(marketing)/_components/modules-section.tsx`: módulos renomeados e descritos na perspectiva ministerial (Cuidado Pastoral & Membresia, Pequenos Grupos & Células, Agenda de Cultos & Escalas, Mural de Avisos e Tesouraria & Finanças com Transparência).
  - `app/(marketing)/_components/differentials-section.tsx`: diferenciais abordando as dores reais de pastores e secretárias (fácil como WhatsApp, funciona offline sem internet no templo, leve no celular e dados protegidos).
  - `app/(marketing)/_components/pricing-section.tsx`: apresentação clara, pastoral e transparente dos planos homologados (R$ 399,90 vitalício, R$ 69,90/mês, R$ 129,90/mês e R$ 249,90/mês).
  - `app/(marketing)/_components/faq-section.tsx`: perguntas reais de pastores e secretárias sem termos técnicos complicados.
  - `app/(marketing)/_components/cta-section.tsx` e `footer.tsx`: chamadas calorosas e acolhedoras para atendimento via WhatsApp e e-mail.
- **Evidência:**
  - ESLint: 0 erros, 0 avisos (`✔ No ESLint warnings or errors`).
  - TypeScript: `tsc --noEmit` executado com 0 diagnósticos.
  - Build: `npm run build` 100% verde (20 páginas estáticas geradas com sucesso).
  - Nenhum depoimento ou dado de cliente fabricado.
  - Nenhuma menção a "SaaS" ou terminologias frias.
- **Portão automático:** lint <ok> · types <ok> · build <ok> · testes <n/a> · isolamento <n/a>
- **Pendências:** nenhuma no frontend; entrega pronta na worktree `C:\Projetos\gestao-igreja-antigravity` sem commit/push (DEC-022) para validação do Arquiteto.
- **Riscos / bloqueios:** nenhum.
- **Próximo passo:** Arquiteto valida as alterações e executa o commit da lapidação.
- **Arquivos tocados:**
  - `app/(marketing)/_components/hero.tsx`
  - `app/(marketing)/_components/modules-section.tsx`
  - `app/(marketing)/_components/differentials-section.tsx`
  - `app/(marketing)/_components/pricing-section.tsx`
  - `app/(marketing)/_components/faq-section.tsx`
  - `app/(marketing)/_components/cta-section.tsx`
  - `app/(marketing)/_components/navbar.tsx`
  - `app/(marketing)/_components/footer.tsx`
  - `docs/operacao/STATUS-REPORT.md`

---

## 2026-09-10 — Claude (Arquiteto) — sessão 16
- **Tarefa / ID:** valida lapidação da Landing Page (Antigravity) +
  achado de processo (worktree)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** nenhuma nova.
- **Entregas:**
  - Revisão do conteúdo da lapidação: tom acolhedor, sem jargão, mockup
    humanizado, FAQ com perguntas reais de pastor/secretaria, nada
    fabricado — aprovado.
  - Ajuste do Arquiteto: `lib/brand.ts` (`tagline`/`description`)
    sincronizado com a nova copy do hero — estava divergente (hero usava
    string hardcoded em vez de `{brand.description}`), corrigido para
    manter fonte única.
  - Commit `18c39f4` em `tarefa/TAREFA-002-landing`.
  - **Achado de processo, 2ª ocorrência:** Antigravity voltou a operar na
    pasta principal (`C:\Projetos\Gestão Igreja`) — copiou arquivos entre
    a pasta principal e a worktree dele várias vezes (via PowerShell
    `Copy-Item`) para editar e depois validar. Isso deixou
    `app/(marketing)/`, `lib/brand.ts`, `lib/plans.ts` soltos (não
    rastreados) na pasta principal, e uma cópia desatualizada do
    `STATUS-REPORT.md` foi editada/copiada na worktree dele (a branch
    `tarefa/TAREFA-002-landing` não tem as sessões 6-15, criadas depois
    que a branch nasceu — divergência estrutural, não perda de dado).
    Arquivos soltos removidos da pasta principal; a entrada dele no
    Status Report foi preservada corretamente (já estava na pasta
    principal, na versão certa). Nada foi perdido, mas o padrão se repete
    — a instrução de kickoff sozinha não está bastando.
- **Evidência:** `npm run build`/`npm run lint` em `app/(marketing)/**`
  limpos na worktree `gestao-igreja-antigravity`.
- **Portão automático:** lint ok · types ok · build ok · testes n/a ·
  isolamento n/a.
- **Pendências:** QA visual de Reinaldo na Landing Page lapidada; resolver
  de vez a questão do isolamento de pasta com Codex/Antigravity.
- **Riscos / bloqueios:** risco de colisão de working tree persiste
  enquanto os agentes tiverem a pasta principal como referência acessível.
- **Próximo passo:** Reinaldo confere a Landing Page; decidir uma correção
  estrutural para o isolamento de pasta (ex.: instrução mais explícita no
  IDE de cada agente, ou outra abordagem).
- **Arquivos tocados:** `docs/operacao/BACKLOG-OPERACIONAL.md`,
  `docs/operacao/STATUS-REPORT.md` (branch OPS-01); `app/(marketing)/**`,
  `lib/brand.ts` (branch TAREFA-002-landing, commit `18c39f4`).

---

## 2026-09-10 — Claude (Arquiteto) — sessão 15
- **Tarefa / ID:** revisão de segurança do SEC-01 + reorganização de donos
  (OT-CODEX-DEMO, ADM-01)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** como corrigir o achado crítico
  do SEC-01 (papel client-side) sem esperar o `TEN-01` inteiro — aguardando
  resposta de Reinaldo.
- **Entregas:**
  - **Achado stray:** `docs/operacao/pesquisas/NEG-01-PRECOS.md` estava sem
    commit desde a entrega do Antigravity (falha do Arquiteto) — commitado
    nesta sessão.
  - **Achado de processo:** Antigravity entregou a pesquisa de preços
    direto em `C:\Projetos\Gestão Igreja` (pasta do Arquiteto), não na
    worktree isolada — não migrou como pedido no kickoff. Sinalizado a
    Reinaldo para confirmar.
  - **Revisão de segurança do SEC-01** (branch `tarefa/SEC-01-auth`, leitura
    completa de `proxy.ts`, `lib/supabase/*`, `app/(app)/layout.tsx`,
    `app/(auth)/login/page.tsx`, `app/auth/callback/route.ts`):
    - 🔴 **Crítico:** papel do usuário (`admin`, `secretaria`...) é
      escolhido na tela de login e gravado só em `localStorage`
      (`setStoredRole`) — sem checagem de servidor. Qualquer conta Supabase
      real pode se auto-elevar a "admin" na UI. Viola §17.1.
    - 🟠 **Alto:** open redirect em `app/auth/callback/route.ts` — parâmetro
      `next` da query string vai direto para
      `NextResponse.redirect(new URL(next, request.url))` sem validar que é
      caminho relativo.
    - 🟡 **Médio:** botão "Solicitar Cadastro" não chama
      `supabase.auth.signUp`, só simula sucesso (§10).
    - 🟡 **Médio:** tela de login ainda cita "Igreja Evangélica Siloé"
      (branch anterior à DEC-026).
    - 🟢 **Baixo:** "Esqueceu a senha?" sem ação (recuperação não
      implementada, já sabido).
  - `BACKLOG-OPERACIONAL.md`: SEC-01 → `Bloqueada` até a correção do
    crítico. `OT-CODEX-DEMO.md`: execução única do Codex, incluindo
    `proxy.ts`/`layout.tsx` (DEC-034 — Reinaldo simplificou a divisão em
    três). `ADM-01`: Arquiteto estrutura, Antigravity executa quando
    `TEN-01` destravar (DEC-035).
- **Evidência:** leitura direta dos arquivos citados na worktree
  `gestao-igreja-codex`.
- **Portão automático:** n/a (revisão de código, sem alteração ainda).
- **Pendências:**
  - Reinaldo: decidir a correção do achado crítico (proposta do Arquiteto:
    fixar papel em "membro" no login real até o TEN-01 trazer papel de
    verdade via RLS) e confirmar nome da rota do console ADM-01.
  - Codex: corrigir os achados quando autorizado.
  - Confirmar se Antigravity já está na worktree isolada.
- **Riscos / bloqueios:** SEC-01 não avança para QA enquanto o crítico não
  for corrigido.
- **Próximo passo:** aguardar decisão de Reinaldo sobre a correção;
  encaminhar ao Codex.
- **Arquivos tocados:** `docs/operacao/pesquisas/NEG-01-PRECOS.md`,
  `docs/operacao/DECISOES.md`, `docs/operacao/BACKLOG-OPERACIONAL.md`,
  `docs/operacao/ordens/OT-CODEX-DEMO.md`, `docs/operacao/STATUS-REPORT.md`.

---

## 2026-09-10 — Claude (Arquiteto) — sessão 14
- **Tarefa / ID:** NEG-01 — fecha preços de Essencial e Premium
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** nenhuma nova — Reinaldo já
  decidiu nesta sessão (DEC-033).
- **Entregas:**
  - `lib/plans.ts` (branch `tarefa/TAREFA-002-landing`): Essencial
    R$ 129,90/mês, Premium R$ 249,90/mês — sem mais `[EM DEFINIÇÃO]`.
    Commit `28bd65e`.
  - `DECISOES.md`: DEC-033. `BACKLOG-OPERACIONAL.md`: `NEG-01` → **Aceita**;
    `TAREFA-002` fica só esperando o QA de Reinaldo para virar `Aceita`.
- **Evidência:** `npm run build`/`npm run lint` no baseline pré-existente
  (27 erros/88 avisos, QUA-01, sem regressão).
- **Portão automático:** lint ok (baseline) · types ok · build ok · testes
  n/a · isolamento n/a.
- **Pendências:** QA visual de Reinaldo na Landing Page com os 4 preços
  reais; nome da rota do console ADM-01 (pergunta 4, ainda em aberto);
  implementação do caminho de teste (3 partes já divididas).
- **Riscos / bloqueios:** nenhum.
- **Próximo passo:** Reinaldo confere a Landing Page publicada/local; segue
  a implementação do modo demo.
- **Arquivos tocados:** `docs/operacao/DECISOES.md`,
  `docs/operacao/BACKLOG-OPERACIONAL.md`, `docs/operacao/STATUS-REPORT.md`
  (branch OPS-01); `lib/plans.ts` (branch TAREFA-002-landing).

---

## 2026-09-10 — Claude (Arquiteto) — sessão 13
- **Tarefa / ID:** validação das entregas de Codex e Antigravity + kickoff
  de implementação do caminho de teste
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** preço final de Essencial e
  Premium (Gestão Online) — ver pendências.
- **Entregas:**
  - **Validação independente das 2 escritas do Codex (DEC-024):**
    `get_advisors(security)` → `[]` (era 2 WARN); `homolog-echo` → HTTP 401
    sem sessão (era 404). Confirmado pelo Arquiteto via conector read-only +
    `curl`, não só pelo relato do Codex. `BACKLOG-OPERACIONAL.md` (OPS-01)
    atualizado.
  - **Revisão da spec `OT-CODEX-DEMO.md`:** aprovada, com um refinamento —
    sessão Supabase real sempre tem precedência sobre o cookie de modo demo
    (nunca o modo teste sobrepõe um usuário real logado). Definida a divisão
    de dono pra implementação: Arquiteto faz `proxy.ts` +
    `app/(app)/layout.tsx` (fronteira de auth, §3); Codex faz a rota
    `/teste`, o cookie e o renome do token; Antigravity faz o banner "Modo
    teste" e o CTA na Landing Page. Liberado para implementação.
  - **Pesquisa de preços do Antigravity (`NEG-01-PRECOS.md`):** 9
    concorrentes mapeados; sugestão Essencial R$ 119,90–149,90 (ponto
    central R$ 129,90) e Premium R$ 229,90–299,90 (ponto central R$ 249,90).
    Levada para decisão de Reinaldo — não decidida pelo Arquiteto (Tipo 1).
  - **Achado de processo:** Codex reportou que sua worktree está com os
    docs operacionais desatualizados (`CEREBRO-OPERACIONAL.md` ainda v1.2,
    `OT-CODEX-DEMO.md` nem existia lá) — branch `tarefa/SEC-01-auth` foi
    criada antes das atualizações de governança desta sessão, e worktrees
    não sincronizam sozinhos. Ele usou corretamente a versão lida na pasta
    do Arquiteto como fonte vigente. **Ainda sem correção estrutural** — a
    prática por ora é: agentes sempre conferem docs operacionais na pasta
    do Arquiteto (ou pedem o conteúdo), não confiam na cópia da própria
    branch.
- **Evidência:** `get_advisors`/`curl` acima; `docs/operacao/pesquisas/NEG-01-PRECOS.md`.
- **Portão automático:** n/a (validação + revisão de documentação).
- **Pendências:**
  - Reinaldo: decidir preço final de Essencial e Premium (ou ajustar a
    sugestão do Antigravity).
  - Implementação do caminho de teste (3 partes, conforme divisão acima).
  - Corrigir a sincronização de docs operacionais entre worktrees/branches.
- **Riscos / bloqueios:** nenhum novo.
- **Próximo passo:** aguardar decisão de preço; iniciar implementação do
  `proxy.ts`/`layout.tsx` (Arquiteto) assim que Codex/Antigravity
  confirmarem início das partes deles.
- **Arquivos tocados:** `docs/operacao/BACKLOG-OPERACIONAL.md`,
  `docs/operacao/ordens/OT-CODEX-DEMO.md`, `docs/operacao/STATUS-REPORT.md`.

---

## 2026-09-10 — Antigravity (Dev Frontend) — sessão 2
- **Tarefa / ID:** NEG-01 (insumo) — Pesquisa de mercado de preços de concorrentes (OT-NEG-01-PESQUISA)
- **Tipo:** 2 (pesquisa/insumo documental)
- **Decisões solicitadas ao Orquestrador (Tipo 1):**
  1. Definir os preços finais dos planos **Gestão Online — Essencial** e **Gestão Online — Premium** para substituir os literais `[EM DEFINIÇÃO]` em `lib/plans.ts`. Faixas sugeridas na pesquisa:
     - **Essencial:** R$ 119,90 a R$ 149,90/mês (Ponto central sugerido: **R$ 129,90/mês**).
     - **Premium:** R$ 229,90 a R$ 299,90/mês (Ponto central sugerido: **R$ 249,90/mês**).
- **Entregas:**
  - `docs/operacao/pesquisas/NEG-01-PRECOS.md`: levantamento com 9 concorrentes (Enuves, Igreja Digital, Sigreja/Sige Igrejas, Eklesia, Igreja Conectada, ePastor, Atos6, inChurch e ChurchTrac como benchmark internacional), análise comparativa, posicionamento das nossas ofertas (Modelo de Entrada vitalício a R$ 399,90 e Gestão Lite a R$ 69,90/mês) e justificativas econômicas para os níveis Essencial e Premium.
- **Evidência:**
  - Documento gerado com fontes públicas e dados atualizados de 2026.
  - Conformidade com §14 (Clean Code/documentação limpa), §16 (UTF-8 sem BOM) e §10 (nenhum dado pessoal/confidencial).
- **Portão automático:** lint <ok> · types <ok> · build <ok> · testes <n/a> · isolamento <n/a>
- **Pendências:** aguarda decisão de Reinaldo (Tipo 1) sobre os preços finais homologados para posterior atualização de `lib/plans.ts`.
- **Riscos / bloqueios:** nenhum.
- **Próximo passo:** Arquiteto valida a pesquisa e apresenta os valores para aprovação de Reinaldo.
- **Arquivos tocados:**
  - `docs/operacao/pesquisas/NEG-01-PRECOS.md` (novo)
  - `docs/operacao/STATUS-REPORT.md`

---

## 2026-09-10 — Claude (Arquiteto) — sessão 12
- **Tarefa / ID:** OPS-01 (export/.htaccess) + governança (worktrees) +
  DEC-026/027 (saída da Siloé, escopo do ADM-01)
- **Tipo:** 1
- **Decisões solicitadas ao Orquestrador:** nenhuma nova — Reinaldo decidiu
  tudo nesta sessão (Siloé sai do repo; escopo do console do proprietário).
- **Entregas:**
  - **Colisão de working tree (achado crítico):** Codex e Antigravity
    operam na mesma pasta física (`C:\Projetos\Gestão Igreja`) que o
    Arquiteto. Um `git checkout` concorrente do Antigravity, no meio desta
    sessão, trocou a branch da pasta principal sem eu saber, quase
    misturando o trabalho dele com o do OPS-01. Nenhum dado foi perdido
    (feito backup antes de qualquer ação de risco), mas o modelo de "cópia
    isolada = branch" não isola de verdade numa pasta compartilhada.
  - **Correção:** `git worktree` — cada agente ganha pasta própria, todas
    ligadas ao mesmo `.git`:
    - `C:\Projetos\Gestão Igreja` — Arquiteto (esta sessão), branch conforme
      a tarefa corrente.
    - `C:\Projetos\gestao-igreja-codex` — Codex, branch `tarefa/SEC-01-auth`
      (deps já instaladas via `npm install`).
    - `C:\Projetos\gestao-igreja-antigravity` — Antigravity, branch
      `tarefa/TAREFA-002-landing` (deps já instaladas).
    Nomes de pasta em ASCII (§16). Reinaldo precisa apontar os terminais do
    Codex e do Antigravity para as pastas novas.
  - **OPS-01:** `next.config.ts` (`output: "export"`, `trailingSlash: true`,
    `images.unoptimized`), `tsconfig.json` (exclui `supabase/functions/**`
    do typecheck do app — Deno é runtime separado), `public/.htaccess`
    (force HTTPS, cabeçalhos de segurança, cache imutável para
    `_next/static`, `no-store` para HTML/`sw.js`/`manifest.json`). Commit
    `9dbe27f`.
  - **DEC-026:** Reinaldo informou que o produto da Igreja Siloé migrou para
    outro projeto — removidos `app/(site)/page.tsx` e `lib/site-content.ts`
    (branch `tarefa/TAREFA-002-landing`, dentro do commit da Landing Page,
    `d779e50` — resolveu de quebra a colisão de rota que o Antigravity tinha
    sinalizado, já que `(marketing)` e `(site)` disputavam `/`).
    `PLAN-12` e `SIL-01` cancelados no backlog (obsoletos); `TAREFA-001` tem
    o escopo reduzido (só dado fictício remanescente, não mais o site).
  - **DEC-027:** escopo do `ADM-01` expandido — vendas, licenças, clientes
    (tenants), módulos contratados, MFA. Ainda em aberto: se entra antes ou
    depois de `TEN-01`/`SEC-01` (dependência técnica real: licença/cliente
    pressupõe noção de tenant).
  - `BACKLOG-OPERACIONAL.md` e `DECISOES.md` atualizados com tudo acima.
- **Evidência:** `npm run build` gera `out/` com `index.html` por rota e
  `.htaccess` copiado; lint no baseline pré-existente (27 erros/88 avisos,
  QUA-01, sem regressão) nas três pastas testadas.
- **Portão automático:** lint ok (baseline) · types ok · build ok · testes
  n/a · isolamento n/a.
- **Pendências:**
  - Reinaldo: apontar Codex e Antigravity para as pastas de worktree novas.
  - Rota de homologação mínima do OPS-01 (login + insert/select + Edge
    Function + Storage) — precisa de `@supabase/supabase-js` como
    dependência nova nesta branch (Tipo 1, package.json) — **parei antes de
    adicionar, aguardando confirmação** (ver próximo passo).
  - Decidir prioridade do `ADM-01` expandido frente a SEC-01/TEN-01 em
    andamento.
- **Riscos / bloqueios:** working tree compartilhada é risco enquanto os
  agentes não migrarem para as pastas de worktree — evitar rodar os três ao
  mesmo tempo na pasta antiga até a migração.
- **Próximo passo:** confirmar com Reinaldo a dependência nova
  (`@supabase/supabase-js`) para fechar a prova do OPS-01; migrar Codex e
  Antigravity para os worktrees; decidir sequência do ADM-01.
- **Arquivos tocados:** `next.config.ts`, `tsconfig.json`, `public/.htaccess`
  (branch OPS-01); `app/(marketing)/**`, `lib/plans.ts`, remoção de
  `app/(site)/page.tsx` e `lib/site-content.ts` (branch TAREFA-002-landing,
  ver sessão do Antigravity); `docs/operacao/BACKLOG-OPERACIONAL.md`,
  `docs/operacao/DECISOES.md`, `docs/operacao/STATUS-REPORT.md`.

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
