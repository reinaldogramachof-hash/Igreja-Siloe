# Ordem de Trabalho — OT-LANDING-LAPIDACAO

## Identificação

- **ID / título:** lapidação visual da Landing Page para o público-alvo
- **Tipo:** 2 (refinamento visual dentro de uma OT já aprovada,
  `TAREFA-002`, sem mudar contrato/dado)
- **Ciclo:** CICLO-01
- **Responsável:** Antigravity (Dev Frontend)
- **Revisor:** Arquiteto

## Objetivo

Revisar `app/(marketing)/` e deixar a Landing Page mais **conectada com o
público-alvo real**: pastores, secretárias, tesoureiros e líderes de
ministério de igrejas evangélicas brasileiras — muitos sem domínio técnico,
que decidem contratar baseados em confiança, simplicidade percebida e senso
de comunidade, não em jargão de tecnologia.

## Contexto — o que já existe

Páginas em `app/(marketing)/_components/`: `navbar`, `hero`,
`modules-section`, `differentials-section`, `pricing-section`,
`faq-section`, `cta-section`, `footer`. Conteúdo funcional e correto (preços
reais, `lib/brand.ts`/`lib/plans.ts` como fonte), mas com leitura mais
"SaaS genérico" do que "para igreja":
- Badge do hero diz "Solução SaaS para Igrejas e Ministérios" — "SaaS" é
  jargão que o público-alvo não usa nem precisa ver.
- Hero mostra um mockup de dashboard (janela com métricas tipo "Membros &
  Famílias: Organizados") — comunica produto de software, não conecta com
  o dia a dia humano/comunitário de quem vai usar.
- Sem nenhum elemento de confiança/acolhimento (tom pastoral, linguagem que
  fale de cuidado com a igreja, não só "gestão").

## Escopo

### Dentro

1. Revisar tom de voz e headline do `hero.tsx` — menos "produto SaaS",
   mais linguagem que fale diretamente com quem cuida de uma igreja
   (ex.: focar em "tempo para cuidar das pessoas, não das planilhas" em vez
   de terminologia de software).
2. Reavaliar a apresentação visual do produto no hero — o mockup de
   dashboard pode continuar, mas considere se um elemento mais humano
   (ex.: ícones/ilustração ligados a comunidade, cuidado pastoral) ajuda
   mais do que outra tela de software.
3. Revisar `differentials-section.tsx` e `faq-section.tsx`: incluir/reforçar
   o que pastor e secretária realmente perguntam antes de confiar dado da
   igreja a um sistema novo — segurança dos dados, funcionamento sem
   internet/offline, facilidade para quem "não entende de tecnologia".
4. Paleta, tipografia e microcopy em geral — mais acolhedor, menos
   corporativo frio, mantendo a identidade de `lib/brand.ts`.
5. Mobile-first de verdade — parte relevante do público vai abrir isso no
   celular.

### Fora

- Mudar preços, planos ou textos de `lib/plans.ts`/`lib/brand.ts` (conteúdo
  já aprovado — DEC-033).
- Criar depoimento, logo de cliente ou qualquer prova social **fabricada**
  — não existe cliente real ainda. Se quiser prova social, usar linguagem
  aspiracional honesta ("feito para igrejas como a sua"), nunca inventar
  nome/depoimento.
- Prometer recurso não entregue (§10).
- Tocar `app/(site)/`, `app/(app)/`, `app/(auth)/` — fora do domínio desta OT.

## Entregável

Antes/depois (captura de tela ou vídeo, desktop e mobile) anexado ao aviso
de entrega — verificação visual reproduzível, não vale só ler o código
(regra do seu papel, §2.3). Sem commit/push (DEC-022); entrega pronta na
worktree `C:\Projetos\gestao-igreja-antigravity`, avisa o Arquiteto.

## Critério de aceite

- [ ] Nenhuma menção a "SaaS" ou jargão técnico equivalente na página
- [ ] Tom de voz identificável como voltado a igreja/comunidade, não a
      empresa de tecnologia genérica
- [ ] Responsivo e acessível (contraste, foco, teclado) mantidos
- [ ] Nenhum dado fabricado (depoimento, logo, número de clientes)
- [ ] Portão automático verde: lint, `tsc --noEmit`, `npm run build`

## Aprovação

- **Reinaldo:** [x] aprovada em 10/09/2026 (autorização direta na sessão)
