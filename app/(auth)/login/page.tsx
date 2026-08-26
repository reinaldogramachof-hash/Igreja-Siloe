"use client"

import { useRouter } from "next/navigation"
import { Droplets, LogIn, Music2, ShieldCheck, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setStoredRole } from "@/lib/prototype-auth"
import type { Role } from "@/lib/types"
import { useState } from "react"

const roles: { value: Role; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "admin", label: "Admin", icon: ShieldCheck },
  { value: "lider_louvor", label: "Líder", icon: Music2 },
  { value: "membro", label: "Membro", icon: User },
]

export default function LoginPage() {
  const [role, setRole] = useState<Role>("membro")
  const router = useRouter()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStoredRole(role)
    router.push("/dashboard")
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="size-20 overflow-hidden rounded-full shadow-md">
            <video src="/videos/siloe-logo.mp4" autoPlay loop muted playsInline className="size-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">Gestão Siloé</h1>
            <p className="text-sm text-muted-foreground">Fluxos simples para uma igreja em movimento.</p>
          </div>
        </div>

        <Card className="rounded-lg shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Acessar portal</CardTitle>
            <CardDescription>Selecione um perfil de acesso para explorar a plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="membro@siloe.org.br" defaultValue="membro@siloe.org.br" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="••••••••" defaultValue="123456" required />
              </div>
              <div className="space-y-2">
                <Label>Entrar como</Label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((item) => {
                    const Icon = item.icon
                    const isSelected = role === item.value
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setRole(item.value)}
                        className={`flex flex-col items-center gap-1.5 rounded-lg border p-2.5 text-xs font-medium transition-all ${
                          isSelected
                            ? "border-accent bg-accent-soft text-accent-foreground shadow-sm font-semibold"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className={`size-4 ${isSelected ? "text-accent" : ""}`} />
                        {item.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <Button className="h-10 w-full bg-accent text-white hover:bg-accent/90 shadow-sm" type="submit">
                <LogIn className="size-4" />
                Entrar no Portal
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Droplets className="size-3.5 text-accent" />
          Acesso exclusivo para membros e líderes da Igreja Siloé.
        </p>
      </div>
    </main>
  )
}
