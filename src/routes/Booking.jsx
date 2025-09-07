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
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isSmallMobile: false,
    isMediumMobile: false,
    isLargeMobile: false,
    isTablet: false,
    isSmallTablet: false,
    isLargeTablet: false,
    isDesktop: false,
    width: 0,
    height: 0
  });
  const dateSliderRef = useRef(null);

  // Enhanced screen size detection with better tablet support
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        // Mobile breakpoints
        isMobile: width < 768,
        isSmallMobile: width < 375, // iPhone SE, older phones
        isMediumMobile: width >= 375 && width < 414, // Standard phones
        isLargeMobile: width >= 414 && width < 768, // Large phones
        
        // Tablet breakpoints - improved for Surface Pro 7 and similar devices
        isTablet: width >= 768 && width < 1200,
        isSmallTablet: width >= 768 && width < 900, // iPad Mini, smaller tablets
        isLargeTablet: width >= 900 && width < 1200, // Surface Pro 7, iPad Pro
        
        // Desktop
        isDesktop: width >= 1200
      });
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const { 
    isMobile, 
    isSmallMobile, 
    isMediumMobile, 
    isLargeMobile, 
    isTablet,
    isSmallTablet,
    isLargeTablet,
    isDesktop 
  } = screenSize;

const timeSlots = useMemo(() => {
  const slots = [];
  // Start at 6 AM (hour = 6)
  for (let hour = 6; hour <= 25; hour++) { 
    // hour goes till 25 because 24 = 12 AM, 25 = 1 AM
    const normalizedHour = hour % 24; // Convert back into 0–23
    const timeString = `${normalizedHour.toString().padStart(2, '0')}:00`;

    let displayTime;
    if (normalizedHour === 0) {
      displayTime = '12:00 AM';
    } else if (normalizedHour < 12) {
      displayTime = `${normalizedHour}:00 AM`;
    } else if (normalizedHour === 12) {
      displayTime = '12:00 PM';
    } else {
      displayTime = `${normalizedHour - 12}:00 PM`;
    }

    slots.push({ value: timeString, display: displayTime, hour: normalizedHour });
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
          setSelectedCourt(null);
        }
      } else {
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
    setSelectedCourt(court);
    setSelectedSlots(new Set());
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedSlots(new Set());
  };

  const scrollDateSlider = (direction) => {
    if (dateSliderRef.current) {
      let scrollAmount = 120;
      if (isSmallMobile) scrollAmount = 80;
      else if (isMediumMobile) scrollAmount = 100;
      else if (isLargeMobile) scrollAmount = 140;
      else if (isSmallTablet) scrollAmount = 160;
      else if (isLargeTablet) scrollAmount = 180;
      
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

  // Enhanced responsive class helpers with better tablet support
  const getResponsiveClasses = () => {
    if (isSmallMobile) {
      return {
        container: 'px-2 py-2',
        card: 'p-3',
        text: {
          base: 'text-xs',
          sm: 'text-xs',
          lg: 'text-sm',
          xl: 'text-base'
        },
        button: 'p-2 text-xs',
        grid: {
          courts: 'space-y-2',
          timeSlots: 'grid-cols-2 gap-1.5',
          dates: 'gap-1.5'
        },
        spacing: 'space-y-2'
      };
    } else if (isMediumMobile) {
      return {
        container: 'px-3 py-3',
        card: 'p-3 sm:p-4',
        text: {
          base: 'text-sm',
          sm: 'text-xs',
          lg: 'text-base',
          xl: 'text-lg'
        },
        button: 'p-2.5 text-sm',
        grid: {
          courts: 'space-y-2.5',
          timeSlots: 'grid-cols-3 gap-2',
          dates: 'gap-2'
        },
        spacing: 'space-y-3'
      };
    } else if (isLargeMobile) {
      return {
        container: 'px-4 py-3',
        card: 'p-4',
        text: {
          base: 'text-sm',
          sm: 'text-xs',
          lg: 'text-base',
          xl: 'text-lg'
        },
        button: 'p-3 text-sm',
        grid: {
          courts: 'space-y-3',
          timeSlots: 'grid-cols-3 gap-2.5',
          dates: 'gap-2.5'
        },
        spacing: 'space-y-4'
      };
    } else if (isSmallTablet) {
      // iPad Mini, smaller tablets - optimized layout
      return {
        container: 'px-5 py-4',
        card: 'p-5',
        text: {
          base: 'text-sm',
          sm: 'text-sm',
          lg: 'text-lg',
          xl: 'text-xl'
        },
        button: 'p-3 text-sm',
        grid: {
          courts: 'space-y-3',
          timeSlots: 'grid-cols-4 gap-2.5',
          dates: 'gap-2.5'
        },
        spacing: 'space-y-5'
      };
    } else if (isLargeTablet) {
      // Surface Pro 7, iPad Pro - optimized for larger tablets
      return {
        container: 'px-6 py-5',
        card: 'p-6',
        text: {
          base: 'text-base',
          sm: 'text-sm',
          lg: 'text-lg',
          xl: 'text-xl'
        },
        button: 'p-4 text-base',
        grid: {
          courts: 'space-y-4',
          timeSlots: 'grid-cols-5 gap-3',
          dates: 'gap-3'
        },
        spacing: 'space-y-6'
      };
    } else {
      // Desktop
      return {
        container: 'px-4 py-6',
        card: 'p-6',
        text: {
          base: 'text-base',
          sm: 'text-sm',
          lg: 'text-lg',
          xl: 'text-xl'
        },
        button: 'p-4 text-base',
        grid: {
          courts: 'space-y-4',
          timeSlots: 'grid-cols-4 gap-3',
          dates: 'gap-4'
        },
        spacing: 'space-y-6'
      };
    }
  };

  const responsive = getResponsiveClasses();

  // Determine layout type - tablet uses hybrid layout
  const shouldUseMobileLayout = isMobile;
  const shouldUseTabletLayout = isTablet;
  const shouldUseDesktopLayout = isDesktop;

  if (courtsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className={`${isSmallMobile ? 'w-10 h-10' : isTablet ? 'w-16 h-16' : 'w-12 h-12 sm:w-16 sm:h-16'} border-4 border-gray-200 border-t-4 rounded-full animate-spin mx-auto mb-4`} style={{ borderTopColor: '#24392B' }}></div>
          <p className={`text-gray-700 ${responsive.text.sm}`}>Loading courts...</p>
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
        <div className={`max-w-7xl mx-auto ${responsive.container}`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={handleBackToCourts}
              className={`${isSmallMobile ? 'p-1' : isTablet ? 'p-2' : 'p-1.5 sm:p-2'} hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 touch-manipulation`}
            >
              <ArrowLeft className={`${isSmallMobile ? 'w-4 h-4' : isTablet ? 'w-6 h-6' : 'w-4 h-4 sm:w-5 sm:h-5'} text-gray-700`} />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className={`${responsive.text.xl} font-bold text-gray-900 truncate`}>Book a Court</h1>
              <p className={`${responsive.text.sm} text-gray-700 ${isSmallMobile ? 'hidden' : isTablet ? 'block' : 'hidden sm:block'}`}>Select your preferred time and court</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto ${responsive.container}`}>
        {/* Mobile Layout */}
        {shouldUseMobileLayout && (
          <div className={`${responsive.spacing} pb-32`}>
            {/* Court Selection - Mobile */}
            <div className={`bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 ${responsive.card}`}>
              <h2 className={`${responsive.text.lg} font-semibold mb-3 sm:mb-4`} style={{ color: '#24392B' }}>Select Court</h2>
              <div className={responsive.grid.courts}>
                {courts.map((court) => {
                  const isSelected = isCourtSelected(court);
                  
                  return (
                    <div
                      key={court._id || court.id}
                      onClick={() => handleCourtChange(court)}
                      className={`${responsive.button} rounded-lg border-2 cursor-pointer transition-all duration-300 touch-manipulation active:scale-98 ${
                        isSelected
                          ? 'border-current shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300 active:bg-gray-50'
                      }`}
                      style={{ 
                        borderColor: isSelected ? '#24392B' : undefined,
                        backgroundColor: isSelected ? '#f8fffe' : undefined
                      }}
                    >
                      <div className={`flex items-center ${isSmallMobile ? 'gap-2' : 'gap-2 sm:gap-3'}`}>
                        {court.imageUrl ? (
                          <img
                            src={court.imageUrl}
                            alt={court.name}
                            className={`${isSmallMobile ? 'w-8 h-8' : 'w-10 h-10 sm:w-12 sm:h-12'} rounded-lg object-cover flex-shrink-0`}
                          />
                        ) : (
                          <div 
                            className={`${isSmallMobile ? 'w-8 h-8 text-xs' : 'w-10 h-10 sm:w-12 sm:h-12 text-sm'} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}
                            style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                          >
                            {court.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1 sm:gap-2">
                            <div className="min-w-0 flex-1">
                              <h3 className={`font-semibold ${responsive.text.base} text-gray-900 truncate`}>
                                {court.name}
                              </h3>
                              <div className={`flex items-center gap-1 ${responsive.text.sm} text-gray-600 mt-0.5 sm:mt-1`}>
                                <MapPin className={`${isSmallMobile ? 'w-2 h-2' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'} flex-shrink-0`} />
                                <span className="truncate">{court.location}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              <span className={`font-semibold ${responsive.text.sm} text-gray-900 whitespace-nowrap`}>
                                ₹{court.price}/hr
                              </span>
                              {isSelected && (
                                <div className={`text-white ${isSmallMobile ? 'p-0.5' : 'p-0.5 sm:p-1'} rounded-full`} style={{ backgroundColor: '#24392B' }}>
                                  <Check className={`${isSmallMobile ? 'w-2 h-2' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'}`} />
                                </div>
                              )}
                            </div>
                          </div>
                          {court.features && court.features.length > 0 && (
                            <div className={`flex flex-wrap gap-1 ${isSmallMobile ? 'mt-1' : 'mt-1.5 sm:mt-2'}`}>
                              {court.features.slice(0, isSmallMobile ? 1 : 2).map((feature, index) => (
                                <span
                                  key={index}
                                  className={`${isSmallMobile ? 'px-1 py-0.5 text-xs' : 'px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs'} bg-gray-100 text-gray-700 rounded-full`}
                                >
                                  {feature}
                                </span>
                              ))}
                              {court.features.length > (isSmallMobile ? 1 : 2) && (
                                <span className={`${isSmallMobile ? 'px-1 py-0.5 text-xs' : 'px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs'} bg-gray-100 text-gray-700 rounded-full`}>
                                  +{court.features.length - (isSmallMobile ? 1 : 2)}
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
            <div className={`bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 ${responsive.card}`}>
              <h2 className={`${responsive.text.lg} font-semibold mb-3 sm:mb-4`} style={{ color: '#24392B' }}>Select Date</h2>
              <div className="relative">
                <button
                  onClick={() => scrollDateSlider('left')}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 ${isSmallMobile ? 'p-1' : 'p-1.5 sm:p-2'} bg-white rounded-full shadow-md border hover:shadow-lg transition-all touch-manipulation active:scale-95`}
                >
                  <ChevronLeft className={`${isSmallMobile ? 'w-3 h-3' : 'w-3 h-3 sm:w-4 sm:h-4'} text-gray-700`} />
                </button>
                <div
                  ref={dateSliderRef}
                  className={`flex ${responsive.grid.dates} overflow-x-auto scrollbar-hide py-1 ${isSmallMobile ? 'px-6' : 'px-8 sm:px-10'}`}
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
                      className={`flex-shrink-0 ${isSmallMobile ? 'p-1.5 min-w-[50px]' : 'p-2 sm:p-3 min-w-[60px] sm:min-w-[70px]'} rounded-lg border-2 text-center transition-all duration-300 touch-manipulation active:scale-95 ${
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
                      <div className={`${responsive.text.sm} font-medium leading-tight whitespace-nowrap`}>
                        {isSmallMobile 
                          ? date.display.split(' ').slice(0, 2).join(' ').replace(',', '') 
                          : date.display}
                      </div>
                      <div className={`${responsive.text.sm} ${isSmallMobile ? 'mt-0' : 'mt-0.5'} ${selectedDate === date.value ? 'text-white opacity-90' : 'text-gray-600'}`}>
                        {isSmallMobile ? date.fullDate.getDate() : date.fullDate.getFullYear()}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => scrollDateSlider('right')}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 ${isSmallMobile ? 'p-1' : 'p-1.5 sm:p-2'} bg-white rounded-full shadow-md border hover:shadow-lg transition-all touch-manipulation active:scale-95`}
                >
                  <ChevronRight className={`${isSmallMobile ? 'w-3 h-3' : 'w-3 h-3 sm:w-4 sm:h-4'} text-gray-700`} />
                </button>
              </div>
            </div>

            {/* Time Slots - Mobile */}
            <div className={`bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 ${responsive.card}`}>
              <h2 className={`${responsive.text.lg} font-semibold mb-3 sm:mb-4`} style={{ color: '#24392B' }}>Available Time Slots</h2>
              <div className={`grid ${responsive.grid.timeSlots}`}>
                {timeSlots.map((slot) => {
                  const isUnavailable = unavailableSlots.has(slot.value);
                  const isSelected = selectedSlots.has(slot.value);
                  
                  return (
                    <button
                      key={slot.value}
                      onClick={() => handleSlotToggle(slot.value)}
                      disabled={isUnavailable}
                      className={`${isSmallMobile ? 'p-1.5' : 'p-2 sm:p-3'} rounded-lg border-2 text-center transition-all duration-300 touch-manipulation active:scale-95 ${
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
                      <div className={`flex items-center justify-center ${isSmallMobile ? 'gap-0.5 mb-0' : 'gap-1 mb-0.5 sm:mb-1'}`}>
                        <Clock className={`${isSmallMobile ? 'w-2 h-2' : 'w-2.5 h-2.5 sm:w-3 sm:h-3'}`} />
                        <span className={`font-medium ${responsive.text.sm} whitespace-nowrap`}>
                          {isSmallMobile ? slot.display.replace(' ', '').replace(':00', '') : slot.display}
                        </span>
                      </div>
                      <div className={`${responsive.text.sm} ${
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
                <div className={`${responsive.container} bg-gray-50 border-b`}>
                  <div className={`flex items-center justify-between ${responsive.text.sm}`}>
                    <span className="text-gray-700 truncate flex-1 mr-2">
                      {selectedSlots.size} slot{selectedSlots.size !== 1 ? 's' : ''} • {isSmallMobile ? selectedCourt?.name.split(' ')[0] : selectedCourt?.name}
                    </span>
                    <span className="font-semibold text-gray-900 flex-shrink-0">₹{totalPrice}</span>
                  </div>
                </div>
              )}
              <div className={responsive.container}>
                <button
                  onClick={handleContinueToDetails}
                  disabled={selectedSlots.size === 0}
                  className={`w-full text-white ${isSmallMobile ? 'py-2 px-3 text-xs' : 'py-2.5 px-4 text-sm'} rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-98`}
                  style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                >
                  {selectedSlots.size === 0 ? 'Select Time Slots' : `Continue (₹${totalPrice})`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tablet Layout - Hybrid approach for Surface Pro 7 and similar devices */}
        {shouldUseTabletLayout && (
          <div className={`${responsive.spacing} ${selectedSlots.size > 0 ? 'pb-32' : 'pb-6'}`}>
            {/* Court Selection - Tablet */}
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${responsive.card}`}>
              <h2 className={`${responsive.text.xl} font-semibold mb-5`} style={{ color: '#24392B' }}>Select Court</h2>
              <div className={responsive.grid.courts}>
                {courts.map((court) => {
                  const isSelected = isCourtSelected(court);
                  
                  return (
                    <div
                      key={court._id || court.id}
                      onClick={() => handleCourtChange(court)}
                      className={`${responsive.button} rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                        isSelected
                          ? 'border-current shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ 
                        borderColor: isSelected ? '#24392B' : undefined,
                        backgroundColor: isSelected ? '#f8fffe' : undefined
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {court.imageUrl ? (
                          <img
                            src={court.imageUrl}
                            alt={court.name}
                            className={`${isLargeTablet ? 'w-20 h-20' : 'w-16 h-16'} rounded-lg object-cover flex-shrink-0`}
                          />
                        ) : (
                          <div 
                            className={`${isLargeTablet ? 'w-20 h-20 text-xl' : 'w-16 h-16 text-lg'} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}
                            style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                          >
                            {court.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <h3 className={`font-semibold ${responsive.text.lg} text-gray-900 truncate`}>
                                {court.name}
                              </h3>
                              <div className={`flex items-center gap-2 ${responsive.text.base} text-gray-600 mt-1`}>
                                <MapPin className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{court.location}</span>
                              </div>
                              {court.description && (
                                <p className={`${responsive.text.sm} text-gray-600 mt-1 line-clamp-1`}>
                                  {court.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className={`font-semibold ${responsive.text.base} text-gray-900 whitespace-nowrap`}>
                                ₹{court.price}/hr
                              </span>
                              {isSelected && (
                                <div className="text-white p-2 rounded-full" style={{ backgroundColor: '#24392B' }}>
                                  <Check className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </div>
                          {court.features && court.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {court.features.slice(0, isLargeTablet ? 4 : 3).map((feature, index) => (
                                <span
                                  key={index}
                                  className={`px-2 py-1 ${responsive.text.sm} bg-gray-100 text-gray-700 rounded-full`}
                                >
                                  {feature}
                                </span>
                              ))}
                              {court.features.length > (isLargeTablet ? 4 : 3) && (
                                <span className={`px-2 py-1 ${responsive.text.sm} bg-gray-100 text-gray-700 rounded-full`}>
                                  +{court.features.length - (isLargeTablet ? 4 : 3)} more
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

            {/* Date Selection - Tablet */}
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${responsive.card}`}>
              <h2 className={`${responsive.text.xl} font-semibold mb-5`} style={{ color: '#24392B' }}>Select Date</h2>
              <div className="relative">
                <button
                  onClick={() => scrollDateSlider('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md border hover:shadow-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div
                  ref={dateSliderRef}
                  className={`flex ${responsive.grid.dates} overflow-x-auto scrollbar-hide py-2 px-12`}
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
                      className={`flex-shrink-0 ${isLargeTablet ? 'p-4 min-w-[140px]' : 'p-3 min-w-[120px]'} rounded-xl border-2 text-center transition-all duration-300 ${
                        selectedDate === date.value
                          ? 'text-white shadow-md'
                          : 'border-gray-200 hover:border-gray-300 text-gray-800 hover:shadow-sm'
                      }`}
                      style={{
                        background: selectedDate === date.value 
                          ? 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)'
                          : undefined,
                        borderColor: selectedDate === date.value ? '#24392B' : undefined
                      }}
                    >
                      <div className={`${responsive.text.base} font-medium`}>
                        {date.display}
                      </div>
                      <div className={`${responsive.text.sm} mt-1 ${selectedDate === date.value ? 'text-white opacity-90' : 'text-gray-600'}`}>
                        {date.fullDate.getFullYear()}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => scrollDateSlider('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md border hover:shadow-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Time Slots - Tablet */}
            <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${responsive.card}`}>
              <h2 className={`${responsive.text.xl} font-semibold mb-5`} style={{ color: '#24392B' }}>Available Time Slots</h2>
              <div className={`grid ${responsive.grid.timeSlots}`}>
                {timeSlots.map((slot) => {
                  const isUnavailable = unavailableSlots.has(slot.value);
                  const isSelected = selectedSlots.has(slot.value);
                  
                  return (
                    <button
                      key={slot.value}
                      onClick={() => handleSlotToggle(slot.value)}
                      disabled={isUnavailable}
                      className={`${responsive.button} rounded-xl border-2 text-center transition-all duration-300 ${
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
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className={`font-medium ${responsive.text.base}`}>
                          {slot.display}
                        </span>
                      </div>
                      <div className={`${responsive.text.sm} ${
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

            {/* Tablet Booking Summary - Fixed at bottom when slots selected */}
            {selectedSlots.size > 0 && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
                <div className={`${responsive.container} bg-gray-50 border-b`}>
                  <div className={`flex items-center justify-between ${responsive.text.base}`}>
                    <span className="text-gray-700 truncate flex-1 mr-4">
                      {selectedSlots.size} slot{selectedSlots.size !== 1 ? 's' : ''} selected • {selectedCourt?.name}
                    </span>
                    <span className="font-semibold text-gray-900 flex-shrink-0 text-lg">₹{totalPrice}</span>
                  </div>
                </div>
                <div className={responsive.container}>
                  <button
                    onClick={handleContinueToDetails}
                    className={`w-full text-white ${responsive.button} rounded-xl font-semibold transition-all duration-300`}
                    style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                  >
                    Continue to Details (₹{totalPrice})
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Desktop Layout */}
        {shouldUseDesktopLayout && (
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