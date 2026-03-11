"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export interface FilterOption {
  id: string
  name: string
  count: number
}

interface ProductFiltersProps {
  subcategories: FilterOption[]
  brands: FilterOption[]
  selectedSubcategories: string[]
  selectedBrands: string[]
  onSubcategoryChange: (id: string) => void
  onBrandChange: (id: string) => void
  onClearAll: () => void
  activeFilterCount: number
}

export function ProductFilters({
  subcategories,
  brands,
  selectedSubcategories,
  selectedBrands,
  onSubcategoryChange,
  onBrandChange,
  onClearAll,
  activeFilterCount,
}: ProductFiltersProps) {
  const defaultOpen: string[] = []
  if (subcategories.length > 0) defaultOpen.push("subcategories")
  if (brands.length > 0) defaultOpen.push("brands")

  if (subcategories.length === 0 && brands.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {activeFilterCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-auto px-0 py-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <X className="mr-1 h-3 w-3" />
          Limpiar filtros ({activeFilterCount})
        </Button>
      )}

      <Accordion type="multiple" defaultValue={defaultOpen}>
        {subcategories.length > 0 && (
          <AccordionItem value="subcategories">
            <AccordionTrigger className="text-sm font-semibold py-3">
              Subcategorias
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2.5">
                {subcategories.map((sub) => (
                  <div key={sub.id} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`sub-${sub.id}`}
                      checked={selectedSubcategories.includes(sub.id)}
                      onCheckedChange={() => onSubcategoryChange(sub.id)}
                    />
                    <Label
                      htmlFor={`sub-${sub.id}`}
                      className="flex-1 text-sm font-normal cursor-pointer leading-none"
                    >
                      {sub.name}
                    </Label>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {sub.count}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {brands.length > 0 && (
          <AccordionItem value="brands">
            <AccordionTrigger className="text-sm font-semibold py-3">
              Marcas
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2.5">
                {brands.map((brand) => (
                  <div key={brand.id} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={() => onBrandChange(brand.id)}
                    />
                    <Label
                      htmlFor={`brand-${brand.id}`}
                      className="flex-1 text-sm font-normal cursor-pointer leading-none"
                    >
                      {brand.name}
                    </Label>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {brand.count}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}
