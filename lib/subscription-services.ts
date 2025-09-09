export interface SubscriptionService {
  id: string
  name: string
  aliases: string[] // 検索用の別名
  category: string
  website: string
  cancellationUrl: string
  cancellationInstructions?: string
  logo?: string
  priceRange?: {
    min: number
    max: number
  }
}

export const SUBSCRIPTION_SERVICES: SubscriptionService[] = [
  // 動画配信
  {
    id: "netflix",
    name: "Netflix",
    aliases: ["netflix", "ネトフリ", "ねとふり"],
    category: "動画配信",
    website: "https://www.netflix.com",
    cancellationUrl: "https://www.netflix.com/account",
    cancellationInstructions: "アカウント設定 → メンバーシップと請求 → メンバーシップをキャンセル"
  },
  {
    id: "amazon-prime",
    name: "Amazon Prime",
    aliases: ["amazon prime", "prime", "プライム", "amazonプライム"],
    category: "動画配信",
    website: "https://www.amazon.co.jp",
    cancellationUrl: "https://www.amazon.co.jp/gp/primecentral",
    cancellationInstructions: "Prime会員情報 → メンバーシップ管理 → メンバーシップを終了"
  },
  {
    id: "disney-plus",
    name: "Disney+",
    aliases: ["disney+", "disney plus", "ディズニープラス", "ディズニー"],
    category: "動画配信",
    website: "https://www.disneyplus.com",
    cancellationUrl: "https://www.disneyplus.com/account",
    cancellationInstructions: "アカウント設定 → サブスクリプション → キャンセル"
  },
  {
    id: "hulu",
    name: "Hulu",
    aliases: ["hulu", "フールー"],
    category: "動画配信",
    website: "https://www.hulu.com",
    cancellationUrl: "https://secure.hulu.com/account",
    cancellationInstructions: "アカウント設定 → サブスクリプション → キャンセル"
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    aliases: ["youtube premium", "youtubeプレミアム", "yt premium"],
    category: "動画配信",
    website: "https://www.youtube.com/premium",
    cancellationUrl: "https://www.youtube.com/paid_memberships",
    cancellationInstructions: "メンバーシップ → 管理 → キャンセル"
  },
  {
    id: "apple-tv",
    name: "Apple TV+",
    aliases: ["apple tv+", "apple tv plus", "アップルtv"],
    category: "動画配信",
    website: "https://tv.apple.com",
    cancellationUrl: "https://tv.apple.com/account",
    cancellationInstructions: "設定 → サブスクリプション → キャンセル"
  },
  {
    id: "unext",
    name: "U-NEXT",
    aliases: ["unext", "ユーネクスト", "u-next"],
    category: "動画配信",
    website: "https://video.unext.jp",
    cancellationUrl: "https://video.unext.jp/mypage",
    cancellationInstructions: "マイページ → サブスクリプション管理 → 解約"
  },
  {
    id: "abema",
    name: "ABEMA",
    aliases: ["abema", "アベマ", "abema tv"],
    category: "動画配信",
    website: "https://abema.tv",
    cancellationUrl: "https://abema.tv/account",
    cancellationInstructions: "アカウント設定 → サブスクリプション → 解約"
  },

  // 音楽
  {
    id: "spotify",
    name: "Spotify",
    aliases: ["spotify", "スポティファイ"],
    category: "音楽",
    website: "https://www.spotify.com",
    cancellationUrl: "https://www.spotify.com/account",
    cancellationInstructions: "アカウント → サブスクリプション → キャンセル"
  },
  {
    id: "apple-music",
    name: "Apple Music",
    aliases: ["apple music", "アップルミュージック"],
    category: "音楽",
    website: "https://music.apple.com",
    cancellationUrl: "https://music.apple.com/account",
    cancellationInstructions: "設定 → サブスクリプション → キャンセル"
  },
  {
    id: "youtube-music",
    name: "YouTube Music",
    aliases: ["youtube music", "yt music"],
    category: "音楽",
    website: "https://music.youtube.com",
    cancellationUrl: "https://www.youtube.com/paid_memberships",
    cancellationInstructions: "メンバーシップ → 管理 → キャンセル"
  },
  {
    id: "line-music",
    name: "LINE MUSIC",
    aliases: ["line music", "ライン ミュージック"],
    category: "音楽",
    website: "https://music.line.me",
    cancellationUrl: "https://music.line.me/account",
    cancellationInstructions: "アカウント設定 → サブスクリプション → キャンセル"
  },

  // クラウドストレージ
  {
    id: "google-drive",
    name: "Google Drive",
    aliases: ["google drive", "グーグルドライブ", "google one"],
    category: "クラウドストレージ",
    website: "https://drive.google.com",
    cancellationUrl: "https://one.google.com/account",
    cancellationInstructions: "Google One → アカウント → サブスクリプション → キャンセル"
  },
  {
    id: "dropbox",
    name: "Dropbox",
    aliases: ["dropbox", "ドロップボックス"],
    category: "クラウドストレージ",
    website: "https://www.dropbox.com",
    cancellationUrl: "https://www.dropbox.com/account",
    cancellationInstructions: "アカウント設定 → プラン → ダウングレード"
  },
  {
    id: "icloud",
    name: "iCloud",
    aliases: ["icloud", "アイクラウド"],
    category: "クラウドストレージ",
    website: "https://www.icloud.com",
    cancellationUrl: "https://www.icloud.com/settings",
    cancellationInstructions: "設定 → Apple ID → iCloud → ストレージプラン → ダウングレード"
  },

  // 学習・教育
  {
    id: "duolingo",
    name: "Duolingo Plus",
    aliases: ["duolingo", "duolingo plus", "ドゥオリンゴ"],
    category: "学習・教育",
    website: "https://www.duolingo.com",
    cancellationUrl: "https://www.duolingo.com/settings/account",
    cancellationInstructions: "設定 → アカウント → サブスクリプション → キャンセル"
  },
  {
    id: "coursera",
    name: "Coursera Plus",
    aliases: ["coursera", "coursera plus", "コーセラ"],
    category: "学習・教育",
    website: "https://www.coursera.org",
    cancellationUrl: "https://www.coursera.org/account",
    cancellationInstructions: "アカウント設定 → サブスクリプション → キャンセル"
  },

  // ゲーム
  {
    id: "nintendo-online",
    name: "Nintendo Switch Online",
    aliases: ["nintendo switch online", "nintendo online", "任天堂オンライン"],
    category: "ゲーム",
    website: "https://www.nintendo.co.jp/switch/online/",
    cancellationUrl: "https://accounts.nintendo.com/",
    cancellationInstructions: "アカウント設定 → サブスクリプション → 自動更新を停止"
  },
  {
    id: "playstation-plus",
    name: "PlayStation Plus",
    aliases: ["playstation plus", "ps plus", "ps+", "プレステプラス"],
    category: "ゲーム",
    website: "https://www.playstation.com/ja-jp/ps-plus/",
    cancellationUrl: "https://account.sonyentertainmentnetwork.com/",
    cancellationInstructions: "アカウント設定 → サブスクリプション → 自動更新を停止"
  },
  {
    id: "xbox-game-pass",
    name: "Xbox Game Pass",
    aliases: ["xbox game pass", "game pass", "ゲームパス"],
    category: "ゲーム",
    website: "https://www.xbox.com/game-pass",
    cancellationUrl: "https://account.microsoft.com/services/",
    cancellationInstructions: "Microsoft アカウント → サービスとサブスクリプション → キャンセル"
  },

  // ニュース・雑誌
  {
    id: "kindle-unlimited",
    name: "Kindle Unlimited",
    aliases: ["kindle unlimited", "キンドルアンリミテッド"],
    category: "ニュース・雑誌",
    website: "https://www.amazon.co.jp/kindle-dbs/hz/signup",
    cancellationUrl: "https://www.amazon.co.jp/gp/digital/fiona/manage",
    cancellationInstructions: "Kindle管理 → メンバーシップ → キャンセル"
  },
  {
    id: "audible",
    name: "Audible",
    aliases: ["audible", "オーディブル"],
    category: "ニュース・雑誌",
    website: "https://www.audible.co.jp",
    cancellationUrl: "https://www.audible.co.jp/account",
    cancellationInstructions: "アカウント設定 → メンバーシップ → キャンセル"
  },

  // ビジネスツール
  {
    id: "notion",
    name: "Notion",
    aliases: ["notion", "ノーション"],
    category: "ビジネスツール",
    website: "https://www.notion.so",
    cancellationUrl: "https://www.notion.so/my/account",
    cancellationInstructions: "設定 → プランと請求 → ダウングレード"
  },
  {
    id: "slack",
    name: "Slack",
    aliases: ["slack", "スラック"],
    category: "ビジネスツール",
    website: "https://slack.com",
    cancellationUrl: "https://slack.com/account",
    cancellationInstructions: "ワークスペース設定 → 請求 → プランを変更"
  },
  {
    id: "zoom",
    name: "Zoom",
    aliases: ["zoom", "ズーム"],
    category: "ビジネスツール",
    website: "https://zoom.us",
    cancellationUrl: "https://zoom.us/account",
    cancellationInstructions: "アカウント設定 → 請求 → プランを変更"
  }
]

