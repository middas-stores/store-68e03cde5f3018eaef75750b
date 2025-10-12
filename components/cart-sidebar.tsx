"use client"

import { X, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"
import type { StoreConfig } from "@/lib/store-config"

export function CartSidebar() {
  const { items, removeItem, updateQuantity, totalPrice, isOpen, closeCart } = useCart()
  const [config, setConfig] = useState<StoreConfig | null>(null)

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => setConfig(data))
  }, [])

  const formatPrice = (price: number | undefined) => {
    const safePrice = price || 0
    if (!config) return safePrice.toString()
    return `${config.settings.currencySymbol}${safePrice.toLocaleString("es-AR")}`
  }

  const handleWhatsAppOrder = () => {
    if (!config) return

    const message = `Hola! Me gustaría hacer un pedido:\n\n${items
      .map((item) => `• ${item.name} x${item.quantity} - ${formatPrice((item.price || 0) * item.quantity)}`)
      .join("\n")}\n\nTotal: ${formatPrice(totalPrice)}`

    const whatsappUrl = `https://wa.me/${config.business.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={closeCart} />
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-border bg-background shadow-lg">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold">Carrito de Compras</h2>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div>
                <p className="text-muted-foreground">Tu carrito está vacío</p>
                <Button className="mt-4" onClick={closeCart}>
                  Continuar comprando
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 rounded-lg border border-border p-3">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 bg-transparent"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto h-7 w-7"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border p-4">
                <div className="mb-4 flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleWhatsAppOrder}>
                  Realizar Pedido por WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
