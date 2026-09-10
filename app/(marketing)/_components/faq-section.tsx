"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    question: "Nossa secretária ou liderança não entendem muito de tecnologia. É difícil de usar?",
    answer:
      "De forma alguma. Desenvolvemos o sistema pensando exatamente em quem não tem tempo a perder com telas difíceis. Os botões são claros, as opções são diretas e a linguagem é simples. Se você sabe usar o WhatsApp, conseguirá organizar a sua igreja com facilidade.",
  },
  {
    question: "E se o nosso templo não tiver sinal de internet ou Wi-Fi?",
    answer:
      "No Modelo de Entrada (R$ 399,90 pagamento único), o sistema funciona 100% no seu aparelho (computador ou celular). Todos os cadastros e registros ficam gravados localmente no seu dispositivo, funcionando perfeitamente mesmo sem internet.",
  },
  {
    question: "Os dados dos membros e as finanças da igreja estão seguros?",
    answer:
      "Sim, com total sigilo e respeito. Os dados pertencem exclusivamente à sua igreja. No modelo local, ficam no seu aparelho; nos planos online, ficam guardados em servidores seguros, protegidos com criptografia e com rotina de backup para você nunca perder nada.",
  },
  {
    question: "Qual a diferença entre o pagamento único de R$ 399,90 e os planos mensais?",
    answer:
      "O Modelo de Entrada (R$ 399,90) é pago uma única vez e não possui nenhuma mensalidade, funcionando no seu aparelho. Já os planos mensais (a partir de R$ 69,90/mês) contam com sincronização em nuvem, permitindo que pastor, secretária e líderes acessem juntos de celulares e computadores diferentes.",
  },
  {
    question: "Preciso baixar aplicativo pesado nas lojas do celular?",
    answer:
      "Não precisa ocupar a memória do seu telefone. O sistema abre direto pelo navegador e, se você quiser, basta clicar em 'Adicionar à tela de início' para ter o ícone no seu celular ou computador, abrindo em 1 segundo.",
  },
  {
    question: "Como faço para tirar dúvidas ou começar na minha comunidade?",
    answer:
      "Basta nos enviar uma mensagem no WhatsApp pelo botão abaixo. Nossa equipe terá a maior alegria em te atender, mostrar o sistema na prática e tirar todas as dúvidas da sua liderança.",
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
            Perguntas comuns de pastores e secretárias
          </p>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Respostas claras e sem termos técnicos sobre o funcionamento e o dia a dia da plataforma.
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
