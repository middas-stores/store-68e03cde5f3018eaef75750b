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
  analytics: Record<string, unknown>
}

export async function getStoreConfig(): Promise<StoreConfig> {
  const response = await fetch("/config/store-config.json")
  if (!response.ok) {
    throw new Error("Failed to load store configuration")
  }
  return response.json()
}
