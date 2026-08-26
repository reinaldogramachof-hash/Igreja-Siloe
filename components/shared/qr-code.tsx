"use client"

import { useEffect, useRef } from "react"

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

// Lightweight QR Code using Google Charts API (works offline via cache)
export function QRCode({ value, size = 160, className }: QRCodeProps) {
  const imgRef = useRef<HTMLImageElement>(null)

  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=0f1117&color=e2e8f0&qzone=1&format=svg`

  return (
    <img
      ref={imgRef}
      src={url}
      alt={`QR Code: ${value}`}
      width={size}
      height={size}
      className={className}
      onError={(e) => {
        // Fallback: render a simple placeholder if offline
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.fillStyle = "#1e293b"
          ctx.fillRect(0, 0, size, size)
          ctx.fillStyle = "#0d9488"
          ctx.font = `bold ${size / 10}px sans-serif`
          ctx.textAlign = "center"
          ctx.fillText("QR offline", size / 2, size / 2)
        }
        e.currentTarget.src = canvas.toDataURL()
      }}
    />
  )
}
