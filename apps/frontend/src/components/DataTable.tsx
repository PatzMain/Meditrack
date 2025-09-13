import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, MoreVertical, Eye, Edit, Archive, Download, RefreshCw } from 'lucide-react';
import { getStatusSVG } from './StatusSVGs';

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  actions?: {
    onView?: (row: any) => void;
    onEdit?: (row: any) => void;
    onArchive?: (row: any) => void;
    customActions?: Array<{
      label: string;
      icon: React.ComponentType<any>;
      onClick: (row: any) => void;
      color?: string;
    }>;
  };
  searchable?: boolean;
  filterable?: boolean;
  onSearchChange?: (search: string) => void;
  loading?: boolean;
  emptyState?: React.ReactNode;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  actions,
  searchable = true,
  filterable = false,
  onSearchChange,
  loading = false,
  emptyState,
  className = ""
}) => {
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortField) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const filteredData = React.useMemo(() => {
    if (!searchTerm) return sortedData;
    
    return sortedData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  if (loading) {
    return (
      <div className="rounded-2xl shadow-lg border border-gray-200 bg-white p-8">
        <div className="animate-pulse">
          <div className="h-4 rounded w-1/4 mb-4 bg-gray-200"></div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 rounded flex-1 bg-gray-200"></div>
                <div className="h-4 rounded flex-1 bg-gray-200"></div>
                <div className="h-4 rounded flex-1 bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const exportToCSV = () => {
    const csvContent = [
      columns.map(col => col.header).join(','),
      ...filteredData.map(row => 
        columns.map(col => {
          const value = row[col.key];
          return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`rounded-2xl shadow-xl border border-gray-200 bg-white overflow-hidden transition-all duration-300 ${className}`}>
      {/* Header with Search and Filters */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            {searchable && (
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 bg-white text-gray-900 placeholder-gray-500 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={exportToCSV}
              className="flex items-center px-4 py-3 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            
            {filterable && (
              <button className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-200 transform hover:scale-105">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto divide-y divide-gray-200 min-w-full">
          <thead className="bg-gradient-to-r from-gray-100 to-blue-100">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap ${
                    column.sortable ? 'cursor-pointer hover:bg-blue-200 transition-colors duration-200' : ''
                  } ${column.width || ''}`}
                  onClick={column.sortable ? () => handleSort(column.key) : undefined}
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`h-3 w-3 ${
                            sortField === column.key && sortDirection === 'asc' 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                        <ChevronDown 
                          className={`h-3 w-3 -mt-1 ${
                            sortField === column.key && sortDirection === 'desc' 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap w-32">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-3 py-8 text-center">
                  {emptyState || (
                    <div className="text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium">No data found</p>
                      <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr 
                  key={index} 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                      {column.render ? (
                        column.render(row[column.key], row)
                      ) : (
                        <div className="text-sm text-gray-900 font-medium">
                          {/* Check if it's a status field and render SVG */}
                          {(column.key.includes('status') || column.key.includes('type')) && 
                           typeof row[column.key] === 'string' ? (
                            <div className="flex items-center space-x-2">
                              {getStatusSVG(row[column.key], "w-4 h-4 flex-shrink-0")}
                              <span className="capitalize">{row[column.key].replace('_', ' ')}</span>
                            </div>
                          ) : (
                            <span title={String(row[column.key])}>{String(row[column.key])}</span>
                          )}
                        </div>
                      )}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-center text-sm font-medium whitespace-nowrap">
                      <div className="relative inline-block">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        
                        {activeDropdown === index && (
                          <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-white ring-1 ring-black ring-opacity-5 z-50">
                            <div className="py-2">
                              {actions.onView && (
                                <button
                                  onClick={() => {
                                    actions.onView!(row);
                                    setActiveDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                >
                                  <Eye className="h-4 w-4 mr-3" />
                                  View Details
                                </button>
                              )}
                              {actions.onEdit && (
                                <button
                                  onClick={() => {
                                    actions.onEdit!(row);
                                    setActiveDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors duration-200"
                                >
                                  <Edit className="h-4 w-4 mr-3" />
                                  Edit
                                </button>
                              )}
                              {actions.onArchive && (
                                <button
                                  onClick={() => {
                                    actions.onArchive!(row);
                                    setActiveDropdown(null);
                                  }}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                                >
                                  <Archive className="h-4 w-4 mr-3" />
                                  Archive
                                </button>
                              )}
                              {actions.customActions?.map((action, actionIndex) => (
                                <button
                                  key={actionIndex}
                                  onClick={() => {
                                    action.onClick(row);
                                    setActiveDropdown(null);
                                  }}
                                  className={`flex items-center w-full px-4 py-2 text-sm transition-colors duration-200 ${
                                    action.color || 'text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  <action.icon className="h-4 w-4 mr-3" />
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer with pagination could go here */}
      {filteredData.length > 0 && (
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredData.length}</span> of{' '}
              <span className="font-medium">{data.length}</span> results
            </div>
            <div className="text-sm text-gray-500">
              {searchTerm && `Filtered by: "${searchTerm}"`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;