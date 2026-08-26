"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  CalendarDays,
  DoorOpen,
  Music2,
  ShieldCheck,
  Sparkles,
  Bell,
  ArrowRight,
  X,
  Church,
  QrCode,
  Maximize2,
  CheckCircle2,
  ZoomIn,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
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
  const [isQrZoomed, setIsQrZoomed] = useState(false)

  // Travar o scroll do body quando o modal da carteira ou o zoom do QR Code estiver aberto
  useEffect(() => {
    if (showWallet || isQrZoomed) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [showWallet, isQrZoomed])

  const greeting = getGreeting()

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")

  const qrValue = `SILOE:${user.id}:${user.name}:${role}`

  return (
    <div className="space-y-6 pb-12 animate-fade-in">

      {/* ──── QR CODE ZOOM MODAL (EXPANSÃO PARA LEITURA RÁPIDA) ──── */}
      {isQrZoomed && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsQrZoomed(false)}
        >
          <div
            className="relative w-full max-w-[280px] rounded-3xl border border-accent/40 bg-gradient-to-b from-[#0a1118] via-[#0f1722] to-[#121d28] p-5 shadow-2xl text-center flex flex-col items-center gap-3.5 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsQrZoomed(false)}
              className="absolute top-3.5 right-3.5 size-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              title="Fechar zoom"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-1.5 text-accent text-xs font-bold uppercase tracking-wider mt-1">
              <QrCode className="size-4" />
              <span>QR Code Ampliado</span>
            </div>

            {/* QR em tamanho ampliado */}
            <div className="p-3.5 rounded-2xl bg-white shadow-2xl border-2 border-accent/40">
              <QRCode value={qrValue} size={190} className="rounded-lg" />
            </div>

            <div>
              <p className="font-bold text-sm text-white">{user.name}</p>
              <p className="text-[11px] text-accent font-mono">ID: {user.id}</p>
              <p className="text-[10.5px] text-white/70 mt-1 max-w-[220px] leading-tight">
                Apresente na portaria ou recepção para validação instantânea.
              </p>
            </div>

            <Button
              onClick={() => setIsQrZoomed(false)}
              className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold h-9 text-xs mt-0.5"
            >
              Fechar QR Code
            </Button>
          </div>
        </div>
      )}

      {/* ──── DIGITAL WALLET MODAL (LAPIDAÇÃO VERTICAL SEM ABAS SUPÉRFLUAS) ──── */}
      {showWallet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={() => setShowWallet(false)}
        >
          <div
            className="relative w-full max-w-[340px] rounded-3xl border border-accent/30 bg-gradient-to-b from-[#0a1118] via-[#0e1722] to-[#121d28] shadow-2xl p-4 sm:p-5 flex flex-col text-white my-auto overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Marca d'água elegante de fundo */}
            <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
              <Image src="/logo.svg" alt="watermark" width={220} height={220} className="grayscale" />
            </div>

            {/* Topo do Cartão: Logo + Título + Badge de Perfil + Botão Fechar */}
            <div className="relative w-full flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Image src="/logo.svg" alt="Siloé" width={22} height={22} className="opacity-95 shrink-0" />
                <div>
                  <h3 className="text-white text-[10px] font-bold tracking-wider leading-none">IGREJA EVANGÉLICA SILOÉ</h3>
                  <p className="text-white/60 text-[8px] uppercase tracking-widest mt-0.5 leading-none">Cartão Oficial de Membro</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className="bg-accent text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 border-none shadow-none">
                  {getRoleLabel(role)}
                </Badge>
                <button
                  onClick={() => setShowWallet(false)}
                  className="size-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                  title="Fechar carteirinha"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Bloco Central: Foto / Avatar + Nome + ID + Ministério */}
            <div className="relative w-full flex flex-col items-center text-center mt-3.5">
              <div className="relative size-16 rounded-2xl bg-[#070c12] border-2 border-accent/40 flex items-center justify-center shadow-inner shadow-accent/20 mb-2">
                <span className="text-white font-bold text-xl">{initials}</span>
                <div className="absolute -bottom-1 -right-1 size-4.5 rounded-full bg-emerald-500 border-2 border-[#0a1118] flex items-center justify-center" title="Membro Ativo">
                  <CheckCircle2 className="size-2.5 text-white" />
                </div>
              </div>

              <h4 className="font-bold text-white text-base leading-tight truncate max-w-[260px]">{user.name}</h4>
              <p className="text-[11.5px] text-white/70 mt-0.5 truncate max-w-[260px]">{user.email}</p>
              
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <span className="text-[9.5px] text-accent font-mono bg-accent/15 px-2 py-0.5 rounded-md border border-accent/20">
                  ID: {user.id}
                </span>
                {user.phone && (
                  <span className="text-[9.5px] text-white/60">
                    {user.phone}
                  </span>
                )}
              </div>

              {user.ministries && user.ministries.length > 0 && (
                <div className="flex items-center gap-1 text-[9.5px] text-white/75 mt-1.5 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                  <Church className="size-2.5 text-accent shrink-0" />
                  <span className="truncate max-w-[220px]">{user.ministries.join(" • ")}</span>
                </div>
              )}
            </div>

            {/* Bloco QR Code Vertical (Interativo para Leitura e Zoom) */}
            <div className="relative w-full flex flex-col items-center mt-3 pt-2.5 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsQrZoomed(true)}
                className="group relative p-2 rounded-xl bg-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                title="Toque para ampliar o QR Code"
              >
                <QRCode value={qrValue} size={105} className="rounded-md" />
                <div className="absolute inset-0 bg-accent/85 rounded-xl opacity-0 group-hover:opacity-95 flex flex-col items-center justify-center transition-opacity text-white gap-1">
                  <ZoomIn className="size-5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Ampliar</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsQrZoomed(true)}
                className="flex items-center gap-1 text-[10px] text-accent font-semibold mt-1.5 hover:underline cursor-pointer"
              >
                <Maximize2 className="size-3" />
                <span>Toque no QR para leitura na portaria</span>
              </button>
            </div>

            {/* Rodapé do Cartão: Status de Membresia */}
            <div className="relative w-full flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[9.5px]">
              <span className="text-white/50">Rol de Membresia:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Ativo / Regular
              </span>
            </div>

            {/* Botão de Fechar Único e Otimizado */}
            <div className="w-full pt-3">
              <Button 
                variant="outline" 
                onClick={() => setShowWallet(false)}
                className="w-full rounded-xl bg-white/5 hover:bg-white/15 border-white/15 text-white font-semibold text-xs h-9.5 transition-colors"
              >
                Fechar
              </Button>
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
