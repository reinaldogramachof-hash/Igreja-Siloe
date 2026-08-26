export type Role = "admin" | "lider_louvor" | "lider_salas" | "membro"

export type BookingStatus = "pendente" | "aprovado" | "recusado"

export type Member = {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: Role
  ministries: string[]
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
