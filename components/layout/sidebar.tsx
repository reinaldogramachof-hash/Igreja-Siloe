"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ArrowLeft, CalendarDays, DoorOpen, LayoutDashboard, Music2, ShieldCheck, X, LogOut, Sun, Moon, Landmark, Users, HeartHandshake, Network, Bell, Ticket, Globe, Vote, FileCheck2, PieChart, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "./sidebar-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getRoleLabel } from "@/lib/mock-data"
import { useDemoUser } from "@/lib/prototype-auth"
import { useTheme } from "@/components/providers/theme-provider"
import { toast } from "sonner"
import type { Role } from "@/lib/types"
import { usePWAInstall } from "@/lib/use-pwa-install"

type NavItem = {
  href: string
  label: string
  icon: any
  rolesAllowed?: Role[]
}

type NavCategory = {
  title: string
  items: NavItem[]
}

const navCategories: NavCategory[] = [
  {
    title: "Geral",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/notificacoes", label: "Notificações", icon: Bell },
      { href: "/enquetes", label: "Enquetes", icon: Vote },
    ],
  },
  {
    title: "Pastoreio & Membros",
    items: [
      { href: "/celulas", label: "Células", icon: Network },
      { href: "/membros", label: "Membros", icon: Users, rolesAllowed: ["admin", "secretaria", "tesoureiro", "lider_celula", "lider_louvor", "lider_salas"] },
      { href: "/social", label: "Ação Social", icon: HeartHandshake, rolesAllowed: ["admin", "secretaria"] },
      { href: "/reunioes", label: "Reuniões & Decisões", icon: FileCheck2, rolesAllowed: ["admin", "secretaria", "tesoureiro", "lider_celula", "lider_louvor", "lider_salas"] },
    ],
  },
  {
    title: "Gestão & Ministérios",
    items: [
      { href: "/financeiro", label: "Financeiro", icon: Landmark, rolesAllowed: ["admin", "tesoureiro"] },
      { href: "/prestacao-contas", label: "Prestação de Contas", icon: PieChart },
      { href: "/eventos", label: "Eventos", icon: Ticket },
      { href: "/louvor", label: "Louvor", icon: Music2 },
      { href: "/salas", label: "Salas & Estrutura", icon: DoorOpen },
    ],
  },
  {
    title: "Administração",
    items: [
      { href: "/site", label: "Gestão do Site", icon: Globe, rolesAllowed: ["admin"] },
      { href: "/admin", label: "Painel Admin", icon: ShieldCheck, rolesAllowed: ["admin"] },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { isCollapsed, isMobileOpen, closeMobile } = useSidebar()
  const { user, role, setRole } = useDemoUser()
  const { showInstallButton, promptInstall } = usePWAInstall()

  // Travar o scroll da tela ao fundo quando o sidebar estiver aberto no mobile
  useEffect(() => {
    if (isMobileOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isMobileOpen])

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")

  const handleLogout = () => {
    closeMobile()
    toast.success("Sessão encerrada com sucesso!")
    router.push("/login")
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
        />
      )}

      {/* Sidebar container com safe area top e bottom */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border/40 bg-sidebar/95 backdrop-blur-md text-sidebar-foreground transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:bg-sidebar/90",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          isMobileOpen ? "translate-x-0 w-72 h-[100dvh]" : "-translate-x-full lg:translate-x-0"
        )}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Header area */}
          <div className="flex h-16 sm:h-20 items-center justify-between px-4 lg:px-6 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3 transition-opacity hover:opacity-90">
              <div className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft/40 shadow-inner">
                <Image src="/logo.svg" alt="Igreja Siloé" width={32} height={32} className="object-contain" priority />
              </div>
              {!isCollapsed && (
                <div className="min-w-0 animate-fade-in">
                  <p className="text-sm font-bold tracking-tight text-foreground truncate">Igreja Siloé</p>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/80 truncate">Gestão Ministerial</p>
                </div>
              )}
            </Link>

            {/* Mobile close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMobile}
              className="rounded-xl lg:hidden"
              aria-label="Fechar menu"
            >
              <X className="size-5" />
            </Button>
          </div>
          
          {/* Nav Items Organizados por Sessões */}
          <nav className="flex-1 space-y-4 px-3 py-2 overflow-y-auto scrollbar-none">
            {navCategories.map((category) => {
              const visibleItems = category.items.filter(
                (item) => !item.rolesAllowed || item.rolesAllowed.includes(role)
              )

              if (visibleItems.length === 0) return null

              return (
                <div key={category.title} className="space-y-1">
                  {!isCollapsed ? (
                    <div className="px-3 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/60">
                      {category.title}
                    </div>
                  ) : (
                    <div className="mx-2 my-2 border-t border-border/30" />
                  )}

                  {visibleItems.map((item) => {
                    const Icon = item.icon
                    const active = pathname === item.href

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobile}
                        className={cn(
                          "relative flex h-10 items-center rounded-xl text-xs font-semibold transition-all duration-200 group",
                          active
                            ? "bg-accent/15 text-accent font-bold shadow-sm shadow-accent/5"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                          isCollapsed ? "justify-center px-0" : "px-3 gap-3"
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        {active && (
                          <span className="absolute left-0 top-2.5 h-5 w-1 rounded-r-full bg-accent" />
                        )}
                        <Icon className={cn("size-4 shrink-0 transition-transform duration-200 group-hover:scale-105", active ? "text-accent" : "text-muted-foreground group-hover:text-foreground")} />
                        {!isCollapsed && <span className="animate-fade-in truncate">{item.label}</span>}
                      </Link>
                    )
                  })}
                </div>
              )
            })}
          </nav>
          
          {/* Footer area */}
          <div className="mt-auto p-4 border-t border-border/40 space-y-3 shrink-0">
            {/* Settings (Theme Switcher) */}
            <div className="pt-1">
              {!isCollapsed ? (
                <Button
                  variant="outline"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full h-9 justify-start gap-2.5 rounded-xl border border-border/40 bg-card/45 px-3 text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
                >
                  <Sun className="size-4 dark:hidden text-accent" />
                  <Moon className="hidden size-4 dark:block text-accent" />
                  <span>{theme === "dark" ? "Modo Escuro" : "Modo Claro"}</span>
                </Button>
              ) : (
                <div className="flex flex-col items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Alternar tema"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="size-9 rounded-xl border border-border/40 bg-card/45 hover:bg-muted/50 text-muted-foreground transition-colors mx-auto"
                  >
                    <Sun className="size-4.5 dark:hidden" />
                    <Moon className="hidden size-4.5 dark:block" />
                  </Button>
                </div>
              )}
            </div>

            {/* Install PWA button — Android only, disappears after install */}
            {showInstallButton && (
              <button
                onClick={promptInstall}
                className={cn(
                  "flex items-center rounded-xl border border-accent/30 bg-accent-soft/20 text-accent text-xs font-semibold transition-all duration-300 hover:bg-accent hover:text-white hover:border-accent shadow-sm",
                  isCollapsed ? "size-11 mx-auto justify-center" : "p-3 gap-2.5 w-full"
                )}
                title={isCollapsed ? "Instalar app" : undefined}
              >
                <Download className="size-3.5 shrink-0" />
                {!isCollapsed && <span className="animate-fade-in">Instalar App</span>}
              </button>
            )}

            <Link
              href="/"
              className={cn(
                "flex items-center justify-center rounded-xl border border-border/40 bg-card/50 text-xs font-semibold text-muted-foreground transition-all duration-300 hover:border-accent/30 hover:bg-accent-soft/20 hover:text-accent shadow-sm",
                isCollapsed ? "size-11 mx-auto" : "p-3 gap-2.5"
              )}
              title={isCollapsed ? "Voltar ao site público" : undefined}
            >
              <ArrowLeft className="size-3.5 shrink-0" />
              {!isCollapsed && <span className="animate-fade-in">Voltar ao site público</span>}
            </Link>

            {/* Profile information */}
            <div className={cn("pt-1", isCollapsed ? "text-center" : "")}>
              {!isCollapsed ? (
                <div className="flex items-center gap-3 rounded-xl border border-border/30 bg-card/45 p-2.5 shadow-sm">
                  <Avatar className="size-9 border border-border/40 shadow-inner shrink-0">
                    <AvatarFallback className="bg-accent-soft/60 text-accent font-bold text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 truncate">{getRoleLabel(role)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="size-8 rounded-lg hover:bg-danger/10 hover:text-danger text-muted-foreground shrink-0 transition-colors"
                    title="Sair da conta"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="size-9 border border-border/40 shadow-inner">
                    <AvatarFallback className="bg-accent-soft/60 text-accent font-bold text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="size-9 rounded-xl hover:bg-danger/10 hover:text-danger text-muted-foreground transition-colors"
                    title="Sair da conta"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
