"use client"

import { useState, useEffect } from "react"
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, runTransaction, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { PaymentMethod } from "@/types/subscription"
import { useAuth } from "@/app/contexts/AuthContext"

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setPaymentMethods([])
      setLoading(false)
      return
    }

    const q = query(collection(db, "paymentMethods"), where("userId", "==", user.uid))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const paymentMethodData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PaymentMethod[]
      setPaymentMethods(paymentMethodData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, "id" | "createdAt">) => {
    if (!user) throw new Error("ユーザーがログインしていません")
    
    try {
      // 新しい支払い方法をデフォルトにする場合、他の支払い方法をデフォルトから外す
      if (paymentMethod.isDefault) {
        const defaultMethods = paymentMethods.filter(pm => pm.isDefault)
        for (const method of defaultMethods) {
          await updateDoc(doc(db, "paymentMethods", method.id), {
            isDefault: false,
            updatedAt: new Date().toISOString()
          })
        }
      }

      // undefinedのフィールドを除外
      const dataToSave: any = { ...paymentMethod, userId: user.uid, createdAt: new Date().toISOString() }
      Object.keys(dataToSave).forEach(key => {
        if (dataToSave[key] === undefined) {
          delete dataToSave[key]
        }
      })

      await addDoc(collection(db, "paymentMethods"), dataToSave)
    } catch (error) {
      console.error("Error adding payment method:", error)
      throw error
    }
  }

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    if (!user) throw new Error("ユーザーがログインしていません")

    try {
      // デフォルトに設定する場合はトランザクションで排他制御
      if (updates.isDefault) {
        const q = query(collection(db, "paymentMethods"), where("userId", "==", user.uid))
        await runTransaction(db, async (transaction) => {
          const snapshot = await getDocs(q)
          snapshot.forEach((docSnap) => {
            const isTarget = docSnap.id === id
            transaction.update(docSnap.ref, {
              isDefault: isTarget,
              updatedAt: new Date().toISOString()
            })
          })
        })
        return
      }

      const paymentMethodRef = doc(db, "paymentMethods", id)
      await updateDoc(paymentMethodRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error("Error updating payment method:", error)
      throw error
    }
  }

  const deletePaymentMethod = async (id: string) => {
    if (!user) throw new Error("ユーザーがログインしていません")

    try {
      const paymentMethodRef = doc(db, "paymentMethods", id)
      await deleteDoc(paymentMethodRef)
    } catch (error) {
      console.error("Error deleting payment method:", error)
      throw error
    }
  }

  const getDefaultPaymentMethod = () => {
    return paymentMethods.find(pm => pm.isDefault) || null
  }

  const getPaymentMethodById = (id: string) => {
    return paymentMethods.find(pm => pm.id === id) || null
  }

  return {
    paymentMethods,
    loading,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    getDefaultPaymentMethod,
    getPaymentMethodById,
  }
} 