import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useSearchParams } from 'react-router-dom';
import { logsApi } from '../lib/api';
import { Activity, Filter, Calendar, User, FileText, Clock, Eye, Search, RefreshCw, X } from 'lucide-react';
import DataTable from '../components/DataTable';
import { getStatusSVG } from '../components/StatusSVGs';

const Logs = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    action: '',
    resource_type: '',
    user: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewLog, setViewLog] = useState<any>(null);

  // Handle URL parameters for filtering
  useEffect(() => {
    const resourceTypeParam = searchParams.get('resource_type');
    if (resourceTypeParam) {
      setFilters(prev => ({
        ...prev,
        resource_type: resourceTypeParam
      }));
    }
  }, [searchParams]);

  const { data: logsData, refetch, isLoading } = useQuery({
    queryKey: ['logs', filters],
    queryFn: () => logsApi.getAll({ ...filters, limit: 100 }),
    staleTime: 10000,
    refetchOnWindowFocus: false,
  });

  const logs = logsData?.data?.data || [];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActionColor = (action: string) => {
    switch (action.toUpperCase()) {
      case 'LOGIN': return 'bg-green-100 text-green-800';
      case 'LOGOUT': return 'bg-gray-100 text-gray-800';
      case 'CREATE': return 'bg-blue-100 text-blue-800';
      case 'UPDATE': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVE': return 'bg-orange-100 text-orange-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceColor = (resourceType: string) => {
    switch (resourceType) {
      case 'auth': return 'bg-purple-100 text-purple-800';
      case 'medicine': return 'bg-green-100 text-green-800';
      case 'supply': return 'bg-blue-100 text-blue-800';
      case 'equipment': return 'bg-orange-100 text-orange-800';
      case 'patient': return 'bg-pink-100 text-pink-800';
      case 'consultation': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'medicine': return '💊';
      case 'supply': return '📦';
      case 'equipment': return '⚕️';
      case 'auth': return '🔐';
      case 'patient': return '👤';
      case 'consultation': return '🩺';
      default: return '📄';
    }
  };

  // Get unique values for filters
  const uniqueActions = [...new Set(logs.map((log: any) => log.action))];
  const uniqueResourceTypes = [...new Set(logs.map((log: any) => log.resource_type))];
  const uniqueUsers = [...new Set(logs.map((log: any) => log.user))];

  const columns = [
    {
      key: 'timestamp',
      header: 'Time',
      width: 'w-32',
      render: (value: string) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-gray-500">
            {formatTimeAgo(value)}
          </div>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Action',
      render: (value: string) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getActionColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'resource_type',
      header: 'Resource',
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getResourceIcon(value)}</span>
          <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${getResourceColor(value)}`}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      render: (value: string, row: any) => (
        <div className="max-w-md">
          <div className="text-sm font-medium text-gray-900 truncate">
            {value}
          </div>
        </div>
      )
    },
    {
      key: 'user',
      header: 'User',
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{value}</div>
            {row.user_role && (
              <div className="text-xs text-gray-500 capitalize">{row.user_role}</div>
            )}
          </div>
        </div>
      )
    }
  ];

  const handleView = (log: any) => {
    setViewLog(log);
  };

  const clearFilters = () => {
    setFilters({ action: '', resource_type: '', user: '' });
    setSearchTerm('');
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-600 via-gray-700 to-zinc-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight">📊 System Activity Logs</h1>
                <p className="text-slate-100 text-lg">Real-time monitoring and audit trail of all system activities</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Activity className="h-16 w-16 text-white/90 mx-auto mb-2" />
                  <p className="text-sm text-slate-100 text-center">Live Monitor</p>
                </div>
                <button 
                  onClick={() => refetch()}
                  disabled={isLoading}
                  className="group flex items-center space-x-3 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-sm border border-white/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''} group-hover:rotate-180 transition-transform duration-300`} />
                  <span className="font-bold text-sm">Refresh Logs</span>
                </button>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-20">
            <Activity className="h-32 w-32 text-white" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Total Logs</p>
                <p className="text-3xl font-bold text-gray-900">{logs.length}</p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Activity className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Unique Users</p>
                <p className="text-3xl font-bold text-blue-600">{uniqueUsers.length}</p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Resource Types</p>
                <p className="text-3xl font-bold text-green-600">{uniqueResourceTypes.length}</p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">Action Types</p>
                <p className="text-3xl font-bold text-purple-600">{uniqueActions.length}</p>
              </div>
              <div className="h-16 w-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <Filter className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
              >
                <option value="">All Actions</option>
                {uniqueActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Resource Type</label>
              <select
                value={filters.resource_type}
                onChange={(e) => setFilters({ ...filters, resource_type: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
              >
                <option value="">All Resources</option>
                {uniqueResourceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">User</label>
              <select
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
              >
                <option value="">All Users</option>
                {uniqueUsers.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <div className="text-center p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                <div className="text-sm font-semibold text-yellow-800">📖 Read-Only</div>
                <div className="text-xs text-yellow-600 mt-1">View logs only</div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <DataTable
          data={logs}
          columns={columns}
          actions={{
            onView: handleView
          }}
          loading={isLoading}
          searchable={true}
          onSearchChange={setSearchTerm}
          emptyState={
            <div className="text-center py-12 text-gray-500">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-xl font-semibold mb-2">No logs found</p>
              <p className="text-sm">Try adjusting your filters or search criteria</p>
            </div>
          }
        />

        {/* View Log Modal */}
        {viewLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-4 shadow-2xl transform transition-all duration-300 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Log Details</h3>
                <button
                  onClick={() => setViewLog(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Timestamp</label>
                    <p className="text-lg text-gray-900 mt-1">
                      {new Date(viewLog.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Action</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getActionColor(viewLog.action)}`}>
                        {viewLog.action}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Resource Type</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-lg">{getResourceIcon(viewLog.resource_type)}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-sm font-medium ${getResourceColor(viewLog.resource_type)}`}>
                        {viewLog.resource_type}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Description</label>
                  <p className="text-lg text-gray-900 mt-1">{viewLog.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">User</label>
                    <p className="text-lg text-gray-900 mt-1">{viewLog.user}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">User Role</label>
                    <p className="text-lg text-gray-900 mt-1 capitalize">{viewLog.user_role || 'N/A'}</p>
                  </div>
                </div>

              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setViewLog(null)}
                  className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;