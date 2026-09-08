-- supabase/validate/validate_homolog.sql
-- OPS-01: valida todas as acoes no banco (schema homolog).
-- Nao deixa residuo: o teste de isolamento roda em transacao com ROLLBACK.
-- Requer conexao com papel que possa "SET ROLE authenticated" (postgres).
--
--   psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/validate/validate_homolog.sql
--
-- Resultado 2026-09-08 (via conector, equivalente): 14/14 + 6/6 PASS, sem residuo.
-- Check FK usa pg_constraint (information_schema deu falso negativo cross-schema).

\set ON_ERROR_STOP on
\pset pager off
\echo ''
\echo '=========== OPS-01 :: validacao do schema homolog ==========='
select current_user as conectado_como, session_user;

\echo ''
\echo '--- 1) Estrutura / RLS / grants / storage ---'
select verificacao, resultado from (
  select 1 ord, 'schema homolog existe' verificacao,
    case when exists (select 1 from pg_namespace where nspname='homolog') then 'PASS' else 'FAIL' end resultado
  union all select 2, 'tabela homolog.homolog_ping existe',
    case when to_regclass('homolog.homolog_ping') is not null then 'PASS' else 'FAIL' end
  union all select 3, 'RLS habilitada',
    case when coalesce((select relrowsecurity from pg_class where oid=to_regclass('homolog.homolog_ping')),false) then 'PASS' else 'FAIL' end
  union all select 4, 'colunas id/owner/mensagem/created_at',
    case when (select count(*) from information_schema.columns
               where table_schema='homolog' and table_name='homolog_ping'
                 and column_name in ('id','owner','mensagem','created_at'))=4 then 'PASS' else 'FAIL' end
  union all select 5, 'owner NOT NULL + default auth.uid()',
    case when exists (select 1 from information_schema.columns
               where table_schema='homolog' and table_name='homolog_ping' and column_name='owner'
                 and is_nullable='NO' and column_default like '%auth.uid()%') then 'PASS' else 'FAIL' end
  union all select 6, 'FK owner -> auth.users(id)',
    case when exists (select 1 from pg_constraint con
               where con.conrelid='homolog.homolog_ping'::regclass
                 and con.contype='f'
                 and pg_get_constraintdef(con.oid) like '%REFERENCES auth.users(id)%') then 'PASS' else 'FAIL' end
  union all select 7, '4 policies (role authenticated) na tabela',
    case when (select count(*) from pg_policies
               where schemaname='homolog' and tablename='homolog_ping' and 'authenticated'=any(roles))=4 then 'PASS' else 'FAIL' end
  union all select 8, 'as 4 policies referenciam auth.uid()',
    case when (select count(*) from pg_policies
               where schemaname='homolog' and tablename='homolog_ping'
                 and coalesce(qual,'')||coalesce(with_check,'') like '%auth.uid()%')=4 then 'PASS' else 'FAIL' end
  union all select 9, 'grant S/I/U/D a authenticated',
    case when (select count(*) from information_schema.role_table_grants
               where table_schema='homolog' and table_name='homolog_ping' and grantee='authenticated'
                 and privilege_type in ('SELECT','INSERT','UPDATE','DELETE'))=4 then 'PASS' else 'FAIL' end
  union all select 10, 'anon SEM grants na tabela',
    case when (select count(*) from information_schema.role_table_grants
               where table_schema='homolog' and table_name='homolog_ping' and grantee='anon')=0 then 'PASS' else 'FAIL' end
  union all select 11, 'anon SEM USAGE no schema homolog',
    case when has_schema_privilege('anon','homolog','USAGE') then 'FAIL' else 'PASS' end
  union all select 12, 'authenticated COM USAGE no schema homolog',
    case when has_schema_privilege('authenticated','homolog','USAGE') then 'PASS' else 'FAIL' end
  union all select 13, 'bucket homolog existe e e privado',
    case when exists (select 1 from storage.buckets where id='homolog' and public=false) then 'PASS' else 'FAIL' end
  union all select 14, '4 policies homolog_obj_* em storage.objects',
    case when (select count(*) from pg_policies
               where schemaname='storage' and tablename='objects' and policyname ~ '^homolog_obj_')=4 then 'PASS' else 'FAIL' end
) t order by ord;

\echo ''
\echo '--- 2) Advisor pre-existente (informativo) ---'
select case when has_function_privilege('anon','public.rls_auto_enable()','EXECUTE')
              or has_function_privilege('authenticated','public.rls_auto_enable()','EXECUTE')
            then 'ATENCAO: revogar EXECUTE de rls_auto_enable()' else 'ok' end as rls_auto_enable;

\echo ''
\echo '--- 3) Isolamento RLS entre dois usuarios (revertido no fim) ---'
begin;

insert into auth.users (instance_id,id,aud,role,email,created_at,updated_at)
values ('00000000-0000-0000-0000-000000000000',gen_random_uuid(),'authenticated','authenticated','homolog-a@teste.local',now(),now())
returning id as uid \gset a_
insert into auth.users (instance_id,id,aud,role,email,created_at,updated_at)
values ('00000000-0000-0000-0000-000000000000',gen_random_uuid(),'authenticated','authenticated','homolog-b@teste.local',now(),now())
returning id as uid \gset b_

insert into homolog.homolog_ping (owner,mensagem) values (:'a_uid','linha de A'),(:'b_uid','linha de B');

set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub',:'a_uid','role','authenticated')::text, true);

select case when auth.uid()=:'a_uid' then 'PASS' else 'FAIL' end as "auth.uid()=A",
       case when (select count(*) from homolog.homolog_ping)=1 then 'PASS' else 'FAIL' end as "A ve so a propria",
       case when (select count(*) from homolog.homolog_ping where owner=:'b_uid')=0 then 'PASS' else 'FAIL' end as "A nao le B";

with u as (update homolog.homolog_ping set mensagem='hack' where owner=:'b_uid' returning 1)
select case when count(*)=0 then 'PASS' else 'FAIL' end as "A nao atualiza B" from u;

with d as (delete from homolog.homolog_ping where owner=:'b_uid' returning 1)
select case when count(*)=0 then 'PASS' else 'FAIL' end as "A nao deleta B" from d;

\echo '   (o INSERT abaixo DEVE falhar com "row-level security policy" => isso e PASS)'
savepoint sp;
\set ON_ERROR_STOP off
insert into homolog.homolog_ping (owner,mensagem) values (:'b_uid','forjado por A');
\set ON_ERROR_STOP on
rollback to savepoint sp;

reset role;
rollback;
\echo ''
\echo '=========== fim - nada foi persistido ==========='
