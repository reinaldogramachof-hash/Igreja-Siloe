"use client"

import { useMemo, useState } from "react"
import {
  ExternalLink,
  Gauge,
  Info,
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
import { Badge } from "@/components/ui/badge"
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
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-accent">Ministério de Louvor</p>
            {isLeader && (
              <Badge className="bg-accent/15 text-accent border-accent/30 text-[10px] font-bold rounded-full px-2.5 py-0.5">
                Visão de Gestão
              </Badge>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Escala & Repertório</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Acesse as músicas selecionadas, a escala do próximo culto e envie sugestões ao líder do louvor.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2 bg-accent hover:bg-accent/90 text-white rounded-xl shadow-md shadow-accent/10 font-semibold h-10 px-4 transition-all duration-300">
          <Plus className="size-4.5" />
          Sugerir Música
        </Button>
      </div>

      {/* Escala da semana */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm">
          <CardHeader className="pb-3.5 bg-card/5 border-b border-border/40">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent-soft/60 text-accent">
                <Sparkles className="size-4" />
              </span>
              {scale.name}
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-muted-foreground mt-1">
              {formatShortDate(scale.date)} · {scale.time}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <p className="mb-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Integrantes Escalados
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {scaleMembers.map(({ member, role: worshipRole }) => {
                const isYou = member.id === user.id
                return (
                  <div
                    key={member.id}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-3 transition-colors duration-300",
                      isYou 
                        ? "border-accent/40 bg-accent-soft/30 shadow-inner" 
                        : "border-border/40 bg-muted/20 hover:border-border/70"
                    )}
                  >
                    <Avatar className="size-8.5 border border-border/20 shadow-inner">
                      <AvatarFallback className="bg-accent-soft text-accent font-bold text-xs">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {member.name}
                        {isYou ? <span className="ml-1 text-xs text-accent font-semibold">(você)</span> : null}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">{worshipRole}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm">
          <CardHeader className="pb-3.5 bg-card/5 border-b border-border/40">
            <CardTitle className="flex items-center gap-2.5 text-base font-bold text-foreground">
              <span className="flex size-8 items-center justify-center rounded-lg bg-accent-soft/60 text-accent">
                <Music2 className="size-4" />
              </span>
              Músicas Selecionadas
            </CardTitle>
            <CardDescription className="text-xs font-semibold text-muted-foreground mt-1">Repertório definido para este culto.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-5">
            {scaleSongs.length > 0 ? (
              scaleSongs.map((song, index) => (
                <div key={song.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-card/20 p-3 hover:bg-card/45 transition-colors">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-bold text-accent">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-foreground">{song.title}</p>
                      <p className="truncate text-xs text-muted-foreground mt-0.5">{song.artist}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <span className="rounded-md bg-muted/65 px-2 py-0.5 font-bold text-foreground">Tom {song.key}</span>
                    <span className="text-[11px]">{song.bpm} BPM</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-12 text-center text-xs font-semibold text-muted-foreground">
                Nenhuma música selecionada ainda.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Repertório */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-2">
          <h2 className="text-base font-bold text-foreground pl-1">Repertório Geral</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar música ou artista..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9 rounded-xl border-border/45 bg-card/45 backdrop-blur-sm text-sm"
            />
          </div>
        </div>

        {filteredSongs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        ) : (
          <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm">
            <CardContent className="py-12 text-center text-sm font-semibold text-muted-foreground">
              Nenhuma música encontrada para “{query}”.
            </CardContent>
          </Card>
        )}
      </section>

      {/* Sugestões */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-foreground pl-1">
            {isLeader ? "Sugestões Pendentes" : "Minhas Sugestões"}
          </h2>
          {isLeader && <StatusBadge status="pendente" />}
        </div>

        {isLeader ? (
          leaderItems.length > 0 ? (
            <div className="space-y-3">
              {leaderItems.map((item) => (
                <ApprovalFlowCard key={item.id} item={item} canReview onStatusChange={handleStatusChange} />
              ))}
            </div>
          ) : (
            <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm">
              <CardContent className="py-14 text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-success-soft text-success mx-auto mb-3">
                  <Info className="size-6" />
                </div>
                <p className="text-sm font-semibold text-foreground">Sem sugestões pendentes</p>
                <p className="text-xs text-muted-foreground mt-1">Todas as recomendações de louvor foram revisadas.</p>
              </CardContent>
            </Card>
          )
        ) : (
          <div className="space-y-4">
            {myItems.length > 0 ? (
              <div className="space-y-3">
                {myItems.map((item) => <ApprovalFlowCard key={item.id} item={item} />)}
              </div>
            ) : (
              <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm">
                <CardContent className="py-12 text-center text-sm font-semibold text-muted-foreground">
                  Você ainda não enviou sugestões de música.
                </CardContent>
              </Card>
            )}
            <p className="text-xs text-muted-foreground/80 pl-1 font-medium">
              * Suas sugestões são enviadas diretamente para avaliação e aprovação dos líderes de louvor.
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
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Sugerir Música para o Culto</DialogTitle>
            <DialogDescription>
              Envie uma sugestão para o líder do louvor avaliar e incluir na escala de músicas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="songTitle">Nome da Música</Label>
              <Input
                id="songTitle"
                placeholder="Ex: Fonte Inesgotável"
                value={songTitle}
                onChange={(event) => {
                  setSongTitle(event.target.value)
                  setFormError(null)
                }}
                className="rounded-xl border-border/40 h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist">Artista / Ministério (opcional)</Label>
              <Input
                id="artist"
                placeholder="Ex: Siloé Worship"
                value={artist}
                onChange={(event) => setArtist(event.target.value)}
                className="rounded-xl border-border/40 h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceDate">Data do Culto Alvo</Label>
              <Input
                id="serviceDate"
                type="date"
                value={serviceDate}
                min={todayISO}
                onChange={(event) => setServiceDate(event.target.value)}
                className="rounded-xl border-border/40 h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Observação / Link (opcional)</Label>
              <Input
                id="note"
                placeholder="Ex: combina com a mensagem bíblica deste domingo..."
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="rounded-xl border-border/40 h-10"
              />
            </div>

            {formError && (
              <p className="text-xs font-semibold text-danger pl-1">{formError}</p>
            )}

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  resetForm()
                  setOpen(false)
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold">Enviar Sugestão</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SongCard({ song }: { song: Song }) {
  return (
    <Card className="rounded-2xl border-border/40 bg-card/45 backdrop-blur-md shadow-sm hover:shadow transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      <CardHeader className="pb-3 bg-card/5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="truncate text-sm.5 font-bold text-foreground">{song.title}</CardTitle>
            <CardDescription className="mt-1 truncate text-xs text-muted-foreground/90 font-medium">{song.artist}</CardDescription>
          </div>
          <div className="flex size-9 items-center justify-center rounded-lg bg-accent-soft/60 text-accent">
            <Music2 className="size-4.5 shrink-0" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border/10 bg-card/5">
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft/65 px-2.5 py-1 font-bold text-accent">
          <KeyRound className="size-3.5" />
          Tom {song.key}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted/65 px-2.5 py-1 font-semibold text-foreground">
          <Gauge className="size-3.5" />
          {song.bpm} BPM
        </span>
        {song.referenceUrl ? (
          <a
            href={song.referenceUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1 font-bold text-accent hover:underline text-[11px]"
          >
            Vídeo
            <ExternalLink className="size-3" />
          </a>
        ) : null}
      </CardContent>
    </Card>
  )
}
