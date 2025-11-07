"use client"
import { useMemo, useState } from "react"
import { useOrders, type Order } from "@/store/orders"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPanamaDateTime } from "@/lib/time"
import { buildInvoicePDF, openPdfInNewTab } from "@/lib/invoice"
import { InvoicePreview } from "./invoice-preview"
import { ReceiptModal } from "./receipt-modal"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { useToast } from "./ui/use-toast"

export default function OrdersTable() {
  const { orders, updateOrder } = useOrders()
  const { toast } = useToast()
  const [status, setStatus] = useState<'all'|'paid'|'pending_review'|'rejected'>('all')
  const [method, setMethod] = useState<'all'|'card'|'yappy'>('all')
  const [q, setQ] = useState("")

  const [previewUrl, setPreviewUrl] = useState<string | undefined>()
  const [showInvoice, setShowInvoice] = useState(false)
  const [receiptSrc, setReceiptSrc] = useState<string | undefined>()
  const [showReceipt, setShowReceipt] = useState(false)

  const filtered = useMemo(() => orders.filter(o => {
    if (status !== 'all' && o.status !== status) return false
    if (method !== 'all' && o.method !== method) return false
    const needle = q.trim().toLowerCase()
    if (needle && !(`${o.customer.fullName} ${o.customer.email}`.toLowerCase().includes(needle))) return false
    return true
  }), [orders, status, method, q])

  function approveYappy(o: Order) {
    const { blob, invoiceNumber } = buildInvoicePDF(o)
    updateOrder(o.id, { status: 'paid', invoiceNumber })
    openPdfInNewTab(blob)
    toast({ title: "Pago aprobado (DEMO)", description: "Factura generada." })
  }

  function rejectYappy(o: Order) {
    const reason = prompt("Motivo de rechazo (opcional)") || undefined
    updateOrder(o.id, { status: 'rejected' })
    toast({ title: "Pago rechazado (DEMO)", description: reason || "" })
  }

  function viewDownloadInvoice(o: Order) {
    const { blob } = buildInvoicePDF(o)
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)
    setShowInvoice(true)
  }

  function sendInvoice(_: Order) {
    toast({ title: "Factura enviada (DEMO)", description: "Enviada al correo satisfactoriamente." })
  }

  function viewReceipt(o: Order) {
    if (!o.yappyReceiptImage) return
    setReceiptSrc(o.yappyReceiptImage)
    setShowReceipt(true)
  }

  function StatusBadge({ s }: { s: Order['status']}) {
    const map = {
      paid: "bg-green-600 text-white",
      pending_review: "bg-yellow-500 text-white",
      rejected: "bg-red-600 text-white",
    } as const
    return <Badge className={map[s]}>{s}</Badge>
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-3">
        <div>
          <Label>Estado</Label>
          <select className="w-full border rounded-xl h-10 px-3" value={status} onChange={e=>setStatus(e.target.value as any)}>
            <option value="all">Todos</option>
            <option value="paid">paid</option>
            <option value="pending_review">pending_review</option>
            <option value="rejected">rejected</option>
          </select>
        </div>
        <div>
          <Label>Método</Label>
          <select className="w-full border rounded-xl h-10 px-3" value={method} onChange={e=>setMethod(e.target.value as any)}>
            <option value="all">Todos</option>
            <option value="card">Tarjeta</option>
            <option value="yappy">Yappy</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Label>Buscar</Label>
          <Input placeholder="Nombre o email" value={q} onChange={e=>setQ(e.target.value)} />
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha/Hora</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(o => (
              <TableRow key={o.id}>
                <TableCell className="whitespace-nowrap">{formatPanamaDateTime(o.createdAt)}</TableCell>
                <TableCell>
                  <div className="font-medium">{o.customer.fullName}</div>
                  <div className="text-xs text-muted-foreground">{o.customer.email}</div>
                </TableCell>
                <TableCell>{o.product.name}</TableCell>
                <TableCell>{o.method === 'card' ? 'Tarjeta' : 'Yappy'}</TableCell>
                <TableCell><StatusBadge s={o.status} /></TableCell>
                <TableCell className="text-right">${o.total.toFixed(2)}</TableCell>
                <TableCell className="space-x-2 whitespace-nowrap">
                  {o.method === 'yappy' && o.yappyReceiptImage && (
                    <Button variant="secondary" onClick={()=>viewReceipt(o)}>Ver comprobante</Button>
                  )}
                  {o.method === 'yappy' && o.status === 'pending_review' && (
                    <>
                      <Button onClick={()=>approveYappy(o)}>Aprobar</Button>
                      <Button variant="destructive" onClick={()=>rejectYappy(o)}>Rechazar</Button>
                    </>
                  )}
                  {o.status === 'paid' && (
                    <>
                      <Button variant="secondary" onClick={()=>viewDownloadInvoice(o)}>Ver/Descargar factura</Button>
                      <Button onClick={()=>sendInvoice(o)}>Enviar factura al cliente</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">Sin resultados</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <InvoicePreview open={showInvoice} onOpenChange={setShowInvoice} url={previewUrl} />
      <ReceiptModal open={showReceipt} onOpenChange={setShowReceipt} src={receiptSrc} />
    </div>
  )
}
