import * as React from "react"
import {
  Users,
  Layers,
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
    title: "Gestão de Membros & Famílias",
    subtitle: "Cuidado pastoral estruturado e centralizado",
    description:
      "Mantenha o cadastro da sua membresia completo e sempre acessível. Acompanhe aniversariantes do mês, datas de batismo e dados familiares com facilidade.",
    features: [
      "Cadastro com foto e dados de contato",
      "Controle de aniversariantes e notificações",
      "Histórico de batismos e integração",
      "Busca rápida e filtros personalizados",
    ],
  },
  {
    icon: Layers,
    title: "Células & Pequenos Grupos",
    subtitle: "Supervisão e acompanhamento do crescimento",
    description:
      "Acompanhe a dinâmica dos pequenos grupos, reuniões nos lares, líderes responsáveis e novos participantes que chegam à sua igreja.",
    features: [
      "Mapeamento de células e líderes",
      "Controle de presença e novos visitantes",
      "Acompanhamento de relatórios de encontro",
      "Visão consolidada para os supervisores",
    ],
  },
  {
    icon: CalendarDays,
    title: "Agenda & Calendário Ministerial",
    subtitle: "Planejamento claro para toda a igreja",
    description:
      "Organize cultos, conferências, ensaios e reuniões de liderança em uma agenda única para evitar conflitos de datas e sobrecarga de voluntários.",
    features: [
      "Calendário de cultos e eventos especiais",
      "Escalas ministeriais (louvor, recepção, etc.)",
      "Visão mensal e semanal simplificada",
      "Acesso rápido em qualquer dispositivo",
    ],
  },
  {
    icon: Megaphone,
    title: "Mural de Avisos & Comunicados",
    subtitle: "Comunicação assertiva para o ministério",
    description:
      "Publique avisos internos, orientações para lideranças e informações importantes diretamente no painel ministerial com clareza e agilidade.",
    features: [
      "Mural de recados e orientações",
      "Segmentação para equipes e líderes",
      "Fixação de comunicados prioritários",
      "Histórico de avisos arquivados",
    ],
  },
  {
    icon: Wallet,
    title: "Gestão Financeira & Dízimos",
    subtitle: "Prestação de contas transparente e rigorosa",
    description:
      "Controle entradas de dízimos e ofertas, despesas ministeriais e emissão de relatórios claros para a diretoria e conselho fiscal.",
    features: [
      "Lançamento rápido de dízimos e ofertas",
      "Classificação por categorias de despesas",
      "Relatórios de conciliação por período",
      "Prestação de contas sem planilhas confusas",
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
            Módulos Integrados
          </h2>
          <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Tudo o que sua igreja precisa em um único lugar
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Desenvolvido para simplificar a administração e dar mais tempo para o que realmente importa: o cuidado pastoral e a comunhão.
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
