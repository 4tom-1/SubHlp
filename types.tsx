export interface Subscription {
  id: string
  name: string
  price: number
  billingCycle: "monthly" | "yearly"
  nextPayment: string
  category: string
  color: string
  isActive: boolean
  notes?: string
}
