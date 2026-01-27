import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { DynamicColorProvider } from "@/components/dynamic-color-provider"
import { FloatingWhatsAppWrapper } from "@/components/floating-whatsapp-wrapper"
import { Suspense } from "react"
import { getStoreConfig } from "@/lib/store-config"
import { getFontScheme } from "@/lib/font-schemes"

export async function generateMetadata(): Promise<Metadata> {
  const config = await getStoreConfig()

  return {
    title: config.seo.title,
    description: config.seo.description,
    keywords: config.seo.keywords.join(", "),
    openGraph: {
      title: config.seo.title,
      description: config.seo.description,
      images: [config.branding.logo],
    },
    twitter: {
      card: "summary_large_image",
      title: config.seo.title,
      description: config.seo.description,
      images: [config.branding.logo],
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const config = await getStoreConfig()
  const fontScheme = getFontScheme(config.branding.typography.fontScheme)

  return (
    <html lang="es">
      <body className={`${fontScheme.body.variable} ${fontScheme.heading.variable}`}>
        <CartProvider>
          <DynamicColorProvider config={config} />
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartSidebar />
            <FloatingWhatsAppWrapper />
          </Suspense>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
