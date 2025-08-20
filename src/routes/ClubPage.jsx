import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Star, Clock, Users, Wifi, Coffee, Car, Award } from "lucide-react";
import { asset } from "../utils/asset";
import { useNavigate } from "react-router-dom";

const images = [
  asset("/PHOTO-2025-08-13-17-57-53 2.jpg"),
  asset("/PHOTO-2025-08-13-17-57-53 3.jpg"),
  asset("/PHOTO-2025-08-13-17-57-53 5.jpg"),
  asset("PHOTO-2025-08-13-17-57-54 2.jpg"),
  asset("/PHOTO-2025-08-13-17-57-54 3.jpg"),
  asset("/PHOTO-2025-08-13-17-57-54 4.jpg"),
  asset("/PHOTO-2025-08-13-17-57-54.jpg")
];

export default function ClubPage() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate()
  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrent(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrent(prev => (prev === images.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrent(prev => (prev === 0 ? images.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrent(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section with Enhanced Carousel */}
      <div className="relative">
        <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
          {images.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                current === index 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={img}
                alt={`Club view ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ))}

          {/* Enhanced Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>

          {/* Enhanced Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`transition-all duration-300 ${
                  current === i
                    ? "w-8 h-2 bg-white rounded-full"
                    : "w-2 h-2 bg-white/50 rounded-full hover:bg-white/70"
                }`}
              />
            ))}
          </div>

          {/* Club Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-green-700/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                Premium Club
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">Club Skyshot</h1>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <p className="text-sm sm:text-base">1512, Sector 74 A, Sahibzada Ajit Singh Nagar, Punjab 160055</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Open 6 AM - 11 PM</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
            <Users className="w-4 h-4 text-green-700" />
            <span className="text-green-800 text-sm font-medium">Available Now</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Court Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">Tournament Courts</h3>
                    <p className="text-gray-600 text-sm">3 professional-grade courts</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">Coaching Available</h3>
                    <p className="text-gray-600 text-sm">Professional & social play</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">AC Lounge</h3>
                    <p className="text-gray-600 text-sm">Climate-controlled comfort</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">Cafe</h3>
                    <p className="text-gray-600 text-sm">Refreshments & beverages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-gray-700">Free Wi-Fi</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Coffee className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-gray-700">Refreshment Area</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Car className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700">Parking Available</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700">Group Sessions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6 mb-8 border border-green-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Starting from</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-green-700">₹1000</span>
                <span className="text-gray-600">/hour</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Peak hours may vary</p>
            </div>
            {/* <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Next available</div>
              <div className="font-medium text-gray-900">Today, 7:00 PM</div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Enhanced Book Button */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={ () => navigate("/club")} className="w-full bg-gradient-to-r from-green-700 to-green-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:from-green-800 hover:to-green-900 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">Book a Slot</span>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
          
          {/* <p className="text-center text-sm text-gray-600 mt-3">
            Free cancellation up to 2 hours before your slot
          </p> */}
        </div>
      </div>
    </div>
  );
}