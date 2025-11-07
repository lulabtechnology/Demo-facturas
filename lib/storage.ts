export const ITBMS_RATE = 0.07
const INVOICE_COUNTER_KEY = "invoiceCounter"

export function nextInvoiceNumber(): string {
  const year = new Date().toLocaleDateString("es-PA", { timeZone: "America/Panama", year: "numeric" })
  const current = Number(localStorage.getItem(INVOICE_COUNTER_KEY) || "0") + 1
  localStorage.setItem(INVOICE_COUNTER_KEY, String(current))
  return `F-${year}-${String(current).padStart(4, "0")}`
}
