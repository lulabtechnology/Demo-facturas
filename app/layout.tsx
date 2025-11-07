import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: "Mock Checkout (DEMO)",
  description: "Demo de compra con Tarjeta/Yappy y dashboard de revisión (sin cobros reales)",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
        <Toaster />
        <footer className="border-t mt-10 py-6 text-sm text-muted-foreground text-center">
          Demo/MOCK – No usar datos reales.
        </footer>
      </body>
    </html>
  )
}
