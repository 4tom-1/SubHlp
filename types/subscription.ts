export interface Subscription {
  id: string
  name: string
  price: number
  billingCycle: "monthly" | "yearly"
  nextPayment: string
  category: string
  color: string
  status: "active" | "paused" | "cancelled" | "pending_cancellation" | "trial"
  serviceUrl?: string
  paymentUrl?: string
}

export interface NotificationSettings {
  email: boolean
  browser: boolean
  daysBeforePayment: number
}
