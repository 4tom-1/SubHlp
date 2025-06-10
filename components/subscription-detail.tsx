"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Subscription } from "@/types/subscription"
import { ArrowLeft, Edit, Trash2, Save, Calendar, CreditCard, Tag } from "lucide-react"

interface SubscriptionDetailProps {
  subscription: Subscription
  onBack: () => void
  onEdit: (subscription: Subscription) => void
  onDelete: (id: string) => void
  onUpdateNotes: (id: string, notes: string) => void
}

export function SubscriptionDetail({ subscription, onBack, onEdit, onDelete, onUpdateNotes }: SubscriptionDetailProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(subscription.notes || "")

  const handleSaveNotes = () => {
    onUpdateNotes(subscription.id, notes)
    setIsEditingNotes(false)
  }

  const handleCancelNotes = () => {
    setNotes(subscription.notes || "")
    setIsEditingNotes(false)
  }

  const monthlyPrice = subscription.billingCycle === "yearly" ? subscription.price / 12 : subscription.price
  const yearlyPrice = subscription.billingCycle === "yearly" ? subscription.price : subscription.price * 12

  const nextPaymentDate = new Date(subscription.nextPayment)
  const daysUntilPayment = Math.ceil((nextPaymentDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          戻る
        </Button>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: subscription.color }} />
          <h1 className="text-2xl font-bold">{subscription.name}</h1>
        </div>
      </div>

      {/* 基本情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>基本情報</span>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(subscription)}>
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>サブスクリプションを削除しますか？</AlertDialogTitle>
                    <AlertDialogDescription>
                      「{subscription.name}」を削除します。この操作は取り消せません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(subscription.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      削除する
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">料金</p>
                <p className="font-semibold">
                  ¥{subscription.price.toLocaleString()}
                  <span className="text-sm text-gray-500">
                    /{subscription.billingCycle === "monthly" ? "月" : "年"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">次回支払日</p>
                <p className="font-semibold">{nextPaymentDate.toLocaleDateString("ja-JP")}</p>
                <p className="text-xs text-gray-500">
                  {daysUntilPayment > 0 ? `${daysUntilPayment}日後` : daysUntilPayment === 0 ? "今日" : "期限切れ"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Tag className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">カテゴリ</p>
                <Badge variant="secondary">{subscription.category}</Badge>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: subscription.color }} />
              </div>
              <div>
                <p className="text-sm text-gray-500">ステータス</p>
                <Badge variant={subscription.isActive ? "default" : "secondary"}>
                  {subscription.isActive ? "アクティブ" : "非アクティブ"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 料金詳細 */}
      <Card>
        <CardHeader>
          <CardTitle>料金詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">月額換算</p>
              <p className="text-2xl font-bold text-blue-700">¥{monthlyPrice.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">年額換算</p>
              <p className="text-2xl font-bold text-green-700">¥{yearlyPrice.toLocaleString()}</p>
            </div>
          </div>
          {subscription.billingCycle === "monthly" && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 年額プランに変更すると、月額の10-15%程度お得になる場合があります
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* メモ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>メモ</span>
            {!isEditingNotes && (
              <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(true)}>
                <Edit className="h-4 w-4 mr-2" />
                編集
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditingNotes ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">メモ</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="アカウント情報、使用頻度、解約予定など..."
                  rows={4}
                  className="mt-2"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSaveNotes} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  保存
                </Button>
                <Button variant="outline" onClick={handleCancelNotes} size="sm">
                  キャンセル
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {subscription.notes ? (
                <p className="text-gray-700 whitespace-pre-wrap">{subscription.notes}</p>
              ) : (
                <p className="text-gray-500 italic">メモが追加されていません</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 支払い履歴（将来の拡張用） */}
      <Card>
        <CardHeader>
          <CardTitle>支払い履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">支払い履歴機能は今後実装予定です</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
