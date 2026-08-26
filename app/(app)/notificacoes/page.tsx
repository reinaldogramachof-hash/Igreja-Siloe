"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Bell,
  Megaphone,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Pin,
  Send,
  Users,
  Calendar,
  MessageSquare,
  Sparkles,
  Inbox,
  Filter,
  CheckCheck,
  ExternalLink,
  ChevronRight,
  Radio,
  FileText,
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
import {
  systemNotifications as initialSystemNotifications,
  churchAnnouncements as initialAnnouncements,
} from "@/lib/mock-data"
import type { ChurchAnnouncement, SystemNotification } from "@/lib/types"
import { useDemoUser } from "@/lib/prototype-auth"
import { cn } from "@/lib/utils"

export default function NotificacoesPage() {
  const { user } = useDemoUser()

  // Tab State
  const [activeTab, setActiveTab] = useState<"mural" | "inbox" | "disparo">("mural")

  // State Lists
  const [announcements, setAnnouncements] = useState<ChurchAnnouncement[]>(() => [...initialAnnouncements])
  const [notifications, setNotifications] = useState<SystemNotification[]>(() => [...initialSystemNotifications])

  // Filters State
  const [searchTerm, setSearchTerm] = useState("")
  const [audienceFilter, setAudienceFilter] = useState<string>("todos")

  // Modal States
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false)
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false)

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState("")
  const [annContent, setAnnContent] = useState("")
  const [annTarget, setAnnTarget] = useState<ChurchAnnouncement["targetAudience"]>("Todos os Membros")
  const [annCategory, setAnnCategory] = useState<ChurchAnnouncement["category"]>("comunicado")
  const [annPinned, setAnnPinned] = useState(false)

  // Broadcast Form State
  const [broadcastChannel, setBroadcastChannel] = useState<"whatsapp" | "email" | "push">("whatsapp")
  const [broadcastTarget, setBroadcastTarget] = useState("Líderes de Célula")
  const [broadcastMessage, setBroadcastMessage] = useState("")

  // Filtered Announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter((ann) => {
      const matchesSearch =
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesAudience = audienceFilter === "todos" || ann.targetAudience === audienceFilter
      return matchesSearch && matchesAudience
    })
  }, [announcements, searchTerm, audienceFilter])

  // KPIs
  const totalMural = announcements.length
  const totalUnreadNotifs = notifications.filter((n) => !n.read).length

  // Handlers
  function handleMarkAllAsRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    toast.success("Todas as notificações foram marcadas como lidas!")
  }

  function handleToggleRead(id: string) {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    )
  }

  function handleAddAnnouncement(e: React.FormEvent) {
    e.preventDefault()
    if (!annTitle || !annContent) {
      toast.error("Preencha o título e o conteúdo do comunicado.")
      return
    }

    const newAnn: ChurchAnnouncement = {
      id: `ann-${Date.now()}`,
      title: annTitle,
      content: annContent,
      author: user.name,
      targetAudience: annTarget,
      category: annCategory,
      pinned: annPinned,
      createdAt: new Date().toISOString().split("T")[0],
      readsCount: 0,
    }

    setAnnouncements([newAnn, ...announcements])
    setIsAnnouncementModalOpen(false)
    resetAnnForm()
    toast.success("Novo comunicado publicado com sucesso no mural!")
  }

  function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault()
    if (!broadcastMessage) {
      toast.error("Digite a mensagem do comunicado em massa.")
      return
    }

    setIsBroadcastModalOpen(false)
    setBroadcastMessage("")
    toast.success(`Disparo via ${broadcastChannel.toUpperCase()} agendado com sucesso!`, {
      description: `Enviando mensagem para: ${broadcastTarget}`,
    })
  }

  function resetAnnForm() {
    setAnnTitle("")
    setAnnContent("")
    setAnnPinned(false)
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
              <Bell className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Central de Notificações & Mural
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-3xl">
            Mural oficial de recados da igreja, notificações in-app do sistema e disparo em massa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
          <div className="grid grid-cols-2 gap-2 w-full sm:flex sm:items-center sm:w-auto">
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl h-10 px-3.5 border-border/60 hover:bg-muted font-semibold whitespace-nowrap text-xs sm:text-sm w-full sm:w-auto"
            >
              <CheckCheck className="size-4 shrink-0" />
              Marcar Lidas
            </Button>
            <Button
              onClick={() => setIsAnnouncementModalOpen(true)}
              size="sm"
              className="gap-2 rounded-xl h-10 px-4 bg-accent hover:bg-accent/90 text-white font-semibold shadow-md shadow-accent/10 whitespace-nowrap text-xs sm:text-sm w-full sm:w-auto"
            >
              <Plus className="size-4.5 shrink-0" />
              Novo Comunicado
            </Button>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avisos no Mural</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">{totalMural} recados</h3>
              <p className="text-[11px] font-semibold text-accent mt-1">2 fixados no topo</p>
            </div>
            <div className="size-12 rounded-2xl bg-accent-soft/40 text-accent flex items-center justify-center">
              <Megaphone className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-amber-500/20 bg-amber-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Alertas Não Lidos</p>
              <h3 className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">
                {totalUnreadNotifs} pendentes
              </h3>
              <p className="text-[11px] font-semibold text-amber-600/80 mt-1">Notificações do sistema</p>
            </div>
            <div className="size-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Inbox className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Alcance da Liderança</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">96% leituras</h3>
              <p className="text-[11px] font-semibold text-emerald-600/80 mt-1">Engajamento ativo</p>
            </div>
            <div className="size-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <Users className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-sky-500/20 bg-sky-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">Canais de Disparo</p>
              <h3 className="text-2xl font-extrabold text-sky-700 dark:text-sky-300 mt-1">WhatsApp & E-mail</h3>
              <p className="text-[11px] font-semibold text-sky-600/80 mt-1">Pronto para envio</p>
            </div>
            <div className="size-12 rounded-2xl bg-sky-500/15 text-sky-600 flex items-center justify-center">
              <Send className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ABA DE NAVEGAÇÃO INTERNA */}
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 border-b border-border/40 pb-3 w-full sm:w-auto">
        <Button
          variant={activeTab === "mural" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("mural")}
          className="rounded-xl h-9 text-xs font-bold px-3 w-full sm:w-auto"
        >
          Mural de Recados (Feed)
        </Button>
        <Button
          variant={activeTab === "inbox" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("inbox")}
          className="rounded-xl h-9 text-xs font-bold px-3 relative w-full sm:w-auto"
        >
          Alertas do Sistema
          {totalUnreadNotifs > 0 && (
            <Badge className="ml-1.5 bg-amber-500 text-white text-[10px] px-1.5 py-0 font-bold border-0">
              {totalUnreadNotifs}
            </Badge>
          )}
        </Button>
        <Button
          variant={activeTab === "disparo" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("disparo")}
          className="rounded-xl h-9 text-xs font-bold px-3 col-span-2 sm:col-span-1 w-full sm:w-auto"
        >
          Disparo de Mensagens em Massa
        </Button>
      </div>

      {/* ABA 1: MURAL DE RECADOS (FEED) */}
      {activeTab === "mural" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card/45 p-3 rounded-2xl border border-border/40 backdrop-blur-md">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Buscar comunicado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-9 pl-8 text-xs rounded-xl border-border/50 bg-background/60"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                className="h-9 w-full sm:w-auto rounded-xl border border-border/50 bg-background/60 px-3 text-xs font-semibold focus:ring-accent"
              >
                <option value="todos">Todos os Públicos</option>
                <option value="Todos os Membros">Todos os Membros</option>
                <option value="Somente Líderes">Somente Líderes</option>
                <option value="Ministério de Louvor">Ministério de Louvor</option>
                <option value="Rede de Células">Rede de Células</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredAnnouncements.map((ann) => (
              <Card
                key={ann.id}
                className={cn(
                  "rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm transition-all overflow-hidden",
                  ann.pinned && "border-accent/40 bg-accent-soft/10 shadow-md"
                )}
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {ann.pinned && (
                          <Badge className="bg-accent text-white text-[10px] font-bold gap-1 px-2 py-0.5">
                            <Pin className="size-3" /> Fixado no Topo
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          {ann.targetAudience}
                        </Badge>
                        <Badge
                          className={cn(
                            "text-[10px] font-bold uppercase",
                            ann.category === "urgente" && "bg-red-500/15 text-red-600 border-red-500/30",
                            ann.category === "evento" && "bg-sky-500/15 text-sky-600 border-sky-500/30",
                            ann.category === "comunicado" && "bg-accent-soft text-accent border-accent/20"
                          )}
                        >
                          {ann.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-bold text-foreground pt-1">{ann.title}</CardTitle>
                    </div>

                    <span className="text-xs text-muted-foreground font-medium shrink-0">
                      {ann.createdAt}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4">
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{ann.content}</p>

                  <div className="pt-3 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Por: {ann.author}</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="size-3.5 text-emerald-500" /> {ann.readsCount} confirmações de leitura
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ABA 2: NOTIFICAÇÕES DO SISTEMA (INBOX) */}
      {activeTab === "inbox" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Caixa de Alertas do Sistema</CardTitle>
              <CardDescription className="text-xs">
                Histórico interativo de solicitações, atualizações de escalas e movimentações financeiras.
              </CardDescription>
            </div>
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              className="gap-2 rounded-xl text-xs h-8 self-start sm:self-auto"
            >
              <CheckCheck className="size-3.5" /> Marcar Lidas
            </Button>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-border/30">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  "p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 transition-colors hover:bg-muted/20",
                  !notif.read && "bg-accent-soft/15 border-l-4 border-l-accent"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl shrink-0 mt-0.5",
                      notif.type === "aprovacao" && "bg-amber-500/15 text-amber-600",
                      notif.type === "escala" && "bg-sky-500/15 text-sky-600",
                      notif.type === "financeiro" && "bg-emerald-500/15 text-emerald-600",
                      notif.type === "comunicado" && "bg-accent-soft text-accent"
                    )}
                  >
                    <Bell className="size-4.5" />
                  </span>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs font-bold text-foreground">{notif.title}</h4>
                      {!notif.read && (
                        <Badge className="bg-accent text-white text-[9px] font-bold px-1.5 py-0">Nova</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                    <span className="text-[10px] text-muted-foreground/70 font-semibold block pt-1">
                      {notif.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-1 sm:pt-0 border-t border-border/20 sm:border-t-0 w-full sm:w-auto justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleRead(notif.id)}
                    className="h-8 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                  >
                    {notif.read ? "Marcar não lida" : "Lida"}
                  </Button>
                  {notif.linkUrl && (
                    <Link
                      href={notif.linkUrl}
                      className="inline-flex items-center justify-center rounded-xl border border-border/80 bg-background hover:bg-muted px-3 h-8 text-xs font-bold gap-1 text-foreground transition-all shadow-sm"
                    >
                      Ver Ação <ChevronRight className="size-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* ABA 3: DISPARO EM MASSA */}
      {activeTab === "disparo" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">Central de Disparo de Mensagens</h3>
            <p className="text-xs text-muted-foreground">
              Envie alertas urgentes, convites ou devocionais diretamente para os canais de transmissão dos membros.
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4 max-w-xl">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Selecione o Canal de Comunicação</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "whatsapp", label: "WhatsApp Oficial" },
                  { value: "email", label: "E-mail Geral" },
                  { value: "push", label: "Notificação In-App" },
                ].map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setBroadcastChannel(c.value as any)}
                    className={cn(
                      "p-3 rounded-xl border text-xs font-bold transition-all text-center",
                      broadcastChannel === c.value
                        ? "border-accent bg-accent/15 text-accent shadow-sm"
                        : "border-border/60 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Público de Destino</Label>
              <select
                value={broadcastTarget}
                onChange={(e) => setBroadcastTarget(e.target.value)}
                className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
              >
                <option value="Líderes de Célula">Líderes de Célula (28 contatos)</option>
                <option value="Ministério de Louvor">Ministério de Louvor (14 contatos)</option>
                <option value="Aniversariantes do Mês">Aniversariantes do Mês (19 contatos)</option>
                <option value="Todos os Membros">Todos os Membros da Igreja (310 contatos)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Mensagem do Comunicado</Label>
              <textarea
                rows={4}
                placeholder="Escreva a mensagem oficial que será enviada para o grupo..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs focus:ring-accent"
                required
              />
            </div>

            <Button type="submit" className="bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold gap-2">
              <Send className="size-4" /> Disparar Mensagem Agora
            </Button>
          </form>
        </Card>
      )}

      {/* MODAL: NOVO COMUNICADO (MURAL) */}
      <Dialog open={isAnnouncementModalOpen} onOpenChange={setIsAnnouncementModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[480px] max-h-[90vh] overflow-y-auto rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Publicar Comunicado no Mural</DialogTitle>
            <DialogDescription className="text-xs">
              Crie um aviso oficial que ficará visível para os membros e líderes no feed.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddAnnouncement} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Título do Avisos</Label>
              <Input
                placeholder="Ex: Culto Especial de Ceia & Ações de Graças"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="h-10 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Público-Alvo</Label>
                <select
                  value={annTarget}
                  onChange={(e) => setAnnTarget(e.target.value as any)}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  <option value="Todos os Membros">Todos os Membros</option>
                  <option value="Somente Líderes">Somente Líderes</option>
                  <option value="Ministério de Louvor">Ministério de Louvor</option>
                  <option value="Rede de Células">Rede de Células</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Categoria</Label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  <option value="comunicado">Comunicado Geral</option>
                  <option value="urgente">Urgente</option>
                  <option value="evento">Evento</option>
                  <option value="espiritual">Palavra Pastoral</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Conteúdo da Mensagem</Label>
              <textarea
                rows={4}
                placeholder="Escreva os detalhes do comunicado..."
                value={annContent}
                onChange={(e) => setAnnContent(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs focus:ring-accent"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pinnedCheck"
                checked={annPinned}
                onChange={(e) => setAnnPinned(e.target.checked)}
                className="rounded border-border text-accent focus:ring-accent"
              />
              <Label htmlFor="pinnedCheck" className="text-xs font-medium cursor-pointer">
                Fixar este aviso no topo do mural
              </Label>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold">
                Publicar no Mural
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
