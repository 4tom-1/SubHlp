"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GoogleIcon } from "@/components/icons/google-icon"
import { useAuth } from "@/contexts/auth-context"

interface GoogleSignInButtonProps {
  mode: "signin" | "signup"
  onSuccess?: () => void
  onError?: (error: string) => void
  disabled?: boolean
}

export function GoogleSignInButton({ mode, onSuccess, onError, disabled }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)
  const { signInWithGoogle } = useAuth()

  const handleGoogleSignIn = async () => {
    setLoading(true)

    try {
      await signInWithGoogle()
      onSuccess?.()
    } catch (error: any) {
      onError?.(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={handleGoogleSignIn}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          処理中...
        </div>
      ) : (
        <>
          <GoogleIcon className="mr-2 h-4 w-4" />
          <span className="text-gray-700 font-medium">Googleで{mode === "signup" ? "アカウント作成" : "ログイン"}</span>
        </>
      )}
    </Button>
  )
}
