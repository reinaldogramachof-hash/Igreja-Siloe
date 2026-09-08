# Ordem de Trabalho — OT-PLAN-12

## Identificação

- **ID / título:** PLAN-12 — Revisão v1.2 do plano estratégico (Siloé como tenant #1)
- **Etapa do plano (§8.2):** transversal — decorre de DEC-013, DEC-014, DEC-020
- **Tipo:** 1
- **Ciclo:** CICLO-01
- **Responsável:** Arquiteto (Claude)
- **Revisor:** Reinaldo

## Objetivo

O `docs/PLANO-ESTRATEGICO-SAAS-2026-09-06.md` passa a refletir que o repositório é
a linha de produto SaaS e a Igreja Siloé é o **primeiro cliente/tenant**, não uma
entrega comercial separada; e que TEN-01 (isolamento) precede as rotinas.

## Escopo

- **Dentro:** nova revisão v1.2 do documento — bloco "Decisões incorporadas na
  versão 1.2" (com data e referência a DEC-013/014/020) e ajustes pontuais em:
  §2.2 (sequência do produto e cliente inicial), §8 (Etapas 0–4 do roadmap),
  §8.1 (escopo do primeiro produto vendável), §8.2 (nota sobre a ordem de TEN-01)
  e o cabeçalho de versão.
- **Fora:** seções de mercado, preço e economia (§2.1, §3, §4); números de
  cenário; qualquer mudança de escopo de entrega; renomear o arquivo.

## Arquivos sob responsabilidade

- `docs/PLANO-ESTRATEGICO-SAAS-2026-09-06.md`

## Dependências

Nenhuma — DEC-014 e DEC-020 já aprovadas.

## Contratos e tipos afetados

Nenhum (documento).

## Critério de aceite (verificável)

- [ ] §2.2, §8, §8.1 e §8.2 coerentes com DEC-013/014/020
- [ ] Bloco de decisões v1.2 adicionado, com data e referência às DECs
- [ ] Sem contradição remanescente entre "entregar Siloé primeiro como contrato
      separado" e "Siloé é tenant #1"
- [ ] Histórico técnico e achados A1–A10 preservados
- [ ] Verificação manual de mojibake (§16) registrada no STATUS-REPORT.md

## Restrições (§10)

Documento, sem código. A v1.2 acrescenta e reconcilia; não apaga conteúdo
histórico.

## Modelagem de ameaça

N/a — não toca auth, tenant, dinheiro ou dado pessoal.

## Plano de teste

Revisão de leitura por Reinaldo; diff revisado.

## Plano de rollback

Reverter o commit do documento.

## Aprovação

- **Reinaldo:** [ ] aprovada em ____/____/____
