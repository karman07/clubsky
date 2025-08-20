import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Check,
  X,
  ArrowLeft
} from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useCourtContext } from '../context/CourtContext';
import { useBookingContext } from '../context/BookingContext';
import BookingDetailsPage from './BookingDetailsPage';

const ImprovedBookingPage = ({ courtId: propCourtId }) => {
  const { courts, loading: courtsLoading, fetchCourtById } = useCourtContext();
  const { getUnavailableSlots, getFullyBookedDays } = useBookingContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const courtIdFromState = location.state?.courtId;
  const finalCourtId = courtIdFromState || propCourtId || id;
  
  // State management
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [unavailableSlots, setUnavailableSlots] = useState(new Set());
  const [fullyBookedDays, setFullyBookedDays] = useState(new Set());
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dateSliderRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Time slots (6 AM to 11 PM in 1-hour intervals)
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour < 23; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const displayTime = hour < 12 ? `${hour}:00 AM` : 
                         hour === 12 ? '12:00 PM' : 
                         `${hour - 12}:00 PM`;
      slots.push({ value: timeString, display: displayTime, hour });
    }
    return slots;
  }, []);

  // Get price per slot from selected court
  const pricePerSlot = selectedCourt?.price || 50;

  // Generate date options (next 30 days, excluding fully booked days)
  const dateOptions = useMemo(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      if (!fullyBookedDays.has(dateString)) {
        dates.push({
          value: dateString,
          display: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          }),
          fullDate: date
        });
      }
    }
    return dates;
  }, [fullyBookedDays]);

  // Initialize selected court based on finalCourtId from params
  useEffect(() => {
    if (courts.length > 0) {
      if (finalCourtId) {
        // Find court by exact ID match - prioritize _id, then fallback to id
        const court = courts.find(c => {
          const courtId = c._id || c.id;
          const targetId = finalCourtId;
          return courtId === targetId || courtId?.toString() === targetId?.toString();
        });
        
        if (court) {
          console.log('Setting selected court from params:', court);
          setSelectedCourt(court);
        } else {
          console.log('Court not found with ID:', finalCourtId, 'Available courts:', courts);
          // If no court found with the ID, don't set any court as selected
          setSelectedCourt(null);
        }
      } else {
        // Only set first court as default if no specific court ID is provided
        console.log('No court ID provided, setting first court as default');
        setSelectedCourt(courts[0]);
      }
    }
  }, [courts, finalCourtId]);

  // Function to expand time slot ranges into individual hours
  const expandTimeSlots = (timeSlotRanges) => {
    const expandedSlots = new Set();
    
    if (Array.isArray(timeSlotRanges)) {
      timeSlotRanges.forEach(range => {
        if (Array.isArray(range) && range.length === 2) {
          const [start, end] = range;
          for (let hour = start; hour <= end; hour++) {
            expandedSlots.add(`${hour.toString().padStart(2, '0')}:00`);
          }
        }
      });
    }
    
    return expandedSlots;
  };

  // Fetch unavailable slots when court or date changes
  useEffect(() => {
    if (selectedCourt && selectedDate) {
      const fetchData = async () => {
        try {
          const courtId = selectedCourt._id || selectedCourt.id;
          const unavailableRanges = await getUnavailableSlots(courtId, selectedDate);
          const expandedUnavailable = expandTimeSlots(unavailableRanges);
          setUnavailableSlots(expandedUnavailable);
          
          const fullyBooked = await getFullyBookedDays(courtId);
          setFullyBookedDays(new Set(fullyBooked || []));
        } catch (error) {
          console.error('Error fetching booking data:', error);
        }
      };
      fetchData();
    }
  }, [selectedCourt, selectedDate, getUnavailableSlots, getFullyBookedDays]);

  // Calculate total price
  const totalPrice = selectedSlots.size * pricePerSlot;

  const handleSlotToggle = (slot) => {
    if (unavailableSlots.has(slot)) return;
    
    setSelectedSlots(prev => {
      const newSlots = new Set(prev);
      if (newSlots.has(slot)) {
        newSlots.delete(slot);
      } else {
        newSlots.add(slot);
      }
      return newSlots;
    });
  };

  const handleCourtChange = (court) => {
    // Only allow selection of one court at a time
    setSelectedCourt(court);
    setSelectedSlots(new Set()); // Clear selected slots when court changes
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlots(new Set()); // Clear selected slots when date changes
  };

  const scrollDateSlider = (direction) => {
    if (dateSliderRef.current) {
      const scrollAmount = isMobile ? 150 : 200;
      dateSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleContinueToDetails = () => {
    if (selectedSlots.size === 0) {
      alert('Please select at least one time slot');
      return;
    }
    setShowBookingDetails(true);
  };

  const handleBackToSlots = () => {
    setShowBookingDetails(false);
  };

  const handleBackToCourts = () => {
    navigate('/book');
  };

  // Helper function to check if a court is selected
  const isCourtSelected = (court) => {
    if (!selectedCourt) return false;
    
    const selectedCourtId = selectedCourt._id || selectedCourt.id;
    const currentCourtId = court._id || court.id;
    
    return selectedCourtId === currentCourtId || 
           selectedCourtId?.toString() === currentCourtId?.toString();
  };

  if (courtsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-4 rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: '#24392B' }}></div>
          <p className="text-gray-700 text-base sm:text-lg">Loading courts...</p>
        </div>
      </div>
    );
  }

  if (showBookingDetails) {
    return (
      <BookingDetailsPage
        selectedCourt={selectedCourt}
        selectedDate={selectedDate}
        selectedSlots={selectedSlots}
        pricePerSlot={pricePerSlot}
        totalPrice={totalPrice}
        timeSlots={timeSlots}
        onBack={handleBackToSlots}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={handleBackToCourts}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 touch-manipulation"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">Book a Court</h1>
              <p className="text-xs sm:text-sm text-gray-700 hidden sm:block">Select your preferred time and court</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Mobile Layout */}
        {isMobile ? (
          <div className="space-y-4 pb-32">
            {/* Court Selection - Mobile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#24392B' }}>Select Court</h2>
              <div className="space-y-3">
                {courts.map((court) => {
                  const isSelected = isCourtSelected(court);
                  
                  return (
                    <div
                      key={court._id || court.id}
                      onClick={() => handleCourtChange(court)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 touch-manipulation active:scale-98 ${
                        isSelected
                          ? 'border-current shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'
                      }`}
                      style={{ 
                        borderColor: isSelected ? '#24392B' : undefined,
                        backgroundColor: isSelected ? '#f8fffe' : undefined
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {court.imageUrl ? (
                          <img
                            src={court.imageUrl}
                            alt={court.name}
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div 
                            className="w-14 h-14 rounded-lg flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                          >
                            {court.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-base text-gray-900 truncate">
                                {court.name}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{court.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="font-semibold text-sm text-gray-900 whitespace-nowrap">
                                ₹{court.price}/hr
                              </span>
                              {isSelected && (
                                <div className="text-white p-1 rounded-full" style={{ backgroundColor: '#24392B' }}>
                                  <Check className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                          </div>
                          {court.features && court.features.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {court.features.slice(0, 2).map((feature, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                              {court.features.length > 2 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                  +{court.features.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Date Selection - Mobile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#24392B' }}>Select Date</h2>
              <div className="relative">
                <button
                  onClick={() => scrollDateSlider('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md border hover:shadow-lg transition-all touch-manipulation active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                <div
                  ref={dateSliderRef}
                  className="flex gap-3 overflow-x-auto scrollbar-hide px-10 py-1"
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {dateOptions.map((date) => (
                    <button
                      key={date.value}
                      onClick={() => handleDateChange(date.value)}
                      className={`flex-shrink-0 p-3 rounded-lg border-2 text-center transition-all duration-300 min-w-[80px] touch-manipulation active:scale-95 ${
                        selectedDate === date.value
                          ? 'text-white shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 text-gray-800 active:bg-gray-50'
                      }`}
                      style={{
                        background: selectedDate === date.value 
                          ? 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)'
                          : undefined,
                        borderColor: selectedDate === date.value ? '#24392B' : undefined
                      }}
                    >
                      <div className="text-xs font-medium leading-tight whitespace-nowrap">{date.display}</div>
                      <div className={`text-xs mt-0.5 ${selectedDate === date.value ? 'text-white opacity-90' : 'text-gray-600'}`}>
                        {date.fullDate.getFullYear()}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => scrollDateSlider('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md border hover:shadow-lg transition-all touch-manipulation active:scale-95"
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Time Slots - Mobile */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#24392B' }}>Available Time Slots</h2>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => {
                  const isUnavailable = unavailableSlots.has(slot.value);
                  const isSelected = selectedSlots.has(slot.value);
                  
                  return (
                    <button
                      key={slot.value}
                      onClick={() => handleSlotToggle(slot.value)}
                      disabled={isUnavailable}
                      className={`p-3 rounded-lg border-2 text-center transition-all duration-300 touch-manipulation active:scale-95 ${
                        isUnavailable
                          ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                          : isSelected
                          ? 'text-white shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 text-gray-800 active:bg-gray-50'
                      }`}
                      style={{
                        background: isSelected && !isUnavailable 
                          ? 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)'
                          : undefined,
                        borderColor: isSelected && !isUnavailable ? '#24392B' : undefined
                      }}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium text-sm whitespace-nowrap">{slot.display}</span>
                      </div>
                      <div className={`text-xs ${
                        isUnavailable 
                          ? 'text-gray-500' 
                          : isSelected 
                          ? 'text-white opacity-90' 
                          : 'text-gray-600'
                      }`}>
                        {isUnavailable ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Booking Summary - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
              {selectedSlots.size > 0 && (
                <div className="px-4 py-3 bg-gray-50 border-b">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 truncate flex-1 mr-2">
                      {selectedSlots.size} slot{selectedSlots.size !== 1 ? 's' : ''} • {selectedCourt?.name}
                    </span>
                    <span className="font-semibold text-gray-900 flex-shrink-0">₹{totalPrice}</span>
                  </div>
                </div>
              )}
              <div className="p-4">
                <button
                  onClick={handleContinueToDetails}
                  disabled={selectedSlots.size === 0}
                  className="w-full text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base touch-manipulation active:scale-98"
                  style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                >
                  {selectedSlots.size === 0 ? 'Select Time Slots' : `Continue (₹${totalPrice})`}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Layout */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Court Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6" style={{ color: '#24392B' }}>Select Court</h2>
                <div className="grid gap-4">
                  {courts.map((court) => {
                    const isSelected = isCourtSelected(court);
                    
                    return (
                      <div
                        key={court._id || court.id}
                        onClick={() => handleCourtChange(court)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                          isSelected
                            ? 'border-current shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ 
                          borderColor: isSelected ? '#24392B' : undefined,
                          backgroundColor: isSelected ? '#f8fffe' : undefined
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {court.imageUrl ? (
                            <img
                              src={court.imageUrl}
                              alt={court.name}
                              className="w-24 h-24 rounded-lg object-cover"
                            />
                          ) : (
                            <div 
                              className="w-24 h-24 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
                              style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                            >
                              {court.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2 text-gray-900">
                              {court.name}
                            </h3>
                            <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                              {court.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {court.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-gray-900">
                                  ₹{court.price}/hour
                                </span>
                              </div>
                            </div>
                            {court.features && court.features.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {court.features.slice(0, 3).map((feature, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {court.features.length > 3 && (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                    +{court.features.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <div className="text-white p-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#24392B' }}>
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date Selection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6" style={{ color: '#24392B' }}>Select Date</h2>
                <div className="relative">
                  <button
                    onClick={() => scrollDateSlider('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md border hover:shadow-lg transition-shadow"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-700" />
                  </button>
                  <div
                    ref={dateSliderRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide px-12"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {dateOptions.map((date) => (
                      <button
                        key={date.value}
                        onClick={() => handleDateChange(date.value)}
                        className={`flex-shrink-0 p-4 rounded-xl border-2 text-center transition-all duration-300 min-w-[120px] ${
                          selectedDate === date.value
                            ? 'text-white shadow-md'
                            : 'border-gray-200 hover:border-gray-300 text-gray-800'
                        }`}
                        style={{
                          background: selectedDate === date.value 
                            ? 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)'
                            : undefined,
                          borderColor: selectedDate === date.value ? '#24392B' : undefined
                        }}
                      >
                        <div className="text-sm font-medium">{date.display}</div>
                        <div className={`text-xs mt-1 ${selectedDate === date.value ? 'text-white opacity-90' : 'text-gray-600'}`}>
                          {date.fullDate.getFullYear()}
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => scrollDateSlider('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md border hover:shadow-lg transition-shadow"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6" style={{ color: '#24392B' }}>Available Time Slots</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot) => {
                    const isUnavailable = unavailableSlots.has(slot.value);
                    const isSelected = selectedSlots.has(slot.value);
                    
                    return (
                      <button
                        key={slot.value}
                        onClick={() => handleSlotToggle(slot.value)}
                        disabled={isUnavailable}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                          isUnavailable
                            ? 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                            : isSelected
                            ? 'text-white shadow-md'
                            : 'border-gray-200 hover:border-gray-300 text-gray-800 hover:shadow-sm'
                        }`}
                        style={{
                          background: isSelected && !isUnavailable 
                            ? 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)'
                            : undefined,
                          borderColor: isSelected && !isUnavailable ? '#24392B' : undefined
                        }}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{slot.display}</span>
                        </div>
                        <div className={`text-xs mt-1 ${
                          isUnavailable 
                            ? 'text-gray-500' 
                            : isSelected 
                            ? 'text-white opacity-90' 
                            : 'text-gray-600'
                        }`}>
                          {isUnavailable ? 'Booked' : isSelected ? 'Selected' : 'Available'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Booking Summary</h3>
                
                {selectedCourt && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900">{selectedCourt.name}</h4>
                    <p className="text-sm text-gray-700">{selectedCourt.location}</p>
                    <p className="text-sm text-gray-700">{selectedDate}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-1">₹{selectedCourt.price}/hour</p>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="text-sm font-medium text-gray-800">Selected Slots:</div>
                  {selectedSlots.size === 0 ? (
                    <p className="text-gray-600 text-sm">No slots selected</p>
                  ) : (
                    <div className="space-y-2">
                      {Array.from(selectedSlots).sort().map(slot => {
                        const slotDisplay = timeSlots.find(s => s.value === slot)?.display || slot;
                        return (
                          <div key={slot} className="flex items-center justify-between text-sm">
                            <span className="text-gray-800">{slotDisplay}</span>
                            <span className="text-gray-900 font-medium">₹{pricePerSlot}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex items-center justify-between font-semibold text-lg">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-gray-900">₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={handleContinueToDetails}
                  disabled={selectedSlots.size === 0}
                  className="w-full text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                >
                  Continue to Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImprovedBookingPage;