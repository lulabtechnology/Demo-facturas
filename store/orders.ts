"use client"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { ITBMS_RATE } from "@/lib/storage"

export type PaymentMethod = 'card' | 'yappy'
export type PaymentStatus = 'paid' | 'pending_review' | 'rejected'

export interface Product {
  id: string
  name: string
  description?: string
  price: number
}

export interface Customer {
  fullName: string
  idNumber?: string
  email: string
  phone?: string
}

export interface Order {
  id: string
  createdAt: string
  product: Product
  customer: Customer
  method: PaymentMethod
  status: PaymentStatus
  total: number
  itbmsRate: number
  yappyReceiptImage?: string
  invoiceNumber?: string
}

function uuid() {
  return crypto.randomUUID()
}

const demoProducts: Product[] = [
  { id: "p1", name: "Servicio Básico", description: "Configuración inicial (DEMO)", price: 50 },
  { id: "p2", name: "Membresía Pro", description: "Plan mensual (DEMO)", price: 99 },
  { id: "p3", name: "Consultoría Express", description: "Sesión 1h (DEMO)", price: 75 },
]

export type Filters = {
  status?: PaymentStatus | 'all'
  method?: PaymentMethod | 'all'
  q?: string
}

export interface OrdersState {
  products: Product[]
  orders: Order[]
  addOrder: (o: Omit<Order, 'id' | 'createdAt' | 'total' | 'itbmsRate'>) => Order
  updateOrder: (id: string, patch: Partial<Order>) => void
  seedIfEmpty: () => void
}

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      products: demoProducts,
      orders: [],
      addOrder: (o) => {
        const subtotal = o.product.price
        const total = +(subtotal * (1 + ITBMS_RATE)).toFixed(2)
        const order: Order = {
          ...o,
          id: uuid(),
          createdAt: new Date().toISOString(),
          itbmsRate: ITBMS_RATE,
          total,
        }
        set({ orders: [order, ...get().orders] })
        return order
      },
      updateOrder: (id, patch) => {
        set({ orders: get().orders.map(o => o.id === id ? { ...o, ...patch } : o) })
      },
      seedIfEmpty: () => {
        const has = get().orders.length > 0
        if (has) return
        const paid: Order = {
          id: uuid(),
          createdAt: new Date(Date.now() - 1000*60*60).toISOString(),
          product: demoProducts[1],
          customer: { fullName: "Cliente Tarjeta Demo", email: "card@example.com" },
          method: 'card',
          status: 'paid',
          itbmsRate: ITBMS_RATE,
          total: +(demoProducts[1].price * (1+ITBMS_RATE)).toFixed(2),
          invoiceNumber: "F-2025-0001",
        }
        const pending: Order = {
          id: uuid(),
          createdAt: new Date().toISOString(),
          product: demoProducts[0],
          customer: { fullName: "Cliente Yappy Demo", email: "yappy@example.com" },
          method: 'yappy',
          status: 'pending_review',
          itbmsRate: ITBMS_RATE,
          total: +(demoProducts[0].price * (1+ITBMS_RATE)).toFixed(2),
          yappyReceiptImage: undefined,
        }
        set({ orders: [pending, paid] })
      },
    }),
    {
      name: "mock-checkout-orders",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ orders: s.orders, products: s.products })
    }
  )
)
