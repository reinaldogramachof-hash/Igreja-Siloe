# Ordem de Trabalho — OT-NEG-01-PESQUISA

## Identificação

- **ID / título:** NEG-01 (insumo) — pesquisa de mercado de preços de concorrentes
- **Tipo:** 2 (pesquisa/insumo, não altera modelo de dados nem contrato)
- **Ciclo:** CICLO-01
- **Responsável:** Antigravity (Dev Frontend)
- **Revisor:** Arquiteto (consolida o insumo para Reinaldo decidir o preço)

## Objetivo

Levantar preços praticados por sistemas concorrentes de gestão de igrejas
(nacionais e, se relevante, internacionais adaptáveis) para embasar os
valores dos níveis **Essencial** e **Premium** do "Gestão Online" — os dois
únicos campos de `NEG-01` ainda como `[EM DEFINIÇÃO]` em `lib/plans.ts`.

## Escopo

### Dentro

1. Identificar de 4 a 8 concorrentes diretos (sistemas de gestão para
   igrejas/ministérios no Brasil — ex.: categorias como "ChMS" — Church
   Management Software) e, quando não houver concorrente nacional
   suficiente, sistemas internacionais com plano em real ou dólar
   convertido.
2. Para cada concorrente, registrar: nome, faixas de plano (nome de cada
   nível), preço de cada faixa, o que cada faixa inclui (nº de
   membros/usuários, módulos, suporte), modelo de cobrança (mensal/anual,
   por membro/fixo).
3. Posicionar onde o "Lite" (R$ 69,90) e o "Entrada" (R$ 399,90 vitalício) do
   produto já ficam nessa tabela comparativa — para verificar se já estão
   competitivos antes de sugerir os dois níveis que faltam.
4. Propor uma **faixa de preço** (não peça arredondada e definitiva — é
   insumo para Reinaldo decidir) para Essencial e para Premium, com a
   justificativa curta de por que aquela faixa faz sentido frente ao
   levantado.

### Fora

- Decidir o preço final — isso é Tipo 1, só Reinaldo.
- Alterar `lib/plans.ts` antes da decisão — os campos continuam
  `[EM DEFINIÇÃO]` até Reinaldo confirmar.
- Pesquisa de concorrência para o Lite/Entrada (já decididos).

## Entregável

Um documento curto (pode ser `docs/operacao/pesquisas/NEG-01-PRECOS.md`,
Antigravity cria a pasta se não existir) com: tabela comparativa dos
concorrentes, onde o produto já se posiciona, e a faixa sugerida para
Essencial e Premium com a justificativa. Sem commit/push (DEC-022) — entrega
pronta, avisa o Arquiteto.

## Restrições (§10)

- Fonte pública apenas (site do concorrente, página de preços). Não usar
  informação privada/confidencial de terceiros.
- Sem dado pessoal real.
- Se a pesquisa depender de acesso à internet que o ambiente do Antigravity
  não tiver, avisar o Arquiteto/Reinaldo em vez de inventar números.

## Aprovação

- **Reinaldo:** [x] aprovada em 10/09/2026 (autorização direta na sessão)
