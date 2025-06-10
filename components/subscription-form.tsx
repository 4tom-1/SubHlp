"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Subscription } from "@/types/subscription"
import { Textarea } from "@/components/ui/textarea"

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
    price: initialData?.price || 0,
    billingCycle: initialData?.billingCycle || ("monthly" as const),
    nextPayment: initialData?.nextPayment || "",
    category: initialData?.category || "",
    color: initialData?.color || colors[0],
    isActive: initialData?.isActive ?? true,
    notes: initialData?.notes || "", // メモフィールドを追加
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.nextPayment || !formData.category) {
      alert("すべての必須項目を入力してください")
      return
    }
    onSubmit(formData)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{initialData ? "サブスクリプション編集" : "新しいサブスクリプション追加"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">サービス名 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Netflix, Spotify など"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">料金 *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="1000"
                required
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
            <Label htmlFor="nextPayment">次回支払日 *</Label>
            <Input
              id="nextPayment"
              type="date"
              value={formData.nextPayment}
              onChange={(e) => setFormData({ ...formData, nextPayment: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">カテゴリ *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
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

          <div>
            <Label htmlFor="notes">メモ（任意）</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="アカウント情報、使用頻度、解約予定など..."
              rows={3}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              アカウント情報や使用状況など、このサブスクリプションに関するメモを記録できます
            </p>
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
