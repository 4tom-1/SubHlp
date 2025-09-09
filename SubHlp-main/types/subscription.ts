export interface PaymentMethod {
  id: string
  type: "credit_card" | "debit_card" | "bank_transfer" | "digital_wallet" | "other"
  name: string
  lastFourDigits?: string
  expiryDate?: string
  isDefault: boolean
  createdAt: string
}

export interface Subscription {
  id: string
  name: string
  price: number
  billingCycle: "monthly" | "yearly" | "trial" | "trial_ended"
  nextPayment: string
  category: string
  color: string
  status: "active" | "paused" | "cancelled" | "pending_cancellation" | "trial"
  serviceUrl?: string
  paymentUrl?: string
  paymentMethodId?: string
}

export interface NotificationSettings {
  email: boolean
  browser: boolean
  daysBeforePayment: number
}
