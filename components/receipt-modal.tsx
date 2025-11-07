"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

export function ReceiptModal({ open, onOpenChange, src }: { open: boolean; onOpenChange: (v:boolean)=>void; src?: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comprobante Yappy (DEMO)</DialogTitle>
        </DialogHeader>
        {src ? <img src={src} alt="Comprobante" className="max-h-[70vh] rounded" /> : <p className="text-sm">Sin imagen.</p>}
      </DialogContent>
    </Dialog>
  )
}
