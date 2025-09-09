"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { NotificationSettings as NotificationSettingsType } from "@/types/subscription"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/app/contexts/AuthContext"

export function NotificationSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<NotificationSettingsType>({
    email: false,
    browser: false,
    daysBeforePayment: 3,
  })

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return
      const docRef = doc(db, "users", user.uid, "settings", "notifications")
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setSettings(docSnap.data() as NotificationSettingsType)
      }
    }
    fetchSettings()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    const docRef = doc(db, "users", user.uid, "settings", "notifications")
    await setDoc(docRef, settings)
    alert("設定を保存しました")
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        setSettings({ ...settings, browser: true })
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">通知設定</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <Label htmlFor="email-notifications" className="text-sm sm:text-base">メール通知</Label>
              <p className="text-xs sm:text-sm text-gray-500">支払日前にメールで通知します</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.email}
              onCheckedChange={(checked) => setSettings({ ...settings, email: checked })}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <Label htmlFor="browser-notifications" className="text-sm sm:text-base">ブラウザ通知</Label>
              <p className="text-xs sm:text-sm text-gray-500">ブラウザのプッシュ通知を使用します</p>
            </div>
            <div className="flex items-center gap-2">
              {!settings.browser && (
                <Button size="sm" variant="outline" onClick={requestNotificationPermission} className="text-xs">
                  許可
                </Button>
              )}
              <Switch
                id="browser-notifications"
                checked={settings.browser}
                onCheckedChange={(checked) => setSettings({ ...settings, browser: checked })}
                disabled={!("Notification" in window)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="days-before" className="text-sm sm:text-base">通知タイミング</Label>
            <Select
              value={settings.daysBeforePayment.toString()}
              onValueChange={(value) => setSettings({ ...settings, daysBeforePayment: Number(value) })}
            >
              <SelectTrigger className="mt-2 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1日前</SelectItem>
                <SelectItem value="3">3日前</SelectItem>
                <SelectItem value="7">1週間前</SelectItem>
                <SelectItem value="14">2週間前</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} className="w-full text-sm">
            設定を保存
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">通知テスト</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">通知が正常に動作するかテストできます</p>
          <Button
            variant="outline"
            onClick={() => {
              if (settings.browser && "Notification" in window) {
                new Notification("サブ助", {
                  body: "Netflixの支払いが3日後に予定されています",
                  icon: "/favicon.ico",
                })
              } else {
                alert("テスト通知: Netflixの支払いが3日後に予定されています")
              }
            }}
            className="text-sm"
          >
            テスト通知を送信
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
