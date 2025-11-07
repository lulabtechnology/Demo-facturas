import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { formatPanamaDateTime } from "./time"
import { nextInvoiceNumber } from "./storage"
import type { Order } from "@/store/orders"

export function buildInvoicePDF(order: Order) {
  const doc = new jsPDF()
  const invoiceNumber = order.invoiceNumber || nextInvoiceNumber()
  const issuedAt = new Date().toISOString()

  doc.setFontSize(18)
  doc.text("Factura (DEMO)", 14, 18)
  doc.setFontSize(11)
  doc.text(`No.: ${invoiceNumber}`, 14, 26)
  doc.text(`Fecha/Hora: ${formatPanamaDateTime(issuedAt)}`, 14, 33)

  doc.text("Emisor (DEMO):", 14, 43)
  doc.setFontSize(10)
  doc.text("Comercial Demo, S.A. | RUC: 000000-0-000000 | Panamá", 14, 49)
  doc.text("Dirección: Vía Mock 123, Ciudad de Panamá", 14, 55)

  doc.setFontSize(11)
  doc.text("Cliente:", 14, 67)
  doc.setFontSize(10)
  doc.text(`Nombre: ${order.customer.fullName}`, 14, 73)
  if (order.customer.idNumber) doc.text(`Cédula/RUC: ${order.customer.idNumber}`, 14, 79)
  doc.text(`Email: ${order.customer.email}`, 14, order.customer.idNumber ? 85 : 79)

  const itbmsAmount = +(order.product.price * order.itbmsRate).toFixed(2)
  const subtotal = +order.product.price.toFixed(2)
  const total = +(subtotal + itbmsAmount).toFixed(2)

  autoTable(doc, {
    startY: 95,
    head: [["Descripción", "Cantidad", "Precio (sin ITBMS)", "ITBMS", "Total"]],
    body: [[
      order.product.name,
      "1",
      `$${subtotal.toFixed(2)}`,
      `$${itbmsAmount.toFixed(2)}`,
      `$${total.toFixed(2)}`,
    ]],
    styles: { fontSize: 10 },
    headStyles: { fillColor: [14, 165, 233] },
    theme: "striped",
  })

  let y = (doc as any).lastAutoTable.finalY + 10
  doc.setFontSize(11)
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 140, y); y += 6
  doc.text(`ITBMS (${(order.itbmsRate * 100).toFixed(0)}%): $${itbmsAmount.toFixed(2)}`, 140, y); y += 6
  doc.text(`Total: $${total.toFixed(2)}`, 140, y); y += 16

  doc.setFontSize(9)
  doc.text("Documento de demostración. Sin validez fiscal. No es un comprobante real.", 14, y)

  const blob = doc.output("blob")
  return { blob, invoiceNumber }
}

export function openPdfInNewTab(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const win = window.open(url, "_blank")
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
  return win
}
