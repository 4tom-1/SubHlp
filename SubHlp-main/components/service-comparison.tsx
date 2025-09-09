"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Star, ExternalLink } from "lucide-react"

interface Service {
  name: string
  category: string
  monthlyPrice: number
  yearlyPrice?: number
  features: string[]
  rating: number
  description: string
}

const sampleServices: Service[] = [
  {
    name: "Netflix",
    category: "動画配信",
    monthlyPrice: 1490,
    features: ["オリジナル作品", "4K対応", "ダウンロード可能"],
    rating: 4.5,
    description: "世界最大級の動画配信サービス",
  },
  {
    name: "Amazon Prime Video",
    category: "動画配信",
    monthlyPrice: 500,
    yearlyPrice: 4900,
    features: ["Prime特典", "映画・ドラマ", "オリジナル作品"],
    rating: 4.3,
    description: "Amazonプライム会員特典付き",
  },
  {
    name: "Disney+",
    category: "動画配信",
    monthlyPrice: 990,
    features: ["ディズニー作品", "マーベル", "スター・ウォーズ"],
    rating: 4.4,
    description: "ディズニー公式配信サービス",
  },
  {
    name: "Spotify",
    category: "音楽",
    monthlyPrice: 980,
    features: ["5000万曲以上", "オフライン再生", "プレイリスト"],
    rating: 4.6,
    description: "世界最大の音楽ストリーミング",
  },
  {
    name: "Apple Music",
    category: "音楽",
    monthlyPrice: 1080,
    features: ["7500万曲以上", "ロスレス音質", "Apple製品連携"],
    rating: 4.4,
    description: "Apple公式音楽サービス",
  },
]

export function ServiceComparison() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const filteredServices = sampleServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(sampleServices.map((s) => s.category))]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            サービス比較・検索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="サービス名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("")}
                >
                  すべて
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {service.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">¥{service.monthlyPrice.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">/月</div>
                  {service.yearlyPrice && (
                    <div className="text-xs text-green-600">年額: ¥{service.yearlyPrice.toLocaleString()}</div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{service.description}</p>

              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(service.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">{service.rating}</span>
              </div>

              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-sm">主な機能:</h4>
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                詳細を見る
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">検索条件に一致するサービスが見つかりませんでした</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
