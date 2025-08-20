import { useState, useEffect } from 'react';
import { Users, Clock, DollarSign, Phone, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { BASE_URL } from '@/constants/constants';

interface Membership {
  id?: string;
  name: string;
  phone: string;
  hours: number;
  price: number;
}

const MembershipsPage = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'hours' | 'price'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Fetch memberships from API
  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/memberships`);
        if (!response.ok) {
          throw new Error('Failed to fetch memberships');
        }
        const data = await response.json();
        setMemberships(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const filteredAndSortedMemberships = memberships
    .filter(membership => 
      membership.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membership.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * multiplier;
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * multiplier;
      }
      
      return 0;
    });

  const totalMembers = memberships.length;
  const totalRevenue = memberships.reduce((sum, m) => sum + m.price, 0);
  const avgHours = memberships.length > 0 ? Math.round(memberships.reduce((sum, m) => sum + m.hours, 0) / memberships.length) : 0;

  const handleSort = (field: 'name' | 'hours' | 'price') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field: 'name' | 'hours' | 'price') => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading memberships...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error Loading Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Members</p>
                <p className="text-2xl font-bold text-blue-900">{totalMembers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-700">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Avg Hours</p>
                <p className="text-2xl font-bold text-purple-700">{avgHours}h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Memberships Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th 
                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-800 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Phone
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-800 transition-colors"
                    onClick={() => handleSort('hours')}
                  >
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Hours
                      {getSortIcon('hours')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left font-semibold cursor-pointer hover:bg-blue-800 transition-colors"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Price
                      {getSortIcon('price')}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Rate/Hour</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedMemberships.map((membership, index) => (
                  <tr 
                    key={membership.id || index} 
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{membership.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-blue-600 font-medium">{membership.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {membership.hours}h
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        ${membership.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-blue-700 font-semibold">
                        ${(membership.price / membership.hours).toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedMemberships.length === 0 && !loading && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No memberships found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria' : 'No membership data available'}
              </p>
            </div>
          )}
        </div>

        {/* Table Info */}
        {filteredAndSortedMemberships.length > 0 && (
          <div className="mt-4 text-center text-gray-600">
            Showing {filteredAndSortedMemberships.length} of {totalMembers} memberships
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipsPage;