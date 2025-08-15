import React from 'react';
import { FileText, Users, Calendar, Shield, AlertTriangle, Clock, Phone, CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Terms() {
  const termsData = [
    {
      icon: Calendar,
      title: "Bookings & Scheduling",
      description: "Session booking requirements and guidelines",
      details: "Sessions must be booked in advance through our online system or by phone. Please arrive 10 minutes early for check-in and preparation. Late arrivals may result in shortened sessions.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Shield,
      title: "Safety Requirements",
      description: "Essential safety rules and equipment guidelines",
      details: "Proper footwear is required on court at all times. Follow staff guidance and safety instructions. Players participate at their own risk and must follow all posted safety guidelines.",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: FileText,
      title: "Refunds & Cancellations",
      description: "Policy for cancellations and rescheduling",
      details: "See our detailed refund policy for cancellations and rescheduling terms. Different timeframes apply for different refund amounts. Emergency situations are handled case-by-case.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      icon: Users,
      title: "Member Conduct",
      description: "Community guidelines and expectations",
      details: "Be respectful of other members, staff, and facilities. Maintain cleanliness in all areas. Inappropriate behavior may result in membership suspension or termination.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200"
    }
  ];

  const additionalTerms = [
    {
      category: "Facility Usage",
      items: [
        "Equipment must be returned in good condition after use",
        "No food or drinks allowed on playing surfaces",
        "Children under 16 must be supervised by an adult at all times",
        "Locker rooms are provided for convenience but valuables should not be left unattended"
      ]
    },
    {
      category: "Membership & Payments",
      items: [
        "Membership fees are non-refundable except as outlined in our refund policy",
        "Payment is due at time of booking or according to membership agreement",
        "Failed payments may result in service suspension until account is current",
        "Price changes will be communicated 30 days in advance"
      ]
    },
    {
      category: "Liability & Insurance",
      items: [
        "Members participate in activities at their own risk",
        "Club Skyshot is not liable for personal injuries during activities",
        "Personal property is the responsibility of the individual member",
        "We recommend personal insurance coverage for sports activities"
      ]
    }
  ];

  return (
    <>
    <Navbar/>
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
            {/* Icon with better styling */}
            <div 
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl mb-8 shadow-lg"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <FileText className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
              These terms govern your use of our facilities and services. Please read them carefully 
              to ensure a safe and enjoyable experience for everyone.
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
          
          {/* Important Notice */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 p-6 rounded-r-2xl shadow-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Legal Notice</h3>
                  <p className="text-yellow-700 leading-relaxed">
                    These sample terms are placeholders and should be replaced with your actual legal copy. 
                    Please consult with a legal professional to ensure your terms meet all applicable laws and regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Terms Cards with enhanced design */}
          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {termsData.map((term, index) => {
              const Icon = term.icon;
              return (
                <div 
                  key={index}
                  className={`group relative p-8 rounded-3xl border-2 ${term.borderColor} ${term.bgColor} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
                  style={{ minHeight: '280px' }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-current"></div>
                    <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full border border-current"></div>
                  </div>
                  
                  <div className="relative flex items-start space-x-5">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${term.bgColor} border-2 ${term.borderColor} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                      <Icon className={`w-7 h-7 ${term.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {term.title}
                      </h3>
                      <p className={`font-semibold text-lg ${term.color} mb-4`}>
                        {term.description}
                      </p>
                      <p className="text-gray-600 leading-relaxed text-base">
                        {term.details}
                      </p>
                    </div>
                  </div>
                  
                  {/* Enhanced hover gradient */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              );
            })}
          </div>

          {/* Detailed Terms Section */}
          <div 
            className="rounded-3xl p-10 md:p-16 shadow-xl mb-20"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)',
              border: '1px solid rgba(148, 163, 184, 0.1)'
            }}
          >
            <div className="text-center mb-16">
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 shadow-lg"
                style={{ backgroundColor: '#24392B' }}
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Detailed Terms
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Additional terms and conditions that apply to all members and visitors
              </p>
            </div>

            <div className="space-y-12">
              {additionalTerms.map((section, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-4" 
                      style={{ backgroundColor: '#24392B' }}
                    ></div>
                    {section.category}
                  </h3>
                  <div className="grid gap-4">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Effective Date & Updates */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg mb-16">
            <div className="text-center">
              <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Effective Date & Updates</h3>
              <div className="max-w-3xl mx-auto space-y-4 text-gray-700">
                <p className="text-lg">
                  <strong className="text-gray-900">Effective Date:</strong> These terms are effective as of January 1, 2024
                </p>
                <p className="text-lg">
                  <strong className="text-gray-900">Updates:</strong> We may update these terms from time to time. 
                  Members will be notified of significant changes via email or through posted notices at our facilities.
                </p>
                <p className="text-lg">
                  <strong className="text-gray-900">Agreement:</strong> By using our services, you agree to be bound by these terms and conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center">
            <div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 shadow-lg"
              style={{ backgroundColor: '#24392B' }}
            >
              <Phone className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Questions About Our Terms?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              If you have any questions about these terms and conditions, please don't hesitate to contact us. 
              We're here to help clarify anything you need to know.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                className="group inline-flex items-center px-8 py-4 rounded-2xl text-white font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                style={{ backgroundColor: '#24392B' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Phone className="w-6 h-6 mr-3 relative z-10" />
                <span className="relative z-10">Contact Us</span>
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