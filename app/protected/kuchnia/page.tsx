import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function KuchniaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">🥘 Przepisy Kulinarne Złodzieja</h1>
        <p className="mt-2 text-muted-foreground italic">
          Sekretne dania naszych ekspertów kulinarnych.
        </p>
      </header>

      <div className="grid gap-6">
            <div className="bg-background rounded-xl border p-6 shadow">
            <h2 className="text-xl font-semibold mb-1">🍄 Zupa grzybowa z głębi lasu</h2>
            <p className="text-sm text-muted-foreground mb-4 italic">
                Dla cierpliwego złodzieja, który zna smak wilgoci i czasu.
            </p>
            <ul className="list-disc pl-5 mb-3">
                <li>Kozaki — zebrane o świcie</li>
                <li>Namiot</li>
                <li>3 dni spokoju</li>
                <li>Zupka instant serowa</li>
            </ul>
            <p className="text-sm">
                Zbierz kozaki. Przygotuj je. Rozłóż na namiocie i susz przez 3 dni. 
                Pozwól, by rosa każdej nocy delikatnie je zwilżyła. Trzeciego dnia wrzuć wszystko do zupki serowej. Jedz w milczeniu.
            </p>
            </div>



            <div className="bg-background rounded-xl border p-6 shadow">
            <h2 className="text-xl font-semibold mb-1">🍺 Piwo</h2>
            <p className="text-sm text-muted-foreground mb-4 italic">Nie każde zadanie musi być trudne.</p>
            <ul className="list-disc pl-5 mb-3">
                <li>1 butelka piwa</li>
                <li>1 kufel</li>
            </ul>
            <p className="text-sm">
                Kup piwo. Przelej do kufla. Wypij powoli, delektując się smakiem.
            </p>
            </div>


            <div className="bg-background rounded-xl border p-6 shadow">
            <h2 className="text-xl font-semibold mb-1">🥙 Kebab na gorąco</h2>
            <p className="text-sm text-muted-foreground mb-4 italic">Dla złodzieja w biegu — szybki, tłusty klasyk.</p>
            <ul className="list-disc pl-5 mb-3">
                <li>Nie twoje pieniądze</li>
                <li>1 lokal z kebabem</li>
            </ul>
            <p className="text-sm">
                Skradnij sakiewkę. Idź do najbliższego kebsa. Zamów z ostrym sosem. Nie oglądaj się za siebie.
            </p>
            </div>


      </div>
    </div>
  )
}
