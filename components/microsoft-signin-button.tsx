"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MicrosoftIcon } from "./ui/microsoft-icon"
import { useAuth } from "@/app/contexts/AuthContext"

interface MicrosoftSignInButtonProps {
  mode: "signin" | "signup"
  onSuccess?: () => void
  onError?: (error: string) => void
  disabled?: boolean
  onClick?: () => boolean | void
}

export function MicrosoftSignInButton({ mode, onSuccess, onError, disabled, onClick }: MicrosoftSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const { signInWithMicrosoft } = useAuth()

  const handleMicrosoftSignIn = async () => {
    if (onClick) {
      const result = onClick()
      if (result === false) {
        // onClickでfalseが返された場合、エラーメッセージは既に設定されているので処理を停止
        return
      }
    }
    
    setLoading(true)

    try {
      await signInWithMicrosoft()
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
      className="w-full border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={handleMicrosoftSignIn}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          処理中...
        </div>
      ) : (
        <>
          <MicrosoftIcon className="mr-2 h-4 w-4" />
          <span className="text-gray-700 font-medium">Microsoftで{mode === "signup" ? "アカウント作成" : "ログイン"}</span>
        </>
      )}
    </Button>
  )
} 