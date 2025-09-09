"use client"

import { useEffect, useRef, useState } from 'react'

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpired?: () => void
  className?: string
}

declare global {
  interface Window {
    turnstile: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark'
          size?: 'normal' | 'compact' | 'invisible'
        }
      ) => string
      reset: (widgetId: string) => void
    }
  }
}

export function TurnstileComponent({ 
  onVerify, 
  onError, 
  onExpired, 
  className 
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [widgetId, setWidgetId] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const handleVerify = (token: string) => {
    onVerify(token)
  }

  const handleExpired = () => {
    onExpired?.()
  }

  const handleError = () => {
    onError?.()
  }

  const reset = () => {
    if (widgetId && window.turnstile) {
      window.turnstile.reset(widgetId)
    }
  }

  useEffect(() => {
    // Turnstileスクリプトの読み込み
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    script.onload = () => {
      setIsLoaded(true)
    }
    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (isLoaded && containerRef.current && window.turnstile) {
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      
      if (!siteKey) {
        console.warn('Turnstile site key is not configured')
        return
      }

      const id = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: handleVerify,
        'expired-callback': handleExpired,
        'error-callback': handleError,
        theme: 'light',
        size: 'normal'
      })
      
      setWidgetId(id)
    }
  }, [isLoaded])

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  if (!siteKey) {
    return (
      <div className={`${className} p-4 border border-gray-300 rounded-md bg-gray-50`}>
        <p className="text-sm text-gray-600 text-center">
          Turnstileが設定されていません
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div ref={containerRef} className="flex justify-start"></div>
    </div>
  )
} 