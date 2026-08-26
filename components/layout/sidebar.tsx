"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, CalendarDays, DoorOpen, LayoutDashboard, Music2, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/salas", label: "Salas", icon: DoorOpen },
  { href: "/louvor", label: "Louvor", icon: Music2 },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground lg:block">
      <div className="flex h-full flex-col">
        <Link href="/dashboard" className="flex h-20 items-center gap-3 px-6 transition-opacity hover:opacity-90">
          <Image src="/logo.svg" alt="Igreja Siloé" width={42} height={42} className="rounded-full shadow-sm" priority />
          <div>
            <p className="text-sm font-semibold tracking-tight">Igreja Siloé</p>
            <p className="text-xs text-muted-foreground">Gestão ministerial</p>
          </div>
        </Link>
        <nav className="space-y-1.5 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn("size-4", active ? "text-accent-foreground" : "text-muted-foreground")} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-auto border-t p-4">
          <Link
            href="/"
            className="flex items-center justify-between rounded-lg border border-border/80 bg-card p-3 text-xs font-medium text-muted-foreground transition-all hover:border-accent/40 hover:bg-accent-soft/40 hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="size-3.5 text-accent" />
              Voltar ao site público
            </span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
