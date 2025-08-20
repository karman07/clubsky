import React from 'react';
import { FileText, Users, Calendar, Shield, AlertTriangle, Clock, Phone, CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Terms() {
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
          
          {/* Overview Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">OVERVIEW</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>
                By visiting our site and/ or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content.
              </p>
              <p>
                Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.
              </p>
              <p>
                Any new features or tools which are added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
              </p>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="space-y-12">
            
            {/* Section 1 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-4"></div>
                SECTION 1 - ONLINE STORE TERMS
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.</p>
                <p>You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p>
                <p>You must not transmit any worms or viruses or any code of a destructive nature.</p>
                <p>A breach or violation of any of the Terms will result in an immediate termination of your Services.</p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 shadow-lg border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-600 mr-4"></div>
                SECTION 2 - GENERAL CONDITIONS
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
                <p>You understand that your content (not including credit card information), may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.</p>
                <p>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.</p>
                <p>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-3xl p-8 shadow-lg border border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-600 mr-4"></div>
                SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.</p>
                <p>This site may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.</p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-8 shadow-lg border border-orange-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-600 mr-4"></div>
                SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>Prices for our products are subject to change without notice.</p>
                <p>We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
                <p>We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.</p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-3xl p-8 shadow-lg border border-red-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-4"></div>
                SECTION 5 - PRODUCTS OR SERVICES
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
                <p>We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>
                <p>We reserve the right, but are not obligated, to limit the sales of our products or Services to any person, geographic region or jurisdiction. We may exercise this right on a case-by-case basis. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at anytime without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time. Any offer for any product or service made on this site is void where prohibited.</p>
                <p>We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.</p>
              </div>
            </div>

            {/* Section 6 */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-3xl p-8 shadow-lg border border-teal-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-teal-600 mr-4"></div>
                SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. These restrictions may include orders placed by or under the same customer account, the same credit card, and/or orders that use the same billing and/or shipping address. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made. We reserve the right to limit or prohibit orders that, in our sole judgment, appear to be placed by dealers, resellers or distributors.</p>
                <p>You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.</p>
                <p>For more detail, please review our Returns Policy.</p>
              </div>
            </div>

            {/* Section 7 */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-indigo-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-indigo-600 mr-4"></div>
                SECTION 7 - OPTIONAL TOOLS
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.</p>
                <p>You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.</p>
                <p>Any use by you of optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).</p>
                <p>We may also, in the future, offer new services and/or features through the website (including, the release of new tools and resources). Such new features and/or services shall also be subject to these Terms of Service.</p>
              </div>
            </div>

            {/* Section 8 */}
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 shadow-lg border border-rose-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-rose-600 mr-4"></div>
                SECTION 8 - THIRD-PARTY LINKS
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>Certain content, products and services available via our Service may include materials from third-parties.</p>
                <p>Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or services of third-parties.</p>
                <p>We are not liable for any harm or damages related to the purchase or use of goods, services, resources, content, or any other transactions made in connection with any third-party websites. Please review carefully the third-party's policies and practices and make sure you understand them before you engage in any transaction. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.</p>
              </div>
            </div>

            {/* Section 9 */}
            <div className="bg-gradient-to-r from-lime-50 to-green-50 rounded-3xl p-8 shadow-lg border border-lime-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-lime-600 mr-4"></div>
                SECTION 9 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, or otherwise (collectively, 'comments'), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments.</p>
                <p>We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.</p>
                <p>You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your comments will not contain libelous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the Service or any related website. You may not use a false e-mail address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any comments. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party.</p>
              </div>
            </div>

            {/* Section 10 */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-3xl p-8 shadow-lg border border-slate-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-slate-600 mr-4"></div>
                SECTION 10 - PERSONAL INFORMATION
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>Your submission of personal information through the store is governed by our Privacy Policy.</p>
              </div>
            </div>

            {/* Section 11 */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 shadow-lg border border-yellow-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-600 mr-4"></div>
                SECTION 11 - ERRORS, INACCURACIES AND OMISSIONS
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice (including after you have submitted your order).</p>
                <p>We undertake no obligation to update, amend or clarify information in the Service or on any related website, including without limitation, pricing information, except as required by law. No specified update or refresh date applied in the Service or on any related website, should be taken to indicate that all information in the Service or on any related website has been modified or updated.</p>
              </div>
            </div>

            {/* Section 12 */}
            <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-3xl p-8 shadow-lg border border-red-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-600 mr-4"></div>
                SECTION 12 - PROHIBITED USES
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (f) to submit false or misleading information; (g) to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet; (h) to collect or track the personal information of others; (i) to spam, phish, pharm, pretext, spider, crawl, or scrape; (j) for any obscene or immoral purpose; or (k) to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet. We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.</p>
              </div>
            </div>

            {/* Section 13 */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-3xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-600 mr-4"></div>
                SECTION 13 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free.</p>
                <p>We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable.</p>
                <p>You agree that from time to time we may remove the service for indefinite periods of time or cancel the service at any time, without notice to you.</p>
                <p>You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and services delivered to you through the service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, without any representation, warranties or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement.</p>
                <p>In no case shall Club Skyshot Pvt Ltd, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service, or for any other claim related in any way to your use of the service or any product, including, but not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of the service or any content (or product) posted, transmitted, or otherwise made available via the service, even if advised of their possibility. Because some states or jurisdictions do not allow the exclusion or the limitation of liability for consequential or incidental damages, in such states or jurisdictions, our liability shall be limited to the maximum extent permitted by law.</p>
              </div>
            </div>

            {/* Section 14 */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-lg border border-emerald-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-emerald-600 mr-4"></div>
                SECTION 14 - INDEMNIFICATION
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>You agree to indemnify, defend and hold harmless Club Skyshot Pvt Ltd and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.</p>
              </div>
            </div>

            {/* Section 15 */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-3xl p-8 shadow-lg border border-violet-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-violet-600 mr-4"></div>
                SECTION 15 - SEVERABILITY
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.</p>
              </div>
            </div>

            {/* Section 16 */}
            <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 rounded-3xl p-8 shadow-lg border border-fuchsia-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-fuchsia-600 mr-4"></div>
                SECTION 16 - TERMINATION
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.</p>
                <p>These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying us that you no longer wish to use our Services, or when you cease using our site.</p>
                <p>If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly may deny you access to our Services (or any part thereof).</p>
              </div>
            </div>

            {/* Section 17 */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-3xl p-8 shadow-lg border border-sky-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-sky-600 mr-4"></div>
                SECTION 17 - ENTIRE AGREEMENT
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>The failure of us to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.</p>
                <p>These Terms of Service and any policies or operating rules posted by us on this site or in respect to The Service constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).</p>
                <p>Any ambiguities in the interpretation of these Terms of Service shall not be construed against the drafting party.</p>
              </div>
            </div>

            {/* Section 18 */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-8 shadow-lg border border-amber-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-600 mr-4"></div>
                SECTION 18 - GOVERNING LAW
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India and jurisdiction of Rajpura, Punjab</p>
              </div>
            </div>

            {/* Section 19 */}
            <div className="bg-gradient-to-r from-green-50 to-lime-50 rounded-3xl p-8 shadow-lg border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-600 mr-4"></div>
                SECTION 19 - CHANGES TO TERMS OF SERVICE
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>You can review the most current version of the Terms of Service at any time at this page.</p>
                <p>We reserve the right, at our sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check our website periodically for changes. Your continued use of or access to our website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.</p>
              </div>
            </div>


          </div>

          {/* Effective Date & Updates */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg mt-16 mb-16">
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