import { useState, useMemo, useEffect } from 'react';
import { Users, UserPlus, Search, Eye, Edit, Archive, Filter, Calendar, Phone, Mail, User, GraduationCap, Building, Heart, Activity, Clock, MapPin } from 'lucide-react';
import { getMockData } from '../lib/mockData';
import { useSearchHighlight, scrollToHighlightedElement } from '../lib/searchHighlight';

const Patients = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    age: ''
  });

  // Search highlighting hook
  const { highlightId, isHighlighted, getHighlightStyle } = useSearchHighlight();

  // Scroll to highlighted element
  useEffect(() => {
    if (highlightId) {
      scrollToHighlightedElement(highlightId);
    }
  }, [highlightId]);

  const mockResponse = getMockData('patients');
  const data = mockResponse.data;
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading patients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading patients
      </div>
    );
  }

  const allPatients = data?.data || [];
  
  const patients = useMemo(() => {
    let filtered = allPatients;
    
    if (searchTerm) {
      filtered = filtered.filter((patient: any) =>
        `${patient.first_name} ${patient.last_name} ${patient.patient_no}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.type) {
      filtered = filtered.filter((patient: any) => {
        const type = getPatientType(patient);
        return type.toLowerCase() === filters.type.toLowerCase();
      });
    }
    
    return filtered;
  }, [allPatients, searchTerm, filters]);

  const getPatientType = (patient: any) => {
    if (patient.course) return 'Student';
    if (patient.employee_id) return 'Employee';
    return 'Other';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Student': return GraduationCap;
      case 'Employee': return Building;
      default: return User;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Student': return 'bg-green-100 text-green-800';
      case 'Employee': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 0, name: 'Patient Overview', icon: Users, count: patients.length },
    { id: 1, name: 'Patient Cards', icon: User, count: patients.length },
    { id: 2, name: 'Medical Records', icon: Heart, count: patients.length },
    { id: 3, name: 'Recent Activity', icon: Activity, count: 12 }
  ];

  const PatientOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold">{allPatients.length}</p>
            </div>
            <Users className="h-12 w-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Students</p>
              <p className="text-3xl font-bold">{allPatients.filter((p: any) => getPatientType(p) === 'Student').length}</p>
            </div>
            <GraduationCap className="h-12 w-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Employees</p>
              <p className="text-3xl font-bold">{allPatients.filter((p: any) => getPatientType(p) === 'Employee').length}</p>
            </div>
            <Building className="h-12 w-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-blue-500" />
            Search & Filters
          </h3>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({ type: '', status: '', age: '' });
            }}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Patients</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
                placeholder="Search by name, patient number..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
            >
              <option value="">All Types</option>
              <option value="Student">Students</option>
              <option value="Employee">Employees</option>
              <option value="Other">Others</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105">
              <UserPlus className="h-4 w-4" />
              <span>Register New Patient</span>
            </button>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Patient Information
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Contact Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Demographics
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient: any) => {
                const type = getPatientType(patient);
                const TypeIcon = getTypeIcon(type);
                
                return (
                  <tr 
                    key={patient.id} 
                    data-search-id={patient.id}
                    className={`hover:bg-blue-50 transition-colors duration-200 ${getHighlightStyle(patient.id)}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900">
                            {patient.last_name}, {patient.first_name} {patient.middle_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                              {patient.patient_no}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {patient.contact_no}
                        </div>
                        {patient.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-3 w-3 mr-1 text-gray-400" />
                            {patient.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <TypeIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                            {type}
                          </span>
                        </div>
                        {patient.course && (
                          <div className="text-xs text-gray-500">
                            {patient.course} - {patient.year_level}
                          </div>
                        )}
                        {patient.department && (
                          <div className="text-xs text-gray-500">
                            {patient.department}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {patient.age_computed} years old
                        </div>
                        <div className="text-xs text-gray-500">
                          {patient.sex}
                        </div>
                        {patient.blood_type && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            {patient.blood_type}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-orange-600 hover:text-orange-900 transition-colors duration-200">
                          <Archive className="h-4 w-4" />
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
    </div>
  );

  const PatientCardsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient: any) => {
          const type = getPatientType(patient);
          const TypeIcon = getTypeIcon(type);
          
          return (
            <div 
              key={patient.id} 
              data-search-id={patient.id}
              className={`bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-200 ${getHighlightStyle(patient.id)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {patient.first_name} {patient.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{patient.patient_no}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <TypeIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                    {type}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">{patient.age_computed} years old • {patient.sex}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">{patient.contact_no}</span>
                </div>
                
                {patient.blood_type && (
                  <div className="flex items-center text-sm">
                    <Heart className="h-4 w-4 mr-2 text-red-400" />
                    <span className="text-gray-600">Blood Type: </span>
                    <span className="ml-1 inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                      {patient.blood_type}
                    </span>
                  </div>
                )}
                
                {(patient.course || patient.department) && (
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">
                      {patient.course ? `${patient.course} - ${patient.year_level}` : patient.department}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex space-x-2">
                <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium">
                  View Details
                </button>
                <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium">
                  New Consultation
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const MedicalRecordsTab = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Medical Records Management</h3>
        <p className="text-gray-600 mb-6">Comprehensive medical history and records for all patients</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200">
          Access Medical Records
        </button>
      </div>
    </div>
  );

  const RecentActivityTab = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <div className="text-center py-12">
        <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Recent Patient Activity</h3>
        <p className="text-gray-600 mb-6">Track recent consultations, registrations, and updates</p>
        <button className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200">
          View Activity Log
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-700 to-green-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight">👥 Patient Management</h1>
                <p className="text-teal-100 text-lg">Comprehensive patient registration, records, and management system</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Users className="h-16 w-16 text-white/90 mx-auto mb-2" />
                  <p className="text-sm text-teal-100 text-center">Patient Hub</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-20">
            <Users className="h-32 w-32 text-white" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-white rounded-2xl p-2 shadow-xl border border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden">Tab {tab.id + 1}</span>
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 0 && <PatientOverviewTab />}
          {activeTab === 1 && <PatientCardsTab />}
          {activeTab === 2 && <MedicalRecordsTab />}
          {activeTab === 3 && <RecentActivityTab />}
        </div>
      </div>
    </div>
  );
};

export default Patients;