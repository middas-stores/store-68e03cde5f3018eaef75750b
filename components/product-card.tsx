"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/lib/store-config"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect } from "react"
import type { StoreConfig } from "@/lib/store-config"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, getItemQuantity } = useCart()
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const quantityInCart = getItemQuantity(product.id)
  const isOutOfStock = product.stock === 0
  const isMaxStock = quantityInCart >= product.stock

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => setConfig(data))
  }, [])

  const formatPrice = (price: number) => {
    if (price === 0) return "Precio a consultar"
    if (!config) return price.toString()
    return `${config.settings.currencySymbol}${price.toLocaleString("es-AR")}`
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-1 text-xs text-muted-foreground">{product.category}</div>
        <h3 className="mb-2 font-semibold text-balance">{product.name}</h3>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          {config?.settings.showStock && <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Button className="w-full" onClick={() => addItem(product)} disabled={isOutOfStock || isMaxStock}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isOutOfStock ? "Sin stock" : isMaxStock ? "Stock máximo alcanzado" : "Agregar al carrito"}
        </Button>
        <p className="text-[10px] text-muted-foreground text-center leading-tight">
          Stock y precios sujetos a disponibilidad. Imágenes ilustrativas.
        </p>
      </CardFooter>
    </Card>
  )
}
