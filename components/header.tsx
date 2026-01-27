"use client"

import Link from "next/link"
import { ShoppingCart, Menu, ChevronDown, Home, Grid3X3, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { useState, useEffect, useRef } from "react"
import type { StoreConfig } from "@/lib/store-config"
import type { Category } from "@/lib/api"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"

export function Header() {
  const { totalItems, openCart } = useCart()
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/config/store-config.json")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data)
        // Cargar categorías una vez que tenemos el config
        if (data.apiUrl && data.storeId) {
          fetch(`${data.apiUrl}/api/public/store/${data.storeId}/categories`)
            .then((res) => res.json())
            .then((cats) => setCategories(cats))
            .catch(console.error)
        }
      })
  }, [])

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!config) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <img src={config.branding.logo || "/placeholder.svg"} alt={config.business.name} className="h-8" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Inicio
            </Link>
            {categories.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary"
                >
                  Categorías
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 top-full mt-2 min-w-[200px] rounded-md border border-border bg-background p-2 shadow-lg">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        href={`/productos?categoria=${category._id}`}
                        className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-border" />
                    <Link
                      href="/productos"
                      className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Ver todos los productos
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" onClick={openCart}>
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {totalItems}
              </span>
            )}
          </Button>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <SheetHeader className="border-b border-border pb-4">
            <SheetTitle className="flex items-center gap-2">
              <img src={config.branding.logo || "/placeholder.svg"} alt={config.business.name} className="h-6" />
              <span>{config.business.name}</span>
            </SheetTitle>
          </SheetHeader>
          
          <nav className="flex flex-col gap-1 py-4">
            {/* Inicio */}
            <SheetClose asChild>
              <Link 
                href="/" 
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Home className="h-5 w-5" />
                Inicio
              </Link>
            </SheetClose>

            {/* Todos los productos */}
            <SheetClose asChild>
              <Link 
                href="/productos" 
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Package className="h-5 w-5" />
                Todos los productos
              </Link>
            </SheetClose>

            {/* Categorías */}
            {categories.length > 0 && (
              <>
                <div className="my-2 border-t border-border" />
                <div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Categorías
                </div>
                {categories.map((category) => (
                  <SheetClose asChild key={category._id}>
                    <Link
                      href={`/productos?categoria=${category._id}`}
                      className="flex items-center gap-3 rounded-md px-3 py-2.5 pl-6 text-sm transition-colors hover:bg-muted"
                    >
                      {category.name}
                    </Link>
                  </SheetClose>
                ))}
              </>
            )}
          </nav>

          {/* Footer del menú móvil */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
            <div className="text-xs text-muted-foreground text-center">
              {config.business.phone && (
                <a href={`tel:${config.business.phone}`} className="hover:text-primary">
                  📞 {config.business.phone}
                </a>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
