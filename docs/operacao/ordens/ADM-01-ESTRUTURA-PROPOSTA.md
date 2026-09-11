# ADM-01 — Estrutura proposta do console do proprietário

Kickoff/especificação (DEC-028): entra em paralelo ao desenho do `TEN-01`,
não à implementação de telas ainda. Objetivo desta etapa é fechar o **modelo
de dados** e a **estrutura do console**, para aprovação de Reinaldo, antes de
qualquer código.

## 1. Objetivo

Um console **exclusivo do proprietário** (Reinaldo), isolado do app das
igrejas, para: gestão de vendas/leads, controle de licenças, gestão de
clientes (tenants) e dos módulos que cada um contratou — com MFA obrigatório
no login.

**Critério de aceite de arquitetura (já no roadmap, Fase F):** um admin de
igreja (`role: admin` dentro de um tenant) **nunca** acessa este console nem
sua API, em nenhuma hipótese.

## 2. Modelo de dados (conceitual — a versão SQL entra com o `TEN-01`)

| Entidade | O que guarda | Observação |
|---|---|---|
| `organizations` | tenant/cliente: nome, slug, status (trial / ativo / suspenso / cancelado), data de criação | É **a mesma tabela** que o `TEN-01` precisa para isolamento por RLS — não duplicar. O Arquiteto desenha uma vez, para os dois. |
| `licenses` | vínculo org ↔ plano (Entrada/Lite/Essencial/Premium), status, ciclo de cobrança, datas de início/fim, referência externa de pagamento (Mercado Pago) | **Decidido:** todo plano gera licença rastreada, inclusive o Modelo de Entrada (vitalícia, sem ciclo de renovação, mas com registro — `licenses.tipo = 'vitalicia'` vs `'recorrente'`). Referência externa = `payment_id`/`preference_id` do Mercado Pago (formato exato entra na OT do `FAT-01`). |
| `plan_modules` | quais módulos (Membros, Células, Agenda, Avisos, Financeiro) cada plano libera por padrão | Fonte única para o Lite/Essencial/Premium não divergirem da Landing Page (`lib/plans.ts` hoje é só conteúdo de marketing — isso vira o contrato real). |
| `org_modules` | módulos contratados **por cliente**, quando difere do padrão do plano (upsell pontual) | Opcional na v1 — só necessário se o produto permitir módulo avulso fora do plano. |
| `customers` | contato comercial (nome, e-mail, telefone) ligado a uma `organization` | Pode nascer antes da organização existir (lead que ainda não converteu). |
| `leads` | prospects vindos da Landing Page (CTA "Consultar disponibilidade" / "Falar com consultor" / futuro caminho de teste do Codex) | Funil comercial — alimenta métricas do `COM-01` (Fase H) mais adiante. |
| `audit_log` | quem, o quê, quando, em qual org, resultado — toda mudança de plano/licença/módulo | Obrigatório por §17.5 do `CEREBRO-OPERACIONAL.md`; nunca apagar. |

## 3. Estrutura do console (rotas)

Fora de `app/(app)/` (área das igrejas) — área própria em
**`app/backoffice/`** (rota `/backoffice`, DEC-036). Distinto de
`app/(app)/admin/page.tsx`, que continua sendo a tela demonstrativa do
papel "admin" dentro de uma igreja — sem colisão de nome.

Seções propostas:
- **Visão geral** — clientes ativos, licenças vencendo, leads em aberto.
- **Clientes** — lista de organizações; detalhe: plano, módulos, usuários,
  status, histórico.
- **Vendas / Leads** — funil desde a Landing Page até a conversão.
- **Licenças** — emitir, renovar, suspender; base para o `PIL-01` (licenças
  de teste em lote, Fase H).
- **Módulos** — catálogo de módulos e o que cada plano inclui.
- **Configurações** — conta do proprietário, MFA.

## 4. Segurança

- **Decidido:** hoje só Reinaldo acessa, mas o desenho **já prevê controle
  de usuários** do console desde a v1 — não um `owner` único hardcoded.
  Tabela `console_users` (ou papel dedicado fora do modelo de tenant) com
  ao menos um nível "proprietário" (tudo) e espaço para níveis futuros mais
  restritos (ex.: suporte só lê clientes, não mexe em licença/preço). Evita
  o mesmo retrabalho que a DEC-028 já evitou para TEN-01/ADM-01 — construir
  certo uma vez.
- Papéis do console são **distintos** de qualquer papel dentro de um tenant
  — sem overlap de permissão (admin de igreja nunca vira `console_users`).
- MFA obrigatório no login deste console (Supabase Auth suporta TOTP).
- Nenhuma rota/endpoint deste console sem verificação no servidor (§17.1).
- Auditoria de toda ação (tabela `audit_log`), incluindo qual usuário do
  console fez o quê.

## 5. Relação com outras frentes

- **`TEN-01`**: fornece `organizations` e a base de RLS — ADM-01 é quem lê/
  escreve essa tabela pelo lado do proprietário.
- **`FAT-01`** (Fase F): processa webhook do gateway de pagamento e atualiza
  `licenses` — ADM-01 é a tela manual/override em cima disso.
- **`PUB-01`**: página pública por tenant não depende do console, mas o
  console é quem liga/desliga essa feature por cliente.
- **Caminho de teste do Codex** (`OT-CODEX-DEMO.md`): populariza `leads`
  quando o visitante testa o produto — não precisa de conta real.

## 6. Fases (conforme DEC-028)

1. **Agora (kickoff):** este documento — aprovação de Reinaldo do modelo e
   da estrutura, sem código.
2. **Fase D (com TEN-01):** criar `organizations` de verdade + RLS.
   `licenses`/`plan_modules`/`audit_log` entram junto ou logo depois,
   conforme a ordem que o Arquiteto detalhar na OT de TEN-01.
3. **Fase F:** construir as telas do console, MFA, `FAT-01` (gateway).

## 7. Perguntas — respondidas por Reinaldo em 2026-09-10

1. ~~Gateway de pagamento~~ — **Mercado Pago.** `FAT-01` desenha o webhook
   em cima da API do Mercado Pago (assinatura/checkout, notificação IPN ou
   webhook v2, a confirmar na OT do `FAT-01`).
2. ~~Modelo de Entrada gera licença rastreada?~~ — **Sim**, todo plano
   (inclusive Entrada) gera registro em `licenses`.
3. ~~Mais alguém acessa o console?~~ — **Só Reinaldo por hora**, mas o
   desenho já prevê `console_users`/controle de acesso desde a v1 (não
   hardcoded para um único dono) — ver §4.
4. ~~Nome definitivo da rota~~ — **`/backoffice`** (DEC-036).

**Todas as 4 perguntas fechadas.** Modelo de dados, segurança e estrutura
de rotas aprovados por completo — pronto para a Fase D quando `TEN-01`
destravar (DEC-028).

## Aprovação

- **Reinaldo:** [x] modelo de dados, estrutura e segurança aprovados em
  10/09/2026. Pendência: item 4 (nome da rota) antes da implementação.
