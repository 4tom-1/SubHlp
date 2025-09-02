"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, ExternalLink, Check, CreditCard } from "lucide-react"
import type { Subscription } from "@/types/subscription"
import { findServiceByName, searchServices, type SubscriptionService } from "@/lib/subscription-services"
import { usePaymentMethods } from "@/hooks/usePaymentMethods"

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

const statuses = [
  { value: "active", label: "利用中" },
  { value: "paused", label: "一時停止中" },
  { value: "cancelled", label: "解約済み" },
  { value: "pending_cancellation", label: "解約予定" },
  { value: "trial", label: "トライアル中" },
]

const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#84CC16"]

export function SubscriptionForm({ onSubmit, onCancel, initialData }: SubscriptionFormProps) {
  const { paymentMethods } = usePaymentMethods()
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    billingCycle: initialData?.billingCycle || ("monthly" as const),
    nextPayment: initialData?.nextPayment || "",
    category: initialData?.category || "",
    color: initialData?.color || colors[0],
    status: initialData?.status || ("active" as const),
    paymentMethodId: initialData?.paymentMethodId || "none",
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SubscriptionService[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [detectedService, setDetectedService] = useState<SubscriptionService | null>(null)

  const [errors, setErrors] = useState<{
    name?: boolean;
    price?: boolean;
    nextPayment?: boolean;
    category?: boolean;
    status?: boolean;
  }>({})

  const [nextPaymentType, setNextPaymentType] = useState<"date" | "fromRegister" | "monthlyDay">("monthlyDay")
  const [registerDate, setRegisterDate] = useState(() => {
    const today = new Date()
    return today.toISOString().slice(0, 10)
  })
  const [monthsAfter, setMonthsAfter] = useState(1)
  const [monthlyDay, setMonthlyDay] = useState(1)

  // サービス名の変更を監視して自動検知
  useEffect(() => {
    if (formData.name.trim()) {
      const service = findServiceByName(formData.name)
      if (service) {
        setDetectedService(service)
        // カテゴリも自動設定
        setFormData(prev => ({ ...prev, category: service.category }))
      } else {
        setDetectedService(null)
      }
    } else {
      setDetectedService(null)
    }
  }, [formData.name])

  // 検索機能
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = searchServices(query)
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  const selectService = (service: SubscriptionService) => {
    setFormData(prev => ({
      ...prev,
      name: service.name,
      category: service.category
    }))
    setDetectedService(service)
    setSearchQuery("")
    setShowSearchResults(false)
  }

  // nextPaymentTypeの変更時にformData.nextPaymentを自動更新
  React.useEffect(() => {
    if (nextPaymentType === "date") return // 手動入力
    if (nextPaymentType === "fromRegister") {
      // 登録日からmonthsAfterか月後の日付を計算
      const reg = new Date(registerDate)
      reg.setMonth(reg.getMonth() + monthsAfter)
      setFormData(fd => ({ ...fd, nextPayment: reg.toISOString().slice(0, 10) }))
    } else if (nextPaymentType === "monthlyDay") {
      // 今月または来月のmonthlyDay日を計算
      const today = new Date()
      let next = new Date(today.getFullYear(), today.getMonth(), monthlyDay)
      if (next <= today) {
        next = new Date(today.getFullYear(), today.getMonth() + 1, monthlyDay)
      }
      setFormData(fd => ({ ...fd, nextPayment: next.toISOString().slice(0, 10) }))
    }
  }, [nextPaymentType, registerDate, monthsAfter, monthlyDay])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // priceは数値変換
    const priceNum = Number(formData.price)

    const newErrors = {
      name: !formData.name,
      // トライアル中は料金が0円でもOK
      price: formData.billingCycle !== "trial" && (!formData.price || isNaN(priceNum) || priceNum < 0),
      nextPayment: !formData.nextPayment,
      category: !formData.category,
    }
    setErrors(newErrors)

    if (Object.values(newErrors).some(error => error)) {
      if (formData.billingCycle !== "trial" && (isNaN(priceNum) || priceNum < 0)) {
        alert("料金は0円以上の値を入力してください")
      } else {
        alert("必須項目を入力してください")
      }
      return
    }

    onSubmit({
      ...formData,
      price: isNaN(priceNum) ? 0 : priceNum,
      // フォームで選択されたbillingCycleをそのまま使う
      billingCycle: formData.billingCycle,
      // 支払い方法が"none"の場合は空文字列に変換
      paymentMethodId: formData.paymentMethodId === "none" ? "" : formData.paymentMethodId,
    })
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-none border-none rounded-none">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{initialData ? "サブスクリプション編集" : "新しいサブスクリプション追加"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <Label htmlFor="name" className={`text-sm ${errors.name ? "text-red-500" : ""}`}>サービス名 *</Label>
            <div className="relative">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData({ ...formData, name: value })
                  setErrors(prev => ({ ...prev, name: false }))
                  handleSearch(value)
                }}
                placeholder="Netflix, Spotify など"
                required
                className={`text-sm ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              {formData.name && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => handleSearch(formData.name)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
              {/* サジェスト（検索結果） */}
              {showSearchResults && searchResults.length > 0 && (
                <div
                  className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-20"
                >
                  {searchResults.map((service) => (
                    <div
                      key={service.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => selectService(service)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{service.name}</div>
                          <div className="text-xs text-gray-500">{service.category}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">{service.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* 検出されたサービス */}
              {detectedService && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      {detectedService.name} を検出しました
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{detectedService.category}</Badge>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(detectedService.website, '_blank')}
                      className="text-xs"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      公式サイト
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className={`text-sm ${errors.price ? "text-red-500" : ""}`}>料金 *</Label>
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
                className={`text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                  errors.price ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
              />
            </div>

            <div>
              <Label htmlFor="billingCycle" className="text-sm">請求サイクル *</Label>
              <Select
                value={formData.billingCycle}
                onValueChange={(value: "monthly" | "yearly" | "trial") => setFormData({ ...formData, billingCycle: value })}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">月額</SelectItem>
                  <SelectItem value="yearly">年額</SelectItem>
                  <SelectItem value="trial">トライアル</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-sm">支払い方法</Label>
            <Select 
              value={formData.paymentMethodId} 
              onValueChange={(value) => {
                setFormData({ ...formData, paymentMethodId: value })
              }}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="支払い方法を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">支払い方法なし</SelectItem>
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.id} value={pm.id}>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>{pm.name}</span>
                      {pm.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                          デフォルト
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {paymentMethods.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">
                支払い方法が登録されていません。
                <button
                  type="button"
                  onClick={() => window.location.href = '/dashboard?tab=payment'}
                  className="text-blue-600 hover:underline ml-1"
                >
                  支払い方法を追加
                </button>
              </p>
            )}
          </div>



          <div>
            <Label className="text-sm">次回支払日の入力方法 *</Label>
            <Select value={nextPaymentType} onValueChange={v => setNextPaymentType(v as any)}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthlyDay">毎月の〇日</SelectItem>
                <SelectItem value="fromRegister">登録日から〇か月後</SelectItem>
                <SelectItem value="date">日付を直接指定</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {nextPaymentType === "fromRegister" && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 min-w-0">
                <Label htmlFor="registerDate" className="text-sm">登録日</Label>
                <Input
                  id="registerDate"
                  type="date"
                  value={registerDate}
                  onChange={e => setRegisterDate(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Label htmlFor="monthsAfter" className="text-sm">何か月後</Label>
                <Select value={monthsAfter.toString()} onValueChange={v => setMonthsAfter(Number(v))}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12)].map((_, i) => (
                      <SelectItem key={i+1} value={(i+1).toString()}>{i+1}か月後</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-0">
                <Label className="text-sm">次回支払日</Label>
                <Input type="date" value={formData.nextPayment} readOnly className="text-sm" />
              </div>
            </div>
          )}

          {nextPaymentType === "monthlyDay" && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 min-w-0">
                <Label htmlFor="monthlyDay" className="text-sm">毎月の</Label>
                <Select value={monthlyDay.toString()} onValueChange={v => setMonthlyDay(Number(v))}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(28)].map((_, i) => (
                      <SelectItem key={i+1} value={(i+1).toString()}>{i+1}日</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 min-w-0">
                <Label className="text-sm">次回支払日</Label>
                <Input type="date" value={formData.nextPayment} readOnly className="text-sm" />
              </div>
            </div>
          )}

          {nextPaymentType === "date" && (
            <div>
              <Label htmlFor="nextPayment" className={`text-sm ${errors.nextPayment ? "text-red-500" : ""}`}>次回支払日 *</Label>
              <Input
                id="nextPayment"
                type="date"
                value={formData.nextPayment}
                onChange={(e) => {
                  setFormData({ ...formData, nextPayment: e.target.value })
                  setErrors(prev => ({ ...prev, nextPayment: false }))
                }}
                required
                className={`text-sm ${errors.nextPayment ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
            </div>
          )}

          <div>
            <Label htmlFor="category" className={`text-sm ${errors.category ? "text-red-500" : ""}`}>カテゴリ *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => {
                setFormData({ ...formData, category: value })
                setErrors(prev => ({ ...prev, category: false }))
              }}
            >
              <SelectTrigger className={`text-sm ${errors.category ? "border-red-500 focus-visible:ring-red-500" : ""}`}>
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
            <Label className="text-sm">ステータス</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: "active" | "paused" | "cancelled" | "pending_cancellation" | "trial") => {
                setFormData({ ...formData, status: value })
              }}
            >
              <SelectTrigger className={`text-sm ${errors.status ? "border-red-500 focus-visible:ring-red-500" : ""}`}>
                <SelectValue placeholder="ステータスを選択" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">カラー</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${
                    formData.color === color ? "border-gray-800" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" className="flex-1 text-sm">
              {initialData ? "更新" : "追加"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 text-sm">
              キャンセル
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
