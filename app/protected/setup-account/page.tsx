'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function SetupAccountPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  

  useEffect(() => {
    const hash = window.location.hash
    const accessToken = new URLSearchParams(hash.substring(1)).get('access_token')
    const refreshToken = new URLSearchParams(hash.substring(1)).get('refresh_token')

    if (accessToken && refreshToken) {
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(() => {
          return supabase.auth.getUser()
        })
        .then(({ data: { user } }) => {
          if (user) setUser(user)
          setLoading(false)
        })
    } else {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) setUser(user)
        setLoading(false)
      })
    }
  }, [])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget as HTMLFormElement)
    const username = form.get('username') as string
    const password = form.get('password') as string

    const { error: pwError } = await supabase.auth.updateUser({ password })
    const { error: dbError } = await supabase
      .from('profiles')
      .insert({ id: user.id, username })

    if (!pwError && !dbError) {
      router.push('/protected')
    } else {
      alert(pwError?.message || dbError?.message)
    }
  }

  if (loading) return <p className="p-4">Trwa logowanie...</p>
  if (!user) return <p className="p-4">Brak dostępu — spróbuj ponownie z linku zaproszeniowego</p>

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-2xl font-bold mb-4">Stwórz swoje konto w Gildii</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          name="username"
          placeholder="Twoje imię złodziejskie"
          className="p-2 border border-foreground/20 rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Ustaw hasło"
          className="p-2 border border-foreground/20 rounded"
          required
        />
        <button
          type="submit"
          className="bg-purple-900 text-white py-2 rounded hover:bg-purple-800"
        >
          Zapisz
        </button>
      </form>
    </div>
  )
}
