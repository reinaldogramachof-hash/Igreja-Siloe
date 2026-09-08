# Backlog operacional

Board vivo. Deriva do §8.2 do plano estratégico (fonte de IDs — DEC-011), somado
às tarefas de governança. Atualizado pelo agente responsável ao mudar de etapa e
pelo Orquestrador ao priorizar um ciclo.

## Estados

`Backlog` → `Especificacao` (Arquiteto redigindo a OT) → `Aprovada` (Reinaldo
aprovou a OT) → `Execucao` → `Portao` (portão automático) → `Revisao` → `QA`
(Reinaldo validando) → `Aceita` → `Merge` (na `main`) → `Deploy` (pacote
aprovado). Fora do fluxo: `Bloqueada`.

## Como atualizar

1. Ao iniciar, mude o estado e preencha `Ciclo` e `PR`.
2. Toda mudança de estado gera uma linha no `STATUS-REPORT.md`.
3. `Depende de` segue o §8.2 do plano; não iniciar item com dependência fora de
   `Aceita`.

## Quadro

| ID | Trabalho | Tipo | Etapa plano | Responsável | Revisor | Ciclo | Estado | Depende de | PR / evidência |
|---|---|---|---|---|---|---|---|---|---|
| PLAN-12 | Revisão v1.2 do plano (Siloé vira tenant) | 1 | — | Arquiteto | Reinaldo | — | Backlog | DEC-014 | — |
| TAREFA-001 | Desvinculação da marca Igreja Siloé | 1 | A9 / QUA-01 | Arquiteto + Dev Frontend | Arquiteto | — | Backlog | — | — |
| SIL-01 | Especificar sistema completo e personalizações Siloé | 1 | 0 | Arquiteto + Reinaldo | Reinaldo | — | Backlog | — | — |
| NEG-01 | Detalhar Lite, níveis superiores e critérios de teste | 1 | 0 | Reinaldo | — | — | Backlog | — | — |
| OPS-01 | Homologar HostGator Plano M + frontend estático + Supabase | 1 | 0 | Arquiteto + Dev Backend | Arquiteto | — | Backlog | SIL-01 | — |
| QUA-01 | Tratar lint, fonte, documentação e revisão mobile | 2 | 1 | Dev Frontend + Dev Backend | Arquiteto | — | Backlog | — | — |
| SEC-01 | Auth, recuperação, convite e logout reais | 1 | 1 | Arquiteto + Dev Backend | Arquiteto + Dev Frontend | — | Backlog | OPS-01 | — |
| TEN-01 | Organizações, vínculos e isolamento entre igrejas | 1 | 4 | Arquiteto + Dev Backend | Arquiteto + Dev Frontend | — | Backlog | SEC-01 | — |
| ADM-01 | Console exclusivo do proprietário + MFA | 1 | 4 | Dev Backend + Dev Frontend | Arquiteto + Dev Frontend | — | Backlog | TEN-01 | — |
| MEM-01 | Membros e importação com validação | 2 | 1 | Dev Backend + Dev Frontend | Arquiteto | — | Backlog | SEC-01 (Siloé) / TEN-01 (SaaS) | — |
| CEL-01 | Gestão de células e membros reais | 2 | 2 | Dev Backend + Dev Frontend | Arquiteto | — | Backlog | SEC-01, MEM-01 | — |
| ROT-01 | Agenda, reserva, aprovação e avisos reais | 2 | 2 | Dev Backend + Dev Frontend | Arquiteto | — | Backlog | SEC-01, MEM-01 | — |
| FIN-01 | Livro-caixa e prestação agregada | 1 | 2 | Dev Backend + Dev Frontend | Arquiteto + Dev Frontend | — | Backlog | SEC-01 (Siloé) / TEN-01 (SaaS) | — |
| FAT-01 | Assinaturas, limites e eventos do gateway | 1 | 4 | Dev Backend | Arquiteto + Dev Frontend | — | Backlog | ADM-01 | — |
| PUB-01 | Identidade e página pública configurada | 2 | 3 | Dev Frontend | Arquiteto | — | Backlog | SEC-01 (Siloé) / TEN-01 (SaaS) | — |
| TAREFA-002 | Site comercial do SaaS (`app/(site)`) | 1 | 4 | Dev Frontend | Arquiteto | — | Backlog | TAREFA-001 | — |
| REC-01 | Backup e recuperação de banco e arquivos | 1 | 1 | Arquiteto + Dev Backend | Arquiteto | — | Backlog | OPS-01 | — |
| SIL-02 | Homologar entrega completa Siloé | 1 | 3 | Reinaldo + Arquiteto | Reinaldo | — | Backlog | SIL-01 + módulos contratados | — |
| PIL-01 | Liberar licenças externas de teste após MVP | 1 | 6 | Reinaldo + Dev Backend | Arquiteto | — | Backlog | SIL-02, fundação comercial | — |
| COM-01 | Repetir aquisição e implantação | 1 | 7 | Reinaldo | — | — | Backlog | PIL-01 | — |

> Responsável e revisor acima são **proposta do Arquiteto**. O Orquestrador
> confirma ou ajusta ao abrir cada ciclo em `ciclos/CICLO-NN.md`.
