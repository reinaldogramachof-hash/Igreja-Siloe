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

## Aprovação

- **Reinaldo:** [x] aprovada em 10/09/2026 (autorização direta na sessão)
