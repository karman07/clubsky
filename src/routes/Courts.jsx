import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, MicOff, MapPin, Grid, List, Filter } from 'lucide-react';
import { useCourtContext } from '../context/CourtContext'; 

const BeautifulCourtsUI = () => {
  const { courts, loading } = useCourtContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [filteredCourts, setFilteredCourts] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('all');
  const recognitionRef = useRef(null);

  // Get unique activities from courts data
  const activities = ['all', ...new Set(courts.map(court => court.activity))];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Filter courts based on search and activity
  useEffect(() => {
    if (!courts.length) return;
    
    let filtered = courts;

    if (selectedActivity !== 'all') {
      filtered = filtered.filter(court => court.activity === selectedActivity);
    }

    if (searchTerm) {
      filtered = filtered.filter(court =>
        court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        court.activity.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCourts(filtered);
  }, [searchTerm, selectedActivity, courts]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-4 rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: '#24392B' }}></div>
          <p className="text-gray-600 text-lg">Loading courts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <div className="relative overflow-hidden py-20 px-6" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-5" style={{ backgroundColor: '#24392B' }}></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-5" style={{ backgroundColor: '#24392B' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <h1 className="text-6xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 50%, #1a2920 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Premium Sports Courts
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover and book world-class sports facilities with state-of-the-art equipment and amenities
          </p>

          {/* Advanced Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300" style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search courts by name, location, or activity..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-16 py-4 text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none transition-all duration-300 text-lg"
                      style={{ focusBorderColor: '#24392B' }}
                      onFocus={(e) => e.target.style.borderColor = '#24392B'}
                      onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    />
                    <button
                      onClick={isListening ? stopListening : startListening}
                      className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 text-white ${
                        isListening 
                          ? 'bg-red-500 animate-pulse' 
                          : 'hover:opacity-90'
                      }`}
                      style={{ backgroundColor: isListening ? '#ef4444' : '#24392B' }}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Activity Filter */}
                <div className="flex flex-wrap gap-3">
                  {activities.map((activity) => (
                    <button
                      key={activity}
                      onClick={() => setSelectedActivity(activity)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 capitalize ${
                        selectedActivity === activity
                          ? 'text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                      style={{
                        background: selectedActivity === activity ? 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' : undefined
                      }}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header with View Toggle */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-4xl font-bold mb-2" style={{ color: '#24392B' }}>
                Available Courts
              </h2>
              <p className="text-gray-600 text-lg">
                {filteredCourts.length} courts found
              </p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' ? 'text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{ backgroundColor: viewMode === 'grid' ? '#24392B' : 'transparent' }}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
                }`}
                style={{ backgroundColor: viewMode === 'list' ? '#24392B' : 'transparent' }}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Courts Grid/List */}
          <div className={`grid gap-8 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredCourts.map((court) => (
              <div
                key={court.id}
                className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-200"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {court.imageUrl ? (
                    <img
                      src={court.imageUrl}
                      alt={court.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold" style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}>
                      {court.name.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute top-4 right-4 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg" style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}>
                    {court.activity}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 group-hover:opacity-80 transition-all duration-300" style={{ color: '#24392B' }}>
                    {court.name}
                  </h3>
                  <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    {court.description}
                  </p>

                  <div className="flex items-center gap-2 mb-6" style={{ color: '#24392B' }}>
                    <MapPin className="w-5 h-5" />
                    <span className="text-base">{court.location}</span>
                  </div>

                  {/* Features */}
                  {court.features && court.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {court.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                      {court.features.length > 3 && (
                        <span className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium">
                          +{court.features.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price and Book Button */}
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold" style={{ color: '#24392B' }}>
                      ₹{court.price}
                      <span className="text-lg text-gray-500 font-normal">/hour</span>
                    </div>
                    <button className="text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}>
                      Book Now
                    </button>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent group-hover:from-green-50/20 group-hover:to-transparent transition-all duration-500 pointer-events-none rounded-2xl"></div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredCourts.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold mb-4" style={{ color: '#24392B' }}>No courts found</h3>
              <p className="text-gray-500 text-lg mb-6">Try adjusting your search criteria or browse all courts</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedActivity('all');
                }}
                className="text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #24392B 0%, #2d4735 100%)' }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeautifulCourtsUI;