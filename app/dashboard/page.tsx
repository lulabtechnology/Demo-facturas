import OrdersTable from "@/components/orders-table"

export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard (DEMO)</h1>
      <p className="text-muted-foreground">Aprueba pagos Yappy, genera/descarga facturas y envía (mock) al cliente.</p>
      <OrdersTable />
    </section>
  )
}
