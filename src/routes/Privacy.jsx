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
                Privacy Policy
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
                  Secure payments via Razorpay
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No card data stored
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Full transparency
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="pb-20 px-6">
            <div className="max-w-4xl mx-auto">
              {/* Content Cards */}
              <div className="space-y-8">
                
                {/* Section 1 - What We Do With Your Information */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        What Do We Do With Your Information?
                      </h2>
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address and email address.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          When you browse our store, we also automatically receive your computer's internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.
                        </p>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            Email Marketing
                          </h4>
                          <p className="text-green-700 text-sm">
                            With your permission, we may send you emails about our store, new products and other updates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2 - Consent */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Consent
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">How do you get my consent?</h3>
                          <p className="text-gray-700 leading-relaxed">
                            When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.
                          </p>
                          <p className="text-gray-700 leading-relaxed mt-2">
                            If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.
                          </p>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <h4 className="text-lg font-semibold text-orange-800 mb-2">How do I withdraw my consent?</h4>
                          <p className="text-orange-700 text-sm">
                            If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at anytime, by contacting us at <strong>clubskyshot@yahoo.com</strong>:
                          </p>
                          <div className="mt-2 text-orange-700 text-sm font-medium">
                           Club Skyshot, 1512, Sector 74 A, Sahibzada Ajit Singh Nagar, Punjab 160055
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3 - Disclosure */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Disclosure
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 4 - Payment */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Payment Security
                      </h2>
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          We use <strong>Razorpay</strong> for processing payments. We/Razorpay do not store your card data on their servers. The data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS) when processing payment.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          Your purchase transaction data is only used as long as is necessary to complete your purchase transaction. After that is complete, your purchase transaction information is not saved.
                        </p>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">Security Standards</h4>
                          <p className="text-blue-700 text-sm mb-2">
                            Our payment gateway adheres to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, MasterCard, American Express and Discover.
                          </p>
                          <p className="text-blue-700 text-sm">
                            PCI-DSS requirements help ensure the secure handling of credit card information by our store and its service providers.
                          </p>
                          <p className="text-blue-700 text-sm mt-2">
                            For more insight, you may also want to read terms and conditions of razorpay on <a href="https://razorpay.com" className="underline hover:text-blue-800">https://razorpay.com</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 5 - Third-Party Services */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Third-Party Services
                      </h2>
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          In general, the third-party providers used by us will only collect, use and disclose your information to the extent necessary to allow them to perform the services they provide to us.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          However, certain third-party service providers, such as payment gateways and other payment transaction processors, have their own privacy policies in respect to the information we are required to provide to them for your purchase-related transactions.
                        </p>
                        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                          <h4 className="font-semibold text-yellow-800 mb-2">Important Notice</h4>
                          <p className="text-yellow-700 text-sm">
                            For these providers, we recommend that you read their privacy policies so you can understand the manner in which your personal information will be handled by these providers. Remember that certain providers may be located in or have facilities that are located a different jurisdiction than either you or us.
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Links and External Sites</h4>
                          <p className="text-gray-700 text-sm">
                            Once you leave our store's website or are redirected to a third-party website or application, you are no longer governed by this Privacy Policy or our website's Terms of Service. When you click on links on our store, they may direct you away from our site. We are not responsible for the privacy practices of other sites and encourage you to read their privacy statements.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 6 - Security */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Security
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 7 - Cookies */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-pink-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Cookies
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        We use cookies to maintain session of your user. It is not used to personally identify you on other websites.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 8 - Age of Consent */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Age of Consent
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        By using this site, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 9 - Changes to Privacy Policy */}
                <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: "#24392B" }}>
                        Changes to This Privacy Policy
                      </h2>
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">
                          We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.
                        </p>
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <p className="text-blue-700 text-sm">
                            If our store is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to sell products to you.
                          </p>
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
                    <div className="space-y-4">
                      <div className="inline-flex items-center bg-white/10 rounded-full px-6 py-3 backdrop-blur-sm border border-white/20 mr-4">
                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <a 
                          href="mailto:clubskyshot@yahoo.com" 
                          className="text-white hover:text-green-200 transition-colors duration-200 font-medium"
                        >
                          clubskyshot@yahoo.com
                        </a>
                      </div>
                      {/* <div className="text-green-100">
                        <div className="flex items-center justify-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm">British School, Sector-44, Chandigarh- 160047</span>
                        </div>
                      </div> */}
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