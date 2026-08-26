"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Calendar, Clock, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "./sidebar-context"

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export function Topbar() {
  const { toggleSidebar, toggleMobile } = useSidebar()
  const [time, setTime] = useState<Date | null>(null)

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedDate = time
    ? capitalize(
        time.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      )
    : ""

  const formattedTime = time
    ? time.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : ""

  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/80 backdrop-blur-md" style={{ paddingTop: 'env(safe-area-inset-top)' }}>      
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
      {/* Left side actions */}
      <div className="flex items-center gap-3">
        {/* Menu Buttons (Desktop Toggle / Mobile Drawer Toggle) */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground"
          onClick={toggleSidebar}
          aria-label="Recolher/Expandir menu"
        >
          <Menu className="size-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="flex lg:hidden rounded-xl hover:bg-muted/50 text-muted-foreground hover:text-foreground"
          onClick={toggleMobile}
          aria-label="Abrir menu lateral"
        >
          <Menu className="size-5" />
        </Button>

        {/* Desktop-only secondary actions/breadcrumbs */}
        <div className="hidden lg:flex items-center gap-3 ml-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">Ambiente de Testes</p>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Sino de Notificações com Badge */}
        <Link
          href="/notificacoes"
          title="Central de Notificações"
          className="relative flex size-9 items-center justify-center rounded-xl border border-border/40 bg-card/45 text-muted-foreground hover:text-foreground hover:bg-accent-soft/30 transition-all shadow-sm"
        >
          <Bell className="size-4 text-accent" />
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-extrabold text-white animate-pulse">
            2
          </span>
        </Link>

        {time && (
          <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-border/40 bg-card/45 px-3 py-1.5 shadow-sm text-xs font-semibold text-muted-foreground/90">
            <Calendar className="size-3.5 text-accent shrink-0" />
            <span className="truncate">{formattedDate}</span>
            <Separator orientation="vertical" className="h-3 opacity-60" />
            <Clock className="size-3.5 text-accent shrink-0" />
            <span className="font-bold text-foreground">{formattedTime}</span>
          </div>
        )}

        {/* Mobile-only logo display (Upper Right Corner) */}
        <div className="flex items-center lg:hidden">
          <Image src="/logo.svg" alt="Igreja Siloé" width={28} height={28} className="object-contain" />
        </div>
      </div>
      </div>
    </header>
  )
}
