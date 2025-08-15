import React from 'react';
import { Clock, Shield, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Refund() {
  const policies = [
    {
      icon: CheckCircle,
      title: "Full Refund",
      description: "Cancellations 24+ hours before session",
      details: "Cancel your booking at least 24 hours in advance and receive a complete refund processed within 3-5 business days.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: AlertCircle,
      title: "50% Credit",
      description: "Cancellations within 12–24 hours",
      details: "Late cancellations receive a 50% credit toward future sessions, valid for 6 months from the original booking date.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200"
    },
    {
      icon: XCircle,
      title: "No Refund",
      description: "No-shows are not refundable",
      details: "Failed to attend your scheduled session without prior notice. We understand emergencies happen - contact us to discuss.",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: Phone,
      title: "Special Circumstances",
      description: "Contact our team for exceptional cases",
      details: "Medical emergencies, family situations, or other extraordinary circumstances will be reviewed on a case-by-case basis.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section with improved styling */}
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
            {/* Icon with better styling */}
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
              We believe in transparency and fairness. Our refund policy is designed to be clear, 
              straightforward, and respectful of both your time and ours.
            </p>
          </div>
        </div>
        
        {/* Enhanced decorative elements */}
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-gradient-to-br from-green-400/20 to-transparent blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-white/5 blur-2xl"></div>
      </div>

      {/* Main Content with white background */}
      <div className="bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Policy Cards with enhanced design */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {policies.map((policy, index) => {
              const Icon = policy.icon;
              return (
                <div 
                  key={index}
                  className={`group relative p-8 rounded-3xl border-2 ${policy.borderColor} ${policy.bgColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
                  style={{ minHeight: '280px' }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-current"></div>
                    <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full border border-current"></div>
                  </div>
                  
                  <div className="relative flex items-start space-x-5">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${policy.bgColor} border-2 ${policy.borderColor} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                      <Icon className={`w-7 h-7 ${policy.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {policy.title}
                      </h3>
                      <p className={`font-semibold text-lg ${policy.color} mb-4`}>
                        {policy.description}
                      </p>
                      <p className="text-gray-600 leading-relaxed text-base">
                        {policy.details}
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced hover gradient */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              );
            })}
          </div>

          {/* Additional Information with better styling */}
          <div 
            className="rounded-3xl p-10 md:p-16 shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
              border: '1px solid rgba(148, 163, 184, 0.1)'
            }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 shadow-lg"
                  style={{ backgroundColor: '#24392B' }}
                >
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Important Details
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Please review these additional terms to ensure a smooth experience
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-3 h-3 rounded-full mt-2 flex-shrink-0 shadow-sm" 
                      style={{ backgroundColor: '#24392B' }}
                    ></div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      <strong className="text-gray-900 font-semibold">Processing Time:</strong> Refunds are processed within 3-5 business days and will appear on your original payment method.
                    </p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-3 h-3 rounded-full mt-2 flex-shrink-0 shadow-sm" 
                      style={{ backgroundColor: '#24392B' }}
                    ></div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      <strong className="text-gray-900 font-semibold">Booking Changes:</strong> You can modify your appointment up to 2 hours before the scheduled time at no additional cost.
                    </p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-3 h-3 rounded-full mt-2 flex-shrink-0 shadow-sm" 
                      style={{ backgroundColor: '#24392B' }}
                    ></div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      <strong className="text-gray-900 font-semibold">Credit Expiration:</strong> Session credits are valid for 6 months from the original booking date and cannot be extended.
                    </p>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-3 h-3 rounded-full mt-2 flex-shrink-0 shadow-sm" 
                      style={{ backgroundColor: '#24392B' }}
                    ></div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      <strong className="text-gray-900 font-semibold">Emergency Situations:</strong> Medical emergencies and family crises are handled with compassion and flexibility.
                    </p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-3 h-3 rounded-full mt-2 flex-shrink-0 shadow-sm" 
                      style={{ backgroundColor: '#24392B' }}
                    ></div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      <strong className="text-gray-900 font-semibold">Contact Method:</strong> All cancellation requests must be made through our official booking system or customer service line.
                    </p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-3 h-3 rounded-full mt-2 flex-shrink-0 shadow-sm" 
                      style={{ backgroundColor: '#24392B' }}
                    ></div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      <strong className="text-gray-900 font-semibold">Policy Updates:</strong> This policy may be updated periodically. Current version takes precedence over previous versions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section with enhanced design */}
          <div className="text-center mt-20">
            <div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 shadow-lg"
              style={{ backgroundColor: '#24392B' }}
            >
              <Phone className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Questions About Our Refund Policy?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Our customer service team is here to help. We're committed to finding fair solutions that work for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                className="group inline-flex items-center px-8 py-4 rounded-2xl text-white font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                style={{ backgroundColor: '#24392B' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Phone className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10">Contact Support</span>
              </button>
              <button className="group inline-flex items-center px-8 py-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold text-lg hover:bg-gray-200 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200">
                <span>View FAQ</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}