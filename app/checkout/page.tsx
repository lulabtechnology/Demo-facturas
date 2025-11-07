import { Suspense } from "react"
import CheckoutForm from "@/components/checkout-form"

// Evita prerender/SSG y asegura CSR para los hooks del router
export const dynamic = "force-dynamic"
export const revalidate = 0

export default function CheckoutPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Checkout (DEMO)</h1>

      {/* useSearchParams() dentro de un Suspense boundary */}
      <Suspense fallback={<div className="text-sm text-muted-foreground">Cargando checkout…</div>}>
        <CheckoutForm />
      </Suspense>
    </section>
  )
}
