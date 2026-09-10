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
| PLAN-12 | ~~Revisão v1.2 do plano (Siloé vira tenant)~~ | 1 | — | Arquiteto | Reinaldo | 1 | **Cancelada (DEC-026)** | — | obsoleta — Siloé migrou para outro projeto, premissa da DEC-014 superada |
| TAREFA-001 | Desvinculação da marca Igreja Siloé — escopo reduzido a dado fictício remanescente (mock-data, holidays), site já removido (DEC-026) | 1 | A9 / QUA-01 | Arquiteto + Dev Frontend | Arquiteto | 1 | Especificacao | — | OT-TAREFA-001 (a revisar antes de aprovar — escopo mudou) |
| SIL-01 | ~~Especificar sistema completo e personalizações Siloé~~ | 1 | 0 | Arquiteto + Reinaldo | Reinaldo | 1 | **Cancelada (DEC-026)** | — | obsoleta — sem tenant Siloé neste repositório |
| NEG-01 | Detalhar Lite, níveis superiores e critérios de teste | 1 | 0 | Reinaldo | — | 1 | **Aceita** | — | preços fechados (DEC-033): Entrada R$ 399,90 · Lite R$ 69,90/mês · Essencial R$ 129,90/mês · Premium R$ 249,90/mês. Critérios de teste/trial seguem via `OT-CODEX-DEMO.md` (caminho de demonstração) |
| OPS-01 | Homologar HostGator Plano M + frontend estático + Supabase | 1 | 0 | Arquiteto + Dev Backend | Arquiteto + Dev Frontend | 1 | Execucao | subdomínio + SSL ok; migração `homolog` **aplicada e validada**; `homolog` em Exposed schemas **ok**; `homolog-echo` **deployada e ativa** (401 sem sessão, confirmado independente) · `revoke execute` em `rls_auto_enable()` **feito** (`get_advisors(security)` → `[]`, confirmado independente); `next.config.ts` export + `.htaccess` **ok**; página de prova `/homolog` **ok**. Falta: runbook `OPS-01-HOMOLOGACAO.md` · prova A/B ponta a ponta com dois usuários no ambiente publicado · pacote `DEPLOY-*` · cleanup final | OT-OPS-01 · branch tarefa/OPS-01-homologacao |
| QUA-01 | Tratar lint, fonte, documentação e revisão mobile | 2 | 1 | Dev Frontend + Dev Backend | Arquiteto | — | Backlog | — | — |
| SEC-01 | Auth, recuperação, convite e logout reais | 1 | 1 | Arquiteto + Dev Backend | Arquiteto | 1 | Revisao | 5 achados da revisão de segurança **corrigidos e validados** (Codex + Arquiteto, DEC-037); falta QA de Reinaldo. Recuperação/convite reais seguem fora de escopo (dependem de TEN-01) | branch tarefa/SEC-01-auth (commit `aad13a3`) |
| TEN-01 | Organizações, vínculos e isolamento entre igrejas | 1 | 4 | Codex (exceção DEC-043) + Antigravity (tela) | Arquiteto | 1 | QA | migração aplicada no Supabase real (`20260910213004`); isolamento §8.3 **confirmado em produção-de-homologação** (5/5 casos, validado de forma independente pelo Arquiteto — `rls_enabled`/`rls_forced` = true, `get_advisors` limpo, tabela de teste não deixou resíduo); falta só a tela mínima em `/backoffice` (fase 3) e o QA de Reinaldo | TEN-01-ESPECIFICACAO.md · branch tarefa/TEN-01 (commit `330a77b`) |
| ADM-01 | Console exclusivo do proprietário: vendas, licenças, clientes (tenants) e módulos contratados + MFA (escopo expandido, DEC-027) | 1 | 4 | Dev Backend + Dev Frontend | Arquiteto + Dev Frontend | — | Backlog | TEN-01 — mantém a dependência (DEC-028); kickoff/spec do ADM-01 roda em paralelo ao desenho do TEN-01 (Fase D), conclusão na Fase F | — |
| MEM-01 | Membros e importação com validação | 2 | 1 | Dev Backend + Dev Frontend | Arquiteto | — | Backlog | TEN-01 | — |
| CEL-01 | Gestão de células e membros reais | 2 | 2 | Dev Backend + Dev Frontend | Arquiteto | — | Backlog | SEC-01, MEM-01 | — |
| ROT-01 | Agenda, reserva, aprovação e avisos reais | 2 | 2 | Dev Backend + Dev Frontend | Arquiteto | — | Backlog | SEC-01, MEM-01 | — |
| FIN-01 | Livro-caixa e prestação agregada | 1 | 2 | Dev Backend + Dev Frontend | Arquiteto + Dev Frontend | — | Backlog | TEN-01 | — |
| FAT-01 | Assinaturas, limites e eventos do gateway | 1 | 4 | Dev Backend | Arquiteto + Dev Frontend | — | Backlog | ADM-01 | — |
| PUB-01 | Identidade e página pública configurada (por tenant, genérica — feature já existe em `app/(app)/site/`) | 2 | 3 | Dev Frontend | Arquiteto | — | Backlog | TEN-01 | — |
| TAREFA-002 | Site comercial do SaaS — Landing Page adiantada (DEC-025) | 1 | 4 | Dev Frontend | Arquiteto | 1 | **Aceita** | `lib/brand.ts` — ok; NEG-01 — fechado (DEC-033); lapidação visual — **aprovada por Reinaldo**; 6º card (Eventos & Conferências) aplicado | OT-TAREFA-002 · branch tarefa/TAREFA-002-landing (commit `0f767ba`) |
| MARCA-LOGO | Criação do logotipo vetorial do produto | 1 | — | Dev Backend | Arquiteto + Reinaldo | 1 | **Aceita** | Aprovado por Reinaldo em contexto real na Landing Page (navbar + rodapé) | OT-CODEX-LOGO · branch tarefa/MARCA-LOGO (`9f549b7`) + tarefa/TAREFA-002-landing (`6ceb78b`) |
| REC-01 | Backup e recuperação de banco e arquivos | 1 | 1 | Arquiteto + Dev Backend | Arquiteto | — | Backlog | OPS-01 | — |
| SIL-02 | ~~Homologar entrega completa Siloé~~ | 1 | 3 | Reinaldo + Arquiteto | Reinaldo | — | **Cancelada (DEC-026)** | — | obsoleta |
| PIL-01 | Liberar licenças externas de teste após MVP | 1 | 6 | Reinaldo + Dev Backend | Arquiteto | — | Backlog | fundação comercial (ADM-01/FAT-01) | — |
| COM-01 | Repetir aquisição e implantação | 1 | 7 | Reinaldo | — | — | Backlog | PIL-01 | — |

> Responsável e revisor acima são **proposta do Arquiteto**. O Orquestrador
> confirma ou ajusta ao abrir cada ciclo em `ciclos/CICLO-NN.md`.
