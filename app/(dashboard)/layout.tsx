import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LogOut, Settings } from 'lucide-react'

async function LogoutButton() {
  async function handleLogout() {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <form action={handleLogout}>
      <Button type="submit" variant="ghost" size="sm">
        <LogOut className="h-4 w-4 mr-2" />
        ログアウト
      </Button>
    </form>
  )
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/logo.svg"
                alt="Trenpick Logo"
                width={48}
                height={48}
                className="h-12 w-12"
              />
              <h1 className="text-2xl font-bold" style={{ color: "#ff751f" }}>
                Trenpick
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">バズ通知ツール</p>
          </div>
          <nav className="px-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Image
                src="/logo.svg"
                alt="Trend"
                width={40}
                height={40}
                className="h-10 w-10 mr-3"
              />
              トレンド一覧
            </Link>
            <Link
              href="/settings"
              className="flex items-center px-4 py-2 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="h-5 w-5 mr-3" />
              設定
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">ダッシュボード</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{user.email}</span>
                <LogoutButton />
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

