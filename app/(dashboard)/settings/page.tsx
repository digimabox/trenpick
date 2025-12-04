import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { saveAlertSettings } from '@/lib/actions'
import { AlertSettingsForm } from '@/components/alert-settings-form'

async function getAlertSettings() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from('alert_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" error
    console.error('Error fetching alert settings:', error)
  }

  return data || null
}

export default async function SettingsPage() {
  const settings = await getAlertSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">設定</h1>
        <p className="text-gray-600 mt-1">
          通知の受信方法を設定してください
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>通知設定</CardTitle>
          <CardDescription>
            Discord Webhookまたはメールでトレンド商品の通知を受け取れます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertSettingsForm initialSettings={settings} />
        </CardContent>
      </Card>
    </div>
  )
}

