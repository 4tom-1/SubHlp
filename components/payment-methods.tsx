"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Trash2, Edit, Plus } from "lucide-react"
import type { PaymentMethod } from "@/types/subscription"
import { usePaymentMethods } from "@/hooks/usePaymentMethods"

interface PaymentMethodFormProps {
  onSubmit: (paymentMethod: Omit<PaymentMethod, "id" | "createdAt">) => void
  onCancel: () => void
  initialData?: PaymentMethod
}

const paymentTypes = [
  { value: "credit_card", label: "クレジットカード" },
  { value: "debit_card", label: "デビットカード" },
  { value: "bank_transfer", label: "銀行振込" },
  { value: "digital_wallet", label: "デジタルウォレット" },
  { value: "other", label: "その他" },
]

export function PaymentMethodForm({ onSubmit, onCancel, initialData }: PaymentMethodFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || ("credit_card" as const),
    name: initialData?.name || "",
    lastFourDigits: initialData?.lastFourDigits || "",
    expiryDate: initialData?.expiryDate || "",
    isDefault: initialData?.isDefault || false,
  })

  const [errors, setErrors] = useState<{
    name?: boolean;
    lastFourDigits?: boolean;
    expiryDate?: boolean;
  }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      name: !formData.name,
      lastFourDigits: formData.type === "credit_card" || formData.type === "debit_card" ? !formData.lastFourDigits : false,
      expiryDate: formData.type === "credit_card" || formData.type === "debit_card" ? !formData.expiryDate : false,
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(error => error)) {
      alert("必須項目を入力してください")
      return
    }

    onSubmit({
      type: formData.type,
      name: formData.name,
      lastFourDigits: formData.lastFourDigits || undefined,
      expiryDate: formData.expiryDate || undefined,
      isDefault: formData.isDefault,
    })
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">
          {initialData ? "支払い方法編集" : "新しい支払い方法追加"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type" className="text-sm">支払い方法の種類 *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: PaymentMethod["type"]) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="name" className={`text-sm ${errors.name ? "text-red-500" : ""}`}>
              支払い方法名 *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                setErrors(prev => ({ ...prev, name: false }))
              }}
              placeholder="例: VISAカード、PayPal、銀行口座"
              className={`text-sm ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
          </div>

          {(formData.type === "credit_card" || formData.type === "debit_card") && (
            <>
              <div>
                <Label htmlFor="lastFourDigits" className={`text-sm ${errors.lastFourDigits ? "text-red-500" : ""}`}>
                  下4桁 *
                </Label>
                <Input
                  id="lastFourDigits"
                  value={formData.lastFourDigits}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                    setFormData({ ...formData, lastFourDigits: value })
                    setErrors(prev => ({ ...prev, lastFourDigits: false }))
                  }}
                  placeholder="1234"
                  maxLength={4}
                  className={`text-sm ${errors.lastFourDigits ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>

              <div>
                <Label htmlFor="expiryDate" className={`text-sm ${errors.expiryDate ? "text-red-500" : ""}`}>
                  有効期限 *
                </Label>
                <Input
                  id="expiryDate"
                  type="month"
                  value={formData.expiryDate}
                  onChange={(e) => {
                    setFormData({ ...formData, expiryDate: e.target.value })
                    setErrors(prev => ({ ...prev, expiryDate: false }))
                  }}
                  className={`text-sm ${errors.expiryDate ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>
            </>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
            />
            <Label htmlFor="isDefault" className="text-sm">デフォルトの支払い方法に設定</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {initialData ? "更新" : "追加"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

interface PaymentMethodListItemProps {
  pm: PaymentMethod
  idx: number
  handleSetDefault: (id: string) => void
  setEditingId: (id: string) => void
  handleDelete: (id: string) => void
  getPaymentTypeLabel: (type: PaymentMethod["type"]) => string
}
function PaymentMethodListItem({ pm, idx, handleSetDefault, setEditingId, handleDelete, getPaymentTypeLabel }: PaymentMethodListItemProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50 + idx * 60)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <div
      className={
        `flex items-center p-3 border rounded-lg bg-white shadow-sm transition-all duration-300 opacity-0 translate-y-4` +
        (mounted ? " opacity-100 translate-y-0" : "")
      }
      style={{ transitionDelay: `${idx * 60}ms` }}
    >
      <CardContent className="p-4 w-full">
        <div className="flex flex-col gap-1 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-2 min-w-0">
              <CreditCard className="h-5 w-5 text-gray-600 mr-1 flex-shrink-0" />
              <div className="font-medium mr-2 truncate">{pm.name}</div>
              <span className="text-sm text-gray-500 truncate hidden sm:inline-block">
                {getPaymentTypeLabel(pm.type)}
                {pm.lastFourDigits && ` ・****${pm.lastFourDigits}`}
                {pm.expiryDate && ` ・${pm.expiryDate}`}
              </span>
            </div>
            <div className="flex items-center gap-x-2 flex-shrink-0">
              {pm.isDefault ? (
                <Badge variant="secondary" className="text-xs">デフォルト</Badge>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSetDefault(pm.id)}
                  className="px-2 py-1 text-xs h-7"
                >
                  デフォルトに設定
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingId(pm.id)}
                className="px-2 py-1 h-7"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(pm.id)}
                className="px-2 py-1 h-7"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-gray-500 ml-7 sm:hidden">
            {getPaymentTypeLabel(pm.type)}
            {pm.lastFourDigits && ` ・****${pm.lastFourDigits}`}
            {pm.expiryDate && ` ・${pm.expiryDate}`}
          </div>
        </div>
      </CardContent>
    </div>
  )
}

export function PaymentMethodsList() {
  const { paymentMethods, loading, deletePaymentMethod, updatePaymentMethod, addPaymentMethod } = usePaymentMethods()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleDelete = async (id: string) => {
    if (confirm("この支払い方法を削除しますか？")) {
      try {
        await deletePaymentMethod(id)
      } catch (error) {
        alert("削除に失敗しました")
      }
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await updatePaymentMethod(id, { isDefault: true })
    } catch (error) {
      alert("デフォルト設定に失敗しました")
    }
  }

  const getPaymentTypeLabel = (type: PaymentMethod["type"]) => {
    return paymentTypes.find(pt => pt.value === type)?.label || type
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">支払い方法</h3>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          追加
        </Button>
      </div>

      {showForm && (
        <PaymentMethodForm
          onSubmit={async (paymentMethod) => {
            try {
              await addPaymentMethod(paymentMethod)
              setShowForm(false)
            } catch (error) {
              alert("支払い方法の追加に失敗しました")
            }
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingId && (() => {
        const editingMethod = paymentMethods.find(pm => pm.id === editingId)
        return editingMethod ? (
          <PaymentMethodForm
            initialData={editingMethod}
            onSubmit={async (paymentMethod) => {
              try {
                await updatePaymentMethod(editingId, paymentMethod)
                setEditingId(null)
              } catch (error) {
                alert("支払い方法の更新に失敗しました")
              }
            }}
            onCancel={() => setEditingId(null)}
          />
        ) : null
      })()}

      {paymentMethods.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          支払い方法が登録されていません
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((pm, idx) => (
            <PaymentMethodListItem
              key={pm.id}
              pm={pm}
              idx={idx}
              handleSetDefault={handleSetDefault}
              setEditingId={setEditingId}
              handleDelete={handleDelete}
              getPaymentTypeLabel={getPaymentTypeLabel}
            />
          ))}
        </div>
      )}
    </div>
  )
} 