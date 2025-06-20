"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { GoogleSignInButton } from "./google-signin-button"
import { CreditCard, Mail, Lock, User, Eye, EyeOff, Shield, Zap } from "lucide-react"

export function EnhancedLoginPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-xl inline-block mb-4 shadow-lg">
            <CreditCard className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">サブ助</h1>
          <p className="text-gray-600">サブスクリプション管理アプリ</p>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-1" />
              <span>安全</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              <span>簡単</span>
            </div>
          </div>
        </div>

        {/* ログインフォーム */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">{isSignUp ? "アカウント作成" : "ログイン"}</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {isSignUp
                ? "新しいアカウントを作成してサブスク管理を始めましょう"
                : "アカウントにログインしてサブスクを管理しましょう"}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Googleサインインボタン */}
            <div className="space-y-4">
              <GoogleSignInButton
                mode={isSignUp ? "signup" : "signin"}
                onSuccess={() =>
                  setSuccess(`Googleアカウントで${isSignUp ? "アカウントを作成" : "ログイン"}しました！`)
                }
                onError={(error) => setError(error)}
                disabled={loading}
              />

              {/* 区切り線 */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-500 font-medium">またはメールアドレスで</span>
                </div>
              </div>
            </div>

            {/* メールアドレスフォーム */}
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
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
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
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2.5"
                disabled={loading}
              >
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
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
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
          <p className="mt-1">安全で簡単なサブスクリプション管理</p>
        </div>
      </div>
    </div>
  )
}
