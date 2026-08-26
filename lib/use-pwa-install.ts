"use client"

import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function usePWAInstall() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true

    setIsInstalled(isStandalone)

    // Detect Android
    setIsAndroid(/android/i.test(navigator.userAgent))

    const handler = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as BeforeInstallPromptEvent)
    }

    window.addEventListener("beforeinstallprompt", handler)

    // Listen for installed event
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true)
      setInstallEvent(null)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const promptInstall = async () => {
    if (!installEvent) return false
    await installEvent.prompt()
    const { outcome } = await installEvent.userChoice
    if (outcome === "accepted") {
      setIsInstalled(true)
      setInstallEvent(null)
    }
    return outcome === "accepted"
  }

  // Show install button only on Android when prompt is available and not installed
  const showInstallButton = isAndroid && !!installEvent && !isInstalled

  return { showInstallButton, promptInstall, isInstalled }
}
