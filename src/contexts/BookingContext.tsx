import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BASE_URL } from '@/constants/constants'

// Define the Court type for populated courtId
export type Court = {
  _id: string
  name: string
  description: string
  location: string
  imageUrl: string
  price: number
  activity: string
  features: string[]
  createdAt: string
  updatedAt: string
  __v: number
}

// Updated Booking type to handle both populated and non-populated courtId
export type Booking = {
  _id: string
  courtId: string | Court  // Can be either ID string or full Court object
  name: string
  phoneNumber: string
  timeSlots: number[][]
  date: string
  paidAmount: number
  createdAt?: string
  updatedAt?: string
}

type BookingCtx = {
  bookings: Booking[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  createBooking: (payload: Omit<Booking, '_id'|'createdAt'|'updatedAt'>) => Promise<Booking>
  findByPhoneNumber: (phone: string) => Promise<Booking[]>
  getUnavailableSlots: (courtId: string, date: string) => Promise<number[][]>
  getFullyBookedDays: (courtId: string) => Promise<string[]>
}

const Ctx = createContext<BookingCtx | null>(null)

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }) },
    ...init
  })
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText)
    throw new Error(msg || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const data = await http<Booking[]>('/bookings')
      setBookings(data)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  const createBooking = useCallback(async (payload: Omit<Booking, '_id'|'createdAt'|'updatedAt'>) => {
    // The backend expects body with possibly nested timeSlots -> send JSON; controller handles parsing
    const created = await http<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    // optimistic update
    setBookings(prev => [created, ...prev])
    return created
  }, [])

  const findByPhoneNumber = useCallback(async (phone: string) => {
    return http<Booking[]>(`/bookings/phone/${encodeURIComponent(phone)}`)
  }, [])

  const getUnavailableSlots = useCallback(async (courtId: string, date: string) => {
    return http<number[][]>(`/bookings/unavailable?courtId=${encodeURIComponent(courtId)}&date=${encodeURIComponent(date)}`)
  }, [])

  const getFullyBookedDays = useCallback(async (courtId: string) => {
    return http<string[]>(`/bookings/fully-booked-days/${encodeURIComponent(courtId)}`)
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const value = useMemo(() => ({
    bookings, loading, error,
    refresh, createBooking, findByPhoneNumber, getUnavailableSlots, getFullyBookedDays
  }), [bookings, loading, error, refresh, createBooking, findByPhoneNumber, getUnavailableSlots, getFullyBookedDays])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useBookings() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useBookings must be used within BookingProvider')
  return ctx
}