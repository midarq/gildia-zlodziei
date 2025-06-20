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
      .select('*')
      .eq('user_id', userId)

    setEvents(data || [])
  }

  async function handleDateSelect(selectInfo: any) {
    const title = prompt('Tytuł wydarzenia:')
    const date = selectInfo.startStr

    if (!title) return

    const { error } = await supabase.from('events').insert({
      title,
      date,
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
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      selectable={true}
      events={events}
      select={handleDateSelect}
      eventClick={handleEventClick}
      height="auto"
    />
  )
}
