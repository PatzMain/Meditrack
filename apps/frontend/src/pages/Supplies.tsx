import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus, Search, AlertTriangle, Archive, TrendingUp, Filter, Eye, Edit, X, ChevronUp, ChevronDown, Package, Calendar } from 'lucide-react';
import { mockMedicalSupplies, mockDentalSupplies } from '../lib/mockData';
import { RecentLogs } from '../components/RecentLogs';

const Supplies = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'medical' | 'dental'>('medical');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [viewSupply, setViewSupply] = useState<any>(null);
  const [editSupply, setEditSupply] = useState<any>(null);
  const [archiveSupply, setArchiveSupply] = useState<any>(null);
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '',
    supplier: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [highlightedId, setHighlightedId] = useState<string>('');
  const [supplies, setSupplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Initialize supplies data from mock data
  useEffect(() => {
    const allSupplies = [...mockMedicalSupplies, ...mockDentalSupplies];
    setSupplies(allSupplies);
  }, []);

  // Get current data based on active tab
  const currentData = supplies.filter(supply => supply.department === activeTab);
  
  // Get unique values for filters
  const uniqueCategories = [...new Set(currentData.map(supply => supply.category))];
  const uniqueSuppliers = [...new Set(currentData.map(supply => supply.supplier).filter(Boolean))];
  
  // Sort and filter supplies
  const sortedAndFilteredSupplies = useMemo(() => {
    let filtered = currentData;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(supply =>
        supply.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.supply_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supply.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(supply => supply.category === filters.category);
    }
    
    // Apply supplier filter
    if (filters.supplier) {
      filtered = filtered.filter(supply => supply.supplier === filters.supplier);
    }
    
    // Apply stock status filter
    if (filters.stockStatus === 'low') {
      filtered = filtered.filter(supply => supply.quantity <= supply.reorder_threshold);
    } else if (filters.stockStatus === 'normal') {
      filtered = filtered.filter(supply => supply.quantity > supply.reorder_threshold);
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortField as keyof typeof a];
      let bValue = b[sortField as keyof typeof b];
      
      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string values
      aValue = String(aValue || '').toLowerCase();
      bValue = String(bValue || '').toLowerCase();
      
      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return sorted;
  }, [searchTerm, currentData, filters, sortField, sortDirection]);

  // Calculate statistics for current tab
  const totalSupplies = currentData.reduce((sum, supply) => sum + supply.quantity, 0);
  const lowStockCount = currentData.filter(supply => supply.quantity <= supply.reorder_threshold).length;
  const categories = [...new Set(currentData.map(supply => supply.category))];

  const isLowStock = (quantity: number, threshold: number) => {
    return quantity <= threshold;
  };

  const handleView = (supply: any) => {
    setViewSupply(supply);
  };

  const handleEdit = (supply: any) => {
    alert(`Edit supply: ${supply.name}`);
  };

  const handleArchive = (supply: any) => {
    alert(`Archive supply: ${supply.name}`);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleQuickAdd = () => {
    setShowAddModal(true);
  };

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight">📦 Supply Inventory</h1>
                <p className="text-orange-100 text-lg">Comprehensive medical and dental supply management system</p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Package className="h-16 w-16 text-white/90 mx-auto mb-2" />
                  <p className="text-sm text-orange-100 text-center">Smart Inventory</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-20">
            <Package className="h-32 w-32 text-white" />
          </div>
        </div>

        {/* Department Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('medical')}
              className={`group flex-1 px-8 py-6 rounded-2xl font-bold text-lg transition-all duration-500 transform ${
                activeTab === 'medical'
                  ? 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-2xl scale-105 shadow-orange-500/25'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-orange-50 hover:text-orange-700 hover:scale-102'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`p-2 rounded-xl ${
                  activeTab === 'medical' ? 'bg-white/20' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                }`}>
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <div>Medical Supplies</div>
                  <div className={`text-sm font-normal ${
                    activeTab === 'medical' ? 'text-orange-100' : 'text-gray-500'
                  }`}>
                    {supplies.filter(s => s.department === 'medical').length} items
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('dental')}
              className={`group flex-1 px-8 py-6 rounded-2xl font-bold text-lg transition-all duration-500 transform ${
                activeTab === 'dental'
                  ? 'bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white shadow-2xl scale-105 shadow-pink-500/25'
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-pink-50 hover:text-pink-700 hover:scale-102'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <div className={`p-2 rounded-xl ${
                  activeTab === 'dental' ? 'bg-white/20' : 'bg-pink-100 text-pink-600 group-hover:bg-pink-200'
                }`}>
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <div>Dental Supplies</div>
                  <div className={`text-sm font-normal ${
                    activeTab === 'dental' ? 'text-pink-100' : 'text-gray-500'
                  }`}>
                    {supplies.filter(s => s.department === 'dental').length} items
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-orange-50 p-6 rounded-3xl shadow-2xl border border-orange-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-orange-600 mb-2 uppercase tracking-wider">Total Supplies</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{currentData.length}</p>
                <p className="text-xs text-orange-600 font-semibold">Active supplies</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-orange-500/25">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-red-50 p-6 rounded-3xl shadow-2xl border border-red-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-red-600 mb-2 uppercase tracking-wider">Low Stock Alert</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{lowStockCount}</p>
                <p className="text-xs text-red-600 font-semibold">Needs restocking</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-red-500/25">
                  <AlertTriangle className="h-8 w-8 text-white animate-pulse" />
                </div>
                {lowStockCount > 0 && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-400 rounded-full animate-bounce"></div>
                )}
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-blue-50 p-6 rounded-3xl shadow-2xl border border-blue-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-wider">Total Inventory</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{totalSupplies.toLocaleString()}</p>
                <p className="text-xs text-blue-600 font-semibold">Units in stock</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-blue-500/25">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 p-6 rounded-3xl shadow-2xl border border-purple-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-purple-600 mb-2 uppercase tracking-wider">Categories</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{categories.length}</p>
                <p className="text-xs text-purple-600 font-semibold">Supply types</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-purple-500/25">
                  <Archive className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Logs */}
        <RecentLogs resourceType="supply" limit={3} />

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
                  <p className="text-sm text-gray-600">Find and filter supplies instantly</p>
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
              className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-400"
            >
              <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Add New Supply</div>
                <div className="text-xs text-orange-100">{activeTab === 'medical' ? 'Medical' : 'Dental'} Department</div>
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
                placeholder="🔍 Search supplies by name, code, category, or supplier..."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl border-2 border-indigo-100 animate-in slide-in-from-top-5 duration-500">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                <select
                  value={filters.supplier}
                  onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
                >
                  <option value="">All Suppliers</option>
                  {uniqueSuppliers.map((supplier) => (
                    <option key={supplier} value={supplier}>
                      {supplier}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Status</label>
                <select
                  value={filters.stockStatus}
                  onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200"
                >
                  <option value="">All Stock Levels</option>
                  <option value="low">Low Stock</option>
                  <option value="normal">Normal Stock</option>
                </select>
              </div>
              
              <div className="md:col-span-3 flex justify-between items-center mt-6 pt-4 border-t border-indigo-200">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setFilters({ category: '', stockStatus: '', supplier: '' })}
                    className="flex items-center space-x-2 px-6 py-3 text-sm font-bold text-indigo-600 hover:text-white bg-white hover:bg-indigo-600 border-2 border-indigo-600 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear All Filters</span>
                  </button>
                  <div className="px-4 py-2 bg-white/60 rounded-xl border border-indigo-200">
                    <div className="text-sm font-bold text-indigo-700">
                      Showing {sortedAndFilteredSupplies.length} of {currentData.length} supplies
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

        {/* Supplies Table */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={
                  `p-3 rounded-2xl shadow-lg ${activeTab === 'medical' 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600' 
                    : 'bg-gradient-to-r from-pink-500 to-red-600'}`
                }>
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {activeTab === 'medical' ? 'Medical' : 'Dental'} Supplies Inventory
                  </h3>
                  <p className="text-sm text-gray-600">Complete supply catalog with real-time stock tracking</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{sortedAndFilteredSupplies.length}</div>
                <div className="text-sm text-gray-600">Active supplies</div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto divide-y divide-gray-200">
              <thead className={`bg-gradient-to-r ${
                activeTab === 'medical' 
                  ? 'from-orange-50 via-red-50 to-pink-50' 
                  : 'from-pink-50 via-red-50 to-orange-50'
              }`}>
                <tr>
                  <th className="px-8 py-6 text-center text-xs font-black text-gray-700 uppercase tracking-wider">
                    <button 
                      onClick={() => handleSort('supply_code')}
                      className="group flex items-center justify-center space-x-2 hover:text-orange-600 transition-all duration-200 font-bold w-full"
                    >
                      <span className="group-hover:scale-105 transition-transform">Supply Code</span>
                      {sortField === 'supply_code' && (
                        <div className="animate-bounce">
                          {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-orange-600" /> : <ChevronDown className="h-4 w-4 text-orange-600" />}
                        </div>
                      )}
                    </button>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Supply Details</span>
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Category</span>
                      {sortField === 'category' && (
                        sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => handleSort('supplier')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Supplier</span>
                      {sortField === 'supplier' && (
                        sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors duration-200"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Stock</span>
                      {sortField === 'quantity' && (
                        sortDirection === 'asc' ? 
                        <ChevronUp className="h-4 w-4" /> : 
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                        <p className="text-gray-500">Loading supplies...</p>
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
                ) : sortedAndFilteredSupplies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Package className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500">No supplies found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : sortedAndFilteredSupplies.map((supply, index) => {
                  const isHighlighted = highlightedId === `${activeTab}-${supply.id}`;
                  return (
                  <tr key={supply.id} className={`group hover:bg-gradient-to-r transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                    activeTab === 'medical' 
                      ? 'hover:from-orange-50 hover:to-red-50 hover:shadow-orange-100' 
                      : 'hover:from-pink-50 hover:to-red-50 hover:shadow-pink-100'
                  } ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'} ${
                    isHighlighted ? 'bg-yellow-100 border-2 border-yellow-300 shadow-lg ring-2 ring-yellow-300 ring-opacity-50' : ''
                  }`}>
                    <td className="px-8 py-6 whitespace-nowrap text-center">
                      <div className="flex justify-center">
                        <span className={`group-hover:scale-105 transition-transform inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${
                          activeTab === 'medical' 
                            ? 'bg-gradient-to-r from-orange-100 via-red-100 to-pink-100 text-orange-800 group-hover:shadow-orange-200'
                            : 'bg-gradient-to-r from-pink-100 via-red-100 to-orange-100 text-pink-800 group-hover:shadow-pink-200'
                        }`}>
                          {supply.supply_code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-gray-900">
                          {supply.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {supply.description || 'No description'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700">
                        {supply.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {supply.supplier || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-bold ${
                          isLowStock(supply.quantity, supply.reorder_threshold) ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {supply.quantity} {supply.unit}
                        </span>
                        {isLowStock(supply.quantity, supply.reorder_threshold) && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => handleView(supply)}
                          className="group/btn relative p-3 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                          <div className="absolute -inset-1 bg-blue-600 rounded-xl opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                        </button>
                        <button
                          onClick={() => {
                            setEditSupply(supply);
                            setShowEditModal(true);
                          }}
                          className="group/btn relative p-3 text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/25"
                          title="Edit Supply"
                        >
                          <Edit className="h-5 w-5" />
                          <div className="absolute -inset-1 bg-emerald-600 rounded-xl opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                        </button>
                        <button
                          onClick={() => {
                            setArchiveSupply(supply);
                            setShowArchiveModal(true);
                          }}
                          className="group/btn relative p-3 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
                          title="Archive Supply"
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
        </div>

        {/* Results Info */}
        <div className="bg-gradient-to-r from-white via-gray-50 to-white px-8 py-6 rounded-3xl shadow-2xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={
                activeTab === 'medical' 
                  ? 'p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600' 
                  : 'p-3 rounded-2xl bg-gradient-to-r from-pink-500 to-red-600'
              }>
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  Showing {sortedAndFilteredSupplies.length} of {currentData.length} {activeTab} supplies
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

        {/* Add Supply Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add New {activeTab === 'medical' ? 'Medical' : 'Dental'} Supply</h3>
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
                
                const newSupply = {
                  supply_code: formData.get('supply_code') as string,
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  category: formData.get('category') as string,
                  department: activeTab,
                  unit: formData.get('unit') as string,
                  quantity: parseInt(formData.get('quantity') as string),
                  cost_per_unit: parseFloat(formData.get('cost_per_unit') as string),
                  reorder_threshold: parseInt(formData.get('reorder_threshold') as string),
                  supplier: formData.get('supplier') as string
                };
                
                console.log(`${newSupply.name} has been added successfully!`);
                setShowAddModal(false);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supply Code *</label>
                    <input
                      type="text"
                      name="supply_code"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., SUP-001"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supply Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Surgical Gloves"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="Brief description of the supply"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      {activeTab === 'medical' ? (
                        <>
                          <option value="Disposables">Disposables</option>
                          <option value="Surgical Supplies">Surgical Supplies</option>
                          <option value="Safety Equipment">Safety Equipment</option>
                          <option value="Cleaning Supplies">Cleaning Supplies</option>
                          <option value="Emergency Supplies">Emergency Supplies</option>
                        </>
                      ) : (
                        <>
                          <option value="Dental Materials">Dental Materials</option>
                          <option value="Impression Materials">Impression Materials</option>
                          <option value="Restorative Materials">Restorative Materials</option>
                          <option value="Preventive Supplies">Preventive Supplies</option>
                          <option value="Disposables">Disposables</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Unit *</label>
                    <select
                      name="unit"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Unit</option>
                      <option value="pcs">Pieces</option>
                      <option value="box">Box</option>
                      <option value="pack">Pack</option>
                      <option value="bottle">Bottle</option>
                      <option value="tube">Tube</option>
                      <option value="roll">Roll</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Threshold *</label>
                    <input
                      type="number"
                      name="reorder_threshold"
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cost Per Unit *</label>
                    <input
                      type="number"
                      name="cost_per_unit"
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., 12.50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                    <input
                      type="text"
                      name="supplier"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Medical Supply Co."
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
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Supply</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Supply Modal */}
        {showEditModal && editSupply && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit {editSupply.name}</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditSupply(null);
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
                  supply_code: formData.get('supply_code') as string,
                  name: formData.get('name') as string,
                  description: formData.get('description') as string,
                  category: formData.get('category') as string,
                  unit: formData.get('unit') as string,
                  quantity: parseInt(formData.get('quantity') as string),
                  cost_per_unit: parseFloat(formData.get('cost_per_unit') as string),
                  reorder_threshold: parseInt(formData.get('reorder_threshold') as string),
                  supplier: formData.get('supplier') as string
                };
                
                console.log('Supply updated successfully!');
                setShowEditModal(false);
                setEditSupply(null);
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supply Code *</label>
                    <input
                      type="text"
                      name="supply_code"
                      defaultValue={editSupply.supply_code}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supply Name *</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editSupply.name}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      defaultValue={editSupply.description}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      defaultValue={editSupply.category}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Category</option>
                      {activeTab === 'medical' ? (
                        <>
                          <option value="Disposables">Disposables</option>
                          <option value="Surgical Supplies">Surgical Supplies</option>
                          <option value="Safety Equipment">Safety Equipment</option>
                          <option value="Cleaning Supplies">Cleaning Supplies</option>
                          <option value="Emergency Supplies">Emergency Supplies</option>
                        </>
                      ) : (
                        <>
                          <option value="Dental Materials">Dental Materials</option>
                          <option value="Impression Materials">Impression Materials</option>
                          <option value="Restorative Materials">Restorative Materials</option>
                          <option value="Preventive Supplies">Preventive Supplies</option>
                          <option value="Disposables">Disposables</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Unit *</label>
                    <select
                      name="unit"
                      defaultValue={editSupply.unit}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Unit</option>
                      <option value="pcs">Pieces</option>
                      <option value="box">Box</option>
                      <option value="pack">Pack</option>
                      <option value="bottle">Bottle</option>
                      <option value="tube">Tube</option>
                      <option value="roll">Roll</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      defaultValue={editSupply.quantity}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Threshold *</label>
                    <input
                      type="number"
                      name="reorder_threshold"
                      defaultValue={editSupply.reorder_threshold}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cost Per Unit *</label>
                    <input
                      type="number"
                      name="cost_per_unit"
                      defaultValue={editSupply.cost_per_unit}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                    <input
                      type="text"
                      name="supplier"
                      defaultValue={editSupply.supplier}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditSupply(null);
                    }}
                    className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Edit className="h-5 w-5" />
                    <span>Update Supply</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Supply Modal */}
        {viewSupply && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-4 shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Supply Details</h3>
                <button
                  onClick={() => setViewSupply(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Supply Code</label>
                  <p className="text-lg text-gray-900 mt-1">{viewSupply.supply_code}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Name</label>
                  <p className="text-lg text-gray-900 mt-1">{viewSupply.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Category</label>
                  <p className="text-lg text-gray-900 mt-1">{viewSupply.category}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Department</label>
                  <p className="text-lg text-gray-900 mt-1 capitalize">{viewSupply.department}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <p className="text-lg text-gray-900 mt-1">{viewSupply.description || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Current Stock</label>
                  <p className="text-lg text-gray-900 mt-1">{viewSupply.quantity} {viewSupply.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Reorder Threshold</label>
                  <p className="text-lg text-gray-900 mt-1">{viewSupply.reorder_threshold} {viewSupply.unit}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Supplier</label>
                  <p className="text-lg text-gray-900 mt-1">{viewSupply.supplier || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Cost Per Unit</label>
                  <p className="text-lg text-gray-900 mt-1">${viewSupply.cost_per_unit}</p>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={() => setViewSupply(null)}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setEditSupply(viewSupply);
                    setShowEditModal(true);
                    setViewSupply(null);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-200"
                >
                  Edit Supply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Archive Confirmation Modal */}
        {showArchiveModal && archiveSupply && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300">
              <div className="text-center">
                {/* Icon */}
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-6">
                  <Archive className="h-6 w-6 text-red-600" />
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Archive Supply
                </h3>
                
                {/* Message */}
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to archive <span className="font-semibold text-gray-900">"{archiveSupply.name}"</span>? This action will remove the supply from the active inventory.
                </p>
                
                {/* Supply Details Card */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{archiveSupply.name}</p>
                      <p className="text-sm text-gray-600">{archiveSupply.category}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Stock:</span>
                      <span className="font-medium text-gray-900 ml-1">{archiveSupply.quantity} {archiveSupply.unit}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Supplier:</span>
                      <span className="font-medium text-gray-900 ml-1">{archiveSupply.supplier || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowArchiveModal(false);
                      setArchiveSupply(null);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log(`${archiveSupply.name} has been archived successfully!`);
                      setShowArchiveModal(false);
                      setArchiveSupply(null);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 transition-colors duration-200"
                  >
                    Archive Supply
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

export default Supplies;