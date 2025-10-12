"use client"

import { ProductCard } from "@/components/product-card"
import { useState, useEffect } from "react"
import type { StoreConfig, Product } from "@/lib/store-config"
import { getProducts } from "@/lib/api"

export default function ProductsPage() {
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const configRes = await fetch("/config/store-config.json")
        const configData: StoreConfig = await configRes.json()
        setConfig(configData)

        const productsData = await getProducts(configData.apiUrl, configData.storeId)
        setProducts(productsData)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">Todos los Productos</h1>
          <p className="text-muted-foreground">Explora nuestra colección completa de productos</p>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No hay productos disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}
