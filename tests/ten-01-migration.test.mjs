import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const migration = readFileSync("supabase/migrations/20260910170000_ten_01_organizations_memberships.sql", "utf8")
const isolation = readFileSync("supabase/tests/ten_01_isolation.sql", "utf8")

test("TEN-01 migration creates tenant tables and active-membership invariant", () => {
  assert.match(migration, /create table if not exists public\.organizations/i)
  assert.match(migration, /create table if not exists public\.memberships/i)
  assert.match(migration, /references auth\.users\(id\) on delete cascade/i)
  assert.match(migration, /memberships_uma_ativa_por_usuario/i)
  assert.match(migration, /where status = 'ativo'/i)
})

test("TEN-01 migration keeps SECURITY DEFINER helpers outside public schema", () => {
  assert.match(migration, /create schema if not exists app_private/i)
  assert.match(migration, /function app_private\.current_org_id\(\)/i)
  assert.match(migration, /security definer/i)
  assert.doesNotMatch(migration, /function public\.current_org_id\(\)/i)
  assert.match(migration, /revoke all on function app_private\.current_org_id\(\) from public, anon, authenticated/i)
})

test("TEN-01 migration grants Data API read access only after RLS", () => {
  assert.match(migration, /alter table public\.organizations enable row level security/i)
  assert.match(migration, /alter table public\.memberships enable row level security/i)
  assert.match(migration, /grant select on public\.organizations to authenticated/i)
  assert.match(migration, /grant select on public\.memberships to authenticated/i)
  assert.doesNotMatch(migration, /grant .* on public\.(organizations|memberships) to anon/i)
})

test("TEN-01 isolation test covers cross-tenant read, write, forged organization_id, and no-membership denial", () => {
  assert.match(isolation, /user A can read org B row/i)
  assert.match(isolation, /user A updated org B row/i)
  assert.match(isolation, /cliente tentou trocar organization_id/i)
  assert.match(isolation, /user without active membership/i)
})
