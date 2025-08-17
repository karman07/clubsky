import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import Login from '@/pages/Login'
import Bookings from '@/pages/Bookings'
import CreateBooking from '@/pages/CreateBooking'
import UnavailablePage from '@/pages/UnavailablePage'
import FullyBookedDays from '@/pages/FullyBookedDays'
import { buttonVariants } from '@/components/ui/button'
import PaymentHistory from './pages/PaymentHistory'
import CourtsAdminPage from './pages/CourtPage'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/bookings" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookings" element={
            <ProtectedRoute><Bookings /></ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute><CreateBooking /></ProtectedRoute>
          } />
          <Route path="/unavailable" element={
            <ProtectedRoute><UnavailablePage /></ProtectedRoute>
          } />
          <Route path="/fully-booked" element={
            <ProtectedRoute><FullyBookedDays /></ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute><PaymentHistory /></ProtectedRoute>
          } />
          <Route path='/courts' element={<ProtectedRoute><CourtsAdminPage/></ProtectedRoute>}/>
          <Route path="*" element={
            <main className="container py-16 space-y-6">
              <h1 className="text-3xl font-bold">404 — Not Found</h1>
              <a href="/bookings" className={buttonVariants({})}>Go Home</a>
            </main>
          } />
        </Routes>
      </div>
    </div>
  )
}