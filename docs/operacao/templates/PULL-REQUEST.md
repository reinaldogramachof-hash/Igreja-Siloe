# Template de descrição de PR

Título: `<tipo>: <resumo>` (convencional — `feat`, `fix`, `docs`, `chore`,
`refactor`, `test`).

---

## ID

Vinculado a: `<ID>` — `docs/operacao/ordens/OT-<ID>.md`

## O que muda

<Resumo do comportamento antes e depois.>

## Como testar

<Passos para reproduzir o fluxo real.>

## Portão automático

- lint: <ok / n>
- typecheck: <ok / n>
- build: <ok / n>
- testes: <ok / n> (<contagem>)
- testes de isolamento (§8.3): <ok / n/a>

## Checklist (§6, §12)

- [ ] Critério de aceite da OT atendido
- [ ] Testes novos cobrem o critério de aceite
- [ ] Sem segredo nem dado pessoal real (código, fixtures, log)
- [ ] Sem `any` novo, sem `@ts-ignore` sem justificativa
- [ ] Só ASCII em nomes de arquivo, identificadores e slugs (§16)
- [ ] Migração com script de rollback (se aplicável)
- [ ] Evidência visual anexada (frontend)
- [ ] Modelagem de ameaça na OT (se toca auth/tenant/dinheiro/PII)

## Riscos

<O que pode quebrar; o que observar após o merge.>

## Revisores

- Arquiteto: <@>
- Segundo revisor (segurança/financeiro, distinto do implementador): <@>
