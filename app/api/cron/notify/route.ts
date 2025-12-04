import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendDiscordNotification, sendEmailNotification } from '@/lib/notifications/discord'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // 1. growth_rate > 1.2 のトレンド商品を取得
    const { data: trendingProducts, error: trendsError } = await supabase
      .from('trends')
      .select('*')
      .eq('trend_date', today)
      .gt('growth_rate', 1.2)
      .order('growth_rate', { ascending: false })

    if (trendsError) {
      console.error('Error fetching trends:', trendsError)
      return NextResponse.json(
        { error: 'Failed to fetch trends' },
        { status: 500 }
      )
    }

    if (!trendingProducts || trendingProducts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No trending products found',
        notified: 0,
      })
    }

    // 2. 通知設定を持つ全ユーザーを取得
    const { data: alertSettings, error: settingsError } = await supabase
      .from('alert_settings')
      .select('*')

    if (settingsError) {
      console.error('Error fetching alert settings:', settingsError)
      return NextResponse.json(
        { error: 'Failed to fetch alert settings' },
        { status: 500 }
      )
    }

    if (!alertSettings || alertSettings.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No alert settings found',
        notified: 0,
      })
    }

    // 3. 各ユーザーに通知を送信
    const results = []
    let successCount = 0
    let errorCount = 0

    for (const setting of alertSettings) {
      try {
        // カテゴリフィルターの適用
        let filteredTrends = trendingProducts
        if (setting.category) {
          const categories = setting.category.split(',').map((c: string) => c.trim())
          filteredTrends = trendingProducts.filter((trend) =>
            categories.includes(trend.category)
          )
        }

        if (filteredTrends.length === 0) {
          continue
        }

        if (setting.notification_channel === 'discord' && setting.discord_webhook_url) {
          await sendDiscordNotification(
            setting.discord_webhook_url,
            filteredTrends.map((t) => ({
              name: t.name,
              url: t.url,
              category: t.category,
              growth_rate: t.growth_rate,
              views_today: t.views_today,
            }))
          )
          successCount++
          results.push({
            user_id: setting.user_id,
            channel: 'discord',
            status: 'success',
            trends_count: filteredTrends.length,
          })
        } else if (
          setting.notification_channel === 'email' &&
          setting.email_address
        ) {
          await sendEmailNotification(
            setting.email_address,
            filteredTrends.map((t) => ({
              name: t.name,
              url: t.url,
              category: t.category,
              growth_rate: t.growth_rate,
              views_today: t.views_today,
            }))
          )
          successCount++
          results.push({
            user_id: setting.user_id,
            channel: 'email',
            status: 'success',
            trends_count: filteredTrends.length,
          })
        }
      } catch (error: any) {
        errorCount++
        console.error(
          `Error sending notification to user ${setting.user_id}:`,
          error
        )
        results.push({
          user_id: setting.user_id,
          channel: setting.notification_channel,
          status: 'error',
          error: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications processed',
      trends_found: trendingProducts.length,
      notified: successCount,
      errors: errorCount,
      results,
    })
  } catch (error: any) {
    console.error('Error in notify route:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

