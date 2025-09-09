"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Modal from "@/components/ui/modal"
import { Switch } from "@/components/ui/switch"
import { Search, Star, ExternalLink, Heart, Filter, ArrowUpDown, X, Plus, Minus } from "lucide-react"
import { SUBSCRIPTION_SERVICES, SubscriptionService } from "@/lib/subscription-services"

interface Service {
  id: string
  name: string
  category: string
  monthlyPrice: number
  yearlyPrice?: number
  features: string[]
  rating: number
<<<<<<< HEAD
  reviewCount: number
  description: string
  website: string
  cancellationUrl: string
  cancellationInstructions?: string
  isPopular?: boolean
  hasTrial?: boolean
  trialDays?: number
}

// サービスデータを生成する関数
const generateServiceData = (): Service[] => {
  const services: Service[] = []
  
  // 各カテゴリのサービスデータ
  const serviceData: Record<string, Array<{
    name: string
    price: number
    yearlyPrice?: number
    rating: number
    reviewCount: number
    features: string[]
    isPopular?: boolean
    hasTrial: boolean
    trialDays?: number
  }>> = {
    "動画配信": [
      { name: "Netflix", price: 1490, rating: 4.5, reviewCount: 125000, features: ["オリジナル作品", "4K対応", "ダウンロード可能", "同時視聴4台", "無広告"], isPopular: true, hasTrial: true, trialDays: 30 },
      { name: "Amazon Prime", price: 500, yearlyPrice: 4900, rating: 4.3, reviewCount: 89000, features: ["Prime特典", "映画・ドラマ", "オリジナル作品", "配送無料", "Prime Music"], isPopular: true, hasTrial: true, trialDays: 30 },
      { name: "Disney+", price: 990, rating: 4.4, reviewCount: 67000, features: ["ディズニー作品", "マーベル", "スター・ウォーズ", "ピクサー", "ナショナルジオグラフィック"], hasTrial: true, trialDays: 7 },
      { name: "Hulu", price: 1026, rating: 4.1, reviewCount: 45000, features: ["日本ドラマ", "アニメ", "海外ドラマ", "映画", "ライブ配信"], hasTrial: true, trialDays: 14 },
      { name: "YouTube Premium", price: 1180, rating: 4.2, reviewCount: 78000, features: ["広告なし", "バックグラウンド再生", "オフライン再生", "YouTube Music付き"], hasTrial: true, trialDays: 30 },
      { name: "Apple TV+", price: 600, rating: 4.0, reviewCount: 35000, features: ["Appleオリジナル", "4K対応", "家族共有", "オフライン再生"], hasTrial: true, trialDays: 7 },
      { name: "U-NEXT", price: 2189, rating: 4.2, reviewCount: 28000, features: ["日本映画", "海外ドラマ", "アニメ", "雑誌読み放題"], hasTrial: true, trialDays: 31 },
      { name: "ABEMA", price: 960, rating: 3.9, reviewCount: 22000, features: ["ライブ配信", "アニメ", "ドラマ", "バラエティ"], hasTrial: false }
    ],
    "音楽": [
      { name: "Spotify", price: 980, rating: 4.6, reviewCount: 210000, features: ["5000万曲以上", "オフライン再生", "プレイリスト", "無広告", "高音質"], isPopular: true, hasTrial: true, trialDays: 30 },
      { name: "Apple Music", price: 1080, rating: 4.4, reviewCount: 145000, features: ["7500万曲以上", "ロスレス音質", "Apple製品連携", "Siri対応", "無広告"], hasTrial: true, trialDays: 3 },
      { name: "YouTube Music", price: 1180, rating: 4.3, reviewCount: 95000, features: ["YouTube連携", "オフライン再生", "バックグラウンド再生", "プレイリスト"], hasTrial: true, trialDays: 30 },
      { name: "LINE MUSIC", price: 1080, rating: 4.1, reviewCount: 18000, features: ["LINE連携", "歌詞表示", "オフライン再生", "プレイリスト"], hasTrial: true, trialDays: 30 }
    ],
    "クラウドストレージ": [
      { name: "Google Drive", price: 250, rating: 4.5, reviewCount: 150000, features: ["15GB無料", "Google連携", "共有機能", "バックアップ"], hasTrial: false },
      { name: "Dropbox", price: 1200, rating: 4.3, reviewCount: 85000, features: ["2GB無料", "同期機能", "共有機能", "バージョン管理"], hasTrial: true, trialDays: 30 },
      { name: "iCloud", price: 130, rating: 4.4, reviewCount: 120000, features: ["5GB無料", "Apple連携", "自動バックアップ", "共有機能"], hasTrial: false }
    ],
    "学習・教育": [
      { name: "Duolingo Plus", price: 840, rating: 4.7, reviewCount: 45000, features: ["広告なし", "オフライン学習", "進捗追跡", "ゲーミフィケーション"], isPopular: true, hasTrial: true, trialDays: 14 },
      { name: "Coursera Plus", price: 4900, rating: 4.6, reviewCount: 32000, features: ["大学講座", "認定証", "オフライン学習", "専門コース"], hasTrial: true, trialDays: 7 }
    ],
    "ゲーム": [
      { name: "Nintendo Switch Online", price: 306, rating: 4.2, reviewCount: 180000, features: ["オンライン対戦", "クラシックゲーム", "クラウドセーブ", "特別オファー"], hasTrial: true, trialDays: 7 },
      { name: "PlayStation Plus", price: 850, rating: 4.1, reviewCount: 220000, features: ["オンライン対戦", "月間ゲーム", "クラウドセーブ", "特別オファー"], hasTrial: true, trialDays: 14 },
      { name: "Xbox Game Pass", price: 1000, rating: 4.4, reviewCount: 150000, features: ["100+ゲーム", "新作同日配信", "クラウドゲーム", "PC対応"], isPopular: true, hasTrial: true, trialDays: 14 }
    ],
    "ニュース・雑誌": [
      { name: "Kindle Unlimited", price: 980, rating: 4.3, reviewCount: 65000, features: ["200万冊以上", "雑誌読み放題", "オーディオブック", "オフライン読書"], hasTrial: true, trialDays: 30 },
      { name: "Audible", price: 1500, rating: 4.5, reviewCount: 42000, features: ["オーディオブック", "月1冊無料", "オフライン再生", "高音質"], hasTrial: true, trialDays: 30 }
    ],
    "ビジネスツール": [
      { name: "Notion", price: 800, rating: 4.7, reviewCount: 32000, features: ["ノート作成", "データベース", "チーム協業", "テンプレート", "API連携"], isPopular: true, hasTrial: true, trialDays: 30 },
      { name: "Slack", price: 850, rating: 4.4, reviewCount: 28000, features: ["チームチャット", "ファイル共有", "音声通話", "アプリ連携"], hasTrial: true, trialDays: 14 },
      { name: "Zoom", price: 2000, rating: 4.2, reviewCount: 15000, features: ["ビデオ会議", "画面共有", "録画機能", "大容量会議"], hasTrial: true, trialDays: 30 }
    ]
  }

  // SUBSCRIPTION_SERVICESからデータを取得してサービスを生成
  SUBSCRIPTION_SERVICES.forEach(service => {
    const categoryData = serviceData[service.category as keyof typeof serviceData]
    if (categoryData) {
      const data = categoryData.find(d => d.name === service.name)
      if (data) {
        services.push({
          id: service.id,
          name: service.name,
          category: service.category,
          monthlyPrice: data.price,
          yearlyPrice: data.yearlyPrice,
          features: data.features,
          rating: data.rating,
          reviewCount: data.reviewCount,
          description: getServiceDescription(service.name, service.category),
          website: service.website,
          cancellationUrl: service.cancellationUrl,
          cancellationInstructions: service.cancellationInstructions,
          isPopular: data.isPopular || false,
          hasTrial: data.hasTrial || false,
          trialDays: data.trialDays
        })
      }
    }
  })

  return services
}

