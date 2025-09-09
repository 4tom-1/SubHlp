"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TwitterIcon } from "./ui/twitter-icon"
import { useAuth } from "@/app/contexts/AuthContext"

interface TwitterSignInButtonProps {
  mode: "signin" | "signup"
  onSuccess?: () => void
  onError?: (error: string) => void
  disabled?: boolean
  onClick?: () => boolean | void
}

export function TwitterSignInButton({ mode, onSuccess, onError, disabled, onClick }: TwitterSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const { signInWithTwitter } = useAuth()

  const handleTwitterSignIn = async () => {
    if (onClick) {
      const result = onClick()
      if (result === false) {
        // onClickでfalseが返された場合、エラーメッセージは既に設定されているので処理を停止
        return
      }
    }
    
    setLoading(true)

    try {
      await signInWithTwitter()
      onSuccess?.()
    } catch (error: any) {
      if (error.message === "ログインがキャンセルされました") {
        onError?.("ログインがキャンセルされました")
        return
      }
      
      // account-exists-with-different-credentialエラーの場合、より詳細なメッセージを表示
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.email || 'このメールアドレス';
        const existingProvider = error.existingProvider;
        const providerName = getProviderDisplayName(existingProvider);
        
        const detailedMessage = `${email}は既に${providerName}で登録されています。\n\n${providerName}でログインしてください。`;
        
        onError?.(detailedMessage)
        return
      }
      
      if (error.message.includes("ロック") || error.message.includes("セキュリティ")) {
        onError?.(error.message)
      } else {
        onError?.(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  // プロバイダー名を日本語で表示する関数
  const getProviderDisplayName = (providerId: string): string => {
    switch (providerId) {
      case 'google.com':
        return 'Google';
      case 'microsoft.com':
        return 'Microsoft';
      case 'twitter.com':
        return 'X（Twitter）';
      case 'password':
        return 'メール・パスワード';
      default:
        return '別の認証方法';
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="h-12 w-12 rounded-lg border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
      onClick={handleTwitterSignIn}
      disabled={disabled || loading}
      title={`X（Twitter）で${mode === "signup" ? "アカウント作成" : "ログイン"}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
      ) : (
        <TwitterIcon className="h-6 w-6" />
      )}
    </Button>
  )
} 