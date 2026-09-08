-- Rollback da migracao 20260908183000_homolog.sql (OPS-01).
-- Fica FORA de supabase/migrations/ de proposito: o Supabase CLI executaria
-- qualquer arquivo em migrations/ como migracao de subida.
-- Aplicar no aceite da OPS-01, junto com a remocao da Edge Function homolog-echo
-- pelo dashboard.

drop policy if exists "homolog_obj_select_own" on storage.objects;
drop policy if exists "homolog_obj_insert_own" on storage.objects;
drop policy if exists "homolog_obj_update_own" on storage.objects;
drop policy if exists "homolog_obj_delete_own" on storage.objects;

delete from storage.objects where bucket_id = 'homolog';
delete from storage.buckets  where id = 'homolog';

drop schema if exists homolog cascade;   -- remove a tabela homolog_ping e suas policies
