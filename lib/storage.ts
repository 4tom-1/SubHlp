import type { Subscription, NotificationSettings } from "@/types/subscription"

const SUBSCRIPTIONS_KEY = "sub-suke-subscriptions"
const SETTINGS_KEY = "sub-suke-settings"

export const getSubscriptions = (): Subscription[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(SUBSCRIPTIONS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const saveSubscriptions = (subscriptions: Subscription[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions))
}

export const getSettings = (): NotificationSettings => {
  if (typeof window === "undefined") return { email: false, browser: false, daysBeforePayment: 3 }
  const stored = localStorage.getItem(SETTINGS_KEY)
  return stored ? JSON.parse(stored) : { email: false, browser: false, daysBeforePayment: 3 }
}

export const saveSettings = (settings: NotificationSettings) => {
  if (typeof window === "undefined") return
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
