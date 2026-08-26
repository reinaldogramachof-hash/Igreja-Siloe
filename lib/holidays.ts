export type HolidayType = "nacional" | "eclesiastico" | "comemorativo"

export type Holiday = {
  date: string // ISO Format YYYY-MM-DD
  name: string
  type: HolidayType
  badgeColor?: string
}

export const HOLIDAYS_2026: Holiday[] = [
  { date: "2026-01-01", name: "Confraternização Universal", type: "nacional" },
  { date: "2026-02-16", name: "Véspera de Carnaval", type: "comemorativo" },
  { date: "2026-02-17", name: "Carnaval", type: "comemorativo" },
  { date: "2026-02-18", name: "Quarta-feira de Cinzas", type: "comemorativo" },
  { date: "2026-04-03", name: "Sexta-Feira Santa (Paixão de Cristo)", type: "nacional" },
  { date: "2026-04-05", name: "Domingo de Páscoa", type: "eclesiastico" },
  { date: "2026-04-21", name: "Tiradentes", type: "nacional" },
  { date: "2026-05-01", name: "Dia do Trabalhador", type: "nacional" },
  { date: "2026-05-10", name: "Dia das Mães", type: "comemorativo" },
  { date: "2026-05-24", name: "Domingo de Pentecostes", type: "eclesiastico" },
  { date: "2026-06-04", name: "Corpus Christi", type: "comemorativo" },
  { date: "2026-06-14", name: "Dia do Pastor", type: "eclesiastico" },
  { date: "2026-08-09", name: "Dia dos Pais", type: "comemorativo" },
  { date: "2026-08-20", name: "Aniversário da Igreja Siloé", type: "eclesiastico" },
  { date: "2026-09-07", name: "Independência do Brasil", type: "nacional" },
  { date: "2026-10-12", name: "Nossa Senhora Aparecida / Dia das Crianças", type: "nacional" },
  { date: "2026-10-31", name: "Dia da Reforma Protestante", type: "eclesiastico" },
  { date: "2026-11-02", name: "Finados", type: "nacional" },
  { date: "2026-11-15", name: "Proclamação da República", type: "nacional" },
  { date: "2026-11-20", name: "Dia da Consciência Negra", type: "nacional" },
  { date: "2026-11-26", name: "Dia de Ações de Graças", type: "eclesiastico" },
  { date: "2026-12-13", name: "Dia da Bíblia", type: "eclesiastico" },
  { date: "2026-12-25", name: "Natal", type: "nacional" },
  { date: "2026-12-31", name: "Culto da Virada (Réveillon)", type: "eclesiastico" },
]

/** Busca feriados e datas especiais de uma data específica no formato YYYY-MM-DD */
export function getHolidaysForDate(dateStr: string): Holiday[] {
  return HOLIDAYS_2026.filter((h) => h.date === dateStr)
}

/** Busca feriados de um mês e ano específicos */
export function getHolidaysForMonth(year: number, month: number): Holiday[] {
  const monthStr = String(month + 1).padStart(2, "0")
  const prefix = `${year}-${monthStr}`
  return HOLIDAYS_2026.filter((h) => h.date.startsWith(prefix))
}

/** Retorna os próximos feriados a partir de uma data específica */
export function getUpcomingHolidays(fromDateISO: string, limit = 5): Holiday[] {
  return HOLIDAYS_2026
    .filter((h) => h.date >= fromDateISO)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit)
}
