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

## 3. Decisão que preciso da sua confirmação

**Um usuário pertence a uma organização só, ou pode pertencer a várias?**
Isso muda o modelo: `memberships` como está acima já suporta várias (um
`user_id` pode ter múltiplas linhas, uma por organização), mas a UI/sessão
precisa saber qual está "ativa" no momento se permitirmos várias. Minha
recomendação: **uma organização por usuário no MVP** (mais simples,
resolve o SEC-01 hoje sem ambiguidade) — um pastor que lidera duas igrejas
diferentes usaria duas contas. Pode crescer para múltiplas depois sem
quebrar o modelo (`memberships` já é uma tabela própria, não uma coluna em
`auth.users`). Concorda com essa restrição pro MVP?

## 4. Como uma organização nasce (bootstrap)

Duas origens possíveis, não mutuamente exclusivas:
- **Console do proprietário (`/backoffice`, ADM-01):** você cria a
  organização manualmente após uma venda, e convida o primeiro admin por
  e-mail (destrava também o botão "Cadastro por convite em breve" que o
  Codex já deixou pronto no SEC-01).
- **Self-service (mais tarde, fora do escopo do TEN-01):** fluxo de
  cadastro público após pagamento — depende do `FAT-01` (Mercado Pago) e é
  uma frente própria.

**Para o TEN-01/MVP:** só o caminho manual via `/backoffice` — mais simples
e já é o que o `ADM-01` precisa de qualquer forma. Confirma essa ordem, ou
quer o self-service já nesta frente?

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

## 8. Fases de implementação (dentro do TEN-01)

1. Migração `organizations` + `memberships` + RLS base (Dev Backend).
2. `proxy.ts`/`layout.tsx` passam a resolver papel via `memberships`
   (Arquiteto, é fronteira de auth — mesmo padrão do DEC-034 se você
   preferir concentrar no Codex, a definir).
3. Tela mínima em `/backoffice` para o proprietário criar organização e
   convidar o primeiro admin (liga com ADM-01).
4. Casos de teste do §8.3 executados e documentados.

## Perguntas para Reinaldo antes de abrir a OT de execução

1. Uma organização por usuário no MVP — confirma? (§3)
2. Bootstrap só manual via `/backoffice` por enquanto — confirma? (§4)
3. Quem implementa o ajuste em `proxy.ts`/`layout.tsx` desta vez — Codex
   (como no modo de teste, DEC-034) ou eu, como fronteira de auth
   tradicionalmente é (§3 do Cérebro)?

## Aprovação

- **Reinaldo:** [ ] aprovado em ____/____/____
