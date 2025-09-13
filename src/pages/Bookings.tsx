import { useMemo, useState } from 'react'
import { useBookings } from '@/contexts/BookingContext'
import type { Booking } from '@/contexts/BookingContext'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { RefreshCcw, Search, Filter, Calendar, MapPin, Phone, User, Clock, CreditCard, X } from 'lucide-react'

export default function Bookings(): JSX.Element {
  const { bookings, loading, error, refresh } = useBookings()
  const [query, setQuery] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [courtId, setCourtId] = useState<string>('all')
  const [minPaid, setMinPaid] = useState<string>('')
  const [maxPaid, setMaxPaid] = useState<string>('')

  const [page, setPage] = useState<number>(1)
  const pageSize: number = 10

  const courtOptions = useMemo((): [string, string][] => {
    const uniqueCourts = new Map<string, string>()
    bookings.forEach((b: Booking) => {
      if (typeof b.courtId === 'object' && b.courtId._id) {
        uniqueCourts.set(b.courtId._id, b.courtId.name)
      } else if (typeof b.courtId === 'string') {
        uniqueCourts.set(b.courtId, b.courtId)
      }
    })
    return Array.from(uniqueCourts.entries())
  }, [bookings])

  const filtered = useMemo((): Booking[] => {
    return bookings.filter((b: Booking) => {
      if (query && !(`${b.name} ${b.phoneNumber}`.toLowerCase().includes(query.toLowerCase()))) return false
      if (date && b.date !== date) return false

      const currentCourtId: string = typeof b.courtId === 'object' ? b.courtId._id : b.courtId
      if (courtId !== 'all' && currentCourtId !== courtId) return false

      const min: number = minPaid ? Number(minPaid) : -Infinity
      const max: number = maxPaid ? Number(maxPaid) : Infinity
      if (b.paidAmount < min || b.paidAmount > max) return false
      return true
    })
  }, [bookings, query, date, courtId, minPaid, maxPaid])

  const total: number = filtered.length
  const start: number = (page - 1) * pageSize
  const pageItems: Booking[] = filtered.slice(start, start + pageSize)

  function resetFilters(): void {
    setQuery(''); setDate(''); setCourtId('all'); setMinPaid(''); setMaxPaid(''); setPage(1)
  }

  const hasActiveFilters: boolean = !!(query || date || courtId !== 'all' || minPaid || maxPaid)

  // Fix: handle single-element arrays as 1-hour slots
  const formatTimeSlot = (slot: number[] | number): string => {
    let start: number
    let end: number

    if (Array.isArray(slot)) {
      if (slot.length === 2) {
        [start, end] = slot
      } else if (slot.length === 1) {
        start = slot[0]
        end = slot[0] + 1
      } else {
        return 'Invalid slot'
      }
    } else if (typeof slot === 'number') {
      start = slot
      end = slot + 1
    } else {
      return 'Invalid slot'
    }

    const formatHour = (hour: number): string => {
      if (hour === 0) return '12:00 AM'
      if (hour < 12) return `${hour}:00 AM`
      if (hour === 12) return '12:00 PM'
      return `${hour - 12}:00 PM`
    }

    return `${formatHour(start)} - ${formatHour(end)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Bookings Dashboard</h1>
            <p className="text-lg text-slate-600">Manage and track all your court reservations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-500">{total}</div>
              <div className="text-sm text-slate-500">Total Bookings</div>
            </div>
            <Button 
              onClick={() => refresh()} 
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
            {hasActiveFilters && (
              <Badge className="bg-indigo-100 text-blue-500 border-indigo-200">
                {[query, date, courtId !== 'all', minPaid, maxPaid].filter(Boolean).length} active
              </Badge>
            )}
          </div>
          
          <div className="grid gap-4 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Search className="inline h-4 w-4 mr-1" /> Search
              </label>
              <Input 
                value={query} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setQuery(e.target.value); setPage(1) }} 
                placeholder="Search by name or phone..."
                className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" /> Date
              </label>
              <Input 
                type="date" 
                value={date} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setDate(e.target.value); setPage(1) }}
                className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" /> Court
              </label>
              <Select 
                value={courtId} 
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setCourtId(e.target.value); setPage(1) }}
                className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All courts</option>
                {courtOptions.map(([id, name]: [string, string]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Min Amount</label>
              <Input 
                type="number" 
                placeholder="₹0" 
                value={minPaid} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setMinPaid(e.target.value); setPage(1) }}
                className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Amount</label>
              <Input 
                type="number" 
                placeholder="₹10000" 
                value={maxPaid} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setMaxPaid(e.target.value); setPage(1) }}
                className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="text-slate-600 border-slate-300 hover:bg-slate-50"
              >
                <X className="mr-2 h-4 w-4" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    <User className="inline h-4 w-4 mr-2" /> Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    <Calendar className="inline h-4 w-4 mr-2" /> Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    <Clock className="inline h-4 w-4 mr-2" /> Time Slots
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    <CreditCard className="inline h-4 w-4 mr-2" /> Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((booking: Booking, index: number) => (
                  <tr 
                    key={booking._id} 
                    className={`border-t border-slate-100 hover:bg-gradient-to-r hover:from-indigo-25 hover:to-purple-25 transition-colors duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-slate-800">{booking.name}</div>
                        <div className="flex items-center text-sm text-slate-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {booking.phoneNumber}
                        </div>
                      </div>
                    </td>
          
                    <td className="px-6 py-4">
                      <div className="text-slate-700 font-medium">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {booking.timeSlots.map((slot: number[] | number, i: number) => (
                          <Badge 
                            key={i} 
                            className="bg-indigo-50 text-blue-500 border-indigo-200 text-xs font-medium"
                          >
                            {formatTimeSlot(slot)}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-lg font-bold text-green-600">
                        ₹{booking.paidAmount.toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
                
                {!loading && pageItems.length === 0 && (
                  <tr>
                    <td className="px-6 py-12 text-center text-slate-500" colSpan={5}>
                      <div className="space-y-2">
                        <div className="text-4xl">📅</div>
                        <div className="text-lg font-medium">No bookings found</div>
                        <div className="text-sm">Try adjusting your filters or add some bookings</div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {loading && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center text-blue-500">
                <RefreshCcw className="animate-spin h-5 w-5 mr-2" />
                Loading bookings...
              </div>
            </div>
          )}
          
          {error && (
            <div className="px-6 py-4 bg-red-50 border-t border-red-200">
              <div className="text-red-700 text-sm font-medium">
                Error: {error}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > pageSize && (
          <div className="flex justify-center">
            <Pagination 
              page={page} 
              pageSize={pageSize} 
              total={total} 
              onPageChange={(newPage: number) => setPage(newPage)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
