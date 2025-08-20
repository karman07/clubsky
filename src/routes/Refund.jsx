import React from 'react';
import { Shield, Clock, Phone } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Refund() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#24392B' }}>
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 78, 59, 0.2) 100%)'
          }}
        ></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Icon */}
            <div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-8 shadow-lg"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <Shield className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Refund Policy
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              Transparency is our priority. Please read Matchacha’s strict no refund and cancellation terms below.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-green-400/20 to-transparent blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-white/5 blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Overview Section */}
          <div 
            className="rounded-3xl p-10 md:p-16 shadow-xl mb-16"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
              border: '1px solid rgba(148, 163, 184, 0.1)'
            }}
          >
            <div className="text-center mb-10">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 shadow-lg"
                style={{ backgroundColor: '#24392B' }}
              >
                <Clock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">OVERVIEW</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong className="font-semibold">No Refund and Cancellation Policy</strong>
              </p>
            </div>

            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Once your booking is confirmed, <strong>Matchacha does not offer any refunds or cancellations</strong> under any circumstances. 
                By confirming your booking, you acknowledge and agree that all payments made are non-refundable 
                and that cancellations are not permitted.
              </p>
              <p>
                We at Matchacha do not support or promote the cancellation or refund of any bookings. 
                We encourage all customers to carefully review their booking details before confirmation.
              </p>
              <p>
                In case of any issues or special requests, we recommend contacting us as early as possible, 
                but please note that <strong>cancellation and refund will not be granted.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
