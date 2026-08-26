"use client"

import { useState } from "react"
import { 
  Vote, 
  Plus, 
  Search, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Users, 
  LayoutGrid, 
  List, 
  BarChart3, 
  Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useDemoUser } from "@/lib/prototype-auth"

interface Option {
  id: string
  text: string
  votes: number
}

interface Poll {
  id: string
  title: string
  description: string
  category: string
  startDate: string
  endDate: string
  status: "active" | "closed"
  totalVotes: number
  options: Option[]
  userVotedOptionId?: string
}

const initialPolls: Poll[] = [
  {
    id: "1",
    title: "Tema para a Conferência de Jovens 2026",
    description: "Escolha qual o foco principal para a nossa conferência anual de jovens.",
    category: "Mocidade",
    startDate: "2026-08-20",
    endDate: "2026-09-05",
    status: "active",
    totalVotes: 87,
    options: [
      { id: "101", text: "Identidade & Propósito na Cultura Atual", votes: 42 },
      { id: "102", text: "Avivamento & Oração Intercessora", votes: 30 },
      { id: "103", text: "Liderança & Impacto Social", votes: 15 }
    ],
    userVotedOptionId: "101"
  },
  {
    id: "2",
    title: "Horário da 2ª Escola Bíblica Dominical (EBD)",
    description: "Votação para definir se teremos uma turma de EBD no domingo à tarde.",
    category: "Ensino",
    startDate: "2026-08-15",
    endDate: "2026-08-30",
    status: "active",
    totalVotes: 142,
    options: [
      { id: "201", text: "Manhã - 09:00 (Atual)", votes: 85 },
      { id: "202", text: "Domingo à tarde - 16:30", votes: 40 },
      { id: "203", text: "Manhã - 10:00 (30min mais tarde)", votes: 17 }
    ]
  },
  {
    id: "3",
    title: "Local do Retiro de Carnaval de Famílias",
    description: "Ajude o conselho a definir a locação para o nosso retiro anual.",
    category: "Eventos",
    startDate: "2026-07-01",
    endDate: "2026-08-10",
    status: "closed",
    totalVotes: 210,
    options: [
      { id: "301", text: "Sítio Recanto das Águas (Guapimirim)", votes: 130 },
      { id: "302", text: "Pousada Monte Serrat (Teresópolis)", votes: 80 }
    ],
    userVotedOptionId: "301"
  }
]

