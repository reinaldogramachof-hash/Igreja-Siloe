"use client"

import { useState } from "react"
import { getHomologClient } from "@/lib/supabase-homolog"

type PingRow = {
  id: string
  owner: string
  mensagem: string | null
  created_at: string
}

type LogEntry = {
  time: string
  label: string
  ok: boolean
  detail: string
}

export default function HomologPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userId, setUserId] = useState<string | null>(null)
  const [mensagem, setMensagem] = useState("")
  const [rows, setRows] = useState<PingRow[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])

  function pushLog(label: string, ok: boolean, detail: string) {
    setLog((prev) => [{ time: new Date().toLocaleTimeString(), label, ok, detail }, ...prev])
  }

  async function handleSignUp() {
    const supabase = getHomologClient()
    const { error } = await supabase.auth.signUp({ email, password })
    pushLog("sign-up", !error, error ? error.message : "conta criada (confirme o e-mail se exigido)")
  }

  async function handleSignIn() {
    const supabase = getHomologClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      pushLog("sign-in", false, error.message)
      return
    }
    setUserId(data.user?.id ?? null)
    pushLog("sign-in", true, `sessao ativa: ${data.user?.id}`)
  }

  async function handleSignOut() {
    const supabase = getHomologClient()
    await supabase.auth.signOut()
    setUserId(null)
    setRows([])
    setSignedUrl(null)
    pushLog("sign-out", true, "sessao encerrada")
  }

  async function handleInsertPing() {
    const supabase = getHomologClient()
    const { error } = await supabase.from("homolog_ping").insert({ mensagem })
    pushLog("insert homolog_ping", !error, error ? error.message : "linha inserida")
  }

  async function handleSelectPing() {
    const supabase = getHomologClient()
    const { data, error } = await supabase
      .from("homolog_ping")
      .select("id, owner, mensagem, created_at")
      .order("created_at", { ascending: false })
    if (error) {
      pushLog("select homolog_ping", false, error.message)
      return
    }
    setRows(data ?? [])
    pushLog("select homolog_ping", true, `${data?.length ?? 0} linha(s) retornada(s) — so as do usuario logado (RLS)`)
  }

  async function handleInvokeEcho() {
    const supabase = getHomologClient()
    const { data, error } = await supabase.functions.invoke("homolog-echo", {
      body: { mensagem: "prova-ops-01" },
    })
    pushLog("invoke homolog-echo", !error, error ? error.message : JSON.stringify(data))
  }

  async function handleUpload() {
    if (!file || !userId) {
      pushLog("upload storage", false, "selecione um arquivo e esteja autenticado")
      return
    }
    const supabase = getHomologClient()
    const path = `${userId}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from("homolog").upload(path, file)
    if (error) {
      pushLog("upload storage", false, error.message)
      return
    }
    pushLog("upload storage", true, `arquivo enviado em ${path}`)

    const { data: signed, error: signError } = await supabase.storage
      .from("homolog")
      .createSignedUrl(path, 60)
    if (signError) {
      pushLog("signed url storage", false, signError.message)
      return
    }
    setSignedUrl(signed.signedUrl)
    pushLog("signed url storage", true, "link temporario (60s) gerado")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 font-mono text-sm">
      <h1 className="text-lg font-bold">OPS-01 — pagina de prova de homologacao</h1>
      <p className="text-xs text-neutral-500">
        Uso interno de homologacao. Sem dado real, sem identidade de produto. Remover no aceite da OT-OPS-01.
      </p>

      <section className="space-y-2 rounded border border-neutral-300 p-4">
        <h2 className="font-semibold">1. Autenticacao</h2>
        <input
          className="w-full rounded border border-neutral-300 px-2 py-1"
          placeholder="e-mail de teste"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border border-neutral-300 px-2 py-1"
          placeholder="senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="rounded bg-neutral-800 px-3 py-1 text-white" onClick={handleSignUp}>
            criar conta
          </button>
          <button className="rounded bg-neutral-800 px-3 py-1 text-white" onClick={handleSignIn}>
            entrar
          </button>
          <button className="rounded border border-neutral-300 px-3 py-1" onClick={handleSignOut}>
            sair
          </button>
        </div>
        <p className="text-xs">usuario logado: {userId ?? "nenhum"}</p>
      </section>

      <section className="space-y-2 rounded border border-neutral-300 p-4">
        <h2 className="font-semibold">2. Escrita/leitura protegida por RLS (homolog_ping)</h2>
        <input
          className="w-full rounded border border-neutral-300 px-2 py-1"
          placeholder="mensagem de teste"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="rounded bg-neutral-800 px-3 py-1 text-white" onClick={handleInsertPing}>
            inserir
          </button>
          <button className="rounded border border-neutral-300 px-3 py-1" onClick={handleSelectPing}>
            listar minhas linhas
          </button>
        </div>
        <ul className="space-y-1 text-xs">
          {rows.map((row) => (
            <li key={row.id}>
              {row.created_at} — owner {row.owner} — {row.mensagem}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 rounded border border-neutral-300 p-4">
        <h2 className="font-semibold">3. Edge Function (homolog-echo)</h2>
        <button className="rounded bg-neutral-800 px-3 py-1 text-white" onClick={handleInvokeEcho}>
          invocar
        </button>
      </section>

      <section className="space-y-2 rounded border border-neutral-300 p-4">
        <h2 className="font-semibold">4. Storage (bucket privado homolog)</h2>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div>
          <button className="rounded bg-neutral-800 px-3 py-1 text-white" onClick={handleUpload}>
            enviar e gerar link assinado
          </button>
        </div>
        {signedUrl && (
          <a className="break-all text-blue-600 underline" href={signedUrl} target="_blank" rel="noreferrer">
            {signedUrl}
          </a>
        )}
      </section>

      <section className="space-y-1 rounded border border-neutral-300 p-4">
        <h2 className="font-semibold">registro</h2>
        <ul className="space-y-1 text-xs">
          {log.map((entry, i) => (
            <li key={i} className={entry.ok ? "text-emerald-700" : "text-red-700"}>
              [{entry.time}] {entry.label}: {entry.ok ? "ok" : "falhou"} — {entry.detail}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
