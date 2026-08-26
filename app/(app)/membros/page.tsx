"use client"

import { useMemo, useState } from "react"
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Cake,
  GraduationCap,
  CheckCircle2,
  Clock,
  Sparkles,
  Phone,
  Mail,
  Calendar,
  Award,
  QrCode,
  Printer,
  Plus,
  Edit,
  Grid,
  List,
  ShieldCheck,
  ChevronRight,
  Heart,
  Droplets,
} from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { members as initialMembers } from "@/lib/mock-data"
import type { Member, MemberCategory, MemberStatus, GrowthStep } from "@/lib/types"
import { useDemoUser } from "@/lib/prototype-auth"
import { cn } from "@/lib/utils"

const defaultGrowthSteps: GrowthStep[] = [
  { id: "g1", title: "Batismo nas Águas", completed: false },
  { id: "g2", title: "Curso de Integração", completed: false },
  { id: "g3", title: "Discipulado 1:1", completed: false },
  { id: "g4", title: "Escola de Líderes", completed: false },
]

export default function MembrosPage() {
  const { user, role } = useDemoUser()
  const isSecretary = role === "admin" || role === "secretaria"

  // State
  const [membersList, setMembersList] = useState<Member[]>(() => [...initialMembers])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("todas")
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [viewMode, setViewMode] = useState<"tabela" | "grid">("grid")
  const [onlyBirthdays, setOnlyBirthdays] = useState(false)

  // Selected Member for Profile & Membership Card Modal
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [activeProfileTab, setActiveProfileTab] = useState<"dados" | "trilha" | "cartao" | "certificados">("dados")

  // New Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newCategory, setNewCategory] = useState<MemberCategory>("membro")
  const [newBirthDate, setNewBirthDate] = useState("")
  const [newBaptismDate, setNewBaptismDate] = useState("")
  const [newMinistry, setNewMinistry] = useState("")

  // Filtered List
  const filteredMembers = useMemo(() => {
    return membersList.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.phone && m.phone.includes(searchTerm))
      
      const matchesCategory = categoryFilter === "todas" || m.category === categoryFilter
      const matchesStatus = statusFilter === "todos" || m.status === statusFilter

      // Aniversariantes do mês atual (Agosto - Mês 08)
      const currentMonth = "08"
      const isBirthdayThisMonth = m.birthDate ? m.birthDate.split("-")[1] === currentMonth : false
      const matchesBirthday = !onlyBirthdays || isBirthdayThisMonth

      return matchesSearch && matchesCategory && matchesStatus && matchesBirthday
    })
  }, [membersList, searchTerm, categoryFilter, statusFilter, onlyBirthdays])

  // KPIs
  const totalMembros = membersList.length
  const totalAtivos = membersList.filter((m) => m.status === "ativo").length
  const totalAniversariantes = membersList.filter(
    (m) => m.birthDate && m.birthDate.split("-")[1] === "08"
  ).length
  const totalEmTrilha = membersList.filter(
    (m) => m.growthSteps && m.growthSteps.some((s) => s.completed)
  ).length

  // Handlers
  function handleAddMember(e: React.FormEvent) {
    e.preventDefault()
    if (!newName || !newEmail) {
      toast.error("Preencha nome e e-mail do novo membro.")
      return
    }

    const newMemberItem: Member = {
      id: `mem-${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone || "(61) 99000-0000",
      role: "membro",
      status: "ativo",
      category: newCategory,
      birthDate: newBirthDate || "1998-05-10",
      baptismDate: newBaptismDate || undefined,
      maritalStatus: "solteiro",
      ministries: newMinistry ? [newMinistry] : ["Recepção"],
      growthSteps: [...defaultGrowthSteps],
    }

    setMembersList([newMemberItem, ...membersList])
    setIsAddModalOpen(false)
    resetAddForm()
    toast.success("Membro cadastrado com sucesso na secretaria!")
  }

  function resetAddForm() {
    setNewName("")
    setNewEmail("")
    setNewPhone("")
    setNewCategory("membro")
    setNewBirthDate("")
    setNewBaptismDate("")
    setNewMinistry("")
  }

  function toggleGrowthStep(memberId: string, stepId: string) {
    setMembersList((prev) =>
      prev.map((m) => {
        if (m.id !== memberId) return m
        const updatedSteps = (m.growthSteps || defaultGrowthSteps).map((s) => {
          if (s.id !== stepId) return s
          return {
            ...s,
            completed: !s.completed,
            completedAt: !s.completed ? new Date().toISOString().split("T")[0] : undefined,
          }
        })
        return { ...m, growthSteps: updatedSteps }
      })
    )

    // Atualizar selectedMember se estiver aberto
    if (selectedMember && selectedMember.id === memberId) {
      setSelectedMember((prev) => {
        if (!prev) return null
        const updatedSteps = (prev.growthSteps || defaultGrowthSteps).map((s) => {
          if (s.id !== stepId) return s
          return {
            ...s,
            completed: !s.completed,
            completedAt: !s.completed ? new Date().toISOString().split("T")[0] : undefined,
          }
        })
        return { ...prev, growthSteps: updatedSteps }
      })
    }

    toast.success("Progresso na Trilha de Crescimento atualizado!")
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Users className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Secretaria & Membros
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Gestão cadastral de membros, trilha de crescimento (discipulado), cartão digital e certificados.
          </p>
        </div>

        {isSecretary && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={() => setOnlyBirthdays(!onlyBirthdays)}
              variant={onlyBirthdays ? "default" : "outline"}
              size="sm"
              className={cn(
                "gap-2 rounded-xl h-10 px-3.5 border-amber-500/40 font-semibold",
                onlyBirthdays && "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
              )}
            >
              <Cake className="size-4" />
              Aniversariantes do Mês ({totalAniversariantes})
            </Button>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              size="sm"
              className="gap-2 rounded-xl h-10 px-4 bg-accent hover:bg-accent/90 text-white font-semibold shadow-md shadow-accent/10"
            >
              <UserPlus className="size-4.5" />
              Novo Membro
            </Button>
          </div>
        )}
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Cadastrado</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">{totalMembros} pessoas</h3>
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {totalAtivos} ativos no rol
              </p>
            </div>
            <div className="size-12 rounded-2xl bg-accent-soft/40 text-accent flex items-center justify-center">
              <Users className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-amber-500/20 bg-amber-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Aniversariantes (Agosto)</p>
              <h3 className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">{totalAniversariantes} membros</h3>
              <p className="text-[11px] font-semibold text-amber-600/80 mt-1">Parabenizar equipe</p>
            </div>
            <div className="size-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Cake className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-sky-500/20 bg-sky-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">Na Trilha de Crescimento</p>
              <h3 className="text-2xl font-extrabold text-sky-700 dark:text-sky-300 mt-1">{totalEmTrilha} membros</h3>
              <p className="text-[11px] font-semibold text-sky-600/80 mt-1">Discipulado e Cursos</p>
            </div>
            <div className="size-12 rounded-2xl bg-sky-500/15 text-sky-600 flex items-center justify-center">
              <GraduationCap className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Visitantes / Integração</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">1 recente</h3>
              <p className="text-[11px] font-semibold text-emerald-600/80 mt-1">Acompanhamento pastoral</p>
            </div>
            <div className="size-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <Sparkles className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TOOLBAR DE BUSCA E FILTROS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card/45 p-3 rounded-2xl border border-border/40 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, e-mail, fone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 pl-8 text-xs rounded-xl border-border/50 bg-background/60"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-9 rounded-xl border border-border/50 bg-background/60 px-3 text-xs font-semibold focus:ring-accent"
          >
            <option value="todas">Todas as Categorias</option>
            <option value="membro">Membro</option>
            <option value="congregado">Congregado</option>
            <option value="lider">Líder</option>
            <option value="diacono">Diácono</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-xl border border-border/50 bg-background/60 px-3 text-xs font-semibold focus:ring-accent"
          >
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        {/* Visualização Lista x Grid */}
        <div className="flex items-center gap-1 rounded-xl border border-border/40 bg-background/50 p-1 self-end md:self-auto">
          <Button
            variant={viewMode === "tabela" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("tabela")}
            className="size-7 rounded-lg"
            title="Visão Tabela"
          >
            <List className="size-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="size-7 rounded-lg"
            title="Visão Cartões"
          >
            <Grid className="size-4" />
          </Button>
        </div>
      </div>

      {/* VISÃO 1: TABELA DE MEMBROS */}
      {viewMode === "tabela" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/20 border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Membro / Nome</th>
                    <th className="py-3 px-4">Categoria & Status</th>
                    <th className="py-3 px-4">Contato</th>
                    <th className="py-3 px-4">Ministérios</th>
                    <th className="py-3 px-4">Trilha de Crescimento</th>
                    <th className="py-3 px-4 text-center">Ficha & Cartão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-medium">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => {
                      const completedSteps = member.growthSteps
                        ? member.growthSteps.filter((s) => s.completed).length
                        : 0
                      const totalSteps = member.growthSteps ? member.growthSteps.length : 4
                      const progressPct = Math.round((completedSteps / totalSteps) * 100)

                      return (
                        <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9 rounded-xl border border-border/40">
                                <AvatarFallback className="bg-accent-soft/50 text-accent font-bold text-xs">
                                  {member.name
                                    .split(" ")
                                    .slice(0, 2)
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-foreground text-sm">{member.name}</p>
                                {member.birthDate && (
                                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Cake className="size-3 text-amber-500 shrink-0" />
                                    {member.birthDate.split("-").reverse().join("/")}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col items-start gap-1">
                              <Badge className="bg-accent-soft/80 text-accent border-accent/20 text-[10px] capitalize">
                                {member.category}
                              </Badge>
                              <span
                                className={cn(
                                  "text-[10px] font-bold",
                                  member.status === "ativo" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                                )}
                              >
                                ● {member.status === "ativo" ? "Ativo" : "Inativo"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="text-foreground">{member.email}</p>
                            <p className="text-[10px] text-muted-foreground">{member.phone || "—"}</p>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1">
                              {member.ministries.map((m) => (
                                <Badge key={m} variant="outline" className="text-[9px] px-1.5 py-0">
                                  {m}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="w-32 space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold">
                                <span>{completedSteps}/{totalSteps} etapas</span>
                                <span>{progressPct}%</span>
                              </div>
                              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full rounded-full transition-all",
                                    progressPct === 100 ? "bg-emerald-500" : "bg-accent"
                                  )}
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedMember(member)
                                setActiveProfileTab("dados")
                              }}
                              className="h-8 rounded-xl text-xs font-semibold gap-1.5 border-border/60 hover:bg-accent-soft/30 hover:text-accent"
                            >
                              Ficha & Cartão
                              <ChevronRight className="size-3.5" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground italic">
                        Nenhum membro encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* VISÃO 2: GRID DE CARTÕES */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden flex flex-col justify-between">
              <CardHeader className="p-4 pb-2 border-b border-border/30 flex flex-row items-center gap-3">
                <Avatar className="size-12 rounded-xl border border-border/40 shrink-0">
                  <AvatarFallback className="bg-accent-soft text-accent font-bold text-sm">
                    {member.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm font-bold text-foreground truncate">{member.name}</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1.5 mt-0.5">
                    <Badge className="bg-accent-soft/80 text-accent border-accent/20 text-[9px] px-1.5 py-0">
                      {member.category}
                    </Badge>
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-4 space-y-2 text-xs">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5 shrink-0 text-accent" />
                  <span className="truncate">{member.email}</span>
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5 shrink-0 text-accent" />
                  <span>{member.phone || "Não informado"}</span>
                </p>
                {member.birthDate && (
                  <p className="flex items-center gap-2 text-muted-foreground">
                    <Cake className="size-3.5 shrink-0 text-amber-500" />
                    <span>Nascimento: {member.birthDate.split("-").reverse().join("/")}</span>
                  </p>
                )}

                <div className="pt-2 border-t border-border/30">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">Ministérios</p>
                  <div className="flex flex-wrap gap-1">
                    {member.ministries.map((m) => (
                      <Badge key={m} variant="outline" className="text-[9px]">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <div className="p-3 bg-muted/10 border-t border-border/30 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  ● Status: {member.status}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedMember(member)
                    setActiveProfileTab("dados")
                  }}
                  className="h-7 text-xs font-bold text-accent hover:bg-accent-soft/30 px-2 rounded-lg"
                >
                  Ver Ficha
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* MODAL 1: FICHA DETALHADA DO MEMBRO + CARTÃO DIGITAL & TRILHA */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="sm:max-w-[560px] rounded-2xl border-border/80 bg-card overflow-hidden">
          {selectedMember && (
            <>
              <DialogHeader className="border-b border-border/30 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 rounded-xl border border-accent/30">
                    <AvatarFallback className="bg-accent text-white font-bold text-sm">
                      {selectedMember.name
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-lg font-bold text-foreground">
                      {selectedMember.name}
                    </DialogTitle>
                    <DialogDescription className="text-xs flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-accent capitalize">{selectedMember.category}</span> ·{" "}
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Ativo no rol</span>
                    </DialogDescription>
                  </div>
                </div>

                {/* Sub-navegação do Perfil */}
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-1.5 pt-3 w-full">
                  <Button
                    variant={activeProfileTab === "dados" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveProfileTab("dados")}
                    className="h-8 text-xs font-bold rounded-lg px-2 w-full sm:w-auto"
                  >
                    Dados Pessoais
                  </Button>
                  <Button
                    variant={activeProfileTab === "trilha" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveProfileTab("trilha")}
                    className="h-8 text-xs font-bold rounded-lg px-2 w-full sm:w-auto"
                  >
                    Trilha Crescimento
                  </Button>
                  <Button
                    variant={activeProfileTab === "cartao" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveProfileTab("cartao")}
                    className="h-8 text-xs font-bold rounded-lg px-2 text-accent w-full sm:w-auto"
                  >
                    Cartão Digital
                  </Button>
                  <Button
                    variant={activeProfileTab === "certificados" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveProfileTab("certificados")}
                    className="h-8 text-xs font-bold rounded-lg px-2 w-full sm:w-auto"
                  >
                    Certificados
                  </Button>
                </div>
              </DialogHeader>

              {/* ABA 1: DADOS PESSOAIS */}
              {activeProfileTab === "dados" && (
                <div className="space-y-4 pt-2 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl border border-border/40 bg-muted/15">
                    <div className="min-w-0">
                      <p className="text-muted-foreground font-semibold">E-mail</p>
                      <p className="font-bold text-foreground mt-0.5 truncate">{selectedMember.email}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-muted-foreground font-semibold">Telefone / WhatsApp</p>
                      <p className="font-bold text-foreground mt-0.5">{selectedMember.phone || "Não informado"}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-muted-foreground font-semibold">Data de Nascimento</p>
                      <p className="font-bold text-foreground mt-0.5">
                        {selectedMember.birthDate ? selectedMember.birthDate.split("-").reverse().join("/") : "—"}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-muted-foreground font-semibold">Data de Batismo</p>
                      <p className="font-bold text-foreground mt-0.5">
                        {selectedMember.baptismDate ? selectedMember.baptismDate.split("-").reverse().join("/") : "Não batizado"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-foreground mb-1.5">Ministérios e Atuações</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMember.ministries.map((m) => (
                        <Badge key={m} className="bg-accent-soft text-accent border-accent/20 text-xs px-2 py-0.5">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: TRILHA DE CRESCIMENTO (DISCIPULADO) */}
              {activeProfileTab === "trilha" && (
                <div className="space-y-4 pt-2 text-xs">
                  <div className="p-3 rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300">
                    <p className="font-bold flex items-center gap-1.5 text-xs">
                      <GraduationCap className="size-4" /> Trilha de Discipulado Ministerial
                    </p>
                    <p className="text-[11px] mt-0.5">
                      Acompanhe o desenvolvimento e a conclusão dos passos de integração na Igreja Siloé.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {(selectedMember.growthSteps || defaultGrowthSteps).map((step) => (
                      <div
                        key={step.id}
                        onClick={() => isSecretary && toggleGrowthStep(selectedMember.id, step.id)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer",
                          step.completed
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "border-border/40 bg-background/50 text-muted-foreground hover:border-border/80"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "size-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                              step.completed
                                ? "bg-emerald-500 text-white"
                                : "border border-border/80 text-muted-foreground"
                            )}
                          >
                            {step.completed ? "✓" : "○"}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-xs">{step.title}</p>
                            {step.completedAt && (
                              <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                                Concluído em {step.completedAt.split("-").reverse().join("/")}
                              </p>
                            )}
                          </div>
                        </div>

                        {isSecretary && (
                          <span className="text-[10px] font-bold text-accent underline">
                            {step.completed ? "Marcar Pendente" : "Concluir Etapa"}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA 3: CARTÃO DIGITAL DE MEMBRO */}
              {activeProfileTab === "cartao" && (
                <div className="space-y-4 pt-2 flex flex-col items-center">
                  {/* CARTEIRINHA DE MEMBRO DESIGN PREMIUM */}
                  <div className="w-full max-w-sm rounded-2xl border border-accent/40 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 p-5 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                      <Droplets className="size-32 text-accent" />
                    </div>

                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Droplets className="size-5 text-accent" />
                        <div>
                          <p className="text-xs font-extrabold tracking-wide uppercase">Igreja Evangélica Siloé</p>
                          <p className="text-[9px] text-slate-300 uppercase tracking-widest font-semibold">Cartão Oficial de Membro</p>
                        </div>
                      </div>
                      <Badge className="bg-accent text-white text-[9px] font-bold uppercase tracking-wider">
                        {selectedMember.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 py-4">
                      <Avatar className="size-16 rounded-xl border-2 border-accent shadow-md shrink-0">
                        <AvatarFallback className="bg-accent/30 text-white font-bold text-lg">
                          {selectedMember.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-white truncate">{selectedMember.name}</p>
                        <p className="text-[11px] text-slate-300 font-medium mt-0.5">{selectedMember.email}</p>
                        <p className="text-[10px] text-accent font-mono font-bold mt-1">ID: {selectedMember.id}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px]">
                      <div>
                        <p className="text-slate-400">Rol de Membresia</p>
                        <p className="font-bold text-emerald-400">Ativo / Regular</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-lg">
                        <QrCode className="size-6 text-white" />
                        <span className="text-[8px] font-mono text-slate-300">VALIDAR</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => toast.success("Cartão digital de membro exportado com sucesso!")}
                    className="gap-2 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold text-xs h-9 px-4"
                  >
                    <Printer className="size-4" /> Baixar / Imprimir Cartão
                  </Button>
                </div>
              )}

              {/* ABA 4: CERTIFICADOS */}
              {activeProfileTab === "certificados" && (
                <div className="space-y-3 pt-2 text-xs">
                  <Card className="rounded-xl border-border/40 bg-muted/15 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="size-6 text-amber-500 shrink-0" />
                      <div>
                        <p className="font-bold text-foreground text-xs">Certificado de Batismo nas Águas</p>
                        <p className="text-[10px] text-muted-foreground">Documento oficial de confissão de fé e batismo.</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toast.success("Certificado de Batismo gerado para impressão!")}
                      className="h-8 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      Gerar PDF
                    </Button>
                  </Card>

                  <Card className="rounded-xl border-border/40 bg-muted/15 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="size-6 text-sky-500 shrink-0" />
                      <div>
                        <p className="font-bold text-foreground text-xs">Certificado de Apresentação de Bebês</p>
                        <p className="text-[10px] text-muted-foreground">Certificado e bênção de apresentação de crianças.</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toast.success("Certificado de Apresentação gerado!")}
                      className="h-8 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white"
                    >
                      Gerar PDF
                    </Button>
                  </Card>
                </div>
              )}

              <DialogFooter className="pt-3 border-t border-border/30">
                <Button size="sm" onClick={() => setSelectedMember(null)} className="rounded-xl text-xs font-semibold">
                  Fechar Ficha
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CADASTRO DE NOVO MEMBRO */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Novo Cadastro de Membro</DialogTitle>
            <DialogDescription className="text-xs">
              Insira os dados iniciais do membro ou visitante para o banco de dados da igreja.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Nome Completo</Label>
              <Input
                placeholder="Ex: Gabriel Santos Silva"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-10 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">E-mail</Label>
                <Input
                  type="email"
                  placeholder="gabriel@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Telefone / WhatsApp</Label>
                <Input
                  placeholder="(61) 99999-8888"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Categoria Eclesiástica</Label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as MemberCategory)}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  <option value="membro">Membro</option>
                  <option value="congregado">Congregado</option>
                  <option value="visitante">Visitante</option>
                  <option value="lider">Líder de Ministério</option>
                  <option value="diacono">Diácono</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Ministério Inicial</Label>
                <Input
                  placeholder="Ex: Recepção, Kids, Louvor"
                  value={newMinistry}
                  onChange={(e) => setNewMinistry(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Data de Nascimento</Label>
                <Input
                  type="date"
                  value={newBirthDate}
                  onChange={(e) => setNewBirthDate(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Data de Batismo (se houver)</Label>
                <Input
                  type="date"
                  value={newBaptismDate}
                  onChange={(e) => setNewBaptismDate(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold">
                Salvar Cadastro
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
