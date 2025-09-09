"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSubscriptions } from "@/hooks/useSubscriptions"
import { usePaymentMethods } from "@/hooks/usePaymentMethods"
import { SubscriptionForm } from "./subscription-form"
import { MonthlyChart } from "./monthly-chart"
import { NotificationSettings } from "./notification-settings"
import { ServiceComparison } from "./service-comparison"
import { CancellationGuide } from "./cancellation-guide"
import { PaymentMethodsList } from "./payment-methods"
import { Plus, CreditCard, TrendingUp, Bell, Search, X, Menu, Wallet } from "lucide-react"
import { Auth } from "@/components/auth"
import { Subscription, PaymentMethod } from "@/types/subscription"
import { getStatusConfig, isActiveStatus } from "@/lib/utils"
import { findServiceByName } from "@/lib/subscription-services"
import React from "react"
import Modal from "@/components/ui/modal"

interface SubscriptionListItemProps {
  sub: Subscription
  idx: number
  paymentMethods: PaymentMethod[]
  setEditTarget: (sub: Subscription) => void
  setActiveTab: (tab: "dashboard" | "add" | "chart" | "settings" | "compare" | "edit" | "cancellation" | "payment") => void
  deleteSubscription: (id: string) => Promise<void>
  findServiceByName: (name: string) => any
}
function SubscriptionListItem({ sub, idx, paymentMethods, setEditTarget, setActiveTab, deleteSubscription, findServiceByName }: SubscriptionListItemProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 50 + idx * 60)
    return () => clearTimeout(timeout)
  }, [])
  return (
    <div
      className={
        `flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 gap-3 transition-all duration-300 opacity-0 translate-y-4` +
        (mounted ? " opacity-100 translate-y-0" : "")
      }
      style={{ transitionDelay: `${idx * 60}ms` }}
    >
      <div className="flex items-center space-x-3">
        <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: sub.color }} />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">{sub.name}</h3>
          <p className="text-sm text-gray-500 truncate">{sub.category}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusConfig(sub.status, sub.billingCycle).color}`}>
              {getStatusConfig(sub.status, sub.billingCycle).icon} {getStatusConfig(sub.status, sub.billingCycle).label}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-4">
        <div className="text-left sm:text-right w-full sm:w-auto">
          <p className="font-medium text-sm sm:text-base">
            {sub.billingCycle !== "trial" && sub.billingCycle !== "trial_ended" ? (
              <>
                ￥{sub.price.toLocaleString()}
                <span className="text-sm text-gray-500">/{sub.billingCycle === "monthly" ? "月" : "年"}</span>
              </>
            ) : (
              <span className="text-blue-500">トライアル中</span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            次回: {new Date(sub.nextPayment).toLocaleDateString("ja-JP")}
          </p>
          {sub.paymentMethodId && (() => {
            const paymentMethod = paymentMethods.find(pm => pm.id === sub.paymentMethodId)
            return paymentMethod ? (
              <div className="flex items-center space-x-1 mt-1">
                <Wallet className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500 truncate">
                  {paymentMethod.name}
                </span>
              </div>
            ) : null
          })()}
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2 w-full sm:w-auto">
          <Button size="sm" variant="outline" onClick={() => { setEditTarget(sub); setActiveTab("edit") }} className="flex-1 sm:flex-none">
            編集
          </Button>
          {(() => {
            const service = findServiceByName(sub.name)
            return service ? (
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 border-red-300 hover:bg-red-50 flex-1 sm:flex-none"
                onClick={() => window.open(service.cancellationUrl, '_blank')}
              >
                解約
              </Button>
            ) : null
          })()}
          <Button size="sm" variant="destructive" onClick={async () => {
            if (window.confirm(`「${sub.name}」を削除しますか？`)) {
              await deleteSubscription(sub.id)
            }
          }} className="flex-1 sm:flex-none">
            削除
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    getTotalMonthlySpending,
    getTotalYearlySpending,
  } = useSubscriptions()
  
  const { paymentMethods } = usePaymentMethods()
  
  const [activeTab, setActiveTab] = useState<"dashboard" | "add" | "chart" | "settings" | "compare" | "edit" | "cancellation" | "payment">("dashboard")
  const [editTarget, setEditTarget] = useState<null | Subscription>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  function handleEdit(sub: Subscription) {
    setEditTarget(sub)
    setEditModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  const activeSubscriptions = subscriptions.filter((sub) => isActiveStatus(sub.status, sub.billingCycle))
  const monthlyTotal = getTotalMonthlySpending()
  const yearlyTotal = getTotalYearlySpending()

  const renderContent = () => {
    switch (activeTab) {
      case "add":
        return (
          <SubscriptionForm
            onSubmit={(data) => {
              addSubscription(data)
              setActiveTab("dashboard")
            }}
            onCancel={() => setActiveTab("dashboard")}
          />
        )
      case "edit":
        return (
          <SubscriptionForm
            initialData={editTarget!}
            onSubmit={async (data) => {
              await updateSubscription(editTarget!.id, data)
              setEditTarget(null)
              setActiveTab("dashboard")
            }}
            onCancel={() => {
              setEditTarget(null)
              setActiveTab("dashboard")
            }}
          />
        )
      case "chart":
        return <MonthlyChart subscriptions={subscriptions} />
      case "settings":
        return <NotificationSettings />
      case "compare":
        return <ServiceComparison />
      case "cancellation":
        return <CancellationGuide subscriptions={subscriptions} />
      case "payment":
        return <PaymentMethodsList />
      default:
        return (
          <div className="space-y-4 sm:space-y-6">
            {/* 支出サマリー */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    月額合計
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">¥{monthlyTotal.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    年額合計
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">¥{yearlyTotal.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">アクティブサービス</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{activeSubscriptions.length}件</div>
                </CardContent>
              </Card>
            </div>

            {/* サブスクリプション一覧 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span>サブスクリプション一覧</span>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm w-full sm:w-auto"
                    >
                      <option value="all">すべて</option>
                      <option value="active">利用中</option>
                      <option value="paused">一時停止中</option>
                      <option value="cancelled">解約済み</option>
                      <option value="pending_cancellation">解約予定</option>
                      <option value="trial">トライアル中</option>
                    </select>
                    <Button onClick={() => setActiveTab("add")} size="sm" className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      追加
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {subscriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">まだサブスクリプションが登録されていません</p>
                    <Button onClick={() => setActiveTab("add")}>最初のサービスを追加</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {subscriptions
                      .filter((sub) => statusFilter === "all" || sub.status === statusFilter)
                      .map((sub, idx) => (
                        <SubscriptionListItem
                          key={sub.id}
                          sub={sub}
                          idx={idx}
                          paymentMethods={paymentMethods}
                          setEditTarget={handleEdit}
                          setActiveTab={() => {}}
                          deleteSubscription={deleteSubscription}
                          findServiceByName={findServiceByName}
                        />
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>



            {/* 節約提案 */}
            {monthlyTotal > 5000 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800">💡 節約提案</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700 mb-3">
                    月額¥{monthlyTotal.toLocaleString()}の支出があります。以下の提案をご検討ください：
                  </p>
                  <ul className="space-y-2 text-sm text-orange-600">
                    <li>• 使用頻度の低いサービスの解約を検討</li>
                    <li>• 類似サービスの重複がないか確認</li>
                    <li>• 年額プランへの変更で割引を活用</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-1.5 sm:p-2 rounded-lg">
                <CreditCard className="h-4 w-4 sm:h-6 sm:w-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">サブ助</h1>
                <p className="text-xs sm:text-sm text-gray-500">サブスクリプション管理</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Auth />
              {/* モバイルメニューボタン */}
              <Button
                variant="outline"
                size="sm"
                className="sm:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* デスクトップナビゲーション */}
          <div className="hidden sm:flex space-x-1 overflow-x-auto">
            {[
              { id: "dashboard", label: "ダッシュボード", icon: CreditCard },
              { id: "add", label: "追加", icon: Plus },
              { id: "payment", label: "支払い方法", icon: Wallet },
              { id: "settings", label: "通知設定", icon: Bell },
              { id: "cancellation", label: "解約ガイド", icon: X },
              { id: "compare", label: "サービス比較", icon: Search },
              { id: "chart", label: "グラフ", icon: TrendingUp },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* モバイルナビゲーション */}
          {mobileMenuOpen && (
            <div className="sm:hidden py-2 space-y-1">
              {[
                { id: "dashboard", label: "ダッシュボード", icon: CreditCard },
                { id: "add", label: "追加", icon: Plus },
                { id: "payment", label: "支払い方法", icon: Wallet },
                { id: "settings", label: "通知設定", icon: Bell },
                { id: "cancellation", label: "解約ガイド", icon: X },
                { id: "compare", label: "サービス比較", icon: Search },
                { id: "chart", label: "グラフ", icon: TrendingUp },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    setMobileMenuOpen(false)
                  }}
                  className={`flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">{renderContent()}</main>

      {/* モーダル表示 */}
      <Modal open={editModalOpen} onClose={() => { setEditTarget(null); setEditModalOpen(false) }}>
        {editTarget && (
          <SubscriptionForm
            initialData={editTarget}
            onSubmit={async (data) => {
              await updateSubscription(editTarget.id, data)
              setEditTarget(null)
              setEditModalOpen(false)
            }}
            onCancel={() => {
              setEditTarget(null)
              setEditModalOpen(false)
            }}
          />
        )}
      </Modal>
    </div>
  )
}
