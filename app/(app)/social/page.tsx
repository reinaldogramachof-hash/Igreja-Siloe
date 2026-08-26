"use client"

import { useMemo, useState } from "react"
import {
  HeartHandshake,
  Heart,
  Package,
  Plus,
  Search,
  Calendar,
  Users,
  Home,
  CheckCircle2,
  Clock,
  Lock,
  UserCheck,
  Building,
  Sparkles,
  Phone,
  MapPin,
  ShoppingBag,
  Gift,
  ShieldAlert,
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
  pastoralVisits as initialVisits,
  socialDistributions as initialDistributions,
  socialFamilies as initialFamilies,
} from "@/lib/mock-data"
import type {
  PastoralVisit,
  SocialAssistanceType,
  SocialDistribution,
  SocialFamily,
} from "@/lib/types"
import { useDemoUser } from "@/lib/prototype-auth"
import { cn } from "@/lib/utils"

export default function SocialPage() {
  const { user } = useDemoUser()

  // Tabs State
  const [activeTab, setActiveTab] = useState<"entregas" | "familias" | "visitas">("entregas")

  // State
  const [families, setFamilies] = useState<SocialFamily[]>(() => [...initialFamilies])
  const [distributions, setDistributions] = useState<SocialDistribution[]>(() => [...initialDistributions])
  const [visits, setVisits] = useState<PastoralVisit[]>(() => [...initialVisits])

  // Filters State
  const [searchTerm, setSearchTerm] = useState("")

  // Modal States
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false)
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false)
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false)

  // Delivery Form State
  const [selectedFamilyId, setSelectedFamilyId] = useState(families[0]?.id || "")
  const [deliveryItem, setDeliveryItem] = useState("Cesta Básica Completa + Kit Limpeza")
  const [deliveryQty, setDeliveryQty] = useState("1")

  // Family Form State
  const [familyHeadName, setFamilyHeadName] = useState("")
  const [familyDependents, setFamilyDependents] = useState("3")
  const [familyPhone, setFamilyPhone] = useState("")
  const [familyAddress, setFamilyAddress] = useState("")
  const [familyAssistanceType, setFamilyAssistanceType] = useState<SocialAssistanceType>("cesta_basica")

  // Visit Form State
  const [visitMemberName, setVisitMemberName] = useState("")
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0])
  const [visitPastor, setVisitPastor] = useState("Pr. Mateus Silva")
  const [visitPurpose, setVisitPurpose] = useState<PastoralVisit["purpose"]>("Oração no Lar")
  const [visitNotes, setVisitNotes] = useState("")
  const [visitPrivacy, setVisitPrivacy] = useState<"confidencial" | "equipe_pastoral">("equipe_pastoral")

  // Computations
  const totalEntregasMes = distributions.length + 27 // Simulação de 30 entregas no mês
  const totalFamiliasAtivas = families.filter((f) => f.status === "em_acompanhamento").length
  const totalVisitasMes = visits.length + 5

  // Handlers
  function handleAddDelivery(e: React.FormEvent) {
    e.preventDefault()
    const targetFamily = families.find((f) => f.id === selectedFamilyId) || families[0]
    
    const newDist: SocialDistribution = {
      id: `dist-${Date.now()}`,
      familyId: targetFamily.id,
      familyName: targetFamily.headName,
      item: deliveryItem,
      quantity: parseInt(deliveryQty) || 1,
      deliveredAt: new Date().toISOString().split("T")[0],
      deliveredBy: `${user.name} (${user.role})`,
    }

    setDistributions([newDist, ...distributions])
    setIsDeliveryModalOpen(false)
    toast.success(`Entrega de ${deliveryItem} registrada para ${targetFamily.headName}!`)
  }

  function handleAddFamily(e: React.FormEvent) {
    e.preventDefault()
    if (!familyHeadName || !familyPhone) {
      toast.error("Preencha o nome do responsável e o telefone.")
      return
    }

    const newFamily: SocialFamily = {
      id: `fam-${Date.now()}`,
      headName: familyHeadName,
      dependentsCount: parseInt(familyDependents) || 0,
      phone: familyPhone,
      address: familyAddress || "Não informado",
      status: "em_acompanhamento",
      assistanceType: familyAssistanceType,
      registeredAt: new Date().toISOString().split("T")[0],
    }

    setFamilies([newFamily, ...families])
    setIsFamilyModalOpen(false)
    resetFamilyForm()
    toast.success("Família cadastrada com sucesso no programa de ação social!")
  }

  function handleAddVisit(e: React.FormEvent) {
    e.preventDefault()
    if (!visitMemberName) {
      toast.error("Informe o nome do membro ou família a ser visitada.")
      return
    }

    const newVisit: PastoralVisit = {
      id: `vis-${Date.now()}`,
      memberName: visitMemberName,
      visitDate: visitDate,
      pastorName: visitPastor,
      purpose: visitPurpose,
      status: "agendado",
      notes: visitNotes,
      privacy: visitPrivacy,
    }

    setVisits([newVisit, ...visits])
    setIsVisitModalOpen(false)
    resetVisitForm()
    toast.success("Visita pastoral agendada com sucesso!")
  }

  function resetFamilyForm() {
    setFamilyHeadName("")
    setFamilyPhone("")
    setFamilyAddress("")
    setFamilyDependents("3")
  }

  function resetVisitForm() {
    setVisitMemberName("")
    setVisitNotes("")
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
              <HeartHandshake className="size-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ação Social & Visitas
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Acolhimento comunitário, distribuição de cestas básicas, vale-gás e agenda de atendimento pastoral.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            onClick={() => setIsVisitModalOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl h-10 px-3.5 border-accent/40 bg-accent-soft/20 text-accent hover:bg-accent-soft/40 font-semibold"
          >
            <Heart className="size-4" />
            Agendar Visita
          </Button>
          <Button
            onClick={() => setIsFamilyModalOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl h-10 px-3.5 border-border/60 hover:bg-muted font-semibold"
          >
            <Home className="size-4" />
            Cadastrar Família
          </Button>
          <Button
            onClick={() => setIsDeliveryModalOpen(true)}
            size="sm"
            className="gap-2 rounded-xl h-10 px-4 bg-accent hover:bg-accent/90 text-white font-semibold shadow-md shadow-accent/10"
          >
            <Plus className="size-4.5" />
            Registrar Entrega
          </Button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">Cestas Entregues (Mês)</p>
              <h3 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">{totalEntregasMes} cestas</h3>
              <p className="text-[11px] font-semibold text-emerald-600/80 mt-1">140 pessoas impactadas</p>
            </div>
            <div className="size-12 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Famílias Acompanhadas</p>
              <h3 className="text-2xl font-extrabold text-foreground mt-1">{totalFamiliasAtivas} famílias</h3>
              <p className="text-[11px] font-semibold text-accent mt-1">Acolhimento contínuo</p>
            </div>
            <div className="size-12 rounded-2xl bg-accent-soft/40 text-accent flex items-center justify-center">
              <Home className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-sky-500/20 bg-sky-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">Visitas Pastorais</p>
              <h3 className="text-2xl font-extrabold text-sky-700 dark:text-sky-300 mt-1">{totalVisitasMes} no mês</h3>
              <p className="text-[11px] font-semibold text-sky-600/80 mt-1">Hospitais, Lares e Gabinete</p>
            </div>
            <div className="size-12 rounded-2xl bg-sky-500/15 text-sky-600 flex items-center justify-center">
              <Heart className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-amber-500/20 bg-amber-500/5 backdrop-blur-md shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Depósito de Alimentos</p>
              <h3 className="text-2xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">18 cestas</h3>
              <p className="text-[11px] font-semibold text-amber-600/80 mt-1">Prontas para distribuição</p>
            </div>
            <div className="size-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Package className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NAVEGAÇÃO DE ABAS INTERNAS */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2 overflow-x-auto no-scrollbar">
        <Button
          variant={activeTab === "entregas" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("entregas")}
          className="rounded-xl h-9 text-xs font-bold px-3.5"
        >
          Histórico de Entregas & Auxílios
        </Button>
        <Button
          variant={activeTab === "familias" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("familias")}
          className="rounded-xl h-9 text-xs font-bold px-3.5 relative"
        >
          Cadastro de Famílias Assistidas
          <Badge className="ml-1.5 bg-accent-soft text-accent text-[10px] px-1.5 py-0 font-bold border-0">
            {families.length}
          </Badge>
        </Button>
        <Button
          variant={activeTab === "visitas" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("visitas")}
          className="rounded-xl h-9 text-xs font-bold px-3.5"
        >
          Agenda de Visitas Pastorais
        </Button>
      </div>

      {/* ABA 1: HISTÓRICO DE ENTREGAS */}
      {activeTab === "entregas" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-border/30 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Registro de Distribuição de Auxílios</CardTitle>
              <CardDescription className="text-xs">
                Histórico de entregas de cestas básicas, vale-gás e suprimentos comunitários
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsDeliveryModalOpen(true)}
              size="sm"
              className="gap-2 rounded-xl h-8 text-xs bg-accent hover:bg-accent/90 text-white font-semibold"
            >
              <Plus className="size-3.5" /> Lançar Entrega
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/20 border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Família Beneficiada</th>
                    <th className="py-3 px-4">Item Entregue</th>
                    <th className="py-3 px-4 text-center">Quantidade</th>
                    <th className="py-3 px-4">Data da Entrega</th>
                    <th className="py-3 px-4">Entregue Por (Voluntário/Líder)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-medium">
                  {distributions.map((dist) => (
                    <tr key={dist.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground">{dist.familyName}</p>
                        <span className="text-[10px] text-muted-foreground">ID Família: {dist.familyId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-foreground font-semibold">
                        <span className="inline-flex items-center gap-1.5">
                          <ShoppingBag className="size-3.5 text-accent shrink-0" />
                          {dist.item}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold">{dist.quantity} un.</td>
                      <td className="py-3.5 px-4 text-muted-foreground">{dist.deliveredAt}</td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">{dist.deliveredBy}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-0 text-[10px]">
                          ✓ Entregue
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ABA 2: CADASTRO DE FAMÍLIAS */}
      {activeTab === "familias" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-border/30 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Famílias Assistidas</CardTitle>
              <CardDescription className="text-xs">
                Cadastro social de famílias em situação de vulnerabilidade e acompanhamento
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsFamilyModalOpen(true)}
              size="sm"
              className="gap-2 rounded-xl h-8 text-xs bg-accent hover:bg-accent/90 text-white font-semibold"
            >
              <Plus className="size-3.5" /> Cadastrar Família
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/20 border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Responsável Familiar</th>
                    <th className="py-3 px-4">Dependentes</th>
                    <th className="py-3 px-4">Contato & Endereço</th>
                    <th className="py-3 px-4">Benefício Principal</th>
                    <th className="py-3 px-4">Data Cadastro</th>
                    <th className="py-3 px-4 text-center">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-medium">
                  {families.map((fam) => (
                    <tr key={fam.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground text-sm">{fam.headName}</p>
                        {fam.notes && <p className="text-[10px] text-muted-foreground truncate max-w-xs">{fam.notes}</p>}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="text-[10px]">
                          {fam.dependentsCount} dependentes
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="flex items-center gap-1 text-foreground">
                          <Phone className="size-3 text-accent shrink-0" /> {fam.phone}
                        </p>
                        <p className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                          <MapPin className="size-3 shrink-0" /> {fam.address}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge className="bg-accent-soft/80 text-accent border-accent/20 text-[10px] capitalize">
                          {fam.assistanceType.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{fam.registeredAt}</td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          className={cn(
                            "text-[10px] border-0",
                            fam.status === "em_acompanhamento"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          )}
                        >
                          {fam.status === "em_acompanhamento" ? "Em Acompanhamento" : "Atendido"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ABA 3: VISITAS PASTORAIS & GABINETE */}
      {activeTab === "visitas" && (
        <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-border/30 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-foreground">Agenda de Visitas Pastorais & Atendimentos</CardTitle>
              <CardDescription className="text-xs">
                Acompanhamento espiritual de enfermos, apoio ao luto e aconselhamento pastoral
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsVisitModalOpen(true)}
              size="sm"
              className="gap-2 rounded-xl h-8 text-xs bg-accent hover:bg-accent/90 text-white font-semibold"
            >
              <Plus className="size-3.5" /> Agendar Visita
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/20 border-b border-border/30 text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Membro / Família Visitada</th>
                    <th className="py-3 px-4">Propósito</th>
                    <th className="py-3 px-4">Data da Visita</th>
                    <th className="py-3 px-4">Pastor / Visitador</th>
                    <th className="py-3 px-4">Nível de Sigilo</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 font-medium">
                  {visits.map((vis) => (
                    <tr key={vis.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-foreground">{vis.memberName}</p>
                        {vis.notes && <p className="text-[10px] text-muted-foreground italic truncate max-w-xs">{vis.notes}</p>}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-accent">
                        <span className="flex items-center gap-1">
                          <Heart className="size-3 shrink-0" />
                          {vis.purpose}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">{vis.visitDate}</td>
                      <td className="py-3.5 px-4 font-semibold text-foreground">{vis.pastorName}</td>
                      <td className="py-3.5 px-4">
                        {vis.privacy === "confidencial" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                            <Lock className="size-3" /> Confidencial (Gabinete)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">
                            <UserCheck className="size-3" /> Equipe Pastoral
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge
                          className={cn(
                            "text-[10px] border-0",
                            vis.status === "realizado"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          )}
                        >
                          {vis.status === "realizado" ? "✓ Realizada" : "Agendada"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL 1: REGISTRAR ENTREGA DE AUXÍLIO */}
      <Dialog open={isDeliveryModalOpen} onOpenChange={setIsDeliveryModalOpen}>
        <DialogContent className="sm:max-w-[460px] rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Registrar Entrega de Auxílio</DialogTitle>
            <DialogDescription className="text-xs">
              Dar baixa no estoque do banco de alimentos e registrar a entrega para uma família.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddDelivery} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Família Beneficiada</Label>
              <select
                value={selectedFamilyId}
                onChange={(e) => setSelectedFamilyId(e.target.value)}
                className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
              >
                {families.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.headName} ({f.dependentsCount} dependentes)
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Item a Entregar</Label>
              <Input
                value={deliveryItem}
                onChange={(e) => setDeliveryItem(e.target.value)}
                className="h-10 rounded-xl text-xs"
                placeholder="Ex: Cesta Básica Tipo A, Vale-Gás, Roupas"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Quantidade</Label>
              <Input
                type="number"
                min="1"
                value={deliveryQty}
                onChange={(e) => setDeliveryQty(e.target.value)}
                className="h-10 rounded-xl font-bold"
                required
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeliveryModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold">
                Confirmar Entrega
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CADASTRAR FAMÍLIA ASSISTIDA */}
      <Dialog open={isFamilyModalOpen} onOpenChange={setIsFamilyModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Cadastrar Família Assistida</DialogTitle>
            <DialogDescription className="text-xs">
              Adicione uma família ao cadastro de assistência social da igreja.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddFamily} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Nome do Responsável Familiar</Label>
              <Input
                placeholder="Ex: Maria das Graças Silva"
                value={familyHeadName}
                onChange={(e) => setFamilyHeadName(e.target.value)}
                className="h-10 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Telefone / WhatsApp</Label>
                <Input
                  placeholder="(61) 98888-7777"
                  value={familyPhone}
                  onChange={(e) => setFamilyPhone(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Qtd. Dependentes</Label>
                <Input
                  type="number"
                  value={familyDependents}
                  onChange={(e) => setFamilyDependents(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Endereço Residencial</Label>
              <Input
                placeholder="Ex: Quadra 10, Lote 05 - Ceilândia"
                value={familyAddress}
                onChange={(e) => setFamilyAddress(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Benefício Principal Solicitado</Label>
              <select
                value={familyAssistanceType}
                onChange={(e) => setFamilyAssistanceType(e.target.value as SocialAssistanceType)}
                className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
              >
                <option value="cesta_basica">Cesta Básica</option>
                <option value="vale_gas">Vale Gás</option>
                <option value="doacao_roupas">Doação de Roupas & Agasalhos</option>
                <option value="auxilio_financeiro">Auxílio Emergencial</option>
                <option value="apoio_psicologico">Apoio Psicológico / Jurídico</option>
              </select>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFamilyModalOpen(false)}
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

      {/* MODAL 3: AGENDAR VISITA PASTORAL */}
      <Dialog open={isVisitModalOpen} onOpenChange={setIsVisitModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl border-border/80 bg-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">Agendar Visita Pastoral / Atendimento</DialogTitle>
            <DialogDescription className="text-xs">
              Agende uma visita residencial, hospitalar ou atendimento pastoral no gabinete.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddVisit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Nome do Membro / Família</Label>
              <Input
                placeholder="Ex: Irmã Beatriz Lima"
                value={visitMemberName}
                onChange={(e) => setVisitMemberName(e.target.value)}
                className="h-10 rounded-xl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Data da Visita</Label>
                <Input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Pastor / Visitador</Label>
                <Input
                  value={visitPastor}
                  onChange={(e) => setVisitPastor(e.target.value)}
                  className="h-10 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Propósito da Visita</Label>
                <select
                  value={visitPurpose}
                  onChange={(e) => setVisitPurpose(e.target.value as PastoralVisit["purpose"])}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  <option value="Enfermidade / Hospital">Enfermidade / Hospital</option>
                  <option value="Luto & Consolo">Luto & Consolo</option>
                  <option value="Oração no Lar">Oração no Lar</option>
                  <option value="Aconselhamento Matrimonial">Aconselhamento Matrimonial</option>
                  <option value="Boas-vindas">Boas-vindas</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Nível de Sigilo</Label>
                <select
                  value={visitPrivacy}
                  onChange={(e) => setVisitPrivacy(e.target.value as "confidencial" | "equipe_pastoral")}
                  className="w-full h-10 rounded-xl border border-border/80 bg-background px-3 text-xs font-medium focus:ring-accent"
                >
                  <option value="equipe_pastoral">Equipe Pastoral</option>
                  <option value="confidencial">Confidencial (Gabinete)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Observações / Pedido de Oração</Label>
              <Input
                placeholder="Ex: Pedido de oração por restauração de saúde"
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsVisitModalOpen(false)}
                className="rounded-xl"
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-semibold">
                Agendar Visita
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
