"use client"

import { ProductCard } from "@/components/product-card"
import { ProductSkeleton } from "@/components/product-skeleton"
import { ProductFilters } from "@/components/product-filters"
import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Package, Grid3X3, Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { StoreConfig, Product } from "@/lib/store-config"
import { getProducts, getCategories, type Category } from "@/lib/api"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("categoria")
  const searchFilter = searchParams.get("search")

  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [headerVisible, setHeaderVisible] = useState(false)

  // Sorting & filtering state
  const [sortBy, setSortBy] = useState("alpha-asc")
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

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
        setTimeout(() => setHeaderVisible(true), 100)
      }
    }
    loadData()
  }, [])

  // Reset subcategory/brand filters when category or search changes
  useEffect(() => {
    setSelectedSubcategories([])
    setSelectedBrands([])
  }, [categoryFilter, searchFilter])

  // Step 1: Filter by category + search (base for filter options)
  const categorySearchFiltered = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter && p.categoryId !== categoryFilter) return false
      if (searchFilter) {
        const q = searchFilter.toLowerCase()
        const name = (p.name || "").toLowerCase()
        const desc = (p.description || "").toLowerCase()
        if (!name.includes(q) && !desc.includes(q)) return false
      }
      return true
    })
  }, [products, categoryFilter, searchFilter])

  // Extract subcategory options with counts from base-filtered products
  const subcategoryOptions = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>()
    categorySearchFiltered.forEach((p) => {
      if (p.subcategoryId && p.subcategory) {
        const existing = map.get(p.subcategoryId)
        if (existing) {
          existing.count++
        } else {
          map.set(p.subcategoryId, { name: p.subcategory, count: 1 })
        }
      }
    })
    return Array.from(map.entries())
      .map(([id, { name, count }]) => ({ id, name, count }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [categorySearchFiltered])

  // Extract brand options with counts from base-filtered products
  const brandOptions = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>()
    categorySearchFiltered.forEach((p) => {
      if (p.brandId && p.brand) {
        const existing = map.get(p.brandId)
        if (existing) {
          existing.count++
        } else {
          map.set(p.brandId, { name: p.brand, count: 1 })
        }
      }
    })
    return Array.from(map.entries())
      .map(([id, { name, count }]) => ({ id, name, count }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [categorySearchFiltered])

  // Step 2: Apply subcategory + brand filters
  const filteredProducts = useMemo(() => {
    let result = categorySearchFiltered
    if (selectedSubcategories.length > 0) {
      result = result.filter(
        (p) => p.subcategoryId && selectedSubcategories.includes(p.subcategoryId)
      )
    }
    if (selectedBrands.length > 0) {
      result = result.filter(
        (p) => p.brandId && selectedBrands.includes(p.brandId)
      )
    }
    return result
  }, [categorySearchFiltered, selectedSubcategories, selectedBrands])

  // Step 3: Sort
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts]
    switch (sortBy) {
      case "alpha-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "price-asc":
        sorted.sort((a, b) => {
          const priceA = a.priceRange?.min ?? a.price
          const priceB = b.priceRange?.min ?? b.price
          return priceA - priceB
        })
        break
      case "price-desc":
        sorted.sort((a, b) => {
          const priceA = a.priceRange?.max ?? a.price
          const priceB = b.priceRange?.max ?? b.price
          return priceB - priceA
        })
        break
    }
    return sorted
  }, [filteredProducts, sortBy])

  // Filter handlers
  const handleSubcategoryChange = (id: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleBrandChange = (id: string) => {
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]
    )
  }

  const handleClearFilters = () => {
    setSelectedSubcategories([])
    setSelectedBrands([])
  }

  const activeFilterCount = selectedSubcategories.length + selectedBrands.length

  // Active category name
  const activeCategory = categoryFilter
    ? categories.find((c) => c._id === categoryFilter)
    : null

  const hasFilterOptions = subcategoryOptions.length > 0 || brandOptions.length > 0

  if (loading || !config) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header skeleton */}
          <div className="mb-12 space-y-4">
            <div className="h-10 w-64 bg-muted rounded skeleton-shimmer" />
            <div className="h-5 w-96 bg-muted rounded skeleton-shimmer" />
          </div>

          {/* Products grid skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ProductSkeleton count={8} />
          </div>
        </div>

        <style jsx global>{`
          .skeleton-shimmer {
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.4) 50%,
              transparent 100%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    )
  }

  const filtersContent = (
    <ProductFilters
      subcategories={subcategoryOptions}
      brands={brandOptions}
      selectedSubcategories={selectedSubcategories}
      selectedBrands={selectedBrands}
      onSubcategoryChange={handleSubcategoryChange}
      onBrandChange={handleBrandChange}
      onClearAll={handleClearFilters}
      activeFilterCount={activeFilterCount}
    />
  )

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div
            className={`transition-all duration-500 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {(activeCategory || searchFilter) && (
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4 group"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Ver todos los productos
              </Link>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                {searchFilter ? (
                  <Search className="h-6 w-6 text-primary" />
                ) : activeCategory ? (
                  <Grid3X3 className="h-6 w-6 text-primary" />
                ) : (
                  <Package className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold md:text-4xl">
                  {searchFilter
                    ? `Resultados para "${searchFilter}"`
                    : activeCategory
                      ? activeCategory.name
                      : "Todos los Productos"}
                </h1>
                <p className="text-muted-foreground">
                  {sortedProducts.length} {sortedProducts.length === 1 ? 'producto' : 'productos'}
                  {activeCategory ? ` en ${activeCategory.name}` : searchFilter ? ' encontrados' : ' disponibles'}
                </p>
              </div>
              {searchFilter && (
                <Link href="/productos">
                  <Button variant="outline" size="sm" className="gap-2 shrink-0">
                    <X className="h-4 w-4" />
                    Limpiar búsqueda
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Category Pills - hidden when search is active */}
          {categories.length > 0 && !searchFilter && (
            <div
              className={`flex flex-wrap gap-2 mt-6 transition-all duration-500 ease-out ${
                headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <Link href="/productos">
                <Button
                  variant={!categoryFilter ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  Todos
                </Button>
              </Link>
              {categories.map((category) => (
                <Link key={category._id} href={`/productos?categoria=${category._id}`}>
                  <Button
                    variant={categoryFilter === category._id ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                  >
                    {category.name}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sort Bar + Mobile Filter Toggle */}
      <section className="pt-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3">
            {/* Mobile filter button */}
            {hasFilterOptions && (
              <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtros
                    {activeFilterCount > 0 && (
                      <Badge variant="default" className="ml-0.5 h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[340px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                    <SheetDescription>
                      Filtra productos por subcategoría y marca
                    </SheetDescription>
                  </SheetHeader>
                  <div className="px-4 pb-4">
                    {filtersContent}
                  </div>
                </SheetContent>
              </Sheet>
            )}

            {/* Sort dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger size="sm" className="w-[170px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alpha-asc">Nombre A-Z</SelectItem>
                  <SelectItem value="price-asc">Menor precio</SelectItem>
                  <SelectItem value="price-desc">Mayor precio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filter badges */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {selectedSubcategories.map((id) => {
                const sub = subcategoryOptions.find((s) => s.id === id)
                if (!sub) return null
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="cursor-pointer gap-1 pr-1.5 hover:bg-secondary/80 transition-colors"
                    onClick={() => handleSubcategoryChange(id)}
                  >
                    {sub.name}
                    <X className="h-3 w-3" />
                  </Badge>
                )
              })}
              {selectedBrands.map((id) => {
                const brand = brandOptions.find((b) => b.id === id)
                if (!brand) return null
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="cursor-pointer gap-1 pr-1.5 hover:bg-secondary/80 transition-colors"
                    onClick={() => handleBrandChange(id)}
                  >
                    {brand.name}
                    <X className="h-3 w-3" />
                  </Badge>
                )
              })}
              <button
                onClick={handleClearFilters}
                className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sidebar + Products Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            {hasFilterOptions && (
              <aside className="hidden lg:block w-[220px] shrink-0">
                <div className="sticky top-24">
                  {filtersContent}
                </div>
              </aside>
            )}

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {sortedProducts.length > 0 ? (
                <div className={`grid gap-6 sm:grid-cols-2 ${hasFilterOptions ? 'lg:grid-cols-2 xl:grid-cols-3' : 'lg:grid-cols-3 xl:grid-cols-4'}`}>
                  {sortedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {searchFilter ? 'Sin resultados' : 'No hay productos disponibles'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchFilter
                        ? `No encontramos productos para "${searchFilter}"`
                        : activeCategory
                          ? `No encontramos productos en la categoría ${activeCategory.name}`
                          : 'Pronto agregaremos nuevos productos'}
                    </p>
                    {(activeCategory || searchFilter || activeFilterCount > 0) && (
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {activeFilterCount > 0 && (
                          <Button variant="outline" onClick={handleClearFilters}>
                            <X className="mr-2 h-4 w-4" />
                            Limpiar filtros
                          </Button>
                        )}
                        {(activeCategory || searchFilter) && (
                          <Button asChild variant="outline">
                            <Link href="/productos">
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Ver todos los productos
                            </Link>
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
