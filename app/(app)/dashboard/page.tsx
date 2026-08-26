"use client"

import { useState } from "react"
import Link from "next/link"
import { CalendarDays, CreditCard, DoorOpen, Music2, ShieldCheck, Sparkles, Bell, ArrowRight, X, User, Phone, Church, QrCode } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buildApprovalItems, events, notices, getRoleLabel } from "@/lib/mock-data"
import { useDemoUser } from "@/lib/prototype-auth"
import { getGreeting } from "@/lib/date-utils"
import { cn } from "@/lib/utils"
import { QRCode } from "@/components/shared/qr-code"

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
  const [showWallet, setShowWallet] = useState(false)

  const greeting = getGreeting()

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")

  const qrValue = `SILOE:${user.id}:${user.name}:${role}`

  return (
    <div className="space-y-6 pb-12 animate-fade-in">

      {/* ──── DIGITAL WALLET MODAL ──── */}
      {showWallet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowWallet(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-3xl border border-border/40 bg-gradient-to-br from-accent/20 via-card to-card/90 shadow-2xl shadow-accent/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stripe topo */}
            <div className="h-2 w-full bg-gradient-to-r from-accent via-teal-400 to-accent/70" />

            <button
              onClick={() => setShowWallet(false)}
              className="absolute top-4 right-4 size-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
            >
              <X className="size-4" />
            </button>

            <div className="p-6 flex flex-col items-center gap-5">
              {/* Logo + título */}
              <div className="flex flex-col items-center gap-2">
                <div className="size-12 rounded-2xl bg-accent/15 border border-accent/25 flex items-center justify-center">
                  <CreditCard className="size-6 text-accent" />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-accent">Igreja Siloé</p>
                  <p className="text-[10px] text-muted-foreground">Carteira Digital do Membro</p>
                </div>
              </div>

              {/* Avatar + info */}
              <div className="flex items-center gap-4 w-full rounded-2xl bg-muted/30 border border-border/30 p-4">
                <Avatar className="size-14 border-2 border-accent/30 shrink-0">
                  <AvatarFallback className="bg-accent-soft/60 text-accent font-bold text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-sm leading-tight">{user.name}</p>
                  <p className="text-[11px] font-semibold text-accent mt-0.5">{getRoleLabel(role)}</p>
                  <div className="flex flex-col gap-1 mt-2">
                    {user.phone && (
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Phone className="size-3 shrink-0" /> {user.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <User className="size-3 shrink-0" /> ID: {user.id}
                    </span>
                    {user.ministries && user.ministries.length > 0 && (
                      <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Church className="size-3 shrink-0" /> {user.ministries.join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-2xl bg-white shadow-md">
                  <QRCode value={qrValue} size={140} className="rounded-lg" />
                </div>
                <p className="text-[10px] text-muted-foreground text-center max-w-[200px]">
                  Apresente este QR para check-in em eventos ou identificação na portaria.
                </p>
              </div>

              {/* Status badge */}
              <Badge className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 font-bold text-[11px] px-3 py-1">
                ✓ Membro Ativo — {new Date().getFullYear()}
              </Badge>
            </div>
          </div>
        </div>
      )}

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
                className={cn(buttonVariants({ size: "lg" }), "bg-accent hover:bg-accent/90 text-white rounded-xl shadow-md shadow-accent/10 font-semibold gap-2 transition-all duration-300 hover:shadow-lg")}
              >
                <ShieldCheck className="size-4.5" />
                {pendingCount > 0 ? `Você tem ${pendingCount} solicitações pendentes` : "Gerenciar Membros & Permissões"}
                <ArrowRight className="size-4 ml-1" />
              </Link>
            )}

            {role === "lider_louvor" && (
              <Link 
                href="/louvor" 
                className={cn(buttonVariants({ size: "lg" }), "bg-accent hover:bg-accent/90 text-white rounded-xl shadow-md shadow-accent/10 font-semibold gap-2 transition-all duration-300 hover:shadow-lg")}
              >
                <Music2 className="size-4.5" />
                {pendingLouvorCount > 0 ? `${pendingLouvorCount} sugestões de músicas pendentes` : "Gerenciar Escalas & Louvor"}
                <ArrowRight className="size-4 ml-1" />
              </Link>
            )}

            {role === "lider_salas" && (
              <Link 
                href="/salas" 
                className={cn(buttonVariants({ size: "lg" }), "bg-accent hover:bg-accent/90 text-white rounded-xl shadow-md shadow-accent/10 font-semibold gap-2 transition-all duration-300 hover:shadow-lg")}
              >
                <DoorOpen className="size-4.5" />
                {pendingSalasCount > 0 ? `${pendingSalasCount} solicitações de salas para aprovar` : "Gerenciar Agenda de Salas"}
                <ArrowRight className="size-4 ml-1" />
              </Link>
            )}

            {role === "membro" && (
              <>
                <Link 
                  href="/salas" 
                  className={cn(buttonVariants({ size: "lg" }), "bg-accent hover:bg-accent/90 text-white rounded-xl shadow-md shadow-accent/10 font-semibold gap-2 transition-all duration-300 hover:shadow-lg")}
                >
                  <DoorOpen className="size-4.5" />
                  Solicitar Reserva de Sala
                  <ArrowRight className="size-4 ml-1" />
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowWallet(true)}
                  className="rounded-xl border-border/60 gap-2 font-semibold hover:border-accent/40 hover:bg-accent-soft/20 hover:text-accent transition-all duration-300"
                >
                  <QrCode className="size-4.5" />
                  Minha Carteira Digital
                </Button>
              </>
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