// サービス説明を生成する関数
const getServiceDescription = (name: string, category: string): string => {
  const descriptions: Record<string, Record<string, string>> = {
    "動画配信": {
      "Netflix": "世界最大級の動画配信サービス",
      "Amazon Prime": "Amazonプライム会員特典付き",
      "Disney+": "ディズニー公式配信サービス",
      "Hulu": "日本最大級の動画配信サービス",
      "YouTube Premium": "YouTube広告なし体験",
      "Apple TV+": "Apple公式動画配信サービス",
      "U-NEXT": "日本最大級の動画・書籍配信サービス",
      "ABEMA": "無料で楽しめる動画配信サービス"
    },
    "音楽": {
      "Spotify": "世界最大の音楽ストリーミング",
      "Apple Music": "Apple公式音楽サービス",
      "YouTube Music": "YouTube連携音楽サービス",
      "LINE MUSIC": "LINE連携音楽サービス"
    },
    "クラウドストレージ": {
      "Google Drive": "Google公式クラウドストレージ",
      "Dropbox": "ファイル同期・共有サービス",
      "iCloud": "Apple公式クラウドストレージ"
    },
    "学習・教育": {
      "Duolingo Plus": "世界最大の言語学習アプリ",
      "Coursera Plus": "大学レベルのオンライン講座"
    },
    "ゲーム": {
      "Nintendo Switch Online": "Nintendo Switchオンラインサービス",
      "PlayStation Plus": "PlayStationオンラインサービス",
      "Xbox Game Pass": "Microsoftゲームサブスクリプション"
    },
    "ニュース・雑誌": {
      "Kindle Unlimited": "Amazon電子書籍読み放題",
      "Audible": "Amazonオーディオブックサービス"
    },
    "ビジネスツール": {
      "Notion": "オールインワンワークスペース",
      "Slack": "チームコミュニケーションツール",
      "Zoom": "ビデオ会議・ウェビナーサービス"
    }
  }
  
  return descriptions[category]?.[name] || `${name}の公式サービス`
}

