"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth"
import { auth, signInWithGoogle as firebaseSignInWithGoogle, signInWithMicrosoft as firebaseSignInWithMicrosoft, signInWithTwitter as firebaseSignInWithTwitter, signOutUser, autoLinkAccount } from "@/lib/firebase"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithMicrosoft: () => Promise<void>
  signInWithTwitter: () => Promise<void>
  logout: () => Promise<void>
  // SNSログイン用のセキュリティ情報
  snsLoginAttempts: number
  isSnsLocked: boolean
  resetSnsLoginAttempts: () => void
  // アカウント連携機能
  linkAccount: (email: string, password: string, credential: any) => Promise<void>
  showLinkDialog: boolean
  linkDialogEmail: string
  linkDialogProvider: string
  linkDialogCredential: any
  setShowLinkDialog: (show: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  
  // SNSログイン用のセキュリティ状態
  const [snsLoginAttempts, setSnsLoginAttempts] = useState(0)
  const [isSnsLocked, setIsSnsLocked] = useState(false)
  const [snsLockoutTime, setSnsLockoutTime] = useState<Date | null>(null)

  // アカウント連携用の状態
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [linkDialogEmail, setLinkDialogEmail] = useState("")
  const [linkDialogProvider, setLinkDialogProvider] = useState("")
  const [linkDialogCredential, setLinkDialogCredential] = useState<any>(null)

  // SNSログインの制限設定
  const MAX_SNS_LOGIN_ATTEMPTS = 3
  const SNS_LOCKOUT_DURATION = 10 * 60 * 1000 // 10分

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setMounted(true)
  }, [])

  // 認証状態の監視を最適化
  useEffect(() => {
    if (!mounted) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [mounted])

  // SNSロックアウト状態のチェックを最適化（1秒間隔から5秒間隔に変更）
  useEffect(() => {
    if (!snsLockoutTime) return

    const checkSnsLockout = () => {
      if (new Date().getTime() - snsLockoutTime.getTime() > SNS_LOCKOUT_DURATION) {
        setIsSnsLocked(false)
        setSnsLockoutTime(null)
        setSnsLoginAttempts(0)
      }
    }

    const interval = setInterval(checkSnsLockout, 5000) // 5秒間隔に変更
    return () => clearInterval(interval)
  }, [snsLockoutTime])

  // 関数をuseCallbackでメモ化
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code))
    }
  }, [])

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName })
      }
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code))
    }
  }, [])

  const signInWithGoogle = useCallback(async () => {
    // SNSロックアウトチェック
    if (isSnsLocked) {
      throw new Error("SNSログインが一時的にロックされています。しばらく時間をおいてから再試行してください。")
    }

    try {
      const result = await firebaseSignInWithGoogle()
      
      // ポップアップがキャンセルされた場合
      if (!result) {
        throw new Error("ログインがキャンセルされました")
      }
      
      // 成功時はログイン試行回数をリセット
      setSnsLoginAttempts(0)
    } catch (error: any) {
      // キャンセルエラーの場合は特別処理
      if (error.message === "ログインがキャンセルされました") {
        throw error
      }
      
      // アカウント連携が必要な場合
      if (error.code === 'auth/account-exists-with-different-credential' && error.email && error.credential) {
        setLinkDialogEmail(error.email)
        setLinkDialogProvider("Google")
        setLinkDialogCredential(error.credential)
        setShowLinkDialog(true)
        return
      }
      
      // 失敗時の処理
      const newAttempts = snsLoginAttempts + 1
      setSnsLoginAttempts(newAttempts)
      
      // 最大試行回数でロックアウト
      if (newAttempts >= MAX_SNS_LOGIN_ATTEMPTS) {
        setIsSnsLocked(true)
        setSnsLockoutTime(new Date())
        throw new Error("セキュリティのため、SNSログインが一時的にロックされました。10分後に再試行してください。")
      }
      
      throw new Error(getSnsErrorMessage(error.code))
    }
  }, [isSnsLocked, snsLoginAttempts])

  const signInWithMicrosoft = useCallback(async () => {
    // SNSロックアウトチェック
    if (isSnsLocked) {
      throw new Error("SNSログインが一時的にロックされています。しばらく時間をおいてから再試行してください。")
    }

    try {
      const result = await firebaseSignInWithMicrosoft()
      
      // ポップアップがキャンセルされた場合
      if (!result) {
        throw new Error("ログインがキャンセルされました")
      }
      
      // 成功時はログイン試行回数をリセット
      setSnsLoginAttempts(0)
    } catch (error: any) {
      // キャンセルエラーの場合は特別処理
      if (error.message === "ログインがキャンセルされました") {
        throw error
      }
      
      // アカウント連携が必要な場合
      if (error.code === 'auth/account-exists-with-different-credential' && error.email && error.credential) {
        setLinkDialogEmail(error.email)
        setLinkDialogProvider("Microsoft")
        setLinkDialogCredential(error.credential)
        setShowLinkDialog(true)
        return
      }
      
      // 失敗時の処理
      const newAttempts = snsLoginAttempts + 1
      setSnsLoginAttempts(newAttempts)
      
      // 最大試行回数でロックアウト
      if (newAttempts >= MAX_SNS_LOGIN_ATTEMPTS) {
        setIsSnsLocked(true)
        setSnsLockoutTime(new Date())
        throw new Error("セキュリティのため、SNSログインが一時的にロックされました。10分後に再試行してください。")
      }
      
      throw new Error(getSnsErrorMessage(error.code))
    }
  }, [isSnsLocked, snsLoginAttempts])

  const signInWithTwitter = useCallback(async () => {
    // SNSロックアウトチェック
    if (isSnsLocked) {
      throw new Error("SNSログインが一時的にロックされています。しばらく時間をおいてから再試行してください。")
    }

    try {
      const result = await firebaseSignInWithTwitter()
      
      // ポップアップがキャンセルされた場合
      if (!result) {
        throw new Error("ログインがキャンセルされました")
      }
      
      // 成功時はログイン試行回数をリセット
      setSnsLoginAttempts(0)
    } catch (error: any) {
      // キャンセルエラーの場合は特別処理
      if (error.message === "ログインがキャンセルされました") {
        throw error
      }
      
      // アカウント連携が必要な場合
      if (error.code === 'auth/account-exists-with-different-credential' && error.email && error.credential) {
        setLinkDialogEmail(error.email)
        setLinkDialogProvider("Twitter")
        setLinkDialogCredential(error.credential)
        setShowLinkDialog(true)
        return
      }
      
      // 失敗時の処理
      const newAttempts = snsLoginAttempts + 1
      setSnsLoginAttempts(newAttempts)
      
      // 最大試行回数でロックアウト
      if (newAttempts >= MAX_SNS_LOGIN_ATTEMPTS) {
        setIsSnsLocked(true)
        setSnsLockoutTime(new Date())
        throw new Error("セキュリティのため、SNSログインが一時的にロックされました。10分後に再試行してください。")
      }
      
      throw new Error(getSnsErrorMessage(error.code))
    }
  }, [isSnsLocked, snsLoginAttempts])

  const linkAccount = useCallback(async (email: string, password: string, credential: any) => {
    try {
      await autoLinkAccount(email, password, credential)
      setShowLinkDialog(false)
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code))
    }
  }, [])

  const logout = useCallback(async () => {
    await signOutUser()
  }, [])

  const resetSnsLoginAttempts = useCallback(() => {
    setSnsLoginAttempts(0)
    setIsSnsLocked(false)
    setSnsLockoutTime(null)
  }, [])

  const value = {
    user,
    loading: !mounted || loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithMicrosoft,
    signInWithTwitter,
    logout,
    snsLoginAttempts,
    isSnsLocked,
    resetSnsLoginAttempts,
    linkAccount,
    showLinkDialog,
    linkDialogEmail,
    linkDialogProvider,
    linkDialogCredential,
    setShowLinkDialog,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Firebase エラーコードを日本語メッセージに変換
function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/user-not-found":
    case "auth/wrong-password":
      // セキュリティのため、ユーザー存在の有無を判別できないように統一メッセージ
      return "メールアドレスまたはパスワードが正しくありません"
    case "auth/email-already-in-use":
      return "このメールアドレスは既に使用されています"
    case "auth/weak-password":
      return "パスワードが弱すぎます。6文字以上で入力してください"
    case "auth/invalid-email":
      return "メールアドレスの形式が正しくありません"
    case "auth/too-many-requests":
      return "リクエストが多すぎます。しばらく時間をおいてから再試行してください"
    case "auth/network-request-failed":
      return "ネットワークエラーが発生しました。インターネット接続をご確認ください"
    case "auth/user-disabled":
      return "このアカウントは無効化されています"
    case "auth/operation-not-allowed":
      return "この操作は許可されていません"
    case "auth/invalid-credential":
      return "認証情報が無効です"
    case "auth/account-exists-with-different-credential":
      return "このメールアドレスは既に別の認証方法で登録されています。元の認証方法でログインしてください"
    default:
      return "認証エラーが発生しました。もう一度お試しください"
  }
}

// SNSログイン用のエラーメッセージ変換
function getSnsErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "ログインがキャンセルされました"
    case "auth/account-exists-with-different-credential":
      return "このメールアドレスは既に別の認証方法で登録されています。\n\nアカウント連携ダイアログが表示されます。"
    case "auth/popup-blocked":
      return "ポップアップがブロックされました。ブラウザの設定でポップアップを許可してください"
    case "auth/network-request-failed":
      return "ネットワークエラーが発生しました。インターネット接続をご確認ください"
    case "auth/too-many-requests":
      return "リクエストが多すぎます。しばらく時間をおいてから再試行してください"
    case "auth/user-disabled":
      return "このアカウントは無効化されています"
    case "auth/operation-not-allowed":
      return "この認証方法は許可されていません"
    case "auth/invalid-credential":
      return "認証情報が無効です"
    case "auth/auth-domain-config-required":
      return "認証ドメインの設定が必要です"
    case "auth/unauthorized-domain":
      return "このドメインからの認証は許可されていません"
    default:
      return "SNSログインでエラーが発生しました。もう一度お試しください"
  }
} 