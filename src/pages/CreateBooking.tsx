import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBookings } from '@/contexts/BookingContext'
import { Calendar, Clock, User, Phone, DollarSign, MapPin, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react'

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
  const [msgType, setMsgType] = useState<'success' | 'error'>('success')

  function updateSlot(i: number, which: 0|1, value: number) {
    setSlots(prev => prev.map((s, idx) => idx === i ? (which === 0 ? [value, s[1]] : [s[0], value]) as Slot : s))
  }
  
  function addSlot() { 
    setSlots(prev => [...prev, [14,16]]) 
  }
  
  function removeSlot(i: number) { 
    setSlots(prev => prev.filter((_, idx) => idx !== i)) 
  }

  function formatTime(hour: number) {
    return hour === 0 ? '12:00 AM' : 
           hour === 12 ? '12:00 PM' :
           hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    setLoading(true)
    
    try {
      if (!courtId || !name || !phoneNumber || !date || paidAmount === '') {
        throw new Error('Please fill in all required fields')
      }
      
      const payload = { 
        courtId, 
        name, 
        phoneNumber, 
        timeSlots: slots, 
        date, 
        paidAmount: Number(paidAmount) 
      }
      
      const created = await createBooking(payload)
      setMsg(`✓ Booking successfully created for ${created.name} on ${created.date}`)
      setMsgType('success')
      
      // Reset form
      setCourtId('')
      setName('')
      setPhoneNumber('')
      setDate('')
      setPaidAmount('')
      setSlots([[10,12]])
      
    } catch (e: any) {
      setMsg(e?.message || 'Failed to create booking. Please try again.')
      setMsgType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Booking</h1>
          <p className="text-gray-600">Schedule court reservation with ease</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white">Booking Details</h2>
            <p className="text-blue-100 mt-1">Fill in the information below to create reservation</p>
          </div>

          <div className="p-8 space-y-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <User className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="Enter full name"
                    value={name} 
                    onChange={e=>setName(e.target.value)}
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input 
                    id="phone" 
                    placeholder="Enter phone number"
                    value={phoneNumber} 
                    onChange={e=>setPhoneNumber(e.target.value)}
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Court & Schedule */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Court & Schedule</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="court" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4" />
                    Court ID
                  </Label>
                  <Input 
                    id="court" 
                    placeholder="e.g. 66a1c1..."
                    value={courtId} 
                    onChange={e=>setCourtId(e.target.value)}
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4" />
                    Booking Date
                  </Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={date} 
                    onChange={e=>setDate(e.target.value)}
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Time Slots</h3>
              </div>
              
              <div className="space-y-4">
                {slots.map((s, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex-1 min-w-32">
                        <Label className="text-xs font-medium text-gray-600 mb-2 block">Start Time</Label>
                        <Input 
                          type="number" 
                          value={s[0]} 
                          onChange={e=>updateSlot(i, 0, Number(e.target.value))} 
                          placeholder="Start hour"
                          min="0"
                          max="23"
                          className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">{formatTime(s[0])}</p>
                      </div>
                      
                      <div className="flex items-center justify-center px-2">
                        <span className="text-gray-400 font-medium">to</span>
                      </div>
                      
                      <div className="flex-1 min-w-32">
                        <Label className="text-xs font-medium text-gray-600 mb-2 block">End Time</Label>
                        <Input 
                          type="number" 
                          value={s[1]} 
                          onChange={e=>updateSlot(i, 1, Number(e.target.value))} 
                          placeholder="End hour"
                          min="0"
                          max="23"
                          className="h-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">{formatTime(s[1])}</p>
                      </div>
                      
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeSlot(i)}
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                        disabled={slots.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addSlot}
                  className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-600 h-12"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Time Slot
                </Button>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Payment</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paid" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <DollarSign className="w-4 h-4" />
                  Paid Amount
                </Label>
                <Input 
                  id="paid" 
                  type="number" 
                  placeholder="Enter amount paid"
                  value={paidAmount} 
                  onChange={e=>setPaidAmount(e.target.value ? Number(e.target.value) : '')}
                  className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Message Display */}
            {msg && (
              <div className={`rounded-lg p-4 border ${
                msgType === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2">
                  {msgType === 'success' ? 
                    <CheckCircle className="w-5 h-5 text-green-600" /> : 
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  }
                  <p className="font-medium">{msg}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                onClick={onSubmit}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Creating Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Create Booking
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}