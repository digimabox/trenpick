import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { seedTrends } from '@/lib/actions'

async function getTrends(): Promise<{
  error: 'TABLE_NOT_FOUND' | 'UNKNOWN' | null
  data: Array<any>
}> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('trends')
    .select('*')
    .eq('trend_date', today)
    .order('growth_rate', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching trends:', error)
    // テーブルが存在しない場合のエラー
    if (error.code === 'PGRST205') {
      return { error: 'TABLE_NOT_FOUND', data: [] }
    }
    return { error: 'UNKNOWN', data: [] }
  }

  // 確実に配列を返す
  const trendsArray = Array.isArray(data) ? data : []
  return { error: null, data: trendsArray }
}

export default async function DashboardPage() {
  const result = await getTrends()
  const hasTableError = result.error === 'TABLE_NOT_FOUND'
  // 確実に配列になるようにする
  const trends = Array.isArray(result.data) ? result.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">トレンド一覧</h1>
          <p className="text-gray-600 mt-1">
            今日のTikTok Shopでバズり始めた商品
          </p>
        </div>
        <form action={seedTrends}>
          <Button type="submit" variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            ダミーデータを投入
          </Button>
        </form>
      </div>

      {hasTableError ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                データベースのセットアップが必要です
              </h3>
              <p className="text-yellow-700 mb-4">
                <code>trends</code>テーブルが見つかりません。Supabaseでマイグレーションを実行してください。
              </p>
              <div className="bg-white rounded p-4 text-left text-sm">
                <p className="font-semibold mb-2">手順:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Supabaseダッシュボードにログイン</li>
                  <li>SQL Editorを開く</li>
                  <li>
                    <code>supabase/migrations/0000_init.sql</code>
                    の内容をコピーして実行
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : trends.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              今日のトレンドデータがありません
            </p>
            <form action={seedTrends}>
              <Button type="submit" variant="outline">
                ダミーデータを投入して試す
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trends.map((trend) => (
            <Card key={trend.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">
                    {trend.name}
                  </CardTitle>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                    {trend.category}
                  </span>
                </div>
                <CardDescription>
                  {trend.views_today.toLocaleString()} ビュー（今日）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">成長率</span>
                    <span
                      className={`font-semibold ${
                        trend.growth_rate >= 1.2
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {(Number(trend.growth_rate) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">昨日のビュー</span>
                    <span className="text-gray-800">
                      {trend.views_yesterday.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2">
                    <Link
                      href={trend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm flex items-center"
                    >
                      商品を見る
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

