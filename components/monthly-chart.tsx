"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Subscription } from "@/types/subscription"
import { isActiveStatus } from "@/lib/utils"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface MonthlyChartProps {
  subscriptions: Subscription[]
}

export function MonthlyChart({ subscriptions }: MonthlyChartProps) {
  // カテゴリ別支出データを生成
  const categoryData = Object.entries(
    subscriptions
      .filter((sub) => sub.billingCycle !== "trial" && sub.billingCycle !== "trial_ended")
      .filter((sub) => isActiveStatus(sub.status, sub.billingCycle))
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
    .map(([category, amount]) => ({
      name: category,
      value: amount,
    }))

  // カテゴリごとの色設定（より明確で区別しやすい色）
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      // エンターテイメント系
      "エンターテイメント": "#FF6B6B", // 赤系
      "音楽": "#4ECDC4", // ターコイズ
      "動画配信": "#45B7D1", // 青系
      "ゲーム": "#96CEB4", // 緑系
      "映画": "#FFEAA7", // 黄色系
      
      // ビジネス・生産性系
      "ビジネス": "#6C5CE7", // 紫系
      "生産性": "#A29BFE", // 薄紫
      "クラウド": "#74B9FF", // 青系
      "開発": "#00B894", // 緑系
      
      // ライフスタイル系
      "健康": "#00CEC9", // ターコイズ
      "フィットネス": "#55A3FF", // 青系
      "料理": "#FD79A8", // ピンク
      "教育": "#FDCB6E", // オレンジ
      "ニュース": "#E17055", // オレンジ系
      
      // その他
      "その他": "#636E72", // グレー
      "通信": "#00B894", // 緑系
      "セキュリティ": "#E84393", // ピンク系
      "ストレージ": "#FDCB6E", // 黄色系
    }
    
    return colorMap[category] || "#95A5A6" // デフォルト色
  }

  const totalAmount = categoryData.reduce((sum, item) => sum + item.value, 0)

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const percentage = ((data.value / totalAmount) * 100).toFixed(1)
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600 font-bold">¥{data.value.toLocaleString()}</p>
          <p className="text-gray-600 text-sm">{percentage}%</p>
        </div>
      )
    }
    return null
  }
=======
  // 過去6ヶ月のデータを生成
  const months = []
  const now = new Date()

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      name: date.toLocaleDateString("ja-JP", { year: "numeric", month: "short" }),
      value: subscriptions
        .filter((sub) => sub.billingCycle !== "trial" && sub.billingCycle !== "trial_ended")
        .filter((sub) => isActiveStatus(sub.status, sub.billingCycle))
        .reduce((total, sub) => {
          const monthlyPrice = sub.billingCycle === "yearly" ? sub.price / 12 : sub.price
          return total + monthlyPrice
        }, 0),
    })
  }

  const maxValue = Math.max(...months.map((m) => m.value))

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">カテゴリ別支出（円形グラフ）</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryData.length > 0 ? (
            <div className="space-y-4">
              {/* 円形グラフ */}
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color, fontSize: '14px' }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* 詳細リスト */}
              <div className="space-y-2 sm:space-y-3">
                <h3 className="font-semibold text-base sm:text-lg">詳細</h3>
                {categoryData.map((item, index) => {
                  const percentage = ((item.value / totalAmount) * 100).toFixed(1)
                  return (
                    <div key={item.name} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-1 sm:gap-0">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getCategoryColor(item.name) }}
                        />
                        <span className="font-medium text-sm sm:text-base">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-base sm:text-lg font-bold text-blue-600">¥{item.value.toLocaleString()}</span>
                        <span className="text-gray-600 text-sm ml-2">({percentage}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>アクティブなサブスクリプションがありません</p>
            </div>
          )}
=======
          <CardTitle className="text-lg sm:text-xl">月次支出推移</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {months.map((month, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="w-full sm:w-20 text-xs sm:text-sm text-gray-600">{month.name}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4 sm:h-6 relative">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 sm:h-6 rounded-full flex items-center justify-end pr-1 sm:pr-2"
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
          <CardTitle className="text-lg sm:text-xl">カテゴリ別支出</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(
              subscriptions
                .filter((sub) => sub.billingCycle !== "trial" && sub.billingCycle !== "trial_ended")
                .filter((sub) => isActiveStatus(sub.status, sub.billingCycle))
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
                <div key={category} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg gap-1 sm:gap-0">
                  <span className="font-medium text-sm sm:text-base">{category}</span>
                  <span className="text-base sm:text-lg font-bold text-blue-600">¥{amount.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
