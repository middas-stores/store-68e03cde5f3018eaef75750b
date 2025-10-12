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
  const { addItem } = useCart()
  const [config, setConfig] = useState<StoreConfig | null>(null)

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => setConfig(data))
  }, [])

  const formatPrice = (price: number) => {
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
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => addItem(product)} disabled={product.stock === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
