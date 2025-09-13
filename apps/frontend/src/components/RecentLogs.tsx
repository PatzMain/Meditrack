import React from 'react';
import { Activity, Clock, User, Package, Archive, Wrench } from 'lucide-react';
import { getMockData } from '../lib/mockData';
import { useNavigate } from 'react-router-dom';

interface RecentLogsProps {
  resourceType: 'medicine' | 'supply' | 'equipment';
  limit?: number;
  className?: string;
}

const getResourceIcon = (resourceType: string) => {
  switch (resourceType) {
    case 'medicine': return Package;
    case 'supply': return Archive;
    case 'equipment': return Wrench;
    default: return Activity;
  }
};

const getActionColor = (action: string) => {
  switch (action.toUpperCase()) {
    case 'CREATE': return 'text-green-600 bg-green-50';
    case 'UPDATE': return 'text-blue-600 bg-blue-50';
    case 'DELETE': return 'text-red-600 bg-red-50';
    case 'ARCHIVE': return 'text-orange-600 bg-orange-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export const RecentLogs: React.FC<RecentLogsProps> = ({ 
  resourceType, 
  limit = 5,
  className = ""
}) => {
  const navigate = useNavigate();
  const mockResponse = getMockData('logs');
  const allLogs = mockResponse.data.data || [];
  
  // Filter logs by resource type
  const logs = allLogs.filter((log: any) => 
    log.resource_type?.toLowerCase() === resourceType || 
    log.details?.toLowerCase().includes(resourceType)
  );
  const recentLogs = logs.slice(0, limit);
  const isLoading = false;

  const handleViewAllLogs = () => {
    // Navigate to logs page with filter for the specific resource type
    navigate(`/logs?resource_type=${resourceType}`);
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
          <div className="animate-pulse">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const ResourceIcon = getResourceIcon(resourceType);

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500 capitalize">{resourceType} updates</p>
            </div>
          </div>
          <div className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
            Last {limit} actions
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
        {recentLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ResourceIcon className="h-6 w-6 text-gray-400" />
            </div>
            <p className="font-medium">No recent activity</p>
            <p className="text-sm">Actions will appear here</p>
          </div>
        ) : (
          recentLogs.map((log: any, index: number) => (
            <div 
              key={log.id} 
              className="p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`p-2 rounded-lg ${getActionColor(log.action)}`}>
                    <ResourceIcon className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {log.details}
                    </p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getActionColor(log.action)
                    }`}>
                      {log.action}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{log.user || 'System'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {recentLogs.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
          <button 
            onClick={handleViewAllLogs}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 hover:bg-blue-50 rounded-lg py-2"
          >
            View all {resourceType} logs →
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentLogs;