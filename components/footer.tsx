"use client"

import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import type { StoreConfig } from "@/lib/store-config"

export function Footer() {
  const [config, setConfig] = useState<StoreConfig | null>(null)

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => setConfig(data))
  }, [])

  if (!config) return null

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">{config.business.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{config.business.description}</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{config.business.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{config.business.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{config.business.address}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Síguenos</h3>
            <div className="flex gap-4">
              {config.business.socialMedia.instagram && (
                <a
                  href={config.business.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {config.business.socialMedia.facebook && (
                <a
                  href={config.business.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Sistema</h3>
            <div className="space-y-2">
              <a
                href="/status"
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Estado del Sistema
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {config.business.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
