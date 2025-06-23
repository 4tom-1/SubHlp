"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/app/contexts/AuthContext"
import { CreditCard, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { GoogleSignInButton } from "@/components/google-signin-button"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function LoginPage() {
  const router = useRouter()
  const { user, loading: authLoading, signIn, signUp } = useAuth()

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetMsg, setResetMsg] = useState("")

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/")
    }
  }, [user, authLoading, router])

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

  const handlePasswordReset = async () => {
    setResetMsg("")
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      setResetMsg("パスワードリセット用メールを送信しました。メールをご確認ください。")
    } catch (error: any) {
      setResetMsg("リセットメールの送信に失敗しました。メールアドレスをご確認ください。")
    }
  }

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
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

        {/* パスワードリセットUI */}
        {showReset ? (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">パスワードリセット</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">登録メールアドレス</Label>
                  <Input
                    id="resetEmail"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <Button type="button" onClick={handlePasswordReset} className="w-full">
                  パスワードリセットメール送信
                </Button>
                {resetMsg && <p className="text-sm mt-2 text-center">{resetMsg}</p>}
                <Button type="button" variant="ghost" onClick={() => setShowReset(false)} className="w-full mt-2">
                  戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
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

                  {/* パスワードリセットリンク（ログイン時のみ） */}
                  {!isSignUp && (
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-blue-600 text-sm hover:underline"
                        onClick={() => setShowReset(true)}
                      >
                        パスワードを忘れた方はこちら
                      </button>
                    </div>
                  )}

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

                  {/* 区切り線 */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500 font-medium">または</span>
                    </div>
                  </div>

                  {/* Googleサインインボタン */}
                  <GoogleSignInButton
                    mode={isSignUp ? "signup" : "signin"}
                    onSuccess={() =>
                      setSuccess(`Googleアカウントで${isSignUp ? "アカウントを作成" : "ログイン"}しました！`)
                    }
                    onError={(error) => setError(error)}
                    disabled={loading}
                  />
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
          </>
        )}

        {/* フッター */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 サブ助. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
} 