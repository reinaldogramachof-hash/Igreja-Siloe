"use client"

import { createContext, useContext, useSyncExternalStore } from "react"
import { demoUsersByRole } from "@/lib/mock-data"
import type { Member, ResolvedMembership, Role } from "@/lib/types"

const STORAGE_KEY = "siloe-demo-role"
const ROLE_CHANGE_EVENT = "siloe-demo-role-change"
const AuthSessionContext = createContext<ResolvedMembership | null>(null)

export function AuthSessionProvider({
  children,
  session,
}: {
  children: React.ReactNode
  session: ResolvedMembership
}) {
  return <AuthSessionContext.Provider value={session}>{children}</AuthSessionContext.Provider>
}

export function useAuthSession() {
  return useContext(AuthSessionContext)
}

export function getStoredRole(): Role {
  if (typeof window === "undefined") {
    return "membro"
  }

  const role = window.localStorage.getItem(STORAGE_KEY)
  if (
    role === "admin" ||
    role === "secretaria" ||
    role === "tesoureiro" ||
    role === "lider_celula" ||
    role === "lider_louvor" ||
    role === "lider_salas" ||
    role === "membro"
  ) {
    return role
  }

  return "membro"
}

export function setStoredRole(role: Role) {
  window.localStorage.setItem(STORAGE_KEY, role)
  window.dispatchEvent(new Event(ROLE_CHANGE_EVENT))
}

export function useDemoUser(): { role: Role; user: Member; setRole: (role: Role) => void } {
  const session = useAuthSession()
  const storedRole = useSyncExternalStore<Role>(
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
  const role = session?.role ?? storedRole
  const demoUser = demoUsersByRole[role]

  function setRole(roleValue: Role) {
    if (session) {
      return
    }

    setStoredRole(roleValue)
  }

  return {
    role,
    user: session
      ? {
          ...demoUser,
          id: session.userId,
          email: session.userEmail ?? demoUser.email,
          name: session.userName ?? session.userEmail ?? demoUser.name,
          role,
        }
      : demoUser,
    setRole,
  }
}
