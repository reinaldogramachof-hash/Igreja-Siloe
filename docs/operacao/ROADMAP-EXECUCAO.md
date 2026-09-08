# Roadmap de execução

Aprovado por Reinaldo em 2026-09-08 (DEC-020). Encadeia o backlog do §8.2 do plano
estratégico com as tarefas de governança. **Sem datas** — o compromisso de 24
semanas foi aposentado pelo plano; recalibrar após o Ciclo 2 real (§11 do
`CEREBRO-OPERACIONAL.md`).

Board de estados por ID: `BACKLOG-OPERACIONAL.md`. Plano do ciclo corrente:
`ciclos/CICLO-NN.md`.

## Fases e gates

| Fase | Etapa do plano | Entregas | Gate para avançar |
|---|---|---|---|
| **A — Base limpa** | 0 + início da 1 | PLAN-12 (plano v1.2); TAREFA-001 (desmarcação); OPS-01 (prova HostGator Plano M + Supabase); SIL-01 (spec da Siloé como tenant #1); NEG-01 (limites do Lite) | Exportação estática provada no Plano M; repo sem marca Siloé; spec da Siloé aceita |
| **B — Fundação de código** | 1 | FUND-MODULOS (migração p/ `src/modules/`); FUND-TOOLING (`.gitattributes`, Prettier, mojibake, segredos, `npm audit` no portão); QUA-01 (lint 0 erros, fonte local, mobile) | Estrutura modular no lugar; portão automático completo e verde |
| **C — Identidade e sessão** | 1 | SEC-01 (auth real, convite, recuperação, logout que invalida); REC-01 (backup + ensaio de restauração) | Sessão expirada/revogada não acessa; convite não eleva privilégio; restauração ensaiada com tempos |
| **D — Isolamento multi-tenant** | 4 (antecipada) | TEN-01 (organizações, vínculos, RLS, todo registro pertence a uma org); ADM-01 kickoff | Casos §8.3: igreja A não lê/edita/exporta dados da B; metadados do cliente não conferem privilégio |
| **E — Rotinas prioritárias** | 2 | MEM-01 (membros + importação validada); CEL-01 (uma célula, encontros); ROT-01 (agenda, reserva, aprovação, avisos); FIN-01 (livro-caixa + prestação agregada, revisão dupla) | Ação de um operador aparece para outro; conflito recusado no banco; totais conciliam; estorno preserva histórico |
| **F — Fundação comercial** | 4 | ADM-01 (console exclusivo, planos, assinaturas, cobrança, auditoria, MFA); FAT-01 (webhooks idempotentes, atraso/cancelamento/reativação); PUB-01 (página pública por tenant); TAREFA-002 (site comercial do SaaS) | Admin de igreja não acessa console/API; webhook falso rejeitado; evento repetido idempotente; falha de pagamento não apaga igreja |
| **G — MVP + entrega Siloé** | 3 + 5 | SIL-02 (homologar Siloé como tenant #1, treinamento, doc); empacotar Essencial Lite; dimensionar limites (NEG-01) | Aceite documentado da Siloé; MVP sem falha crítica; materiais só descrevem o entregue |
| **H — Divulgação e conversão** | 6 + 7 | PIL-01 (licenças de teste em lote); COM-01 (aquisição manual, funil medido, primeiras renovações) | Ativação e feedback medidos; pagamentos e retenção reais |

### Desvio consciente do plano (aprovado — DEC-020)

TEN-01 (isolamento multi-tenant) vem **antes** das rotinas, não depois. O §8.2 do
plano permitia construir as rotinas single-tenant para a Siloé e endurecer
depois; com a DEC-014 (repo = linha SaaS, Siloé = tenant #1), fazer o multi-tenant
primeiro evita retrabalhar MEM-01/CEL-01/ROT-01/FIN-01.

## Alocação por ciclo (proposta — o Orquestrador confirma em `ciclos/CICLO-NN.md`)

| Ciclo | Foco | Arquiteto (Claude) | Dev Backend (Codex) | Dev Frontend (Antigravity) |
|---|---|---|---|---|
| 1 | Base limpa | PLAN-12; redigir as OTs; `lib/brand.ts`; kickoff SIL-01/OPS-01 | apoio OPS-01 (Supabase de homologação) | TAREFA-001: assets neutros + textos via `lib/brand.ts` |
| 2 | Fundação de código | FUND-MODULOS; revisões | FUND-TOOLING; migração da camada backend | QUA-01 (lint/fonte/mobile); migração da UI |
| 3–4 | Identidade e sessão | SEC-01 desenho + RLS base; REC-01 | SEC-01 auth/convite/logout; REC-01 | telas de auth, recuperação, convite |
| 5–6 | Multi-tenant | TEN-01 modelo + RLS; ADM-01 desenho | TEN-01 queries por tenant; casos §8.3 | contexto de tenant na UI; console (início) |
| 7–9 | Rotinas | revisão dupla FIN-01; contratos dos módulos | MEM-01 / CEL-01 / ROT-01 / FIN-01 (domínio e dados) | UI dos quatro módulos; acessibilidade |
| 10–11 | Comercial | FAT-01 desenho (idempotência, ciclo de vida) | ADM-01 conclusão; FAT-01 gateway/webhooks | console UI; PUB-01; TAREFA-002 |
| 12–13 | MVP + Siloé | homologação; pacote de deploy | ajustes de empacotamento do Lite | apresentação comercial fiel |
| 14+ | Testes e conversão | acompanhamento | instrumentação de ativação/conversão | materiais e ajustes |

## Tarefas derivadas ainda não no §8.2 do plano

| ID | Origem | Fase |
|---|---|---|
| PLAN-12 | DEC-014 — revisão v1.2 do plano | A |
| TAREFA-001 | DEC-013 — desvinculação da marca | A |
| TAREFA-002 | pergunta de escopo — site comercial do SaaS | F |
| FUND-MODULOS | DEC-015 — migração para `src/modules/` | B |
| FUND-TOOLING | DEC-018 — tooling do portão | B |

## Gatilhos do Ciclo 1

1. Merge do PR de governança para `main`.
2. Confirmar o Ciclo 1 em `ciclos/CICLO-01.md`: IDs, responsáveis, datas.
3. Insumos OPS-01: acesso ao cPanel do HostGator Plano M, domínios da conta,
   domínio candidato para a marca comercial.
4. Insumos SIL-01: o que a Igreja Siloé usa hoje, número de operadores, tamanho
   real da congregação, o que é inegociável na entrega dela.
5. Arquiteto redige `ordens/OT-PLAN-12.md`, `OT-TAREFA-001.md`, `OT-OPS-01.md`,
   `OT-SIL-01.md`; Reinaldo aprova; os devs entram em execução.
