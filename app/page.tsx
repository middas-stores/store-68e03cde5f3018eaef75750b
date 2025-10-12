"use client"

import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import type { StoreConfig, Product } from "@/lib/store-config"
import { getFeaturedProducts } from "@/lib/api"

export default function HomePage() {
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const configRes = await fetch("/config/store-config.json")
        const configData: StoreConfig = await configRes.json()
        setConfig(configData)

        const products = await getFeaturedProducts(configData.apiUrl, configData.storeId)
        setFeaturedProducts(products)
      } catch (error) {
        console.error("Error loading data:", error)
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
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src={config.branding.banner || "/placeholder.svg"}
          alt="Banner"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
        <div className="container relative mx-auto flex h-full items-center px-4">
          <div className="max-w-2xl">
            <h1 className="mb-4 text-5xl font-bold leading-tight text-balance md:text-6xl">
              {config.branding.bannerTitle}
            </h1>
            <p className="mb-8 text-xl text-muted-foreground text-pretty">{config.branding.bannerSubtitle}</p>
            <Button size="lg" asChild>
              <Link href="/productos">
                Ver Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Productos Destacados</h2>
            <p className="text-muted-foreground">Descubre nuestra selección especial de productos</p>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay productos destacados disponibles</p>
            </div>
          )}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/productos">
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
