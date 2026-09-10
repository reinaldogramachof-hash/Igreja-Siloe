create schema if not exists app_private;

revoke all on schema app_private from public;
grant usage on schema app_private to authenticated;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'trial'
    constraint organizations_status_check
    check (status in ('trial', 'ativo', 'suspenso', 'cancelado')),
  plan_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role text not null
    constraint memberships_role_check
    check (role in ('admin', 'secretaria', 'tesoureiro', 'lider_celula', 'lider_louvor', 'lider_salas', 'membro')),
  status text not null default 'ativo'
    constraint memberships_status_check
    check (status in ('ativo', 'convidado', 'suspenso')),
  created_at timestamptz not null default now(),
  constraint memberships_user_organization_key unique (user_id, organization_id)
);

create unique index if not exists memberships_uma_ativa_por_usuario
  on public.memberships (user_id)
  where status = 'ativo';

create index if not exists memberships_organization_id_idx
  on public.memberships (organization_id);

alter table public.organizations enable row level security;
alter table public.organizations force row level security;
alter table public.memberships enable row level security;
alter table public.memberships force row level security;

revoke all on public.organizations from anon, authenticated;
revoke all on public.memberships from anon, authenticated;
grant select on public.organizations to authenticated;
grant select on public.memberships to authenticated;

create or replace function app_private.current_org_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select memberships.organization_id
  from public.memberships
  where memberships.user_id = (select auth.uid())
    and memberships.status = 'ativo'
  limit 1
$$;

create or replace function app_private.current_membership_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select memberships.role
  from public.memberships
  where memberships.user_id = (select auth.uid())
    and memberships.status = 'ativo'
  limit 1
$$;

revoke all on function app_private.current_org_id() from public, anon, authenticated;
revoke all on function app_private.current_membership_role() from public, anon, authenticated;
grant execute on function app_private.current_org_id() to authenticated;
grant execute on function app_private.current_membership_role() to authenticated;

drop policy if exists organizations_select_own on public.organizations;
create policy organizations_select_own
  on public.organizations
  for select
  to authenticated
  using (
    id = app_private.current_org_id()
  );

drop policy if exists memberships_select_own_active on public.memberships;
create policy memberships_select_own_active
  on public.memberships
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    and status = 'ativo'
  );

comment on table public.organizations is 'Tenant da igreja cliente. TEN-01/DEC-041/DEC-042.';
comment on table public.memberships is 'Vinculo usuario-organizacao-papel. Um vinculo ativo por usuario no MVP.';
comment on function app_private.current_org_id() is 'Resolve a organizacao ativa pela sessao Supabase, nunca por input do cliente.';
comment on function app_private.current_membership_role() is 'Resolve o papel ativo pela sessao Supabase, nunca por localStorage ou input do cliente.';
