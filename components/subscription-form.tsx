"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Subscription } from "@/types/subscription"

interface SubscriptionFormProps {
  onSubmit: (subscription: Omit<Subscription, "id">) => void
  onCancel: () => void
  initialData?: Subscription
}

const categories = [
  "動画配信",
  "音楽",
  "クラウドストレージ",
  "学習・教育",
  "ゲーム",
  "ニュース・雑誌",
  "ビジネスツール",
  "その他",
]

const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

export function SubscriptionForm({ onSubmit, onCancel, initialData }: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    billingCycle: initialData?.billingCycle || ("monthly" as const),
    nextPayment: initialData?.nextPayment || "",
    category: initialData?.category || "",
    color: initialData?.color || colors[0],
    isActive: initialData?.isActive ?? true,
  })

  const [errors, setErrors] = useState<{
    name?: boolean;
    price?: boolean;
    nextPayment?: boolean;
    category?: boolean;
  }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = {
      name: !formData.name,
      price: !formData.price || Number(formData.price) <= 0,
      nextPayment: !formData.nextPayment,
      category: !formData.category,
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(error => error)) {
      if (Number(formData.price) <= 0) {
        alert("料金は0円より大きい値を入力してください")
      } else {
        alert("必須項目を入力してください")
      }
      return
    }
    onSubmit({
      ...formData,
      price: Number(formData.price)
    })
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "サブスクリプション編集" : "新しいサブスクリプション追加"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>サービス名 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                setErrors(prev => ({ ...prev, name: false }))
              }}
              placeholder="Netflix, Spotify など"
              required
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className={errors.price ? "text-red-500" : ""}>料金 *</Label>
              <Input
                id="price"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.price}
                onChange={(e) => {
                  const value = e.target.value;
                  // 数値以外の文字を除去
                  const numericValue = value.replace(/[^0-9]/g, '');
                  setFormData({ ...formData, price: numericValue })
                  setErrors(prev => ({ ...prev, price: false }))
                }}
                placeholder="金額を入力してください"
                required
                className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  errors.price ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              />
            </div>

            <div>
              <Label htmlFor="billingCycle">請求サイクル *</Label>
              <Select
                value={formData.billingCycle}
                onValueChange={(value: "monthly" | "yearly") => setFormData({ ...formData, billingCycle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">月額</SelectItem>
                  <SelectItem value="yearly">年額</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="nextPayment" className={errors.nextPayment ? "text-red-500" : ""}>次回支払日 *</Label>
            <Input
              id="nextPayment"
              type="date"
              value={formData.nextPayment}
              onChange={(e) => {
                setFormData({ ...formData, nextPayment: e.target.value })
                setErrors(prev => ({ ...prev, nextPayment: false }))
              }}
              required
              className={errors.nextPayment ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
          </div>

          <div>
            <Label htmlFor="category" className={errors.category ? "text-red-500" : ""}>カテゴリ *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => {
                setFormData({ ...formData, category: value })
                setErrors(prev => ({ ...prev, category: false }))
              }}
            >
              <SelectTrigger className={errors.category ? "border-red-500 focus-visible:ring-red-500" : ""}>
                <SelectValue placeholder="カテゴリを選択" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>カラー</Label>
            <div className="flex space-x-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${
                    formData.color === color ? "border-gray-800" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" className="flex-1">
              {initialData ? "更新" : "追加"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
