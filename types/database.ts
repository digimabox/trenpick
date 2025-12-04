export type Profile = {
  id: string
  email: string
  plan: 'free' | 'pro' | 'enterprise'
  created_at: string
}

export type AlertSetting = {
  id: string
  user_id: string
  notification_channel: 'discord' | 'email'
  discord_webhook_url: string | null
  email_address: string | null
  category: string | null
  created_at: string
}

export type Trend = {
  id: string
  name: string
  url: string
  category: string
  views_today: number
  views_yesterday: number
  growth_rate: number
  created_at: string
  trend_date: string
}

