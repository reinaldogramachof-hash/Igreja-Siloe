"use client"

import { useSyncExternalStore } from "react"
import { demoUsersByRole } from "@/lib/mock-data"
import type { Member, Role } from "@/lib/types"

const STORAGE_KEY = "siloe-demo-role"
const ROLE_CHANGE_EVENT = "siloe-demo-role-change"

export function getStoredRole(): Role {
  if (typeof window === "undefined") {
    return "membro"
  }

  const role = window.localStorage.getItem(STORAGE_KEY)
  if (role === "admin" || role === "secretaria" || role === "tesoureiro" || role === "lider_celula" || role === "lider_louvor" || role === "lider_salas" || role === "membro") {
    return role
  }

  return "membro"
}

export function setStoredRole(role: Role) {
  window.localStorage.setItem(STORAGE_KEY, role)
  window.dispatchEvent(new Event(ROLE_CHANGE_EVENT))
}

export function useDemoUser(): { role: Role; user: Member; setRole: (role: Role) => void } {
  const role = useSyncExternalStore<Role>(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange)
      window.addEventListener(ROLE_CHANGE_EVENT, onStoreChange)

      return () => {
        window.removeEventListener("storage", onStoreChange)
        window.removeEventListener(ROLE_CHANGE_EVENT, onStoreChange)
      }
    },
    getStoredRole,
    () => "membro"
  )

  function setRole(roleValue: Role) {
    setStoredRole(roleValue)
  }

  return {
    role,
    user: demoUsersByRole[role],
    setRole,
  }
}
