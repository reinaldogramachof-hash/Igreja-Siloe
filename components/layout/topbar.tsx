"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ArrowLeft, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getRoleLabel } from "@/lib/mock-data"
import { useDemoUser } from "@/lib/prototype-auth"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/salas", label: "Salas" },
  { href: "/louvor", label: "Louvor" },
  { href: "/admin", label: "Admin" },
]

export function Topbar() {
  const { user, role, setRole } = useDemoUser()
  const { theme, setTheme } = useTheme()
  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-3">
                <Image src="/logo.svg" alt="Igreja Siloé" width={36} height={36} className="rounded-full" />
                Igreja Siloé
              </SheetTitle>
            </SheetHeader>
            <Separator className="my-4" />
            <nav className="grid gap-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Image src="/logo.svg" alt="Igreja Siloé" width={32} height={32} className="rounded-full" />
      </div>

      <div className="hidden lg:block">
        <p className="text-sm font-medium">Protótipo navegável</p>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3" />
          Voltar ao site
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as typeof role)}
          className="h-8 rounded-lg border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
          aria-label="Entrar como"
        >
          <option value="admin">Admin</option>
          <option value="lider_louvor">Líder de Louvor</option>
          <option value="lider_salas">Líder de Salas</option>
          <option value="membro">Membro</option>
        </select>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Alternar tema"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-4 dark:hidden" />
          <Moon className="hidden size-4 dark:block" />
        </Button>
        <div className="hidden items-center gap-2 sm:flex">
          <Avatar className="size-8">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{getRoleLabel(role)}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
