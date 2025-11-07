"use client"
import { useOrders } from "@/store/orders"
import { ProductCard } from "@/components/product-card"
import { useEffect } from "react"

export default function Home() {
  const { products, seedIfEmpty } = useOrders()
  useEffect(() => { seedIfEmpty() }, [seedIfEmpty])

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Catálogo (DEMO)</h1>
        <p className="text-muted-foreground">Selecciona un producto/servicio para continuar al checkout.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
