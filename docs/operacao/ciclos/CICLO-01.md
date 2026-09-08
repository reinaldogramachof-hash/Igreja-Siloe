# CICLO-01 — datas a definir por Reinaldo

Esqueleto. Aguarda priorização e datas do Orquestrador (dia 1 do ciclo).

## Objetivo proposto do ciclo

Destravar a fundação: registrar a mudança estratégica, desvincular a marca e
provar a hospedagem, deixando o repositório pronto para a fundação de código.

## Tarefas candidatas (proposta do Arquiteto)

| ID | Responsável | Revisor | Estado alvo no fim do ciclo | Observação |
|---|---|---|---|---|
| PLAN-12 | Arquiteto | Reinaldo | Aceita / Merge | Revisão v1.2 do plano: Siloé vira tenant; seções 2.2, 8, 8.1 |
| TAREFA-001 | Arquiteto + Dev Frontend | Arquiteto | Aceita / Merge | Desvinculação da marca; escopo já detalhado no `CEREBRO-OPERACIONAL.md` §13 |
| OPS-01 | Arquiteto + Dev Backend | Arquiteto | Especificação + prova iniciada | Depende de insumos da conta HostGator; pode não fechar no ciclo |

## Aprovações de OT

- [ ] `ordens/OT-PLAN-12.md` — redigida, aguardando aprovação
- [ ] `ordens/OT-TAREFA-001.md` — redigida, aguardando aprovação
- [ ] `ordens/OT-OPS-01.md` — bloqueada por insumos (ver abaixo)
- [ ] `ordens/OT-SIL-01.md` — bloqueada por insumos (ver abaixo)
- Tipo 2 aprovadas em lote em ____/____: —

## Situação em 2026-09-08

- Codex (Dev Backend) e Antigravity (Dev Frontend): ciência confirmada, read-back
  aceito pelo Arquiteto. Ambos aguardando OT aprovada.
- **Dependência OPS-01 × SIL-01 (ruling do Arquiteto):** a prova técnica de
  compatibilidade do OPS-01 (build estático, deploy no Plano M, rotas após
  recarga, HTTPS/cabeçalhos, ida-e-volta de auth no Supabase, uma escrita
  protegida + negação de acesso cruzado, atualização do PWA) **não depende** de
  SIL-01 aceita. SIL-01 só alimenta o conteúdo final publicado. OPS-01 e SIL-01
  correm em paralelo no Ciclo 1, como já previa o roadmap (DEC-020). O
  `BACKLOG-OPERACIONAL.md` foi ajustado.

## Insumos pendentes de Reinaldo

Para `OT-OPS-01`:
- Acesso ou instruções do cPanel do HostGator Plano M.
- Subdomínio de homologação (ex.: `homolog.<domínio-existente>`).
- Supabase: criar projeto novo de homologação (recomendado) ou usar existente?
  Há conta Supabase?
- Confirmar a lista mínima de operações da prova: login, leitura por tenant,
  escrita protegida, Edge Function, Storage, atualização do PWA/cache, recarga de
  rotas, build estático.
- Confirmar o ruling acima (OPS-01 não espera SIL-01).

Para `OT-SIL-01`:
- O que a Igreja Siloé usa hoje (planilha, sistema, papel).
- Número de operadores (secretaria, tesouraria, líderes).
- Tamanho da congregação e número de células reais.
- O que é inegociável na entrega da Siloé.
- Existe acordo escrito? O que "único/exclusivo" significa nele (§2.2 do plano).
- Autorização para usar o nome/caso Siloé em divulgação (ainda não informada).

Pré-requisito geral: **merge do PR `chore/cerebro-operacional-v1` para `main`**,
para as branches de tarefa saírem de uma base atualizada.

## QA (dias 4–5)

<A preencher.>

## Retrospecto

<A preencher no fecho do ciclo.>
