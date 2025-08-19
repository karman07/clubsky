import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, DollarSign, User, Phone, Sparkles, Download, CreditCard, Receipt, ArrowLeft } from 'lucide-react';
import { BASE_URL } from '../constants/constants';
import { useParams } from 'react-router-dom';

const MembershipRegistrationSystem = () => {
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'payment', 'receipt'
  const [orderData, setOrderData] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { planId } = useParams();
  // Get URL params to pre-select plan
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      planId: urlParams.get('planId'),
      hours: urlParams.get('hours'),
      price: urlParams.get('price')
    };
  };

  // Fetch membership plans from API
  useEffect(() => {
    const fetchMembershipPlans = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`${BASE_URL}/plans`);
        if (response.ok) {
          const plans = await response.json();
          setMembershipPlans(plans);
          
          // Auto-select plan based on URL params or select first plan
          const urlParams = getUrlParams();
          console.log(urlParams)
          if (planId) {
            const preSelectedPlan = plans.find(plan => plan._id === planId);
            if (preSelectedPlan) {
              setSelectedPlan(preSelectedPlan);
            }
          } else if (plans.length > 0) {
            setSelectedPlan(plans[0]);
          }
        } else {
          setMembershipPlans(fallbackPlans);
          setSelectedPlan(fallbackPlans[0]);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipPlans();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const generateReceiptId = () => {
    return 'RCP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  };

  const handleFormSubmit = async () => {
    if (!selectedPlan || !formData.name || !formData.phone) {
      alert('Please fill in all required fields and select a plan');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create Razorpay order
      const orderFormData = new FormData();
      orderFormData.append('amount', selectedPlan.price.toString());
      orderFormData.append('receipt', generateReceiptId());

      const orderResponse = await fetch(`${BASE_URL}/payments/order`, {
        method: 'POST',
        body: orderFormData
      });

      if (orderResponse.ok) {
        const order = await orderResponse.json();
        setOrderData(order);
        setCurrentStep('payment');
        initializeRazorpay(order);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initializeRazorpay = (order) => {
    const options = {
      key: 'rzp_test_TJOrQglqT6B38A', // Your Razorpay key
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Fitness Membership',
      description: `${selectedPlan.title} - ${selectedPlan.hours} hours`,
      order_id: order.id,
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: formData.name,
        contact: formData.phone
      },
      theme: {
        color: '#10B981'
      },
      modal: {
        ondismiss: function() {
          setCurrentStep('form');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePaymentSuccess = async (paymentResponse) => {
    try {
      // Create membership after successful payment
      const membershipResponse = await fetch(`${BASE_URL}/memberships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          hours: selectedPlan.hours,
          price: selectedPlan.price
        }),
      });

      if (membershipResponse.ok) {
        const membership = await membershipResponse.json();
        
        // Generate receipt data
        const receipt = {
          id: generateReceiptId(),
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          customerName: formData.name,
          customerPhone: formData.phone,
          plan: selectedPlan,
          paymentId: paymentResponse.razorpay_payment_id,
          orderId: paymentResponse.razorpay_order_id,
          signature: paymentResponse.razorpay_signature,
          amount: selectedPlan.price,
          status: 'Paid'
        };

        setReceiptData(receipt);
        setCurrentStep('receipt');
      } else {
        throw new Error('Failed to create membership');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment successful but failed to create membership. Please contact support.');
    }
  };

  const downloadReceipt = () => {
    const receiptContent = `
FITNESS MEMBERSHIP RECEIPT
========================

Receipt ID: ${receiptData.id}
Date: ${receiptData.date}
Time: ${receiptData.time}

CUSTOMER DETAILS
---------------
Name: ${receiptData.customerName}
Phone: ${receiptData.customerPhone}

MEMBERSHIP DETAILS
-----------------
Plan: ${receiptData.plan.title}
Hours: ${receiptData.plan.hours}
Amount: ${formatPrice(receiptData.amount)}

PAYMENT DETAILS
--------------
Payment ID: ${receiptData.paymentId}
Order ID: ${receiptData.orderId}
Status: ${receiptData.status}

Thank you for choosing our fitness membership!
    `;

    const element = document.createElement('a');
    const file = new Blob([receiptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `receipt-${receiptData.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetToForm = () => {
    setCurrentStep('form');
    setFormData({ name: '', phone: '' });
    setOrderData(null);
    setReceiptData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  // Receipt View
  if (currentStep === 'receipt' && receiptData) {
    return (
      <div className="min-h-screen bg-white">
        {/* Razorpay Script */}
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600">
                Your membership has been activated successfully
              </p>
            </div>

            {/* Receipt */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Receipt className="w-6 h-6 text-green-500 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">Receipt</h2>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{receiptData.date}</p>
                  <p>{receiptData.time}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Receipt ID:</span>
                  <span className="text-gray-600">{receiptData.id}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Customer Name:</span>
                  <span className="text-gray-600">{receiptData.customerName}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-600">{receiptData.customerPhone}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Hours:</span>
                  <span className="text-gray-600">{receiptData.plan.hours} hours</span>
                </div>

                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="text-gray-600 text-sm">{receiptData.paymentId}</span>
                </div>

                <div className="flex justify-between py-3 border-t-2 border-gray-200">
                  <span className="text-lg text-gray-800">Total Amount:</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatPrice(receiptData.amount)}
                  </span>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-800 text-center font-medium">
                    Status: {receiptData.status}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={downloadReceipt}
                className="flex-1 flex items-center justify-center py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Receipt
              </button>
              <button
                onClick={resetToForm}
                className="flex-1 flex items-center justify-center py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                New Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form View
  return (
    <div className="min-h-screen bg-white">
      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Join Our Fitness Community
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your perfect membership plan and start your fitness journey today
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Membership Plans */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                  Choose Your Plan
                </h2>
                
                <div className="grid gap-4">
                  {membershipPlans.map((plan) => (
                    <div
                      key={plan._id}
                      onClick={() => handlePlanSelect(plan)}
                      className={`relative cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                        selectedPlan?._id === plan._id
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-6">
                          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                            Most Popular
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-1">
                            {plan.title || `${plan.hours} Hour Plan`}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {plan.description || `Perfect for ${plan.hours} hours of training`}
                          </p>
                          
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center text-green-600">
                              <Clock className="w-4 h-4 mr-1" />
                              <span className="font-medium">{plan.hours} hours</span>
                            </div>
                            <div className="flex items-center text-green-600">
                              <DollarSign className="w-4 h-4 mr-1" />
                              <span className="font-bold text-lg">
                                {formatPrice(plan.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPlan?._id === plan._id
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedPlan?._id === plan._id && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <User className="w-6 h-6 text-green-500 mr-2" />
                  Your Details
                </h2>

                <div className="space-y-6">
                  {/* Name Input */}
                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 `w-full p-3 sm:p-4 border-2 rounded-xl transition-all duration-300 text-gray-800 bg-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <div className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </div>
                    <div className="relative">
        
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 `w-full p-3 sm:p-4 border-2 rounded-xl transition-all duration-300 text-gray-800 bg-white"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Selected Plan Summary */}
                  {selectedPlan && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 mb-2">Selected Plan</h3>
                      <div className="text-sm text-green-700">
                        <p><strong>{selectedPlan.title || `${selectedPlan.hours} Hour Plan`}</strong></p>
                        <p>{selectedPlan.hours} hours - {formatPrice(selectedPlan.price)}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleFormSubmit}
                    disabled={isSubmitting || !selectedPlan}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] ${
                      isSubmitting || !selectedPlan
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Payment
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-4">What You Get</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Professional trainers
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    State-of-the-art equipment
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Flexible scheduling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Progress tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipRegistrationSystem;