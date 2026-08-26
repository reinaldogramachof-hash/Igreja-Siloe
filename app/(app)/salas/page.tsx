"use client"

import { useMemo, useState } from "react"
import { CalendarDays, DoorOpen, Plus, TriangleAlert, Users } from "lucide-react"
import { toast } from "sonner"
import { ApprovalFlowCard } from "@/components/shared/approval-flow-card"
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
  aprovado: "border-success bg-success-soft text-success-foreground",
  pendente: "border-warning bg-warning-soft text-warning-foreground",
  recusado: "border-danger bg-danger-soft text-danger-foreground",
}

export default function SalasPage() {
  const { user } = useDemoUser()

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
          <p className="text-sm font-medium text-accent">Infraestrutura</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">Controle de Salas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Agenda da semana, disponibilidade e reservas das salas e salões.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Solicitar sala
        </Button>
      </div>

      {/* Agenda semanal */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-accent" />
            <h2 className="text-base font-semibold">Agenda da semana</h2>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            {formatShortDate(week[0].date)} — {formatShortDate(week[6].date)}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              <div className="grid grid-cols-[160px_repeat(7,minmax(112px,1fr))] border-b bg-muted/30">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Salas</div>
                {week.map((day) => (
                  <div
                    key={day.date}
                    className={cn(
                      "border-l px-2 py-2 text-center",
                      day.date === todayISO && "bg-accent-soft/50"
                    )}
                  >
                    <p className="text-xs font-semibold">{day.label}</p>
                    <p className="text-[11px] text-muted-foreground">{day.dayNumber}</p>
                  </div>
                ))}
              </div>

              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="grid grid-cols-[160px_repeat(7,minmax(112px,1fr))] border-b last:border-b-0"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{room.name}</p>
                    <p className="text-[11px] text-muted-foreground">{room.capacity} pessoas</p>
                  </div>
                  {week.map((day) => {
                    const dayBookings = bookings.filter(
                      (booking) => booking.roomId === room.id && booking.date === day.date
                    )
                    return (
                      <div
                        key={day.date}
                        className={cn(
                          "space-y-1 border-l px-1.5 py-1.5",
                          day.date === todayISO && "bg-accent-soft/50"
                        )}
                      >
                        {dayBookings.length > 0 ? (
                          dayBookings.map((booking) => (
                            <BookingBlock key={booking.id} booking={booking} />
                          ))
                        ) : (
                          <div className="flex h-7 items-center justify-center text-[11px] text-muted-foreground/40">
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

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-success" /> Aprovado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-warning" /> Pendente
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-danger" /> Recusado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-accent" /> Hoje
          </span>
        </div>
      </section>

      {/* Salas disponíveis */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Salas disponíveis</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => (
            <Card key={room.id} className="rounded-xl">
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent-foreground">
                  <DoorOpen className="size-5" />
                </div>
                <CardTitle className="mt-3">{room.name}</CardTitle>
                <CardDescription>{room.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="size-4" />
                  Capacidade: {room.capacity} pessoas
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Minhas solicitações */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Minhas solicitações</h2>
        {myItems.length > 0 ? (
          <div className="space-y-3">
            {myItems.map((item) => (
              <ApprovalFlowCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Card className="rounded-xl">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <DoorOpen className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Você ainda não fez nenhuma solicitação de sala.
              </p>
              <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                Solicitar agora
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Solicitar sala</DialogTitle>
            <DialogDescription>
              Preencha os dados da reserva. Ela entra como “pendente” para o líder de salas aprovar.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room">Sala</Label>
              <select
                id="room"
                value={roomId}
                onChange={(event) => {
                  setRoomId(event.target.value)
                  markTouched()
                }}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id} className="bg-background">
                    {room.name} — {room.capacity} pessoas
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-3">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  min={todayISO}
                  onChange={(event) => {
                    setDate(event.target.value)
                    markTouched()
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Início</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(event) => {
                    setStartTime(event.target.value)
                    markTouched()
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Fim</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(event) => {
                    setEndTime(event.target.value)
                    markTouched()
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Finalidade</Label>
              <Input
                id="purpose"
                placeholder="Ex: Ensaio do coral infantil"
                value={purpose}
                onChange={(event) => {
                  setPurpose(event.target.value)
                  markTouched()
                }}
              />
            </div>

            {formError ? (
              <p className="text-xs font-medium text-danger">{formError}</p>
            ) : null}

            {conflicts.length > 0 ? (
              <div className="flex items-start gap-2 rounded-lg border border-warning/40 bg-warning-soft p-3 text-xs leading-5 text-warning-foreground">
                <TriangleAlert className="mt-0.5 size-4 shrink-0" />
                <p>
                  <span className="font-semibold">Conflito detectado:</span> já existe{" "}
                  {conflicts.length > 1 ? `${conflicts.length} reservas aprovadas` : "uma reserva aprovada"} nesse
                  horário. Sua solicitação ficará “pendente” para o líder avaliar.
                </p>
              </div>
            ) : null}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
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
                  conflicts.length > 0 && "bg-warning text-warning-foreground hover:bg-warning/90"
                )}
              >
                {conflicts.length > 0 ? "Solicitar mesmo assim" : "Confirmar solicitação"}
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
        "rounded-md border-l-2 px-1.5 py-1 text-[11px] leading-tight",
        bookingStyles[booking.status],
        booking.status === "recusado" && "opacity-60 line-through"
      )}
    >
      <p className="font-semibold">
        {booking.startTime}–{booking.endTime}
      </p>
      <p className="truncate" title={booking.purpose}>
        {booking.purpose}
      </p>
    </div>
  )
}
