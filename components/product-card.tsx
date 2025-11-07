"use client"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/store/orders"
import { Button } from "./ui/button"

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="rounded-2xl border p-4 grid grid-cols-[96px,1fr] gap-4">
      <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-muted">
        <Image src={`/products/servicio-${product.id.at(-1)}.jpg`} alt={product.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-semibold">${product.price.toFixed(2)}</span>
          <Link href={{ pathname: "/checkout", query: { productId: product.id }}}>
            <Button>Comprar</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
