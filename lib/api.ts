import type { Product } from "./store-config"

export interface ApiProduct {
  _id: string
  name: string
  description?: string
  price: number
  image?: {
    signedUrl?: string
    thumbnails?: {
      smallSignedUrl?: string
      mediumSignedUrl?: string
    }
  }
  category?: {
    _id: string
    name: string
  }
  stock: number
  isActive?: boolean
  featured?: boolean
  storeDescription?: string
}

export async function getProducts(apiUrl: string, storeId: string): Promise<Product[]> {
  try {
    console.log(`${apiUrl}/api/public/store/${storeId}/products`)
    const response = await fetch(`${apiUrl}/api/public/store/${storeId}/products`)
    if (!response.ok) {
      throw new Error("Failed to load products")
    }
    const apiProducts: ApiProduct[] = await response.json()

    // Transformar productos de la API al formato de la interfaz Product
    return apiProducts
      .map(product => ({
        id: product._id,
        name: product.name,
        description: product.description || product.storeDescription || "",
        price: product.price || 0,
        image: product.image?.signedUrl || product.image?.thumbnails?.mediumSignedUrl || "/placeholder.svg?height=400&width=400",
        category: product.category?.name || "Sin categoría",
        stock: product.stock || 0,
      }))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function getFeaturedProducts(apiUrl: string, storeId: string, limit = 4): Promise<Product[]> {
  console.log(`Fetching featured products from ${apiUrl} for store ${storeId}`)
  const products = await getProducts(apiUrl, storeId)
  console.log("Fetched products:", products)
  // Retornar los primeros productos como destacados
  return products.slice(0, limit)
}
