import * as React from "react"
import {
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
  Layers,
  CircleDollarSign,
  Smartphone,
  CheckCircle2,
} from "lucide-react"
import { brand } from "@/lib/brand"

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background Subtle Gradient Glow */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" aria-hidden="true" />
            <span>Solução SaaS para Igrejas e Ministérios</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-6 max-w-4xl font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {brand.tagline}
          </h1>

          {/* Subtitle / Value Proposition */}
          <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {brand.description}
          </p>

          {/* Call to Action Buttons */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <a
              href="#planos"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
            >
              <span>Conhecer os Planos</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
            <a
              href="#modulos"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:w-auto"
            >
              <span>Ver Funcionalidades</span>
            </a>
          </div>

          {/* Value Badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
              <span>Instalação PWA no celular e PC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
              <span>Opção com armazenamento local (offline)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
              <span>Sem complicações ou burocracia</span>
            </div>
          </div>

          {/* Dashboard Preview / App Showcase */}
          <div className="relative mt-14 w-full max-w-5xl rounded-2xl border border-border/80 bg-card/60 p-3 shadow-2xl backdrop-blur-sm sm:p-5">
            <div className="relative overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-6">
              {/* Mock Window Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    {brand.name} • Painel de Gestão
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Smartphone className="size-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">PWA Pronto</span>
                </div>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Metric 1 */}
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Membros & Famílias</span>
                    <Users className="size-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">Organizados</div>
                  <p className="text-xs text-muted-foreground">Cadastro, aniversários e fichas</p>
                </div>

                {/* Metric 2 */}
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Células / Grupos</span>
                    <Layers className="size-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">Em Dia</div>
                  <p className="text-xs text-muted-foreground">Supervisão, líderes e encontros</p>
                </div>

                {/* Metric 3 */}
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Agenda & Escalas</span>
                    <Calendar className="size-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">Integrada</div>
                  <p className="text-xs text-muted-foreground">Cultos, eventos e ministérios</p>
                </div>

                {/* Metric 4 */}
                <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Caixa & Relatórios</span>
                    <CircleDollarSign className="size-4 text-primary" aria-hidden="true" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">Transparente</div>
                  <p className="text-xs text-muted-foreground">Dízimos, ofertas e conciliação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
