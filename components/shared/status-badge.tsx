import { CheckCircle2, Clock3, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getStatusLabel } from "@/lib/mock-data"
import type { BookingStatus } from "@/lib/types"

const statusStyles: Record<BookingStatus, string> = {
  pendente: "border-warning/30 bg-warning-soft text-warning-foreground",
  aprovado: "border-success/30 bg-success-soft text-success-foreground",
  recusado: "border-danger/30 bg-danger-soft text-danger-foreground",
}

const statusIcons = {
  pendente: Clock3,
  aprovado: CheckCircle2,
  recusado: XCircle,
}

export function StatusBadge({
  status,
  className,
}: {
  status: BookingStatus
  className?: string
}) {
  const Icon = statusIcons[status]

  return (
    <Badge variant="outline" className={cn("h-7 gap-1.5 rounded-md px-2.5", statusStyles[status], className)}>
      <Icon className="size-3.5" />
      {getStatusLabel(status)}
    </Badge>
  )
}
