import { useState, useMemo } from 'react';
import { Stethoscope, Plus, Search, Clock, CheckCircle, XCircle, Calendar, User, FileText, Heart, Activity, Eye, Edit, Archive, Filter, AlertTriangle } from 'lucide-react';
import { getMockData } from '../lib/mockData';
import PatientConsultationFormComponent from '../components/PatientConsultationForm';

const Consultations = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const mockResponse = getMockData('consultations');
  const data = mockResponse.data;
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading consultations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Error loading consultations
      </div>
    );
  }

  const allConsultations = data?.data || [];
  
  const consultations = useMemo(() => {
    let filtered = allConsultations;
    
    if (searchTerm) {
      filtered = filtered.filter((consultation: any) =>
        consultation.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consultation.chief_complaint.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus) {
      filtered = filtered.filter((consultation: any) =>
        consultation.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }
    
    return filtered;
  }, [allConsultations, searchTerm, selectedStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleConsultationFormSubmit = (data: any) => {
    console.log('New consultation submitted:', data);
    alert('Consultation form submitted successfully! Check the console for details.');
    setActiveTab(0); // Return to consultations overview
  };

  const handleConsultationFormCancel = () => {
    setActiveTab(0); // Return to consultations overview
  };

  const tabs = [
    { id: 0, name: 'Consultations Overview', icon: Stethoscope, count: consultations.length },
    { id: 1, name: 'Consultation Cards', icon: FileText, count: consultations.length },
    { id: 2, name: 'New Consultation', icon: Plus, count: 0 },
    { id: 3, name: 'Medical Records', icon: Heart, count: consultations.length },
    { id: 4, name: 'Recent Activity', icon: Activity, count: 8 }
  ];

  const ConsultationsOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Consultations</p>
              <p className="text-3xl font-bold">{consultations.length}</p>
            </div>
            <Stethoscope className="h-12 w-12 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold">{consultations.filter((c: any) => c.status === 'Completed').length}</p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold">{consultations.filter((c: any) => c.status === 'In Progress').length}</p>
            </div>
            <Clock className="h-12 w-12 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Emergency</p>
              <p className="text-3xl font-bold">{consultations.filter((c: any) => c.is_emergency).length}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-200" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Filter className="h-5 w-5 mr-2 text-emerald-500" />
            Search & Filters
          </h3>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedStatus('');
            }}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Consultations</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:ring-emerald-500 transition-colors duration-200"
                placeholder="Search by patient, complaint..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:ring-emerald-500 transition-colors duration-200"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => setActiveTab(2)}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span>New Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Consultations Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-emerald-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Consultation Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Patient Information
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Chief Complaint
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Physician & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {consultations.map((consultation: any) => (
                <tr key={consultation.id} className="hover:bg-emerald-50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">
                          {consultation.consultation_id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(consultation.consultation_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        {consultation.patient_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {consultation.patient_id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {consultation.chief_complaint}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        Dr. {consultation.doctor}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(consultation.consultation_date).toLocaleTimeString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getStatusIcon(consultation.status)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                        {consultation.status}
                      </span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const ConsultationCardsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {consultations.map((consultation: any) => (
          <div key={consultation.id} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {consultation.consultation_id}
                  </h3>
                  <p className="text-sm text-gray-500">{consultation.patient_name}</p>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(consultation.status)}
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consultation.status)}`}>
                  {consultation.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600">
                  {new Date(consultation.consultation_date).toLocaleDateString()} at {new Date(consultation.consultation_date).toLocaleTimeString()}
                </span>
              </div>
              
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-600">Dr. {consultation.doctor}</span>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-500 font-medium">Chief Complaint:</span>
                <p className="text-gray-900 mt-1">{consultation.chief_complaint}</p>
              </div>
              
              {consultation.is_emergency && (
                <div className="flex items-center text-sm">
                  <AlertTriangle className="h-4 w-4 mr-2 text-red-400" />
                  <span className="text-red-600 font-medium">Emergency Case</span>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium">
                View Details
              </button>
              {consultation.status === 'In Progress' && (
                <button className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200 text-sm font-medium">
                  Complete
                </button>
              )}
              {consultation.status === 'Scheduled' && (
                <button className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200 text-sm font-medium">
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const NewConsultationTab = () => (
    <div className="max-w-6xl mx-auto">
      <PatientConsultationFormComponent 
        onSubmit={handleConsultationFormSubmit}
        onCancel={handleConsultationFormCancel}
      />
    </div>
  );

  const MedicalRecordsTab = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Consultation Medical Records</h3>
        <p className="text-gray-600 mb-6">Access detailed medical records and consultation history</p>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-200">
          Access Medical Records
        </button>
      </div>
    </div>
  );

  const RecentActivityTab = () => (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
      <div className="text-center py-12">
        <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Recent Consultation Activity</h3>
        <p className="text-gray-600 mb-6">Track recent consultations, updates, and physician notes</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200">
          View Activity Log
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-green-700 to-teal-800 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-3 tracking-tight">🩺 Consultation Management</h1>
                <p className="text-emerald-100 text-lg">Comprehensive consultation scheduling, tracking, and medical documentation</p>
              </div>
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <Stethoscope className="h-16 w-16 text-white/90 mx-auto mb-2" />
                  <p className="text-sm text-emerald-100 text-center">Consultation Hub</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 -right-8 opacity-20">
            <Stethoscope className="h-32 w-32 text-white" />
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
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg transform scale-105'
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
          {activeTab === 0 && <ConsultationsOverviewTab />}
          {activeTab === 1 && <ConsultationCardsTab />}
          {activeTab === 2 && <NewConsultationTab />}
          {activeTab === 3 && <MedicalRecordsTab />}
          {activeTab === 4 && <RecentActivityTab />}
        </div>
      </div>
    </div>
  );
};

export default Consultations;