# Ordem de Trabalho — OT-TAREFA-002

## Identificação

- **ID / título:** TAREFA-002 — Landing Page comercial do SaaS (adiantada, DEC-025)
- **Etapa do plano (§8.2):** etapa 4, antecipada para o Ciclo 1
- **Tipo:** 1
- **Ciclo:** CICLO-01
- **Responsável:** Dev Frontend (Antigravity) — página; Arquiteto — `lib/brand.ts`
  mínimo (fundação, dele por dono de arquivo compartilhado, §3)
- **Revisor:** Arquiteto

## Objetivo

Uma página pública em rota **nova**, `app/(marketing)/`, que apresenta o
**produto SaaS** (não uma igreja específica), os planos e preços definidos em
`NEG-01`, pronta para publicação futura — sem depender de `TAREFA-001` nem
das fases B–E do roadmap.

**Atenção — não confundir com `app/(site)/page.tsx`:** essa rota já existe e
é o site público **da Igreja Siloé** (usa `lib/site-content.ts`, contatos e
ministérios da Siloé) — é a feature de página pública por tenant (`PUB-01`),
não a Landing Page comercial. **Não editar `app/(site)/` nesta OT.**

## Escopo

### Dentro

1. **`lib/brand.ts` mínimo (Arquiteto).** Nome, nome curto, descrição, contatos,
   e-mails, URLs — placeholder neutro (não é a limpeza completa de marca da
   `TAREFA-001`, só o suficiente para a Landing Page não ter string solta).
2. **Estrutura da página em `app/(marketing)/page.tsx` (Dev Frontend), rota
   nova, isolada de `app/(site)/`.** Seções: apresentação do produto SaaS,
   planos e preços (lendo de uma fonte única de dados — ver Contratos abaixo),
   chamada para contato/cadastro (sem funcionalidade real de checkout — é
   TAREFA-002/FAT-01 completos, fora de escopo aqui), rodapé com contatos de
   `lib/brand.ts`.
3. **Conteúdo dos planos.** Usar exatamente os dados definidos em `NEG-01`
   quando completos. **Enquanto `NEG-01` não estiver fechado, usar `[EM
   DEFINIÇÃO]` como placeholder visível nos campos que faltam (nunca inventar
   valor)** — ver pendência abaixo.
4. **Responsivo e acessível** (contraste, foco, teclado, mobile) — sem
   depender de revisão separada.

### Fora

- Checkout, pagamento ou qualquer integração de cobrança (FAT-01).
- Desvinculação completa da marca Siloé no app interno (TAREFA-001 segue
  como tarefa própria).
- Cadastro/onboarding real de tenant (TEN-01/SEC-01).
- Qualquer alegação de recurso não entregue (§10 — "nunca anunciar o que não
  foi homologado").

## Arquivos sob responsabilidade

- **Arquiteto:** `lib/brand.ts` (novo, mínimo).
- **Dev Frontend:** `app/(marketing)/` (rota nova) e seus componentes. **Não
  tocar em `app/(site)/`, `lib/site-content.ts` nem em `app/(app)/`,
  `app/(auth)/`** — são de outro escopo/dono.
- Branch: `tarefa/TAREFA-002-landing`, a partir de `main`.

## Dependências

- `lib/brand.ts` — criado dentro desta OT, não é bloqueio externo.
- `NEG-01` — preços de Essencial e Premium ainda não informados por Reinaldo.
  **Não bloqueia o início** (estrutura e planos já definidos — Entrada, Lite
  R$ 69,90, Gestão Online — podem entrar), mas bloqueia o **aceite final** da
  página (não publica com `[EM DEFINIÇÃO]` visível).

## Contratos e tipos afetados

- Novo `lib/brand.ts` (contrato simples: nome/descrição/contatos).
- Recomenda-se uma pequena fonte de dados tipada para os planos (ex.:
  `lib/plans.ts` ou dentro do módulo do site) para não espalhar preço em
  string solta pela UI — decisão de implementação do Dev Frontend, sem
  necessidade de aprovação extra por ser Tipo 2 dentro desta OT Tipo 1 já
  aprovada.

## Critério de aceite (verificável)

- [ ] Página acessível localmente (`npm run dev`) em rota própria, sem
      misturar com `app/(app)` (área logada) nem `app/(auth)`
- [ ] Todos os textos de marca/contato vêm de `lib/brand.ts` (nenhuma string
      solta de nome comercial)
- [ ] Planos exibidos batem com `NEG-01` no que já está definido; campos não
      definidos mostram `[EM DEFINIÇÃO]`, não valor inventado
- [ ] Responsivo (mobile/desktop) e acessível (contraste, foco, navegação por
      teclado)
- [ ] Nenhuma promessa de recurso não entregue (§10)
- [ ] Só ASCII em nomes de arquivo/identificadores; acentuação normal em UTF-8
      no texto visível (§16)
- [ ] Portão automático verde: lint, `tsc --noEmit`, `npm run build`

## Restrições (§10)

- Sem dado pessoal real, sem segredo de nenhuma espécie na página pública.
- Sem automação de deploy — publicação é manual e datada (§9), fora desta OT.
- Nada commitado/mesclado/publicado sem autorização expressa de Reinaldo na
  sessão (§6, §10) — Dev Frontend entrega pronto, Arquiteto valida e commita
  (DEC-022).

## Modelagem de ameaça (§17.7)

- **O que pode dar errado:** anunciar preço ou recurso errado antes de
  `NEG-01` fechar; vazar e-mail/contato real sem necessidade.
- **Quem seria afetado:** visitantes do site e a credibilidade comercial da
  marca nova.
- **Controle que mitiga:** placeholder explícito `[EM DEFINIÇÃO]` em vez de
  valor inventado; revisão do Arquiteto antes do commit confere que não há
  promessa não homologada.

## Plano de teste

- Manual/visual: navegar a página em desktop e mobile (viewport reduzido),
  captura de tela anexada ao aviso de entrega.
- Automatizado: `npm run build` cobre a rota nova.

## Plano de rollback

- Página nova e isolada — reverter é remover a rota/branch, sem efeito em
  outras áreas do app.

## Aprovação

- **Reinaldo:** [x] aprovada em 10/09/2026 (autorização direta na sessão,
  registrada em `DECISOES.md` DEC-025)
