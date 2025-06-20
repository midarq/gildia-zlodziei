import AuthButton from '@/components/AuthButton'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { fetchDailyBibleVerse } from '@/lib/verse'
import { getWeeklyMotto } from '@/lib/motto'
import Calendar from '@/components/Calendar'


export default async function ProtectedPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')

  }

  const verse = await fetchDailyBibleVerse()
  const motto = await getWeeklyMotto()

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
      <div className="py-6 font-bold bg-purple-950 text-center text-white text-xl">
        Melina Gildii Złodziei
      </div>
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
            <AuthButton />
          </div>
        </nav>
      </div>

      <div className="animate-in flex-1 flex flex-col gap-10 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6">
          <section className="bg-foreground/5 p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">✝️ Twój cytat biblijny</h2>
            <p className="italic">{verse}</p>
          </section>

          <section className="bg-foreground/5 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">🏴‍☠️ Motto gildii tygodnia</h2>
          <p className="italic">{motto}</p>
          </section>

            <section className="bg-foreground/5 p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-2">🗓️ Kalendarz wydarzeń</h2>
            <Calendar userId={user.id} />
            </section>
        </main>
      </div>


    <footer className="w-full border-t border-t-foreground/10 p-4 text-center text-xs text-muted-foreground">
      &copy; {new Date().getFullYear()} Gildia Złodziei — Wszystkie prawa zastrzeżone
    </footer>

    </div>
  )
}
