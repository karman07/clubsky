import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Clock, DollarSign, Save, X, Search } from 'lucide-react';

import { axiosInstance } from "@/lib/axios";

interface Plan {
  _id?: string;
  hours: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CreatePlanDto {
  hours: number;
  price: number;
}

interface UpdatePlanDto {
  hours?: number;
  price?: number;
}

export const planService = {
  async create(dto: CreatePlanDto): Promise<Plan> {
    const { data } = await axiosInstance.post<Plan>("/plans", dto);
    return data;
  },

  async findAll(): Promise<Plan[]> {
    const { data } = await axiosInstance.get<Plan[]>("/plans");
    return data;
  },

  async findOne(id: string): Promise<Plan> {
    const { data } = await axiosInstance.get<Plan>(`/plans/${id}`);
    return data;
  },

  async update(id: string, dto: UpdatePlanDto): Promise<Plan> {
    const { data } = await axiosInstance.put<Plan>(`/plans/${id}`, dto);
    return data;
  },

  async remove(id: string): Promise<void> {
    await axiosInstance.delete(`/plans/${id}`);
  },
};

const PlanManagementSystem: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<CreatePlanDto>({ hours: 0, price: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPlans();
  }, []);

  useEffect(() => {
    const filtered = plans.filter(plan =>
      plan.hours.toString().includes(searchTerm) ||
      plan.price.toString().includes(searchTerm)
    );
    setFilteredPlans(filtered);
  }, [plans, searchTerm]);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const fetchedPlans = await planService.findAll();
      setPlans(fetchedPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (formData.hours <= 0 || formData.price <= 0) {
      alert('Please enter valid hours and price');
      return;
    }

    setLoading(true);
    try {
      const newPlan = await planService.create(formData);
      setPlans(prev => [...prev, newPlan]);
      setFormData({ hours: 0, price: 0 });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingPlan || formData.hours <= 0 || formData.price <= 0) return;

    setLoading(true);
    try {
      const updatedPlan = await planService.update(editingPlan._id!, formData);
      setPlans(prev => prev.map(plan => 
        plan._id === editingPlan._id ? updatedPlan : plan
      ));
      setEditingPlan(null);
      setFormData({ hours: 0, price: 0 });
    } catch (error) {
      console.error('Error updating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    setLoading(true);
    try {
      await planService.remove(id);
      setPlans(prev => prev.filter(plan => plan._id !== id));
    } catch (error) {
      console.error('Error deleting plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({ hours: plan.hours, price: plan.price });
    setShowCreateForm(false);
  };

  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingPlan(null);
    setFormData({ hours: 0, price: 0 });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Plan Management System
              </h1>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{plans.length}</div>
              <div className="text-sm text-gray-500">Total Plans</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by hours or price..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add New Plan
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingPlan) && (
          <div className="bg-white shadow-sm rounded-lg p-8 mb-8 border-l-4 border-blue-500">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              {editingPlan ? <Edit3 className="w-6 h-6 text-blue-600" /> : <Plus className="w-6 h-6 text-blue-600" />}
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hours *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                  <input
                    type="number"
                    value={formData.hours || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, hours: Number(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter hours"
                    min="1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                  <input
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter price"
                    min="0.01"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={editingPlan ? handleUpdate : handleCreate}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}
              </button>
              
              <button
                onClick={cancelForm}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Plans Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">
              Plans ({filteredPlans.length})
            </h3>
          </div>

          {loading && plans.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-2">Loading plans...</p>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No matching plans found' : 'No plans available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search criteria' : 'Create your first plan to get started'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create First Plan
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Plan ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Hours
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Price per Hour
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Updated At
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPlans.map((plan, index) => (
                    <tr 
                      key={plan._id} 
                      className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {plan._id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm font-semibold text-gray-900">
                            {plan.hours} hrs
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-semibold text-gray-900">
                            ₹
                            {plan.price.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          ₹{(plan.price / plan.hours).toFixed(2)}/hr
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {plan.createdAt ? formatDate(plan.createdAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {plan.updatedAt ? formatDate(plan.updatedAt) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(plan)}
                            className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit Plan"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(plan._id!)}
                            className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                            title="Delete Plan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanManagementSystem;