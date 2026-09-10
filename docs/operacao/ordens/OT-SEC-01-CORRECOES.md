# Ordem de Trabalho — OT-SEC-01-CORRECOES

## Identificação

- **ID / título:** correções da revisão de segurança do SEC-01
- **Tipo:** 1 (autenticação/autorização)
- **Ciclo:** CICLO-01
- **Responsável:** Codex (Dev Backend)
- **Revisor:** Arquiteto

## Objetivo

Corrigir os achados da revisão de segurança do Arquiteto (`STATUS-REPORT.md`,
sessão 15) na branch `tarefa/SEC-01-auth`, para destravar o estado
`Bloqueada` no `BACKLOG-OPERACIONAL.md`.

## Escopo — em ordem de prioridade

### 1. 🔴 Crítico — papel do usuário não pode vir do cliente

Em `app/(auth)/login/page.tsx`, o formulário de login real (com e-mail e
senha do Supabase) deixa o usuário **escolher o papel** (Admin, Líder,
Membro...) antes de entrar, e isso é gravado só em `localStorage`
(`setStoredRole(role)`) sem nenhuma verificação de servidor. Qualquer conta
Supabase real pode virar "Admin" na UI.

**Correção decidida por Reinaldo:** até o `TEN-01` trazer o modelo de papel
via RLS (vínculo usuário↔organização↔papel no banco), o login real **sempre**
fixa o papel em `"membro"` — remover a seleção de papel (os 3 cartões +
sub-seleção de liderança) do formulário de login com credenciais reais.
`setStoredRole("membro")` direto, sem depender de estado escolhido pelo
usuário.

*(A seleção de papel client-side pode continuar existindo em outro lugar
como demonstração/protótipo sem sessão real — só não pode influenciar o
resultado de um login autenticado de verdade.)*

### 2. 🟠 Alto — open redirect em `/auth/callback`

Em `app/auth/callback/route.ts`, o parâmetro `next` da query string vai
direto para `NextResponse.redirect(new URL(next, request.url))`. Validar
que `next` é um caminho relativo antes de usar — rejeitar (ou ignorar,
caindo no padrão `/dashboard`) qualquer valor que comece com `http`, `//`,
ou que não comece com `/`.

### 3. 🟡 Médio — cadastro simulado

O botão "Solicitar Cadastro de Membro" não chama `supabase.auth.signUp`,
só finge sucesso (`setRegisterSubmitted(true)`). Duas saídas possíveis —
escolha a mais simples de implementar corretamente agora:
- (a) implementar `supabase.auth.signUp` de verdade; ou
- (b) se cadastro aberto não é para agora (convite é fluxo separado,
  `SEC-01` original menciona "convite"), desabilitar o botão/trocar o texto
  para não implicar que algo foi processado quando não foi.

### 4. 🟡 Médio — marca Siloé residual

Textos "Igreja Evangélica Siloé" e o alt da logo em
`app/(auth)/login/page.tsx` — trocar por texto neutro (ex.: nome genérico
do produto). `lib/brand.ts` ainda não existe nesta branch (está em
`tarefa/TAREFA-002-landing`) — não importe de lá; use string neutra direta
por enquanto, a integração com `lib/brand.ts` acontece quando as branches
convergirem.

### 5. 🟢 Baixo — "Esqueceu a senha?"

Sem handler, não faz nada. Remover o link/trocar por texto sem link até a
recuperação de senha ser implementada (fora do escopo desta OT).

## Restrições (§10)

- Não commitar nem dar push (DEC-022) — entregar pronto na worktree
  `C:\Projetos\gestao-igreja-codex`, avisar o Arquiteto.
- Rodar o portão automático localmente (lint, `tsc --noEmit`, `npm run
  build`) antes de avisar que terminou.

## Aprovação

- **Reinaldo:** [x] linha de correção do item 1 confirmada em 10/09/2026;
  itens 2-5 seguem a mesma autorização (achados da revisão já reportada)
