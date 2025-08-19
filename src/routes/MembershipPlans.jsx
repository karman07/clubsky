import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Star, Clock, Users, Zap } from "lucide-react";
import {BASE_URL} from '../constants/constants'
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const AMENITIES = [
  { label: "CCTV Monitoring", icon: "🎥" },
  { label: "First Aid Support", icon: "⛑️" },
  { label: "Comfortable Seating", icon: "🪑" },
  { label: "Clean Restrooms", icon: "🚻" },
  { label: "Study Equipment", icon: "📚" },
  { label: "Free Parking", icon: "🅿️" },
  { label: "High-Speed WiFi", icon: "📶" },
  { label: "Drinking Water", icon: "🚰" },
  { label: "AC Study Lounge", icon: "❄️" },
  { label: "Refreshment Cafe", icon: "☕️" },
];

export default function MembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch(`${BASE_URL}/plans`);
        if (!res.ok) {
          throw new Error('Failed to fetch plans');
        }
        const data = await res.json();
        
        // Process the data to add discount and other UI properties
        const processedPlans = data.map((plan, index) => ({
          ...plan,
          // Add discount based on hours (you can modify this logic)
          discount: plan.hours >= 100 ? 30 : 
                   plan.hours >= 50 ? 25 : 
                   plan.hours >= 25 ? 20 : 15,
          // Mark the second plan as popular (you can modify this logic)
          popular: index === 1 || plan.hours === 25,
          // Ensure description exists
          description: plan.description || `Perfect ${plan.hours}-hour study package for dedicated preparation`
        }));
        
        setPlans(processedPlans);
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        // You can set an error state here if needed
        // setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const calculateOriginalPrice = (currentPrice, discountPercent) => {
    return Math.round(currentPrice / (1 - discountPercent / 100));
  };

  const calculatePerHourRate = (price, hours) => {
    return Math.round(price / hours);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-800 mx-auto mb-4"></div>
          <p className="text-emerald-800 text-lg font-semibold">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <Navbar/>
      <div className="pt-24 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6">
            <Star className="w-4 h-4 mr-2" />
            Premium Study Plans
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-emerald-900 mb-6 leading-tight">
            Choose Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900">
              Success Plan
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Unlock your potential with our expertly designed study plans. 
            All plans include premium amenities and personalized coaching support.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
              Expert Coaching
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
              Premium Facilities
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
              Flexible Timings
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-emerald-600" />
              Progress Tracking
            </div>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, index) => {
              const originalPrice = calculateOriginalPrice(plan.price, plan.discount);
              const perHourRate = calculatePerHourRate(plan.price, plan.hours);
              const originalPerHour = 1000; // Base rate per hour

              return (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="relative"
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                        <Star className="w-3 h-3 inline mr-1" />
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  <div className={`relative rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border-2 overflow-hidden group hover:scale-105 ${
                    plan.popular 
                      ? 'border-amber-200 bg-gradient-to-b from-white to-amber-50' 
                      : 'border-emerald-200 bg-white hover:border-emerald-300'
                  }`}>
                    
                    {/* Discount Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {plan.discount}% OFF
                      </div>
                    </div>

                    {/* Card Header */}
                    <div className={`p-8 text-center ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600' 
                        : 'bg-gradient-to-r from-emerald-700 to-emerald-800'
                    }`}>
                      <div className="mb-4">
                        <Clock className="w-12 h-12 text-white mx-auto mb-2" />
                        <h2 className="text-3xl font-bold text-white">
                          {plan.hours} Hours
                        </h2>
                        <p className="text-white/80 text-sm font-medium">
                          Study
                        </p>
                      </div>

                      {/* Pricing */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-white/60 text-lg line-through">
                            ₹{originalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-4xl font-bold text-white">
                          ₹{plan.price.toLocaleString()}
                        </div>
                        <div className="text-white/80 text-sm">
                          ₹{perHourRate}/hour (was ₹{originalPerHour}/hour)
                        </div>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-8">
                      <p className="text-gray-600 text-center mb-6 leading-relaxed">
                        {plan.description}
                      </p>

                      {/* Key Features */}
                      <div className="space-y-3 mb-8">
                        <h4 className="font-semibold text-emerald-900 mb-4 flex items-center">
                          <Zap className="w-4 h-4 mr-2" />
                          Included Features
                        </h4>
                        {AMENITIES.slice(0, 6).map((amenity, idx) => (
                          <div key={idx} className="flex items-center text-gray-700">
                            <CheckCircle className="text-emerald-600 mr-3 h-4 w-4 flex-shrink-0" />
                            <span className="text-sm">{amenity.label}</span>
                          </div>
                        ))}
                        <div className="flex items-center text-gray-500 text-sm">
                          <Users className="w-4 h-4 mr-3" />
                          + {AMENITIES.length - 6} more premium amenities
                        </div>
                      </div>

                      {/* Savings Highlight */}
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <div className="text-center">
                          <p className="text-green-800 font-semibold text-sm">
                            💰 You Save: ₹{(originalPrice - plan.price).toLocaleString()}
                          </p>
                          <p className="text-green-600 text-xs mt-1">
                            That's ₹{originalPerHour - perHourRate} less per hour!
                          </p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        className={`w-full font-semibold rounded-2xl py-4 px-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                          plan.popular
                            ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                            : 'bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white'
                        }`}
                        onClick={() => navigate(`/membershipDetails/${plan._id}`)}
                      >
                        {plan.popular ? 'Choose Popular Plan' : 'Select This Plan'}
                        <div className="text-xs mt-1 opacity-90">
                          Start your journey today
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16 max-w-2xl mx-auto"
        >
        </motion.div>
      </div>
    </div>
  );
}