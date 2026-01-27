"use client"

import { ProductCard } from "@/components/product-card"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import type { StoreConfig, Product } from "@/lib/store-config"
import { getProducts, getCategories, type Category } from "@/lib/api"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("categoria")

  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const configRes = await fetch("/config/store-config.json")
        const configData: StoreConfig = await configRes.json()
        setConfig(configData)

        const [productsData, categoriesData] = await Promise.all([
          getProducts(configData.apiUrl, configData.storeId),
          getCategories(configData.apiUrl, configData.storeId)
        ])
        setProducts(productsData)
        setCategories(categoriesData)
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

  // Filtrar productos por categoría si hay filtro activo
  const filteredProducts = categoryFilter
    ? products.filter((p) => p.categoryId === categoryFilter)
    : products

  // Obtener nombre de la categoría activa
  const activeCategory = categoryFilter
    ? categories.find((c) => c._id === categoryFilter)
    : null

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold">
            {activeCategory ? activeCategory.name : "Todos los Productos"}
          </h1>
          <p className="text-muted-foreground">
            {activeCategory
              ? `Productos en la categoría ${activeCategory.name}`
              : "Explora nuestra colección completa de productos"}
          </p>
          {activeCategory && (
            <Link
              href="/productos"
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              ← Ver todos los productos
            </Link>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
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
