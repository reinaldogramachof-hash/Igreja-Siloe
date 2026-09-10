import * as React from "react"
import {
  Smartphone,
  ShieldCheck,
  WifiOff,
  Smile,
} from "lucide-react"

export function DifferentialsSection() {
  const differentials = [
    {
      icon: Smile,
      title: "Fácil como usar o WhatsApp",
      description:
        "Telas limpas e botões grandes. Toda a equipe e os voluntários aprendem a usar em poucos minutos, sem complicação.",
    },
    {
      icon: WifiOff,
      title: "Funciona mesmo sem internet",
      description:
        "No Modelo de Entrada, seus registros ficam salvos com segurança no seu computador ou celular, sem depender de sinal no templo.",
    },
    {
      icon: Smartphone,
      title: "Leve no celular ou computador",
      description:
        "Abre na hora pelo navegador e pode ser adicionado à tela inicial em 1 clique, sem precisar baixar aplicativos pesados.",
    },
    {
      icon: ShieldCheck,
      title: "Dados seguros e protegidos",
      description:
        "As informações dos seus membros e dízimos pertencem apenas à sua igreja, com total privacidade e sem riscos de perda.",
    },
  ]

  return (
    <section id="diferenciais" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-primary">
            Feito para o seu dia a dia
          </h2>
          <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Simplicidade real para quem cuida da igreja
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Chega de cadernos com anotações perdidas, planilhas manuais e sistemas complicados que ninguém consegue usar.
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
