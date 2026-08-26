"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, AtSign, Clock, Download, Droplets, LogIn, MapPin, Menu, MessageCircle, Sparkles } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import {
  churchAddresses,
  firstVisitSteps,
  instagramHref,
  ministries,
  services,
  siteNavItems,
  whatsappHref,
} from "@/lib/site-content"
import { cn } from "@/lib/utils"
import { usePWAInstall } from "@/lib/use-pwa-install"

export default function SitePage() {
  const { showInstallButton, promptInstall } = usePWAInstall()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 transition-opacity hover:opacity-90 cursor-pointer border-0 bg-transparent p-0 text-left outline-none"
            title="Voltar ao topo da página"
            aria-label="Voltar ao topo da página"
          >
            <Image src="/logo.svg" alt="Igreja Siloé" width={40} height={40} className="rounded-full shadow-sm" priority />
            <span className="hidden sm:inline text-sm font-semibold tracking-tight">Igreja Siloé</span>
          </button>
          
          <nav className="hidden items-center gap-6 md:flex">
            {siteNavItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex">
              <ThemeToggle />
            </div>

            <Link href="/login" className="hidden text-sm font-medium text-accent hover:underline sm:block">
              Entrar
            </Link>
            
            {/* Mobile Nav Menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger render={<Button variant="ghost" size="icon" className="size-9" />}>
                  <Menu className="size-5" />
                </SheetTrigger>
                <SheetContent side="right" className="w-72 flex flex-col justify-between">
                  <div>
                    <SheetHeader>
                      <SheetTitle className="text-left text-sm font-semibold text-foreground">
                        Igreja Siloé
                      </SheetTitle>
                    </SheetHeader>
                    <Separator className="my-4" />
                    <nav className="grid gap-2">
                      {siteNavItems.map((item) => (
                        <a key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
                          {item.label}
                        </a>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-border/40">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-semibold text-muted-foreground">Aparência</span>
                      <ThemeToggle />
                    </div>
                    {showInstallButton && (
                      <button
                        onClick={promptInstall}
                        className={cn(buttonVariants({ variant: "outline" }), "w-full gap-2 border-accent/40 text-accent hover:bg-accent hover:text-white")}
                      >
                        <Download className="size-4" />
                        Instalar App
                      </button>
                    )}
                    <Link href="/login" className={cn(buttonVariants(), "w-full bg-accent text-white")}>
                      Entrar no Portal
                      <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,var(--accent-soft),transparent_65%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-24">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm shadow-xs">
              <Droplets className="size-4 text-accent animate-pulse" />
              <span className="font-medium">Uma Família de Verdade</span>
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Igreja Siloé</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Um lugar para encontrar cuidado, crescer na fé e viver comunidade de forma simples, próxima e verdadeira.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "h-11 bg-accent px-5 text-white hover:bg-accent/90 shadow-sm")}
              >
                <MessageCircle className="size-4" />
                Fale Conosco
              </a>
              <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 px-5")}>
                Entrar no Portal
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-sm aspect-square drop-shadow-[0_10px_35px_rgba(14,122,143,0.25)] dark:drop-shadow-[0_10px_35px_rgba(47,168,189,0.3)]">
              <video
                src="/videos/siloe-logo.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="rounded-full object-cover w-full h-full shadow-xl"
                onError={(e) => {
                  // Fallback to static logo image if video fails (older Android/Samsung)
                  const video = e.currentTarget
                  const img = document.createElement('img')
                  img.src = '/logo.svg'
                  img.alt = 'Igreja Siloé'
                  img.className = video.className
                  video.parentNode?.replaceChild(img, video)
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="scroll-mt-20 border-b py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.7fr_1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-accent">Sobre a Siloé</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">Um lugar pra pertencer</h2>
          </div>
          <div className="space-y-4 border-l-4 border-accent/70 pl-5 text-sm leading-7 text-muted-foreground sm:text-base">
            <p className="font-medium text-foreground">
              A Igreja Siloé existe para acolher pessoas em uma caminhada real com Jesus. Mais do que programação,
              valorizamos comunhão, cuidado e família.
            </p>
            <p>
              Aqui, cada visitante é recebido com proximidade, cada família encontra espaço para ser acompanhada, e cada
              ministério serve para aproximar pessoas de Deus e umas das outras.
            </p>
          </div>
        </div>
      </section>

      <section id="ministerios" className="scroll-mt-20 border-b py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-accent">Ministérios</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">Cuidado durante a semana inteira</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {ministries.map((ministry) => {
              const Icon = ministry.icon
              return (
                <Card key={ministry.title} className="rounded-lg shadow-xs transition-all hover:border-accent/40 hover:shadow-md">
                  <CardContent className="space-y-5">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-accent-soft text-accent-foreground">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{ministry.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{ministry.description}</p>
                    </div>
                    <ul className="space-y-2 text-sm">
                      {ministry.details.map((detail) => (
                        <li key={detail} className="flex gap-2">
                          <span className="mt-2 size-1.5 rounded-full bg-gold shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section id="cultos" className="scroll-mt-20 border-b py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-accent">Cultos e horários</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-normal">Encontros na Central</h2>
            </div>
            <p className="flex items-center gap-1.5 max-w-md text-sm leading-6 text-muted-foreground">
              <MapPin className="size-4 shrink-0 text-accent" />
              Rua Rui Barbosa, 200, Centro, Jacareí
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <div key={service.title} className="rounded-lg border bg-card p-5 shadow-xs transition-all hover:border-accent/40 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{service.label}</p>
                  </div>
                  {service.highlight ? (
                    <span className="rounded-lg bg-gold-soft px-3 py-1 text-xs font-semibold text-gold">
                      {service.highlight}
                    </span>
                  ) : null}
                </div>
                <dl className="mt-6 grid gap-3 text-sm">
                  <div className="flex justify-between gap-4 border-t pt-3">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5 text-accent" />
                      Horário
                    </dt>
                    <dd className="font-medium">{service.time}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-t pt-3">
                    <dt className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="size-3.5 text-accent" />
                      Local
                    </dt>
                    <dd className="text-right font-medium">{service.address}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="primeira-vez" className="scroll-mt-20 border-b bg-muted/30 py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold text-accent">Primeira vez aqui?</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-normal">Você não precisa chegar sabendo tudo</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Se está visitando pela primeira vez, fale conosco. Queremos ajudar você a encontrar um culto, uma Casa de
              Vida ou alguém para conversar.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants(), "mt-6 bg-accent text-white hover:bg-accent/90 shadow-sm")}
            >
              Quero falar com alguém
            </a>
          </div>
          <div className="grid gap-3">
            {firstVisitSteps.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={step.title} className="flex gap-4 rounded-lg border bg-card p-4 shadow-xs transition-colors hover:border-accent/30">
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-foreground font-semibold">
                    <Icon className="size-5" />
                    <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black">
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <footer id="contato" className="scroll-mt-20 border-t bg-card pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Coluna 1: Marca & Redes */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/logo.svg" alt="Igreja Siloé" width={44} height={44} className="rounded-full shadow-xs" />
                <div>
                  <h3 className="text-lg font-semibold leading-tight">Igreja Siloé</h3>
                  <p className="text-xs text-muted-foreground">Uma Família de Verdade</p>
                </div>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Um lugar para encontrar cuidado, crescer na fé e viver comunidade em Jacareí/SP.
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  title="Conversar no WhatsApp"
                  aria-label="WhatsApp"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-200 hover:border-accent hover:bg-accent-soft hover:text-accent hover:scale-110 shadow-xs"
                >
                  <MessageCircle className="size-4" />
                </a>
                <a
                  href={instagramHref}
                  target="_blank"
                  rel="noreferrer"
                  title="Siga @siloe.igreja no Instagram"
                  aria-label="Instagram"
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-200 hover:border-accent hover:bg-accent-soft hover:text-accent hover:scale-110 shadow-xs"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Coluna 2: Navegação */}
            <div>
              <h4 className="text-sm font-semibold tracking-tight text-foreground">Navegação</h4>
              <ul className="mt-4 space-y-2.5 text-xs">
                {siteNavItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Coluna 3: Endereços */}
            <div>
              <h4 className="text-sm font-semibold tracking-tight text-foreground">Endereços</h4>
              <div className="mt-4 space-y-3">
                {churchAddresses.map((addr) => {
                  const Icon = addr.icon
                  return (
                    <div key={addr.label} className="rounded-lg border bg-background/50 p-3 text-xs">
                      <p className="flex items-center gap-1.5 font-semibold text-foreground">
                        <Icon className="size-3.5 text-gold shrink-0" />
                        {addr.label}
                      </p>
                      <p className="mt-1 text-muted-foreground">{addr.value}</p>
                      {addr.note ? <p className="mt-1 text-[11px] font-medium text-accent">{addr.note}</p> : null}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Coluna 4: Portal do Membro */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-tight text-foreground">Área do Membro</h4>
              <p className="text-xs leading-5 text-muted-foreground">
                Acesse a escala do louvor, solicite reservas de salas e acompanhe avisos ministeriais.
              </p>
              <Link
                href="/login"
                className={cn(buttonVariants({ size: "sm" }), "w-full justify-between bg-accent text-white hover:bg-accent/90 shadow-xs")}
              >
                <span>Entrar no Portal</span>
                <LogIn className="size-3.5" />
              </Link>
            </div>
          </div>

          <Separator className="my-8 opacity-60" />

          {/* Rodapé inferior (Copyright) */}
          <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
            <p>© {new Date().getFullYear()} Igreja Siloé. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1 text-[11px]">
              <Droplets className="size-3 text-accent" />
              Jacareí — SP
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
