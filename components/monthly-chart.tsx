"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Subscription } from "@/types/subscription"
import { isActiveStatus } from "@/lib/utils"

interface MonthlyChartProps {
  subscriptions: Subscription[]
}

export function MonthlyChart({ subscriptions }: MonthlyChartProps) {
  // 過去6ヶ月のデータを生成
  const months = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      name: date.toLocaleDateString("ja-JP", { year: "numeric", month: "short" }),
      value: subscriptions
        .filter((sub) => isActiveStatus(sub.status))
        .reduce((total, sub) => {
          const monthlyPrice = sub.billingCycle === "yearly" ? sub.price / 12 : sub.price
          return total + monthlyPrice
        }, 0),
    })
  }

  const maxValue = Math.max(...months.map((m) => m.value))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>月次支出推移</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {months.map((month, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-16 text-sm text-gray-600">{month.name}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${maxValue > 0 ? (month.value / maxValue) * 100 : 0}%` }}
                  >
                    <span className="text-white text-xs font-medium">¥{month.value.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* カテゴリ別支出 */}
      <Card>
        <CardHeader>
          <CardTitle>カテゴリ別支出</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(
              subscriptions
                .filter((sub) => isActiveStatus(sub.status))
                .reduce(
                  (acc, sub) => {
                    const monthlyPrice = sub.billingCycle === "yearly" ? sub.price / 12 : sub.price
                    acc[sub.category] = (acc[sub.category] || 0) + monthlyPrice
                    return acc
                  },
                  {} as Record<string, number>,
                ),
            )
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{category}</span>
                  <span className="text-lg font-bold text-blue-600">¥{amount.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
