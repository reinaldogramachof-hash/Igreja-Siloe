"use client"

import { useMemo, useState } from "react"
import { Edit3, UsersRound, DoorOpen, Inbox, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { ApprovalFlowCard } from "@/components/shared/approval-flow-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { buildApprovalItems, getRoleLabel, members, rooms } from "@/lib/mock-data"
import type { ApprovalItem, BookingStatus } from "@/lib/types"

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
}

export default function AdminPage() {
  const [items, setItems] = useState<ApprovalItem[]>(() => buildApprovalItems())
  const pendingItems = useMemo(() => items.filter((item) => item.status === "pendente"), [items])

  function handleStatusChange(id: string, status: BookingStatus) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, status } : item)))
    toast.success(status === "aprovado" ? "Solicitação aprovada" : "Solicitação recusada")
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-sm font-medium text-accent">Painel do líder/admin</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-normal">Aprovações e membros</h1>
      </div>

      <section className="grid gap-3 sm:grid-cols-3">
        <MetricCard title="Membros" value={members.length} icon={UsersRound} />
        <MetricCard title="Salas cadastradas" value={rooms.length} icon={DoorOpen} />
        <MetricCard title="Pendências" value={pendingItems.length} icon={Inbox} highlight={pendingItems.length > 0} />
      </section>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Solicitações ({pendingItems.length})</TabsTrigger>
          <TabsTrigger value="members">Membros</TabsTrigger>
        </TabsList>
        <TabsContent value="requests" className="space-y-3">
          {pendingItems.length > 0 ? (
            pendingItems.map((item) => (
              <ApprovalFlowCard key={item.id} item={item} canReview onStatusChange={handleStatusChange} />
            ))
          ) : (
            <Card className="rounded-lg shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="size-10 text-success mb-3 opacity-90" />
                <p className="text-sm font-medium">Tudo em dia!</p>
                <p className="text-xs text-muted-foreground mt-1">Todas as solicitações foram revisadas.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="members">
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Gestão de membros</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membro</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Ministérios</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 border">
                            <AvatarFallback className="bg-accent-soft text-accent-foreground text-xs font-semibold">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{getRoleLabel(member.role)}</TableCell>
                      <TableCell className="text-sm">{member.ministries.join(", ")}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger render={<Button size="sm" variant="outline" />}>
                            <Edit3 className="size-3.5" />
                            Editar
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar membro</DialogTitle>
                              <DialogDescription>
                                Placeholder visual para a próxima fase. O CRUD real entra com backend e autenticação.
                              </DialogDescription>
                            </DialogHeader>
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

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Histórico recente</h2>
        {items
          .filter((item) => item.status !== "pendente")
          .map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm transition-colors hover:border-accent/30">
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.requestedBy.name}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          ))}
      </section>
    </div>
  )
}

function MetricCard({
  title,
  value,
  icon: Icon,
  highlight = false,
}: {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  highlight?: boolean
}) {
  return (
    <Card className="rounded-lg shadow-sm transition-all hover:shadow">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <div className={`flex size-11 items-center justify-center rounded-xl ring-1 ring-accent/20 ${
          highlight ? "bg-accent text-white" : "bg-accent-soft text-accent-foreground"
        }`}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )
}
