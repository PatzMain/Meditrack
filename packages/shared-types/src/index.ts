// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// User Types
export type UserRole = 'admin' | 'doctor' | 'nurse' | 'staff' | 'viewer';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  license_number?: string;
  department?: string;
  position?: string;
  phone?: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

// Patient Types
export type PatientType = 'Student' | 'Employee' | 'Dependent' | 'OPD' | 'Emergency';

export interface Patient {
  id: string;
  patient_no: string;
  last_name: string;
  first_name: string;
  middle_name?: string;
  suffix?: string;
  sex: 'Male' | 'Female' | 'Other';
  civil_status?: string;
  birth_date: Date;
  age_computed: number;
  address?: any;
  course?: string;
  year_level?: string;
  department?: string;
  employee_id?: string;
  contact_no?: string;
  email?: string;
  emergency_contacts?: any[];
  insurance_provider?: string;
  insurance_number?: string;
  blood_type?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

// Consultation Types
export type ConsultationStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';

export interface Consultation {
  id: string;
  consultation_no: string;
  patient_id: string;
  status: ConsultationStatus;
  type: PatientType;
  date: Date;
  time_in?: string;
  time_out?: string;
  duration_minutes?: number;
  chief_complaint: string;
  history_present_illness?: string;
  prev_consultations?: any[];
  emergency_contact?: any;
  mode_of_arrival?: 'Ambulatory' | 'Assisted' | 'Wheelchair' | 'Stretcher' | 'Carried';
  triage_priority?: number;
  vitals?: any;
  physical_exam?: any;
  pain_assessment?: any;
  injury_assessment?: any;
  gcs_eye?: number;
  gcs_verbal?: number;
  gcs_motor?: number;
  gcs_total?: number;
  soap?: any;
  diagnosis?: string[];
  differential_diagnosis?: string[];
  doctors_orders?: string[];
  interventions_performed?: string[];
  medications_prescribed?: any[];
  allergies?: any;
  medical_history?: any;
  family_history?: any;
  social_history?: any;
  attending_physician: string;
  consulting_physician?: string;
  referred_to?: string;
  follow_up_date?: Date;
  follow_up_instructions?: string;
  valuables_deposited?: boolean;
  valuables_description?: string;
  valuables_released_to?: string;
  valuables_released_at?: Date;
  is_emergency: boolean;
  is_referred: boolean;
  is_admitted: boolean;
  discharge_time?: Date;
  discharge_condition?: string;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by?: string;
}

// Medicine Types
export interface Medicine {
  id: string;
  name: string;
  generic_name?: string;
  brand_name?: string;
  category: string;
  form?: string;
  strength?: string;
  lot_no?: string;
  expiry_date?: Date;
  quantity: number;
  unit_cost?: number;
  reorder_threshold: number;
  max_stock_level?: number;
  location?: string;
  supplier?: string;
  last_restocked_date?: Date;
  notes?: string;
  is_active: boolean;
  requires_prescription: boolean;
  storage_conditions?: string;
  raw_source?: any;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by?: string;
}

// Equipment Types
export type EquipmentCondition = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Out of Service';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  condition: EquipmentCondition;
  quantity: number;
  purchase_date?: Date;
  purchase_cost?: number;
  warranty_expiry?: Date;
  last_maintenance_date?: Date;
  next_maintenance_date?: Date;
  maintenance_interval_months: number;
  usage_count: number;
  location?: string;
  responsible_person?: string;
  manual_url?: string;
  notes?: string;
  is_active: boolean;
  calibration_due_date?: Date;
  raw_source?: any;
  created_at: Date;
  updated_at: Date;
  created_by: string;
  updated_by?: string;
}