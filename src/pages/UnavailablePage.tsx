import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Search, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useBookings } from '@/contexts/BookingContext'

export default function UnavailablePage() {
  const { getUnavailableSlots } = useBookings()
  const [courtId, setCourtId] = useState('')
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<number[][]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  async function fetchSlots() {
    setLoading(true)
    setError(null)
    setHasSearched(true)
    
    try {
      const s = await getUnavailableSlots(courtId, date)
      setSlots(s)
    } catch (e: any) {
      setError(e?.message || 'Failed to fetch unavailable slots')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && courtId && date && !loading) {
      fetchSlots()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Unavailable Slots</h1>
          <p className="text-lg text-gray-600">Check which time slots are currently unavailable for booking</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Search Section */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-8 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Search className="w-5 h-5 mr-2 text-blue-600" />
              Search Parameters
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Court ID
                </label>
                <Input
                  placeholder="Enter court identifier"
                  value={courtId}
                  onChange={e => setCourtId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  Date
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium text-gray-700 opacity-0">Action</label>
                <Button
                  onClick={fetchSlots}
                  disabled={!courtId || !date || loading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Get Unavailable Slots
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="p-8">
            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Success State with Slots */}
            {!loading && !error && hasSearched && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    {slots.length > 0 ? (
                      <>
                        <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
                        Unavailable Time Slots
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                        All Slots Available
                      </>
                    )}
                  </h3>
                  <Badge className="text-sm">
                    {slots.length} slot{slots.length !== 1 ? 's' : ''} unavailable
                  </Badge>
                </div>

                {slots.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <Clock className="w-4 h-4 text-red-500" />
                          <Badge className="text-xs">
                            Unavailable
                          </Badge>
                        </div>
                        <p className="text-lg font-semibold text-gray-800 mt-2">
                          {slot[0]}:00 – {slot[1]}:00
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Great news!</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      All time slots are currently available for booking on this date for Court {courtId}.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Empty State (before search) */}
            {!hasSearched && !loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Search</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Enter a court ID and select a date to view unavailable time slots.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">How it works</h4>
              <p className="text-sm text-blue-700">
                This tool shows you which time slots are currently unavailable for booking. 
                Unavailable slots may be due to existing bookings, maintenance, or other restrictions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}