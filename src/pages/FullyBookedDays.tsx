import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useBookings } from '@/contexts/BookingContext'

export default function FullyBookedDays() {
  const { getFullyBookedDays } = useBookings()
  const [courtId, setCourtId] = useState('')
  const [days, setDays] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchDays() {
    setLoading(true); setError(null)
    try {
      const d = await getFullyBookedDays(courtId)
      setDays(d)
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl pt-8">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-semibold">Fully‑Booked Days</h1>
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Court ID" value={courtId} onChange={e=>setCourtId(e.target.value)} />
          <div />
          <Button onClick={fetchDays} disabled={!courtId || loading}>{loading ? 'Loading…' : 'Get'}</Button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <ul className="mt-4 list-disc pl-5 text-sm">
          {days.map((d, i) => <li key={i}>{d}</li>)}
          {(!loading && days.length === 0) && <p className="text-gray-500">No fully‑booked days.</p>}
        </ul>
      </div>
    </div>
  )
}
