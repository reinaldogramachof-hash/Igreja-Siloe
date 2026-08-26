"use client"

import Link from "next/link"
import { CalendarDays, DoorOpen, Music2, ShieldCheck, Sparkles, Bell, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { buildApprovalItems, events, notices } from "@/lib/mock-data"
import { useDemoUser } from "@/lib/prototype-auth"
import { getGreeting } from "@/lib/date-utils"
import { cn } from "@/lib/utils"

const shortcuts = [
  { href: "/salas", label: "Solicitar sala", icon: DoorOpen, desc: "Reserve uma sala para ensaio ou reunião" },
  { href: "/louvor", label: "Sugerir música", icon: Music2, desc: "Indique uma canção para a escala" },
  { href: "/louvor", label: "Ver escala da semana", icon: CalendarDays, desc: "Acesse a escala do ministério" },
]

export default function DashboardPage() {
  const { user, role } = useDemoUser()
  const allApprovalItems = buildApprovalItems()
  const pendingCount = allApprovalItems.filter((item) => item.status === "pendente").length
  const pendingLouvorCount = allApprovalItems.filter((item) => item.type === "song" && item.status === "pendente").length
  const pendingSalasCount = allApprovalItems.filter((item) => item.type === "room" && item.status === "pendente").length

  const greeting = getGreeting()

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome Banner Section */}
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-accent/10 via-transparent to-transparent p-6 sm:p-8 backdrop-blur-md shadow-sm">
          <div className="absolute right-0 top-0 -mr-6 -mt-6 size-48 rounded-full bg-accent/5 blur-3xl" />
          
          <div className="flex items-center gap-2 mb-5">
            <Badge className="bg-accent-soft/60 text-accent hover:bg-accent-soft border-border/40 px-2.5 py-1 text-[11px] font-semibold gap-1.5 rounded-full">
              <Sparkles className="size-3.5" />
              Portal da Comunidade Siloé
            </Badge>

            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Perfil: {role === "admin" ? "Administrador" : role === "lider_louvor" ? "Líder de Louvor" : role === "lider_salas" ? "Líder de Salas" : "Membro"}
            </Badge>
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight sm:text-3.5xl text-foreground">
            {greeting}, <span className="text-accent">{user.name.split(" ")[0]}</span>
          </h1>
          
          <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Centralize pedidos de salas, escalas ministeriais e comunicação em uma experiência simples, moderna e integrada para toda a Igreja Siloé.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {role === "admin" && (
              <Link 
                href="/admin" 
                className={cn(
                  buttonVariants({ size: "lg" }), 
                  "bg-accent hover:bg-accent/90 text-white rounded-xl shadow-md shadow-accent/10 font-semibold gap-2 transition-all duration-300 hover:shadow-lg"
                )}
              >
                <ShieldCheck className="size-4.5" />
                {pendingCount > 0 ? `Você tem ${pendingCount} solicitações pendentes` : "Gerenciar Membros & Permissões"}
                <ArrowRight className="size-4 ml-1" />
              </Link>
            )}

            {role === "lider_louvor" && (
              <Link 
                href="/louvor" 
                className={cn(
                  buttonVariants({ size: "lg" }), 
                  "bg-accent hover:bg-accent/90 text-white rounded-xl shadow-md shadow-accent/10 font-semibold gap-2 transition-all duration-300 hover:shadow-lg"
                )}
              >
                <Music2 className="size-4.5" />
                {pendingLouvorCount > 0 ? `${pendingLouvorCount} sugestões de músicas pendentes` : "Gerenciar Escalas & Louvor"}
                <ArrowRight className="size-4 ml-1" />
              </Link>
            )}

            {role === "lider_salas" && (
              <Link 
                href="/salas" 
                className={cn(
                  buttonVariants({ size: "lg" }), 
                  "bg-accent hover:bg-accent/90 text-white rounded-xl shadow-md shadow-accent/10 font-semibold gap-2 transition-all duration-300 hover:shadow-lg"
                )}
              >
                <DoorOpen className="size-4.5" />
                {pendingSalasCount > 0 ? `${pendingSalasCount} solicitações de salas para aprovar` : "Gerenciar Agenda de Salas"}
                <ArrowRight className="size-4 ml-1" />
              </Link>
            )}

            {role === "membro" && (
              <Link 
                href="/salas" 
                className={cn(
                  buttonVariants({ size: "lg" }), 
                  "bg-accent hover:bg-accent/90 text-white rounded-xl shadow-md shadow-accent/10 font-semibold gap-2 transition-all duration-300 hover:shadow-lg"
                )}
              >
                <DoorOpen className="size-4.5" />
                Solicitar Reserva de Sala
                <ArrowRight className="size-4 ml-1" />
              </Link>
            )}
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon
            return (
              <Link
                key={shortcut.label}
                href={shortcut.href}
                className="group flex flex-col justify-center rounded-2xl border border-border/45 bg-card/45 p-4.5 transition-all duration-300 hover:border-accent/40 hover:bg-accent-soft/20 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-accent-soft/80 text-accent transition-transform duration-300 group-hover:scale-105 group-hover:bg-accent group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold transition-colors group-hover:text-accent truncate">{shortcut.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{shortcut.desc}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Next Events Card */}
        <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm">
          <CardHeader className="pb-3.5">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent-soft/60 text-accent">
                <CalendarDays className="size-4" />
              </span>
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {events.map((event) => (
              <div 
                key={event.id} 
                className="flex items-center justify-between rounded-xl border border-border/40 bg-card/30 p-3.5 transition-all duration-300 hover:border-accent/30 hover:bg-card/50"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.room}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-accent-soft/60 text-accent font-semibold px-2 py-0.5 text-[10px] rounded hover:bg-accent-soft/60">
                    {event.date}
                  </Badge>
                  <p className="mt-1.5 text-[11px] font-medium text-muted-foreground">{event.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notices Board Card */}
        <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm">
          <CardHeader className="pb-3.5">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent-soft/60 text-accent">
                <Bell className="size-4" />
              </span>
              Mural de Avisos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3.5 sm:grid-cols-3">
            {notices.map((notice) => (
              <article 
                key={notice.id} 
                className="flex flex-col justify-between rounded-xl border border-border/40 bg-muted/20 p-3.5 transition-all duration-300 hover:bg-muted/40 hover:border-border/80"
              >
                <div>
                  <h3 className="text-xs.5 font-bold text-foreground leading-normal">{notice.title}</h3>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{notice.description}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-border/10 flex items-center justify-between text-[10px] text-muted-foreground/85 font-semibold">
                  <span>Aviso geral</span>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
