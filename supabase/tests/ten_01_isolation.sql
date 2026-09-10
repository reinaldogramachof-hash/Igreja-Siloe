begin;

create table public.ten_01_isolation_probe (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  label text not null
);

alter table public.ten_01_isolation_probe enable row level security;
grant select, insert, update, delete on public.ten_01_isolation_probe to authenticated;

create policy ten_01_probe_isola_por_organizacao
  on public.ten_01_isolation_probe
  for all
  to authenticated
  using (organization_id = app_private.current_org_id())
  with check (organization_id = app_private.current_org_id());

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ten-01-a@example.test', '', now(), now(), now()),
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ten-01-b@example.test', '', now(), now(), now());

insert into public.organizations (id, name, slug, status)
values
  ('00000000-0000-0000-0000-0000000000a0', 'Organizacao A', 'ten-01-a', 'ativo'),
  ('00000000-0000-0000-0000-0000000000b0', 'Organizacao B', 'ten-01-b', 'ativo');

insert into public.memberships (user_id, organization_id, role, status)
values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-0000000000a0', 'admin', 'ativo'),
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000b0', 'admin', 'ativo');

insert into public.ten_01_isolation_probe (id, organization_id, label)
values
  ('10000000-0000-0000-0000-0000000000a0', '00000000-0000-0000-0000-0000000000a0', 'dado A'),
  ('10000000-0000-0000-0000-0000000000b0', '00000000-0000-0000-0000-0000000000b0', 'dado B');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000a1', true);

do $$
declare
  visible_count integer;
  changed_count integer;
begin
  select count(*) into visible_count from public.ten_01_isolation_probe;
  if visible_count <> 1 then
    raise exception 'TEN-01 isolation failed: user A selected % rows, expected 1', visible_count;
  end if;

  select count(*) into visible_count
  from public.ten_01_isolation_probe
  where id = '10000000-0000-0000-0000-0000000000b0';
  if visible_count <> 0 then
    raise exception 'TEN-01 isolation failed: user A can read org B row';
  end if;

  update public.ten_01_isolation_probe
  set label = 'editado por A'
  where id = '10000000-0000-0000-0000-0000000000b0';
  get diagnostics changed_count = row_count;
  if changed_count <> 0 then
    raise exception 'TEN-01 isolation failed: user A updated org B row';
  end if;
end $$;

do $$
begin
  insert into public.ten_01_isolation_probe (organization_id, label)
  values ('00000000-0000-0000-0000-0000000000b0', 'cliente tentou trocar organization_id');

  raise exception 'TEN-01 isolation failed: user A inserted row into org B by changing organization_id';
exception
  when insufficient_privilege or check_violation or with_check_option_violation then
    null;
end $$;

select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000c1', true);

do $$
declare
  visible_count integer;
begin
  select count(*) into visible_count from public.ten_01_isolation_probe;
  if visible_count <> 0 then
    raise exception 'TEN-01 isolation failed: user without active membership selected % rows', visible_count;
  end if;
end $$;

rollback;
