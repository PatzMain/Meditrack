import { getMockData, mockMedicalSupplies, mockDentalSupplies, mockMedicalEquipment, mockDentalEquipment } from './mockData';
import { medicineApi } from './api';

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  page: string;
  icon: string;
  data: any;
}

export interface SearchResults {
  patients: SearchResult[];
  consultations: SearchResult[];
  medicalRecords: SearchResult[];
  medicines: SearchResult[];
  supplies: SearchResult[];
  equipment: SearchResult[];
}

export class UniversalSearch {
  private static instance: UniversalSearch;
  private searchData: SearchResults = {
    patients: [],
    consultations: [],
    medicalRecords: [],
    medicines: [],
    supplies: [],
    equipment: []
  };

  constructor() {
    this.indexData();
  }

  static getInstance(): UniversalSearch {
    if (!UniversalSearch.instance) {
      UniversalSearch.instance = new UniversalSearch();
    }
    return UniversalSearch.instance;
  }

  private async indexData() {
    // Index Patients
    const patientsData = getMockData('patients').data?.data || [];
    this.searchData.patients = patientsData.map((patient: any) => ({
      id: patient.id,
      title: `${patient.last_name}, ${patient.first_name} ${patient.middle_name || ''}`.trim(),
      subtitle: `Patient #${patient.patient_no}`,
      description: `${patient.age_computed} years old • ${patient.sex} • ${patient.contact_no} • ${patient.course ? `${patient.course} - ${patient.year_level}` : patient.department || 'General'}`,
      category: patient.course ? 'Student' : patient.employee_id ? 'Employee' : 'Other',
      page: 'Patients',
      icon: 'Users',
      data: patient
    }));

    // Index Consultations
    const consultationsData = getMockData('consultations').data?.data || [];
    this.searchData.consultations = consultationsData.map((consultation: any) => ({
      id: consultation.id,
      title: consultation.patient_name,
      subtitle: `Consultation #${consultation.consultation_id}`,
      description: `${consultation.chief_complaint} • Dr. ${consultation.doctor} • ${consultation.status} • ${new Date(consultation.consultation_date).toLocaleDateString()}`,
      category: consultation.status,
      page: 'Consultations',
      icon: 'Stethoscope',
      data: consultation
    }));

    // Index Medical Records (combination of patients and their consultation history)
    this.searchData.medicalRecords = patientsData.map((patient: any) => {
      const patientConsultations = consultationsData.filter(
        (consultation: any) => consultation.patient_id === patient.id
      );
      const totalVisits = patientConsultations.length;
      const lastVisit = patientConsultations.length > 0 
        ? new Date(Math.max(...patientConsultations.map((c: any) => new Date(c.consultation_date).getTime()))).toLocaleDateString()
        : 'No visits';

      return {
        id: `record-${patient.id}`,
        title: `${patient.last_name}, ${patient.first_name} ${patient.middle_name || ''}`.trim(),
        subtitle: `Medical Record • ${patient.patient_no}`,
        description: `${totalVisits} consultations • Last visit: ${lastVisit} • ${patient.age_computed} years • ${patient.sex}`,
        category: 'Medical Record',
        page: 'Medical Records',
        icon: 'FileText',
        data: { patient, consultations: patientConsultations }
      };
    });

    // Index Medicines from API
    try {
      const medicinesResponse = await medicineApi.getAll();
      const medicinesData = medicinesResponse.data.data || [];
      
      this.searchData.medicines = medicinesData.map((medicine: any) => ({
        id: `${medicine.type}-${medicine.id}`,
        title: medicine.name,
        subtitle: `${medicine.medicine_code} • ${medicine.type === 'medical' ? 'Medical' : 'Dental'}`,
        description: `${medicine.generic_name} - ${medicine.brand_name} • ${medicine.category} • ${medicine.quantity} units • Expires: ${new Date(medicine.expiry_date).toLocaleDateString()}`,
        category: medicine.category,
        page: 'Medicines',
        icon: 'Package',
        data: { ...medicine, department: medicine.type }
      }));
    } catch (error) {
      console.error('Failed to fetch medicines for search indexing:', error);
      this.searchData.medicines = [];
    }

    // Index Medical Supplies
    this.searchData.supplies = [
      ...mockMedicalSupplies.map((supply: any) => ({
        id: `medical-${supply.id}`,
        title: supply.name,
        subtitle: `${supply.supply_code} • Medical`,
        description: `${supply.category} • ${supply.quantity} ${supply.unit} • ${supply.supplier || 'No supplier'}`,
        category: supply.category,
        page: 'Supplies',
        icon: 'Archive',
        data: { ...supply, department: 'medical' }
      })),
      // Add Dental Supplies
      ...mockDentalSupplies.map((supply: any) => ({
        id: `dental-${supply.id}`,
        title: supply.name,
        subtitle: `${supply.supply_code} • Dental`,
        description: `${supply.category} • ${supply.quantity} ${supply.unit} • ${supply.supplier || 'No supplier'}`,
        category: supply.category,
        page: 'Supplies',
        icon: 'Archive',
        data: { ...supply, department: 'dental' }
      }))
    ];

    // Index Medical Equipment
    this.searchData.equipment = [
      ...mockMedicalEquipment.map((equipment: any) => ({
        id: `medical-${equipment.id}`,
        title: equipment.name,
        subtitle: `${equipment.equipment_code} • Medical`,
        description: `${equipment.category} • ${equipment.status} • ${equipment.location || 'No location'} • ${equipment.manufacturer || 'Unknown manufacturer'}`,
        category: equipment.category,
        page: 'Equipment',
        icon: 'Wrench',
        data: { ...equipment, department: 'medical' }
      })),
      // Add Dental Equipment
      ...mockDentalEquipment.map((equipment: any) => ({
        id: `dental-${equipment.id}`,
        title: equipment.name,
        subtitle: `${equipment.equipment_code} • Dental`,
        description: `${equipment.category} • ${equipment.status} • ${equipment.location || 'No location'} • ${equipment.manufacturer || 'Unknown manufacturer'}`,
        category: equipment.category,
        page: 'Equipment',
        icon: 'Wrench',
        data: { ...equipment, department: 'dental' }
      }))
    ];
  }

