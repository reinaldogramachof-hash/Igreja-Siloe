import type {
  ApprovalItem,
  BookingStatus,
  Member,
  Role,
  Room,
  RoomBooking,
  Song,
  SongRequest,
  WorshipScale,
} from "@/lib/types"

export const members: Member[] = [
  {
    id: "mem-001",
    name: "Mariana Azevedo",
    email: "mariana@siloé.org.br",
    role: "admin",
    ministries: ["Secretaria", "Recepção"],
  },
  {
    id: "mem-002",
    name: "Rafael Monteiro",
    email: "rafael@siloé.org.br",
    role: "lider_louvor",
    ministries: ["Louvor", "Mídia"],
  },
  {
    id: "mem-003",
    name: "Priscila Nogueira",
    email: "priscila@siloé.org.br",
    role: "lider_salas",
    ministries: ["Salas", "Kids"],
  },
  {
    id: "mem-004",
    name: "André Luiz",
    email: "andre@siloé.org.br",
    role: "membro",
    ministries: ["Intercessão"],
  },
  {
    id: "mem-005",
    name: "Camila Rocha",
    email: "camila@siloé.org.br",
    role: "membro",
    ministries: ["Louvor"],
  },
  {
    id: "mem-006",
    name: "Tiago Martins",
    email: "tiago@siloé.org.br",
    role: "membro",
    ministries: ["Jovens"],
  },
  {
    id: "mem-007",
    name: "Beatriz Lima",
    email: "beatriz@siloé.org.br",
    role: "membro",
    ministries: ["Kids"],
  },
  {
    id: "mem-008",
    name: "Lucas Fernandes",
    email: "lucas@siloé.org.br",
    role: "membro",
    ministries: ["Diaconia"],
  },
]

export const rooms: Room[] = [
  {
    id: "room-main",
    name: "Salão Principal",
    capacity: 280,
    description: "Cultos, conferências e reuniões abertas da igreja.",
  },
  {
    id: "room-rehearsal",
    name: "Sala de Ensaio",
    capacity: 18,
    description: "Espaço com instrumentos, retorno e isolamento básico.",
  },
  {
    id: "room-kids",
    name: "Sala Kids",
    capacity: 36,
    description: "Ambiente infantil com tapetes, armários e apoio audiovisual.",
  },
  {
    id: "room-meeting",
    name: "Sala de Reuniões",
    capacity: 16,
    description: "Mesa de planejamento, TV e quadro branco.",
  },
]

export const songs: Song[] = [
  { id: "song-001", title: "Águas de Vida", artist: "Siloé Worship", key: "D", bpm: 72 },
  { id: "song-002", title: "Tua Presença Fica", artist: "Coletivo Casa", key: "G", bpm: 68 },
  {
    id: "song-003",
    title: "Cristo Reina Aqui",
    artist: "Ministério Aliança",
    key: "A",
    bpm: 78,
    referenceUrl: "https://www.youtube.com/results?search_query=Cristo+Reina+Aqui+louvor",
  },
  { id: "song-004", title: "Graça Sobre Graça", artist: "Vozes do Reino", key: "E", bpm: 64 },
  { id: "song-005", title: "Santo é o Senhor", artist: "Comunidade Viva", key: "C", bpm: 70 },
  { id: "song-006", title: "Fonte Inesgotável", artist: "Siloé Worship", key: "F", bpm: 82 },
  { id: "song-007", title: "Meu Refúgio", artist: "Nova Canção", key: "Bb", bpm: 66 },
  {
    id: "song-008",
    title: "Leva-me Mais Perto",
    artist: "Coletivo Graça",
    key: "D",
    bpm: 74,
    referenceUrl: "https://www.youtube.com/results?search_query=Leva-me+Mais+Perto+louvor",
  },
  { id: "song-009", title: "Tudo Entrego", artist: "Voz da Igreja", key: "G", bpm: 60 },
  { id: "song-010", title: "Dia de Celebração", artist: "Ministério Aliança", key: "B", bpm: 104 },
]

export const roomBookings: RoomBooking[] = [
  {
    id: "booking-001",
    roomId: "room-rehearsal",
    requestedBy: "mem-002",
    date: "2026-08-27",
    startTime: "19:30",
    endTime: "21:00",
    purpose: "Ensaio do louvor",
    status: "aprovado",
  },
  {
    id: "booking-002",
    roomId: "room-kids",
    requestedBy: "mem-007",
    date: "2026-08-30",
    startTime: "08:30",
    endTime: "11:30",
    purpose: "Classe especial do ministério infantil",
    status: "aprovado",
  },
  {
    id: "booking-003",
    roomId: "room-meeting",
    requestedBy: "mem-006",
    date: "2026-08-29",
    startTime: "17:00",
    endTime: "18:30",
    purpose: "Planejamento do encontro de jovens",
    status: "pendente",
  },
  {
    id: "booking-004",
    roomId: "room-main",
    requestedBy: "mem-002",
    date: "2026-08-30",
    startTime: "09:00",
    endTime: "11:30",
    purpose: "Culto de domingo",
    status: "aprovado",
  },
  {
    id: "booking-005",
    roomId: "room-rehearsal",
    requestedBy: "mem-002",
    date: "2026-08-26",
    startTime: "19:00",
    endTime: "21:00",
    purpose: "Ensaio da banda",
    status: "aprovado",
  },
  {
    id: "booking-006",
    roomId: "room-kids",
    requestedBy: "mem-007",
    date: "2026-08-26",
    startTime: "15:00",
    endTime: "16:30",
    purpose: "Preparação da decoração",
    status: "pendente",
  },
  {
    id: "booking-007",
    roomId: "room-main",
    requestedBy: "mem-005",
    date: "2026-08-29",
    startTime: "15:00",
    endTime: "18:00",
    purpose: "Ensaios abertos de louvor",
    status: "recusado",
  },
  {
    id: "booking-008",
    roomId: "room-meeting",
    requestedBy: "mem-001",
    date: "2026-08-24",
    startTime: "19:00",
    endTime: "20:30",
    purpose: "Reunião de líderes",
    status: "aprovado",
  },
  {
    id: "booking-009",
    roomId: "room-meeting",
    requestedBy: "mem-005",
    date: "2026-08-28",
    startTime: "14:00",
    endTime: "15:30",
    purpose: "Estudo bíblico das famílias",
    status: "pendente",
  },
]

