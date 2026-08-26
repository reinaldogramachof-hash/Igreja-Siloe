"use client"

import { useMemo, useState } from "react"
import {
  Ticket,
  Users,
  Plus,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  QrCode,
  CheckCircle2,
  Sparkles,
  Shirt,
  CreditCard,
  CheckCheck,
  AlertCircle,
  ChevronRight,
  Filter,
  UserCheck,
  ArrowRight,
  Share2,
  Copy,
  ScanLine,
  LayoutGrid,
  List,
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
import { churchEvents as initialEvents, eventRegistrations as initialRegistrations } from "@/lib/mock-data"
import type { ChurchEvent, EventCategory, EventRegistration } from "@/lib/types"
import { useDemoUser } from "@/lib/prototype-auth"
import { cn } from "@/lib/utils"

export default function EventosPage() {
  const { user } = useDemoUser()

  // Active Tab
  const [activeTab, setActiveTab] = useState<"eventos" | "inscritos" | "qr_scanner">("eventos")
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards")

  // State Lists
  const [eventsList, setEventsList] = useState<ChurchEvent[]>(() => [...initialEvents])
  const [registrationsList, setRegistrationsList] = useState<EventRegistration[]>(() => [...initialRegistrations])

  // Filters State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>("todos")
  const [paymentFilter, setPaymentFilter] = useState<string>("todos")

  // Modal States
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false)
  const [selectedTicketDetail, setSelectedTicketDetail] = useState<EventRegistration | null>(null)

  // Registration Form State
  const [regEventId, setRegEventId] = useState(eventsList[0]?.id || "")
  const [regName, setRegName] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPhone, setRegPhone] = useState("")
  const [regCategory, setRegCategory] = useState<"membro" | "visitante">("membro")
  const [regShirtSize, setRegShirtSize] = useState<"P" | "M" | "G" | "GG" | "XGG">("M")
  const [regPaymentMethod, setRegPaymentMethod] = useState<"PIX" | "Cartão" | "Dinheiro">("PIX")

  // Create Event Form State
  const [evtTitle, setEvtTitle] = useState("")
  const [evtCategory, setEvtCategory] = useState<EventCategory>("Conferência")
  const [evtStartDate, setEvtStartDate] = useState("")
  const [evtEndDate, setEvtEndDate] = useState("")
  const [evtLocation, setEvtLocation] = useState("")
  const [evtPrice, setEvtPrice] = useState("120.00")
  const [evtCapacity, setEvtCapacity] = useState("300")
  const [evtDesc, setEvtDesc] = useState("")

  // QR Code Scanner Simulation State
  const [scanInputCode, setScanInputCode] = useState("")
  const [scannedRegistration, setScannedRegistration] = useState<EventRegistration | null>(null)

  // Filtered Registrations
  const filteredRegistrations = useMemo(() => {
    return registrationsList.filter((reg) => {
      const matchesSearch =
        reg.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.participantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.qrCode.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesEvent = selectedEventFilter === "todos" || reg.eventId === selectedEventFilter
      const matchesPayment = paymentFilter === "todos" || reg.paymentStatus === paymentFilter

      return matchesSearch && matchesEvent && matchesPayment
    })
  }, [registrationsList, searchTerm, selectedEventFilter, paymentFilter])

  // KPIs
  const totalEvents = eventsList.length
  const totalRegistrations = registrationsList.length
  const totalRevenue = registrationsList.reduce((acc, r) => acc + r.amountPaid, 0)
  const totalCheckedIn = registrationsList.filter((r) => r.checkedIn).length

  // Handlers
  function handleAddRegistration(e: React.FormEvent) {
    e.preventDefault()
    if (!regName || !regEmail) {
      toast.error("Preencha o nome completo e e-mail do participante.")
      return
    }

    const targetEvent = eventsList.find((evt) => evt.id === regEventId) || eventsList[0]

    const newRegId = `reg-${Date.now()}`
    const newQrCode = `SILOE-EVT-${targetEvent.id.toUpperCase()}-${newRegId.slice(-6).toUpperCase()}`

    const newRegistration: EventRegistration = {
      id: newRegId,
      eventId: targetEvent.id,
      eventTitle: targetEvent.title,
      participantName: regName,
      participantEmail: regEmail,
      participantPhone: regPhone || "(61) 99999-0000",
      category: regCategory,
      shirtSize: regShirtSize,
      paymentStatus: "pago",
      paymentMethod: regPaymentMethod,
      amountPaid: targetEvent.price,
      qrCode: newQrCode,
      checkedIn: false,
    }

    setRegistrationsList([newRegistration, ...registrationsList])

    // Update event registered count
    setEventsList(
      eventsList.map((evt) =>
        evt.id === targetEvent.id ? { ...evt, registeredCount: evt.registeredCount + 1 } : evt
      )
    )

    setIsRegisterModalOpen(false)
    resetRegForm()
    setSelectedTicketDetail(newRegistration)
    toast.success(`Inscrição confirmada para ${regName}! Ingresso QR Code gerado.`)
  }

  function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!evtTitle || !evtStartDate || !evtLocation) {
      toast.error("Preencha o título, data de início e local do evento.")
      return
    }

    const newEvent: ChurchEvent = {
      id: `evt-${Date.now()}`,
      title: evtTitle,
      description: evtDesc || "Novo evento da Igreja Siloé.",
      category: evtCategory,
      startDate: evtStartDate,
      endDate: evtEndDate || evtStartDate,
      location: evtLocation,
      price: parseFloat(evtPrice) || 0,
      maxCapacity: parseInt(evtCapacity) || 100,
      registeredCount: 0,
      status: "inscricoes_abertas",
    }

    setEventsList([newEvent, ...eventsList])
    setIsCreateEventModalOpen(false)
    resetEventForm()
    toast.success(`Novo evento "${evtTitle}" cadastrado com inscrições abertas!`)
  }

  function handleManualCheckIn(id: string) {
    setRegistrationsList(
      registrationsList.map((r) =>
        r.id === id ? { ...r, checkedIn: true, checkedInAt: "Agora" } : r
      )
    )
    toast.success("Check-in realizado com sucesso!")
  }

  function handleScanQrCode(e: React.FormEvent) {
    e.preventDefault()
    const found = registrationsList.find(
      (r) => r.qrCode.toLowerCase() === scanInputCode.trim().toLowerCase()
    )

    if (!found) {
      toast.error("QR Code não encontrado ou inválido!")
      setScannedRegistration(null)
      return
    }

    setScannedRegistration(found)
    if (!found.checkedIn) {
      handleManualCheckIn(found.id)
    }
  }

  function resetRegForm() {
    setRegName("")
    setRegEmail("")
    setRegPhone("")
  }

  function resetEventForm() {
    setEvtTitle("")
    setEvtLocation("")
    setEvtDesc("")
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
              <Ticket className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Gestão de Eventos & Inscrições
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-3xl">
            Conferências, retiros, vendas de ingressos via PIX/Cartão e credenciamento por QR Code.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:items-center sm:w-auto">
            <Button
              onClick={() => setActiveTab("qr_scanner")}
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl h-10 px-3 border-border/60 hover:bg-muted font-semibold whitespace-nowrap text-xs sm:text-sm w-full sm:w-auto"
            >
              <ScanLine className="size-4 text-accent shrink-0" />
              Scanner QR
            </Button>
            <Button
              onClick={() => setIsCreateEventModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl h-10 px-3 border-border/60 hover:bg-muted font-semibold whitespace-nowrap text-xs sm:text-sm w-full sm:w-auto"
            >
              <Plus className="size-4 shrink-0" />
              Novo Evento
            </Button>
          </div>
          <Button
            onClick={() => setIsRegisterModalOpen(true)}
            size="sm"
            className="gap-2 rounded-xl h-10 px-4 bg-accent hover:bg-accent/90 text-white font-semibold shadow-md shadow-accent/10 whitespace-nowrap text-xs sm:text-sm w-full sm:w-auto"
          >
            <Ticket className="size-4.5 shrink-0" />
            Fazer Inscrição
          </Button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Eventos Ativos</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">{totalEvents} eventos</h3>
              <p className="text-[11px] font-semibold text-accent mt-1">Conferências & Retiros</p>
            </div>
            <div className="size-12 rounded-2xl bg-accent-soft/40 text-accent flex items-center justify-center">
              <Ticket className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-sky-500/20 bg-sky-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">Inscritos Totais</p>
              <h3 className="text-2xl font-extrabold text-sky-700 dark:text-sky-300 mt-1">{totalRegistrations} congressistas</h3>
              <p className="text-[11px] font-semibold text-sky-600/80 mt-1">Membros e Visitantes</p>
            </div>
            <div className="size-12 rounded-2xl bg-sky-500/15 text-sky-600 flex items-center justify-center">
              <Users className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Arrecadação Inscrições</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
                R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </h3>
              <p className="text-[11px] font-semibold text-emerald-600/80 mt-1">Pagamentos via PIX/Cartão</p>
            </div>
            <div className="size-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <DollarSign className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-purple-500/20 bg-purple-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">Check-in Portaria</p>
              <h3 className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 mt-1">{totalCheckedIn} validados</h3>
              <p className="text-[11px] font-semibold text-purple-600/80 mt-1">Credenciados por QR Code</p>
            </div>
            <div className="size-12 rounded-2xl bg-purple-500/15 text-purple-600 flex items-center justify-center">
              <QrCode className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ABA DE NAVEGAÇÃO INTERNA */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 border-b border-border/40 pb-3 w-full sm:w-auto">
        <Button
          variant={activeTab === "eventos" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("eventos")}
          className="rounded-xl h-9 text-xs font-bold px-3 w-full sm:w-auto"
        >
          Eventos em Destaque
        </Button>
        <Button
          variant={activeTab === "inscritos" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("inscritos")}
          className="rounded-xl h-9 text-xs font-bold px-3 relative w-full sm:w-auto"
        >
          Lista de Inscritos
          <Badge className="ml-1.5 bg-accent-soft text-accent text-[10px] px-1.5 py-0 font-bold border-0">
            {registrationsList.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "qr_scanner" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("qr_scanner")}
          className="rounded-xl h-9 text-xs font-bold px-3 col-span-2 sm:col-span-1 w-full sm:w-auto"
        >
          Scanner QR Code
        </Button>
      </div>

      {/* ABA 1: EVENTOS EM DESTAQUE */}
      {activeTab === "eventos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventsList.map((evt) => {
            const occupancyPercentage = Math.round((evt.registeredCount / evt.maxCapacity) * 100)
            const isSoldOut = evt.status === "esgotado" || occupancyPercentage >= 100

            return (
              <Card key={evt.id} className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden flex flex-col justify-between">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-accent-soft text-accent text-[10px] font-bold">
                      {evt.category}
                    </Badge>
                    <Badge
                      variant={isSoldOut ? "destructive" : "outline"}
                      className={cn("text-[10px] font-bold", !isSoldOut && "text-emerald-600 border-emerald-500/30")}
                    >
                      {isSoldOut ? "Esgotado" : "Inscrições Abertas"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground mt-2">{evt.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 mt-1">{evt.description}</CardDescription>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3 text-xs">
                  <div className="space-y-1.5 pt-2 border-t border-border/30">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="size-3.5 text-accent shrink-0" />
                      <span>
                        {evt.startDate} {evt.endDate !== evt.startDate && `até ${evt.endDate}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-3.5 text-accent shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-muted-foreground font-semibold">Valor da Inscrição:</span>
                      <span className="text-sm font-extrabold text-foreground">
                        {evt.price === 0 ? "Gratuito" : `R$ ${evt.price.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  {/* Vagas & Barra de Progresso */}
                  <div className="space-y-1 pt-2 border-t border-border/30">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span>Vagas Preenchidas</span>
                      <span>
                        {evt.registeredCount}/{evt.maxCapacity} ({occupancyPercentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isSoldOut ? "bg-red-500" : "bg-accent"
                        )}
                        style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>

                <div className="p-4 bg-muted/10 border-t border-border/30 flex items-center justify-end">
                  <Button
                    disabled={isSoldOut}
                    onClick={() => {
                      setRegEventId(evt.id)
                      setIsRegisterModalOpen(true)
                    }}
                    size="sm"
                    className="w-full bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl gap-2 h-9"
                  >
                    <Ticket className="size-4" /> {isSoldOut ? "Esgotado" : "Garantir Inscrição"}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* ABA 2: LISTA DE INSCRITOS */}
      {activeTab === "inscritos" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-border/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Congressistas Inscritos</CardTitle>
              <CardDescription className="text-xs">
                Lista oficial de participantes com status de pagamento e QR Code de acesso
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou QR Code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9 pl-8 text-xs rounded-xl border-border/50 bg-background/60"
                />
              </div>

              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="h-9 rounded-xl border border-border/50 bg-background/60 px-3 text-xs font-semibold focus:ring-accent"
              >
                <option value="todos">Todos os Eventos</option>
                {eventsList.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title}
                  </option>
                ))}
              </select>

              {/* TOGGLE CARDS / LISTA */}
              <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1 border border-border/50 shrink-0">
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("table")}
                  className="size-8 rounded-lg"
                  title="Visualização em Lista/Tabela"
                >
                  <List className="size-4" />
                </Button>
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("cards")}
                  className="size-8 rounded-lg"
                  title="Visualização em Cards"
                >
                  <LayoutGrid className="size-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {viewMode === "cards" ? (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredRegistrations.map((reg) => (
                  <Card key={reg.id} className="rounded-2xl border-border/40 bg-card/60 p-4 space-y-3 shadow-xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-0 text-[10px] font-bold">
                          Pago (R$ {reg.amountPaid.toFixed(2)})
                        </Badge>
                        {reg.checkedIn ? (
                          <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-0 text-[10px] font-bold gap-1">
                            <CheckCircle2 className="size-3" /> Validado
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleManualCheckIn(reg.id)}
                            className="h-6 text-[10px] font-bold text-muted-foreground hover:text-accent p-0"
                          >
                            Dar Check-in
                          </Button>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-foreground">{reg.participantName}</h4>
                        <p className="text-[11px] text-muted-foreground">{reg.participantEmail} · {reg.participantPhone}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/30 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground truncate max-w-[180px]">{reg.eventTitle}</span>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          Camiseta {reg.shirtSize || "M"}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTicketDetail(reg)}
                        className="w-full h-8 rounded-xl text-xs font-bold gap-1.5"
                      >
                        <QrCode className="size-3.5 text-accent" /> Ver QR Code / Ingresso
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/20 border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Participante</th>
                      <th className="py-3 px-4">Evento</th>
                      <th className="py-3 px-4 text-center">Camiseta</th>
                      <th className="py-3 px-4">Pagamento</th>
                      <th className="py-3 px-4 text-center">Check-in</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30 font-medium">
                    {filteredRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-foreground">{reg.participantName}</div>
                          <div className="text-[10px] text-muted-foreground">{reg.participantEmail} · {reg.participantPhone}</div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground truncate max-w-xs">{reg.eventTitle}</td>
                        <td className="py-3.5 px-4 text-center">
                          <Badge variant="outline" className="text-[10px] font-bold">
                            {reg.shirtSize || "N/A"}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-0 text-[10px] font-bold">
                              Pago ({reg.paymentMethod})
                            </Badge>
                            <span className="font-bold text-foreground">R$ {reg.amountPaid.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          {reg.checkedIn ? (
                            <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-0 text-[10px] font-bold gap-1">
                              <CheckCircle2 className="size-3" /> Validado
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleManualCheckIn(reg.id)}
                              className="h-6 text-[10px] font-bold text-muted-foreground hover:text-accent"
                            >
                              Dar Check-in
                            </Button>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTicketDetail(reg)}
                            className="h-7 text-xs font-bold gap-1 rounded-lg"
                          >
                            <QrCode className="size-3.5 text-accent" /> Ingresso
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ABA 3: SCANNER DE QR CODE (SIMULADOR DA PORTARIA) */}
      {activeTab === "qr_scanner" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm p-6 max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <div className="size-12 rounded-2xl bg-accent-soft/40 text-accent flex items-center justify-center mx-auto mb-2">
              <ScanLine className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Portaria & Credenciamento QR Code</h3>
            <p className="text-xs text-muted-foreground">
              Digite ou escaneie o código do ingresso para liberar a entrada do congressista no evento.
            </p>
          </div>

          <form onSubmit={handleScanQrCode} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Código QR do Ingresso</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ex: SILOE-EVT001-REG001"
                  value={scanInputCode}
                  onChange={(e) => setScanInputCode(e.target.value)}
                  className="h-11 rounded-xl text-xs font-mono font-bold uppercase"
                />
                <Button type="submit" className="bg-accent text-white h-11 px-5 rounded-xl font-bold">
                  Validar
                </Button>
              </div>
            </div>
          </form>

          {/* Resultado da Validação */}
          {scannedRegistration && (
            <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 space-y-3 animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="size-5" /> ENTRADA LIBERADA COM SUCESSO!
              </div>
              <div className="text-xs space-y-1 text-foreground">
                <p>Congressista: <strong>{scannedRegistration.participantName}</strong></p>
                <p>Evento: <strong>{scannedRegistration.eventTitle}</strong></p>
                <p>Camiseta: <strong>{scannedRegistration.shirtSize}</strong></p>
                <p>Código: <code className="bg-background px-2 py-0.5 rounded border">{scannedRegistration.qrCode}</code></p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* MODAL 1: FAZER INSCRIÇÃO */}
      <Dialog open={isRegisterModalOpen} onOpenChange={setIsRegisterModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[480px] max-h-[90vh] overflow-y-auto rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Inscrição no Evento</DialogTitle>
            <DialogDescription className="text-xs">
              Preencha os dados do congressista e confirme a forma de pagamento.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRegistration} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Evento Selecionado</Label>
              <select
                value={regEventId}
                onChange={(e) => setRegEventId(e.target.value)}
                className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
              >
                {eventsList.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.price === 0 ? "Gratuito" : `R$ ${evt.price.toFixed(2)}`})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Nome Completo do Participant</Label>
              <Input
                placeholder="Ex: Gabriel Santos"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="h-10 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">E-mail</Label>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">WhatsApp / Telefone</Label>
                <Input
                  placeholder="(61) 98765-4321"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Tamanho da Camiseta</Label>
                <select
                  value={regShirtSize}
                  onChange={(e) => setRegShirtSize(e.target.value as any)}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                  <option value="GG">GG</option>
                  <option value="XGG">XGG</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Forma de Pagamento</Label>
                <select
                  value={regPaymentMethod}
                  onChange={(e) => setRegPaymentMethod(e.target.value as any)}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  <option value="PIX">PIX (Confirmação Na Hora)</option>
                  <option value="Cartão">Cartão de Crédito</option>
                  <option value="Dinheiro">Dinheiro (Secretaria)</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRegisterModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold">
                Confirmar & Gerar QR Code
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CRIAR NOVO EVENTO */}
      <Dialog open={isCreateEventModalOpen} onOpenChange={setIsCreateEventModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[480px] max-h-[90vh] overflow-y-auto rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Cadastrar Novo Evento</DialogTitle>
            <DialogDescription className="text-xs">
              Adicione uma nova conferência ou retiro para inscrições online.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEvent} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Título do Evento</Label>
              <Input
                placeholder="Ex: Encontro de Mulheres de Valor 2026"
                value={evtTitle}
                onChange={(e) => setEvtTitle(e.target.value)}
                className="h-10 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Categoria</Label>
                <select
                  value={evtCategory}
                  onChange={(e) => setEvtCategory(e.target.value as any)}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  <option value="Conferência">Conferência</option>
                  <option value="Retiro">Retiro</option>
                  <option value="Seminário">Seminário</option>
                  <option value="Acampamento">Acampamento</option>
                  <option value="Encontro">Encontro</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Data de Início</Label>
                <Input
                  type="date"
                  value={evtStartDate}
                  onChange={(e) => setEvtStartDate(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Valor por Pessoa (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={evtPrice}
                  onChange={(e) => setEvtPrice(e.target.value)}
                  className="h-10 rounded-xl font-bold text-xs"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Capacidade (Vagas)</Label>
                <Input
                  type="number"
                  value={evtCapacity}
                  onChange={(e) => setEvtCapacity(e.target.value)}
                  className="h-10 rounded-xl font-bold text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Local do Evento</Label>
              <Input
                placeholder="Ex: Templo Principal Siloé"
                value={evtLocation}
                onChange={(e) => setEvtLocation(e.target.value)}
                className="h-10 rounded-xl text-xs"
                required
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateEventModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold">
                Criar Evento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: INGRESSO DIGITAL COM QR CODE */}
      <Dialog open={!!selectedTicketDetail} onOpenChange={() => setSelectedTicketDetail(null)}>
        <DialogContent className="w-[95vw] sm:max-w-[400px] max-h-[90vh] overflow-y-auto rounded-3xl border-accent/40 bg-card p-6 text-center">
          {selectedTicketDetail && (
            <div className="space-y-5 animate-fade-in">
              <div className="size-12 rounded-2xl bg-accent-soft/40 text-accent flex items-center justify-center mx-auto">
                <Ticket className="size-6" />
              </div>

              <div>
                <Badge className="bg-accent text-white text-[10px] font-bold uppercase mb-1">
                  Ingresso Oficial · Igreja Siloé
                </Badge>
                <h3 className="text-lg font-extrabold text-foreground">{selectedTicketDetail.eventTitle}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Congressista: {selectedTicketDetail.participantName}</p>
              </div>

              {/* QR CODE DISPLAY MOCK */}
              <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-accent/40 inline-block shadow-inner">
                <QrCode className="size-32 text-slate-900 mx-auto" />
                <code className="text-[10px] font-bold font-mono text-slate-700 block mt-2 tracking-wider">
                  {selectedTicketDetail.qrCode}
                </code>
              </div>

              <div className="text-xs space-y-1 text-muted-foreground bg-muted/20 p-3 rounded-xl">
                <p>Camiseta: <strong className="text-foreground">{selectedTicketDetail.shirtSize || "M"}</strong></p>
                <p>Status Pagamento: <strong className="text-emerald-600 font-bold">PAGO (R$ {selectedTicketDetail.amountPaid.toFixed(2)})</strong></p>
                <p>Apresente este QR Code na portaria do evento.</p>
              </div>

              <Button
                onClick={() => {
                  toast.success("Código QR copiado para área de transferência!")
                }}
                className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl font-bold gap-2"
              >
                <Copy className="size-4" /> Copiar Código do Ingresso
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
