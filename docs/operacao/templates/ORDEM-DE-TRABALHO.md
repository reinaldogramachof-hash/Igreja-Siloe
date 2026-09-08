# Ordem de Trabalho — OT-<ID>

Copiar para `docs/operacao/ordens/OT-<ID>.md` e preencher. O Arquiteto redige;
Reinaldo aprova antes da execução (Tipo 1 item a item; Tipo 2 em lote no ciclo).

## Identificação

- **ID / título:** <ID> — <título curto>
- **Etapa do plano (§8.2):** <etapa / achado>
- **Tipo:** 1 | 2
- **Ciclo:** CICLO-NN
- **Responsável:** <Arquiteto | Dev Backend | Dev Frontend | dupla>
- **Revisor:** <Arquiteto + agente distinto do implementador para segurança/financeiro>

## Objetivo

<Uma frase: o resultado observável quando a tarefa estiver pronta.>

## Escopo

- **Dentro:** <itens>
- **Fora:** <itens explicitamente fora>

## Arquivos sob responsabilidade

<Lista de caminhos. Se tocar arquivo de outro domínio, indicar o Arquiteto como
responsável de integração.>

## Dependências

<IDs que precisam estar em `Aceita`. Não iniciar antes disso.>

## Contratos e tipos afetados

<Mudanças em `types.ts` / `index.ts` de módulo, esquema de banco, contrato de API.
Nenhuma mudança de contrato sem o Arquiteto.>

## Critério de aceite (verificável)

- [ ] <condição objetiva 1>
- [ ] <condição objetiva 2>
- [ ] Portão automático verde (lint, types, build, testes, isolamento quando aplicável)

## Restrições (§10)

<Restrições específicas além das gerais.>

## Modelagem de ameaça (se toca auth, tenant, dinheiro ou dado pessoal — §17.7)

<Ver `templates/MODELAGEM-DE-AMEACA.md`. O que pode dar errado, quem é afetado,
qual controle mitiga, qual teste prova.>

## Plano de teste

<Testes automatizados e verificação manual/visual. Casos do §8.3 do plano quando
aplicável.>

## Plano de rollback (se migração ou infra)

<Script/passos para reverter.>

## Aprovação

- **Reinaldo:** [ ] aprovada em ____/____/____