const sampleServices: Service[] = generateServiceData()
=======
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
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a

export function ServiceComparison() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
<<<<<<< HEAD
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [minRating, setMinRating] = useState(0)
  const [showTrialOnly, setShowTrialOnly] = useState(false)
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [compareList, setCompareList] = useState<string[]>([])
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedServices = useMemo(() => {
    let filtered = sampleServices.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.features.some(feature => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        )
      
      const matchesCategory = !selectedCategory || service.category === selectedCategory
      const matchesPrice = service.monthlyPrice >= priceRange[0] && service.monthlyPrice <= priceRange[1]
      const matchesRating = service.rating >= minRating
      const matchesTrial = !showTrialOnly || service.hasTrial
      const matchesPopular = !showPopularOnly || service.isPopular
      
      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesTrial && matchesPopular
    })

    // ソート
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "price":
          comparison = a.monthlyPrice - b.monthlyPrice
          break
        case "rating":
          comparison = a.rating - b.rating
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [searchTerm, selectedCategory, sortBy, sortOrder, priceRange, minRating, showTrialOnly, showPopularOnly])

  const categories = [...new Set(sampleServices.map((s) => s.category))]

  const toggleFavorite = (serviceId: string) => {
    setFavorites(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const toggleCompare = (serviceId: string) => {
    if (compareList.includes(serviceId)) {
      setCompareList(prev => prev.filter(id => id !== serviceId))
    } else if (compareList.length < 3) {
      setCompareList(prev => [...prev, serviceId])
    }
  }

  const clearCompare = () => {
    setCompareList([])
  }

  const getCompareServices = () => {
    return sampleServices.filter(service => compareList.includes(service.id))
  }

  return (
    <div className="space-y-6">
      {/* 検索・フィルター */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              サービス比較・検索
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              フィルター
            </Button>
=======

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
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
<<<<<<< HEAD
                  placeholder="サービス名、機能、説明で検索..."
=======
                  placeholder="サービス名で検索..."
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a
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
<<<<<<< HEAD

            {/* 詳細フィルター */}
            {showFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">ソート</label>
                    <div className="flex gap-2">
                      <Select value={sortBy} onValueChange={(value: "name" | "price" | "rating") => setSortBy(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">名前</SelectItem>
                          <SelectItem value="price">価格</SelectItem>
                          <SelectItem value="rating">評価</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">価格帯: ¥{priceRange[0]} - ¥{priceRange[1]}</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="最小"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-20"
                      />
                      <Input
                        type="number"
                        placeholder="最大"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">最小評価: {minRating}</label>
                    <Input
                      type="range"
                      min="0"
                      max="5"
                      step="0.1"
                      value={minRating}
                      onChange={(e) => setMinRating(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="trial-only"
                      checked={showTrialOnly}
                      onCheckedChange={setShowTrialOnly}
                    />
                    <label htmlFor="trial-only" className="text-sm">無料トライアルありのみ</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="popular-only"
                      checked={showPopularOnly}
                      onCheckedChange={setShowPopularOnly}
                    />
                    <label htmlFor="popular-only" className="text-sm">人気サービスのみ</label>
                  </div>
                </div>
              </div>
            )}
=======
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a
          </div>
        </CardContent>
      </Card>

<<<<<<< HEAD
      {/* 比較リスト */}
      {compareList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>比較リスト ({compareList.length}/3)</span>
              <Button variant="outline" size="sm" onClick={clearCompare}>
                <X className="h-4 w-4 mr-2" />
                クリア
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getCompareServices().map((service) => (
                <div key={service.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{service.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCompare(service.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>¥{service.monthlyPrice}/月</div>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      {service.rating} ({service.reviewCount.toLocaleString()})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* サービス一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow relative">
            {/* 人気バッジ */}
            {service.isPopular && (
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="default" className="bg-red-500 text-white">
                  人気
                </Badge>
              </div>
            )}

            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {service.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(service.id)}
                      className="p-1 h-auto"
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favorites.includes(service.id) 
                            ? "text-red-500 fill-current" 
                            : "text-gray-400"
                        }`} 
                      />
                    </Button>
                  </CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {service.category}
                  </Badge>
                  {service.hasTrial && (
                    <Badge variant="outline" className="mt-1 ml-2 text-green-600 border-green-600">
                      {service.trialDays}日無料
                    </Badge>
                  )}
=======
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
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a
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

<<<<<<< HEAD
              <div className="flex items-center justify-between mb-3">
=======
              <div className="flex items-center mb-3">
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(service.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
<<<<<<< HEAD
                  <span className="ml-2 text-sm text-gray-600">{service.rating}</span>
                </div>
                <span className="text-xs text-gray-500">({service.reviewCount.toLocaleString()}件)</span>
=======
                </div>
                <span className="ml-2 text-sm text-gray-600">{service.rating}</span>
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a
              </div>

              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-sm">主な機能:</h4>
                <div className="flex flex-wrap gap-1">
<<<<<<< HEAD
                  {service.features.slice(0, 3).map((feature, i) => (
=======
                  {service.features.map((feature, i) => (
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a
                    <Badge key={i} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
<<<<<<< HEAD
                  {service.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{service.features.length - 3}個
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setSelectedService(service)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  詳細
                </Button>
                <Button
                  variant={compareList.includes(service.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCompare(service.id)}
                  disabled={!compareList.includes(service.id) && compareList.length >= 3}
                >
                  {compareList.includes(service.id) ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
=======
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <ExternalLink className="h-4 w-4 mr-2" />
                詳細を見る
              </Button>
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a
            </CardContent>
          </Card>
        ))}
      </div>

<<<<<<< HEAD
      {filteredAndSortedServices.length === 0 && (
=======
      {filteredServices.length === 0 && (
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a
        <Card>
          <CardContent className="text-center py-8">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">検索条件に一致するサービスが見つかりませんでした</p>
          </CardContent>
        </Card>
      )}
<<<<<<< HEAD

      {/* サービス詳細モーダル */}
      {selectedService && (
        <Modal
          open={!!selectedService}
          onClose={() => setSelectedService(null)}
        >
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedService.name}</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">{selectedService.category}</Badge>
                {selectedService.isPopular && (
                  <Badge variant="default" className="ml-2 bg-red-500 text-white">人気</Badge>
                )}
                {selectedService.hasTrial && (
                  <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                    {selectedService.trialDays}日無料トライアル
                  </Badge>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">¥{selectedService.monthlyPrice.toLocaleString()}</div>
                <div className="text-sm text-gray-500">/月</div>
                {selectedService.yearlyPrice && (
                  <div className="text-sm text-green-600">年額: ¥{selectedService.yearlyPrice.toLocaleString()}</div>
                )}
              </div>
            </div>

            <p className="text-gray-600">{selectedService.description}</p>

            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(selectedService.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-lg font-medium">{selectedService.rating}</span>
              <span className="ml-2 text-gray-500">({selectedService.reviewCount.toLocaleString()}件のレビュー)</span>
            </div>

            <div>
              <h3 className="font-medium mb-3">主な機能</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedService.features.map((feature, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">キャンセル方法</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedService.cancellationInstructions}</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(selectedService.website, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  公式サイト
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(selectedService.cancellationUrl, '_blank')}
                >
                  キャンセルページ
                </Button>
              </div>
            </div>
          </div>
          </div>
        </Modal>
      )}
=======
>>>>>>> eb67fafbb1ee5626f7557e1b5d73f74887dc547a
    </div>
  )
}
