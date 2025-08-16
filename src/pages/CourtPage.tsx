import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCcw, Search, Trash2, Eye, Upload, ImagePlus, MapPin } from "lucide-react";

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

  const filtered = useMemo(() => {
    if (!query.trim()) return courts;
    return courts.filter((c) =>
      [c.name, c.location, c.description, c.activity, ...(c.features || [])].some((v) => 
        (v || "").toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [courts, query]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 p-6 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Courts Management</h1>
            <p className="text-slate-600 text-sm mt-1">Manage and organize your court facilities</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={loadCourts} 
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all duration-200 hover:shadow-sm"
            >
              <RefreshCcw size={16} /> Refresh
            </button>
            <button 
              onClick={() => setShowCreate(true)} 
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white hover:bg-slate-800 text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:scale-105"
            >
              <Plus size={16} /> New Court
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Enhanced Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courts by name, location, or description..."
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400 text-slate-700 shadow-sm"
            />
          </div>
          {query && (
            <p className="text-sm text-slate-600 mt-2">
              Found {filtered.length} court{filtered.length !== 1 ? 's' : ''} matching "{query}"
            </p>
          )}
        </div>

        {/* Loading/Error States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-slate-600">Loading courts...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Enhanced Courts Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((court) => (
              <div 
                key={court._id} 
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/50 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-blue-300/50"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  {court.imageUrl ? (
                    <img 
                      src={court.imageUrl} 
                      className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-110" 
                      alt={court.name} 
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 transition-colors duration-300 group-hover:from-slate-200 group-hover:to-slate-300">
                      <ImagePlus className="text-slate-400 w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Title and Location */}
                  <div className="mb-3">
                    <h3 className="font-semibold text-lg text-slate-800 mb-1 line-clamp-1">
                      {court.name}
                    </h3>
                    <div className="text-xs text-slate-400 mb-2 font-mono">
                      ID: {court._id}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-slate-500">
                        <MapPin size={14} className="text-blue-500" />
                        <span className="text-sm font-medium">{court.location}</span>
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        ${court.price}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block">
                      {court.activity}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">
                    {court.description}
                  </p>

                  {/* Features */}
                  {court.features && court.features.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {court.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {court.features.length > 3 && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                            +{court.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  {court.createdAt && (
                    <div className="text-xs text-slate-400 mb-4">
                      Created {new Date(court.createdAt).toLocaleDateString()}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowView(court)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-all duration-200"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      onClick={() => setShowDelete(court)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all duration-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No courts found</h3>
            <p className="text-slate-600 mb-6">
              {query ? `No courts match "${query}". Try adjusting your search.` : "Get started by creating your first court."}
            </p>
            {!query && (
              <button 
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-slate-800 transition-colors duration-200"
              >
                <Plus size={16} /> Create First Court
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
   SUB COMPONENTS
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Fixed Header */}
        <div className="p-6 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">Create New Court</h2>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Court Name *</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter court name" 
                className="border border-slate-300 rounded-lg w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Enter description" 
                rows={3}
                className="border border-slate-300 rounded-lg w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
              <input 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Enter location" 
                className="border border-slate-300 rounded-lg w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price *</label>
                <input 
                  type="number"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  placeholder="0.00" 
                  min="0"
                  step="0.01"
                  className="border border-slate-300 rounded-lg w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Activity *</label>
                <input 
                  value={activity} 
                  onChange={(e) => setActivity(e.target.value)} 
                  placeholder="e.g. Basketball" 
                  className="border border-slate-300 rounded-lg w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Features</label>
              <input 
                value={featuresText} 
                onChange={(e) => setFeaturesText(e.target.value)} 
                placeholder="Enter features separated by commas (e.g. Lights, Covered, Parking)" 
                className="border border-slate-300 rounded-lg w-full px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
              />
              <p className="text-xs text-slate-500 mt-1">Separate multiple features with commas</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Court Image</label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 hover:border-blue-400 transition-colors duration-200">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors file:duration-200"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Footer */}
        <div className="p-6 border-t border-slate-200 flex-shrink-0">
          <div className="flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit}
              disabled={submitting || !name.trim() || !description.trim() || !location.trim() || !price.trim() || !activity.trim()} 
              className="px-4 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <Upload size={14} /> {submitting ? "Creating..." : "Create Court"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewCourtDialog({ court, onClose }: { court: Court; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
        {court.imageUrl && (
          <div className="relative">
            <img src={court.imageUrl} className="h-64 w-full object-cover" alt={court.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        )}
        
        <div className="p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{court.name}</h2>
              <div className="text-xs text-slate-400 mb-3 font-mono">
                ID: {court._id}
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={16} className="text-blue-500" />
                  <span className="font-medium">{court.location}</span>
                </div>
                <div className="text-lg font-bold text-green-600">
                  ${court.price}
                </div>
                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  {court.activity}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Description</h4>
            <p className="text-slate-600 leading-relaxed">{court.description}</p>
          </div>

          {court.features && court.features.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Features</h4>
              <div className="flex flex-wrap gap-2">
                {court.features.map((feature, idx) => (
                  <span key={idx} className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {(court.createdAt || court.updatedAt) && (
            <div className="border-t border-slate-200 pt-4 mb-6">
              <h4 className="text-sm font-semibold text-slate-700 mb-2">Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                {court.createdAt && (
                  <div>
                    <span className="font-medium">Created:</span><br />
                    {new Date(court.createdAt).toLocaleString()}
                  </div>
                )}
                {court.updatedAt && (
                  <div>
                    <span className="font-medium">Updated:</span><br />
                    {new Date(court.updatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <button 
              onClick={onClose} 
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium"
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 size={20} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Delete Court</h2>
              <p className="text-sm text-slate-600">This action cannot be undone</p>
            </div>
          </div>
          
          <p className="text-slate-700 mb-6">
            Are you sure you want to delete <strong className="text-slate-800">"{court.name}"</strong>? 
            All associated data will be permanently removed.
          </p>
          
          <div className="flex justify-end gap-3">
            <button 
              onClick={onCancel} 
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              onClick={() => onConfirm(court)} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              Delete Court
            </button>
            </div>
        </div>
      </div>
    </div>
  );
}