export interface PlanFeature {
  text: string
  included: boolean
}

export interface Plan {
  id: string
  name: string
  subtitle: string
  price: string
  period: string
  badge?: string
  isPopular?: boolean
  description: string
  features: PlanFeature[]
  ctaText: string
  ctaHref: string
}

/**
 * Planos comerciais do produto (NEG-01 / OT-TAREFA-002).
 * ATENÇÃO: Valores não definidos devem manter rigorosamente o literal "[EM DEFINIÇÃO]".
 * Nunca inventar ou estimar valores não homologados por Reinaldo.
 */
export const commercialPlans: Plan[] = [
  {
    id: "entrada",
    name: "Modelo de Entrada",
    subtitle: "Armazenamento local e pagamento único",
    price: "R$ 399,90",
    period: "pagamento único / vitalício",
    description: "Ideal para congregações que precisam de organização imediata sem mensalidades.",
    features: [
      { text: "Armazenamento local no dispositivo (LocalStorage)", included: true },
      { text: "Cadastro e listagem de membros", included: true },
      { text: "Agenda e avisos locais", included: true },
      { text: "Funcionamento offline garantido", included: true },
      { text: "Sem mensalidades ou taxas recorrentes", included: true },
      { text: "Sincronização em nuvem / Multi-dispositivos", included: false },
      { text: "Acesso multi-usuário com permissões", included: false },
    ],
    ctaText: "Começar com Entrada",
    ctaHref: "#contato",
  },
  {
    id: "lite",
    name: "Gestão Lite",
    subtitle: "Para igrejas que desejam o essencial em nuvem",
    price: "R$ 69,90",
    period: "/mês",
    badge: "Destaque",
    isPopular: true,
    description: "Tudo o que sua igreja precisa para gerenciar a rotina com sincronização e segurança.",
    features: [
      { text: "Gestão de 1 Célula / Pequeno Grupo", included: true },
      { text: "Cadastro completo de membros da congregação", included: true },
      { text: "Agenda ministerial e eventos", included: true },
      { text: "Quadro de avisos e comunicados", included: true },
      { text: "Controle financeiro essencial (entradas e saídas)", included: true },
      { text: "Sincronização segura em nuvem", included: true },
      { text: "Múltiplas congregações / filiais", included: false },
    ],
    ctaText: "Escolher Gestão Lite",
    ctaHref: "#contato",
  },
  {
    id: "online-essencial",
    name: "Gestão Online — Essencial",
    subtitle: "Para igrejas estruturadas em múltiplos ministérios",
    price: "[EM DEFINIÇÃO]",
    period: "/mês",
    description: "Flexibilidade e capacidade expandida para liderança compartilhada e múltiplas células.",
    features: [
      { text: "Múltiplas células e redes ministeriais", included: true },
      { text: "Gestão de membros e núcleos familiares", included: true },
      { text: "Controle financeiro por categorias e centros de custo", included: true },
      { text: "Multi-operadores com controle de acesso", included: true },
      { text: "Relatórios de frequência e movimentação", included: true },
      { text: "Sincronização em nuvem e backup", included: true },
      { text: "Consultoria de implantação dedicada", included: false },
    ],
    ctaText: "Consultar Disponibilidade",
    ctaHref: "#contato",
  },
  {
    id: "online-premium",
    name: "Gestão Online — Premium",
    subtitle: "Estrutura completa para grandes ministérios e redes",
    price: "[EM DEFINIÇÃO]",
    period: "/mês",
    description: "A solução definitiva com recursos avançados, suporte prioritário e capacidade total.",
    features: [
      { text: "Células, ministérios e departamentos ilimitados", included: true },
      { text: "Gestão integrada de sede e filiais", included: true },
      { text: "Relatórios gerenciais e conciliação financeira avançada", included: true },
      { text: "Multi-usuários com níveis detalhados de permissão", included: true },
      { text: "Exportação de dados e auditoria completa", included: true },
      { text: "Backup contínuo e infraestrutura dedicada", included: true },
      { text: "Suporte e acompanhamento prioritário", included: true },
    ],
    ctaText: "Falar com Consultor",
    ctaHref: "#contato",
  },
]
