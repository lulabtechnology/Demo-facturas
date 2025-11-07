"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v:boolean)=>void; children: React.ReactNode }) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onOpenChange(false) }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onClick={()=>onOpenChange(false)}>
      <div className="w-full max-w-2xl rounded-2xl bg-white p-4" onClick={(e)=>e.stopPropagation()}>{children}</div>
    </div>
  )
}
export function DialogContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />
}
export function DialogHeader({ children }: { children: React.ReactNode }) { return <div className="mb-3">{children}</div> }
export function DialogTitle({ children }: { children: React.ReactNode }) { return <h3 className="text-lg font-semibold">{children}</h3> }
