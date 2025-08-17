import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw, Search, Trash2, Eye, Upload, ImagePlus, MapPin, Clock, DollarSign, Tag, Star, Edit3, Calendar, Activity } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

/* =========================
   Types
   ========================= */
type Court = {
  _id: string;
  name: string;
  description: string;
  location: string;
  imageUrl?: string;
  price: number;
  activity: string;
  features?: string[];
  createdAt?: string;
  updatedAt?: string;
};

/* =========================
   API Helper
   ========================= */
async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* =========================
   MAIN COMPONENT
   ========================= */
export default function CourtsAdminPage() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState("all");

  // Dialog states
  const [showCreate, setShowCreate] = useState(false);
  const [showView, setShowView] = useState<Court | null>(null);
  const [showDelete, setShowDelete] = useState<Court | null>(null);

  // load data
  const loadCourts = async () => {
    try {
      setLoading(true);
      const data = await api<Court[]>("/courts");
      setCourts(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourts(); }, []);

  const activities = useMemo(() => {
    const unique = new Set(courts.map(c => c.activity));
    return Array.from(unique);
  }, [courts]);

  const filtered = useMemo(() => {
    let result = courts;
    
    if (query.trim()) {
      result = result.filter((c) =>
        [c.name, c.location, c.description, c.activity, ...(c.features || [])].some((v) => 
          (v || "").toLowerCase().includes(query.toLowerCase())
        )
      );
    }
    
    if (selectedActivity !== "all") {
      result = result.filter(c => c.activity === selectedActivity);
    }
    
    return result;
  }, [courts, query, selectedActivity]);

  const handleDelete = async (court: Court) => {
    try {
      await api(`/courts/${court._id}`, { method: "DELETE" });
      setCourts((prev) => prev.filter((c) => c._id !== court._id));
      alert(`Deleted ${court.name}`);
    } catch (e: any) {
      alert(`Failed to delete: ${e.message}`);
    } finally {
      setShowDelete(null);
    }
  };

  const getActivityColor = (activity: string) => {
    const colors: Record<string, string> = {
      'Badminton': 'bg-emerald-500',
      'Tennis': 'bg-blue-500',
      'Basketball': 'bg-orange-500',
      'Football': 'bg-green-500',
      'Volleyball': 'bg-purple-500',
      'Cricket': 'bg-red-500',
      'Table Tennis': 'bg-yellow-500',
    };
    return colors[activity] || 'bg-gray-500';
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-25 to-pink-50">
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Courts Management
              </h1>
              <p className="text-lg text-slate-600">
                Manage your sports facilities with ease and efficiency
              </p>
            </div>
            
            {/* Stats Cards */}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={loadCourts} 
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-xl bg-white/80 hover:bg-white text-slate-700 text-sm font-medium transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> 
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              
              {/* Activity Filter */}
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                className="px-4 py-2.5 border border-slate-300 rounded-xl bg-white/80 text-slate-700 text-sm font-medium transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Activities</option>
                {activities.map(activity => (
                  <option key={activity} value={activity}>{activity}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => setShowCreate(true)} 
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 text-sm font-semibold transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <Plus size={16} /> New Court
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Search */}
        <div className="mb-8">
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courts by name, location, activity, or features..."
              className="w-full pl-12 pr-6 py-4 border border-slate-300 rounded-2xl bg-white/90 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-slate-400 text-slate-700 shadow-sm hover:shadow-md"
            />
          </div>
          {(query || selectedActivity !== "all") && (
            <div className="flex items-center gap-2 mt-3">
              <p className="text-sm text-slate-600">
                Found {filtered.length} court{filtered.length !== 1 ? 's' : ''} 
                {query && ` matching "${query}"`}
                {selectedActivity !== "all" && ` in ${selectedActivity}`}
              </p>
              {(query || selectedActivity !== "all") && (
                <button
                  onClick={() => { setQuery(""); setSelectedActivity("all"); }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-200 border-t-indigo-600"></div>
              <span className="text-lg text-slate-600 font-medium">Loading courts...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">!</span>
              </div>
              <div>
                <strong className="font-semibold">Error occurred</strong>
                <div className="text-sm mt-1">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Courts Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((court) => (
              <div 
                key={court._id} 
                className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-2xl border border-slate-200/60 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:border-indigo-300/50"
              >
                {/* Enhanced Image Section */}
                <div className="relative overflow-hidden">
                  {court.imageUrl ? (
                    <img 
                      src={court.imageUrl} 
                      className="h-56 w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      alt={court.name} 
                    />
                  ) : (
                    <div className="h-56 flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-150 to-slate-200 transition-all duration-500 group-hover:from-indigo-100 group-hover:via-purple-100 group-hover:to-pink-100">
                      <div className="text-center space-y-2">
                        <ImagePlus className="text-slate-400 w-12 h-12 mx-auto transition-colors duration-500 group-hover:text-indigo-400" />
                        <div className="text-xs text-slate-500 font-medium">No image available</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Activity Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`${getActivityColor(court.activity)} text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm`}>
                      {court.activity}
                    </div>
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      ₹{court.price}
                    </div>
                  </div>
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Enhanced Content Section */}
                <div className="p-6 space-y-4">
                  {/* Title Section */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-xl text-slate-800 line-clamp-1 group-hover:text-indigo-700 transition-colors duration-300">
                      {court.name}
                    </h3>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin size={14} className="text-indigo-500 flex-shrink-0" />
                      <span className="text-sm font-medium line-clamp-1">{court.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                    {court.description}
                  </p>

                  {/* Enhanced Features */}
                  {court.features && court.features.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-xs font-semibold text-slate-600">Features</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {court.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200 font-medium">
                            {feature}
                          </span>
                        ))}
                        {court.features.length > 3 && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 font-medium">
                            +{court.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Court ID and Date */}
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                    <div className="font-mono">ID: {court._id.slice(-6)}</div>
                    {court.createdAt && (
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(court.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowView(court)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <Eye size={14} /> View Details
                    </button>
                    <button
                      onClick={() => setShowDelete(court)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
              {query || selectedActivity !== "all" ? (
                <Search className="w-12 h-12 text-indigo-500" />
              ) : (
                <Activity className="w-12 h-12 text-indigo-500" />
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              {query || selectedActivity !== "all" ? 'No courts found' : 'No courts yet'}
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg">
              {query || selectedActivity !== "all" 
                ? `No courts match your current filters. Try adjusting your search criteria.` 
                : "Get started by creating your first court facility to manage bookings and activities."
              }
            </p>
            {(!query && selectedActivity === "all") && (
              <button 
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={20} /> Create First Court
              </button>
            )}
          </div>
        )}
      </main>

      {/* Dialogs */}
      {showCreate && <CreateCourtDialog onClose={() => setShowCreate(false)} onCreated={(c) => setCourts([c, ...courts])} />}
      {showView && <ViewCourtDialog court={showView} onClose={() => setShowView(null)} />}
      {showDelete && <DeleteDialog court={showDelete} onCancel={() => setShowDelete(null)} onConfirm={handleDelete} />}
    </div>
  );
}

/* =========================
   ENHANCED SUB COMPONENTS
   ========================= */

function CreateCourtDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Court) => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [activity, setActivity] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim() || !location.trim() || !price.trim() || !activity.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("description", description);
      form.append("location", location);
      form.append("price", price);
      form.append("activity", activity);
      
      if (featuresText.trim()) {
        const features = featuresText.split(',').map(f => f.trim()).filter(f => f);
        form.append("features", JSON.stringify(features));
      }
      
      if (file) form.append("image", file);

      const res = await fetch(`${BASE_URL}/courts`, { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const created: Court = await res.json();
      onCreated(created);
      onClose();
    } catch (err: any) {
      alert(`Failed to create: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Enhanced Header */}
        <div className="p-8 border-b border-slate-200 flex-shrink-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-3xl">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create New Court
          </h2>
          <p className="text-slate-600 mt-2">Add a new court facility to your management system</p>
        </div>
        
        {/* Enhanced Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Tag size={16} className="text-indigo-500" />
                  Court Name *
                </label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter court name" 
                  className="border border-slate-300 rounded-xl w-full px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-slate-50 focus:bg-white" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin size={16} className="text-indigo-500" />
                  Location *
                </label>
                <input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="Enter location" 
                  className="border border-slate-300 rounded-xl w-full px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-slate-50 focus:bg-white" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Edit3 size={16} className="text-indigo-500" />
                Description *
              </label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter detailed description of the court" 
                rows={4}
                className="border border-slate-300 rounded-xl w-full px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none bg-slate-50 focus:bg-white" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <DollarSign size={16} className="text-indigo-500" />
                  Price (₹) *
                </label>
                <input 
                  type="number"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  placeholder="0.00" 
                  min="0"
                  step="0.01"
                  className="border border-slate-300 rounded-xl w-full px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-slate-50 focus:bg-white" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <Activity size={16} className="text-indigo-500" />
                  Activity *
                </label>
                <select 
                  value={activity} 
                  onChange={(e) => setActivity(e.target.value)} 
                  className="border border-slate-300 rounded-xl w-full px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-slate-50 focus:bg-white"
                >
                  <option value="">Select activity</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Tennis">Tennis</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Football">Football</option>
                  <option value="Volleyball">Volleyball</option>
                  <option value="Cricket">Cricket</option>
                  <option value="Table Tennis">Table Tennis</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Star size={16} className="text-indigo-500" />
                Features
              </label>
              <input 
                value={featuresText} 
                onChange={(e) => setFeaturesText(e.target.value)} 
                placeholder="LED Lighting, Air Conditioning, Parking, Changing Room" 
                className="border border-slate-300 rounded-xl w-full px-4 py-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-slate-50 focus:bg-white" 
              />
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <span>💡</span>
                Separate multiple features with commas
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <ImagePlus size={16} className="text-indigo-500" />
                Court Image
              </label>
              <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-8 hover:border-indigo-400 transition-colors duration-200 bg-indigo-50/50">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:transition-colors file:duration-200 file:font-medium file:shadow-md"
                />
                <p className="text-xs text-slate-500 mt-2 text-center">Upload a high-quality image of your court</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <div className="p-8 border-t border-slate-200 flex-shrink-0 bg-slate-50 rounded-b-3xl">
          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={submitting || !name.trim() || !description.trim() || !location.trim() || !price.trim() || !activity.trim()}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center gap-3 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              <Upload size={16} /> {submitting ? "Creating..." : "Create Court"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewCourtDialog({ court, onClose }: { court: Court; onClose: () => void }) {
  const getActivityColor = (activity: string) => {
    const colors: Record<string, string> = {
      'Badminton': 'from-emerald-500 to-emerald-600',
      'Tennis': 'from-blue-500 to-blue-600',
      'Basketball': 'from-orange-500 to-orange-600',
      'Football': 'from-green-500 to-green-600',
      'Volleyball': 'from-purple-500 to-purple-600',
      'Cricket': 'from-red-500 to-red-600',
      'Table Tennis': 'from-yellow-500 to-yellow-600',
    };
    return colors[activity] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Enhanced Image Header */}
        <div className="relative h-80 flex-shrink-0">
          {court.imageUrl ? (
            <img src={court.imageUrl} className="h-full w-full object-cover" alt={court.name} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-150 to-slate-200">
              <div className="text-center space-y-4">
                <ImagePlus className="text-slate-400 w-16 h-16 mx-auto" />
                <div className="text-lg text-slate-500 font-medium">No image available</div>
              </div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          {/* Activity Badge */}
          <div className="absolute top-6 left-6">
            <div className={`bg-gradient-to-r ${getActivityColor(court.activity)} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
              {court.activity}
            </div>
          </div>
          
          {/* Price Badge */}
          <div className="absolute top-6 right-6">
            <div className="bg-white/90 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-full text-lg font-bold shadow-lg">
              ₹{court.price}
            </div>
          </div>
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h2 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">{court.name}</h2>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin size={18} />
              <span className="text-lg font-medium">{court.location}</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-8">
            {/* Court ID */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-600 font-mono">
                <span>Court ID:</span>
                <span className="font-bold text-slate-800">{court._id}</span>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Edit3 size={20} className="text-indigo-600" />
                <h3 className="text-xl font-bold text-slate-800">Description</h3>
              </div>
              <p className="text-slate-700 leading-relaxed text-lg">{court.description}</p>
            </div>

            {/* Features Section */}
            {court.features && court.features.length > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={20} className="text-emerald-600" />
                  <h3 className="text-xl font-bold text-slate-800">Features & Amenities</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {court.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Details Section */}
            {(court.createdAt || court.updatedAt) && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={20} className="text-blue-600" />
                  <h3 className="text-xl font-bold text-slate-800">Timeline</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {court.createdAt && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <Calendar size={16} />
                        Created
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {new Date(court.createdAt).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}
                  {court.updatedAt && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <RefreshCcw size={16} />
                        Last Updated
                      </div>
                      <div className="text-lg font-bold text-slate-800">
                        {new Date(court.updatedAt).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Enhanced Footer */}
        <div className="p-8 border-t border-slate-200 flex-shrink-0 bg-slate-50">
          <div className="flex justify-end">
            <button 
              onClick={onClose} 
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteDialog({ court, onCancel, onConfirm }: { court: Court; onCancel: () => void; onConfirm: (c: Court) => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="p-8">
          {/* Enhanced Icon and Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center flex-shrink-0">
              <Trash2 size={24} className="text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Delete Court</h2>
              <p className="text-slate-600">This action cannot be undone and will permanently remove all data</p>
            </div>
          </div>
          
          {/* Enhanced Warning */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 leading-relaxed">
              Are you sure you want to delete <strong className="font-bold">"{court.name}"</strong>? 
              This will permanently remove the court and all associated bookings and data from the system.
            </p>
          </div>
          
          {/* Court Summary */}
          <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Location:</span>
              <span className="font-medium text-slate-800">{court.location}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Activity:</span>
              <span className="font-medium text-slate-800">{court.activity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Price:</span>
              <span className="font-medium text-slate-800">₹{court.price}</span>
            </div>
          </div>
          
          {/* Enhanced Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={onCancel} 
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(court)} 
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              Delete Court
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}