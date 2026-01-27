"use client"

import { useState, useEffect } from "react"
import type { StoreConfig } from "@/lib/store-config"
import { FloatingWhatsApp } from "./floating-whatsapp"

export function FloatingWhatsAppWrapper() {
  const [config, setConfig] = useState<StoreConfig | null>(null)

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => setConfig(data))
  }, [])

  if (!config) return null

  // Only show if enabled and whatsapp number is set
  if (!config.settings.showFloatingWhatsapp || !config.business.whatsapp) {
    return null
  }

  return (
    <FloatingWhatsApp
      phoneNumber={config.business.whatsapp}
      message={`Hola ${config.business.name}! Me gustaría hacer una consulta.`}
    />
  )
}
