import * as React from "react"
import {
  Smartphone,
  Lock,
  WifiOff,
  Zap,
} from "lucide-react"

export function DifferentialsSection() {
  const differentials = [
    {
      icon: Smartphone,
      title: "Aplicativo PWA Leve & Ágil",
      description:
        "Instale direto no celular ou computador sem lojas de aplicativos pesadas. Abre em segundos e não sobrecarrega a memória do aparelho.",
    },
    {
      icon: WifiOff,
      title: "Pronto para Uso Offline",
      description:
        "No Modelo de Entrada com LocalStorage, seus dados funcionam localmente no dispositivo sem necessidade constante de conexão à internet.",
    },
    {
      icon: Zap,
      title: "Interface Intuitiva",
      description:
        "Projetado para pastores, secretárias e voluntários. Sem telas confusas ou dezenas de menus desnecessários.",
    },
    {
      icon: Lock,
      title: "Privacidade e Segurança",
      description:
        "Controle rigoroso de permissões e privacidade dos dados da congregação, seguindo os mais altos padrões de proteção.",
    },
  ]

  return (
    <section id="diferenciais" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-primary">
            Por que Escolher a Plataforma
          </h2>
          <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Tecnologia moderna focada na realidade da igreja
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Elimine planilhas manuais, anotações perdidas em cadernos e ferramentas complicadas que ninguém usa.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {differentials.map((diff) => {
            const Icon = diff.icon
            return (
              <div
                key={diff.title}
                className="flex flex-col items-center text-center rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:-translate-y-0.5"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 font-heading text-base font-bold text-foreground">
                  {diff.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {diff.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
