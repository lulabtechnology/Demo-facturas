"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"

export function InvoicePreview({ open, onOpenChange, url }: { open: boolean; onOpenChange: (v:boolean)=>void; url?: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Factura (DEMO)</DialogTitle>
        </DialogHeader>
        {url ? (
          <iframe src={url} className="w-full h-[70vh] rounded" />
        ) : (
          <p className="text-sm text-muted-foreground">No hay vista previa.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
