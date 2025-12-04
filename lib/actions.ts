'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function seedTrends() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  // 既存のデータをチェック
  const { data: existing } = await supabase
    .from('trends')
    .select('id')
    .eq('trend_date', today)
    .limit(1)

  if (existing && existing.length > 0) {
    // 既にデータが存在する場合は何もしない
    revalidatePath('/dashboard')
    return
  }

  // ダミーデータを生成
  const dummyTrends = [
    {
      name: '【人気急上昇】スマホスタンド 折りたたみ式',
      url: 'https://www.tiktokshop.com/product/example1',
      category: 'ガジェット',
      views_today: 125000,
      views_yesterday: 45000,
      growth_rate: 2.78,
      trend_date: today,
    },
    {
      name: 'LEDミラーリングライト 3色調光',
      url: 'https://www.tiktokshop.com/product/example2',
      category: '美容',
      views_today: 98000,
      views_yesterday: 32000,
      growth_rate: 3.06,
      trend_date: today,
    },
    {
      name: 'シリコン製 キッチン収納セット',
      url: 'https://www.tiktokshop.com/product/example3',
      category: '生活用品',
      views_today: 87000,
      views_yesterday: 28000,
      growth_rate: 3.11,
      trend_date: today,
    },
    {
      name: 'ワイヤレスイヤホン ノイズキャンセリング',
      url: 'https://www.tiktokshop.com/product/example4',
      category: 'オーディオ',
      views_today: 156000,
      views_yesterday: 62000,
      growth_rate: 2.52,
      trend_date: today,
    },
    {
      name: '折りたたみ式 洗濯物干し',
      url: 'https://www.tiktokshop.com/product/example5',
      category: '生活用品',
      views_today: 73000,
      views_yesterday: 25000,
      growth_rate: 2.92,
      trend_date: today,
    },
    {
      name: 'フェイスマスク 5枚セット',
      url: 'https://www.tiktokshop.com/product/example6',
      category: '美容',
      views_today: 112000,
      views_yesterday: 41000,
      growth_rate: 2.73,
      trend_date: today,
    },
    {
      name: 'USB充電式 ハンドウォーマー',
      url: 'https://www.tiktokshop.com/product/example7',
      category: 'ガジェット',
      views_today: 94000,
      views_yesterday: 35000,
      growth_rate: 2.69,
      trend_date: today,
    },
    {
      name: 'シリコン製 調理器具セット',
      url: 'https://www.tiktokshop.com/product/example8',
      category: 'キッチン',
      views_today: 68000,
      views_yesterday: 22000,
      growth_rate: 3.09,
      trend_date: today,
    },
  ]

  const { error } = await supabase.from('trends').insert(dummyTrends)

  if (error) {
    console.error('Error seeding trends:', error)
  }

  revalidatePath('/dashboard')
}

export async function saveAlertSettings(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, message: 'ログインが必要です' }
  }

  const notificationChannel = formData.get('notification_channel') as string
  const discordWebhookUrl = formData.get('discord_webhook_url') as string
  const emailAddress = formData.get('email_address') as string
  const category = formData.get('category') as string

  const { error } = await supabase
    .from('alert_settings')
    .upsert(
      {
        user_id: user.id,
        notification_channel: notificationChannel,
        discord_webhook_url:
          notificationChannel === 'discord' ? discordWebhookUrl : null,
        email_address: notificationChannel === 'email' ? emailAddress : null,
        category: category || null,
      },
      {
        onConflict: 'user_id,notification_channel',
      }
    )

  if (error) {
    console.error('Error saving alert settings:', error)
    return { success: false, message: '設定の保存に失敗しました' }
  }

  revalidatePath('/settings')
  return { success: true, message: '設定を保存しました' }
}

