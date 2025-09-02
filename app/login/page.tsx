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
import { MicrosoftSignInButton } from "@/components/microsoft-signin-button"
import { TwitterSignInButton } from "@/components/twitter-signin-button"
import { AccountLinkDialog } from "@/components/account-link-dialog"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useTurnstile } from "@/hooks/useTurnstile"
import { TurnstileComponent } from "@/components/ui/turnstile"

export default function LoginPage() {
  const router = useRouter()
  const { 
    user, 
    loading: authLoading, 
    signIn, 
    signUp, 
    snsLoginAttempts, 
    isSnsLocked, 
    resetSnsLoginAttempts,
    linkAccount,
    showLinkDialog,
    linkDialogEmail,
    linkDialogProvider,
    linkDialogCredential,
    setShowLinkDialog
  } = useAuth()

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
  
  // セキュリティ機能
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null)
  
  // Turnstile機能
  const [showTurnstile, setShowTurnstile] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const { verifyTurnstile, isVerifying: isTurnstileVerifying } = useTurnstile()
  
  // ログイン試行回数の制限（5回で15分ロックアウト）
  const MAX_LOGIN_ATTEMPTS = 5
  const LOCKOUT_DURATION = 15 * 60 * 1000 // 15分

  const [agree, setAgree] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  // ロックアウト状態のチェック
  useEffect(() => {
    const checkLockout = () => {
      if (lockoutTime && new Date().getTime() - lockoutTime.getTime() > LOCKOUT_DURATION) {
        setIsLocked(false)
        setLockoutTime(null)
        setLoginAttempts(0)
        setShowTurnstile(false)
        setTurnstileToken(null)
      }
    }

    const interval = setInterval(checkLockout, 1000)
    return () => clearInterval(interval)
  }, [lockoutTime])

  // アカウント作成時は常にTurnstileを表示
  useEffect(() => {
    if (isSignUp) {
      setShowTurnstile(true)
    }
  }, [isSignUp])

  const handleTurnstileVerify = async (token: string) => {
    setTurnstileToken(token)
    const isValid = await verifyTurnstile(token)
    if (!isValid) {
      setError("セキュリティ確認に失敗しました。もう一度お試しください。")
      setTurnstileToken(null)
    }
  }

  const handleTurnstileError = () => {
    setError("セキュリティ確認に失敗しました。もう一度お試しください。")
    setTurnstileToken(null)
  }

  const handleTurnstileExpired = () => {
    setError("セキュリティ確認が期限切れになりました。もう一度お試しください。")
    setTurnstileToken(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // ロックアウトチェック
    if (isLocked) {
      setError("アカウントが一時的にロックされています。しばらく時間をおいてから再試行してください。")
      return
    }

    // アカウント作成時の必須項目チェック
    if (isSignUp) {
      if (!agree) {
        setError("アカウント作成には利用規約とプライバシーポリシーへの同意が必要です。")
        return
      }
      if (!displayName.trim()) {
        setError("表示名を入力してください。")
        return
      }
    }

    // Turnstile検証が必要な場合
    if (showTurnstile && !turnstileToken) {
      setError("セキュリティ確認が必要です。")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      if (isSignUp) {
        await signUp(email, password, displayName)
        setSuccess("アカウントが正常に作成されました！")
        // サインアップ成功時はログイン試行回数をリセット
        setLoginAttempts(0)
        setShowTurnstile(false)
        setTurnstileToken(null)
      } else {
        await signIn(email, password)
        setSuccess("ログインしました！")
        // ログイン成功時はログイン試行回数をリセット
        setLoginAttempts(0)
        setShowTurnstile(false)
        setTurnstileToken(null)
      }
    } catch (error: any) {
      setError(error.message)
      
      // ログイン失敗時の処理
      if (!isSignUp) {
        const newAttempts = loginAttempts + 1
        setLoginAttempts(newAttempts)
        
        // 3回失敗でTurnstile表示
        if (newAttempts >= 3 && !showTurnstile) {
          setShowTurnstile(true)
        }
        
        // 最大試行回数でロックアウト
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          setIsLocked(true)
          setLockoutTime(new Date())
          setError("セキュリティのため、アカウントが一時的にロックされました。15分後に再試行してください。")
        }
      }
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
    // モード切り替え時にTurnstile状態をリセット
    if (!isSignUp) {
      setShowTurnstile(false)
      setTurnstileToken(null)
    }
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

  const handleLinkAccount = async (password: string) => {
    await linkAccount(linkDialogEmail, password, linkDialogCredential)
  }

  const handleLinkSuccess = () => {
    setShowLinkDialog(false)
    setSuccess(`${linkDialogProvider}アカウントとの連携が完了しました！`)
  }

  const handleLinkCancel = () => {
    setShowLinkDialog(false)
    setError("アカウント連携をキャンセルしました。")
  }

  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* ヘッダー */}
      <header className="w-full text-center py-4 sm:py-6">
        <div className="flex items-center justify-center space-x-2">
          <CreditCard className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">サブ助</h1>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 mt-2">サブスクリプション管理を簡単に</p>
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg space-y-4 sm:space-y-6">
          {/* エラーメッセージ */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="whitespace-pre-line text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* 成功メッセージ */}
          {success && (
            <Alert>
              <AlertDescription className="text-sm">{success}</AlertDescription>
            </Alert>
          )}

          {/* ロックアウトメッセージ */}
          {isLocked && lockoutTime && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">
                アカウントが一時的にロックされています。
                <br />
                残り時間: {Math.max(0, Math.ceil((LOCKOUT_DURATION - (new Date().getTime() - lockoutTime.getTime())) / 1000 / 60))}分
              </AlertDescription>
            </Alert>
          )}

          {/* パスワードリセットフォーム */}
          {showReset ? (
            <>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-center text-sm sm:text-base">パスワードリセット</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail" className="text-sm">メールアドレス</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="resetEmail"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="example@email.com"
                          className="pl-10 text-sm"
                          required
                        />
                      </div>
                    </div>

                    {resetMsg && (
                      <Alert>
                        <AlertDescription className="text-sm">{resetMsg}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        onClick={handlePasswordReset} 
                        className="text-sm py-2"
                        disabled={!resetEmail}
                      >
                        リセットメール送信
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowReset(false)} 
                        className="text-sm py-2"
                      >
                        戻る
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* ログインフォーム */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-center text-sm sm:text-base">{isSignUp ? "アカウント作成" : "ログイン"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {/* 表示名（サインアップ時のみ） */}
                    {isSignUp && (
                      <div className="space-y-2">
                        <Label htmlFor="displayName" className="text-sm">
                          表示名<span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="山田太郎"
                            className="pl-10 text-sm"
                            required={isSignUp}
                          />
                        </div>
                        {!displayName.trim() && (
                          <div className="text-xs text-red-500">
                            表示名を入力してください。
                          </div>
                        )}
                      </div>
                    )}

                    {/* メールアドレス */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">
                        メールアドレス<span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@email.com"
                          className="pl-10 text-sm"
                          required
                        />
                      </div>
                    </div>

                    {/* パスワード */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm">
                        パスワード<span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10 pr-10 text-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Turnstile */}
                    {showTurnstile && (
                      <div className="space-y-2">
                        <Label className="text-sm">セキュリティ確認</Label>
                        <TurnstileComponent
                          onVerify={handleTurnstileVerify}
                          onError={handleTurnstileError}
                          onExpired={handleTurnstileExpired}
                          className="flex justify-start"
                        />
                        {isTurnstileVerifying && (
                          <div className="text-xs sm:text-sm text-gray-500 text-center">
                            セキュリティ確認中...
                          </div>
                        )}
                      </div>
                    )}

                    {/* 利用規約同意（サインアップ時のみ） */}
                    {isSignUp && (
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            id="agree"
                            checked={agree}
                            onChange={(e) => setAgree(e.target.checked)}
                            className="mt-1 accent-blue-600"
                            required
                          />
                          <Label htmlFor="agree" className="text-xs leading-relaxed">
                            <span className="text-red-500">*</span>
                            <a href="/terms.html" target="_blank" className="text-blue-600 hover:underline">
                              利用規約
                            </a>
                            と
                            <a href="/privacy.html" target="_blank" className="text-blue-600 hover:underline">
                              プライバシーポリシー
                            </a>
                            に同意します
                            <span className="text-red-500 ml-1">（必須）</span>
                          </Label>
                        </div>
                        {!agree && (
                          <div className="text-xs text-red-500">
                            アカウント作成には利用規約とプライバシーポリシーへの同意が必要です。
                          </div>
                        )}
                      </div>
                    )}

                    {/* ログイン試行回数表示 */}
                    {!isSignUp && loginAttempts > 0 && (
                      <div className="text-xs sm:text-sm text-orange-600 text-center">
                        ログイン試行回数: {loginAttempts}/{MAX_LOGIN_ATTEMPTS}
                      </div>
                    )}

                    <Button type="submit" className="w-full text-sm py-2" disabled={loading || (isSignUp && !agree) || (showTurnstile && !turnstileToken)}>
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
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500 font-medium">または</span>
                      </div>
                    </div>

                    {/* SNSログインボタン（レスポンシブ対応） */}
                    <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
                      <GoogleSignInButton
                        mode={isSignUp ? "signup" : "signin"}
                        onClick={() => {
                          if (isSignUp && !agree) {
                            setError("アカウント作成には利用規約とプライバシーポリシーへの同意が必要です。")
                            return false // 認証処理を実行しない
                          }
                          if (showTurnstile && !turnstileToken) {
                            setError("セキュリティ確認が必要です。")
                            return false // 認証処理を実行しない
                          }
                          return true // 認証処理を実行
                        }}
                        onSuccess={() => {
                          setSuccess(`Googleアカウントで${isSignUp ? "アカウントを作成" : "ログイン"}しました！`)
                          // 成功時はログイン試行回数をリセット
                          setLoginAttempts(0)
                          setShowTurnstile(false)
                          setTurnstileToken(null)
                        }}
                        onError={(error) => {
                          if (error === "ログインがキャンセルされました") {
                            setError("ログインがキャンセルされました。\nもう一度お試しください。")
                          } else if (error.includes("別の認証方法で登録されています") || error.includes("アカウント連携ダイアログ")) {
                            setError("このメールアドレスは既に別の認証方法で登録されています。\n\n多要素認証は未実装です。")
                          } else {
                            setError(error)
                          }
                          
                          // ログイン失敗時の処理（キャンセル以外）
                          if (error !== "ログインがキャンセルされました") {
                            const newAttempts = loginAttempts + 1
                            setLoginAttempts(newAttempts)
                            
                            // 3回失敗でTurnstile表示
                            if (newAttempts >= 3 && !showTurnstile) {
                              setShowTurnstile(true)
                            }
                            
                            // 最大試行回数でロックアウト
                            if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
                              setIsLocked(true)
                              setLockoutTime(new Date())
                              setError("セキュリティのため、アカウントが一時的にロックされました。15分後に再試行してください。")
                            }
                          }
                        }}
                        disabled={loading || isSnsLocked}
                      />

                      <MicrosoftSignInButton
                        mode={isSignUp ? "signup" : "signin"}
                        onClick={() => {
                          if (isSignUp && !agree) {
                            setError("アカウント作成には利用規約とプライバシーポリシーへの同意が必要です。")
                            return false
                          }
                          if (showTurnstile && !turnstileToken) {
                            setError("セキュリティ確認が必要です。")
                            return false
                          }
                          return true
                        }}
                        onSuccess={() => {
                          setSuccess(`Microsoftアカウントで${isSignUp ? "アカウントを作成" : "ログイン"}しました！`)
                          // 成功時はログイン試行回数をリセット
                          setLoginAttempts(0)
                          setShowTurnstile(false)
                          setTurnstileToken(null)
                        }}
                        onError={(error) => {
                          if (error === "ログインがキャンセルされました") {
                            setError("ログインがキャンセルされました。\nもう一度お試しください。")
                          } else if (error.includes("別の認証方法で登録されています") || error.includes("アカウント連携ダイアログ")) {
                            setError("このメールアドレスは既に別の認証方法で登録されています。\n\n多要素認証は未実装です。")
                          } else {
                            setError(error)
                          }
                          
                          // ログイン失敗時の処理（キャンセル以外）
                          if (error !== "ログインがキャンセルされました") {
                            const newAttempts = loginAttempts + 1
                            setLoginAttempts(newAttempts)
                            
                            // 3回失敗でTurnstile表示
                            if (newAttempts >= 3 && !showTurnstile) {
                              setShowTurnstile(true)
                            }
                            
                            // 最大試行回数でロックアウト
                            if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
                              setIsLocked(true)
                              setLockoutTime(new Date())
                              setError("セキュリティのため、アカウントが一時的にロックされました。15分後に再試行してください。")
                            }
                          }
                        }}
                        disabled={loading || isSnsLocked}
                      />

                      <TwitterSignInButton
                        mode={isSignUp ? "signup" : "signin"}
                        onClick={() => {
                          if (isSignUp && !agree) {
                            setError("アカウント作成には利用規約とプライバシーポリシーへの同意が必要です。")
                            return false
                          }
                          if (showTurnstile && !turnstileToken) {
                            setError("セキュリティ確認が必要です。")
                            return false
                          }
                          return true
                        }}
                        onSuccess={() => {
                          setSuccess(`Xアカウントで${isSignUp ? "アカウントを作成" : "ログイン"}しました！`)
                          // 成功時はログイン試行回数をリセット
                          setLoginAttempts(0)
                          setShowTurnstile(false)
                          setTurnstileToken(null)
                        }}
                        onError={(error) => {
                          if (error === "ログインがキャンセルされました") {
                            setError("ログインがキャンセルされました。\nもう一度お試しください。")
                          } else if (error.includes("別の認証方法で登録されています") || error.includes("アカウント連携ダイアログ")) {
                            setError("このメールアドレスは既に別の認証方法で登録されています。\n\n多要素認証は未実装です。")
                          } else {
                            setError(error)
                          }
                          
                          // ログイン失敗時の処理（キャンセル以外）
                          if (error !== "ログインがキャンセルされました") {
                            const newAttempts = loginAttempts + 1
                            setLoginAttempts(newAttempts)
                            
                            // 3回失敗でTurnstile表示
                            if (newAttempts >= 3 && !showTurnstile) {
                              setShowTurnstile(true)
                            }
                            
                            // 最大試行回数でロックアウト
                            if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
                              setIsLocked(true)
                              setLockoutTime(new Date())
                              setError("セキュリティのため、アカウントが一時的にロックされました。15分後に再試行してください。")
                            }
                          }
                        }}
                        disabled={loading || isSnsLocked}
                      />
                    </div>
                  </form>

                  {/* パスワードリセットリンク */}
                  {!isSignUp && (
                    <div className="mt-2 text-center">
                      <Button
                        variant="link"
                        className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium text-xs"
                        onClick={() => setShowReset(true)}
                      >
                        パスワードを忘れた方はこちら
                      </Button>
                    </div>
                  )}

                  {/* モード切り替え */}
                  <div className="mt-3 text-center">
                    <p className="text-xs text-gray-600">
                      {isSignUp ? "すでにアカウントをお持ちですか？" : "アカウントをお持ちでない方は"}
                    </p>
                    <Button
                      variant="link"
                      onClick={toggleMode}
                      className="text-blue-600 hover:text-blue-800 p-0 h-auto font-medium text-xs"
                    >
                      {isSignUp ? "ログインはこちら" : "アカウント作成はこちら"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      
      {/* アカウント連携ダイアログ */}
      <AccountLinkDialog
        isOpen={showLinkDialog}
        email={linkDialogEmail}
        providerName={linkDialogProvider}
        onConfirm={handleLinkAccount}
        onCancel={handleLinkCancel}
        onSuccess={handleLinkSuccess}
      />
      
      {/* フッターは通常フローで配置 */}
      <footer className="w-full text-center text-xs text-gray-500 py-2">
        © 2025 サブ助. All rights reserved.
      </footer>
    </div>
  )
} 