export const songRequests: SongRequest[] = [
  {
    id: "request-001",
    songTitle: "Fonte Inesgotável",
    artist: "Siloé Worship",
    requestedBy: "mem-004",
    serviceDate: "2026-08-30",
    status: "pendente",
    note: "Combina com a mensagem sobre restauração.",
  },
  {
    id: "request-002",
    songTitle: "Dia de Celebração",
    artist: "Ministério Aliança",
    requestedBy: "mem-006",
    serviceDate: "2026-09-06",
    status: "aprovado",
    note: "Sugestão para abertura do culto.",
  },
  {
    id: "request-003",
    songTitle: "Tudo Entrego",
    requestedBy: "mem-008",
    serviceDate: "2026-08-30",
    status: "recusado",
    note: "Ficou fora do tema desta semana.",
  },
  {
    id: "request-004",
    songTitle: "Leva-me Mais Perto",
    artist: "Coletivo Graça",
    requestedBy: "mem-005",
    serviceDate: "2026-08-30",
    status: "pendente",
    note: "Ideal para o momento de comunhão.",
  },
  {
    id: "request-005",
    songTitle: "Meu Refúgio",
    artist: "Nova Canção",
    requestedBy: "mem-007",
    serviceDate: "2026-08-30",
    status: "pendente",
    note: "Pode ser tocada no encerramento.",
  },
]

export const worshipScale: WorshipScale = {
  id: "scale-001",
  name: "Culto de Domingo",
  date: "2026-08-30",
  time: "09:30",
  entries: [
    { memberId: "mem-002", role: "vocal" },
    { memberId: "mem-005", role: "vocal" },
    { memberId: "mem-004", role: "violão" },
    { memberId: "mem-008", role: "teclado" },
  ],
  songIds: ["song-001", "song-002", "song-005", "song-007"],
}

export const events = [
  { id: "evt-001", title: "Culto de Domingo", date: "30 ago", time: "09:30", room: "Salão Principal" },
  { id: "evt-002", title: "Ensaio de Louvor", date: "27 ago", time: "19:30", room: "Sala de Ensaio" },
  { id: "evt-003", title: "Reunião de Líderes", date: "29 ago", time: "17:00", room: "Sala de Reuniões" },
]

export const notices = [
  {
    id: "notice-001",
    title: "Santa Ceia neste domingo",
    description: "Chegue 20 minutos antes para organização das equipes.",
  },
  {
    id: "notice-002",
    title: "Cadastro de voluntários",
    description: "Novas turmas de recepção e kids serão organizadas nesta semana.",
  },
  {
    id: "notice-003",
    title: "Atualização da escala",
    description: "Líderes devem revisar disponibilidade até sexta-feira.",
  },
]

export const demoUsersByRole: Record<Role, Member> = {
  admin: members[0],
  lider_louvor: members[1],
  lider_salas: members[2],
  membro: members[4],
}

export function getRoleLabel(role: Role) {
  const labels: Record<Role, string> = {
    admin: "Admin",
    lider_louvor: "Líder de Louvor",
    lider_salas: "Líder de Salas",
    membro: "Membro",
  }

  return labels[role]
}

export function getStatusLabel(status: BookingStatus) {
  const labels: Record<BookingStatus, string> = {
    pendente: "Pendente",
    aprovado: "Aprovado",
    recusado: "Recusado",
  }

  return labels[status]
}

export function getMemberById(memberId: Member["id"]) {
  return members.find((member) => member.id === memberId) ?? members[0]
}

export function getRoomById(roomId: Room["id"]) {
  return rooms.find((room) => room.id === roomId) ?? rooms[0]
}

export function buildApprovalItems(
  bookings: RoomBooking[] = roomBookings,
  requests: SongRequest[] = songRequests
): ApprovalItem[] {
  const roomItems = bookings.map((booking) => {
    const room = getRoomById(booking.roomId)
    const requester = getMemberById(booking.requestedBy)

    return {
      id: booking.id,
      type: "room" as const,
      title: room.name,
      description: booking.purpose,
      requestedBy: requester,
      requestedAt: "Hoje",
      scheduledFor: `${booking.date} · ${booking.startTime}-${booking.endTime}`,
      status: booking.status,
      meta: `${room.capacity} pessoas`,
    }
  })

  const songItems = requests.map((request) => {
    const requester = getMemberById(request.requestedBy)

    return {
      id: request.id,
      type: "song" as const,
      title: request.songTitle,
      description: request.note ?? "Sugestão enviada para avaliação do líder.",
      requestedBy: requester,
      requestedAt: "Esta semana",
      scheduledFor: request.serviceDate,
      status: request.status,
      meta: "Repertório",
    }
  })

  return [...roomItems, ...songItems]
}
