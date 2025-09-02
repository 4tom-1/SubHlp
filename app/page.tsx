"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/contexts/AuthContext"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // ローディング中またはユーザーが未認証の場合はローディング表示
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // ユーザーが認証済みの場合のみダッシュボードを表示
  if (user) {
    return <Dashboard />
  }

  // 認証されていない場合は何も表示しない（ログインページにリダイレクトされる）
  return null
}
