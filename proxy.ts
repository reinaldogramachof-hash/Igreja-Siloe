import { NextResponse, type NextRequest } from "next/server"
import { resolveActiveMembership } from "@/lib/supabase/membership"
import { updateSession } from "@/lib/supabase/proxy"

const protectedRoutes = [
  "/admin",
  "/celulas",
  "/dashboard",
  "/enquetes",
  "/eventos",
  "/financeiro",
  "/louvor",
  "/membros",
  "/notificacoes",
  "/prestacao-contas",
  "/reunioes",
  "/salas",
  "/site",
  "/social",
]

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}

export async function proxy(request: NextRequest) {
  const { response, supabase, user } = await updateSession(request)
  const { pathname } = request.nextUrl
  const membership = user ? await resolveActiveMembership(supabase, user) : null

  if (!user && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && !membership && isProtectedRoute(pathname)) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("next", pathname)
    loginUrl.searchParams.set("error", "membership_required")
    return NextResponse.redirect(loginUrl)
  }

  if (user && membership && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|apple-touch-icon.png|icons|manifest.json|offline|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
