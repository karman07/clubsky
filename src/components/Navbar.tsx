import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const { user} = useAuth()
  return (
    <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-lg font-bold">Court Booking</Link>
        <nav className="flex items-center gap-4 text-sm">
          {user && (
            <>
              <NavLink to="/bookings" className={({isActive}) => isActive ? "font-semibold" : ""}>Bookings</NavLink>
              <NavLink to="/create" className={({isActive}) => isActive ? "font-semibold" : ""}>Create</NavLink>
              <NavLink to="/unavailable" className={({isActive}) => isActive ? "font-semibold" : ""}>Unavailable</NavLink>
              <NavLink to="/fully-booked" className={({isActive}) => isActive ? "font-semibold" : ""}>Fully‑Booked</NavLink>
              <NavLink to="/payments" className={({isActive}) => isActive ? "font-semibold" : ""}>Payments</NavLink>
              <NavLink to="/courts" className={({isActive}) => isActive ? "font-semibold" : ""}>Courts</NavLink>
            </>
          )}
        </nav>
        <div>
          {user ? (
          <></>
          ) : (
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
