import type { SupabaseClient, User } from "@supabase/supabase-js"
import { isRole, type OrganizationStatus, type ResolvedMembership } from "@/lib/types"

type OrganizationRow = {
  id: string
  name: string
  slug: string
  status: string
}

type MembershipRow = {
  organization_id: string
  role: string
  organizations: OrganizationRow | OrganizationRow[] | null
}

const ORGANIZATION_STATUSES = ["trial", "ativo", "suspenso", "cancelado"] as const

function isOrganizationStatus(value: unknown): value is OrganizationStatus {
  return typeof value === "string" && (ORGANIZATION_STATUSES as readonly string[]).includes(value)
}

function firstOrganization(value: MembershipRow["organizations"]) {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

function getUserName(user: Pick<User, "user_metadata">) {
  const metadata = user.user_metadata as Record<string, unknown> | null
  const fullName = metadata?.full_name ?? metadata?.name

  return typeof fullName === "string" && fullName.trim() ? fullName.trim() : null
}

export async function resolveActiveMembership(
  supabase: SupabaseClient,
  user: Pick<User, "id" | "email" | "user_metadata">
): Promise<ResolvedMembership | null> {
  const { data, error } = await supabase
    .from("memberships")
    .select("organization_id, role, organizations(id, name, slug, status)")
    .eq("user_id", user.id)
    .eq("status", "ativo")
    .maybeSingle()

  if (error || !data) {
    return null
  }

  const row = data as MembershipRow
  const organization = firstOrganization(row.organizations)

  if (!isRole(row.role) || !organization || !isOrganizationStatus(organization.status)) {
    return null
  }

  return {
    userId: user.id,
    userEmail: user.email ?? null,
    userName: getUserName(user),
    organizationId: row.organization_id,
    organizationName: organization.name,
    organizationSlug: organization.slug,
    organizationStatus: organization.status,
    role: row.role,
  }
}
