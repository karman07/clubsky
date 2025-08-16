import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useBookings } from '@/contexts/BookingContext'

export default function UnavailablePage() {
  const { getUnavailableSlots } = useBookings()
  const [courtId, setCourtId] = useState('')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<number[][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchSlots() {
    setLoading(true); setError(null)
    try {
      const s = await getUnavailableSlots(courtId, date)
      setSlots(s)
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl pt-8">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold">Unavailable Slots</h1>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Court ID" value={courtId} onChange={e=>setCourtId(e.target.value)} />
          <Input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          <Button onClick={fetchSlots} disabled={!courtId || !date || loading}>{loading ? 'Loading…' : 'Get'}</Button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          {slots.map((s, i) => <Badge key={i}>{s[0]}:00–{s[1]}:00</Badge>)}
          {(!loading && slots.length === 0) && <p className="text-sm text-gray-500">No slots.</p>}
        </div>
      </div>
    </div>
  )
}
