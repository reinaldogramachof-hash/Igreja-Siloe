"use client"

import { useMemo, useState } from "react"
import {
  ExternalLink,
  Gauge,
  KeyRound,
  Music2,
  Plus,
  Search,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"
import { ApprovalFlowCard } from "@/components/shared/approval-flow-card"
import { StatusBadge } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  buildApprovalItems,
  getMemberById,
  songRequests as mockSongRequests,
  songs as mockSongs,
  worshipScale as mockWorshipScale,
} from "@/lib/mock-data"
import type { BookingStatus, Song, SongRequest, WorshipScale } from "@/lib/types"
import { useDemoUser } from "@/lib/prototype-auth"
import { cn } from "@/lib/utils"
import { formatShortDate, getNextSunday, reanchorServiceDate, toISODate } from "@/lib/date-utils"

const todayISO = toISODate(new Date())

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
}

function buildSongItems(list: SongRequest[]) {
  return buildApprovalItems([], list).map((item) => {
    const request = list.find((r) => r.id === item.id)
    const artistPart = request?.artist ? ` · ${request.artist}` : ""
    return {
      ...item,
      description: `${item.description}${artistPart}`,
      scheduledFor: request ? formatShortDate(request.serviceDate) : item.scheduledFor,
    }
  })
}

export default function LouvorPage() {
  const { role, user } = useDemoUser()
  const isLeader = role === "lider_louvor" || role === "admin"

  const [songs, setSongs] = useState<Song[]>(mockSongs)
  const [requests, setRequests] = useState<SongRequest[]>(() =>
    mockSongRequests.map((request) => ({
      ...request,
      serviceDate: reanchorServiceDate(request.serviceDate),
    }))
  )
  const [scale, setScale] = useState<WorshipScale>({ ...mockWorshipScale, date: getNextSunday() })
  const [query, setQuery] = useState("")

  const [open, setOpen] = useState(false)
  const [songTitle, setSongTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [serviceDate, setServiceDate] = useState(getNextSunday())
  const [note, setNote] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  const filteredSongs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return songs
    return songs.filter(
      (song) =>
        song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q)
    )
  }, [songs, query])

  const scaleSongs = scale.songIds
    .map((id) => songs.find((song) => song.id === id))
    .filter((song): song is Song => Boolean(song))

  const scaleMembers = scale.entries.map((entry) => ({
    member: getMemberById(entry.memberId),
    role: entry.role,
  }))

  const leaderItems = useMemo(
    () => buildSongItems(requests.filter((request) => request.status === "pendente")),
    [requests]
  )

  const myItems = useMemo(
    () => buildSongItems(requests.filter((request) => request.requestedBy === user.id)),
    [requests, user.id]
  )

  function resetForm() {
    setSongTitle("")
    setArtist("")
    setServiceDate(getNextSunday())
    setNote("")
    setFormError(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!songTitle.trim()) {
      setFormError("Informe o nome da música.")
      return
    }

    const request: SongRequest = {
      id: `request-${Date.now()}`,
      songTitle: songTitle.trim(),
      artist: artist.trim() || undefined,
      requestedBy: user.id,
      serviceDate,
      status: "pendente",
      note: note.trim() || undefined,
    }

    setRequests((current) => [request, ...current])
    toast.success("Sugestão de música enviada para o líder")
    resetForm()
    setOpen(false)
  }

  function handleStatusChange(id: string, status: BookingStatus) {
    const request = requests.find((item) => item.id === id)
    if (!request) return

    setRequests((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item))
    )

    if (status === "aprovado") {
      const newSong: Song = {
        id: `song-${Date.now()}`,
        title: request.songTitle,
        artist: request.artist ?? "Sugestão aprovada",
        key: "C",
        bpm: 72,
      }
      setSongs((current) => [newSong, ...current])
      setScale((current) => ({ ...current, songIds: [...current.songIds, newSong.id] }))
      toast.success(`“${request.songTitle}” aprovada e adicionada ao repertório`)
    } else {
      toast.error(`Sugestão “${request.songTitle}” recusada`)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent">Ministério de Louvor</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">Escala de Louvor e Músicas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Repertório, escala do próximo culto e sugestões da igreja.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Sugerir música para o culto
        </Button>
      </div>

      {/* Escala da semana */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              {scale.name}
            </CardTitle>
            <CardDescription>
              {formatShortDate(scale.date)} · {scale.time}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Escalados
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {scaleMembers.map(({ member, role: worshipRole }) => {
                const isYou = member.id === user.id
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-2.5",
                      isYou ? "border-accent/50 bg-accent-soft/60" : "bg-muted/30"
                    )}
                  >
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {member.name}
                        {isYou ? <span className="ml-1 text-accent">(você)</span> : null}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{worshipRole}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="size-4 text-accent" />
              Músicas selecionadas
            </CardTitle>
            <CardDescription>Repertório definido para este culto.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {scaleSongs.length > 0 ? (
              scaleSongs.map((song, index) => (
                <div key={song.id} className="flex items-center justify-between gap-2 rounded-lg border p-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{song.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium">Tom {song.key}</span>
                    <span>{song.bpm} BPM</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhuma música selecionada ainda.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Repertório */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Repertório</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar música ou artista..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {filteredSongs.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        ) : (
          <Card className="rounded-xl">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              Nenhuma música encontrada para “{query}”.
            </CardContent>
          </Card>
        )}
      </section>

      {/* Sugestões */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">
            {isLeader ? "Sugestões pendentes" : "Minhas sugestões"}
          </h2>
          {isLeader ? <StatusBadge status="pendente" /> : null}
        </div>

        {isLeader ? (
          leaderItems.length > 0 ? (
            <div className="space-y-3">
              {leaderItems.map((item) => (
                <ApprovalFlowCard key={item.id} item={item} canReview onStatusChange={handleStatusChange} />
              ))}
            </div>
          ) : (
            <Card className="rounded-xl">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Nenhuma sugestão pendente. Boa!
              </CardContent>
            </Card>
          )
        ) : (
          <div className="space-y-3">
            {myItems.length > 0 ? (
              myItems.map((item) => <ApprovalFlowCard key={item.id} item={item} />)
            ) : (
              <Card className="rounded-xl">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  Você ainda não enviou sugestões de música.
                </CardContent>
              </Card>
            )}
            <p className="text-xs text-muted-foreground">
              As sugestões ficam “pendentes” até o líder do louvor aprovar ou recusar.
            </p>
          </div>
        )}
      </section>

      {/* Dialog de sugestão */}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) resetForm()
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sugerir música para o culto</DialogTitle>
            <DialogDescription>
              Envie uma sugestão para o líder do louvor avaliar e incluir na escala.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="songTitle">Nome da música</Label>
              <Input
                id="songTitle"
                placeholder="Ex: Fonte Inesgotável"
                value={songTitle}
                onChange={(event) => {
                  setSongTitle(event.target.value)
                  setFormError(null)
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artista / referência (opcional)</Label>
              <Input
                id="artist"
                placeholder="Ex: Siloé Worship"
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceDate">Culto / data alvo</Label>
              <Input
                id="serviceDate"
                type="date"
                value={serviceDate}
                min={todayISO}
                onChange={(event) => setServiceDate(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Observação (opcional)</Label>
              <Input
                id="note"
                placeholder="Ex: combina com o tema do culto..."
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            </div>

            {formError ? (
              <p className="text-xs font-medium text-danger">{formError}</p>
            ) : null}

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm()
                  setOpen(false)
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">Enviar sugestão</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SongCard({ song }: { song: Song }) {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="truncate">{song.title}</CardTitle>
            <CardDescription className="mt-1 truncate">{song.artist}</CardDescription>
          </div>
          <Music2 className="size-5 shrink-0 text-accent" />
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2 py-1 font-medium text-accent-foreground">
          <KeyRound className="size-3" />
          Tom {song.key}
        </span>
        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 font-medium">
          <Gauge className="size-3" />
          {song.bpm} BPM
        </span>
        {song.referenceUrl ? (
          <a
            href={song.referenceUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1 font-medium text-accent hover:underline"
          >
            Referência
            <ExternalLink className="size-3" />
          </a>
        ) : null}
      </CardContent>
    </Card>
  )
}
