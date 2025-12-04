import { redirect } from 'next/navigation'

export default function SignupPage() {
  // サインアップもログインと同じマジックリンク方式に統一
  redirect('/login')
}

