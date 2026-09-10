"use client"

import { createClient } from "@supabase/supabase-js"

/**
 * Client isolado da prova de homologacao (OPS-01). Aponta explicitamente
 * para o schema "homolog" via PostgREST - nunca toca o schema public do
 * projeto-base. Descartavel: some junto do cleanup da OT-OPS-01.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export function getHomologClient() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Supabase nao configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    )
  }

  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    db: { schema: "homolog" },
  })
}
