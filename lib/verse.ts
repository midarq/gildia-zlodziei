import { createClient } from '@/utils/supabase/server'

export async function fetchDailyBibleVerse(): Promise<string> {
  const supabase = await createClient(); // ✅ await here!
  const today = new Date().toISOString().slice(0, 10); // e.g. 2025-06-20

  // 1. Check if verse already stored
  const { data: stored } = await supabase
    .from('daily_content')
    .select('content')
    .eq('date', today)
    .eq('type', 'verse')
    .single();

  if (stored?.content) return stored.content;

  // 2. Generate and store
  const res = await fetch("https://labs.bible.org/api/?passage=random&type=json", {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error("Błąd pobierania wersetu.");

  const verseData = await res.json();
  const verse = `“${verseData[0].text}” (${verseData[0].bookname} ${verseData[0].chapter},${verseData[0].verse})`;

  await supabase.from('daily_content').insert({
    date: today,
    type: 'verse',
    content: verse,
  });

  return verse;
}
