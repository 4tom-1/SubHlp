import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      console.error('Turnstile: トークンが提供されていません')
      return NextResponse.json(
        { error: 'Turnstileトークンが必要です' },
        { status: 400 }
      )
    }

    const secretKey = process.env.TURNSTILE_SECRET_KEY
    if (!secretKey) {
      console.error('Turnstile: シークレットキーが設定されていません')
      return NextResponse.json(
        { error: 'Turnstile設定エラー' },
        { status: 500 }
      )
    }

    console.log('Turnstile検証を開始:', { token: token.substring(0, 10) + '...' })

    // Turnstile検証
    const verificationResponse = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token,
        }),
      }
    )

    if (!verificationResponse.ok) {
      console.error('Turnstile API呼び出しエラー:', verificationResponse.status)
      return NextResponse.json(
        { error: 'Turnstile検証サービスに接続できませんでした' },
        { status: 500 }
      )
    }

    const verificationData = await verificationResponse.json()
    console.log('Turnstile検証結果:', { 
      success: verificationData.success, 
      errorCodes: verificationData['error-codes'] 
    })

    if (!verificationData.success) {
      console.error('Turnstile検証失敗:', verificationData['error-codes'])
      return NextResponse.json(
        { error: 'Turnstile検証に失敗しました' },
        { status: 400 }
      )
    }

    console.log('Turnstile検証成功')

    return NextResponse.json({ 
      success: true,
      message: 'Turnstile検証が完了しました'
    })

  } catch (error) {
    console.error('Turnstile検証エラー:', error)
    return NextResponse.json(
      { error: 'Turnstile検証中にエラーが発生しました' },
      { status: 500 }
    )
  }
} 