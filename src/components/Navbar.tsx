import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSidebar}
                className="p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="text-lg font-bold">Club Skyshot Admin</Link>
          </div>
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

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50"
          onClick={closeSidebar}
        />
      )}


      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-50 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link to="/" className="text-lg font-bold" onClick={closeSidebar}>
            Club Skyshot Admin
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closeSidebar}
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {user && (
          <nav className="flex flex-col p-6 space-y-2">
            <NavLink 
              to="/bookings" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100 font-semibold text-blue-600' : 'text-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              Bookings
            </NavLink>
            
            <NavLink 
              to="/create" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100 font-semibold text-blue-600' : 'text-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              Create
            </NavLink>
            
            <NavLink 
              to="/unavailable" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100 font-semibold text-blue-600' : 'text-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              Unavailable
            </NavLink>
            
            <NavLink 
              to="/fully-booked" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100 font-semibold text-blue-600' : 'text-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              Fully‑Booked
            </NavLink>
            
            <NavLink 
              to="/payments" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100 font-semibold text-blue-600' : 'text-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              Payments
            </NavLink>
            
            <NavLink 
              to="/courts" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100 font-semibold text-blue-600' : 'text-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              Courts
            </NavLink>

            <NavLink 
              to="/plans" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100 font-semibold text-blue-600' : 'text-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              Plans
            </NavLink>

                        <NavLink 
              to="/memberships" 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm rounded-lg transition-colors hover:bg-gray-100 ${
                  isActive ? 'bg-gray-100 font-semibold text-blue-600' : 'text-gray-700'
                }`
              }
              onClick={closeSidebar}
            >
              Memberships
            </NavLink>
          </nav>
        )}
      </div>
    </>
  )
}