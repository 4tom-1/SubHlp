"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSubscriptions } from "@/hooks/useSubscriptions"
import { SubscriptionForm } from "./subscription-form"
import { MonthlyChart } from "./monthly-chart"
import { NotificationSettings } from "./notification-settings"
import { ServiceComparison } from "./service-comparison"
import { Plus, CreditCard, TrendingUp, Bell, Search } from "lucide-react"
import { Auth } from "@/components/auth"
import { Subscription } from "@/types/subscription"

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

  const [activeTab, setActiveTab] = useState<"dashboard" | "add" | "chart" | "settings" | "compare" | "edit">("dashboard")
  const [editTarget, setEditTarget] = useState<null | Subscription>(null)

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

  const activeSubscriptions = subscriptions.filter((sub) => sub.isActive)
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
      default:
        return (
          <div className="space-y-6">
            {/* 支出サマリー */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    月額合計
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥{monthlyTotal.toLocaleString()}</div>
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
                  <div className="text-2xl font-bold">¥{yearlyTotal.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">アクティブサービス</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeSubscriptions.length}件</div>
                </CardContent>
              </Card>
            </div>

            {/* サブスクリプション一覧 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>サブスクリプション一覧</span>
                  <Button onClick={() => setActiveTab("add")} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    追加
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeSubscriptions.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">まだサブスクリプションが登録されていません</p>
                    <Button onClick={() => setActiveTab("add")}>最初のサービスを追加</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeSubscriptions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: sub.color }} />
                          <div>
                            <h3 className="font-medium">{sub.name}</h3>
                            <p className="text-sm text-gray-500">{sub.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">
                              ¥{sub.price.toLocaleString()}
                              <span className="text-sm text-gray-500">
                                /{sub.billingCycle === "monthly" ? "月" : "年"}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              次回: {new Date(sub.nextPayment).toLocaleDateString("ja-JP")}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => { setEditTarget(sub); setActiveTab("edit") }}>
                            編集
                          </Button>
                          <Button size="sm" variant="destructive" onClick={async () => {
                            if (window.confirm(`「${sub.name}」を削除しますか？`)) {
                              await deleteSubscription(sub.id)
                            }
                          }}>
                            削除
                          </Button>
                        </div>
                      </div>
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-2 rounded-lg">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">サブ助</h1>
                <p className="text-sm text-gray-500">サブスクリプション管理</p>
              </div>
            </div>
            <div>
              <Auth />
            </div>
          </div>
        </div>
      </header>

      {/* ナビゲーション */}
      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: "dashboard", label: "ダッシュボード", icon: CreditCard },
              { id: "add", label: "追加", icon: Plus },
              { id: "chart", label: "グラフ", icon: TrendingUp },
              { id: "settings", label: "通知設定", icon: Bell },
              { id: "compare", label: "サービス比較", icon: Search },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
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
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-6">{renderContent()}</main>
    </div>
  )
}
