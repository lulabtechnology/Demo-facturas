"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

// Simple Tabs with internal context (shadcn-like API)
const TabsCtx = React.createContext<{ value: string; set: (v:string)=>void }|null>(null)

export function Tabs({ value, onValueChange, className, children }: { value: string; onValueChange: (v:string)=>void; className?: string; children: React.ReactNode }) {
  return (
    <TabsCtx.Provider value={{ value, set: onValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsCtx.Provider>
  )
}
export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("inline-grid gap-2 rounded-xl border p-1 w-full", className)}>{children}</div>
}
export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsCtx)
  const active = ctx?.value === value
  return (
    <button
      onClick={() => ctx?.set(value)}
      className={cn("h-9 rounded-lg px-3 text-sm", active ? "bg-accent text-white" : "hover:bg-secondary")}
      aria-pressed={active}
      type="button"
    >{children}</button>
  )
}
export function TabsContent({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(TabsCtx)
  if (ctx?.value !== value) return null
  return <div className={className}>{children}</div>
}
