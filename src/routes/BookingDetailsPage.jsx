import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CreditCard,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Trophy,
  Shield
} from 'lucide-react';
import { useBookingContext } from '../context/BookingContext';

const BookingDetailsPage = ({ 
  selectedCourt, 
  selectedDate, 
  selectedSlots, 
  pricePerSlot, 
  totalPrice, 
  onBack 
}) => {
  const { createBooking } = useBookingContext();
  
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerPhone: '',
    paymentMethod: 'UPI'
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // Time slots formatting for display
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 6; hour < 23; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      const displayTime = hour < 12 ? `${hour}:00 AM` : 
                         hour === 12 ? '12:00 PM' : 
                         `${hour - 12}:00 PM`;
      slots.push({ value: timeString, display: displayTime });
    }
    return slots;
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!bookingData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
    }
    
    if (!bookingData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(bookingData.customerPhone)) {
      newErrors.customerPhone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    setIsBooking(true);
    try {
      const bookingPayload = {
        courtId: selectedCourt.id,
        date: selectedDate,
        timeSlots: Array.from(selectedSlots),
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        paymentMethod: bookingData.paymentMethod,
        totalAmount: totalPrice
      };

      await createBooking(bookingPayload);
      setBookingSuccess(true);
    } catch (error) {
      alert('Booking failed. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsBooking(false);
    }
  };

  const getTimeRangeDisplay = () => {
    const sortedSlots = Array.from(selectedSlots).sort();
    if (sortedSlots.length === 0) return '';
    
    const firstSlot = timeSlots.find(s => s.value === sortedSlots[0])?.display;
    const lastSlot = timeSlots.find(s => s.value === sortedSlots[sortedSlots.length - 1])?.display;
    
    if (sortedSlots.length === 1) return firstSlot;
    return `${firstSlot} - ${lastSlot}`;
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 text-center" style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12" style={{ color: '#24392B' }} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
            <p className="text-white opacity-90">Your court has been successfully reserved</p>
          </div>
          
          <div className="p-8">
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
                <Trophy className="w-5 h-5" style={{ color: '#24392B' }} />
                <div>
                  <p className="font-semibold text-gray-900">{selectedCourt.name}</p>
                  <p className="text-sm text-gray-600">{selectedCourt.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
                <Calendar className="w-5 h-5" style={{ color: '#24392B' }} />
                <p className="text-gray-900">{formatDate(selectedDate)}</p>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
                <Clock className="w-5 h-5" style={{ color: '#24392B' }} />
                <p className="text-gray-900">{getTimeRangeDisplay()}</p>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
                <User className="w-5 h-5" style={{ color: '#24392B' }} />
                <p className="text-gray-900">{bookingData.customerName}</p>
              </div>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="w-full text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
            >
              Book Another Court
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Booking</h1>
              <p className="text-gray-600">Fill in your details to confirm the reservation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header Section */}
              <div className="p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}>
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-7 h-7" />
                    <h2 className="text-xl font-bold">Personal Details</h2>
                  </div>
                  <p className="text-white opacity-90">We need a few details to complete your booking</p>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-8 space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: '#24392B' }}>
                    <User className="w-5 h-5" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={bookingData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className={`w-full p-4 border-2 rounded-xl transition-all duration-300 text-gray-800 bg-white ${
                          errors.customerName 
                            ? 'border-red-300 focus:border-red-500' 
                            : 'border-gray-200 focus:border-gray-400'
                        } focus:outline-none focus:ring-0`}
                        placeholder="Enter your full name"
                      />
                      {errors.customerName && (
                        <div className="flex items-center gap-2 mt-2 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{errors.customerName}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={bookingData.customerPhone}
                          onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-300 text-gray-800 bg-white ${
                            errors.customerPhone 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 focus:border-gray-400'
                          } focus:outline-none focus:ring-0`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.customerPhone && (
                        <div className="flex items-center gap-2 mt-2 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{errors.customerPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: '#24392B' }}>
                    <CreditCard className="w-5 h-5" />
                    Payment Method
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {['UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map((method) => (
                      <button
                        key={method}
                        onClick={() => handleInputChange('paymentMethod', method)}
                        className={`p-4 rounded-xl border-2 text-center transition-all duration-300 font-medium ${
                          bookingData.paymentMethod === method
                            ? 'text-white'
                            : 'border-gray-200 hover:border-gray-300 text-gray-800 bg-white'
                        }`}
                        style={{
                          background: bookingData.paymentMethod === method 
                            ? 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)'
                            : undefined,
                          borderColor: bookingData.paymentMethod === method ? '#24392B' : undefined
                        }}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div className="rounded-xl p-5 border border-gray-200 bg-white">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" style={{ color: '#24392B' }} />
                    Important Information
                  </h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>• Booking confirmation will be sent via SMS</p>
                    <p>• Free cancellation up to 2 hours before booking</p>
                    <p>• Please arrive 10 minutes early</p>
                    <p>• Equipment rental available on-site</p>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                >
                  {isBooking ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Booking...
                    </div>
                  ) : (
                    `Confirm & Pay ₹${totalPrice}`
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              {/* Summary Header */}
              <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}>
                <h3 className="text-xl font-bold mb-2">Booking Summary</h3>
                <p className="text-white opacity-90">Review your selection</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Court Details */}
                <div>
                  <div className="flex items-start gap-4">
                    {selectedCourt.imageUrl ? (
                      <img
                        src={selectedCourt.imageUrl}
                        alt={selectedCourt.name}
                        className="w-16 h-16 rounded-lg object-cover border-2"
                        style={{ borderColor: '#24392B' }}
                      />
                    ) : (
                      <div 
                        className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                        style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                      >
                        {selectedCourt.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">{selectedCourt.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        {selectedCourt.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f8fffe' }}>
                      <Calendar className="w-5 h-5" style={{ color: '#24392B' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Date</p>
                      <p className="text-sm text-gray-700">{formatDate(selectedDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: '#f8fffe' }}>
                      <Clock className="w-5 h-5" style={{ color: '#24392B' }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 mb-2">Time Slots</p>
                      <div className="space-y-2">
                        {Array.from(selectedSlots).sort().map(slot => {
                          const slotDisplay = timeSlots.find(s => s.value === slot)?.display || slot;
                          return (
                            <div key={slot} className="flex items-center justify-between text-sm py-2 px-3 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
                              <span className="text-gray-800 font-medium">{slotDisplay}</span>
                              <span className="font-semibold" style={{ color: '#24392B' }}>₹{pricePerSlot}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Slots ({selectedSlots.size})</span>
                    <span className="text-gray-900 font-semibold">₹{selectedSlots.size * pricePerSlot}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Service Fee</span>
                    <span className="text-gray-900 font-semibold">Free</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-xl pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Total Amount</span>
                    <span style={{ color: '#24392B' }}>₹{totalPrice}</span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="rounded-xl p-4 border-2" style={{ backgroundColor: '#f8fffe', borderColor: '#24392B' }}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-0.5" style={{ color: '#24392B' }} />
                    <div>
                      <p className="font-semibold" style={{ color: '#24392B' }}>Secure Booking</p>
                      <p className="text-sm text-gray-700 mt-1">
                        Your booking is protected with our secure payment system and flexible cancellation policy.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;