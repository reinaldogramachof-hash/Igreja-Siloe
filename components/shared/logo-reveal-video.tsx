"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Pause, Play } from "lucide-react"
import { cn } from "@/lib/utils"

type LogoRevealVideoProps = {
  className?: string
}

/**
 * Vídeo de abertura da logo (água se reconstruindo em "Siloé"), com controle
 * manual de play/pause. Não autoplay: começa no poster estático da logo e só
 * reproduz quando o visitante clica — respeita prefers-reduced-motion.
 */
export function LogoRevealVideo({ className }: LogoRevealVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

  function togglePlay() {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying(true)
      setHasStarted(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  if (prefersReducedMotion) {
    return (
      <div className={cn("grid h-full place-items-center rounded-lg bg-muted/40", className)}>
        <Image src="/logo.svg" alt="Logo da Igreja Siloé" width={190} height={190} className="rounded-full" priority />
      </div>
    )
  }

  return (
    <div className={cn("group relative h-full overflow-hidden rounded-lg bg-black", className)}>
      <video
        ref={videoRef}
        src="/videos/siloe-logo.mp4"
        poster="/logo-poster.png"
        className="h-full w-full object-contain"
        playsInline
        muted
        loop
        onEnded={() => setIsPlaying(false)}
        aria-label="Animação da logo da Igreja Siloé"
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pausar animação" : "Reproduzir animação"}
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-colors",
          isPlaying ? "bg-transparent" : "bg-black/30 hover:bg-black/40"
        )}
      >
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-full bg-white/95 text-black shadow-lg transition-opacity",
            isPlaying && !hasStarted === false && isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          )}
        >
          {isPlaying ? <Pause className="size-6" /> : <Play className="ml-0.5 size-6" />}
        </span>
      </button>
    </div>
  )
}
