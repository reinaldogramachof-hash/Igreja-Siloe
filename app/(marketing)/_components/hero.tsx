import * as React from "react"
import {
  ArrowRight,
  Heart,
  Users,
  Calendar,
  Home,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
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
          {/* Top Pill / Badge Acolhedora */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Heart className="size-3.5 fill-primary/20" aria-hidden="true" />
            <span>Feito com carinho para o dia a dia da sua igreja</span>
          </div>

          {/* Main Headline Pastoral */}
          <h1 className="mt-6 max-w-4xl font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Mais tempo para cuidar das pessoas.{" "}
            <span className="text-primary">Menos tempo em planilhas.</span>
          </h1>

          {/* Subtitle / Value Proposition Humana */}
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
              <span>Como Funciona</span>
            </a>
          </div>

          {/* Value Badges Pastorais */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
              <span>Fácil de usar por qualquer voluntário</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
              <span>Opção sem internet para o dia a dia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
              <span>Direto no celular ou computador</span>
            </div>
          </div>

          {/* Dashboard Preview / Vida Real da Igreja */}
          <div className="relative mt-14 w-full max-w-5xl rounded-2xl border border-border/80 bg-card/60 p-3 shadow-2xl backdrop-blur-sm sm:p-5">
            <div className="relative overflow-hidden rounded-xl border border-border bg-background p-4 sm:p-6">
              {/* Window Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-yellow-500/80" />
                  <div className="size-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    {brand.name} • Cuidado pastoral e organização
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-primary">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  <span className="hidden sm:inline">Tudo em dia para o próximo culto</span>
                </div>
              </div>

              {/* Mock Cards Grid - Contexto de Comunidade */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Card 1: Membros & Aniversariantes */}
                <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 text-left">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Cuidado Pastoral</span>
                      <Users className="size-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="mt-2 text-lg font-bold text-foreground">Famílias & Membros</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      3 aniversariantes esta semana com mensagem pronta para enviar
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                    <span>Parabenizar membros</span>
                  </div>
                </div>

                {/* Card 2: Células nos Lares */}
                <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 text-left">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Pequenos Grupos</span>
                      <Home className="size-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="mt-2 text-lg font-bold text-foreground">Células nos Lares</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Encontros confirmados e acolhimento dos novos visitantes
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                    <span>Acompanhar presença</span>
                  </div>
                </div>

                {/* Card 3: Cultos & Escalas */}
                <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 text-left">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Agenda Ministerial</span>
                      <Calendar className="size-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="mt-2 text-lg font-bold text-foreground">Culto de Domingo</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Equipes de louvor, recepção e ministério infantil já escaladas
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                    <span>Ver escala completa</span>
                  </div>
                </div>

                {/* Card 4: Tesouraria & Transparência */}
                <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4 text-left">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">Tesouraria</span>
                      <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
                    </div>
                    <div className="mt-2 text-lg font-bold text-foreground">Dízimos & Ofertas</div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Entradas e despesas organizadas para prestação de contas clara
                    </p>
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                    <span>Relatório transparente</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
