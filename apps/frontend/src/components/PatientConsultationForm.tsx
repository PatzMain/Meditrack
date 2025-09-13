import React, { useState } from 'react';
import { User, FileText, Heart, ChevronRight, Save, Calendar, MapPin, Phone, AlertCircle } from 'lucide-react';

interface PersonalInfo {
  fullName: string;
  age: string;
  sex: 'Male' | 'Female' | 'Other' | '';
  civilStatus: 'Single' | 'Married' | 'Widowed' | 'Separated' | '';
  address: string;
  birthday: string;
  patientType: 'Employee' | 'Dependent' | 'Student' | 'OPD' | '';
  courseDepartment: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactNumber: string;
}

interface ConsultationDetails {
  chiefComplaint: string;
  previousConsultation: 'Yes' | 'No' | '';
  previousConsultationDate: string;
  diagnosis: string;
  medicationsPrescribed: string;
  modeOfArrival: 'Ambulatory' | 'Assisted' | 'Carried' | '';
  vitals: {
    bp: string;
    temperature: string;
    pulseRate: string;
    respiratoryRate: string;
    height: string;
    weight: string;
    oxygenSaturation: string;
  };
  lastMenstrualPeriod: string;
  patientInPain: 'Yes' | 'No' | '';
  patientWithInjuries: 'Yes' | 'No' | '';
  injuryType: 'Abrasion' | 'Laceration' | 'Contusion' | 'Fracture' | 'Puncture' | 'Sprain' | 'Other' | '';
}

interface MedicalBackground {
  allergies: {
    food: string;
    drugs: string;
    others: string;
  };
  familyHistory: {
    ptb: string;
    cancer: string;
    diabetes: string;
    cardiovascular: string;
    others: string;
  };
  medicalHistory: {
    seizures: string;
    cardio: string;
    neuro: string;
    asthma: string;
    ptb: string;
    surgery: string;
    obGyne: string;
    others: string;
  };
}

interface PatientConsultationFormProps {
  onSubmit?: (data: { personalInfo: PersonalInfo; consultationDetails: ConsultationDetails; medicalBackground: MedicalBackground }) => void;
  onCancel?: () => void;
}

