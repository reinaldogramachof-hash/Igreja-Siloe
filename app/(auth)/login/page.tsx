"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Droplets, LogIn, Lock, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setStoredRole } from "@/lib/prototype-auth"
import { createClient } from "@/lib/supabase/client"

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return "/dashboard"
  }

  return nextPath
}

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const router = useRouter()

  async function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setAuthError(null)
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setIsSubmitting(false)
      setAuthError(error.message)
      return
    }

    setStoredRole("membro")
    const nextPath = getSafeNextPath(new URLSearchParams(window.location.search).get("next"))
    router.push(nextPath)
    router.refresh()
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background font-sans antialiased">
      <div className="absolute left-5 top-5 z-50">
        <Link
          href="/"
          title="Voltar ao site público"
          aria-label="Voltar ao site público"
          className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white/15 hover:text-white"
        >
          <ArrowLeft className="size-4" />
        </Link>
      </div>

      <div className="relative flex min-h-screen w-full flex-col lg:flex-row">
        <div className="relative z-20 flex min-h-[340px] w-full flex-col justify-between overflow-hidden bg-slate-950 transition-transform duration-700 ease-in-out lg:min-h-screen lg:w-1/2">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-accent/20 blur-[120px] lg:size-[560px]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between p-8 text-white lg:p-14">
            <div className="my-auto flex flex-col items-center justify-center space-y-6 py-8 text-center">
              <div className="relative flex items-center justify-center p-2">
                <div className="absolute size-64 animate-pulse rounded-full bg-accent/25 blur-3xl lg:size-80" />
                <Image
                  src="/logo.svg"
                  alt="Logo Gestão de Igrejas"
                  width={340}
                  height={340}
                  priority
                  className="relative size-56 object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-transform duration-500 hover:scale-105 lg:size-72"
                />
              </div>

              <div className="max-w-md space-y-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white drop-shadow lg:text-3xl">
                  Gestão de Igrejas
                </h1>
                <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-300/90 lg:text-sm">
                  Gestão transparente, escalas integradas e facilidade de acesso para toda a liderança e membros.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Droplets className="size-4 text-accent" />
                Gestão de Igrejas (c) {new Date().getFullYear()}
              </span>
              <span className="hidden text-slate-400 sm:inline">Operação integrada para comunidades de fé</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex min-h-screen w-full items-center justify-center bg-background p-6 transition-transform duration-700 ease-in-out lg:w-1/2 lg:p-12">
          <div className="pointer-events-none absolute right-1/4 top-1/4 size-72 rounded-full bg-accent/5 blur-3xl" />

          <div className="relative z-10 w-full max-w-md space-y-6">
            <Card className="rounded-2xl border-border/80 bg-card/95 shadow-xl backdrop-blur-xl transition-all duration-300">
              <CardHeader className="space-y-1.5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Acessar Portal</CardTitle>
                    <CardDescription className="mt-1 text-xs text-muted-foreground">
                      Insira suas credenciais para acessar o portal.
                    </CardDescription>
                  </div>
                  <div className="flex size-11 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent shadow-inner">
                    <Lock className="size-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                      E-mail de Acesso
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="membro@exemplo.org.br"
                      autoComplete="email"
                      required
                      className="h-11 rounded-lg border-border/80 bg-background/60 focus-visible:border-accent focus-visible:ring-accent/30"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                        Senha
                      </Label>
                      <span className="text-right text-xs font-medium text-muted-foreground">
                        Recuperação de senha em breve
                      </span>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="********"
                      autoComplete="current-password"
                      required
                      className="h-11 rounded-lg border-border/80 bg-background/60 focus-visible:border-accent focus-visible:ring-accent/30"
                    />
                  </div>

                  {authError && (
                    <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger">
                      {authError}
                    </div>
                  )}

                  <div className="rounded-xl border border-border/40 bg-muted/20 p-3 text-xs">
                    <p className="text-[11px] text-muted-foreground">
                      Contas autenticadas entram temporariamente com perfil de membro. Papéis administrativos serão definidos pelo servidor na fase de isolamento multi-tenant.
                    </p>
                  </div>

                  <Button
                    className="h-11 w-full rounded-lg bg-accent text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:bg-accent/90 hover:shadow-accent/40"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <LogIn className="mr-2 size-4" />
                    {isSubmitting ? "Entrando..." : "Entrar no Portal"}
                  </Button>
                </form>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/80" />
                  </div>
                  <div className="relative flex justify-center text-[11px] uppercase">
                    <span className="bg-card px-3 font-semibold text-muted-foreground">Precisa de acesso?</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  type="button"
                  disabled
                  className="h-11 w-full rounded-lg border-accent/40 text-accent transition-all hover:bg-accent/10"
                >
                  <UserPlus className="mr-2 size-4" />
                  Cadastro por convite em breve
                </Button>
              </CardContent>
            </Card>

            <p className="flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground">
              <Droplets className="size-3.5 text-accent" />
              Acesso seguro para comunidades de fé.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
