"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { CreditCard, Mail, Lock, User, Eye, EyeOff } from "lucide-react"

export function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isSignUp) {
        await signUp(email, password, displayName)
        setSuccess("アカウントが正常に作成されました！")
      } else {
        await signIn(email, password)
        setSuccess("ログインしました！")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setDisplayName("")
    setError("")
    setSuccess("")
  }

  const toggleMode = () => {
    setIsSignUp(!isSignUp)
    resetForm()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg inline-block mb-4">
            <CreditCard className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">サブ助</h1>
          <p className="text-gray-600 mt-2">サブスクリプション管理アプリ</p>
        </div>

        {/* ログインフォーム */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">{isSignUp ? "アカウント作成" : "ログイン"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 表示名（サインアップ時のみ） */}
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">表示名</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="山田太郎"
                      className="pl-10"
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              {/* メールアドレス */}
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* パスワード */}
              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignUp ? "6文字以上で入力" : "パスワードを入力"}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {isSignUp && <p className="text-xs text-gray-500">パスワードは6文字以上で入力してください</p>}
              </div>

              {/* エラーメッセージ */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* 成功メッセージ */}
              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">{success}</AlertDescription>
                </Alert>
              )}

              {/* 送信ボタン */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isSignUp ? "作成中..." : "ログイン中..."}
                  </div>
                ) : isSignUp ? (
                  "アカウント作成"
                ) : (
                  "ログイン"
                )}
              </Button>
            </form>

            {/* モード切り替え */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isSignUp ? "すでにアカウントをお持ちですか？" : "アカウントをお持ちでない方は"}
              </p>
              <Button
                variant="link"
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium"
              >
                {isSignUp ? "ログインはこちら" : "アカウント作成はこちら"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* フッター */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 サブ助. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
