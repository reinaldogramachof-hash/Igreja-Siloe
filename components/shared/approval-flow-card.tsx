"use client"

import { Check, Music2, UserRound, X, DoorOpen, CalendarDays } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/status-badge"
import type { ApprovalItem, BookingStatus } from "@/lib/types"

type ApprovalFlowCardProps = {
  item: ApprovalItem
  canReview?: boolean
  onStatusChange?: (id: string, status: BookingStatus) => void
}

export function ApprovalFlowCard({ item, canReview = false, onStatusChange }: ApprovalFlowCardProps) {
  const TypeIcon = item.type === "room" ? DoorOpen : Music2
  const initials = item.requestedBy.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")

  return (
    <Card className="rounded-lg border-border/80 shadow-sm">
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-foreground">
              <TypeIcon className="size-5" />
            </div>
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold leading-tight">{item.title}</h3>
                <StatusBadge status={item.status} />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground sm:justify-end">
            <CalendarDays className="size-4 text-accent" />
            <span>{item.scheduledFor}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border bg-muted/35 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-background text-xs font-semibold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{item.requestedBy.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <UserRound className="size-3.5" />
                Solicitado {item.requestedAt} · {item.meta}
              </p>
            </div>
          </div>

          {canReview && item.status === "pendente" ? (
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Button
                size="sm"
                className="bg-success text-white hover:bg-success/90"
                onClick={() => onStatusChange?.(item.id, "aprovado")}
              >
                <Check className="size-4" />
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onStatusChange?.(item.id, "recusado")}
              >
                <X className="size-4" />
                Recusar
              </Button>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
