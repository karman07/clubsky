import { useMemo, useState } from 'react'
import { useBookings } from '@/contexts/BookingContext'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { RefreshCcw } from 'lucide-react'

export default function Bookings() {
  const { bookings, loading, error, refresh } = useBookings()
  const [query, setQuery] = useState('')
  const [date, setDate] = useState('')
  const [courtId, setCourtId] = useState('all')
  const [minPaid, setMinPaid] = useState<string>('')
  const [maxPaid, setMaxPaid] = useState<string>('')

  const [page, setPage] = useState(1)
  const pageSize = 10

  const courtOptions = useMemo(() => {
    const uniqueCourts = new Map()
    bookings.forEach(b => {
      // Handle both populated and non-populated courtId
      if (typeof b.courtId === 'object' && b.courtId._id) {
        uniqueCourts.set(b.courtId._id, b.courtId.name)
      } else if (typeof b.courtId === 'string') {
        uniqueCourts.set(b.courtId, b.courtId)
      }
    })
    return Array.from(uniqueCourts.entries())
  }, [bookings])

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      if (query && !(`${b.name} ${b.phoneNumber}`.toLowerCase().includes(query.toLowerCase()))) return false
      if (date && b.date !== date) return false
      
      // Handle both populated and non-populated courtId for filtering
      const currentCourtId = typeof b.courtId === 'object' ? b.courtId._id : b.courtId
      if (courtId !== 'all' && currentCourtId !== courtId) return false
      
      const min = minPaid ? Number(minPaid) : -Infinity
      const max = maxPaid ? Number(maxPaid) : Infinity
      if (b.paidAmount < min || b.paidAmount > max) return false
      return true
    })
  }, [bookings, query, date, courtId, minPaid, maxPaid])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const pageItems = filtered.slice(start, start + pageSize)

  function resetFilters() {
    setQuery(''); setDate(''); setCourtId('all'); setMinPaid(''); setMaxPaid(''); setPage(1)
  }


  return (
    <div className="container pt-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bookings</h1>
          <p className="text-sm text-gray-500">Search, filter and paginate your bookings.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refresh()} disabled={loading}>
            <RefreshCcw className="mr-2 h-4 w-4" /> {loading ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 rounded-lg border bg-white p-4 shadow-sm md:grid-cols-6">
        <div className="md:col-span-2">
          <Input value={query} onChange={e=>{ setQuery(e.target.value); setPage(1) }} placeholder="Search by name or phone…" />
        </div>
        <div>
          <Input type="date" value={date} onChange={e=>{ setDate(e.target.value); setPage(1) }} />
        </div>
        <div>
          <Select value={courtId} onChange={e=>{ setCourtId(e.target.value); setPage(1) }}>
            <option value="all">All courts</option>
            {courtOptions.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </Select>
        </div>
        <div>
          <Input type="number" placeholder="Min paid" value={minPaid} onChange={e=>{ setMinPaid(e.target.value); setPage(1) }} />
        </div>
        <div>
          <Input type="number" placeholder="Max paid" value={maxPaid} onChange={e=>{ setMaxPaid(e.target.value); setPage(1) }} />
        </div>
        <div className="md:col-span-6 flex items-center gap-2">
          <Button variant="outline" onClick={resetFilters}>Reset</Button>
          {/* <Button variant="ghost" onClick={searchPhoneQuick}>Quick phone lookup</Button> */}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 text-left text-sm text-gray-600">
            <tr>
              <th className="p-3 w-48">Name</th>
              <th className="p-3 w-40">Phone</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time Slots</th>
              <th className="p-3 w-32">Paid</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map(b => {
  
              
              return (
                <tr key={b._id} className="border-t">
                  <td className="p-3 font-medium">{b.name}</td>
                  <td className="p-3">{b.phoneNumber}</td>
                  {/* <td className="p-3">
                    <Badge title={courtDisplayId}>{courtName}</Badge>
                  </td> */}
                  <td className="p-3">{b.date}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {b.timeSlots.map((s, i) => (
                        <Badge key={i} className="bg-black/5 border-black/10">
                          {s[0]}:00–{s[1]}:00
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 font-semibold">₹{b.paidAmount}</td>
                </tr>
              )
            })}
            {(!loading && pageItems.length === 0) && (
              <tr><td className="p-6 text-center text-gray-500" colSpan={6}>No results.</td></tr>
            )}
          </tbody>
        </table>
        {loading && <div className="p-6 text-center text-gray-500">Loading…</div>}
        {error && <div className="p-4 text-sm text-red-600">{error}</div>}
      </div>

      <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
    </div>
  )
}