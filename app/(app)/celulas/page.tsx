"use client"

import { useMemo, useState } from "react"
import {
  Network,
  Users,
  Plus,
  Search,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  FileCheck2,
  BookOpen,
  Heart,
  UserCheck,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  Filter,
  Share2,
  Target,
} from "lucide-react"
import { toast } from "sonner"
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
import { cellGroups as initialCellGroups, cellReports as initialReports } from "@/lib/mock-data"
import type { CellGroup, CellMeetingReport, CellNetwork } from "@/lib/types"
import { useDemoUser } from "@/lib/prototype-auth"
import { cn } from "@/lib/utils"

const networksList: CellNetwork[] = [
  "Jovens",
  "Casais",
  "Famílias",
  "Mulheres",
  "Homens",
  "Adolescentes",
]

export default function CelulasPage() {
  const { user } = useDemoUser()

  // Active Tab
  const [activeTab, setActiveTab] = useState<"celulas" | "relatorios" | "localizador">("celulas")

  // State
  const [cellList, setCellList] = useState<CellGroup[]>(() => [...initialCellGroups])
  const [reportsList, setReportsList] = useState<CellMeetingReport[]>(() => [...initialReports])

  // Filters State
  const [searchTerm, setSearchTerm] = useState("")
  const [networkFilter, setNetworkFilter] = useState<string>("todas")
  const [dayFilter, setDayFilter] = useState<string>("todos")

  // Modal States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isAddCellModalOpen, setIsAddCellModalOpen] = useState(false)
  const [selectedCellDetail, setSelectedCellDetail] = useState<CellGroup | null>(null)

  // Report Form State
  const [reportCellId, setReportCellId] = useState(cellList[0]?.id || "")
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0])
  const [reportAttendees, setReportAttendees] = useState("12")
  const [reportVisitors, setReportVisitors] = useState("2")
  const [reportBibles, setReportBibles] = useState("10")
  const [reportConversions, setReportConversions] = useState("0")
  const [reportOffering, setReportOffering] = useState("75.00")
  const [reportTopic, setReportTopic] = useState("Série Identidade em Cristo - Lição 5")
  const [reportNotes, setReportNotes] = useState("")

  // Add Cell Form State
  const [cellName, setCellName] = useState("")
  const [cellNetwork, setCellNetwork] = useState<CellNetwork>("Jovens")
  const [cellLeader, setCellLeader] = useState("")
  const [cellHost, setCellHost] = useState("")
  const [cellDay, setCellDay] = useState<CellGroup["dayOfWeek"]>("Quinta")
  const [cellTime, setCellTime] = useState("20:00")
  const [cellNeighborhood, setCellNeighborhood] = useState("")
  const [cellAddress, setCellAddress] = useState("")

  // Filtered Cells
  const filteredCells = useMemo(() => {
    return cellList.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.neighborhood.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.leaderName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesNetwork = networkFilter === "todas" || c.network === networkFilter
      const matchesDay = dayFilter === "todos" || c.dayOfWeek === dayFilter

      return matchesSearch && matchesNetwork && matchesDay
    })
  }, [cellList, searchTerm, networkFilter, dayFilter])

  // KPIs
  const totalCelulas = cellList.length
  const totalMembrosCelulas = cellList.reduce((acc, c) => acc + c.membersCount, 0)
  const totalDecisoesMes = reportsList.reduce((acc, r) => acc + r.conversionsCount, 0)
  const totalOfertaCelulas = reportsList.reduce((acc, r) => acc + r.offeringAmount, 0)

  // Handlers
  function handleAddReport(e: React.FormEvent) {
    e.preventDefault()
    const targetCell = cellList.find((c) => c.id === reportCellId) || cellList[0]

    const newReport: CellMeetingReport = {
      id: `rep-${Date.now()}`,
      cellId: targetFamilyId(targetCell.id),
      cellName: targetCell.name,
      meetingDate: reportDate,
      attendeesCount: parseInt(reportAttendees) || 0,
      visitorsCount: parseInt(reportVisitors) || 0,
      biblesCount: parseInt(reportBibles) || 0,
      conversionsCount: parseInt(reportConversions) || 0,
      offeringAmount: parseFloat(reportOffering) || 0,
      studyTopic: reportTopic || "Estudo Semanal",
      notes: reportNotes,
      submittedBy: user.name,
    }

    function targetFamilyId(id: string) { return id }

    setReportsList([newReport, ...reportsList])
    setIsReportModalOpen(false)
    resetReportForm()
    toast.success(`Relatório da ${targetCell.name} enviado com sucesso!`)
  }

  function handleAddCell(e: React.FormEvent) {
    e.preventDefault()
    if (!cellName || !cellLeader || !cellNeighborhood) {
      toast.error("Preencha o nome da célula, líder e bairro.")
      return
    }

    const newCell: CellGroup = {
      id: `cell-${Date.now()}`,
      name: cellName,
      network: cellNetwork,
      leaderName: cellLeader,
      hostName: cellHost || "Casa do Líder",
      dayOfWeek: cellDay,
      time: cellTime,
      neighborhood: cellNeighborhood,
      address: cellAddress || `${cellNeighborhood}, DF`,
      membersCount: 6,
      targetMembers: 12,
      status: "em_formacao",
    }

    setCellList([newCell, ...cellList])
    setIsAddCellModalOpen(false)
    resetCellForm()
    toast.success("Nova célula cadastrada com sucesso!")
  }

  function resetReportForm() {
    setReportAttendees("12")
    setReportVisitors("2")
    setReportConversions("0")
    setReportOffering("75.00")
    setReportNotes("")
  }

  function resetCellForm() {
    setCellName("")
    setCellLeader("")
    setCellHost("")
    setCellNeighborhood("")
    setCellAddress("")
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <Network className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Células & Pequenos Grupos
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Gestão de redes de discipulado, relatórios de reunião e localização de encontros nos bairros.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            onClick={() => setIsAddCellModalOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl h-10 px-3.5 border-border/60 hover:bg-muted font-semibold"
          >
            <Plus className="size-4" />
            Cadastrar Célula
          </Button>
          <Button
            onClick={() => setIsReportModalOpen(true)}
            size="sm"
            className="gap-2 rounded-xl h-10 px-4 bg-accent hover:bg-accent/90 text-white font-semibold shadow-md shadow-accent/10"
          >
            <FileCheck2 className="size-4.5" />
            Enviar Relatório Semanal
          </Button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Células Ativas</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">{totalCelulas} grupos</h3>
              <p className="text-[11px] font-semibold text-accent mt-1">6 Redes ministeriais</p>
            </div>
            <div className="size-12 rounded-2xl bg-accent-soft/40 text-accent flex items-center justify-center">
              <Network className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-sky-500/20 bg-sky-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">Participantes Ativos</p>
              <h3 className="text-2xl font-extrabold text-sky-700 dark:text-sky-300 mt-1">{totalMembrosCelulas} membros</h3>
              <p className="text-[11px] font-semibold text-sky-600/80 mt-1">Assiduidade média: 92%</p>
            </div>
            <div className="size-12 rounded-2xl bg-sky-500/15 text-sky-600 flex items-center justify-center">
              <Users className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Decisões por Cristo</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">{totalDecisoesMes} vidas</h3>
              <p className="text-[11px] font-semibold text-emerald-600/80 mt-1">Frutos de células no mês</p>
            </div>
            <div className="size-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <Sparkles className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-amber-500/20 bg-amber-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Ofertas de Célula</p>
              <h3 className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">
                R$ {totalOfertaCelulas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-[11px] font-semibold text-amber-600/80 mt-1">Repassados à tesouraria</p>
            </div>
            <div className="size-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <DollarSign className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ABA DE NAVEGAÇÃO INTERNA */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 border-b border-border/40 pb-3 w-full sm:w-auto">
        <Button
          variant={activeTab === "celulas" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("celulas")}
          className="rounded-xl h-9 text-xs font-bold px-3 w-full sm:w-auto"
        >
          Células da Igreja
        </Button>
        <Button
          variant={activeTab === "relatorios" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("relatorios")}
          className="rounded-xl h-9 text-xs font-bold px-3 relative w-full sm:w-auto"
        >
          Relatórios Semanais
          <Badge className="ml-1.5 bg-accent-soft text-accent text-[10px] px-1.5 py-0 font-bold border-0">
            {reportsList.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "localizador" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("localizador")}
          className="rounded-xl h-9 text-xs font-bold px-3 col-span-2 sm:col-span-1 w-full sm:w-auto"
        >
          Localizar Células
        </Button>
      </div>

      {/* TOOLBAR DE BUSCA & FILTROS */}
      {(activeTab === "celulas" || activeTab === "localizador") && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card/45 p-3 rounded-2xl border border-border/40 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por célula, bairro ou líder..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-8 text-xs rounded-xl border-border/50 bg-background/60"
              />
            </div>

            <select
              value={networkFilter}
              onChange={(e) => setNetworkFilter(e.target.value)}
              className="h-9 rounded-xl border border-border/50 bg-background/60 px-3 text-xs font-semibold focus:ring-accent"
            >
              <option value="todas">Todas as Redes</option>
              {networksList.map((net) => (
                <option key={net} value={net}>
                  Rede de {net}
                </option>
              ))}
            </select>

            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className="h-9 rounded-xl border border-border/50 bg-background/60 px-3 text-xs font-semibold focus:ring-accent"
            >
              <option value="todos">Todos os Dias</option>
              <option value="Terça">Terça-feira</option>
              <option value="Quarta">Quarta-feira</option>
              <option value="Quinta">Quinta-feira</option>
              <option value="Sexta">Sexta-feira</option>
              <option value="Sábado">Sábado</option>
            </select>
          </div>
        </div>
      )}

      {/* ABA 1: CÉLULAS DA IGREJA (GRID DE CARTÕES) */}
      {activeTab === "celulas" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCells.map((cell) => {
            const progressMultiplication = Math.round((cell.membersCount / cell.targetMembers) * 100)

            return (
              <Card key={cell.id} className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden flex flex-col justify-between">
                <CardHeader className="p-4 pb-2 border-b border-border/30">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-accent-soft/80 text-accent border-accent/20 text-[10px] font-bold">
                      Rede de {cell.network}
                    </Badge>
                    <Badge variant="outline" className="text-[9px] font-bold">
                      {cell.dayOfWeek}s às {cell.time}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground mt-2">{cell.name}</CardTitle>
                  <CardDescription className="text-xs flex items-center gap-1">
                    <MapPin className="size-3 text-accent shrink-0" />
                    <span className="font-semibold text-foreground">{cell.neighborhood}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="space-y-1">
                    <p className="text-muted-foreground">
                      Líder: <span className="font-bold text-foreground">{cell.leaderName}</span>
                    </p>
                    {cell.coLeaderName && (
                      <p className="text-muted-foreground">
                        Co-Líder: <span className="font-medium text-foreground">{cell.coLeaderName}</span>
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      Anfitrião: <span className="font-medium text-foreground">{cell.hostName}</span>
                    </p>
                  </div>

                  {/* Barra de Progresso de Multiplicação */}
                  <div className="space-y-1 pt-2 border-t border-border/30">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="flex items-center gap-1">
                        <Target className="size-3 text-emerald-500" /> Meta de Multiplicação
                      </span>
                      <span>
                        {cell.membersCount}/{cell.targetMembers} membros ({progressMultiplication}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          progressMultiplication >= 100 ? "bg-emerald-500" : "bg-accent"
                        )}
                        style={{ width: `${Math.min(progressMultiplication, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>

                <div className="p-3 bg-muted/10 border-t border-border/30 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground truncate max-w-[180px]" title={cell.address}>
                    {cell.address}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCellDetail(cell)}
                    className="h-7 text-xs font-bold text-accent hover:bg-accent-soft/30 px-2 rounded-lg shrink-0"
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* ABA 2: RELATÓRIOS SEMANAIS */}
      {activeTab === "relatorios" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-border/30 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Relatórios de Reunião da Célula</CardTitle>
              <CardDescription className="text-xs">
                Acompanhamento das reuniões semanais enviadas pelos líderes de célula
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsReportModalOpen(true)}
              size="sm"
              className="gap-2 rounded-xl h-8 text-xs bg-accent hover:bg-accent/90 text-white font-semibold"
            >
              <FileCheck2 className="size-3.5" /> Enviar Relatório
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/20 border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Célula</th>
                    <th className="py-3 px-4">Data Reunião</th>
                    <th className="py-3 px-4 text-center">Presentes</th>
                    <th className="py-3 px-4 text-center">Visitantes</th>
                    <th className="py-3 px-4 text-center">Decisões</th>
                    <th className="py-3 px-4">Oferta (R$)</th>
                    <th className="py-3 px-4">Estudo / Tema</th>
                    <th className="py-3 px-4">Enviado Por</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-medium">
                  {reportsList.map((rep) => (
                    <tr key={rep.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-foreground">{rep.cellName}</td>
                      <td className="py-3.5 px-4 text-muted-foreground">{rep.meetingDate}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-foreground">{rep.attendeesCount}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge variant="outline" className="text-[10px] bg-sky-500/10 text-sky-700 dark:text-sky-300 border-0">
                          +{rep.visitorsCount}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        {rep.conversionsCount > 0 ? `✨ ${rep.conversionsCount}` : "0"}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">
                        R$ {rep.offeringAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground truncate max-w-xs">{rep.studyTopic}</td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">{rep.submittedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ABA 3: LOCALIZADOR DE CÉLULAS (ENCONTRAR UMA CÉLULA) */}
      {activeTab === "localizador" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-accent/30 bg-accent-soft/20 text-xs flex items-center gap-3">
            <MapPin className="size-6 text-accent shrink-0" />
            <div>
              <p className="font-bold text-foreground text-sm">Buscador de Células por Bairro</p>
              <p className="text-muted-foreground mt-0.5">
                Utilize este mapa virtual para direcionar novos membros e visitantes à célula mais próxima de sua residência.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCells.map((cell) => (
              <Card key={cell.id} className="rounded-2xl border-border/40 bg-card/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-accent-soft text-accent text-[10px] font-bold">
                    Rede de {cell.network}
                  </Badge>
                  <span className="text-xs font-bold text-foreground">
                    {cell.dayOfWeek} às {cell.time}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{cell.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3.5 text-accent shrink-0" />
                    <span className="font-semibold text-foreground">{cell.neighborhood}</span> — {cell.address}
                  </p>
                </div>
                <div className="pt-2 border-t border-border/30 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Líder: <strong className="text-foreground">{cell.leaderName}</strong></span>
                  <Button
                    size="sm"
                    onClick={() => {
                      toast.success(`Endereço da ${cell.name} copiado para compartilhamento!`, {
                        description: `${cell.address} - Toda ${cell.dayOfWeek} às ${cell.time}`,
                      })
                    }}
                    className="h-7 text-xs bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg gap-1"
                  >
                    <Share2 className="size-3" /> Compartilhar Local
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ENVIAR RELATÓRIO SEMANAL (MOBILE-FIRST) */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[480px] max-h-[90vh] overflow-y-auto rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Relatório Semanal da Célula</DialogTitle>
            <DialogDescription className="text-xs">
              Preencha os dados do encontro para acompanhamento da liderança da rede.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddReport} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Selecione sua Célula</Label>
              <select
                value={reportCellId}
                onChange={(e) => setReportCellId(e.target.value)}
                className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
              >
                {cellList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.neighborhood})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Data da Reunião</Label>
              <Input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="h-10 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <Label className="text-[11px] font-semibold">Presentes</Label>
                <Input
                  type="number"
                  value={reportAttendees}
                  onChange={(e) => setReportAttendees(e.target.value)}
                  className="h-9 rounded-lg font-bold text-center text-xs"
                  required
                />
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Visitantes</Label>
                <Input
                  type="number"
                  value={reportVisitors}
                  onChange={(e) => setReportVisitors(e.target.value)}
                  className="h-9 rounded-lg font-bold text-center text-xs text-sky-600"
                />
              </div>

              <div>
                <Label className="text-[11px] font-semibold">Bíblias</Label>
                <Input
                  type="number"
                  value={reportBibles}
                  onChange={(e) => setReportBibles(e.target.value)}
                  className="h-9 rounded-lg font-bold text-center text-xs"
                />
              </div>

              <div>
                <Label className="text-[11px] font-semibold text-emerald-600">Decisões</Label>
                <Input
                  type="number"
                  value={reportConversions}
                  onChange={(e) => setReportConversions(e.target.value)}
                  className="h-9 rounded-lg font-bold text-center text-xs text-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Oferta Coletada (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={reportOffering}
                  onChange={(e) => setReportOffering(e.target.value)}
                  className="h-10 rounded-xl font-bold text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Estudo / Tema Ministrado</Label>
                <Input
                  value={reportTopic}
                  onChange={(e) => setReportTopic(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Observações / Testemunhos (Opcional)</Label>
              <Input
                placeholder="Ex: Tivemos 1 decisão por Cristo e comunhão abençoada"
                value={reportNotes}
                onChange={(e) => setReportNotes(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReportModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold">
                Gravar Relatório
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CADASTRAR NOVA CÉLULA */}
      <Dialog open={isAddCellModalOpen} onOpenChange={setIsAddCellModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[480px] max-h-[90vh] overflow-y-auto rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Cadastrar Nova Célula</DialogTitle>
            <DialogDescription className="text-xs">
              Adicione um novo grupo de discipulado na estrutura da igreja.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddCell} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Nome da Célula</Label>
              <Input
                placeholder="Ex: Célula Fonte de Vida"
                value={cellName}
                onChange={(e) => setCellName(e.target.value)}
                className="h-10 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Rede Ministerial</Label>
                <select
                  value={cellNetwork}
                  onChange={(e) => setCellNetwork(e.target.value as CellNetwork)}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  {networksList.map((net) => (
                    <option key={net} value={net}>
                      Rede de {net}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Líder Responsável</Label>
                <Input
                  placeholder="Ex: Gabriel Santos"
                  value={cellLeader}
                  onChange={(e) => setCellLeader(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Dia da Semana</Label>
                <select
                  value={cellDay}
                  onChange={(e) => setCellDay(e.target.value as any)}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  <option value="Quinta">Quinta-feira</option>
                  <option value="Sexta">Sexta-feira</option>
                  <option value="Sábado">Sábado</option>
                  <option value="Terça">Terça-feira</option>
                  <option value="Quarta">Quarta-feira</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Horário</Label>
                <Input
                  type="time"
                  value={cellTime}
                  onChange={(e) => setCellTime(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Bairro</Label>
                <Input
                  placeholder="Ex: Águas Claras"
                  value={cellNeighborhood}
                  onChange={(e) => setCellNeighborhood(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Anfitrião (Casa)</Label>
                <Input
                  placeholder="Ex: Casa da Irmã Rosa"
                  value={cellHost}
                  onChange={(e) => setCellHost(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Endereço Completo</Label>
              <Input
                placeholder="Ex: QNL 10, Bloco A, Apt 104"
                value={cellAddress}
                onChange={(e) => setCellAddress(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddCellModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold">
                Salvar Célula
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
