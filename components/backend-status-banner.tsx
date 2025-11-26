"use client"

import { useEffect, useState } from "react"
import { AlertCircle, X } from "lucide-react"

export function BackendStatusBanner() {
  const [isBackendAvailable, setIsBackendAvailable] = useState<boolean | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        const response = await fetch(`${API_URL}/api/vereadores/stats`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        setIsBackendAvailable(response.ok)
      } catch (error) {
        setIsBackendAvailable(false)
      }
    }

    checkBackend()
    // Check every 10 seconds
    const interval = setInterval(checkBackend, 10000)

    return () => clearInterval(interval)
  }, [])

  if (isDismissed || isBackendAvailable === null || isBackendAvailable) return null

  return (
    <div className="bg-destructive text-destructive-foreground px-4 py-3 relative">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Backend Python não está rodando. Inicie o servidor com:{" "}
            <code className="bg-destructive-foreground/20 px-2 py-0.5 rounded text-xs">
              cd backend && python app.py
            </code>
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-destructive-foreground hover:text-destructive-foreground/80"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
