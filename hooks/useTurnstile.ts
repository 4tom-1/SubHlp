import { useState } from 'react'

interface UseTurnstileReturn {
  verifyTurnstile: (token: string) => Promise<boolean>
  isVerifying: boolean
  error: string | null
}

export function useTurnstile(): UseTurnstileReturn {
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyTurnstile = async (token: string): Promise<boolean> => {
    setIsVerifying(true)
    setError(null)

    try {
      console.log('Turnstile検証を開始...')

      const response = await fetch('/api/verify-turnstile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Turnstile検証エラー:', data.error)
        setError(data.error || 'Turnstile検証に失敗しました')
        return false
      }

      if (data.success) {
        console.log('Turnstile検証成功')
        return true
      } else {
        console.error('Turnstile検証失敗:', data.error)
        setError(data.error || 'Turnstile検証に失敗しました')
        return false
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Turnstile検証中にエラーが発生しました'
      console.error('Turnstile検証例外:', err)
      setError(errorMessage)
      return false
    } finally {
      setIsVerifying(false)
    }
  }

  return {
    verifyTurnstile,
    isVerifying,
    error,
  }
} 