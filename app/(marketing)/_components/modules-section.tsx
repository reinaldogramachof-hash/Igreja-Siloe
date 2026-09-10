import * as React from "react"
import {
  Users,
  Home,
  CalendarDays,
  Megaphone,
  Wallet,
  Check,
} from "lucide-react"

interface ModuleItem {
  icon: React.ElementType
  title: string
  subtitle: string
  description: string
  features: string[]
}

const modules: ModuleItem[] = [
  {
    icon: Users,
    title: "Cuidado Pastoral & Membresia",
    subtitle: "Acompanhamento pessoal e familiar",
    description:
      "Mantenha o cadastro da sua congregação completo e com carinho. Acompanhe aniversariantes do mês, datas de batismo e o histórico dos membros da sua comunidade.",
    features: [
      "Cadastro com foto, dados de contato e família",
      "Lembrete de aniversariantes para parabenizar",
      "Histórico de batismos e integração",
      "Busca rápida e fichas organizadas",
    ],
  },
  {
    icon: Home,
    title: "Pequenos Grupos & Células",
    subtitle: "Comunhão e acompanhamento nos lares",
    description:
      "Acompanhe a vida dos pequenos grupos, líderes responsáveis, frequência dos encontros e o acolhimento com amor aos novos visitantes.",
    features: [
      "Cadastro de células e líderes nos lares",
      "Presença nos encontros e novos visitantes",
      "Relatórios simples para os supervisores",
      "Visão do crescimento e comunhão",
    ],
  },
  {
    icon: CalendarDays,
    title: "Agenda de Cultos & Escalas",
    subtitle: "Planejamento claro para voluntários",
    description:
      "Organize cultos, conferências, ensaios e reuniões de liderança sem conflito de datas e sem sobrecarregar seus voluntários.",
    features: [
      "Calendário de cultos e eventos especiais",
      "Escalas de ministérios (louvor, recepção, etc.)",
      "Visão mensal e semanal fácil de entender",
      "Acesso rápido direto no celular",
    ],
  },
  {
    icon: Megaphone,
    title: "Mural de Avisos & Comunicados",
    subtitle: "Comunicação assertiva para o ministério",
    description:
      "Divulgue recados internos, orientações para lideranças e informações importantes diretamente no painel da igreja com rapidez.",
    features: [
      "Mural de recados e orientações ministeriais",
      "Avisos direcionados para líderes e equipes",
      "Fixação de comunicados importantes",
      "Acesso simples para toda a liderança",
    ],
  },
  {
    icon: Wallet,
    title: "Tesouraria & Finanças com Transparência",
    subtitle: "Prestação de contas com retidão",
    description:
      "Lançamento simples de dízimos, ofertas e despesas da igreja, gerando relatórios claros para a diretoria, conselho fiscal e assembleia.",
    features: [
      "Lançamento rápido de dízimos e ofertas",
      "Separação por categorias de despesas",
      "Prestação de contas mensal sem complicação",
      "Elimine planilhas confusas e anotações soltas",
    ],
  },
]

export function ModulesSection() {
  return (
    <section id="modulos" className="py-16 md:py-24 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-primary">
            Pensado para a vida real da igreja
          </h2>
          <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Organização simples para cada área do seu ministério
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Ferramentas práticas para apoiar pastores, secretárias, líderes de células e tesoureiros no cuidado diário da membresia.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod, index) => {
            const Icon = mod.icon
            return (
              <div
                key={mod.title}
                className={`flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md ${
                  index === 4 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div>
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                    {mod.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-primary">
                    {mod.subtitle}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <ul className="space-y-2">
                    {mod.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-xs text-foreground/80">
                        <Check className="size-3.5 shrink-0 text-primary mt-0.5" aria-hidden="true" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