  search(query: string): SearchResult[] {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // Search across all categories
    Object.values(this.searchData).forEach(category => {
      category.forEach(item => {
        const searchableText = `${item.title} ${item.subtitle} ${item.description} ${item.category}`.toLowerCase();
        
        if (searchableText.includes(lowerQuery)) {
          results.push(item);
        }
      });
    });

    // Sort by relevance (title matches first, then subtitle, then description)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aSubtitle = a.subtitle.toLowerCase();
      const bSubtitle = b.subtitle.toLowerCase();

      if (aTitle.includes(lowerQuery) && !bTitle.includes(lowerQuery)) return -1;
      if (!aTitle.includes(lowerQuery) && bTitle.includes(lowerQuery)) return 1;
      if (aSubtitle.includes(lowerQuery) && !bSubtitle.includes(lowerQuery)) return -1;
      if (!aSubtitle.includes(lowerQuery) && bSubtitle.includes(lowerQuery)) return 1;
      
      return 0;
    });

    return results.slice(0, 20); // Limit to top 20 results
  }

  getResultsByCategory(query: string): SearchResults {
    if (!query || query.length < 2) {
      return {
        patients: [],
        consultations: [],
        medicalRecords: [],
        medicines: [],
        supplies: [],
        equipment: []
      };
    }

    const lowerQuery = query.toLowerCase();
    const results: SearchResults = {
      patients: [],
      consultations: [],
      medicalRecords: [],
      medicines: [],
      supplies: [],
      equipment: []
    };

    // Search in each category
    Object.keys(this.searchData).forEach((category) => {
      const categoryKey = category as keyof SearchResults;
      results[categoryKey] = this.searchData[categoryKey].filter((item: SearchResult) => {
        const searchableText = `${item.title} ${item.subtitle} ${item.description} ${item.category}`.toLowerCase();
        return searchableText.includes(lowerQuery);
      }).slice(0, 5); // Limit each category to 5 results
    });

    return results;
  }

  // Method to refresh medicines index
  async refreshMedicinesIndex() {
    try {
      const medicinesResponse = await medicineApi.getAll();
      const medicinesData = medicinesResponse.data.data || [];
      
      this.searchData.medicines = medicinesData.map((medicine: any) => ({
        id: `${medicine.type}-${medicine.id}`,
        title: medicine.name,
        subtitle: `${medicine.medicine_code} • ${medicine.type === 'medical' ? 'Medical' : 'Dental'}`,
        description: `${medicine.generic_name} - ${medicine.brand_name} • ${medicine.category} • ${medicine.quantity} units • Expires: ${new Date(medicine.expiry_date).toLocaleDateString()}`,
        category: medicine.category,
        page: 'Medicines',
        icon: 'Package',
        data: { ...medicine, department: medicine.type }
      }));
    } catch (error) {
      console.error('Failed to refresh medicines search index:', error);
    }
  }
}

export const universalSearch = UniversalSearch.getInstance();