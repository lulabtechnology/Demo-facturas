"use client"
import * as React from "react"

export function Toaster() {
  const [items, setItems] = React.useState<{ id: number; title: string; description?: string }[]>([])
  React.useEffect(() => {
    (window as any).__toast = (title: string, description?: string) => {
      const id = Date.now()
      setItems((prev) => [...prev, { id, title, description }])
      setTimeout(() => setItems((prev) => prev.filter(i => i.id !== id)), 3000)
    }
  }, [])
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {items.map(i => (
        <div key={i.id} className="rounded-xl bg-black text-white px-4 py-3 shadow">
          <div className="font-medium">{i.title}</div>
          {i.description && <div className="text-sm opacity-90">{i.description}</div>}
        </div>
      ))}
    </div>
  )
}
