'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function Calendar({ userId }: { userId: string }) {
  const supabase = createClient()
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('id, title, date, end')
      .eq('user_id', userId)

    setEvents(
      (data || []).map(event => ({
        id: event.id,
        title: event.title,
        start: event.date,
        end: event.end ?? undefined,
      }))
    )
  }

  async function handleDateSelect(selectInfo: any) {
    const title = prompt('Tytuł wydarzenia (może obejmować kilka dni):')
    const start = selectInfo.startStr
    const end = selectInfo.endStr // this is exclusive

    if (!title) return

    const { error } = await supabase.from('events').insert({
      title,
      date: start,
      end: end,
      user_id: userId,
    })

    if (!error) fetchEvents()
  }


  async function handleEventClick(clickInfo: any) {
    if (confirm(`Usunąć "${clickInfo.event.title}"?`)) {
      await supabase.from('events').delete().eq('id', clickInfo.event.id)
      fetchEvents()
    }
  }

return (
  <div className="bg-background rounded-xl border p-4 shadow">
  <FullCalendar
    plugins={[dayGridPlugin, interactionPlugin]}
    initialView="dayGridMonth"
    selectable={true}
    selectMirror={true}
    selectAllow={() => true}
    events={events}
    select={handleDateSelect}
    eventClick={handleEventClick}
    height="auto"
    headerToolbar={{
      start: 'prev,next today',
      center: 'title',
      end: ''
    }}
/>

  </div>
)
}
