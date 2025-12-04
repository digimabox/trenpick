export async function sendDiscordNotification(
  webhookUrl: string,
  trends: Array<{
    name: string
    url: string
    category: string
    growth_rate: number
    views_today: number
  }>
) {
  const embeds = trends.map((trend) => ({
    title: trend.name,
    description: `カテゴリ: ${trend.category}\n成長率: ${(Number(trend.growth_rate) * 100).toFixed(0)}%\n今日のビュー: ${trend.views_today.toLocaleString()}`,
    url: trend.url,
    color: 0x00aff0, // TikTok blue
    footer: {
      text: 'Trenpick',
    },
    timestamp: new Date().toISOString(),
  }))

  const payload = {
    content: `🚀 **${trends.length}件のトレンド商品が検出されました！**`,
    embeds,
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Discord webhook failed: ${response.status} ${text}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending Discord notification:', error)
    throw error
  }
}

export async function sendEmailNotification(
  emailAddress: string,
  trends: Array<{
    name: string
    url: string
    category: string
    growth_rate: number
    views_today: number
  }>
) {
  // MVPではconsole.logで実装
  console.log('📧 Email notification would be sent to:', emailAddress)
  console.log('📦 Trends:', trends)
  
  // 将来的な実装用のインターフェース
  // ここでメール送信サービス（SendGrid, Resend等）を呼び出す
  
  return { success: true }
}

