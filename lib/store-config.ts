export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
}

export interface StoreConfig {
  storeId: string
  apiUrl: string
  business: {
    socialMedia: {
      instagram: string
      facebook: string
    }
    name: string
    phone: string
    email: string
    description: string
    address: string
    whatsapp: string
  }
  branding: {
    logo: string
    banner: string
    bannerTitle: string
    bannerSubtitle: string
    colorScheme: {
      name: string
      primary: string
      secondary: string
      accent: string
      background: string
    }
  }
  settings: {
    showStock: boolean
    allowOrders: boolean
    orderMethod: string
    showPrices: boolean
    currency: string
    currencySymbol: string
  }
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  typography: {
    fontScheme: "elegant" | "modern" | "classic"
  }
  analytics: Record<string, unknown>
}

export async function getStoreConfig(): Promise<StoreConfig> {
  // En desarrollo y producción SSR, leemos del sistema de archivos
  if (typeof window === "undefined") {
    const fs = await import("fs/promises")
    const path = await import("path")

    const configPath = path.join(process.cwd(), "public", "config", "store-config.json")
    const fileContent = await fs.readFile(configPath, "utf-8")
    return JSON.parse(fileContent)
  }

  // En el cliente o static export, usamos fetch con URL absoluta
  const response = await fetch("/config/store-config.json")
  if (!response.ok) {
    throw new Error("Failed to load store configuration")
  }
  return response.json()
}
