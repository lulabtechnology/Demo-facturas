"use client"
import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useOrders, type Product } from "@/store/orders"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { YappyUpload } from "./yappy-upload"
import { useToast } from "@/components/ui/use-toast"
import { buildInvoicePDF, openPdfInNewTab } from "@/lib/invoice"

export default function CheckoutForm() {
  const params = useSearchParams()
  const { products, addOrder, updateOrder } = useOrders()
  const router = useRouter()
  const { toast } = useToast()

  // Garantizamos que SIEMPRE haya un Product (usa el primero como fallback)
  const product: Product = useMemo(() => {
    const id = params.get("productId")
    return products.find(p => p.id === id) ?? products[0]
  }, [products, params])

  const [method, setMethod] = useState<'card'|'yappy'>("card")
  const [yappyImg, setYappyImg] = useState<string | undefined>()

  // Cliente
  const [fullName, setFullName] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Tarjeta (mock)
  const [cardNumber, setCardNumber] = useState("")
  const [exp, setExp] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")

  // Totales
  const subtotal = product.price
  const itbms = +(product.price * 0.07).toFixed(2)
  const total = +(subtotal + itbms).toFixed(2)

  function validEmail(v: string) { return /.+@.+\..+/.test(v) }

  function validateCommon() {
    if (!fullName.trim()) return "Nombre obligatorio"
    if (!validEmail(email)) return "Email inválido"
    return null
  }

  function handleConfirm() {
    const commonErr = validateCommon()
    if (commonErr) { toast({ title: "Error", description: commonErr }); return }

    if (method === 'card') {
      // Validaciones simples (DEMO)
      if (cardNumber.replace(/\s+/g, '').length < 12) { toast({ title: "Error", description: "Número de tarjeta inválido (DEMO)"}); return }
      if (!/^[0-9]{2}\/[0-9]{2}$/.test(exp)) { toast({ title: "Error", description: "MM/AA inválido (DEMO)"}); return }
      if (cvv.length < 3) { toast({ title: "Error", description: "CVV inválido (DEMO)"}); return }
      if (!cardName.trim()) { toast({ title: "Error", description: "Nombre en la tarjeta requerido (DEMO)"}); return }

      // Crear orden pagada
      const order = addOrder({
        product, // <-- ahora es Product, no puede ser undefined
        customer: { fullName, idNumber: idNumber || undefined, email, phone: phone || undefined },
        method: 'card',
        status: 'paid',
      })

      // Generar factura
      const { blob, invoiceNumber } = buildInvoicePDF(order)
      updateOrder(order.id, { invoiceNumber })
      openPdfInNewTab(blob)
      toast({ title: "Pago exitoso (DEMO)", description: "Factura generada." })
      router.push("/dashboard")
      return
    }

    // Yappy (pending)
    if (!yappyImg) { toast({ title: "Error", description: "Sube el comprobante Yappy (DEMO)"}); return }
    const order = addOrder({
      product, // <-- garantizado
      customer: { fullName, idNumber: idNumber || undefined, email, phone: phone || undefined },
      method: 'yappy',
      status: 'pending_review',
      yappyReceiptImage: yappyImg,
    })
    toast({ title: "Pago enviado (DEMO)", description: "Sujeto a revisión." })
    router.push("/dashboard")
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Resumen</h2>
        <div className="rounded-2xl border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span>{product.name}</span><span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>ITBMS 7%</span><span>${itbms.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold border-t pt-2">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">**DEMO**: No ingreses datos reales de tarjeta.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Datos del cliente</h2>
        <div className="space-y-3">
          <div>
            <Label htmlFor="fullName">Nombre completo *</Label>
            <Input id="fullName" value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Juan Pérez" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="idNumber">Cédula / RUC (opcional)</Label>
              <Input id="idNumber" value={idNumber} onChange={e=>setIdNumber(e.target.value)} placeholder="8-000-000" />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono (opcional)</Label>
              <Input id="phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="6000-0000" />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="correo@demo.com" />
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-6">Método de pago</h2>
        <Tabs value={method} onValueChange={(v)=>setMethod(v as any)} className="mt-2">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="card">Tarjeta (Mock)</TabsTrigger>
            <TabsTrigger value="yappy">Yappy (Mock)</TabsTrigger>
          </TabsList>
          <TabsContent value="card" className="space-y-3 mt-3">
            <div>
              <Label>Número de tarjeta (DEMO)</Label>
              <Input inputMode="numeric" placeholder="4111 1111 1111 1111" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>MM/AA</Label>
                <Input placeholder="12/29" value={exp} onChange={e=>setExp(e.target.value)} />
              </div>
              <div>
                <Label>CVV</Label>
                <Input placeholder="123" value={cvv} onChange={e=>setCvv(e.target.value)} />
              </div>
              <div>
                <Label>Nombre en la tarjeta</Label>
                <Input placeholder="JUAN PEREZ" value={cardName} onChange={e=>setCardName(e.target.value)} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="yappy" className="mt-3">
            <YappyUpload value={yappyImg} onChange={setYappyImg} />
          </TabsContent>
        </Tabs>

        <div className="pt-4 flex gap-2">
          <Button className="w-full" onClick={handleConfirm}>Confirmar</Button>
        </div>
      </section>
    </div>
  )
}
