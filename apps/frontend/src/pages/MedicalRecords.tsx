import React, { useState, useEffect } from 'react';
import { FileText, Search, Users, Stethoscope, Calendar, MapPin, Phone, Clock, Filter, Eye, Download, AlertCircle } from 'lucide-react';
import { getMockData } from '../lib/mockData';
import { useSearchHighlight, scrollToHighlightedElement } from '../lib/searchHighlight';

interface Patient {
  id: string;
  patient_no: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  age_computed: number;
  sex: string;
  contact_no: string;
  address: string;
  course?: string;
  year_level?: string;
  department?: string;
  employee_id?: string;
}

interface Consultation {
  id: string;
  consultation_id: string;
  patient_id: string;
  patient_name: string;
  chief_complaint: string;
  diagnosis: string;
  treatment: string;
  doctor: string;
  consultation_date: string;
  status: string;
  vital_signs?: {
    blood_pressure: string;
    temperature: string;
    heart_rate: string;
    respiratory_rate: string;
  };
}

interface MedicalRecord {
  patient: Patient;
  consultations: Consultation[];
  lastVisit?: string;
  totalVisits: number;
}

const MedicalRecords = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'emergency'>('all');
  const { highlightId, isHighlighted, getHighlightStyle } = useSearchHighlight();

  useEffect(() => {
    loadMedicalRecords();
  }, []);

  useEffect(() => {
    if (highlightId) {
      scrollToHighlightedElement(highlightId);
    }
  }, [highlightId, medicalRecords]);

  const loadMedicalRecords = () => {
    setLoading(true);
    try {
      const patientsData = getMockData('patients').data?.data || [];
      const consultationsData = getMockData('consultations').data?.data || [];

      // Group consultations by patient
      const recordsMap = new Map<string, MedicalRecord>();

      patientsData.forEach((patient: Patient) => {
        const patientConsultations = consultationsData.filter(
          (consultation: Consultation) => consultation.patient_id === patient.id
        );

        const lastVisit = patientConsultations.length > 0 
          ? Math.max(...patientConsultations.map(c => new Date(c.consultation_date).getTime()))
          : undefined;

        recordsMap.set(patient.id, {
          patient,
          consultations: patientConsultations,
          lastVisit: lastVisit ? new Date(lastVisit).toISOString() : undefined,
          totalVisits: patientConsultations.length
        });
      });

      setMedicalRecords(Array.from(recordsMap.values()));
    } catch (error) {
      console.error('Error loading medical records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = medicalRecords.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      record.patient.first_name.toLowerCase().includes(searchLower) ||
      record.patient.last_name.toLowerCase().includes(searchLower) ||
      record.patient.patient_no.toLowerCase().includes(searchLower) ||
      record.consultations.some(c => 
        c.chief_complaint.toLowerCase().includes(searchLower) ||
        c.diagnosis.toLowerCase().includes(searchLower)
      );

    if (!matchesSearch) return false;

    if (filterType === 'recent') {
      return record.lastVisit && 
        new Date(record.lastVisit) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
    } else if (filterType === 'emergency') {
      return record.consultations.some(c => c.status === 'Emergency');
    }

    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-12 w-12 mr-4" />
              <div>
                <h1 className="text-4xl font-bold">Medical Records</h1>
                <p className="text-rose-100 text-lg">Patient medical records and consultation history</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-rose-100">Total Records</p>
              <p className="text-3xl font-bold">{medicalRecords.length}</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by patient name, ID, or medical condition..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="all">All Records</option>
                <option value="recent">Recent Visits</option>
                <option value="emergency">Emergency Cases</option>
              </select>
            </div>
          </div>
        </div>

        {/* Medical Records List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading medical records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No records found</h3>
              <p className="text-gray-600">No medical records match your search criteria.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <div 
                  key={record.patient.id} 
                  data-id={`record-${record.patient.id}`}
                  className={`p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${getHighlightStyle(`record-${record.patient.id}`)}`}
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {record.patient.first_name.charAt(0)}{record.patient.last_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {record.patient.last_name}, {record.patient.first_name} {record.patient.middle_name || ''}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {record.patient.patient_no}
                          </span>
                          <span>{record.patient.age_computed} years • {record.patient.sex}</span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {record.patient.contact_no}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="flex items-center text-sm text-gray-600">
                          <Stethoscope className="h-4 w-4 mr-1" />
                          {record.totalVisits} visits
                        </span>
                        {record.consultations.some(c => c.status === 'Emergency') && (
                          <span className="flex items-center text-red-600">
                            <AlertCircle className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                      {record.lastVisit && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          Last visit: {new Date(record.lastVisit).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Recent Consultations Preview */}
                  {record.consultations.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Recent Consultations:</span>
                        <button className="text-rose-600 hover:text-rose-700 text-sm font-medium flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View All
                        </button>
                      </div>
                      <div className="mt-2 space-y-2">
                        {record.consultations.slice(0, 2).map((consultation) => (
                          <div key={consultation.id} className="flex items-center justify-between text-sm">
                            <div>
                              <span className="font-medium">{consultation.chief_complaint}</span>
                              <span className="text-gray-500 ml-2">• Dr. {consultation.doctor}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(consultation.status)}`}>
                                {consultation.status}
                              </span>
                              <span className="text-gray-500">
                                {new Date(consultation.consultation_date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Record Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {selectedRecord.patient.first_name.charAt(0)}{selectedRecord.patient.last_name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedRecord.patient.last_name}, {selectedRecord.patient.first_name} {selectedRecord.patient.middle_name || ''}
                      </h2>
                      <div className="flex items-center space-x-4 text-gray-600">
                        <span>{selectedRecord.patient.patient_no}</span>
                        <span>{selectedRecord.patient.age_computed} years • {selectedRecord.patient.sex}</span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {selectedRecord.patient.address}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-rose-600 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => setSelectedRecord(null)}
                      className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Consultation History</h3>
                {selectedRecord.consultations.length === 0 ? (
                  <p className="text-gray-600">No consultations recorded for this patient.</p>
                ) : (
                  <div className="space-y-4">
                    {selectedRecord.consultations.map((consultation) => (
                      <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{consultation.consultation_id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(consultation.status)}`}>
                              {consultation.status}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(consultation.consultation_date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Chief Complaint</h4>
                            <p className="text-gray-700">{consultation.chief_complaint}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Diagnosis</h4>
                            <p className="text-gray-700">{consultation.diagnosis}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Treatment</h4>
                            <p className="text-gray-700">{consultation.treatment}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">Attending Doctor</h4>
                            <p className="text-gray-700">Dr. {consultation.doctor}</p>
                          </div>
                        </div>
                        
                        {consultation.vital_signs && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <h4 className="font-medium text-gray-900 mb-2">Vital Signs</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div><span className="font-medium">BP:</span> {consultation.vital_signs.blood_pressure}</div>
                              <div><span className="font-medium">Temp:</span> {consultation.vital_signs.temperature}</div>
                              <div><span className="font-medium">HR:</span> {consultation.vital_signs.heart_rate}</div>
                              <div><span className="font-medium">RR:</span> {consultation.vital_signs.respiratory_rate}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;