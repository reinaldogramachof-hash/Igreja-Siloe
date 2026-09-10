import * as React from "react"
import { Church } from "lucide-react"
import { brand } from "@/lib/brand"

export function Footer() {
  const currentYear = 2026

  return (
    <footer className="border-t border-border bg-background py-12 text-sm text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Church className="size-4" aria-hidden="true" />
              </div>
              <span className="font-heading text-base font-bold text-foreground">
                {brand.name}
              </span>
            </div>
            <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
              {brand.description}
            </p>
            <p className="mt-2 text-xs font-medium text-foreground/80">
              {brand.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Navegação
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a href="#modulos" className="transition-colors hover:text-foreground">
                  Módulos do Sistema
                </a>
              </li>
              <li>
                <a href="#diferenciais" className="transition-colors hover:text-foreground">
                  Diferenciais & PWA
                </a>
              </li>
              <li>
                <a href="#planos" className="transition-colors hover:text-foreground">
                  Planos e Preços
                </a>
              </li>
              <li>
                <a href="#faq" className="transition-colors hover:text-foreground">
                  Perguntas Frequentes
                </a>
              </li>
            </ul>
          </div>

          {/* Product & Legal */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Contato & Suporte
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <span className="text-muted-foreground">Comercial: </span>
                <span className="font-mono">{brand.contactEmail}</span>
              </li>
              <li>
                <span className="text-muted-foreground">Suporte: </span>
                <span className="font-mono">{brand.supportEmail}</span>
              </li>
              <li>
                <a href="#contato" className="transition-colors hover:text-foreground">
                  Falar com Consultor
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row text-xs">
          <p>
            © {currentYear} {brand.name}. Todos os direitos reservados.
          </p>
          <p className="text-muted-foreground/80">
            Plataforma SaaS de Gestão Ministerial
          </p>
        </div>
      </div>
    </footer>
  )
}