export default function EnquetesPage() {
  const { user, role } = useDemoUser()
  const canManagePolls = role === "admin" || role === "secretaria"

  const [polls, setPolls] = useState<Poll[]>(initialPolls)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">("all")
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  
  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newCategory, setNewCategory] = useState("Geral")
  const [newEndDate, setNewEndDate] = useState("")
  const [newOptionsText, setNewOptionsText] = useState("")

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prev => prev.map(poll => {
      if (poll.id !== pollId) return poll

      const previousUserVote = poll.userVotedOptionId
      let updatedTotal = poll.totalVotes

      const updatedOptions = poll.options.map(opt => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 }
        }
        if (previousUserVote && opt.id === previousUserVote) {
          return { ...opt, votes: Math.max(0, opt.votes - 1) }
        }
        return opt
      })

      if (!previousUserVote) {
        updatedTotal += 1
      }

      return {
        ...poll,
        totalVotes: updatedTotal,
        options: updatedOptions,
        userVotedOptionId: optionId
      }
    }))

    toast.success("Voto registrado com sucesso!")
  }

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault()

    const rawOptions = newOptionsText
      .split("\n")
      .map(o => o.trim())
      .filter(Boolean)

    if (rawOptions.length < 2) {
      toast.error("Adicione pelo menos 2 opções de resposta.")
      return
    }

    const createdPoll: Poll = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDescription,
      category: newCategory || "Geral",
      startDate: new Date().toISOString().split("T")[0],
      endDate: newEndDate || "2026-12-31",
      status: "active",
      totalVotes: 0,
      options: rawOptions.map((opt, idx) => ({
        id: `${Date.now()}-${idx}`,
        text: opt,
        votes: 0
      }))
    }

    setPolls([createdPoll, ...polls])
    setIsDialogOpen(false)
    setNewTitle("")
    setNewDescription("")
    setNewCategory("Geral")
    setNewEndDate("")
    setNewOptionsText("")
    toast.success("Enquete criada com sucesso!")
  }

  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(search.toLowerCase()) || 
                          poll.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || poll.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2.5">
            <Vote className="size-7 text-accent shrink-0" />
            Enquetes & Consultas
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Participe das decisões da comunidade e acompanhe as opiniões da membresia.
          </p>
        </div>

        {canManagePolls && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger 
              render={
                <Button className="w-full sm:w-auto gap-2 bg-accent hover:bg-accent/90 text-accent-foreground whitespace-nowrap shrink-0">
                  <Plus className="size-4" />
                  Nova Enquete
                </Button>
              }
            />
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleCreatePoll}>
              <DialogHeader>
                <DialogTitle>Criar Nova Enquete</DialogTitle>
                <DialogDescription>
                  Abra uma nova consulta pública para membros e líderes participarem.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Título da Enquete</Label>
                  <Input 
                    id="title" 
                    placeholder="Ex: Definir data da cantata de natal" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required 
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Descrição / Detalhes</Label>
                  <Input 
                    id="description" 
                    placeholder="Explique brevemente o objetivo da consulta" 
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Input 
                      id="category" 
                      placeholder="Ex: Louvor, Jovens, Geral" 
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">Data de Encerramento</Label>
                    <Input 
                      id="endDate" 
                      type="date"
                      value={newEndDate}
                      onChange={e => setNewEndDate(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="options">Opções de Resposta (uma por linha)</Label>
                  <textarea 
                    id="options"
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder={"Opção 1\nOpção 2\nOpção 3"}
                    value={newOptionsText}
                    onChange={e => setNewOptionsText(e.target.value)}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Publicar Enquete</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        )}
      </div>

      {/* Control Bar: Search, Status Tabs and View Toggle */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar enquete..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 md:justify-end">
          <Tabs 
            value={statusFilter} 
            onValueChange={(val) => setStatusFilter(val as any)}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3 sm:w-auto">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="active">Ativas</TabsTrigger>
              <TabsTrigger value="closed">Encerradas</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-muted/40 p-1">
            <Button
              variant={viewMode === "cards" ? "secondary" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setViewMode("cards")}
              title="Visualização em Cards"
            >
              <LayoutGrid className="size-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="size-8"
              onClick={() => setViewMode("list")}
              title="Visualização em Lista"
            >
              <List className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* List / Cards View */}
      {filteredPolls.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent className="space-y-3 pt-6">
            <Vote className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">Nenhuma enquete encontrada</h3>
            <p className="text-sm text-muted-foreground">Tente alterar os termos de busca ou filtros.</p>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredPolls.map(poll => (
            <Card key={poll.id} className="flex flex-col justify-between transition-all hover:border-accent/40 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-semibold text-accent">
                    {poll.category}
                  </Badge>
                  <Badge variant={poll.status === "active" ? "default" : "secondary"} className="gap-1">
                    {poll.status === "active" ? (
                      <>
                        <Clock className="size-3" /> Em Andamento
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-3" /> Encerrada
                      </>
                    )}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold leading-snug">{poll.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">{poll.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 flex-1">
                <div className="space-y-2">
                  {poll.options.map(option => {
                    const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0
                    const isSelected = poll.userVotedOptionId === option.id

                    return (
                      <button
                        key={option.id}
                        onClick={() => poll.status === "active" && handleVote(poll.id, option.id)}
                        disabled={poll.status === "closed"}
                        className={`relative w-full overflow-hidden rounded-xl border p-3 text-left transition-all ${
                          isSelected
                            ? "border-accent bg-accent/10 font-medium"
                            : "border-border/50 hover:border-accent/40 hover:bg-muted/30"
                        } ${poll.status === "closed" ? "cursor-default opacity-85" : "cursor-pointer"}`}
                      >
                        {/* Progress Bar Background */}
                        <div 
                          className="absolute inset-y-0 left-0 bg-accent/15 transition-all duration-500" 
                          style={{ width: `${percentage}%` }}
                        />

                        <div className="relative flex items-center justify-between text-xs sm:text-sm">
                          <span className="flex items-center gap-2 pr-2 font-medium">
                            {isSelected && <Check className="size-4 shrink-0 text-accent" />}
                            {option.text}
                          </span>
                          <span className="shrink-0 text-xs font-bold text-muted-foreground">
                            {percentage}% ({option.votes})
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>

              <CardFooter className="border-t border-border/40 pt-4 text-xs text-muted-foreground flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  <span>{poll.totalVotes} votos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>Até {new Date(poll.endDate).toLocaleDateString('pt-BR')}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* Lista Compacta */
        <div className="space-y-4">
          {filteredPolls.map(poll => (
            <Card key={poll.id} className="p-4 transition-all hover:border-accent/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{poll.category}</Badge>
                    <Badge variant={poll.status === "active" ? "default" : "secondary"} className="text-xs">
                      {poll.status === "active" ? "Em Andamento" : "Encerrada"}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold">{poll.title}</h3>
                  <p className="text-xs text-muted-foreground">{poll.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BarChart3 className="size-4 text-accent" />
                    <span>{poll.totalVotes} votos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4" />
                    <span>Fim: {new Date(poll.endDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              {/* Opções na lista */}
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {poll.options.map(option => {
                  const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0
                  const isSelected = poll.userVotedOptionId === option.id

                  return (
                    <div 
                      key={option.id}
                      onClick={() => poll.status === "active" && handleVote(poll.id, option.id)}
                      className={`relative flex items-center justify-between rounded-lg border p-2.5 text-xs ${
                        isSelected ? "border-accent bg-accent/10" : "border-border/40"
                      } ${poll.status === "active" ? "cursor-pointer" : ""}`}
                    >
                      <span className="font-semibold flex items-center gap-1.5">
                        {isSelected && <Check className="size-3.5 text-accent" />}
                        {option.text}
                      </span>
                      <span className="text-muted-foreground font-bold">{percentage}% ({option.votes})</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
