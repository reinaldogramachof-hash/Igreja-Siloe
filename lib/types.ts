export type Role = "admin" | "lider_louvor" | "lider_salas" | "tesoureiro" | "secretaria" | "membro"

export type BookingStatus = "pendente" | "aprovado" | "recusado"

export type FinancialTransactionType = "receita" | "despesa"

export type FinancialCategory =
  | "Dízimos"
  | "Ofertas Gerais"
  | "Oferta de Missões"
  | "Oferta de Construção"
  | "Eventos / Inscrições"
  | "Manutenção & Reformas"
  | "Energia / Água / Telecom"
  | "Aluguel & Taxas"
  | "Preletor / Abono Pastoral"
  | "Ação Social / Cestas"
  | "Equipamentos / Som"
  | "Material de Escritório / Limpeza"

export type FinancialAccount = "Conta Corrente Itaú" | "Caixa Físico (Tesouraria)" | "Chave PIX Oficial"

export type FinancialTransaction = {
  id: string
  type: FinancialTransactionType
  category: FinancialCategory
  description: string
  amount: number
  date: string
  account: FinancialAccount
  paymentMethod: "PIX" | "Dinheiro" | "Transferência" | "Cartão" | "Boleto"
  status: "confirmado" | "pendente" | "cancelado"
  memberId?: string
  memberName?: string
  receiptUrl?: string
  notes?: string
}

export type CultoOfferingSummary = {
  id: string
  date: string
  serviceName: string
  dizimosAmount: number
  ofertasAmount: number
  ofertaMissoesAmount: number
  totalAmount: number
  status: "fechado" | "em_aberto"
  responsible: string
}

export type MemberStatus = "ativo" | "inativo" | "em_observacao" | "transferido"
export type MemberCategory = "membro" | "congregado" | "visitante" | "pastor" | "diacono" | "presbitero" | "lider"

export type GrowthStep = {
  id: string
  title: string
  completed: boolean
  completedAt?: string
}

export type Member = {
  id: string
  name: string
  email: string
  phone?: string
  avatarUrl?: string
  role: Role
  status: MemberStatus
  category: MemberCategory
  ministries: string[]
  birthDate?: string
  baptismDate?: string
  maritalStatus?: "solteiro" | "casado" | "divorciado" | "viuvo"
  growthSteps?: GrowthStep[]
  notes?: string
}

export type SocialAssistanceType = "cesta_basica" | "auxilio_financeiro" | "doacao_roupas" | "apoio_psicologico" | "vale_gas"

export type SocialFamily = {
  id: string
  headName: string
  dependentsCount: number
  phone: string
  address: string
  status: "em_acompanhamento" | "atendido" | "suspenso"
  assistanceType: SocialAssistanceType
  registeredAt: string
  notes?: string
}

export type SocialDistribution = {
  id: string
  familyId: string
  familyName: string
  item: string
  quantity: number
  deliveredAt: string
  deliveredBy: string
}

export type PastoralVisit = {
  id: string
  memberName: string
  visitDate: string
  pastorName: string
  purpose: "Enfermidade / Hospital" | "Luto & Consolo" | "Aconselhamento Matrimonial" | "Oração no Lar" | "Boas-vindas"
  status: "agendado" | "realizado" | "retorno_pendente"
  notes?: string
  privacy: "confidencial" | "equipe_pastoral"
}

export type Room = {
  id: string
  name: string
  capacity: number
  description: string
}

export type RoomBooking = {
  id: string
  roomId: string
  requestedBy: Member["id"]
  date: string
  startTime: string
  endTime: string
  purpose: string
  status: BookingStatus
}

export type Song = {
  id: string
  title: string
  artist: string
  key: string
  bpm: number
  referenceUrl?: string
}

export type SongRequest = {
  id: string
  songTitle: string
  artist?: string
  requestedBy: Member["id"]
  serviceDate: string
  status: BookingStatus
  note?: string
}

export type WorshipRole =
  | "vocal"
  | "violão"
  | "teclado"
  | "baixo"
  | "bateria"
  | "guitarra"

export type WorshipScaleEntry = {
  memberId: Member["id"]
  role: WorshipRole
}

export type WorshipScale = {
  id: string
  name: string
  date: string
  time: string
  entries: WorshipScaleEntry[]
  songIds: Song["id"][]
}

export type ApprovalItemType = "room" | "song"

export type ApprovalItem = {
  id: string
  type: ApprovalItemType
  title: string
  description: string
  requestedBy: Member
  requestedAt: string
  scheduledFor: string
  status: BookingStatus
  meta: string
}
