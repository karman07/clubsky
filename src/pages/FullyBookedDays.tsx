import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useBookings } from '@/contexts/BookingContext'
import { Calendar, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && courtId && !loading) {
      fetchDays()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="container max-w-4xl mx-auto pt-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fully Booked Days</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Enter a court ID to view all dates that are completely booked
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Search Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="court-id" className="block text-sm font-medium text-blue-100 mb-2">
                  Court ID
                </label>
                <Input
                  id="court-id"
                  placeholder="e.g. COURT-001"
                  value={courtId}
                  onChange={e => setCourtId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:bg-white/20 focus:border-white/40"
                />
              </div>
              <Button
                onClick={fetchDays}
                disabled={!courtId || loading}
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-2 h-10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search Days'
                )}
              </Button>
            </div>
          </div>

          {/* Results Section */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Results Header */}
            {(days.length > 0 || (!loading && days.length === 0 && courtId)) && (
              <div className="mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Results for Court {courtId}
                  </h2>
                  {days.length > 0 && (
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {days.length} {days.length === 1 ? 'day' : 'days'} found
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Results List */}
            {days.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {days.map((day, i) => (
                  <div
                    key={i}
                    className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="font-medium text-gray-900">{day}</span>
                  </div>
                ))}
              </div>
            ) : !loading && courtId ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Great News!</h3>
                <p className="text-gray-600 max-w-sm mx-auto">
                  No fully booked days found for this court. All dates have availability.
                </p>
              </div>
            ) : !loading && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p>Enter a court ID above to search for fully booked days</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
                <p className="text-gray-600">Searching for fully booked days...</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Showing dates where all time slots are completely booked</p>
        </div>
      </div>
    </div>
  )
}