// サービス名からサービス情報を検索する関数
export function findServiceByName(name: string): SubscriptionService | null {
  const normalizedName = name.toLowerCase().trim()
  
  for (const service of SUBSCRIPTION_SERVICES) {
    if (service.name.toLowerCase() === normalizedName) {
      return service
    }
    
    // 別名で検索
    if (service.aliases.some(alias => alias.toLowerCase() === normalizedName)) {
      return service
    }
  }
  
  return null
}

// 部分一致でサービスを検索する関数
export function searchServices(query: string): SubscriptionService[] {
  const normalizedQuery = query.toLowerCase().trim()
  
  return SUBSCRIPTION_SERVICES.filter(service => {
    // 完全一致
    if (service.name.toLowerCase().includes(normalizedQuery)) {
      return true
    }
    
    // 別名で部分一致
    if (service.aliases.some(alias => alias.toLowerCase().includes(normalizedQuery))) {
      return true
    }
    
    return false
  })
}

// カテゴリ別にサービスを取得する関数
export function getServicesByCategory(category: string): SubscriptionService[] {
  return SUBSCRIPTION_SERVICES.filter(service => service.category === category)
}

// すべてのカテゴリを取得する関数
export function getAllCategories(): string[] {
  return [...new Set(SUBSCRIPTION_SERVICES.map(service => service.category))]
} 