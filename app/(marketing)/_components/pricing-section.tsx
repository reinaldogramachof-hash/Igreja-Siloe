import * as React from "react"
import { Check, Minus, MessageCircle, ArrowRight } from "lucide-react"
import { commercialPlans } from "@/lib/plans"

export function PricingSection() {
  return (
    <section id="planos" className="py-16 md:py-24 bg-card/40 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-primary">
            Investimento Claro e Acessível
          </h2>
          <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Planos simples que cabem na realidade da sua igreja
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Sem fidelidade forçada, sem termos confusos e sem taxas escondidas. Escolha a opção ideal para a sua comunidade.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
          {commercialPlans.map((plan) => {
            const isUndefinedPrice = plan.price === "[EM DEFINIÇÃO]"

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col justify-between rounded-2xl border bg-card p-6 shadow-sm transition-all ${
                  plan.isPopular
                    ? "border-primary ring-2 ring-primary/20 shadow-md md:-translate-y-1"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground shadow-sm">
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Plan Name & Subtitle */}
                  <div className="min-h-[64px]">
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      {plan.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {plan.subtitle}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="mt-4 border-y border-border/60 py-4 min-h-[92px] flex flex-col justify-center">
                    {isUndefinedPrice ? (
                      <div>
                        <span className="inline-block rounded bg-muted px-2.5 py-1 font-mono text-sm font-bold text-muted-foreground">
                          {plan.price}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          Em homologação ({plan.period})
                        </span>
                      </div>
                    ) : plan.id === "entrada" ? (
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                            {plan.price}
                          </span>
                        </div>
                        <span className="mt-0.5 block text-xs font-medium text-primary">
                          Pagamento único • Acesso vitalício
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
                          {plan.price}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {plan.period}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Short Description */}
                  <p className="mt-4 text-xs leading-relaxed text-muted-foreground min-h-[48px]">
                    {plan.description}
                  </p>

                  {/* Features List */}
                  <div className="mt-6 space-y-2.5 border-t border-border/60 pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      O que está incluso:
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feat) => (
                        <li
                          key={feat.text}
                          className={`flex items-start gap-2 text-xs ${
                            feat.included
                              ? "text-foreground/90 font-medium"
                              : "text-muted-foreground/60 line-through"
                          }`}
                        >
                          {feat.included ? (
                            <Check
                              className="size-3.5 shrink-0 text-primary mt-0.5"
                              aria-hidden="true"
                            />
                          ) : (
                            <Minus
                              className="size-3.5 shrink-0 text-muted-foreground/40 mt-0.5"
                              aria-hidden="true"
                            />
                          )}
                          <span>{feat.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Plan Action CTA */}
                <div className="mt-8 pt-4 border-t border-border/60">
                  <a
                    href={plan.ctaHref}
                    className={`inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                      plan.isPopular
                        ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                        : "border border-border bg-card text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Clarification Note */}
        <div className="mt-10 rounded-xl border border-border bg-card p-4 text-center sm:p-5">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs text-muted-foreground">
            <MessageCircle className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Tem dúvidas sobre qual plano atende melhor o momento da sua congregação? Fale com a nossa equipe pelo WhatsApp.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
