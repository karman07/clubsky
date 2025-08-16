import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBookings } from '@/contexts/BookingContext'

type Slot = [number, number]

export default function CreateBooking() {
  const { createBooking } = useBookings()
  const [courtId, setCourtId] = useState('')
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [date, setDate] = useState('')
  const [paidAmount, setPaidAmount] = useState<number | ''>('')
  const [slots, setSlots] = useState<Slot[]>([[10,12]])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  function updateSlot(i: number, which: 0|1, value: number) {
    setSlots(prev => prev.map((s, idx) => idx === i ? (which === 0 ? [value, s[1]] : [s[0], value]) as Slot : s))
  }
  function addSlot() { setSlots(prev => [...prev, [14,16]]) }
  function removeSlot(i: number) { setSlots(prev => prev.filter((_, idx) => idx !== i)) }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null); setLoading(true)
    try {
      if (!courtId || !name || !phoneNumber || !date || paidAmount === '') throw new Error('Fill all fields')
      const payload = { courtId, name, phoneNumber, timeSlots: slots, date, paidAmount: Number(paidAmount) }
      const created = await createBooking(payload)
      setMsg(`Created booking for ${created.name} on ${created.date}`)
    } catch (e: any) {
      setMsg(e?.message || 'Failed to create')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-2xl pt-8">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold">Create Booking</h1>
        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="court">Court ID</Label>
              <Input id="court" placeholder="e.g. 66a1c1..." value={courtId} onChange={e=>setCourtId(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={e=>setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="paid">Paid Amount</Label>
              <Input id="paid" type="number" value={paidAmount} onChange={e=>setPaidAmount(e.target.value ? Number(e.target.value) : '')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Time Slots</Label>
            <div className="space-y-3">
              {slots.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Input type="number" value={s[0]} onChange={e=>updateSlot(i, 0, Number(e.target.value))} placeholder="Start hour (24h)" />
                  <span>to</span>
                  <Input type="number" value={s[1]} onChange={e=>updateSlot(i, 1, Number(e.target.value))} placeholder="End hour (24h)" />
                  <Button type="button" variant="outline" onClick={() => removeSlot(i)}>Remove</Button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addSlot}>Add slot</Button>
            </div>
          </div>

          <Button disabled={loading}>{loading ? 'Creating…' : 'Create Booking'}</Button>
          {msg && <p className="text-sm text-gray-700">{msg}</p>}
        </form>
      </div>
    </div>
  )
}
