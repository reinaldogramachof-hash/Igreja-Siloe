"use client"

import Link from "next/link"
import { CalendarDays, DoorOpen, Music2, ShieldCheck, Sparkles, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { buildApprovalItems, events, notices } from "@/lib/mock-data"
import { useDemoUser } from "@/lib/prototype-auth"
import { getGreeting } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

const shortcuts = [
  { href: "/salas", label: "Solicitar sala", icon: DoorOpen },
  { href: "/louvor", label: "Sugerir música", icon: Music2 },
  { href: "/louvor", label: "Ver escala da semana", icon: CalendarDays },
]

export default function DashboardPage() {
  const { user, role } = useDemoUser()
  const pendingCount = buildApprovalItems().filter((item) => item.status === "pendente").length
  const canReview = role === "admin" || role === "lider_louvor" || role === "lider_salas"
  const greeting = getGreeting()

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border bg-card p-5 sm:p-6 shadow-sm">
          <Badge className="mb-4 bg-accent-soft text-accent-foreground hover:bg-accent-soft">
            <Sparkles className="size-3.5" />
            Protótipo Siloé
          </Badge>
          <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
            {greeting}, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Centralize pedidos, salas e escala ministerial em uma experiência simples para membros e líderes.
          </p>
          {canReview ? (
            <Link href="/admin" className={cn(buttonVariants({ size: "lg" }), "mt-5 bg-accent text-white hover:bg-accent/90 shadow-sm")}>
              <ShieldCheck className="size-4" />
              Você tem {pendingCount} solicitações pendentes
            </Link>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon
            return (
              <Link
                key={shortcut.label}
                href={shortcut.href}
                className="group flex items-center gap-3 rounded-lg border bg-card p-4 transition-all hover:border-accent/50 hover:bg-accent-soft/40 hover:shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-white transition-transform group-hover:scale-105">
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-medium transition-colors group-hover:text-accent">{shortcut.label}</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-lg shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="size-4 text-accent" />
              Próximos eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:border-accent/30">
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.room}</p>
                </div>
                <div className="text-right text-xs">
                  <span className="inline-block rounded bg-accent-soft px-2 py-0.5 font-semibold text-accent-foreground">
                    {event.date}
                  </span>
                  <p className="mt-1 text-muted-foreground">{event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-lg shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="size-4 text-accent" />
              Mural de avisos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {notices.map((notice) => (
              <article key={notice.id} className="rounded-lg border bg-muted/30 p-3 transition-all hover:bg-muted/50">
                <h3 className="text-sm font-semibold">{notice.title}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{notice.description}</p>
              </article>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
