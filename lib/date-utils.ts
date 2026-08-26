export const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const

export type WeekDay = {
  date: string
  label: string
  dayNumber: number
}

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/** 0 = segunda-feira ... 6 = domingo */
export function getWeekdayIndex(date: Date | string): number {
  const d = typeof date === "string" ? new Date(`${date}T12:00:00`) : date
  return (d.getDay() + 6) % 7
}

/** Retorna os 7 dias (seg..dom) da semana atual, já em formato ISO. */
export function getCurrentWeek(): WeekDay[] {
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - getWeekdayIndex(today))

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + index)
    return {
      date: toISODate(day),
      label: WEEKDAY_LABELS[index],
      dayNumber: day.getDate(),
    }
  })
}

/** Move uma data (ISO) para o mesmo dia da semana na semana atual. */
export function rebaseToCurrentWeek(dateStr: string): string {
  const week = getCurrentWeek()
  return week[getWeekdayIndex(dateStr)].date
}

/**
 * Data ISO do próximo domingo. Nunca retorna hoje: se hoje já for domingo,
 * avança 7 dias para o próximo domingo de fato.
 */
export function getNextSunday(): string {
  const today = new Date()
  const daysUntilSunday = (7 - today.getDay()) % 7 || 7
  const next = new Date(today)
  next.setDate(today.getDate() + daysUntilSunday)
  return toISODate(next)
}

/** Soma dias a uma data ISO e retorna em ISO. */
export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

/**
 * Re-ancora uma data-alvo de culto do mock (ex: serviceDate de uma SongRequest)
 * para a agenda "viva" relativa a hoje, preservando a distância em semanas que o
 * mock tinha em relação ao domingo da semana corrente usada na criação dos dados.
 */
export function reanchorServiceDate(mockDate: string): string {
  const MOCK_REFERENCE_SUNDAY = "2026-08-30"
  const deltaMs =
    new Date(`${mockDate}T12:00:00`).getTime() -
    new Date(`${MOCK_REFERENCE_SUNDAY}T12:00:00`).getTime()
  const weeks = Math.round(deltaMs / (7 * 86_400_000))
  return addDays(getNextSunday(), weeks * 7)
}

/** Formata uma data ISO como "25 ago". */
export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
}

/** Formata um intervalo "2026-08-27 · 19:30-21:00" -> "27 ago · 19:30–21:00". */
export function formatBookingSlot(date: string, startTime: string, endTime: string): string {
  return `${formatShortDate(date)} · ${startTime}–${endTime}`
}

/** Retorna a saudação adequada ("Bom dia", "Boa tarde" ou "Boa noite") conforme a hora local. */
export function getGreeting(): string {
  const hours = new Date().getHours()
  if (hours >= 5 && hours < 12) return "Bom dia"
  if (hours >= 12 && hours < 18) return "Boa tarde"
  return "Boa noite"
}

/** Retorna os 7 dias (seg..dom) de qualquer semana com base em uma data de referência. */
export function getWeekForDate(baseDate: Date): WeekDay[] {
  const monday = new Date(baseDate)
  monday.setDate(baseDate.getDate() - getWeekdayIndex(baseDate))

  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + index)
    return {
      date: toISODate(day),
      label: WEEKDAY_LABELS[index],
      dayNumber: day.getDate(),
    }
  })
}

export type MonthCalendarDay = {
  date: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
}

/** Retorna a grade completa de dias para a visão mensal de calendário (incluindo dias padding). */
export function getMonthGrid(year: number, month: number): MonthCalendarDay[] {
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  const startWeekday = getWeekdayIndex(firstDayOfMonth) // 0 = Seg ... 6 = Dom
  const todayStr = toISODate(new Date())

  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(firstDayOfMonth.getDate() - startWeekday)

  const totalDays = Math.ceil((startWeekday + lastDayOfMonth.getDate()) / 7) * 7

  return Array.from({ length: totalDays }, (_, index) => {
    const current = new Date(startDate)
    current.setDate(startDate.getDate() + index)
    const dateStr = toISODate(current)

    return {
      date: dateStr,
      dayNumber: current.getDate(),
      isCurrentMonth: current.getMonth() === month,
      isToday: dateStr === todayStr,
    }
  })
}
