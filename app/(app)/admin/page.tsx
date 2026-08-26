"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Edit3, UsersRound, DoorOpen, Inbox, CheckCircle2, Search, Filter, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import { ApprovalFlowCard } from "@/components/shared/approval-flow-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { buildApprovalItems, getRoleLabel, members, rooms } from "@/lib/mock-data"
import { useDemoUser } from "@/lib/prototype-auth"
import type { ApprovalItem, BookingStatus, Member } from "@/lib/types"

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
}

export default function AdminPage() {
  const { role } = useDemoUser()
  const [items, setItems] = useState<ApprovalItem[]>(() => buildApprovalItems())
  const pendingItems = useMemo(() => items.filter((item) => item.status === "pendente"), [items])
  const [memberList, setMemberList] = useState<Member[]>(() => members)
  const [searchTerm, setSearchTerm] = useState("")

  // Edit states for member dialog mock
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [editRole, setEditRole] = useState("")
  const [editName, setEditName] = useState("")

  const filteredMembers = useMemo(() => {
    return memberList.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [memberList, searchTerm])

  if (role !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center p-6 animate-fade-in">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-danger/10 text-danger mb-4 shadow-sm border border-danger/20">
          <ShieldAlert className="size-8" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Acesso Restrito ao Administrador</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
          Você está navegando como <span className="font-semibold text-foreground">{getRoleLabel(role)}</span>. A gestão global de membros e aprovações do sistema é de acesso restrito.
        </p>
        <div className="mt-6">
          <Link href="/dashboard" className="inline-flex h-10 items-center justify-center rounded-xl bg-accent px-6 text-sm font-semibold text-white shadow transition-colors hover:bg-accent/90">
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    )
  }

  function handleStatusChange(id: string, status: BookingStatus) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)))
    toast.success(status === "aprovado" ? "Solicitação aprovada" : "Solicitação recusada")
  }

  function handleSaveMember(e: React.FormEvent) {
    e.preventDefault()
    if (!editingMember) return
    setMemberList((current) =>
      current.map((m) => (m.id === editingMember.id ? { ...m, name: editName, role: editRole as any } : m))
    )
    toast.success("Membro atualizado com sucesso")
    setEditingMember(null)
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-accent">Painel do Líder / Admin</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Aprovações & Membros</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie permissões de membros e aprove solicitações ministeriais.</p>
      </div>

      {/* Metric Cards Grid */}
      <section className="grid gap-4 sm:grid-cols-3">
        <MetricCard title="Total de Membros" value={memberList.length} icon={UsersRound} description="Cadastrados no sistema" />
        <MetricCard title="Salas Cadastradas" value={rooms.length} icon={DoorOpen} description="Salas disponíveis para reserva" />
        <MetricCard 
          title="Pendências" 
          value={pendingItems.length} 
          icon={Inbox} 
          highlight={pendingItems.length > 0} 
          description="Aguardando sua revisão"
        />
      </section>

      {/* Main Tabs System */}
      <Tabs defaultValue="requests" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-2">
          <TabsList className="bg-muted/40 p-1 rounded-xl">
            <TabsTrigger value="requests" className="rounded-lg px-4 py-2 text-sm font-semibold">
              Solicitações ({pendingItems.length})
            </TabsTrigger>
            <TabsTrigger value="members" className="rounded-lg px-4 py-2 text-sm font-semibold">
              Membros ({memberList.length})
            </TabsTrigger>
          </TabsList>

          {/* Search bar specifically for members, visible when relevant */}
          <div className="relative w-full max-w-xs sm:ml-auto">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar membros..."
              className="pl-9 rounded-xl border-border/45 bg-card/45 backdrop-blur-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Requests Tab Content */}
        <TabsContent value="requests" className="space-y-4 outline-none">
          {pendingItems.length > 0 ? (
            pendingItems.map((item) => (
              <ApprovalFlowCard key={item.id} item={item} canReview onStatusChange={handleStatusChange} />
            ))
          ) : (
            <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-success-soft text-success mb-4">
                  <CheckCircle2 className="size-7" />
                </div>
                <p className="text-base font-semibold text-foreground">Tudo em dia!</p>
                <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
                  Não há novas solicitações pendentes no momento. Todas as pendências foram revisadas.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Members Tab Content */}
        <TabsContent value="members" className="outline-none">
          <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm overflow-hidden">
            <CardHeader className="border-b border-border/40 py-5 bg-card/10">
              <CardTitle className="text-base font-bold">Gestão de Membros</CardTitle>
              <CardDescription>Gerencie funções e o acesso de cada membro da igreja.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/15">
                  <TableRow>
                    <TableHead className="py-3.5 pl-6">Membro</TableHead>
                    <TableHead className="py-3.5">Função</TableHead>
                    <TableHead className="py-3.5">Ministérios</TableHead>
                    <TableHead className="py-3.5 pr-6 text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/5 transition-colors">
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 border border-border/30 shadow-inner">
                            <AvatarFallback className="bg-accent-soft text-accent font-bold text-xs">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center rounded-lg bg-card/80 border border-border/50 px-2.5 py-1 text-xs font-semibold text-foreground">
                          {getRoleLabel(member.role)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {member.ministries.map((min) => (
                            <span key={min} className="inline-block rounded-md bg-accent-soft/45 px-2 py-0.5 text-[10px] font-semibold text-accent">
                              {min}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 pr-6 text-right">
                        <Dialog 
                          open={editingMember?.id === member.id} 
                          onOpenChange={(open) => {
                            if (open) {
                              setEditingMember(member)
                              setEditName(member.name)
                              setEditRole(member.role)
                            } else {
                              setEditingMember(null)
                            }
                          }}
                        >
                          <DialogTrigger render={<Button size="sm" variant="outline" className="rounded-lg text-xs gap-1.5 h-8 font-semibold" />}>
                            <Edit3 className="size-3.5" />
                            Editar
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md rounded-2xl">
                            <DialogHeader>
                              <DialogTitle>Editar Membro</DialogTitle>
                              <DialogDescription>
                                Atualize a função ou nome do membro selecionado no sistema de gestão.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSaveMember} className="space-y-4 py-3">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Nome do Membro</Label>
                                <Input
                                  id="edit-name"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="rounded-xl border-border/40"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-role">Função / Cargo</Label>
                                <select
                                  id="edit-role"
                                  value={editRole}
                                  onChange={(e) => setEditRole(e.target.value)}
                                  className="h-9 w-full rounded-xl border border-border/40 bg-transparent px-3 text-sm outline-none focus:ring-1 focus:ring-ring dark:bg-card"
                                >
                                  <option value="admin">Administrador</option>
                                  <option value="lider_louvor">Líder de Louvor</option>
                                  <option value="lider_salas">Líder de Salas</option>
                                  <option value="membro">Membro da Comunidade</option>
                                </select>
                              </div>
                              <DialogFooter className="gap-2 pt-4">
                                <Button type="button" variant="outline" className="rounded-xl" onClick={() => setEditingMember(null)}>
                                  Cancelar
                                </Button>
                                <Button type="submit" className="bg-accent hover:bg-accent/90 text-white rounded-xl">
                                  Salvar Alterações
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent History Section */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-foreground">Histórico Recente</h2>
        <div className="grid gap-3.5">
          {items
            .filter((item) => item.status !== "pendente")
            .map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between rounded-xl border border-border/45 bg-card/45 p-4 shadow-sm transition-all duration-300 hover:border-accent/30 hover:bg-card"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Solicitado por {item.requestedBy.name}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  highlight = false,
  description,
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  highlight?: boolean
  description?: string
}) {
  return (
    <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-1.5 text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
          {description && <p className="text-[11px] text-muted-foreground mt-1.5">{description}</p>}
        </div>
        <div className={`flex size-12 items-center justify-center rounded-xl transition-colors duration-300 ring-1 ring-accent/15 ${
          highlight 
            ? "bg-accent text-white shadow-md shadow-accent/10" 
            : "bg-accent-soft/50 text-accent"
        }`}>
          <Icon className="size-5.5" />
        </div>
      </CardContent>
    </Card>
  )
}
