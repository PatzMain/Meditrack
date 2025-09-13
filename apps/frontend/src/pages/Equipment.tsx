import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Wrench, AlertTriangle, TrendingUp, Eye, Edit, Archive, Calendar, MapPin, Shield, CheckCircle, XCircle, Plus, Search, Filter, ChevronUp, ChevronDown, Package, X } from 'lucide-react';
import { mockMedicalEquipment, mockDentalEquipment } from '../lib/mockData';
import { RecentLogs } from '../components/RecentLogs';

const Equipment = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'medical' | 'dental'>('medical');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewEquipment, setViewEquipment] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [editEquipment, setEditEquipment] = useState<any>(null);
  const [archiveEquipment, setArchiveEquipment] = useState<any>(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    location: '',
    warrantyStatus: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [highlightedId, setHighlightedId] = useState<string>('');
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Initialize equipment data from mock data
  useEffect(() => {
    const allEquipment = [...mockMedicalEquipment, ...mockDentalEquipment];
    setEquipment(allEquipment);
  }, []);

  // Get current data based on active tab
  const currentData = equipment.filter(item => item.department === activeTab);
  
  // Get unique values for filters
  const uniqueCategories = [...new Set(currentData.map(equipment => equipment.category))];
  const uniqueLocations = [...new Set(currentData.map(equipment => equipment.location).filter(Boolean))];
  const uniqueStatuses = [...new Set(currentData.map(equipment => equipment.status))];
  
  // Sort function
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort equipment based on search term, filters, and sorting
  const sortedAndFilteredEquipment = useMemo(() => {
    let filtered = currentData;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(equipment =>
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.equipment_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(equipment => equipment.category === filters.category);
    }
    
    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(equipment => equipment.status === filters.status);
    }
    
    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(equipment => equipment.location === filters.location);
    }
    
    // Apply warranty status filter
    if (filters.warrantyStatus === 'expiring') {
      filtered = filtered.filter(equipment => {
        if (!equipment.warranty_expiry) return false;
        const warranty = new Date(equipment.warranty_expiry);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((warranty.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
      });
    } else if (filters.warrantyStatus === 'expired') {
      filtered = filtered.filter(equipment => {
        if (!equipment.warranty_expiry) return false;
        const warranty = new Date(equipment.warranty_expiry);
        const today = new Date();
        return warranty < today;
      });
    } else if (filters.warrantyStatus === 'active') {
      filtered = filtered.filter(equipment => {
        if (!equipment.warranty_expiry) return false;
        const warranty = new Date(equipment.warranty_expiry);
        const today = new Date();
        return warranty > today;
      });
    }
    
    // Apply sorting
    if (sortField) {
      filtered.sort((a: any, b: any) => {
        let aValue = a[sortField];
        let bValue = b[sortField];
        
        // Handle different data types
        if (sortField === 'warranty_expiry' || sortField === 'last_maintenance' || sortField === 'purchase_date') {
          aValue = aValue ? new Date(aValue) : new Date(0);
          bValue = bValue ? new Date(bValue) : new Date(0);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (sortDirection === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }
    
    return filtered;
  }, [searchTerm, currentData, filters, sortField, sortDirection]);

  // Calculate statistics for current tab
  const activeCount = currentData.filter(e => e.status === 'active').length;
  const maintenanceCount = currentData.filter(e => e.status === 'maintenance').length;
  const outOfOrderCount = currentData.filter(e => e.status === 'out_of_order').length;
  
  const isWarrantyExpiring = (warrantyDate: string) => {
    if (!warrantyDate) return false;
    const warranty = new Date(warrantyDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((warranty.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
  };

  const warrantyExpiringCount = currentData.filter(e => e.warranty_expiry && isWarrantyExpiring(e.warranty_expiry)).length;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'out_of_order':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4" />;
      case 'out_of_order':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const handleView = (equipment: any) => {
    setViewEquipment(equipment);
  };

  const handleEdit = (equipment: any) => {
    console.log('Edit equipment:', equipment);
    // TODO: Implement edit functionality
    alert('Edit functionality will be implemented here');
  };

  const handleArchive = (equipment: any) => {
    if (window.confirm(`Are you sure you want to archive ${equipment.name}?`)) {
      console.log('Archive equipment:', equipment);
      // TODO: Implement archive functionality
      alert('Archive functionality will be implemented here');
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search Result Notification */}
        {highlightedId && (
          <div className="bg-yellow-100 border border-yellow-200 rounded-2xl px-6 py-4 shadow-lg">
            <div className="flex items-center space-x-3 text-yellow-800">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="font-semibold text-sm">Search Result Found</p>
                <p className="text-xs text-yellow-700">The item you searched for is highlighted in the table below.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight">🔧 Equipment Inventory</h1>
                <p className="text-purple-100 text-lg">Comprehensive medical and dental equipment management system</p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Wrench className="h-16 w-16 text-white/90 mx-auto mb-2" />
                  <p className="text-sm text-purple-100 text-center">Smart Tracking</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-20">
            <Wrench className="h-32 w-32 text-white" />
          </div>
        </div>

        {/* Department Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('medical')}
              className={`group flex-1 px-8 py-6 rounded-2xl font-bold text-lg transition-all duration-500 transform ${
                activeTab === 'medical'
                  ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white shadow-2xl scale-105 shadow-purple-500/25'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 hover:text-purple-700 hover:scale-102'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`p-2 rounded-xl ${
                  activeTab === 'medical' ? 'bg-white/20' : 'bg-purple-100 text-purple-600 group-hover:bg-purple-200'
                }`}>
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <div>Medical Equipment</div>
                  <div className={`text-sm font-normal ${
                    activeTab === 'medical' ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {equipment.filter(e => e.department === 'medical').length} items
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('dental')}
              className={`group flex-1 px-8 py-6 rounded-2xl font-bold text-lg transition-all duration-500 transform ${
                activeTab === 'dental'
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-2xl scale-105 shadow-indigo-500/25'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50 hover:text-indigo-700 hover:scale-102'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`p-2 rounded-xl ${
                  activeTab === 'dental' ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200'
                }`}>
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <div>Dental Equipment</div>
                  <div className={`text-sm font-normal ${
                    activeTab === 'dental' ? 'text-indigo-100' : 'text-gray-500'
                  }`}>
                    {equipment.filter(e => e.department === 'dental').length} items
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 p-6 rounded-3xl shadow-2xl border border-purple-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-purple-600 mb-2 uppercase tracking-wider">Total Equipment</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{currentData.length}</p>
                <p className="text-xs text-purple-600 font-semibold">Active equipment</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-purple-500/25">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-purple-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-green-50 p-6 rounded-3xl shadow-2xl border border-green-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-green-600 mb-2 uppercase tracking-wider">Active Equipment</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{activeCount}</p>
                <p className="text-xs text-green-600 font-semibold">Operational</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-green-500/25">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-yellow-50 p-6 rounded-3xl shadow-2xl border border-yellow-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-yellow-600 mb-2 uppercase tracking-wider">Maintenance</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{maintenanceCount}</p>
                <p className="text-xs text-yellow-600 font-semibold">Under repair</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-yellow-500/25">
                  <AlertTriangle className="h-8 w-8 text-white animate-pulse" />
                </div>
                {maintenanceCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-400 rounded-full animate-bounce"></div>
                )}
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-red-50 p-6 rounded-3xl shadow-2xl border border-red-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-red-600 mb-2 uppercase tracking-wider">Warranty Expiring</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{warrantyExpiringCount}</p>
                <p className="text-xs text-red-600 font-semibold">Within 90 days</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-red-500/25">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                {warrantyExpiringCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Logs */}
        <RecentLogs resourceType="equipment" />

        {/* Filters and Add Button */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Search className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Smart Search & Filters</h3>
                  <p className="text-sm text-gray-600">Find and filter equipment instantly</p>
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-3 px-6 py-3 text-sm font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  showFilters 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-indigo-100 hover:to-purple-100 hover:text-indigo-700'
                }`}
              >
                <Filter className="h-5 w-5" />
                <span>Advanced Filters</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-400"
            >
              <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Add New Equipment</div>
                <div className="text-xs text-purple-100">{activeTab === 'medical' ? 'Medical' : 'Dental'} Department</div>
              </div>
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-300" />
              </div>
              <input
                type="text"
                className="block w-full pl-14 pr-6 py-5 border-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white text-gray-900 placeholder-gray-500 rounded-2xl text-lg leading-5 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
                placeholder="🔍 Search equipment by name, code, category, manufacturer, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-indigo-100 animate-in slide-in-from-top-5 duration-500">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                >
                  <option value="">All Statuses</option>
                  {uniqueStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Warranty Status</label>
                <select
                  value={filters.warrantyStatus}
                  onChange={(e) => setFilters({ ...filters, warrantyStatus: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-200"
                >
                  <option value="">All Warranties</option>
                  <option value="active">Active Warranty</option>
                  <option value="expiring">Expiring Soon (90 days)</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              
              <div className="lg:col-span-4 flex justify-between items-center mt-6 pt-4 border-t border-indigo-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setFilters({ category: '', status: '', location: '', warrantyStatus: '' })}
                    className="flex items-center space-x-2 px-6 py-3 text-sm font-bold text-indigo-600 hover:text-white bg-white hover:bg-indigo-600 border-2 border-indigo-600 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear All Filters</span>
                  </button>
                  <div className="px-4 py-2 bg-white/60 rounded-xl border border-indigo-200">
                    <div className="text-sm font-bold text-indigo-700">
                      Showing {sortedAndFilteredEquipment.length} of {currentData.length} equipment
                    </div>
                  </div>
                </div>
                <div className="text-xs text-indigo-600 font-semibold">
                  🔍 Real-time filtering active
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Equipment Table */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={
                  `p-3 rounded-2xl shadow-lg ${activeTab === 'medical' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`
                }>
                  <Wrench className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'medical' ? 'Medical' : 'Dental'} Equipment Inventory
                  </h3>
                  <p className="text-sm text-gray-600">Complete equipment catalog with real-time status tracking</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{sortedAndFilteredEquipment.length}</div>
                <div className="text-sm text-gray-600">Active equipment</div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto divide-y divide-gray-200">
              <thead className={`bg-gradient-to-r ${
                activeTab === 'medical' 
                  ? 'from-purple-50 via-pink-50 to-indigo-50' 
                  : 'from-indigo-50 via-purple-50 to-pink-50'
              }`}>
                <tr>
                  <th className="px-8 py-6 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('equipment_code')}
                      className="group flex items-center justify-center space-x-2 hover:text-purple-600 transition-all duration-200 font-bold w-full"
                    >
                      <span className="group-hover:scale-105 transition-transform">Equipment Code</span>
                      {sortField === 'equipment_code' && (
                        <div className="animate-bounce">
                          {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-purple-600" /> : <ChevronDown className="h-4 w-4 text-purple-600" />}
                        </div>
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('name')}
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                    >
                      <span>Equipment</span>
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('status')}
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                    >
                      <span>Status</span>
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('location')}
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                    >
                      <span>Location</span>
                      {sortField === 'location' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('warranty_expiry')}
                      className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                    >
                      <span>Warranty</span>
                      {sortField === 'warranty_expiry' && (
                        sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        <p className="text-gray-500">Loading equipment...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <p className="text-red-600">Error: {error}</p>
                        <button
                          onClick={() => window.location.reload()}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : sortedAndFilteredEquipment.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Wrench className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">No equipment found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : sortedAndFilteredEquipment.map((equipment, index) => {
                  const isHighlighted = highlightedId === `${activeTab}-${equipment.id}`;
                  return (
                  <tr key={equipment.id} className={`group hover:bg-gradient-to-r transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                    activeTab === 'medical' 
                      ? 'hover:from-purple-50 hover:to-pink-50 hover:shadow-purple-100' 
                      : 'hover:from-indigo-50 hover:to-purple-50 hover:shadow-indigo-100'
                  } ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'} ${
                    isHighlighted ? 'bg-yellow-100 border-2 border-yellow-300 shadow-lg ring-2 ring-yellow-300 ring-opacity-50' : ''
                  }`}>
                    <td className="px-8 py-6 whitespace-nowrap text-center">
                      <div className="flex justify-center">
                        <span className={`group-hover:scale-105 transition-transform inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
                          activeTab === 'medical' 
                            ? 'bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 text-purple-800 group-hover:shadow-purple-200'
                            : 'bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 text-indigo-800 group-hover:shadow-indigo-200'
                        }`}>
                          {equipment.equipment_code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mr-4">
                          <Wrench className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{equipment.name}</div>
                          <div className="text-xs text-gray-500">{equipment.category}</div>
                          <div className="text-xs text-gray-400">{equipment.manufacturer || 'No manufacturer'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(equipment.status)}`}>
                          {getStatusIcon(equipment.status)}
                          <span className="ml-1 capitalize">{equipment.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        {equipment.location || 'Not specified'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">
                        {equipment.warranty_expiry ? (
                          <div className={`${isWarrantyExpiring(equipment.warranty_expiry) ? 'text-red-600 font-semibold' : ''}`}>
                            {new Date(equipment.warranty_expiry).toLocaleDateString()}
                            {isWarrantyExpiring(equipment.warranty_expiry) && (
                              <div className="text-xs text-orange-500">Expiring soon</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No warranty</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleView(equipment)}
                          className="group/btn relative p-3 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                          <div className="absolute -inset-1 bg-blue-600 rounded-xl opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                        </button>
                        <button
                          onClick={() => {
                            setEditEquipment(equipment);
                            setShowEditModal(true);
                          }}
                          className="group/btn relative p-3 text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/25"
                          title="Edit Equipment"
                        >
                          <Edit className="h-5 w-5" />
                          <div className="absolute -inset-1 bg-emerald-600 rounded-xl opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                        </button>
                        <button
                          onClick={() => {
                            setArchiveEquipment(equipment);
                            setShowArchiveModal(true);
                          }}
                          className="group/btn relative p-3 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
                          title="Archive Equipment"
                        >
                          <Archive className="h-5 w-5" />
                          <div className="absolute -inset-1 bg-red-600 rounded-xl opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {sortedAndFilteredEquipment.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-xl font-semibold mb-2">No equipment found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="bg-gradient-to-r from-white via-gray-50 to-white px-8 py-6 rounded-3xl shadow-2xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={
                activeTab === 'medical' 
                  ? 'p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600' 
                  : 'p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600'
              }>
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  Showing {sortedAndFilteredEquipment.length} of {currentData.length} {activeTab} equipment
                </div>
                <div className="text-sm text-gray-600">
                  {searchTerm ? `Filtered results for "${searchTerm}"` : 'Complete inventory listing'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last updated</div>
              <div className="text-sm font-semibold text-gray-700">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Add Equipment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New {activeTab === 'medical' ? 'Medical' : 'Dental'} Equipment</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                
                const newEquipment = {
                  equipment_code: formData.get('equipment_code') as string,
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  category: formData.get('category') as string,
                  department: activeTab,
                  manufacturer: formData.get('manufacturer') as string,
                  model: formData.get('model') as string,
                  serial_number: formData.get('serial_number') as string,
                  location: formData.get('location') as string,
                  status: formData.get('status') as string,
                  purchase_date: formData.get('purchase_date') as string,
                  warranty_expiry: formData.get('warranty_expiry') as string,
                  purchase_cost: parseFloat(formData.get('purchase_cost') as string)
                };
                
                console.log(`${newEquipment.name} has been added successfully!`);
                setShowAddModal(false);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment Code *</label>
                    <input
                      type="text"
                      name="equipment_code"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., EQP-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Digital X-Ray Machine"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="Brief description of the equipment"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      {activeTab === 'medical' ? (
                        <>
                          <option value="Diagnostic Equipment">Diagnostic Equipment</option>
                          <option value="Surgical Equipment">Surgical Equipment</option>
                          <option value="Life Support Equipment">Life Support Equipment</option>
                          <option value="Laboratory Equipment">Laboratory Equipment</option>
                          <option value="Monitoring Equipment">Monitoring Equipment</option>
                        </>
                      ) : (
                        <>
                          <option value="Dental Chairs">Dental Chairs</option>
                          <option value="Imaging Equipment">Imaging Equipment</option>
                          <option value="Sterilization Equipment">Sterilization Equipment</option>
                          <option value="Handpieces">Handpieces</option>
                          <option value="Dental Instruments">Dental Instruments</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                    <select
                      name="status"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="out_of_order">Out of Order</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Philips Healthcare"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      name="model"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., DRX-Revolution"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Serial Number</label>
                    <input
                      type="text"
                      name="serial_number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., XR2025001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Room 101"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Purchase Date</label>
                    <input
                      type="date"
                      name="purchase_date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Warranty Expiry</label>
                    <input
                      type="date"
                      name="warranty_expiry"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Purchase Cost</label>
                    <input
                      type="number"
                      name="purchase_cost"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 25000.00"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Equipment</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Equipment Modal */}
        {showEditModal && editEquipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit {editEquipment.name}</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditEquipment(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                
                const updatedData = {
                  equipment_code: formData.get('equipment_code') as string,
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  category: formData.get('category') as string,
                  manufacturer: formData.get('manufacturer') as string,
                  model: formData.get('model') as string,
                  serial_number: formData.get('serial_number') as string,
                  location: formData.get('location') as string,
                  status: formData.get('status') as string,
                  purchase_date: formData.get('purchase_date') as string,
                  warranty_expiry: formData.get('warranty_expiry') as string,
                  purchase_cost: parseFloat(formData.get('purchase_cost') as string)
                };
                
                console.log('Equipment updated successfully!');
                setShowEditModal(false);
                setEditEquipment(null);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment Code *</label>
                    <input
                      type="text"
                      name="equipment_code"
                      defaultValue={editEquipment.equipment_code}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment Name *</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editEquipment.name}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editEquipment.description}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      defaultValue={editEquipment.category}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      {activeTab === 'medical' ? (
                        <>
                          <option value="Diagnostic Equipment">Diagnostic Equipment</option>
                          <option value="Surgical Equipment">Surgical Equipment</option>
                          <option value="Life Support Equipment">Life Support Equipment</option>
                          <option value="Laboratory Equipment">Laboratory Equipment</option>
                          <option value="Monitoring Equipment">Monitoring Equipment</option>
                        </>
                      ) : (
                        <>
                          <option value="Dental Chairs">Dental Chairs</option>
                          <option value="Imaging Equipment">Imaging Equipment</option>
                          <option value="Sterilization Equipment">Sterilization Equipment</option>
                          <option value="Handpieces">Handpieces</option>
                          <option value="Dental Instruments">Dental Instruments</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                    <select
                      name="status"
                      defaultValue={editEquipment.status}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="out_of_order">Out of Order</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Manufacturer</label>
                    <input
                      type="text"
                      name="manufacturer"
                      defaultValue={editEquipment.manufacturer}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      name="model"
                      defaultValue={editEquipment.model}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Serial Number</label>
                    <input
                      type="text"
                      name="serial_number"
                      defaultValue={editEquipment.serial_number}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={editEquipment.location}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Purchase Date</label>
                    <input
                      type="date"
                      name="purchase_date"
                      defaultValue={editEquipment.purchase_date ? editEquipment.purchase_date.split('T')[0] : ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Warranty Expiry</label>
                    <input
                      type="date"
                      name="warranty_expiry"
                      defaultValue={editEquipment.warranty_expiry ? editEquipment.warranty_expiry.split('T')[0] : ''}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Purchase Cost</label>
                    <input
                      type="number"
                      name="purchase_cost"
                      defaultValue={editEquipment.purchase_cost}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditEquipment(null);
                    }}
                    className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Edit className="h-5 w-5" />
                    <span>Update Equipment</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Equipment Modal */}
        {viewEquipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-4 shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Equipment Details</h3>
                <button
                  onClick={() => setViewEquipment(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Equipment Name</label>
                    <p className="text-lg text-gray-900 mt-1">{viewEquipment.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Equipment Code</label>
                    <p className="text-lg text-gray-900 mt-1">{viewEquipment.equipment_code}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Category</label>
                    <p className="text-lg text-gray-900 mt-1">{viewEquipment.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(viewEquipment.status)}`}>
                        {getStatusIcon(viewEquipment.status)}
                        <span className="ml-1 capitalize">{viewEquipment.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Manufacturer</label>
                    <p className="text-lg text-gray-900 mt-1">{viewEquipment.manufacturer || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Location</label>
                    <p className="text-lg text-gray-900 mt-1">{viewEquipment.location || 'Not specified'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Purchase Date</label>
                    <p className="text-lg text-gray-900 mt-1">
                      {viewEquipment.purchase_date ? new Date(viewEquipment.purchase_date).toLocaleDateString() : 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Warranty Expiry</label>
                    <p className={`text-lg mt-1 ${viewEquipment.warranty_expiry && isWarrantyExpiring(viewEquipment.warranty_expiry) ? 'text-red-600 font-semibold' : 'text-gray-900'}`}>
                      {viewEquipment.warranty_expiry ? new Date(viewEquipment.warranty_expiry).toLocaleDateString() : 'No warranty'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <p className="text-lg text-gray-900 mt-1">{viewEquipment.description || 'No description available'}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setViewEquipment(null)}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setEditEquipment(viewEquipment);
                    setShowEditModal(true);
                    setViewEquipment(null);
                  }}
                  className="px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                >
                  Edit Equipment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Archive Confirmation Modal */}
        {showArchiveModal && archiveEquipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300">
              <div className="text-center">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-6">
                  <Archive className="h-6 w-6 text-red-600" />
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Archive Equipment
                </h3>
                
                {/* Message */}
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to archive <span className="font-semibold text-gray-900">"{archiveEquipment.name}"</span>? This action will remove the equipment from the active inventory.
                </p>
                
                {/* Equipment Details Card */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Wrench className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{archiveEquipment.name}</p>
                      <p className="text-sm text-gray-600">{archiveEquipment.category}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-gray-900 ml-1 capitalize">{archiveEquipment.status.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900 ml-1">{archiveEquipment.location || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowArchiveModal(false);
                      setArchiveEquipment(null);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log(`${archiveEquipment.name} has been archived successfully!`);
                      setShowArchiveModal(false);
                      setArchiveEquipment(null);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 transition-colors duration-200"
                  >
                    Archive Equipment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Equipment;