"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  LogIn,
  Music2,
  ShieldCheck,
  User,
  UserPlus,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setStoredRole } from "@/lib/prototype-auth"
import type { Role } from "@/lib/types"

const roles: { value: Role; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "admin", label: "Admin", icon: ShieldCheck },
  { value: "lider_louvor", label: "Líder", icon: Music2 },
  { value: "membro", label: "Membro", icon: User },
]

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [role, setRole] = useState<Role>("membro")
  const [registerSubmitted, setRegisterSubmitted] = useState(false)
  const router = useRouter()

  function handleLoginSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStoredRole(role)
    router.push("/dashboard")
  }

  function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRegisterSubmitted(true)
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background font-sans antialiased">
      {/* Botão flutuante para retornar ao site público (Discreto, apenas ícone) */}
      <div className="absolute top-5 left-5 z-50">
        <Link
          href="/"
          title="Voltar ao site público"
          aria-label="Voltar ao site público"
          className="inline-flex items-center justify-center size-9 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/15 backdrop-blur-md transition-all shadow-sm hover:scale-105"
        >
          <ArrowLeft className="size-4" />
        </Link>
      </div>

      {/* Grid de layout dividido com transição de inversão */}
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row">
        {/* PAINEL DA LOGO OFICIAL ESTÁTICA */}
        <div
          className={`relative w-full lg:w-1/2 min-h-[340px] lg:min-h-screen transition-transform duration-700 ease-in-out z-20 flex flex-col justify-between overflow-hidden bg-slate-950 ${
            isRegister ? "lg:translate-x-full" : "lg:translate-x-0"
          }`}
        >
          {/* Fundo com efeito de luz ambiente e gradiente profundo */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[420px] lg:size-[560px] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>

          {/* Conteúdo sobreposto ao painel */}
          <div className="relative z-10 flex flex-col justify-between h-full p-8 lg:p-14 text-white">

            {/* Logo Oficial Estática Sem Moldura e Ampliada com Destaque Premium */}
            <div className="flex flex-col items-center justify-center my-auto py-8 text-center space-y-6">
              <div className="relative flex items-center justify-center p-2">
                <div className="absolute size-64 lg:size-80 rounded-full bg-accent/25 blur-3xl animate-pulse" />
                <Image
                  src="/logo.svg"
                  alt="Logo Oficial Igreja Siloé"
                  width={340}
                  height={340}
                  priority
                  className="relative size-56 lg:size-72 object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] transition-transform hover:scale-105 duration-500"
                />
              </div>

              <div className="space-y-2 max-w-md">
                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white drop-shadow">
                  Igreja Evangélica Siloé
                </h1>
                <p className="text-xs lg:text-sm text-slate-300/90 leading-relaxed max-w-sm mx-auto">
                  Gestão transparente, escalas integradas e facilidade de acesso para toda a liderança e membros.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Droplets className="size-4 text-accent" />
                Siloé © {new Date().getFullYear()}
              </span>
              <span className="hidden sm:inline text-slate-400">Águas de Restauração e Propósito</span>
            </div>
          </div>
        </div>

        {/* PAINEL DO FORMULÁRIO (CARD REFINADO) */}
        <div
          className={`relative w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 lg:p-12 transition-transform duration-700 ease-in-out z-10 bg-background ${
            isRegister ? "lg:-translate-x-full" : "lg:translate-x-0"
          }`}
        >
          {/* Luz sutil de fundo no painel de formulário */}
          <div className="absolute top-1/4 right-1/4 size-72 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

          <div className="w-full max-w-md space-y-6 relative z-10">
            {!isRegister ? (
              /* CARD DE LOGIN REFINADO */
              <Card className="border-border/80 shadow-xl rounded-2xl bg-card/95 backdrop-blur-xl transition-all duration-300">
                <CardHeader className="space-y-1.5 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                        Acessar Portal
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-1">
                        Selecione um perfil de acesso ou insira suas credenciais.
                      </CardDescription>
                    </div>
                    <div className="size-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-inner">
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
                        type="email"
                        placeholder="membro@siloe.org.br"
                        defaultValue="membro@siloe.org.br"
                        required
                        className="h-11 rounded-lg border-border/80 bg-background/60 focus-visible:ring-accent/30 focus-visible:border-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                          Senha
                        </Label>
                        <span className="text-xs text-accent hover:underline font-medium cursor-pointer">
                          Esqueceu a senha?
                        </span>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        defaultValue="123456"
                        required
                        className="h-11 rounded-lg border-border/80 bg-background/60 focus-visible:ring-accent/30 focus-visible:border-accent"
                      />
                    </div>

                    <div className="space-y-2 pt-1">
                      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Perfil para Demonstração
                      </Label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {roles.map((item) => {
                          const Icon = item.icon
                          const isSelected = role === item.value
                          return (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => setRole(item.value)}
                              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-all ${
                                isSelected
                                  ? "border-accent bg-accent/15 text-accent shadow-md font-semibold ring-2 ring-accent/30 scale-[1.02]"
                                  : "hover:bg-muted/80 text-muted-foreground border-border/70 hover:border-accent/40"
                              }`}
                            >
                              <Icon className={`size-4 ${isSelected ? "text-accent" : ""}`} />
                              {item.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <Button
                      className="h-11 w-full bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/25 hover:shadow-accent/40 transition-all font-semibold text-sm rounded-lg"
                      type="submit"
                    >
                      <LogIn className="size-4 mr-2" />
                      Entrar no Portal
                    </Button>
                  </form>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/80" />
                    </div>
                    <div className="relative flex justify-center text-[11px] uppercase">
                      <span className="bg-card px-3 text-muted-foreground font-semibold">Ainda não tem conta?</span>
                    </div>
                  </div>

                  <div>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setIsRegister(true)
                        setRegisterSubmitted(false)
                      }}
                      className="w-full h-11 border-accent/40 text-accent hover:bg-accent/10 transition-all font-semibold rounded-lg"
                    >
                      <UserPlus className="size-4 mr-2" />
                      Solicitar Cadastro de Membro
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* CARD DE CADASTRO REFINADO */
              <Card className="border-border/80 shadow-xl rounded-2xl bg-card/95 backdrop-blur-xl transition-all duration-300">
                <CardHeader className="space-y-1.5 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                        Solicitar Cadastro
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-1">
                        Preencha seus dados para solicitação de acesso à secretaria.
                      </CardDescription>
                    </div>
                    <div className="size-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-inner">
                      <UserPlus className="size-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {registerSubmitted ? (
                    <div className="py-8 flex flex-col items-center text-center space-y-3.5">
                      <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center ring-4 ring-emerald-500/20">
                        <CheckCircle2 className="size-9" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">Solicitação Enviada!</h3>
                      <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                        Sua solicitação de cadastro foi registrada com sucesso. A liderança da Igreja Siloé analisará e entrará em contato em breve.
                      </p>
                      <Button
                        variant="default"
                        onClick={() => setIsRegister(false)}
                        className="mt-4 bg-accent text-white hover:bg-accent/90 shadow-md font-semibold text-xs px-6 py-2.5 rounded-lg"
                      >
                        Voltar para a tela de Login
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                      <div className="space-y-1.5">
                        <Label htmlFor="reg-name" className="text-xs font-semibold">Nome Completo</Label>
                        <Input id="reg-name" placeholder="Ex: Gabriel Souza" required className="h-10 rounded-lg" />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="reg-email" className="text-xs font-semibold">E-mail</Label>
                        <Input id="reg-email" type="email" placeholder="seuemail@exemplo.com" required className="h-10 rounded-lg" />
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="space-y-1.5">
                          <Label htmlFor="reg-phone" className="text-xs font-semibold">WhatsApp</Label>
                          <Input id="reg-phone" placeholder="(71) 99999-0000" required className="h-10 rounded-lg" />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="reg-ministry" className="text-xs font-semibold">Ministério</Label>
                          <Input id="reg-ministry" placeholder="Ex: Louvor, Mídia" className="h-10 rounded-lg" />
                        </div>
                      </div>

                      <Button
                        className="h-11 w-full bg-accent text-white hover:bg-accent/90 shadow-lg shadow-accent/25 hover:shadow-accent/40 font-semibold text-sm transition-all rounded-lg mt-2"
                        type="submit"
                      >
                        <CheckCircle2 className="size-4 mr-2" />
                        Enviar Solicitação
                      </Button>
                    </form>
                  )}

                  {!registerSubmitted && (
                    <div className="text-center border-t border-border/80 pt-4 mt-2">
                      <p className="text-xs text-muted-foreground">
                        Já possui um cadastro ativo?{" "}
                        <button
                          type="button"
                          onClick={() => setIsRegister(false)}
                          className="font-semibold text-accent hover:underline focus:outline-none"
                        >
                          Entrar com minha conta
                        </button>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
              <Droplets className="size-3.5 text-accent" />
              Acesso seguro para a comunidade da Igreja Siloé.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}


