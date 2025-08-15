import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Privacy() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section with Gradient Background */}
      <div className="relative min-h-screen">
        {/* Background with subtle gradient and pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-green-50">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #24392B 1px, transparent 1px),
                             radial-gradient(circle at 80% 50%, #24392B 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        {/* Content Container */}
        <div className="relative z-10">
          {/* Hero Header */}
          <section className="pt-32 pb-16 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Privacy & Security
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: "#24392B" }}>
                Your Privacy
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                  Matters to Us
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                We believe in transparency and protecting your personal information. 
                Here's exactly how we handle your data and respect your privacy.
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No data selling
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full transparency
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Your rights protected
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="pb-20 px-6">
            <div className="max-w-4xl mx-auto">
              {/* Content Cards */}
              <div className="space-y-8">
                
                {/* Introduction Card */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Introduction
                      </h2>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        This privacy policy outlines our commitment to protecting your personal information. 
                        We believe in being transparent about our data practices and giving you control over 
                        your information. This policy explains what information we collect, how we use it, 
                        and your rights regarding your data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Information Collection Card */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Information We Collect
                      </h2>
                      <p className="text-gray-700 leading-relaxed text-lg mb-4">
                        We collect minimal information necessary to provide our services and respond to your inquiries:
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Your name and email address when you contact us
                        </div>
                        <div className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Message content and communication history
                        </div>
                        <div className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          Basic analytics data to improve site experience
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* How We Use Information Card */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        How We Use Your Information
                      </h2>
                      <p className="text-gray-700 leading-relaxed text-lg mb-4">
                        Your information is used solely to provide better service and improve your experience:
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">We DO</h4>
                          <ul className="text-green-700 text-sm space-y-1">
                            <li>• Respond to your inquiries</li>
                            <li>• Improve site functionality</li>
                            <li>• Analyze usage patterns</li>
                          </ul>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-2">We DON'T</h4>
                          <ul className="text-red-700 text-sm space-y-1">
                            <li>• Sell your data</li>
                            <li>• Share with third parties</li>
                            <li>• Send unsolicited emails</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Rights Card */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Your Data Rights
                      </h2>
                      <p className="text-gray-700 leading-relaxed text-lg mb-6">
                        You have full control over your personal information. We respect your rights and make it easy to exercise them.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 font-medium">Request data deletion</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 font-medium">Update your information</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 font-medium">Access your data</span>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 font-medium">Opt-out anytime</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white shadow-xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                      Questions About Your Privacy?
                    </h2>
                    <p className="text-lg mb-6 text-green-100">
                      We're here to help. Contact us anytime with privacy-related questions or requests.
                    </p>
                    <div className="inline-flex items-center bg-white/10 rounded-full px-6 py-3 backdrop-blur-sm border border-white/20">
                      <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <a 
                        href="mailto:privacy@example.com" 
                        className="text-white hover:text-green-200 transition-colors duration-200 font-medium"
                      >
                        privacy@example.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}