const PatientConsultationForm: React.FC<PatientConsultationFormProps> = ({ onSubmit, onCancel }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: '',
    age: '',
    sex: '',
    civilStatus: '',
    address: '',
    birthday: '',
    patientType: '',
    courseDepartment: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactNumber: ''
  });

  const [consultationDetails, setConsultationDetails] = useState<ConsultationDetails>({
    chiefComplaint: '',
    previousConsultation: '',
    previousConsultationDate: '',
    diagnosis: '',
    medicationsPrescribed: '',
    modeOfArrival: '',
    vitals: {
      bp: '',
      temperature: '',
      pulseRate: '',
      respiratoryRate: '',
      height: '',
      weight: '',
      oxygenSaturation: ''
    },
    lastMenstrualPeriod: '',
    patientInPain: '',
    patientWithInjuries: '',
    injuryType: ''
  });

  const [medicalBackground, setMedicalBackground] = useState<MedicalBackground>({
    allergies: {
      food: '',
      drugs: '',
      others: ''
    },
    familyHistory: {
      ptb: '',
      cancer: '',
      diabetes: '',
      cardiovascular: '',
      others: ''
    },
    medicalHistory: {
      seizures: '',
      cardio: '',
      neuro: '',
      asthma: '',
      ptb: '',
      surgery: '',
      obGyne: '',
      others: ''
    }
  });

  const tabs = [
    { id: 0, name: 'Personal Information', icon: User, color: 'bg-blue-500' },
    { id: 1, name: 'Consultation Details', icon: FileText, color: 'bg-green-500' },
    { id: 2, name: 'Medical Background', icon: Heart, color: 'bg-red-500' }
  ];

  const handlePersonalInfoChange = (field: keyof PersonalInfo, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleConsultationDetailsChange = (field: string, value: string) => {
    if (field.startsWith('vitals.')) {
      const vitalField = field.replace('vitals.', '');
      setConsultationDetails(prev => ({
        ...prev,
        vitals: { ...prev.vitals, [vitalField]: value }
      }));
    } else {
      setConsultationDetails(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleMedicalBackgroundChange = (category: string, field: string, value: string) => {
    setMedicalBackground(prev => ({
      ...prev,
      [category]: { ...prev[category as keyof MedicalBackground], [field]: value }
    }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ personalInfo, consultationDetails, medicalBackground });
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="rounded-2xl shadow-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center mb-6">
          <User className="h-6 w-6 text-blue-500 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={personalInfo.fullName}
              onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={personalInfo.age}
              onChange={(e) => handlePersonalInfoChange('age', e.target.value)}
              placeholder="Enter age"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={personalInfo.sex}
              onChange={(e) => handlePersonalInfoChange('sex', e.target.value)}
            >
              <option value="">Select sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={personalInfo.civilStatus}
              onChange={(e) => handlePersonalInfoChange('civilStatus', e.target.value)}
            >
              <option value="">Select civil status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              value={personalInfo.address}
              onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
              placeholder="Enter complete address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Birthday</label>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={personalInfo.birthday}
              onChange={(e) => handlePersonalInfoChange('birthday', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient Type</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={personalInfo.patientType}
              onChange={(e) => handlePersonalInfoChange('patientType', e.target.value)}
            >
              <option value="">Select patient type</option>
              <option value="Employee">Employee</option>
              <option value="Dependent">Dependent</option>
              <option value="Student">Student</option>
              <option value="OPD">OPD</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Course / Department (if applicable)</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={personalInfo.courseDepartment}
              onChange={(e) => handlePersonalInfoChange('courseDepartment', e.target.value)}
              placeholder="Enter course or department"
            />
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center mb-6">
            <Phone className="h-6 w-6 text-red-500 mr-3" />
            <h4 className="text-lg font-semibold text-gray-900">Emergency Contact</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person's Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={personalInfo.emergencyContactName}
                onChange={(e) => handlePersonalInfoChange('emergencyContactName', e.target.value)}
                placeholder="Enter contact name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship to you</label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={personalInfo.emergencyContactRelationship}
                onChange={(e) => handlePersonalInfoChange('emergencyContactRelationship', e.target.value)}
                placeholder="e.g., Mother, Spouse, etc."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={personalInfo.emergencyContactNumber}
                onChange={(e) => handlePersonalInfoChange('emergencyContactNumber', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsultationDetails = () => (
    <div className="space-y-6">
      <div className="rounded-2xl shadow-lg border border-gray-200 bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-green-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Consultation Details</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-100 to-green-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/3">
                  Field
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Input
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Chief Complaint (main concern)</td>
                <td className="px-6 py-4">
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    value={consultationDetails.chiefComplaint}
                    onChange={(e) => handleConsultationDetailsChange('chiefComplaint', e.target.value)}
                    placeholder="Describe the main concern or symptoms"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Previous Consultation</td>
                <td className="px-6 py-4">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.previousConsultation}
                    onChange={(e) => handleConsultationDetailsChange('previousConsultation', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Date of Previous Consultation</td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.previousConsultationDate}
                    onChange={(e) => handleConsultationDetailsChange('previousConsultationDate', e.target.value)}
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Mode of Arrival</td>
                <td className="px-6 py-4">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.modeOfArrival}
                    onChange={(e) => handleConsultationDetailsChange('modeOfArrival', e.target.value)}
                  >
                    <option value="">Select mode of arrival</option>
                    <option value="Ambulatory">Ambulatory</option>
                    <option value="Assisted">Assisted</option>
                    <option value="Carried">Carried</option>
                  </select>
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Vital Signs - BP</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.vitals.bp}
                    onChange={(e) => handleConsultationDetailsChange('vitals.bp', e.target.value)}
                    placeholder="e.g., 120/80 mmHg"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Vital Signs - Temperature</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.vitals.temperature}
                    onChange={(e) => handleConsultationDetailsChange('vitals.temperature', e.target.value)}
                    placeholder="e.g., 36.5°C"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Vital Signs - Pulse Rate (PR)</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.vitals.pulseRate}
                    onChange={(e) => handleConsultationDetailsChange('vitals.pulseRate', e.target.value)}
                    placeholder="e.g., 72 bpm"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Vital Signs - Respiratory Rate (RR)</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.vitals.respiratoryRate}
                    onChange={(e) => handleConsultationDetailsChange('vitals.respiratoryRate', e.target.value)}
                    placeholder="e.g., 18 /min"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Height</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.vitals.height}
                    onChange={(e) => handleConsultationDetailsChange('vitals.height', e.target.value)}
                    placeholder="e.g., 170 cm"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Weight</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.vitals.weight}
                    onChange={(e) => handleConsultationDetailsChange('vitals.weight', e.target.value)}
                    placeholder="e.g., 65 kg"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Oxygen Saturation (O₂ Sat)</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.vitals.oxygenSaturation}
                    onChange={(e) => handleConsultationDetailsChange('vitals.oxygenSaturation', e.target.value)}
                    placeholder="e.g., 98%"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Last Menstrual Period (if applicable)</td>
                <td className="px-6 py-4">
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.lastMenstrualPeriod}
                    onChange={(e) => handleConsultationDetailsChange('lastMenstrualPeriod', e.target.value)}
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Patient in Pain?</td>
                <td className="px-6 py-4">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.patientInPain}
                    onChange={(e) => handleConsultationDetailsChange('patientInPain', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Patient with Injuries?</td>
                <td className="px-6 py-4">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.patientWithInjuries}
                    onChange={(e) => handleConsultationDetailsChange('patientWithInjuries', e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </td>
              </tr>
              
              <tr className="hover:bg-green-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">If injuries, specify type</td>
                <td className="px-6 py-4">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={consultationDetails.injuryType}
                    onChange={(e) => handleConsultationDetailsChange('injuryType', e.target.value)}
                    disabled={consultationDetails.patientWithInjuries !== 'Yes'}
                  >
                    <option value="">Select injury type</option>
                    <option value="Abrasion">Abrasion</option>
                    <option value="Laceration">Laceration</option>
                    <option value="Contusion">Contusion</option>
                    <option value="Fracture">Fracture</option>
                    <option value="Puncture">Puncture</option>
                    <option value="Sprain">Sprain</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMedicalBackground = () => (
    <div className="space-y-6">
      <div className="rounded-2xl shadow-lg border border-gray-200 bg-white overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-red-50">
          <div className="flex items-center">
            <Heart className="h-6 w-6 text-red-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Medical Background</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-100 to-red-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/3">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Options / Input
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Allergies Section */}
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Allergies - Food</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.allergies.food}
                    onChange={(e) => handleMedicalBackgroundChange('allergies', 'food', e.target.value)}
                    placeholder="List food allergies or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Allergies - Drugs</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.allergies.drugs}
                    onChange={(e) => handleMedicalBackgroundChange('allergies', 'drugs', e.target.value)}
                    placeholder="List drug allergies or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Allergies - Others</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.allergies.others}
                    onChange={(e) => handleMedicalBackgroundChange('allergies', 'others', e.target.value)}
                    placeholder="List other allergies or N/A"
                  />
                </td>
              </tr>
              
              {/* Family History Section */}
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Family History - PTB</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.familyHistory.ptb}
                    onChange={(e) => handleMedicalBackgroundChange('familyHistory', 'ptb', e.target.value)}
                    placeholder="Family history of PTB or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Family History - Cancer</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.familyHistory.cancer}
                    onChange={(e) => handleMedicalBackgroundChange('familyHistory', 'cancer', e.target.value)}
                    placeholder="Family history of cancer or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Family History - Diabetes (DM)</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.familyHistory.diabetes}
                    onChange={(e) => handleMedicalBackgroundChange('familyHistory', 'diabetes', e.target.value)}
                    placeholder="Family history of diabetes or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Family History - Cardiovascular Disease</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.familyHistory.cardiovascular}
                    onChange={(e) => handleMedicalBackgroundChange('familyHistory', 'cardiovascular', e.target.value)}
                    placeholder="Family history of cardiovascular disease or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Family History - Others</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.familyHistory.others}
                    onChange={(e) => handleMedicalBackgroundChange('familyHistory', 'others', e.target.value)}
                    placeholder="Other family history or N/A"
                  />
                </td>
              </tr>
              
              {/* Medical History Section */}
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Medical History - Seizures</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.medicalHistory.seizures}
                    onChange={(e) => handleMedicalBackgroundChange('medicalHistory', 'seizures', e.target.value)}
                    placeholder="History of seizures or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Medical History - Cardio</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.medicalHistory.cardio}
                    onChange={(e) => handleMedicalBackgroundChange('medicalHistory', 'cardio', e.target.value)}
                    placeholder="Cardiovascular history or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Medical History - Neuro</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.medicalHistory.neuro}
                    onChange={(e) => handleMedicalBackgroundChange('medicalHistory', 'neuro', e.target.value)}
                    placeholder="Neurological history or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Medical History - Asthma</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.medicalHistory.asthma}
                    onChange={(e) => handleMedicalBackgroundChange('medicalHistory', 'asthma', e.target.value)}
                    placeholder="History of asthma or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Medical History - PTB</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.medicalHistory.ptb}
                    onChange={(e) => handleMedicalBackgroundChange('medicalHistory', 'ptb', e.target.value)}
                    placeholder="History of PTB or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Medical History - Surgery</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.medicalHistory.surgery}
                    onChange={(e) => handleMedicalBackgroundChange('medicalHistory', 'surgery', e.target.value)}
                    placeholder="Surgical history or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Medical History - OB-Gyne</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.medicalHistory.obGyne}
                    onChange={(e) => handleMedicalBackgroundChange('medicalHistory', 'obGyne', e.target.value)}
                    placeholder="OB-Gyne history or N/A"
                  />
                </td>
              </tr>
              
              <tr className="hover:bg-red-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Medical History - Others</td>
                <td className="px-6 py-4">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    value={medicalBackground.medicalHistory.others}
                    onChange={(e) => handleMedicalBackgroundChange('medicalHistory', 'others', e.target.value)}
                    placeholder="Other medical history or N/A"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🏥 Interactive Patient Consultation Form</h1>
        <p className="text-gray-600">This form is divided into 3 tabs for easier navigation. Please complete all required fields.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 flex-1 ${
                activeTab === tab.id
                  ? `${tab.color} text-white shadow-lg transform scale-105`
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">Tab {tab.id + 1}</span>
              {activeTab === tab.id && <ChevronRight className="h-4 w-4 ml-2" />}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mb-6">
        {activeTab === 0 && renderPersonalInfo()}
        {activeTab === 1 && renderConsultationDetails()}
        {activeTab === 2 && renderMedicalBackground()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <button
          onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
          disabled={activeTab === 0}
          className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            activeTab === 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          Previous
        </button>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <AlertCircle className="h-4 w-4" />
          <span>Please review your answers before submission</span>
        </div>

        {activeTab < tabs.length - 1 ? (
          <button
            onClick={() => setActiveTab(Math.min(tabs.length - 1, activeTab + 1))}
            className="flex items-center px-6 py-3 rounded-xl font-medium text-white bg-blue-500 hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        ) : (
          <div className="flex space-x-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex items-center px-6 py-3 rounded-xl font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="flex items-center px-6 py-3 rounded-xl font-medium text-white bg-green-500 hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
            >
              <Save className="h-4 w-4 mr-2" />
              Submit Form
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> The physician will complete the following during consultation: Diagnosis, Doctor's Orders (SOAP notes), and Interventions.
        </p>
      </div>
    </div>
  );
};

export default PatientConsultationForm;