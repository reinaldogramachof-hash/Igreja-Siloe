# supabase/

Artefatos de banco versionados. Vinculado a `docs/operacao/ordens/OT-OPS-01.md`.

## Conteúdo

| Caminho | Papel |
|---|---|
| `migrations/20260908183000_homolog.sql` | OPS-01 — schema `homolog` descartável: tabela `homolog_ping` com RLS por `owner`, bucket privado `homolog` com policies. Idempotente. |
| `rollback/20260908183000_homolog_rollback.sql` | Reversão da migração acima. **Fora de `migrations/`** de propósito (o CLI rodaria como subida). |
| `functions/homolog-echo/index.ts` | OPS-01 — Edge Function descartável de prova (invocação autenticada). |

## Como aplicar (projeto "Gestão Igreja Pro" — `wkovbmrvpzukszmgfctd`)

Enquanto não há acesso de escrita por MCP/conector nem o CLI aprovado
(dependência = decisão Tipo 1, `CEREBRO-OPERACIONAL.md` §4):

1. **SQL Editor** do dashboard → colar `migrations/20260908183000_homolog.sql` → Run.
2. **Project Settings → API → Exposed schemas** → adicionar `homolog`.
3. **Edge Functions → Deploy a new function** `homolog-echo` → colar
   `functions/homolog-echo/index.ts` → manter *Verify JWT* ligado.
4. Prova pelo frontend estático de homologação, com **dois usuários**.
5. No aceite: `rollback/20260908183000_homolog_rollback.sql` + remover a function.

Se/quando o CLI for aprovado: `supabase init` gera `config.toml`;
`supabase link --project-ref wkovbmrvpzukszmgfctd`; `supabase db push`;
`supabase functions deploy homolog-echo`.

## Regras

- Estes objetos são **de homologação e temporários**. Nada de dado pessoal real.
- Tudo isolado no schema `homolog` — nunca em `public`.
- Escrita no Supabase é decisão Tipo 1 caso a caso (DEC-021).
