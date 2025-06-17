"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Subscription } from "@/types/subscription"
import { useAuth } from "./useAuth"

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setSubscriptions([])
      setLoading(false)
      return
    }

    const q = query(collection(db, "subscriptions"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subscriptionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subscription[]
      setSubscriptions(subscriptionData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addSubscription = async (subscription: Omit<Subscription, "id">) => {
    if (!user) throw new Error("ユーザーがログインしていません")
    
    try {
      await addDoc(collection(db, "subscriptions"), {
        ...subscription,
        userId: user.uid,
        createdAt: new Date().toISOString()
      })
    } catch (error) {
      console.error("Error adding subscription:", error)
      throw error
    }
  }

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    if (!user) throw new Error("ユーザーがログインしていません")

    try {
      const subscriptionRef = doc(db, "subscriptions", id)
      await updateDoc(subscriptionRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error("Error updating subscription:", error)
      throw error
    }
  }

  const deleteSubscription = async (id: string) => {
    if (!user) throw new Error("ユーザーがログインしていません")

    try {
      const subscriptionRef = doc(db, "subscriptions", id)
      await deleteDoc(subscriptionRef)
    } catch (error) {
      console.error("Error deleting subscription:", error)
      throw error
    }
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
