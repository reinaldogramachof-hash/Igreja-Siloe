"use client"

import { useState } from "react"
import { 
  FileCheck2, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  LayoutGrid, 
  List, 
  CheckCircle2, 
  FileText, 
  MapPin, 
  ChevronRight,
  UserCheck,
  ShieldAlert
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useDemoUser } from "@/lib/prototype-auth"
import { getRoleLabel } from "@/lib/mock-data"

interface MeetingDecision {
  id: string
  text: string
  approved: boolean
}

interface Meeting {
  id: string
  title: string
  category: "Pastoral" | "Conselho" | "Liderança" | "Ministérios"
  date: string
  time: string
  location: string
  status: "scheduled" | "in_progress" | "completed"
  organizer: string
  attendeesCount: number
  summary: string
  decisions: MeetingDecision[]
}

const initialMeetings: Meeting[] = [
  {
    id: "1",
    title: "Reunião de Alinhamento Ministerial & Calendário Q4",
    category: "Liderança",
    date: "2026-08-28",
    time: "19:30",
    location: "Salão Principal / Presencial",
    status: "scheduled",
    organizer: "Pr. Marcos Silva",
    attendeesCount: 18,
    summary: "Definição de cronograma para os eventos do 4º trimestre e avaliação do Retiro de Famílias.",
    decisions: [
      { id: "d1", text: "Aprovação do orçamento para a Cantata de Natal", approved: true },
      { id: "d2", text: "Mudança do horário do ensaio geral do louvor para quinta-feira", approved: true }
    ]
  },
  {
    id: "2",
    title: "Sessão Ordinária do Conselho Pastoral",
    category: "Pastoral",
    date: "2026-08-14",
    time: "20:00",
    location: "Sala de Reuniões 01",
    status: "completed",
    organizer: "Pr. André Santos",
    attendeesCount: 8,
    summary: "Análise de novos membros, relatórios financeiros de Julho e planejamento de missões.",
    decisions: [
      { id: "d3", text: "Recepção de 12 novos membros por batismo e transferência", approved: true },
      { id: "d4", text: "Envio de oferta de apoio missionário para o sertão baiano", approved: true },
      { id: "d5", text: "Reforma no sistema de som do templo secundário", approved: true }
    ]
  },
  {
    id: "3",
    title: "Planejamento Ação Social & Voluntariado",
    category: "Ministérios",
    date: "2026-08-05",
    time: "18:00",
    location: "Anexo Social",
    status: "completed",
    organizer: "Diác. Roberto Lima",
    attendeesCount: 12,
    summary: "Organização da entrega de cestas básicas para o bairro vizinho e agendamento de sopão.",
    decisions: [
      { id: "d6", text: "Realização do sopão solidário no 2º sábado de cada mês", approved: true },
      { id: "d7", text: "Mapeamento de 45 famílias vulneráveis cadastradas", approved: true }
    ]
  }
]

