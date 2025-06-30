"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Mail, Link, CheckCircle, XCircle } from "lucide-react"

interface AccountLinkDialogProps {
  isOpen: boolean
  email: string
  providerName: string
  onConfirm: (password: string) => Promise<void>
  onCancel: () => void
  onSuccess: () => void
}

export function AccountLinkDialog({ 
  isOpen, 
  email, 
  providerName, 
  onConfirm, 
  onCancel, 
  onSuccess 
}: AccountLinkDialogProps) {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleConfirm = async () => {
    if (!password.trim()) {
      setError("パスワードを入力してください")
      return
    }

    setLoading(true)
    setError("")

    try {
      await onConfirm(password)
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setPassword("")
    setError("")
    setSuccess(false)
    onCancel()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Link className="h-8 w-8 text-blue-600 mr-2" />
            <CardTitle className="text-lg">アカウント連携</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!success ? (
            <>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{email}</strong> は既にメール・パスワードで登録されています。
                </p>
                <p className="text-sm text-gray-600">
                  {providerName}アカウントと連携するには、既存のパスワードを入力してください。
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link-password" className="text-sm flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  既存のパスワード
                </Label>
                <Input
                  id="link-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="パスワードを入力"
                  className="w-full"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleConfirm()
                    }
                  }}
                />
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1"
                  disabled={loading}
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1"
                  disabled={loading || !password.trim()}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      連携中...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Link className="h-4 w-4 mr-2" />
                      連携する
                    </div>
                  )}
                </Button>
              </div>

              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded border border-blue-200">
                <div className="font-medium text-blue-800 mb-1">💡 連携のメリット：</div>
                <ul className="text-blue-700 space-y-1">
                  <li>• どの認証方法でも同じアカウントにアクセス可能</li>
                  <li>• データの重複を防ぐ</li>
                  <li>• より便利なログイン体験</li>
                </ul>
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <div className="font-medium text-blue-800 mb-1">🔒 セキュリティ機能：</div>
                  <ul className="text-blue-700 space-y-1">
                    <li>• アカウント連携による安全な認証</li>
                    <li>• 多要素認証（未実装）</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  連携完了！
                </h3>
                <p className="text-sm text-gray-600">
                  {providerName}アカウントとの連携が正常に完了しました。
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  今後はどちらの方法でもログインできます。
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 