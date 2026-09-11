# TEN-01 — Especificação técnica: organizações, vínculos e isolamento

Especificação para aprovação de Reinaldo antes de qualquer código (Tipo 1 —
modelo de dados e autorização, §4). Kickoff em paralelo ao modo de teste do
Codex, conforme combinado.

## 1. Objetivo

Toda igreja (cliente) vira uma `organization` isolada por RLS. Todo dado do
produto (membros, células, agenda, avisos, financeiro, eventos) passa a
pertencer a uma organização — nenhum dado é global/compartilhado entre
igrejas. O papel de cada usuário (`admin`, `secretaria`, `tesoureiro`, líder
de célula/louvor/salas, `membro`) deixa de ser escolha do cliente
(`localStorage`, achado crítico do SEC-01, DEC-037) e passa a vir do banco,
por vínculo real.

**Critério de aceite de arquitetura (roadmap, Fase D):** igreja A não
lê/edita/exporta dado da igreja B, em nenhuma hipótese; metadados do
cliente (header, query string, corpo da requisição) não conferem
privilégio — a autorização é sempre resolvida no servidor a partir da
sessão.

## 2. Modelo de dados

```sql
-- Tenant
create table organizations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  status        text not null default 'trial'
                  check (status in ('trial', 'ativo', 'suspenso', 'cancelado')),
  plan_id       text,            -- referencia o plano (entrada/lite/essencial/premium) — FK real quando ADM-01/licenses existir
  created_at    timestamptz not null default now()
);

-- Vinculo usuario <-> organizacao <-> papel (substitui o localStorage)
create table memberships (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  role            text not null
                    check (role in ('admin','secretaria','tesoureiro',
                      'lider_celula','lider_louvor','lider_salas','membro')),
  status          text not null default 'ativo'
                    check (status in ('ativo','convidado','suspenso')),
  created_at      timestamptz not null default now(),
  unique (user_id, organization_id)
);

-- Uma organizacao por usuario no MVP (DEC-041): garante no banco, nao so
-- na aplicacao. Permite linhas historicas (status != 'ativo') para o
-- mesmo usuario, mas so uma 'ativo' por vez - elimina ambiguidade de
-- "organizacao atual" sem impedir o modelo crescer para multiplas depois.
create unique index memberships_uma_ativa_por_usuario
  on memberships (user_id)
  where status = 'ativo';
```

**Regra de isolamento:** toda tabela de dado de negócio (membros, células,
agenda, avisos, financeiro, eventos — hoje só existem como mock em
`lib/mock-data.ts`) ganha uma coluna `organization_id uuid not null
references organizations(id)`. RLS em cada uma:

```sql
create policy "isola_por_organizacao" on <tabela>
  for all to authenticated
  using (organization_id = (
    select organization_id from memberships
    where user_id = auth.uid() and status = 'ativo'
    limit 1
  ));
```

*(a subquery vira uma função `SECURITY DEFINER` `current_org_id()` reutilizada
em todas as policies, para não repetir a lógica em cada tabela — decisão de
implementação, não muda o modelo acima)*

**Papel decide o quê dentro da organização:** políticas adicionais por
tabela/coluna quando o papel importar (ex.: só `admin`/`tesoureiro` editam
financeiro) — desenhado tabela a tabela conforme cada módulo
(MEM-01/CEL-01/ROT-01/FIN-01) entrar, não tudo de uma vez aqui.

## 3. Uma organização por usuário — decidido (DEC-041)

**Confirmado por Reinaldo:** uma organização por usuário no MVP, garantida
no banco por índice único parcial (`memberships_uma_ativa_por_usuario`,
§2) — não só validação na aplicação. Um pastor que lidera duas igrejas usa
duas contas. `memberships` continua sendo tabela própria (não coluna em
`auth.users`), então crescer para múltiplas organizações por usuário mais
tarde não quebra o modelo, só relaxa o índice.

## 4. Bootstrap manual via `/backoffice` — decidido (DEC-042)

**Confirmado por Reinaldo:** sem self-service neste ciclo. Fluxo:
proprietário (via `/backoffice`) cria a `organization`, vincula o primeiro
usuário em `memberships` (destrava o botão "Cadastro por convite em breve"
que o Codex já deixou pronto no SEC-01) — login resolve tenant/papel a
partir disso. Self-service (cadastro público pós-pagamento, depende do
`FAT-01`/Mercado Pago) fica para uma frente própria, mais tarde.

## 5. Migração do SEC-01

O login real hoje fixa todo mundo em `"membro"` (DEC-037, correção
temporária). Com `memberships` existindo, o `proxy.ts`/`app/(app)/layout.tsx`
passam a consultar o papel de verdade (join com `memberships` pela sessão),
substituindo a nota "papel temporário" que está na tela de login. Não é
retrabalho — é exatamente o buraco que o DEC-037 deixou intencionalmente
aberto até o TEN-01 chegar.

## 6. Plano de teste (§8.3 do plano estratégico)

Casos obrigatórios antes do aceite, com dois usuários de organizações
diferentes:
- A não lê registro de B (`select` vazio/negado).
- A não edita registro de B (`update`/`delete` negados).
- A não exporta/lista registro de B em nenhuma tela.
- Trocar `organization_id` manualmente no corpo de uma requisição não muda
  o resultado — o servidor resolve pela sessão, nunca por dado do cliente.
- Usuário sem `membership` ativo não acessa nenhum dado de negócio (nega
  por padrão, §17.1).

## 7. Fora de escopo desta frente

- Telas/UI de cada módulo (Membros, Células, Agenda, Financeiro) —
  continuam em mock até `MEM-01`/`CEL-01`/`ROT-01`/`FIN-01`.
- `licenses`/`plan_modules`/`audit_log` completos do `ADM-01` — só o que
  `organizations` precisa para existir (`plan_id` como texto solto por
  ora, sem FK).
- Subdomínio por tenant (`siloe.plenaaplicativos.com.br` etc.) — isolamento
  aqui é lógico (RLS), não de infraestrutura. Entra com `PUB-01`/`FAT-01`
  se for necessário mais à frente.

## 8. Fases de implementação (dentro do TEN-01) — dono por fase

1. Migração `organizations` + `memberships` + RLS base — **Codex**.
2. `proxy.ts`/`app/(app)/layout.tsx` passam a resolver papel via
   `memberships` — **Codex, por exceção nominal ao §3 (DEC-043)**: o
   dono padrão de fronteira de auth é o Arquiteto, mas o TEN-01 cruza
   banco/RLS, resolução de tenant e proteção de rota — manter os três num
   dono só reduz risco de contrato incompleto entre a política de RLS e o
   código que a consome. **Não muda a regra geral do §3** — é escopo
   específico desta frente; qualquer outro arquivo compartilhado continua
   passando pelo Arquiteto como responsável de integração.
3. Tela mínima em `/backoffice` para o proprietário criar organização e
   convidar o primeiro admin (liga com ADM-01) — **Codex** (dados) +
   **Antigravity** (tela), o Arquiteto estrutura como já previsto em
   DEC-035.
4. Casos de teste do §8.3 executados e documentados — **Codex** implementa,
   **Arquiteto** revisa (§12/DEC-007, é segurança).

## Aprovação

- **Reinaldo:** [x] aprovado em 10/09/2026 — as 3 perguntas respondidas
  (DEC-041, DEC-042, DEC-043). Liberado para execução.
