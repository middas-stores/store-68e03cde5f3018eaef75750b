import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartSidebar } from "@/components/cart-sidebar"
import { Suspense } from "react"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Boutique Elegance - Moda y Estilo",
  description: "Tienda online de moda exclusiva",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${inter.variable} ${playfair.variable}`}>
        <CartProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Header />
            <main>{children}</main>
            <Footer />
            <CartSidebar />
          </Suspense>
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
