"use client"

import { useState, useEffect } from "react"
import type { Subscription } from "@/types/subscription"
import { getSubscriptions, saveSubscriptions } from "@/lib/storage"

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = getSubscriptions()
    setSubscriptions(stored)
    setLoading(false)
  }, [])

  const addSubscription = (subscription: Omit<Subscription, "id">) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
    }
    const updated = [...subscriptions, newSubscription]
    setSubscriptions(updated)
    saveSubscriptions(updated)
  }

  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    const updated = subscriptions.map((sub) => (sub.id === id ? { ...sub, ...updates } : sub))
    setSubscriptions(updated)
    saveSubscriptions(updated)
  }

  const deleteSubscription = (id: string) => {
    const updated = subscriptions.filter((sub) => sub.id !== id)
    setSubscriptions(updated)
    saveSubscriptions(updated)
  }

  const getTotalMonthlySpending = () => {
    return subscriptions
      .filter((sub) => sub.isActive)
      .reduce((total, sub) => {
        const monthlyPrice = sub.billingCycle === "yearly" ? sub.price / 12 : sub.price
        return total + monthlyPrice
      }, 0)
  }

  const getTotalYearlySpending = () => {
    return subscriptions
      .filter((sub) => sub.isActive)
      .reduce((total, sub) => {
        const yearlyPrice = sub.billingCycle === "yearly" ? sub.price : sub.price * 12
        return total + yearlyPrice
      }, 0)
  }

  return {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getTotalMonthlySpending,
    getTotalYearlySpending,
  }
}
