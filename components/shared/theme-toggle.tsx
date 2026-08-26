"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevents hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-9" disabled>
        <Sun className="size-4 text-muted-foreground" />
      </Button>
    )
  }

  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-9 rounded-full transition-colors hover:bg-muted"
      aria-label="Alternar tema"
    >
      {isDark ? (
        <Sun className="size-[18px] text-amber-500 transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="size-[18px] text-slate-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </Button>
  )
}
