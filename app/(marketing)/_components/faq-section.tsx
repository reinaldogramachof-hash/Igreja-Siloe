"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: "Como funciona o Modelo de Entrada com LocalStorage?",
    answer:
      "O Modelo de Entrada armazena os dados da sua igreja diretamente no navegador do seu dispositivo (computador ou celular), através do LocalStorage. Ele é ideal para quem deseja uma solução simples, com pagamento único e sem mensalidades, funcionando inclusive sem internet.",
  },
  {
    question: "Qual a diferença entre o Modelo de Entrada e o Gestão Lite?",
    answer:
      "O Gestão Lite (R$ 69,90/mês) conta com sincronização em nuvem segura, permitindo que você acesse as informações de múltiplos aparelhos, além de suporte contínuo e gestão completa dos 4 módulos essenciais (Membros, Célula, Agenda e Financeiro).",
  },
  {
    question: "O que significa PWA e como instalo o sistema?",
    answer:
      "PWA (Progressive Web App) é uma tecnologia moderna que permite instalar o sistema como se fosse um aplicativo nativo no seu celular (Android ou iOS) ou computador, diretamente pelo navegador, sem ocupar espaço pesado de armazenamento e com abertura ultrarrápida.",
  },
  {
    question: "Os dados da minha igreja estão seguros e protegidos?",
    answer:
      "Sim. A plataforma adota rígidos padrões de segurança e privacidade. Nos planos com sincronização em nuvem, as comunicações são criptografadas e o isolamento de dados garante que nenhuma outra igreja tenha acesso às informações da sua membresia ou finanças.",
  },
  {
    question: "Como faço para tirar dúvidas ou contratar um plano?",
    answer:
      "Basta entrar em contato pelo botão de WhatsApp ou pelos e-mails disponíveis na seção de contato abaixo. Nossa equipe apresentará a plataforma e tirará todas as suas dúvidas.",
  },
]

export function FaqSection() {
  const [openIndices, setOpenIndices] = React.useState<number[]>([0])

  const toggleFaq = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-primary">
            Dúvidas Frequentes
          </h2>
          <p className="mt-2 font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Perguntas e Respostas
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Esclareça suas principais dúvidas sobre o funcionamento e a implantação da plataforma.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndices.includes(index)
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border/80"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-heading text-sm font-semibold text-foreground sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-border/60 px-5 pt-3 pb-5 animate-fade-in">
                    <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
