import * as React from "react"
import { MessageSquare, Mail, Headset, ArrowUpRight } from "lucide-react"
import { brand } from "@/lib/brand"

export function CtaSection() {
  const isWhatsappDefined = brand.whatsappHref !== "[EM DEFINICAO]" && brand.whatsappHref !== "[EM DEFINIÇÃO]"
  const isEmailDefined = brand.contactEmail !== "[EM DEFINICAO]" && brand.contactEmail !== "[EM DEFINIÇÃO]"

  return (
    <section id="contato" className="py-16 md:py-24 bg-card/40 border-t border-border/60">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-8 sm:p-12 shadow-xl text-center">
          {/* Subtle Glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            aria-hidden="true"
          />

          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Pronto para transformar a gestão da sua igreja?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Converse com nossa equipe, tire dúvidas sobre implantação e escolha o plano perfeito para a sua comunidade.
          </p>

          {/* Contact Cards Grid */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {/* WhatsApp Contact */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                  <MessageSquare className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    Atendimento Comercial
                  </h3>
                  <p className="text-xs text-muted-foreground">WhatsApp & Demonstração</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60">
                {isWhatsappDefined ? (
                  <a
                    href={brand.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>Falar no WhatsApp</span>
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="font-mono text-xs text-muted-foreground">
                    {brand.whatsappHref}
                  </span>
                )}
              </div>
            </div>

            {/* Email Contact */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    Contato por E-mail
                  </h3>
                  <p className="text-xs text-muted-foreground">Propostas e informações</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60">
                {isEmailDefined ? (
                  <a
                    href={`mailto:${brand.contactEmail}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>{brand.contactEmail}</span>
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <span className="font-mono text-xs text-muted-foreground">
                    {brand.contactEmail}
                  </span>
                )}
              </div>
            </div>

            {/* Support Contact */}
            <div className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Headset className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-foreground">
                    Suporte Técnico
                  </h3>
                  <p className="text-xs text-muted-foreground">Para clientes e usuários</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60">
                <span className="font-mono text-xs text-muted-foreground">
                  {brand.supportEmail}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
