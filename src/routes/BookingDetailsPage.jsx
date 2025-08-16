import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle,
  AlertCircle,
  Sparkles,
  Trophy,
  Shield,
  CreditCard,
  Download,
  // Print,
  Share2,
  Star,
  Building,
  Mail,
  Globe
} from 'lucide-react';
import { BASE_URL } from '../constants/constants'

// Mock booking context - replace with your actual context
const useBookingContext = () => ({
  createBooking: async (data) => {
    console.log('Creating booking:', data);
    return { success: true, bookingId: 'BK' + Date.now() };
  }
});

const BookingDetailsPage = ({ 
  selectedCourt = {
    _id: 'court1',
    name: 'Premium Court A',
    location: 'Sector 14, Gurgaon',
    price: 500,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300'
  }, 
  selectedDate = '2024-08-16', 
  selectedSlots = new Set(['19:00', '20:00', '21:00']), 
  pricePerSlot = 500, 
  totalPrice = 1500,
  timeSlots = [
    { value: '19:00', display: '7:00 PM - 8:00 PM' },
    { value: '20:00', display: '8:00 PM - 9:00 PM' },
    { value: '21:00', display: '9:00 PM - 10:00 PM' }
  ],
  onBack = () => console.log('Back clicked')
}) => {
  const { createBooking } = useBookingContext();
  
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: ''
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errors, setErrors] = useState({});

  // Memory storage for user data (replacing localStorage)
  const [savedUserData, setSavedUserData] = useState({});
  const [showSavedConfirmation, setShowSavedConfirmation] = useState(false);
  
  useEffect(() => {
    // Initialize with any saved data
    if (savedUserData.customerName || savedUserData.customerPhone) {
      setBookingData({
        customerName: savedUserData.customerName || '',
        customerPhone: savedUserData.customerPhone || '',
        customerEmail: savedUserData.customerEmail || ''
      });
    }
  }, [savedUserData]);

  // Convert time slots to the required format [[startHour, endHour]]
  const convertTimeSlotsToFormat = (slots) => {
    return Array.from(slots).map(slot => {
      const hour = parseInt(slot.split(':')[0]);
      return [hour, hour + 1]; // Each slot is 1 hour
    });
  };

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
    
    if (!bookingData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
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

  // Save user data in memory and show confirmation
  const saveUserDataLocally = () => {
    const userData = {
      customerName: bookingData.customerName,
      customerPhone: bookingData.customerPhone,
      customerEmail: bookingData.customerEmail,
      lastUpdated: new Date().toISOString()
    };
    setSavedUserData(userData);
    setShowSavedConfirmation(true);
    
    // Hide confirmation after 3 seconds
    setTimeout(() => {
      setShowSavedConfirmation(false);
    }, 3000);
  };

  // Initialize Razorpay payment
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Create Razorpay order
const createRazorpayOrder = async () => {
  try {
    // Generate random 6-digit number
    const randomReceipt = Math.floor(100000 + Math.random() * 900000).toString();

    const formData = new FormData();
    formData.append('amount', totalPrice.toString()); // Must be string
    formData.append('receipt', randomReceipt);        // Send generated receipt

    const response = await fetch(`${BASE_URL}/payments/order`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to create payment order');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment order creation failed:', error);
    throw error;
  }
};

  const handlePayment = async (orderData) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: 'rzp_test_TJOrQglqT6B38A', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ClubSkyshot',
        description: `Court Booking - ${selectedCourt.name}`,
        order_id: orderData.id,
        prefill: {
          name: bookingData.customerName,
          email: bookingData.customerEmail,
          contact: bookingData.customerPhone,
        },
        theme: {
          color: '#24392B',
        },
        handler: function (response) {
          resolve({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
        },
        modal: {
          ondismiss: function () {
            reject(new Error('Payment cancelled'));
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  const createBookingRecord = async (paymentData, orderData) => {
    try {
      const formData = new FormData();
      
      // Convert time slots to required format
      const formattedTimeSlots = convertTimeSlotsToFormat(selectedSlots);
      
      formData.append('courtId', selectedCourt._id);
      formData.append('date', selectedDate);
      formData.append('timeSlots', JSON.stringify(formattedTimeSlots));
      formData.append('name', bookingData.customerName);
      formData.append('phoneNumber', bookingData.customerPhone);
      formData.append('email', bookingData.customerEmail);
      formData.append('paidAmount', totalPrice);
      formData.append('paymentId', paymentData.razorpay_payment_id);
      formData.append('orderId', paymentData.razorpay_order_id);
      formData.append('paymentSignature', paymentData.razorpay_signature);
      formData.append('paymentStatus', 'completed');

      const response = await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Booking creation failed:', error);
      throw error;
    }
  };

  const handleBooking = async () => {
    if (!validateForm()) return;

    setIsBooking(true);
    setIsProcessingPayment(true);

    try {
      // Save user data
      saveUserDataLocally();

      // Load Razorpay script
      const razorpayLoaded = await initializeRazorpay();
      if (!razorpayLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create Razorpay order
      const orderData = await createRazorpayOrder();
      
      setIsProcessingPayment(false);

      // Process payment
      const paymentData = await handlePayment(orderData);
      
      setIsProcessingPayment(true);

      // Create booking record
      const booking = await createBookingRecord(paymentData, orderData);
      
      // Set booking details for receipt
      setBookingDetails({
        ...booking,
        bookingId: booking._id || 'BK' + Date.now(),
        paymentId: paymentData.razorpay_payment_id,
        court: selectedCourt,
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        customerEmail: bookingData.customerEmail,
        date: selectedDate,
        timeSlots: Array.from(selectedSlots),
        totalAmount: totalPrice,
        bookingDate: new Date().toISOString()
      });

      setBookingSuccess(true);
    } catch (error) {
      console.error('Booking process failed:', error);
      alert(error.message || 'Booking failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simplified version for download
    const element = document.getElementById('receipt-content');
    if (element) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Booking Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .receipt { max-width: 600px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #24392B; padding-bottom: 20px; margin-bottom: 20px; }
              .details { margin: 20px 0; }
              .row { display: flex; justify-content: space-between; margin: 10px 0; }
              .total { font-weight: bold; font-size: 18px; border-top: 2px solid #24392B; padding-top: 10px; }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Receipt Component
  const ReceiptPage = () => (
    <div className="min-h-screen bg-gray-50 py-8" id="receipt-page">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" id="receipt-content">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">BOOKING RECEIPT</h1>
                <p className="text-gray-300">ClubSkyshot Sports Complex</p>
              </div>
              <div className="text-right">
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  CONFIRMED
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Venue Details
                </h3>
                <div className="space-y-2 text-gray-200">
                  <p><strong>Court:</strong> {bookingDetails.court.name}</p>
                  <p><strong>Location:</strong> {bookingDetails.court.location}</p>
                  <p><strong>Rate:</strong> ₹{bookingDetails.court.price}/hour</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Details
                </h3>
                <div className="space-y-2 text-gray-200">
                  <p><strong>Name:</strong> {bookingDetails.customerName}</p>
                  <p><strong>Phone:</strong> {bookingDetails.customerPhone}</p>
                  <p><strong>Email:</strong> {bookingDetails.customerEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  Booking Information
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Date</p>
                      <p className="text-gray-700">{formatDate(bookingDetails.date)}</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-green-600" />
                      <p className="font-semibold text-gray-800">Time Slots</p>
                    </div>
                    <div className="space-y-2">
                      {bookingDetails.timeSlots.map(slot => {
                        const slotDisplay = timeSlots.find(s => s.value === slot)?.display || slot;
                        return (
                          <div key={slot} className="flex justify-between items-center bg-white p-2 rounded">
                            <span className="text-gray-700">{slotDisplay}</span>
                            <span className="font-semibold text-green-600">₹{pricePerSlot}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                  Payment Information
                </h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Booking ID:</span>
                        <span className="font-mono font-semibold text-gray-800">{bookingDetails.bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Payment ID:</span>
                        <span className="font-mono font-semibold text-sm text-gray-800">{bookingDetails.paymentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Payment Method:</span>
                        <span className="font-semibold text-gray-800">Razorpay</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Status:</span>
                        <span className="font-semibold text-green-600">Paid</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3 text-gray-800">Price Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Slots ({bookingDetails.timeSlots.length})</span>
                        <span className="text-gray-800 font-semibold">₹{bookingDetails.timeSlots.length * pricePerSlot}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Service Fee</span>
                        <span className="text-green-600 font-semibold">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700 font-medium">Taxes</span>
                        <span className="text-gray-800 font-semibold">₹0</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-bold text-lg">
                          <span className="text-gray-800">Total Amount</span>
                          <span className="text-green-600">₹{bookingDetails.totalAmount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 mt-8 text-center">
              <p className="text-sm text-gray-700 mb-2 font-medium">
                Booking Date: {new Date(bookingDetails.bookingDate).toLocaleString()}
              </p>
              <div className="flex justify-center items-center gap-4 text-xs text-gray-600">
                <span>ClubSkyshot Sports Complex</span>
                <span>•</span>
                <span>support@clubskyshot.com</span>
                <span>•</span>
                <span>+91-9876543210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {/* <Print className="w-5 h-5" /> */}
            Print Receipt
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
          <button
            onClick={() => setShowReceipt(false)}
            className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Booking
          </button>
        </div>
      </div>
    </div>
  );

  // Show receipt if booking is successful and showReceipt is true
  if (bookingSuccess && showReceipt && bookingDetails) {
    return <ReceiptPage />;
  }

  // Success page
  if (bookingSuccess && bookingDetails) {
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
                  <p className="font-semibold text-black">{selectedCourt.name}</p>
                  <p className="text-sm text-gray-600">{selectedCourt.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
                <Calendar className="w-5 h-5" style={{ color: '#24392B' }} />
                <p className="text-black">{formatDate(selectedDate)}</p>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
                <Clock className="w-5 h-5" style={{ color: '#24392B' }} />
                <p className="text-black">{getTimeRangeDisplay()}</p>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
                <User className="w-5 h-5" style={{ color: '#24392B' }} />
                <p className="text-black">{bookingData.customerName}</p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
                <CreditCard className="w-5 h-5" style={{ color: '#24392B' }} />
                <div>
                  <p className="text-black font-semibold">Payment ID</p>
                  <p className="text-sm text-gray-600 font-mono">{bookingDetails.paymentId}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowReceipt(true)}
                className="w-full text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
              >
                <Download className="w-5 h-5" />
                View Receipt
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-100 text-gray-800 py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-200"
              >
                Book Another Court
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-black">Complete Your Booking</h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Fill in your details to confirm the reservation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header Section */}
              <div className="p-6 sm:p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}>
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 sm:w-7 sm:h-7 h-6" />
                    <h2 className="text-lg sm:text-xl font-bold">Personal Details</h2>
                  </div>
                  <p className="text-white opacity-90 text-sm sm:text-base">We need a few details to complete your booking</p>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6 flex items-center gap-2" style={{ color: '#24392B' }}>
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={bookingData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className={`w-full p-3 sm:p-4 border-2 rounded-xl transition-all duration-300 text-gray-800 bg-white ${
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
                      <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={bookingData.customerPhone}
                          onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 rounded-xl transition-all duration-300 text-gray-800 bg-white ${
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

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
                        Email Address *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={bookingData.customerEmail}
                          onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 border-2 rounded-xl transition-all duration-300 text-gray-800 bg-white ${
                            errors.customerEmail 
                              ? 'border-red-300 focus:border-red-500' 
                              : 'border-gray-200 focus:border-gray-400'
                          } focus:outline-none focus:ring-0`}
                          placeholder="Enter your email address"
                        />
                      </div>
                      {errors.customerEmail && (
                        <div className="flex items-center gap-2 mt-2 text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm">{errors.customerEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* User Data Saved Confirmation */}
                {showSavedConfirmation && (
                  <div className="rounded-xl p-4 sm:p-5 border border-green-200 bg-green-50 transition-all duration-300">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold text-sm sm:text-base">Information Saved Successfully!</span>
                    </div>
                    <p className="text-green-700 text-xs sm:text-sm mt-1">
                      Your details have been saved and will be automatically filled for future bookings
                    </p>
                  </div>
                )}

                {/* Saved Data Indicator */}
                {savedUserData.customerName && !showSavedConfirmation && (
                  <div className="rounded-xl p-4 sm:p-5 border border-blue-200 bg-blue-50">
                    <div className="flex items-center gap-2 text-blue-800">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-semibold text-sm sm:text-base">Information Previously Saved</span>
                    </div>
                    <p className="text-blue-700 text-xs sm:text-sm mt-1">
                      Using your saved details from {new Date(savedUserData.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Terms */}
                <div className="rounded-xl p-4 sm:p-5 border border-gray-200 bg-white">
                  <h4 className="font-semibold text-black mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <Shield className="w-4 h-4" style={{ color: '#24392B' }} />
                    Important Information
                  </h4>
                  <div className="text-xs sm:text-sm text-black space-y-2">
                    <p>• Booking confirmation will be sent via SMS and Email</p>
                    <p>• Free cancellation up to 2 hours before booking</p>
                    <p>• Please arrive 10 minutes early</p>
                    <p>• Equipment rental available on-site</p>
                    <p>• Your personal information is saved securely for future bookings</p>
                    <p>• Payment is processed securely through Razorpay</p>
                  </div>
                </div>

                {/* Payment Processing Status */}
                {isProcessingPayment && (
                  <div className="rounded-xl p-4 sm:p-5 border border-blue-200 bg-blue-50">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <div>
                        <p className="font-semibold text-blue-800 text-sm sm:text-base">Processing Payment</p>
                        <p className="text-blue-700 text-xs sm:text-sm">Please don't close this window...</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full text-white py-3 sm:py-4 px-6 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                >
                  {isBooking ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {isProcessingPayment ? 'Processing Payment...' : 'Creating Booking...'}
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                      Pay ₹{totalPrice} with Razorpay
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-6">
              {/* Summary Header */}
              <div className="p-4 sm:p-6 text-white" style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Booking Summary</h3>
                <p className="text-white opacity-90 text-sm sm:text-base">Review your selection</p>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Court Details */}
                <div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    {selectedCourt.imageUrl ? (
                      <img
                        src={selectedCourt.imageUrl}
                        alt={selectedCourt.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border-2"
                        style={{ borderColor: '#24392B' }}
                      />
                    ) : (
                      <div 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-white text-base sm:text-lg font-bold"
                        style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
                      >
                        {selectedCourt.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-black text-base sm:text-lg">{selectedCourt.name}</h4>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 mt-1">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        {selectedCourt.location}
                      </div>
                      <div className="text-xs sm:text-sm text-black font-semibold mt-1">
                        ₹{selectedCourt.price}/hour
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f8fffe' }}>
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#24392B' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-black text-sm sm:text-base">Date</p>
                      <p className="text-xs sm:text-sm text-black">{formatDate(selectedDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: '#f8fffe' }}>
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: '#24392B' }} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-black mb-2 text-sm sm:text-base">Time Slots</p>
                      <div className="space-y-2">
                        {Array.from(selectedSlots).sort().map(slot => {
                          const slotDisplay = timeSlots.find(s => s.value === slot)?.display || slot;
                          return (
                            <div key={slot} className="flex justify-between items-center text-xs sm:text-sm py-2 px-2 sm:px-3 rounded-lg" style={{ backgroundColor: '#f8fffe' }}>
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
                <div className="space-y-3 pt-3 sm:pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-black">Slots ({selectedSlots.size})</span>
                    <span className="text-black font-semibold">₹{selectedSlots.size * pricePerSlot}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-black">Service Fee</span>
                    <span className="text-black font-semibold">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-black">Taxes & Fees</span>
                    <span className="text-black font-semibold">₹0</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-lg sm:text-xl pt-3 border-t border-gray-200">
                    <span className="text-black">Total Amount</span>
                    <span style={{ color: '#24392B' }}>₹{totalPrice}</span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="rounded-xl p-3 sm:p-4 border-2" style={{ backgroundColor: '#f8fffe', borderColor: '#24392B' }}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5" style={{ color: '#24392B' }} />
                    <div>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: '#24392B' }}>Secure Booking</p>
                      <p className="text-xs sm:text-sm text-black mt-1">
                        Your booking is protected with Razorpay's secure payment system and our flexible cancellation policy.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="rounded-xl p-3 sm:p-4 bg-gray-50">
                  <h4 className="font-semibold text-black mb-2 text-sm">Accepted Payment Methods</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>Cards, UPI, Net Banking, Wallets</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Powered by Razorpay</p>
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