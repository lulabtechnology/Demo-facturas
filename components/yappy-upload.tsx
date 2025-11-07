"use client"
import { useState } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

export function YappyUpload({ value, onChange }: { value?: string; onChange: (v?: string) => void }) {
  const [preview, setPreview] = useState<string | undefined>(value)

  function handleFile(file?: File | null) {
    if (!file) { onChange(undefined); setPreview(undefined); return }
    if (!/image\/(png|jpe?g)/.test(file.type) || file.size > 3 * 1024 * 1024) {
      alert("Sube JPG/PNG ≤ 3MB")
      return
    }
    const fr = new FileReader()
    fr.onload = () => { const data = String(fr.result); setPreview(data); onChange(data) }
    fr.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="yappy">Comprobante (JPG/PNG) – DEMO</Label>
      <Input id="yappy" type="file" accept="image/png,image/jpeg" onChange={(e) => handleFile(e.target.files?.[0])} />
      {preview && (
        <div className="mt-2">
          <img src={preview} alt="Comprobante" className="max-h-60 rounded-xl border" />
        </div>
      )}
    </div>
  )
}
