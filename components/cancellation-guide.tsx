"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  ExternalLink, 
  Search, 
  X, 
  AlertTriangle, 
  Info,
  ExternalLinkIcon,
  Copy
} from "lucide-react"
import { Subscription } from "@/types/subscription"
import { 
  SubscriptionService, 
  SUBSCRIPTION_SERVICES, 
  findServiceByName, 
  searchServices,
  getAllCategories 
} from "@/lib/subscription-services"

interface CancellationGuideProps {
  subscriptions: Subscription[]
}

export function CancellationGuide({ subscriptions }: CancellationGuideProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const categories = getAllCategories()
  const activeSubscriptions = subscriptions.filter(sub => 
    sub.status === "active" || sub.status === "trial"
  )

  // 検索結果を取得
  const searchResults = searchQuery 
    ? searchServices(searchQuery)
    : selectedCategory === "all" 
      ? SUBSCRIPTION_SERVICES 
      : SUBSCRIPTION_SERVICES.filter(service => service.category === selectedCategory)

  // ユーザーのサブスクリプションとマッチするサービスを特定
  const matchedServices = activeSubscriptions.map(sub => {
    const service = findServiceByName(sub.name)
    return { subscription: sub, service }
  }).filter(item => item.service)

  const copyToClipboard = async (url: string, serviceName: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(serviceName)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">解約ガイド</h1>
        <p className="text-gray-600">
          サブスクリプションサービスの解約方法をご案内します
        </p>
      </div>

      {/* 検索・フィルター */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            サービスを検索
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="サービス名を入力..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">すべてのカテゴリ</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* 登録中のサービス */}
      {matchedServices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              あなたが登録中のサービス
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matchedServices.map(({ subscription, service }) => (
                <div key={subscription.id} className="border rounded-lg p-4 bg-orange-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{service!.name}</h3>
                        <Badge variant="secondary">{subscription.category}</Badge>
                        <Badge variant="outline">
                          ¥{subscription.price.toLocaleString()}/{subscription.billingCycle === "monthly" ? "月" : "年"}
                        </Badge>
                      </div>
                      {service!.cancellationInstructions && (
                        <p className="text-sm text-gray-600 mb-3">
                          <Info className="h-4 w-4 inline mr-1" />
                          {service!.cancellationInstructions}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => openUrl(service!.cancellationUrl)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          解約ページを開く
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(service!.cancellationUrl, service!.name)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copiedUrl === service!.name ? "コピー完了!" : "URLをコピー"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openUrl(service!.website)}
                        >
                          <ExternalLinkIcon className="h-4 w-4 mr-2" />
                          公式サイト
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 全サービス一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>全サービス一覧</CardTitle>
          <p className="text-sm text-gray-600">
            {searchResults.length}件のサービスが見つかりました
          </p>
        </CardHeader>
        <CardContent>
          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">該当するサービスが見つかりませんでした</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {searchResults.map((service) => (
                <div key={service.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <Badge variant="secondary">{service.category}</Badge>
                      </div>
                      {service.cancellationInstructions && (
                        <p className="text-sm text-gray-600 mb-3">
                          <Info className="h-4 w-4 inline mr-1" />
                          {service.cancellationInstructions}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => openUrl(service.cancellationUrl)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          解約ページを開く
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(service.cancellationUrl, service.name)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copiedUrl === service.name ? "コピー完了!" : "URLをコピー"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openUrl(service.website)}
                        >
                          <ExternalLinkIcon className="h-4 w-4 mr-2" />
                          公式サイト
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 注意事項 */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle className="h-5 w-5" />
            解約時の注意事項
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-800">
          <ul className="space-y-2 text-sm">
            <li>• 解約後も期間終了まではサービスを利用できます</li>
            <li>• 解約手続きは各サービスの公式サイトで行ってください</li>
            <li>• 解約後は自動更新が停止され、次回請求は発生しません</li>
            <li>• 解約手続きに問題がある場合は、各サービスのカスタマーサポートにお問い合わせください</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
} 