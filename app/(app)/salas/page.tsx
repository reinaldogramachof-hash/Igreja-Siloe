"use client"

import { useMemo, useState } from "react"
import { CalendarDays, DoorOpen, Plus, TriangleAlert, Users, Clock, Info } from "lucide-react"
import { toast } from "sonner"
import { ApprovalFlowCard } from "@/components/shared/approval-flow-card"
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
import { buildApprovalItems, roomBookings, rooms } from "@/lib/mock-data"
import type { RoomBooking } from "@/lib/types"
import { useDemoUser } from "@/lib/prototype-auth"
import { cn } from "@/lib/utils"
import {
  formatBookingSlot,
  formatShortDate,
  getCurrentWeek,
  rebaseToCurrentWeek,
  toISODate,
} from "@/lib/date-utils"

const week = getCurrentWeek()
const todayISO = toISODate(new Date())

const bookingStyles: Record<RoomBooking["status"], string> = {
  aprovado: "border-success/30 bg-success/10 text-success-foreground shadow-sm shadow-success/5",
  pendente: "border-warning/30 bg-warning/10 text-warning-foreground shadow-sm shadow-warning/5",
  recusado: "border-danger/30 bg-danger/10 text-danger-foreground shadow-sm shadow-danger/5",
}

export default function SalasPage() {
  const { user, role } = useDemoUser()
  const isRoomManager = role === "admin" || role === "lider_salas"

  const [bookings, setBookings] = useState<RoomBooking[]>(() =>
    roomBookings.map((booking) => ({ ...booking, date: rebaseToCurrentWeek(booking.date) }))
  )

  const [open, setOpen] = useState(false)
  const [roomId, setRoomId] = useState(rooms[0].id)
  const [date, setDate] = useState(todayISO)
  const [startTime, setStartTime] = useState("18:00")
  const [endTime, setEndTime] = useState("20:00")
  const [purpose, setPurpose] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  const pendingManageableBookings = useMemo(() => {
    return bookings.filter((b) => b.status === "pendente")
  }, [bookings])

  function handleManagerApproveReject(id: string, newStatus: "aprovado" | "recusado") {
    setBookings((current) =>
      current.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    )
    toast.success(newStatus === "aprovado" ? "Reserva aprovada com sucesso!" : "Reserva recusada.")
  }

  const conflicts = useMemo(() => {
    if (!roomId || !date || !startTime || !endTime) return []
    return bookings.filter(
      (booking) =>
        booking.roomId === roomId &&
        booking.date === date &&
        booking.status === "aprovado" &&
        startTime < booking.endTime &&
        endTime > booking.startTime
    )
  }, [bookings, roomId, date, startTime, endTime])

  const myItems = useMemo(() => {
    const mine = bookings.filter((booking) => booking.requestedBy === user.id)
    return buildApprovalItems(mine, []).map((item) => {
      const booking = mine.find((entry) => entry.id === item.id)
      return booking
        ? {
            ...item,
            scheduledFor: formatBookingSlot(booking.date, booking.startTime, booking.endTime),
          }
        : item
    })
  }, [bookings, user.id])

  function resetForm() {
    setRoomId(rooms[0].id)
    setDate(todayISO)
    setStartTime("18:00")
    setEndTime("20:00")
    setPurpose("")
    setFormError(null)
  }

  function markTouched() {
    setFormError(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!purpose.trim()) {
      setFormError("Informe a finalidade da reserva.")
      return
    }
    if (endTime <= startTime) {
      setFormError("O horário de fim deve ser depois do início.")
      return
    }

    const booking: RoomBooking = {
      id: `booking-${Date.now()}`,
      roomId,
      requestedBy: user.id,
      date,
      startTime,
      endTime,
      purpose: purpose.trim(),
      status: "pendente",
    }

    setBookings((current) => [booking, ...current])
    toast.success("Solicitação de sala enviada para aprovação")
    resetForm()
    setOpen(false)
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Infraestrutura</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Controle de Salas</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Acompanhe a agenda da semana, veja a disponibilidade e solicite reservas para salas e salões.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2 bg-accent hover:bg-accent/90 text-white rounded-xl shadow-md shadow-accent/10 font-semibold h-10 px-4 transition-all duration-300">
          <Plus className="size-4.5" />
          Solicitar Sala
        </Button>
      </div>

      {/* Agenda semanal */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent-soft/60 text-accent">
              <CalendarDays className="size-4" />
            </span>
            <h2 className="text-base font-bold text-foreground">Agenda da Semana</h2>
          </div>
          <Badge className="bg-card border border-border/40 text-muted-foreground px-3 py-1 text-[11px] font-semibold rounded-full hover:bg-card">
            {formatShortDate(week[0].date)} — {formatShortDate(week[6].date)}
          </Badge>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/45 bg-card/45 backdrop-blur-md shadow-sm">
          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              <div className="grid grid-cols-[180px_repeat(7,minmax(112px,1fr))] border-b border-border/40 bg-muted/20">
                <div className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 flex items-center">Salas</div>
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={cn(
                      "border-l border-border/40 px-2 py-3 text-center transition-colors",
                      day.date === todayISO && "bg-accent-soft/30"
                    )}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-wide text-foreground">{day.label}</p>
                    <p className="text-xs font-semibold text-muted-foreground/90 mt-0.5">{day.dayNumber}</p>
                  </div>
                ))}
              </div>

              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="grid grid-cols-[180px_repeat(7,minmax(112px,1fr))] border-b border-border/40 last:border-b-0"
                >
                  <div className="px-4 py-3.5 bg-card/5">
                    <p className="text-sm font-semibold text-foreground">{room.name}</p>
                    <p className="text-[10px] uppercase font-bold text-accent tracking-wide mt-0.5 flex items-center gap-1">
                      <Users className="size-3" />
                      Capacidade: {room.capacity}
                    </p>
                  </div>
                  {week.map((day) => {
                    const dayBookings = bookings.filter(
                      (booking) => booking.roomId === room.id && booking.date === day.date
                    )
                    return (
                      <div
                        key={day.date}
                        className={cn(
                          "space-y-1.5 border-l border-border/40 p-2",
                          day.date === todayISO && "bg-accent-soft/30"
                        )}
                      >
                        {dayBookings.length > 0 ? (
                          dayBookings.map((booking) => (
                            <BookingBlock key={booking.id} booking={booking} />
                          ))
                        ) : (
                          <div className="flex h-10 items-center justify-center text-xs text-muted-foreground/30">
                            —
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-muted-foreground/80 pl-1">
          <span className="flex items-center gap-2">
            <span className="size-2 rounded bg-success" /> Aprovado
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded bg-warning" /> Pendente
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded bg-danger" /> Recusado
          </span>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded bg-accent" /> Hoje
          </span>
        </div>
      </section>

      {/* Salas disponíveis */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-foreground pl-1">Salas & Capacidades</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => (
            <Card key={room.id} className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow">
              <CardHeader className="pb-3.5">
                <div className="flex size-10 items-center justify-center rounded-xl bg-accent-soft/60 text-accent ring-1 ring-accent/15">
                  <DoorOpen className="size-5" />
                </div>
                <CardTitle className="mt-3.5 text-sm.5 font-bold text-foreground">{room.name}</CardTitle>
                <CardDescription className="text-xs leading-relaxed text-muted-foreground mt-1">{room.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="flex items-center gap-2 text-xs font-semibold text-accent">
                  <Users className="size-3.5" />
                  Capacidade: {room.capacity} pessoas
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Gestão de Reservas Pendentes (Visível apenas para Líder de Salas e Admin) */}
      {isRoomManager && pendingManageableBookings.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 pl-1">
            <span className="flex size-2 rounded-full bg-warning animate-pulse" />
            <h2 className="text-base font-bold text-foreground">Aprovações Pendentes de Salas ({pendingManageableBookings.length})</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {pendingManageableBookings.map((b) => {
              const targetRoom = rooms.find((r) => r.id === b.roomId)
              return (
                <Card key={b.id} className="rounded-2xl border-warning/30 bg-warning/5 p-4 shadow-sm backdrop-blur-md">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-accent uppercase tracking-wider">{targetRoom?.name || "Sala"}</p>
                      <h4 className="text-sm font-bold text-foreground mt-0.5">{b.purpose}</h4>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
                        <Clock className="size-3.5 text-warning" />
                        {b.date} • {b.startTime} às {b.endTime}
                      </p>
                    </div>
                    <Badge className="bg-warning/20 text-warning-foreground border-warning/30 text-[10px] uppercase font-bold">
                      Pendente
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-border/30 pt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManagerApproveReject(b.id, "recusado")}
                      className="rounded-xl text-xs font-semibold text-danger border-danger/30 hover:bg-danger/10 hover:text-danger h-8"
                    >
                      Recusar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleManagerApproveReject(b.id, "aprovado")}
                      className="rounded-xl text-xs font-semibold bg-success hover:bg-success/90 text-white h-8"
                    >
                      Aprovar Reserva
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Minhas solicitações */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-foreground pl-1">Minhas Solicitações</h2>
        {myItems.length > 0 ? (
          <div className="space-y-3">
            {myItems.map((item) => (
              <ApprovalFlowCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted/40 text-muted-foreground mb-4">
                <Info className="size-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">Sem solicitações</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Você ainda não fez nenhuma solicitação de reserva de sala para esta semana.
              </p>
              <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="mt-4 rounded-xl text-xs font-semibold px-4">
                Solicitar Agora
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Dialog de solicitação */}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) resetForm()
        }}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Solicitar Sala</DialogTitle>
            <DialogDescription>
              Preencha os dados da reserva. Ela será enviada para aprovação do líder responsável.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="room">Escolha a Sala</Label>
              <select
                id="room"
                value={roomId}
                onChange={(event) => {
                  setRoomId(event.target.value)
                  markTouched()
                }}
                className="h-10 w-full rounded-xl border border-border/40 bg-transparent px-3 text-sm outline-none focus:ring-1 focus:ring-ring dark:bg-card"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id} className="bg-background text-foreground">
                    {room.name} — Cap: {room.capacity} pessoas
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="date">Data da Reserva</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  min={todayISO}
                  onChange={(event) => {
                    setDate(event.target.value)
                    markTouched()
                  }}
                  className="rounded-xl border-border/40 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Horário de Início</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(event) => {
                    setStartTime(event.target.value)
                    markTouched()
                  }}
                  className="rounded-xl border-border/40 h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Horário de Fim</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(event) => {
                    setEndTime(event.target.value)
                    markTouched()
                  }}
                  className="rounded-xl border-border/40 h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Finalidade da Reserva</Label>
              <Input
                id="purpose"
                placeholder="Ex: Ensaio do Ministério de Louvor"
                value={purpose}
                onChange={(event) => {
                  setPurpose(event.target.value)
                  markTouched()
                }}
                className="rounded-xl border-border/40 h-10"
              />
            </div>

            {formError && (
              <p className="text-xs font-semibold text-danger pl-1">{formError}</p>
            )}

            {conflicts.length > 0 && (
              <div className="flex items-start gap-2.5 rounded-xl border border-warning/35 bg-warning/10 p-3.5 text-xs leading-5 text-warning-foreground">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <p>
                  <span className="font-bold">Conflito de horários:</span> já existe{" "}
                  {conflicts.length > 1 ? `${conflicts.length} reservas aprovadas` : "uma reserva aprovada"} nesse
                  período. Sua solicitação ficará pendente de aprovação manual.
                </p>
              </div>
            )}

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  resetForm()
                  setOpen(false)
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className={cn(
                  "rounded-xl font-semibold",
                  conflicts.length > 0 
                    ? "bg-warning text-warning-foreground hover:bg-warning/90"
                    : "bg-accent hover:bg-accent/90 text-white"
                )}
              >
                {conflicts.length > 0 ? "Solicitar Mesmo Assim" : "Confirmar Solicitação"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BookingBlock({ booking }: { booking: RoomBooking }) {
  return (
    <div
      className={cn(
        "rounded-lg border-l-2 p-2 text-[10px] leading-tight transition-all duration-300 hover:scale-[1.02]",
        bookingStyles[booking.status],
        booking.status === "recusado" && "opacity-60 line-through"
      )}
    >
      <div className="flex items-center gap-1 font-bold text-foreground">
        <Clock className="size-3 opacity-75 shrink-0" />
        <span>{booking.startTime}–{booking.endTime}</span>
      </div>
      <p className="font-semibold text-muted-foreground mt-1 truncate" title={booking.purpose}>
        {booking.purpose}
      </p>
    </div>
  )
}