export default function ReunioesPage() {
  const { user, role } = useDemoUser()
  const isLeader = role !== "membro"

  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards")
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  
  // New Meeting Form
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newCategory, setNewCategory] = useState<Meeting["category"]>("Liderança")
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newSummary, setNewSummary] = useState("")
  const [newDecisionsText, setNewDecisionsText] = useState("")

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault()

    const decisionsList = newDecisionsText
      .split("\n")
      .map(d => d.trim())
      .filter(Boolean)
      .map((text, idx) => ({ id: `new-d-${idx}`, text, approved: true }))

    const created: Meeting = {
      id: Date.now().toString(),
      title: newTitle,
      category: newCategory,
      date: newDate || new Date().toISOString().split("T")[0],
      time: newTime || "19:00",
      location: newLocation || "Auditório Principal",
      status: "scheduled",
      organizer: "Usuário Logado",
      attendeesCount: 1,
      summary: newSummary,
      decisions: decisionsList
    }

    setMeetings([created, ...meetings])
    setIsDialogOpen(false)
    setNewTitle("")
    setNewSummary("")
    setNewDecisionsText("")
    toast.success("Reunião / Ata registrada com sucesso!")
  }

  const filteredMeetings = meetings.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                          m.summary.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === "all" || m.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (!isLeader) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-4 shadow-sm border border-danger/20">
          <ShieldAlert className="size-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Acesso Restrito</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          Você está navegando como <span className="font-semibold text-foreground">{getRoleLabel(role)}</span>. O Módulo de Reuniões e Decisões é de acesso restrito à Liderança e Administração da igreja.
        </p>
        <div className="mt-6">
          <Link href="/dashboard" className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow transition-colors hover:bg-accent/90">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl flex items-center gap-2.5">
            <FileCheck2 className="size-7 text-accent shrink-0" />
            Reuniões & Decisões
          </h1>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Acompanhe as pautas, atas e resoluções tomadas pela liderança e ministérios.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger 
            render={
              <Button size="sm" className="w-full sm:w-auto gap-2 rounded-xl h-10 px-4 bg-accent hover:bg-accent/90 text-white font-semibold shadow-md shadow-accent/10 whitespace-nowrap shrink-0">
                <Plus className="size-4" />
                Nova Reunião / Ata
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[550px]">
            <form onSubmit={handleCreateMeeting}>
              <DialogHeader>
                <DialogTitle>Registrar Reunião ou Ata</DialogTitle>
                <DialogDescription>
                  Cadastre uma reunião agendada ou registre as decisões de uma ata já realizada.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="mtitle">Título da Reunião</Label>
                  <Input 
                    id="mtitle" 
                    placeholder="Ex: Reunião do Conselho Pastoral" 
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mcategory">Categoria</Label>
                    <select
                      id="mcategory"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                    >
                      <option value="Pastoral">Pastoral</option>
                      <option value="Conselho">Conselho</option>
                      <option value="Liderança">Liderança</option>
                      <option value="Ministérios">Ministérios</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mlocation">Local</Label>
                    <Input 
                      id="mlocation"
                      placeholder="Ex: Sala 01 ou Online" 
                      value={newLocation}
                      onChange={e => setNewLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="mdate">Data</Label>
                    <Input 
                      id="mdate" 
                      type="date"
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mtime">Horário</Label>
                    <Input 
                      id="mtime" 
                      type="time"
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="msummary">Resumo da Pauta</Label>
                  <Input 
                    id="msummary" 
                    placeholder="Resumo dos temas abordados" 
                    value={newSummary}
                    onChange={e => setNewSummary(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="mdecisions">Decisões Aprovadas (uma por linha)</Label>
                  <textarea 
                    id="mdecisions"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder={"Decisão 1\nDecisão 2"}
                    value={newDecisionsText}
                    onChange={e => setNewDecisionsText(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Reunião</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter and Mode Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/40 bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título ou assunto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 md:justify-end">
          <Tabs 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
            className="w-full sm:w-auto"
          >
            <TabsList className="flex w-full sm:w-auto overflow-x-auto scrollbar-none justify-start h-10">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="Pastoral">Pastoral</TabsTrigger>
              <TabsTrigger value="Conselho">Conselho</TabsTrigger>
              <TabsTrigger value="Liderança">Liderança</TabsTrigger>
              <TabsTrigger value="Ministérios">Ministérios</TabsTrigger>
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

      {/* Main Content Area */}
      {filteredMeetings.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent className="space-y-3 pt-6">
            <FileText className="mx-auto size-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">Nenhuma reunião encontrada</h3>
            <p className="text-sm text-muted-foreground">Tente alterar os termos da busca ou filtros.</p>
          </CardContent>
        </Card>
      ) : viewMode === "cards" ? (
        /* Cards View (Mobile First Default) */
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredMeetings.map(meeting => (
            <Card key={meeting.id} className="flex flex-col justify-between transition-all hover:border-accent/40 shadow-sm">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-semibold text-accent">
                    {meeting.category}
                  </Badge>
                  <Badge 
                    variant={meeting.status === "completed" ? "secondary" : meeting.status === "in_progress" ? "default" : "outline"}
                    className="gap-1"
                  >
                    {meeting.status === "completed" ? (
                      <>
                        <CheckCircle2 className="size-3 text-emerald-500" /> Ata Concluída
                      </>
                    ) : (
                      <>
                        <Clock className="size-3" /> Agendada
                      </>
                    )}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-bold leading-snug">{meeting.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs">{meeting.summary}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 flex-1 text-xs">
                <div className="grid gap-1.5 rounded-lg border border-border/40 bg-muted/20 p-2.5">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="size-3.5 shrink-0 text-accent" />
                    <span>{new Date(meeting.date).toLocaleDateString('pt-BR')} às {meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0 text-accent" />
                    <span className="truncate">{meeting.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UserCheck className="size-3.5 shrink-0 text-accent" />
                    <span>Organizado por: <strong>{meeting.organizer}</strong></span>
                  </div>
                </div>

                {meeting.decisions.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                      Principais Decisões ({meeting.decisions.length})
                    </p>
                    <div className="space-y-1">
                      {meeting.decisions.slice(0, 2).map(d => (
                        <div key={d.id} className="flex items-start gap-1.5 text-xs">
                          <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{d.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="border-t border-border/40 pt-4 flex justify-between items-center">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="size-3.5" />
                  <span>{meeting.attendeesCount} participantes</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1 text-xs font-semibold text-accent hover:text-accent"
                  onClick={() => setSelectedMeeting(meeting)}
                >
                  Ver Ata <ChevronRight className="size-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredMeetings.map(meeting => (
            <Card key={meeting.id} className="p-4 transition-all hover:border-accent/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{meeting.category}</Badge>
                    <Badge variant={meeting.status === "completed" ? "secondary" : "outline"} className="text-xs">
                      {meeting.status === "completed" ? "Ata Concluída" : "Agendada"}
                    </Badge>
                  </div>
                  <h3 className="text-base font-bold">{meeting.title}</h3>
                  <p className="text-xs text-muted-foreground">{meeting.summary}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground shrink-0">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-4 text-accent" />
                    <span>{new Date(meeting.date).toLocaleDateString('pt-BR')} ({meeting.time})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="size-4" />
                    <span>{meeting.attendeesCount} presentes</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedMeeting(meeting)}
                    className="gap-1 text-xs"
                  >
                    Ver Detalhes <ChevronRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalhes da Ata */}
      <Dialog open={!!selectedMeeting} onOpenChange={open => !open && setSelectedMeeting(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedMeeting && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-accent">{selectedMeeting.category}</Badge>
                  <Badge variant="secondary">{selectedMeeting.status === "completed" ? "Ata Registrada" : "Em Aberto"}</Badge>
                </div>
                <DialogTitle className="text-xl font-bold mt-2">{selectedMeeting.title}</DialogTitle>
                <DialogDescription className="text-xs pt-1">
                  Data: {new Date(selectedMeeting.date).toLocaleDateString('pt-BR')} às {selectedMeeting.time} | Local: {selectedMeeting.location}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-3 text-sm">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Resumo das Pautas
                  </h4>
                  <p className="text-foreground/90 bg-muted/30 p-3 rounded-lg border border-border/40 text-xs sm:text-sm">
                    {selectedMeeting.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    Decisões & Deliberações Aprovadas
                  </h4>
                  {selectedMeeting.decisions.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">Nenhuma decisão registrada nesta ata.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedMeeting.decisions.map(d => (
                        <div key={d.id} className="flex items-start gap-2.5 bg-accent/5 p-2.5 rounded-lg border border-accent/20 text-xs sm:text-sm">
                          <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{d.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-2 text-xs text-muted-foreground border-t border-border/40 flex justify-between">
                  <span>Organização: {selectedMeeting.organizer}</span>
                  <span>{selectedMeeting.attendeesCount} Participantes Registrados</span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedMeeting(null)}>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
