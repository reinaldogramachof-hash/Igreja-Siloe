-- OPS-01 homologacao — objetos descartaveis, schema isolado.
-- Projeto: "Gestao Igreja Pro" (wkovbmrvpzukszmgfctd).
-- Rollback: supabase/rollback/20260908183000_homolog_rollback.sql
-- Idempotente: pode ser reaplicado sem erro.
--
-- Apos aplicar: Project Settings -> API -> Exposed schemas -> adicionar "homolog".
-- No cliente: supabase.schema('homolog').from('homolog_ping').
-- Nao testar insercao pelo SQL Editor: ali auth.uid() e nulo e o owner quebra o
-- NOT NULL. A prova real e pelo frontend estatico, com dois usuarios.

create schema if not exists homolog;
grant usage on schema homolog to authenticated;   -- anon fica sem acesso (nega por padrao)

-- ---- tabela de prova ------------------------------------------------------
create table if not exists homolog.homolog_ping (
  id         uuid primary key default gen_random_uuid(),
  owner      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  mensagem   text,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on homolog.homolog_ping to authenticated;

alter table homolog.homolog_ping enable row level security;

drop policy if exists "ping_select_own" on homolog.homolog_ping;
drop policy if exists "ping_insert_own" on homolog.homolog_ping;
drop policy if exists "ping_update_own" on homolog.homolog_ping;
drop policy if exists "ping_delete_own" on homolog.homolog_ping;

create policy "ping_select_own" on homolog.homolog_ping
  for select to authenticated
  using (owner = (select auth.uid()));

create policy "ping_insert_own" on homolog.homolog_ping
  for insert to authenticated
  with check (owner = (select auth.uid()));

create policy "ping_update_own" on homolog.homolog_ping
  for update to authenticated
  using (owner = (select auth.uid()))
  with check (owner = (select auth.uid()));

create policy "ping_delete_own" on homolog.homolog_ping
  for delete to authenticated
  using (owner = (select auth.uid()));

-- ---- bucket privado de prova -------------------------------------------
insert into storage.buckets (id, name, public)
values ('homolog', 'homolog', false)
on conflict (id) do nothing;

drop policy if exists "homolog_obj_select_own" on storage.objects;
drop policy if exists "homolog_obj_insert_own" on storage.objects;
drop policy if exists "homolog_obj_update_own" on storage.objects;
drop policy if exists "homolog_obj_delete_own" on storage.objects;

create policy "homolog_obj_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'homolog' and owner = (select auth.uid()));

create policy "homolog_obj_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'homolog' and owner = (select auth.uid()));

create policy "homolog_obj_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'homolog' and owner = (select auth.uid()));

create policy "homolog_obj_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'homolog' and owner = (select auth.uid()));
