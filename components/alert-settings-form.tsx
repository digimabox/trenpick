'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { saveAlertSettings } from '@/lib/actions'
import type { AlertSetting } from '@/types/database'

interface AlertSettingsFormProps {
  initialSettings: AlertSetting | null
}

export function AlertSettingsForm({ initialSettings }: AlertSettingsFormProps) {
  const [notificationChannel, setNotificationChannel] = useState<
    'discord' | 'email'
  >(initialSettings?.notification_channel || 'discord')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await saveAlertSettings(formData)
      setMessage(result)
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="notification_channel">通知チャネル</Label>
        <Select
          id="notification_channel"
          name="notification_channel"
          value={notificationChannel}
          onChange={(e) =>
            setNotificationChannel(e.target.value as 'discord' | 'email')
          }
          required
        >
          <option value="discord">Discord Webhook</option>
          <option value="email">メール</option>
        </Select>
      </div>

      {notificationChannel === 'discord' && (
        <div className="space-y-2">
          <Label htmlFor="discord_webhook_url">Discord Webhook URL</Label>
          <Input
            id="discord_webhook_url"
            name="discord_webhook_url"
            type="url"
            placeholder="https://discord.com/api/webhooks/..."
            defaultValue={initialSettings?.discord_webhook_url || ''}
            required={notificationChannel === 'discord'}
          />
          <p className="text-sm text-gray-500">
            DiscordサーバーでWebhookを作成し、URLを入力してください
          </p>
        </div>
      )}

      {notificationChannel === 'email' && (
        <div className="space-y-2">
          <Label htmlFor="email_address">メールアドレス</Label>
          <Input
            id="email_address"
            name="email_address"
            type="email"
            placeholder="you@example.com"
            defaultValue={initialSettings?.email_address || ''}
            required={notificationChannel === 'email'}
          />
          <p className="text-sm text-gray-500">
            通知を受け取るメールアドレスを入力してください
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="category">カテゴリフィルター（オプション）</Label>
        <Input
          id="category"
          name="category"
          type="text"
          placeholder="例: ガジェット, 美容"
          defaultValue={initialSettings?.category || ''}
        />
        <p className="text-sm text-gray-500">
          特定のカテゴリのみ通知を受け取る場合は、カテゴリ名を入力してください（カンマ区切り）
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.success
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.message}
        </div>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? '保存中...' : '設定を保存'}
      </Button>
    </form>
  )
}

