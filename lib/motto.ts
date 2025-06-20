import { createClient } from '@/utils/supabase/server'

export async function getWeeklyMotto(): Promise<string> {
  const supabase = await createClient(); // ✅ MUST await this

  const now = new Date();
  const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1))
    .toISOString()
    .slice(0, 10);

  // 1. Check if motto is already stored
  const { data: stored } = await supabase
    .from('daily_content')
    .select('content')
    .eq('date', monday)
    .eq('type', 'motto')
    .single();

  if (stored?.content) return stored.content;

  // 2. Generate and store
  const prompt = `Jesteś mistrzem gildii złodziei w świecie fantasy. Wygeneruj krótkie motto (maks. 15 słów) na tydzień zaczynający się ${monday}. Powinno być tajemnicze, poetyckie, motywujące dla złodziei. Bez cytowania, bez cudzysłowów, bez wprowadzenia.`;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "mistralai/mistral-small-24b-instruct-2501:free",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error("Błąd pobierania motta.");

  const json = await res.json();
  const motto = json.choices?.[0]?.message?.content?.trim();

  if (!motto) throw new Error("Brak treści motta");

  await supabase.from('daily_content').insert({
    date: monday,
    type: 'motto',
    content: motto,
  });

  return motto;
}
