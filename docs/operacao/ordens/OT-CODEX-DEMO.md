# Ordem de Trabalho — OT-CODEX-DEMO

## Identificação

- **ID / título:** caminho de teste/validação do sistema via Landing Page
  (dados mockados)
- **Tipo:** 1 (toca a fronteira com autenticação — proxy.ts/SEC-01 — mesmo
  que a implementação em si seja simples)
- **Ciclo:** CICLO-01
- **Responsável:** Codex (Dev Backend) — **nesta fase, só desenho/spec, não
  código ainda**
- **Revisor:** Arquiteto

## Objetivo

Um visitante que chega pela Landing Page consegue, sem criar conta real,
entrar no app interno com **dados fictícios** (mockados) para avaliar o
produto — navegando como um dos papéis (admin, secretaria, tesoureiro,
líder de célula, líder de louvor, líder de salas, membro).

## Contexto que já existe (não reinventar)

O app **já tem** um sistema de demonstração pronto:
- `lib/prototype-auth.ts` — `useDemoUser()`, troca de papel via
  `localStorage` (chave hoje é `siloe-demo-role`, **precisa virar
  `app-demo-role`** — já era item pendente da `TAREFA-001`, achado A7 do
  levantamento original).
- `lib/mock-data.ts` — dados fictícios por papel (`demoUsersByRole`).

O que falta é o **caminho de entrada** a partir da Landing Page e a forma
como isso convive com a autenticação real (`tarefa/SEC-01-auth`: `proxy.ts`
protegendo `/dashboard` e demais rotas internas, exigindo sessão Supabase).

## Escopo desta OT (fase de desenho)

### Perguntas que a spec do Codex precisa responder

1. **Rota de entrada:** uma página nova (ex.: `/teste` ou `/demo`) com
   seleção de papel, que já existe hoje implicitamente (o app cai em
   "membro" por padrão sem tela de escolha)? Ou reaproveitar/expor a seleção
   de papel que já deve existir em algum canto do protótipo?
2. **Convivência com o `proxy.ts` do SEC-01:** o middleware vai exigir
   sessão Supabase real em `/dashboard` etc. Como o modo de teste acessa
   essas mesmas rotas sem essa sessão, **sem abrir brecha de segurança** para
   o caminho de produção? (ex.: um cookie/flag de "modo demo" que o
   middleware reconhece e trata à parte — nunca reaproveitar sessão real).
3. **Isolamento de dado:** como garantir, no código e na revisão, que o modo
   demo nunca lê/escreve no Supabase real (nem por engano) — deve operar 100%
   sobre `lib/mock-data.ts`/`localStorage`.
4. **Sinalização visual:** como deixar claro na tela (banner, watermark) que
   é ambiente de teste, para não confundir com dado real (§10 — nunca
   anunciar/parecer produção).
5. **Expiração/reset:** o teste precisa expirar ou resetar em algum momento,
   ou fica indefinido enquanto o visitante quiser?
6. **Renome do token:** aplicar `siloe-demo-role` → `app-demo-role` (e
   qualquer outro identificador com `siloe` neste sistema) como parte desta
   frente, já que o Codex vai mexer exatamente aqui.

### Fora desta fase

- Implementar o código — só depois da spec revisada pelo Arquiteto (o
  `proxy.ts` é fronteira de autenticação, arquivo compartilhado/fundação,
  §3 — qualquer mudança nele passa pelo Arquiteto como responsável de
  integração).
- Ligar o modo teste a licença/trial real com prazo (isso é `PIL-01`,
  fase H do roadmap) — aqui é só demonstração ilimitada e não-comprometida.

## Entregável desta OT

Um documento curto de spec (`docs/operacao/ordens/OT-CODEX-DEMO.md` mesmo,
Codex complementa nesta seção, ou um arquivo próprio referenciado aqui)
respondendo as 6 perguntas acima, mais o desenho da rota/fluxo. Sem
commit/push (DEC-022) — entrega pronta, avisa o Arquiteto, que revisa e,
se aprovado, abre a OT de implementação.

## Restrições (§10)

- Modo demo nunca acessa Supabase real, nem lê `.env` de produção.
- Nenhum dado pessoal real em nenhuma hipótese no fluxo de teste.
- Não implementar ainda — esta OT é só a spec.

## Spec entregue pelo Codex (2026-09-10)

1. **Rota de entrada:** `/teste`, pública, vinda da Landing Page, com
   seleção explícita de papel — não reaproveita `/login`.
2. **Convivência com `proxy.ts`:** não abrir `/dashboard` só por
   `localStorage`. Cookie de servidor `app-demo-mode`/`app-demo-role`,
   validado por whitelist de papéis, reconhecido pelo middleware antes da
   checagem Supabase. `app/(app)/layout.tsx` também precisa reconhecer o
   modo demo e pular `supabase.auth.getUser()` — o proxy sozinho não basta.
3. **Isolamento de dado:** nenhuma chamada Supabase nas rotas internas
   quando em modo demo — só `lib/mock-data.ts` + `localStorage`. Sugere
   teste que falha se houver qualquer chamada a `*.supabase.co` durante
   navegação demo.
4. **Sinalização visual:** banner persistente "Modo teste — dados
   fictícios" em todo o shell interno, com ação de sair/resetar.
5. **Expiração/reset:** sem prazo comercial; sessão técnica via cookie de
   24h, renovável reentrando por `/teste`; reset limpa cookie e
   `localStorage`.
6. **Renome do token:** `siloe-demo-role` → `app-demo-role`,
   `siloe-demo-role-change` → `app-demo-role-change`. Scan encontrou outras
   referências `siloe` fora de docs (cruza com `TAREFA-001`) — Codex
   propositalmente não mexeu nelas sem aprovação explícita.

## Revisão do Arquiteto — aprovado com um refinamento

Spec sólida, aprovada para implementação. Um ponto a fechar antes de
codificar: **precedência quando os dois cookies coexistem** — um usuário
com sessão Supabase real (tenant de verdade, já logado) que também tem um
cookie `app-demo-mode` antigo no navegador **nunca** pode ver o modo demo
sobrepor a sessão real. Regra: sessão Supabase real, quando presente, **sempre
vence** o cookie de demo — o middleware checa sessão real primeiro; só cai no
modo demo se não houver sessão real.

## Divisão de dono para a implementação (§3)

`proxy.ts` e `app/(app)/layout.tsx` são "camada de auth" — arquivo
compartilhado/fundação, dono é o Arquiteto (tabela do §3). Divisão:

- **Arquiteto:** ajuste em `proxy.ts` e `app/(app)/layout.tsx` (precedência
  sessão real > cookie demo; reconhecer e validar o cookie).
- **Codex:** rota `/teste` (seleção de papel, emissão do cookie
  `app-demo-mode`/`app-demo-role`, reset), renome do token
  (`siloe-demo-role` → `app-demo-role`), teste que falha em chamada a
  `*.supabase.co` durante navegação demo.
- **Antigravity:** banner "Modo teste — dados fictícios" no shell interno
  (com ação de sair/resetar) e o link/CTA na Landing Page apontando para
  `/teste`.

Cada um entrega pronto na própria worktree, sem commit/push (DEC-022); o
Arquiteto integra os três pedaços e valida o conjunto antes de commitar.

## Aprovação

- **Reinaldo:** [x] aprovada em 10/09/2026 (autorização direta na sessão)
- **Spec de implementação:** [x] aprovada pelo Arquiteto em 10/09/2026, com
  o refinamento de precedência acima
