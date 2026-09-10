drop policy if exists memberships_select_own_active on public.memberships;
drop policy if exists organizations_select_own on public.organizations;

drop function if exists app_private.current_membership_role();
drop function if exists app_private.current_org_id();

drop table if exists public.memberships;
drop table if exists public.organizations;

drop schema if exists app_private;
