import { BookOpenText, HeartHandshake, Home, MapPin, MessageCircle, Sparkles, UsersRound } from "lucide-react"

export const whatsappHref =
  "https://wa.me/?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Igreja%20Silo%C3%A9%20e%20gostaria%20de%20falar%20com%20voc%C3%AAs."

export const instagramHref = "https://www.instagram.com/siloe.igreja"

export const siteNavItems = [
  { href: "#sobre", label: "Sobre" },
  { href: "#ministerios", label: "Ministérios" },
  { href: "#cultos", label: "Cultos" },
  { href: "#primeira-vez", label: "Primeira vez" },
  { href: "#contato", label: "Contato" },
]

export const ministries = [
  {
    title: "Casas de Vida",
    description:
      "Grupos pequenos para caminhar de perto, compartilhar a Palavra e construir vínculos durante a semana.",
    details: ["Quartas, 19h30", "Centro: Pr. Francisco & Pra. Cida", "Jd. Primavera: Pra. Alice"],
    icon: Home,
  },
  {
    title: "Anexo 01",
    description:
      "Ministério de cuidado pessoal e acompanhamento familiar para quem precisa de escuta, orientação e apoio pastoral.",
    details: ["Acolhimento", "Cuidado familiar", "Acompanhamento intencional"],
    icon: HeartHandshake,
  },
  {
    title: "Culto de Cura e Libertação",
    description:
      "Um encontro de oração, fé e restauração para famílias e visitantes que buscam cuidado espiritual.",
    details: ["Sextas, 19h30", "Rua das Prímulas, 171", "Aberto para visitantes"],
    icon: Sparkles,
  },
]

export const services = [
  {
    title: "Domingos",
    label: "Celebração",
    time: "Manhã e noite",
    location: "Central",
    address: "Rua Rui Barbosa, 200, Centro, Jacareí",
    highlight: "Culto Especial",
  },
  {
    title: "Quartas",
    label: "Ensino",
    time: "19h30",
    location: "Central",
    address: "Rua Rui Barbosa, 200, Centro, Jacareí",
  },
]

export const firstVisitSteps = [
  {
    title: "Chegue como você está",
    description: "Nossa equipe ajuda você a encontrar lugar, entender a programação e se sentir em casa.",
    icon: UsersRound,
  },
  {
    title: "Conheça a família",
    description: "Depois do culto, fale conosco para descobrir Casas de Vida, ministérios e próximos encontros.",
    icon: MessageCircle,
  },
  {
    title: "Caminhe no seu tempo",
    description: "A Siloé é um lugar para pertencer, servir e crescer com cuidado pastoral.",
    icon: BookOpenText,
  },
]

export const churchAddresses = [
  { label: "Templo Central", value: "Rua Rui Barbosa, 200, Centro, Jacareí", note: "Cultos de Domingo e Quarta", icon: MapPin },
  { label: "Cura e Libertação", value: "Rua das Prímulas, 171, Jacareí", note: "Sextas às 19h30", icon: Sparkles },
]

export const contactItems = churchAddresses
