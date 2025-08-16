import React, { useState } from 'react';
import { Search, Calendar, Clock, MapPin, User, Phone, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { BASE_URL } from '../constants/constants';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const BookingLookupPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayPhone, setDisplayPhone] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumberForDisplay = (value) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, '');
    
    // Format as per your region (adjust as needed)
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    return `+${numbers.slice(0, -10)} ${numbers.slice(-10, -7)}-${numbers.slice(-7, -4)}-${numbers.slice(-4)}`;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Store raw numbers for API
    const rawNumbers = value.replace(/\D/g, '');
    setPhoneNumber(rawNumbers);
    
    // Store formatted version for display
    const formatted = formatPhoneNumberForDisplay(value);
    setDisplayPhone(formatted);
  };

  const searchBookings = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Use raw phone number (digits only) for API call
      const response = await fetch(`${BASE_URL}/bookings/phone/${encodeURIComponent(phoneNumber)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data);
      setSearched(true);
    } catch (err) {
      setError('Unable to fetch bookings. Please try again.');
    
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSlot = (slot) => {
    const [start, end] = slot;
    const formatHour = (hour) => {
      if (hour === 0) return '12:00 AM';
      if (hour < 12) return `${hour}:00 AM`;
      if (hour === 12) return '12:00 PM';
      return `${hour - 12}:00 PM`;
    };
    return `${formatHour(start)} - ${formatHour(end)}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTotalHours = (timeSlots) => {
    return timeSlots.reduce((total, [start, end]) => total + (end - start), 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchBookings();
    }
  };

  return (
    <div className="relative z-10">
      <div className="min-h-screen mt-20" style={{ backgroundColor: '#f0f9f4' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2324392B' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
         <Navbar/>
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg" style={{ backgroundColor: '#24392B' }}>
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 text-black">
              My Bookings
            </h1>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Enter your phone number to view all your court reservations and booking history
            </p>
          </div>

          {/* Search Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-500">
            <div className="flex flex-col space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={displayPhone}
                  onChange={handlePhoneChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 text-lg text-black border-2 border-gray-200 rounded-2xl focus:ring-4 transition-all duration-300 bg-white/50"
                  style={{ 
                    '--tw-ring-color': 'rgba(36, 57, 43, 0.2)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#24392B';
                    e.target.style.boxShadow = '0 0 0 4px rgba(36, 57, 43, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl">
                  {error}
                </div>
              )}

              <button
                onClick={searchBookings}
                disabled={loading}
                className="w-full text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                style={{ 
                  backgroundColor: '#24392B',
                  boxShadow: '0 10px 30px rgba(36, 57, 43, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#1e3125';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#24392B';
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Find My Bookings</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {searched && (
            <div className="space-y-6">
              {bookings.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-4">No Bookings Found</h3>
                  <p className="text-black text-lg">
                    We couldn't find any bookings associated with this phone number.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-black">
                      Your Bookings
                      <span className="text-lg font-normal text-gray-500 ml-3">
                        ({bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'})
                      </span>
                    </h2>
                  </div>

                  <div className="grid gap-6">
                    {bookings.map((booking, index) => (
                      <div
                        key={booking._id}
                        className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.01]"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="p-8">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                            {/* Left Section */}
                            <div className="space-y-4 flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#24392B' }}>
                                  <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-black">
                                    {booking.courtId?.name || 'Court'}
                                  </h3>
                                  <p className="text-black">
                                    {booking.courtId?.location || 'Sports Complex'}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3">
                                  <Calendar className="w-5 h-5" style={{ color: '#24392B' }} />
                                  <div>
                                    <p className="font-semibold text-black">Date</p>
                                    <p className="text-black">{formatDate(booking.date)}</p>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                  <User className="w-5 h-5" style={{ color: '#24392B' }} />
                                  <div>
                                    <p className="font-semibold text-black">Booked by</p>
                                    <p className="text-black">{booking.name}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Right Section */}
                            <div className="lg:text-right space-y-4">
                              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl" style={{ backgroundColor: 'rgba(36, 57, 43, 0.1)' }}>
                                <CreditCard className="w-4 h-4" style={{ color: '#24392B' }} />
                                <span className="font-semibold text-black">
                                  ₹{booking.paidAmount}
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="font-semibold text-black flex items-center justify-end space-x-2">
                                  <Clock className="w-4 h-4" />
                                  <span>Time Slots</span>
                                </p>
                                <div className="space-y-1">
                                  {booking.timeSlots.map((slot, slotIndex) => (
                                    <div
                                      key={slotIndex}
                                      className="text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-between"
                                      style={{ backgroundColor: '#24392B' }}
                                    >
                                      <span>{formatTimeSlot(slot)}</span>
                                      <ChevronRight className="w-4 h-4" />
                                    </div>
                                  ))}
                                </div>
                                <p className="text-sm text-black mt-2">
                                  Total: {getTotalHours(booking.timeSlots)} hour{getTotalHours(booking.timeSlots) !== 1 ? 's' : ''}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="px-8 py-4 border-t border-gray-100" style={{ backgroundColor: 'rgba(36, 57, 43, 0.05)' }}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-black">Booking ID: {booking._id.slice(-8)}</span>
                            <span className="font-medium text-black">
                              Status: <span style={{ color: '#24392B' }}>Confirmed</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary Card */}
                  {bookings.length > 0 && (
                    <div className="rounded-3xl shadow-xl text-white p-8 mt-8" style={{ backgroundColor: '#24392B' }}>
                      <h3 className="text-2xl font-bold mb-4">Booking Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">{bookings.length}</div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Total Bookings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">
                            {bookings.reduce((total, booking) => total + getTotalHours(booking.timeSlots), 0)}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Hours Booked</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold mb-2">
                            ₹{bookings.reduce((total, booking) => total + booking.paidAmount, 0)}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Total Paid</div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        {searched && (
          <button
            onClick={() => {
              setSearched(false);
              setBookings([]);
              setPhoneNumber('');
              setDisplayPhone('');
              setError('');
            }}
            className="fixed bottom-8 right-8 w-14 h-14 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
            style={{ 
              backgroundColor: '#24392B',
              boxShadow: '0 20px 40px rgba(36, 57, 43, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1e3125';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#24392B';
            }}
          >
            <Search className="w-6 h-6" />
          </button>
        )}

        {/* Background Decorations */}
        <div className="fixed top-20 left-10 w-32 h-32 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: 'rgba(36, 57, 43, 0.3)' }}></div>
        <div className="fixed bottom-20 right-20 w-40 h-40 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: 'rgba(36, 57, 43, 0.2)', animationDelay: '1s' }}></div>
        <div className="fixed top-1/2 left-20 w-24 h-24 rounded-full opacity-20 animate-pulse" style={{ backgroundColor: 'rgba(36, 57, 43, 0.25)', animationDelay: '2s' }}></div>
      </div>
      <Footer/>
    </div>
  );
};

export default BookingLookupPage;