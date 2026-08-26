"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Globe,
  Sparkles,
  Clock,
  ImageIcon,
  FileText,
  Plus,
  Trash2,
  Edit2,
  Save,
  Eye,
  CheckCircle2,
  Share2,
  User,
  ExternalLink,
  ShieldAlert,
  MapPin,
  Phone,
  Mail,
  Video,
  AtSign,
  MessageCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { mockSiteSettings, getRoleLabel } from "@/lib/mock-data"
import { useDemoUser } from "@/lib/prototype-auth"
import type { SiteSettings, SiteServiceSchedule, SiteBanner, PastoralTeamMember } from "@/lib/types"

export default function SiteManagementPage() {
  const { role } = useDemoUser()
  const [siteData, setSiteData] = useState<SiteSettings>(() => mockSiteSettings)
  const [isSaving, setIsSaving] = useState(false)

  // Modais de criação/edição
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<SiteServiceSchedule | null>(null)
  const [schDay, setSchDay] = useState("")
  const [schTime, setSchTime] = useState("")
  const [schTitle, setSchTitle] = useState("")
  const [schDesc, setSchDesc] = useState("")

  const [bannerModalOpen, setBannerModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<SiteBanner | null>(null)
  const [banTitle, setBanTitle] = useState("")
  const [banSubtitle, setBanSubtitle] = useState("")
  const [banBtnText, setBanBtnText] = useState("")
  const [banBtnLink, setBanBtnLink] = useState("")
  const [banImageUrl, setBanImageUrl] = useState("")

  if (role !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-4 shadow-sm border border-danger/20">
          <ShieldAlert className="size-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Acesso Restrito ao Administrador</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          Você está navegando como <span className="font-semibold text-foreground">{getRoleLabel(role)}</span>. A gestão de conteúdo do portal público da igreja é reservada aos administradores.
        </p>
        <div className="mt-6">
          <Link href="/dashboard" className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow transition-colors hover:bg-accent/90">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const handleSaveGlobal = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Alterações do site salvas e publicadas com sucesso!", {
        description: "As informações da página inicial foram atualizadas no servidor.",
      })
    }, 600)
  }

  const handleOpenScheduleModal = (sch?: SiteServiceSchedule) => {
    if (sch) {
      setEditingSchedule(sch)
      setSchDay(sch.dayOfWeek)
      setSchTime(sch.time)
      setSchTitle(sch.title)
      setSchDesc(sch.description || "")
    } else {
      setEditingSchedule(null)
      setSchDay("Domingo")
      setSchTime("10:00")
      setSchTitle("")
      setSchDesc("")
    }
    setScheduleModalOpen(true)
  }

  const handleSaveSchedule = () => {
    if (!schTitle.trim()) {
      toast.error("Por favor, preencha o nome do culto.")
      return
    }
    if (editingSchedule) {
      setSiteData((prev) => ({
        ...prev,
        schedules: prev.schedules.map((s) =>
          s.id === editingSchedule.id
            ? { ...s, dayOfWeek: schDay, time: schTime, title: schTitle, description: schDesc }
            : s
        ),
      }))
      toast.success("Horário de culto atualizado!")
    } else {
      const newSch: SiteServiceSchedule = {
        id: `sch-${Date.now()}`,
        dayOfWeek: schDay,
        time: schTime,
        title: schTitle,
        description: schDesc,
      }
      setSiteData((prev) => ({ ...prev, schedules: [...prev.schedules, newSch] }))
      toast.success("Novo horário de culto adicionado!")
    }
    setScheduleModalOpen(false)
  }

  const handleDeleteSchedule = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((s) => s.id !== id),
    }))
    toast.success("Horário removido do site.")
  }

  const handleOpenBannerModal = (ban?: SiteBanner) => {
    if (ban) {
      setEditingBanner(ban)
      setBanTitle(ban.title)
      setBanSubtitle(ban.subtitle)
      setBanBtnText(ban.buttonText)
      setBanBtnLink(ban.buttonLink)
      setBanImageUrl(ban.imageUrl)
    } else {
      setEditingBanner(null)
      setBanTitle("")
      setBanSubtitle("")
      setBanBtnText("Ver mais")
      setBanBtnLink("/eventos")
      setBanImageUrl("https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80")
    }
    setBannerModalOpen(true)
  }

  const handleSaveBanner = () => {
    if (!banTitle.trim()) {
      toast.error("Preencha o título do banner.")
      return
    }
    if (editingBanner) {
      setSiteData((prev) => ({
        ...prev,
        banners: prev.banners.map((b) =>
          b.id === editingBanner.id
            ? { ...b, title: banTitle, subtitle: banSubtitle, buttonText: banBtnText, buttonLink: banBtnLink, imageUrl: banImageUrl }
            : b
        ),
      }))
      toast.success("Banner atualizado com sucesso!")
    } else {
      const newBan: SiteBanner = {
        id: `ban-${Date.now()}`,
        title: banTitle,
        subtitle: banSubtitle,
        buttonText: banBtnText,
        buttonLink: banBtnLink,
        imageUrl: banImageUrl,
        active: true,
      }
      setSiteData((prev) => ({ ...prev, banners: [...prev.banners, newBan] }))
      toast.success("Novo banner cadastrado!")
    }
    setBannerModalOpen(false)
  }

  const handleToggleBannerActive = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      banners: prev.banners.map((b) => (b.id === id ? { ...b, active: !b.active } : b)),
    }))
    toast.info("Status do banner alterado.")
  }

  const handleDeleteBanner = (id: string) => {
    setSiteData((prev) => ({
      ...prev,
      banners: prev.banners.filter((b) => b.id !== id),
    }))
    toast.success("Banner removido.")
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/10 text-accent border border-accent/20">
              <Globe className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestão do Site Institucional</h1>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie as seções da página inicial, horários de cultos, banners em destaque e informações de contato da igreja.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSaveGlobal}
            disabled={isSaving}
            className="rounded-xl bg-accent hover:bg-accent/90 text-white shadow-md transition-all gap-2"
          >
            {isSaving ? (
              <span className="animate-spin text-sm">⏳</span>
            ) : (
              <Save className="size-4" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="hero" className="w-full space-y-6">
        <div className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 w-full h-auto bg-muted/60 p-1.5 rounded-2xl border border-border/50">
            <TabsTrigger value="hero" className="rounded-xl text-xs md:text-sm font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Sparkles className="size-3.5" />
              Banner Home
            </TabsTrigger>
            <TabsTrigger value="sobre" className="rounded-xl text-xs md:text-sm font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <FileText className="size-3.5" />
              Sobre & Valores
            </TabsTrigger>
            <TabsTrigger value="horarios" className="rounded-xl text-xs md:text-sm font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Clock className="size-3.5" />
              Horários
            </TabsTrigger>
            <TabsTrigger value="banners" className="rounded-xl text-xs md:text-sm font-medium gap-1.5 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <ImageIcon className="size-3.5" />
              Destaques
            </TabsTrigger>
            <TabsTrigger value="contato" className="rounded-xl text-xs md:text-sm font-medium gap-1.5 col-span-2 sm:col-span-1 data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Share2 className="size-3.5" />
              Equipe & Contato
            </TabsTrigger>
          </TabsList>
        </div>

        {/* TAB 1: HERO HOME */}
        <TabsContent value="hero" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            <Card className="lg:col-span-7 rounded-2xl border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="size-5 text-accent" />
                  Cabeçalho Principal (Hero)
                </CardTitle>
                <CardDescription>
                  Altere a primeira impressão dos visitantes ao entrarem no portal público da igreja.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Título Principal</Label>
                  <Input
                    id="heroTitle"
                    value={siteData.heroTitle}
                    onChange={(e) => setSiteData({ ...siteData, heroTitle: e.target.value })}
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Subtítulo / Descrição</Label>
                  <textarea
                    id="heroSubtitle"
                    rows={3}
                    value={siteData.heroSubtitle}
                    onChange={(e) => setSiteData({ ...siteData, heroSubtitle: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="heroCtaText">Texto do Botão de Ação</Label>
                    <Input
                      id="heroCtaText"
                      value={siteData.heroCtaText}
                      onChange={(e) => setSiteData({ ...siteData, heroCtaText: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroCtaLink">Link de Destino</Label>
                    <Input
                      id="heroCtaLink"
                      value={siteData.heroCtaLink}
                      onChange={(e) => setSiteData({ ...siteData, heroCtaLink: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heroBgUrl">URL da Imagem de Fundo</Label>
                  <Input
                    id="heroBgUrl"
                    value={siteData.heroBgUrl}
                    onChange={(e) => setSiteData({ ...siteData, heroBgUrl: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* PREVIEW CARD */}
            <Card className="lg:col-span-5 rounded-2xl border-border bg-card shadow-sm overflow-hidden flex flex-col justify-between">
              <CardHeader className="bg-muted/40 border-b border-border/60 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
                    <Eye className="size-4 text-accent" />
                    Pré-visualização em Tempo Real
                  </CardTitle>
                  <Badge variant="outline" className="text-xs font-medium">Ao Vivo</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative min-h-[300px] flex items-center justify-center overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300 filter brightness-[0.4]"
                  style={{ backgroundImage: `url(${siteData.heroBgUrl})` }}
                />
                <div className="relative z-10 p-6 text-center text-white space-y-4 max-w-sm">
                  <h2 className="text-2xl font-bold tracking-tight leading-tight">{siteData.heroTitle}</h2>
                  <p className="text-xs text-white/80 leading-relaxed">{siteData.heroSubtitle}</p>
                  <button className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-accent/90 transition-all">
                    {siteData.heroCtaText}
                  </button>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/20 border-t border-border/50 py-3 text-xs text-muted-foreground text-center justify-center">
                Visualização adaptada para telas de computador e celular.
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 2: SOBRE E VALORES */}
        <TabsContent value="sobre" className="space-y-6">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="size-5 text-accent" />
                História, Missão, Visão e Valores
              </CardTitle>
              <CardDescription>
                Defina o manifesto e a identidade que descrevem a igreja no site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="aboutHistory">Nossa História</Label>
                <textarea
                  id="aboutHistory"
                  rows={4}
                  value={siteData.aboutHistory}
                  onChange={(e) => setSiteData({ ...siteData, aboutHistory: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="aboutMission">Missão</Label>
                  <textarea
                    id="aboutMission"
                    rows={3}
                    value={siteData.aboutMission}
                    onChange={(e) => setSiteData({ ...siteData, aboutMission: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutVision">Visão</Label>
                  <textarea
                    id="aboutVision"
                    rows={3}
                    value={siteData.aboutVision}
                    onChange={(e) => setSiteData({ ...siteData, aboutVision: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aboutValues">Valores Essenciais</Label>
                  <textarea
                    id="aboutValues"
                    rows={3}
                    value={siteData.aboutValues}
                    onChange={(e) => setSiteData({ ...siteData, aboutValues: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: HORÁRIOS DE CULTO */}
        <TabsContent value="horarios" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Grade de Cultos e Reuniões</h2>
              <p className="text-xs text-muted-foreground">Exibida em destaque para novos visitantes da comunidade.</p>
            </div>
            <Button
              onClick={() => handleOpenScheduleModal()}
              className="rounded-xl bg-accent text-white hover:bg-accent/90 shadow-sm gap-2"
            >
              <Plus className="size-4" />
              Novo Culto
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {siteData.schedules.map((sch) => (
              <Card key={sch.id} className="rounded-2xl border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-lg bg-accent/10 text-accent border-accent/20 font-semibold">
                        {sch.dayOfWeek} • {sch.time}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-semibold mt-2">{sch.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenScheduleModal(sch)}
                      className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteSchedule(sch.id)}
                      className="size-8 rounded-lg text-danger/80 hover:text-danger hover:bg-danger/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground leading-relaxed">
                  {sch.description || "Sem descrição cadastrada."}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 4: BANNERS DE DESTAQUE */}
        <TabsContent value="banners" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Banners da Home</h2>
              <p className="text-xs text-muted-foreground">Carrossel de avisos, conferências e inscrições em aberto.</p>
            </div>
            <Button
              onClick={() => handleOpenBannerModal()}
              className="rounded-xl bg-accent text-white hover:bg-accent/90 shadow-sm gap-2"
            >
              <Plus className="size-4" />
              Novo Banner
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {siteData.banners.map((ban) => (
              <Card key={ban.id} className="rounded-2xl border-border bg-card shadow-sm overflow-hidden flex flex-col justify-between">
                <div className="relative h-44 w-full bg-muted">
                  <img
                    src={ban.imageUrl}
                    alt={ban.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <Badge
                      onClick={() => handleToggleBannerActive(ban.id)}
                      className={`cursor-pointer rounded-lg font-semibold transition-all ${
                        ban.active ? "bg-emerald-500 text-white" : "bg-muted-foreground/80 text-white"
                      }`}
                    >
                      {ban.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                    <h3 className="font-bold text-base">{ban.title}</h3>
                    <p className="text-xs text-white/80 line-clamp-1">{ban.subtitle}</p>
                  </div>
                </div>

                <CardContent className="pt-4 pb-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Botão: <strong className="text-foreground">{ban.buttonText}</strong></span>
                    <span>Link: <strong className="text-foreground">{ban.buttonLink}</strong></span>
                  </div>
                </CardContent>

                <CardFooter className="bg-muted/30 border-t border-border/50 py-2 px-4 flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenBannerModal(ban)}
                    className="h-8 rounded-lg text-xs gap-1"
                  >
                    <Edit2 className="size-3.5" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBanner(ban.id)}
                    className="h-8 rounded-lg text-xs text-danger hover:bg-danger/10 gap-1"
                  >
                    <Trash2 className="size-3.5" />
                    Remover
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 5: EQUIPE PASTORAL E CONTATO */}
        <TabsContent value="contato" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* PASTORES */}
            <Card className="lg:col-span-7 rounded-2xl border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="size-5 text-accent" />
                  Liderança Pastoral no Site
                </CardTitle>
                <CardDescription>
                  Apresentação da liderança para os visitantes da comunidade.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {siteData.pastoralTeam.map((pastor) => (
                  <div key={pastor.id} className="flex gap-4 items-start p-3 rounded-xl border border-border/60 bg-muted/20">
                    <img
                      src={pastor.imageUrl}
                      alt={pastor.name}
                      className="size-16 rounded-xl object-cover border border-border"
                    />
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold text-sm text-foreground">{pastor.name}</h4>
                      <Badge variant="secondary" className="text-[10px] font-medium">{pastor.role}</Badge>
                      <p className="text-xs text-muted-foreground leading-relaxed pt-1">{pastor.bio}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* CONTATOS & REDES SOCIAIS */}
            <Card className="lg:col-span-5 rounded-2xl border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Share2 className="size-5 text-accent" />
                  Contatos & Redes Sociais
                </CardTitle>
                <CardDescription>
                  Informações exibidas no rodapé (footer) do site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-accent" /> Endereço
                  </Label>
                  <Input
                    id="address"
                    value={siteData.address}
                    onChange={(e) => setSiteData({ ...siteData, address: e.target.value })}
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-accent" /> Telefone
                    </Label>
                    <Input
                      id="phone"
                      value={siteData.phone}
                      onChange={(e) => setSiteData({ ...siteData, phone: e.target.value })}
                      className="rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1.5">
                      <Mail className="size-3.5 text-accent" /> E-mail
                    </Label>
                    <Input
                      id="email"
                      value={siteData.email}
                      onChange={(e) => setSiteData({ ...siteData, email: e.target.value })}
                      className="rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Redes Sociais</h4>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5 text-xs">
                      <AtSign className="size-3.5 text-pink-500" /> Instagram
                    </Label>
                    <Input
                      value={siteData.socialLinks.instagram}
                      onChange={(e) => setSiteData({
                        ...siteData,
                        socialLinks: { ...siteData.socialLinks, instagram: e.target.value },
                      })}
                      className="rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5 text-xs">
                      <Video className="size-3.5 text-red-500" /> YouTube
                    </Label>
                    <Input
                      value={siteData.socialLinks.youtube}
                      onChange={(e) => setSiteData({
                        ...siteData,
                        socialLinks: { ...siteData.socialLinks, youtube: e.target.value },
                      })}
                      className="rounded-xl text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* DIALOG DE HORÁRIO DE CULTO */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? "Editar Horário de Culto" : "Novo Culto na Grade"}</DialogTitle>
            <DialogDescription>
              Preencha os dados do culto para ser exibido na agenda do site.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Dia da Semana</Label>
                <Input value={schDay} onChange={(e) => setSchDay(e.target.value)} placeholder="Ex: Domingo" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Horário</Label>
                <Input value={schTime} onChange={(e) => setSchTime(e.target.value)} placeholder="Ex: 10:00 - 12:00" className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Nome do Culto / Reunião</Label>
              <Input value={schTitle} onChange={(e) => setSchTitle(e.target.value)} placeholder="Ex: Culto de Celebração" className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Descrição Breve</Label>
              <textarea
                rows={3}
                value={schDesc}
                onChange={(e) => setSchDesc(e.target.value)}
                placeholder="Ex: Louvor, adoração e ministração da Palavra. Ministério Infantil completo."
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setScheduleModalOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button onClick={handleSaveSchedule} className="rounded-xl bg-accent text-white hover:bg-accent/90">
              Salvar Culto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG DE BANNER */}
      <Dialog open={bannerModalOpen} onOpenChange={setBannerModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Editar Banner" : "Novo Banner da Home"}</DialogTitle>
            <DialogDescription>
              Cadastre banners de eventos, comunicados ou séries de sermões.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Título Principal</Label>
              <Input value={banTitle} onChange={(e) => setBanTitle(e.target.value)} placeholder="Ex: Conferência de Avivamento 2026" className="rounded-xl" />
            </div>

            <div className="space-y-2">
              <Label>Subtítulo / Chamada</Label>
              <Input value={banSubtitle} onChange={(e) => setBanSubtitle(e.target.value)} placeholder="Ex: Inscreva-se com desconto de 1º lote" className="rounded-xl" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Texto do Botão</Label>
                <Input value={banBtnText} onChange={(e) => setBanBtnText(e.target.value)} placeholder="Ex: Garantir Vaga" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Link do Botão</Label>
                <Input value={banBtnLink} onChange={(e) => setBanBtnLink(e.target.value)} placeholder="Ex: /eventos" className="rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>URL da Imagem</Label>
              <Input value={banImageUrl} onChange={(e) => setBanImageUrl(e.target.value)} placeholder="https://..." className="rounded-xl" />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setBannerModalOpen(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button onClick={handleSaveBanner} className="rounded-xl bg-accent text-white hover:bg-accent/90">
              Salvar Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
