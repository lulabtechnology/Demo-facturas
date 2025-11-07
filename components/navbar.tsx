"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "./ui/badge"

export default function Navbar() {
  const pathname = usePathname()
  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-xl text-sm font-medium",
        pathname === href ? "bg-accent text-white" : "hover:bg-secondary"
      )}
    >
      {label}
    </Link>
  )
  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Mock Checkout</Link>
        <nav className="flex items-center gap-2">
          {link("/", "Inicio")}
          {link("/checkout", "Checkout")}
          {link("/dashboard", "Dashboard")}
          <Badge className="ml-2">DEMO</Badge>
        </nav>
      </div>
    </header>
  )
}
