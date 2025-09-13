import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../lib/api';
import { Eye, Edit2, Trash2, Plus, UserCheck, UserX, Shield, ShieldCheck } from 'lucide-react';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  department?: string;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminManagement() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Check if user is superadmin
  useEffect(() => {
    const checkUserRole = () => {
      try {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        
        if (!user || user.role !== 'superadmin') {
          navigate('/');
          return;
        }
      } catch {
        navigate('/');
        return;
      }
    };
    
    checkUserRole();
  }, [navigate]);
  const [filters, setFilters] = useState({
    role: '',
    is_active: ''
  });
  const [addFormData, setAddFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    role: 'admin'
  });

  const queryClient = useQueryClient();

  const { data: usersData } = useQuery({
    queryKey: ['admin-users', filters],
    queryFn: () => adminApi.getUsers(filters),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const users = usersData?.data?.data || [];

  const createUserMutation = useMutation({
    mutationFn: (data: any) => adminApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowAddModal(false);
      setAddFormData({
        username: '',
        email: '',
        full_name: '',
        role: 'admin'
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowEditModal(false);
      setSelectedUser(null);
    },
  });

  const toggleUserActiveMutation = useMutation({
    mutationFn: (id: string) => adminApi.toggleUserActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate(addFormData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      updateUserMutation.mutate({
        id: selectedUser.id,
        data: {
          username: selectedUser.username,
          email: selectedUser.email,
          full_name: selectedUser.full_name,
          role: selectedUser.role,
        }
      });
    }
  };

  const openViewModal = (user: AdminUser) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleToggleActive = (userId: string) => {
    if (confirm('Are you sure you want to change this user\'s active status?')) {
      toggleUserActiveMutation.mutate(userId);
    }
  };

  const handleDelete = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      is_active: ''
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <ShieldCheck size={14} />;
      case 'admin':
        return <Shield size={14} />;
      default:
        return <Shield size={14} />;
    }
  };


  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight">🛡️ Admin Management</h1>
                <p className="text-indigo-100 text-lg">Comprehensive user management and permissions control</p>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Shield className="h-16 w-16 text-white/90 mx-auto mb-2" />
                  <p className="text-sm text-indigo-100 text-center">Security Hub</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-20">
            <Shield className="h-32 w-32 text-white" />
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Advanced Filters</h3>
                  <p className="text-sm text-gray-600">Filter administrators by role and status</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-400"
            >
              <div className="p-1 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">Add Administrator</div>
                <div className="text-xs text-indigo-100">Create new admin user</div>
              </div>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                value={filters.is_active}
                onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-3 px-4 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-300 transform hover:scale-105"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-2xl shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">System Administrators</h3>
                  <p className="text-sm text-gray-600">Complete user management and access control</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                <div className="text-sm text-gray-600">Total admins</div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
                <tr>
                  <th className="px-8 py-6 text-left text-xs font-black text-gray-700 uppercase tracking-wider">User Information</th>
                  <th className="px-6 py-6 text-center text-xs font-black text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-6 text-center text-xs font-black text-gray-700 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-6 text-center text-xs font-black text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-6 text-center text-xs font-black text-gray-700 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-6 text-center text-xs font-black text-gray-700 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-6 text-center text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user: AdminUser, index) => (
                  <tr key={user.id} className={`group hover:bg-gradient-to-r transition-all duration-200 hover:from-indigo-50 hover:to-purple-50 ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                          <Shield className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">{user.full_name}</div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center">
                      <span className={`group-hover:scale-105 transition-transform inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1 capitalize">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center">
                      <span className="text-sm text-gray-900 font-medium">{user.department || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center">
                      <span className={`group-hover:scale-105 transition-transform inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? (
                          <>
                            <UserCheck size={12} className="mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX size={12} className="mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center text-sm text-gray-600">
                      {user.last_login ? formatDate(user.last_login) : 'Never'}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center text-sm text-gray-600">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => openViewModal(user)}
                          className="group/btn relative p-3 text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-blue-500/25"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                          <div className="absolute -inset-1 bg-blue-600 rounded-xl opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                        </button>
                        <button
                          onClick={() => openEditModal(user)}
                          className="group/btn relative p-3 text-emerald-600 hover:text-white bg-emerald-50 hover:bg-emerald-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/25"
                          title="Edit User"
                        >
                          <Edit2 className="h-4 w-4" />
                          <div className="absolute -inset-1 bg-emerald-600 rounded-xl opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                        </button>
                        <button
                          onClick={() => handleToggleActive(user.id)}
                          className={`group/btn relative p-3 hover:text-white rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg ${
                            user.is_active 
                              ? 'text-orange-600 bg-orange-50 hover:bg-orange-600 hover:shadow-orange-500/25' 
                              : 'text-green-600 bg-green-50 hover:bg-green-600 hover:shadow-green-500/25'
                          }`}
                          title={user.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          <div className={`absolute -inset-1 rounded-xl opacity-0 group-hover/btn:opacity-20 transition-opacity ${
                            user.is_active ? 'bg-orange-600' : 'bg-green-600'
                          }`}></div>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="group/btn relative p-3 text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                          <div className="absolute -inset-1 bg-red-600 rounded-xl opacity-0 group-hover/btn:opacity-20 transition-opacity"></div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Shield size={24} className="text-gray-400" />
                        </div>
                        <p className="text-lg font-medium">No administrators found</p>
                        <p className="text-sm">
                          {Object.values(filters).some(filter => filter !== '') 
                            ? 'Try adjusting your filters to see more results'
                            : 'Add your first administrator to get started'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-indigo-50 p-6 rounded-3xl shadow-2xl border border-indigo-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wider">Total Administrators</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{users.length}</p>
                <p className="text-xs text-indigo-600 font-semibold">System users</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-indigo-500/25">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-indigo-400 rounded-full animate-ping"></div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-green-50 p-6 rounded-3xl shadow-2xl border border-green-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-green-600 mb-2 uppercase tracking-wider">Active Users</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{users.filter((u: AdminUser) => u.is_active).length}</p>
                <p className="text-xs text-green-600 font-semibold">Currently enabled</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-green-500/25">
                  <UserCheck className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 p-6 rounded-3xl shadow-2xl border border-purple-100 hover:shadow-3xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-purple-600 mb-2 uppercase tracking-wider">Super Admins</p>
                <p className="text-4xl font-black text-gray-900 mb-1">{users.filter((u: AdminUser) => u.role === 'superadmin').length}</p>
                <p className="text-xs text-purple-600 font-semibold">Highest privileges</p>
              </div>
              <div className="relative">
                <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-3 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-purple-500/25">
                  <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                {users.filter((u: AdminUser) => u.role === 'superadmin').length > 0 && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-purple-400 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Administrator</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={addFormData.username}
                    onChange={(e) => setAddFormData({ ...addFormData, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={addFormData.email}
                    onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={addFormData.full_name}
                    onChange={(e) => setAddFormData({ ...addFormData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={addFormData.role}
                    onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
                  >
                    Add Administrator
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Administrator Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  <p className="text-gray-900 font-semibold">{selectedUser.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900 font-semibold">{selectedUser.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                    {getRoleIcon(selectedUser.role)}
                    <span className="ml-1 capitalize">{selectedUser.role}</span>
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-gray-900 font-semibold">{selectedUser.department || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedUser.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedUser.is_active ? (
                      <>
                        <UserCheck size={12} className="mr-1" />
                        Active
                      </>
                    ) : (
                      <>
                        <UserX size={12} className="mr-1" />
                        Inactive
                      </>
                    )}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Login</label>
                  <p className="text-gray-900">
                    {selectedUser.last_login ? formatDate(selectedUser.last_login) : 'Never'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Created At</label>
                  <p className="text-gray-900">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Updated At</label>
                  <p className="text-gray-900">{formatDate(selectedUser.updated_at)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full mt-6 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Administrator</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={selectedUser.full_name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200"
                  >
                    Update Administrator
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}