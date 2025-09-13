// Mock data for development and demonstration
export const mockMedicalMedicines = [
  {
    id: '1',
    medicine_code: 'MED001',
    name: 'Aspirin',
    generic_name: 'Acetylsalicylic Acid',
    brand_name: 'Bayer Aspirin',
    category: 'Pain Reliever',
    department: 'medical',
    form: 'Tablet',
    strength: '325mg',
    quantity: 150,
    reorder_threshold: 30,
    unit_cost: 8.50,
    expiry_date: '2026-12-31',
    created_at: '2025-01-15T08:00:00Z',
    updated_at: '2025-09-10T10:00:00Z'
  },
  {
    id: '2',
    medicine_code: 'MED002',
    name: 'Amoxicillin',
    generic_name: 'Amoxicillin Trihydrate',
    brand_name: 'Amoxil',
    category: 'Antibiotic',
    department: 'medical',
    form: 'Capsule',
    strength: '500mg',
    quantity: 75,
    reorder_threshold: 20,
    unit_cost: 48.00,
    expiry_date: '2026-08-15',
    created_at: '2025-02-01T10:30:00Z',
    updated_at: '2025-09-10T11:15:00Z'
  },
  {
    id: '3',
    medicine_code: 'MED003',
    name: 'Ibuprofen',
    generic_name: 'Ibuprofen',
    brand_name: 'Advil',
    category: 'Anti-inflammatory',
    department: 'medical',
    form: 'Tablet',
    strength: '200mg',
    quantity: 200,
    reorder_threshold: 50,
    unit_cost: 14.25,
    expiry_date: '2027-03-20',
    created_at: '2025-03-10T14:20:00Z',
    updated_at: '2025-09-10T12:30:00Z'
  },
  {
    id: '4',
    medicine_code: 'MED004',
    name: 'Paracetamol',
    generic_name: 'Acetaminophen',
    brand_name: 'Tylenol',
    category: 'Analgesic',
    department: 'medical',
    form: 'Syrup',
    strength: '160mg/5ml',
    quantity: 45,
    reorder_threshold: 15,
    unit_cost: 141.25,
    expiry_date: '2026-06-10',
    created_at: '2025-04-05T16:45:00Z',
    updated_at: '2025-09-10T13:20:00Z'
  },
  {
    id: '5',
    medicine_code: 'MED005',
    name: 'Omeprazole',
    generic_name: 'Omeprazole',
    brand_name: 'Prilosec',
    category: 'Proton Pump Inhibitor',
    department: 'medical',
    form: 'Capsule',
    strength: '20mg',
    quantity: 120,
    reorder_threshold: 25,
    unit_cost: 98.90,
    expiry_date: '2026-11-30',
    created_at: '2025-05-20T09:15:00Z',
    updated_at: '2025-09-10T14:10:00Z'
  }
];

export const mockDentalMedicines = [
  {
    id: '6',
    medicine_code: 'DEN001',
    name: 'Lidocaine',
    generic_name: 'Lidocaine Hydrochloride',
    brand_name: 'Xylocaine',
    category: 'Local Anesthetic',
    department: 'dental',
    form: 'Injection',
    strength: '2%',
    quantity: 50,
    reorder_threshold: 10,
    unit_cost: 211.90,
    expiry_date: '2026-09-15',
    created_at: '2025-02-20T09:00:00Z',
    updated_at: '2025-09-10T10:30:00Z'
  },
  {
    id: '7',
    medicine_code: 'DEN002',
    name: 'Fluoride Varnish',
    generic_name: 'Sodium Fluoride',
    brand_name: 'Duraphat',
    category: 'Preventive Treatment',
    department: 'dental',
    form: 'Varnish',
    strength: '5%',
    quantity: 25,
    reorder_threshold: 5,
    unit_cost: 706.25,
    expiry_date: '2027-01-20',
    created_at: '2025-03-15T11:30:00Z',
    updated_at: '2025-09-10T11:45:00Z'
  },
  {
    id: '8',
    medicine_code: 'DEN003',
    name: 'Chlorhexidine Mouthwash',
    generic_name: 'Chlorhexidine Gluconate',
    brand_name: 'Peridex',
    category: 'Antiseptic',
    department: 'dental',
    form: 'Solution',
    strength: '0.12%',
    quantity: 40,
    reorder_threshold: 8,
    unit_cost: 502.85,
    expiry_date: '2026-11-10',
    created_at: '2025-04-10T13:15:00Z',
    updated_at: '2025-09-10T12:20:00Z'
  },
  {
    id: '9',
    medicine_code: 'DEN004',
    name: 'Dental Cement',
    generic_name: 'Glass Ionomer Cement',
    brand_name: 'Fuji IX',
    category: 'Restorative Material',
    department: 'dental',
    form: 'Powder',
    strength: '50g',
    quantity: 15,
    reorder_threshold: 3,
    unit_cost: 2542.50,
    expiry_date: '2027-05-30',
    created_at: '2025-05-05T15:20:00Z',
    updated_at: '2025-09-10T13:10:00Z'
  },
  {
    id: '10',
    medicine_code: 'DEN005',
    name: 'Articaine',
    generic_name: 'Articaine Hydrochloride',
    brand_name: 'Septocaine',
    category: 'Local Anesthetic',
    department: 'dental',
    form: 'Injection',
    strength: '4%',
    quantity: 30,
    reorder_threshold: 6,
    unit_cost: 240.13,
    expiry_date: '2026-12-25',
    created_at: '2025-06-01T16:45:00Z',
    updated_at: '2025-09-10T14:00:00Z'
  }
];

export const mockMedicines = [...mockMedicalMedicines, ...mockDentalMedicines];

export const mockMedicalSupplies = [
  {
    id: '1',
    supply_code: 'SUP001',
    name: 'Disposable Gloves',
    description: 'Latex-free nitrile examination gloves, powder-free',
    category: 'Personal Protective Equipment',
    department: 'medical',
    unit: 'boxes',
    quantity: 125,
    reorder_threshold: 30,
    supplier: 'MedSupply Pro',
    cost_per_unit: 1059.40,
    created_at: '2025-01-20T09:00:00Z',
    updated_at: '2025-09-10T08:30:00Z'
  },
  {
    id: '2',
    supply_code: 'SUP002',
    name: 'Surgical Masks',
    description: '3-layer disposable surgical face masks',
    category: 'Personal Protective Equipment',
    department: 'medical',
    unit: 'boxes',
    quantity: 85,
    reorder_threshold: 20,
    supplier: 'SafeGuard Medical',
    cost_per_unit: 706.25,
    created_at: '2025-02-12T11:15:00Z',
    updated_at: '2025-09-10T09:45:00Z'
  },
  {
    id: '3',
    supply_code: 'SUP003',
    name: 'Cotton Swabs',
    description: 'Sterile cotton-tipped applicators for medical use',
    category: 'General Supplies',
    department: 'medical',
    unit: 'packs',
    quantity: 65,
    reorder_threshold: 15,
    supplier: 'CleanCare Solutions',
    cost_per_unit: 183.65,
    created_at: '2025-03-05T14:30:00Z',
    updated_at: '2025-09-10T10:20:00Z'
  },
  {
    id: '4',
    supply_code: 'SUP004',
    name: 'Bandages',
    description: 'Adhesive bandages various sizes assorted pack',
    category: 'Wound Care',
    department: 'medical',
    unit: 'boxes',
    quantity: 40,
    reorder_threshold: 10,
    supplier: 'WoundCare Plus',
    cost_per_unit: 505.70,
    created_at: '2025-04-18T16:00:00Z',
    updated_at: '2025-09-10T11:10:00Z'
  },
  {
    id: '5',
    supply_code: 'SUP005',
    name: 'Antiseptic Solution',
    description: 'Povidone iodine antiseptic solution 10%',
    category: 'Disinfectants',
    department: 'medical',
    unit: 'bottles',
    quantity: 30,
    reorder_threshold: 8,
    supplier: 'PharmaChem Ltd',
    cost_per_unit: 881.40,
    created_at: '2025-05-10T13:45:00Z',
    updated_at: '2025-09-10T12:55:00Z'
  }
];

export const mockDentalSupplies = [
  {
    id: '6',
    supply_code: 'DSU001',
    name: 'Dental Bibs',
    description: 'Disposable patient bibs for dental procedures',
    category: 'Patient Care',
    department: 'dental',
    unit: 'boxes',
    quantity: 75,
    reorder_threshold: 15,
    supplier: 'DentalCare Pro',
    cost_per_unit: 1271.25,
    created_at: '2025-02-25T10:00:00Z',
    updated_at: '2025-09-10T09:15:00Z'
  },
  {
    id: '7',
    supply_code: 'DSU002',
    name: 'High-Speed Handpiece Tips',
    description: 'Disposable tips for high-speed dental handpieces',
    category: 'Dental Instruments',
    department: 'dental',
    unit: 'packs',
    quantity: 35,
    reorder_threshold: 8,
    supplier: 'DentalTech Solutions',
    cost_per_unit: 2542.50,
    created_at: '2025-03-20T11:30:00Z',
    updated_at: '2025-09-10T10:45:00Z'
  },
  {
    id: '8',
    supply_code: 'DSU003',
    name: 'Dental Impression Trays',
    description: 'Disposable plastic impression trays, assorted sizes',
    category: 'Impression Materials',
    department: 'dental',
    unit: 'sets',
    quantity: 50,
    reorder_threshold: 12,
    supplier: 'ImpressionCare Ltd',
    cost_per_unit: 1059.40,
    created_at: '2025-04-15T13:15:00Z',
    updated_at: '2025-09-10T11:30:00Z'
  },
  {
    id: '9',
    supply_code: 'DSU004',
    name: 'Dental Gauze',
    description: 'Sterile dental gauze pads for oral procedures',
    category: 'Wound Care',
    department: 'dental',
    unit: 'boxes',
    quantity: 25,
    reorder_threshold: 5,
    supplier: 'SterileCare Medical',
    cost_per_unit: 728.85,
    created_at: '2025-05-08T15:45:00Z',
    updated_at: '2025-09-10T12:20:00Z'
  },
  {
    id: '10',
    supply_code: 'DSU005',
    name: 'Saliva Ejectors',
    description: 'Disposable saliva ejector tips with flexible tubing',
    category: 'Suction Equipment',
    department: 'dental',
    unit: 'boxes',
    quantity: 60,
    reorder_threshold: 10,
    supplier: 'DentalFlow Systems',
    cost_per_unit: 1610.25,
    created_at: '2025-06-12T14:20:00Z',
    updated_at: '2025-09-10T13:05:00Z'
  }
];

export const mockSupplies = [...mockMedicalSupplies, ...mockDentalSupplies];

export const mockMedicalEquipment = [
  {
    id: '1',
    equipment_code: 'EQP001',
    name: 'Digital Blood Pressure Monitor',
    description: 'Automatic digital BP monitor with memory function',
    category: 'Diagnostic Equipment',
    department: 'medical',
    manufacturer: 'Omron Healthcare',
    model: 'HEM-7120',
    serial_number: 'OM2025001',
    purchase_date: '2025-01-25',
    warranty_expiry: '2027-01-25',
    location: 'Medical Examination Room 1',
    status: 'active',
    quantity: 3,
    cost_per_unit: 4802.50,
    created_at: '2025-01-25T10:00:00Z',
    updated_at: '2025-09-10T08:15:00Z'
  },
  {
    id: '2',
    equipment_code: 'EQP002',
    name: 'Stethoscope',
    description: 'Dual-head stethoscope for cardiac and pulmonary examination',
    category: 'Examination Tools',
    department: 'medical',
    manufacturer: '3M Littmann',
    model: 'Classic III',
    serial_number: '3M2025002',
    purchase_date: '2025-02-10',
    warranty_expiry: '2027-02-10',
    location: 'Medical General Use',
    status: 'active',
    quantity: 8,
    cost_per_unit: 9887.50,
    created_at: '2025-02-10T11:30:00Z',
    updated_at: '2025-09-10T09:20:00Z'
  },
  {
    id: '3',
    equipment_code: 'EQP003',
    name: 'Digital Thermometer',
    description: 'Fast-reading digital thermometer with fever alert',
    category: 'Diagnostic Equipment',
    department: 'medical',
    manufacturer: 'Braun Healthcare',
    model: 'ThermoScan 7',
    serial_number: 'BR2025003',
    purchase_date: '2025-03-08',
    warranty_expiry: '2026-03-08',
    location: 'Medical Triage Station',
    status: 'active',
    quantity: 5,
    cost_per_unit: 2542.50,
    created_at: '2025-03-08T14:15:00Z',
    updated_at: '2025-09-10T10:45:00Z'
  },
  {
    id: '4',
    equipment_code: 'EQP004',
    name: 'Pulse Oximeter',
    description: 'Fingertip pulse oximeter for SpO2 and pulse monitoring',
    category: 'Monitoring Equipment',
    department: 'medical',
    manufacturer: 'Masimo',
    model: 'MightySat Rx',
    serial_number: 'MS2025004',
    purchase_date: '2025-04-15',
    warranty_expiry: '2027-04-15',
    location: 'Medical Emergency Room',
    status: 'maintenance',
    quantity: 4,
    cost_per_unit: 15537.50,
    created_at: '2025-04-15T16:30:00Z',
    updated_at: '2025-09-10T11:55:00Z'
  },
  {
    id: '5',
    equipment_code: 'EQP005',
    name: 'Examination Light',
    description: 'LED examination light with adjustable intensity',
    category: 'Lighting Equipment',
    department: 'medical',
    manufacturer: 'Welch Allyn',
    model: 'GS 300',
    serial_number: 'WA2025005',
    purchase_date: '2025-05-22',
    warranty_expiry: '2028-05-22',
    location: 'Medical Procedure Room',
    status: 'active',
    quantity: 2,
    cost_per_unit: 24012.50,
    created_at: '2025-05-22T13:20:00Z',
    updated_at: '2025-09-10T12:40:00Z'
  }
];

export const mockDentalEquipment = [
  {
    id: '6',
    equipment_code: 'DEQ001',
    name: 'Dental Unit Chair',
    description: 'Complete dental treatment unit with integrated chair',
    category: 'Treatment Equipment',
    department: 'dental',
    manufacturer: 'KaVo Dental',
    model: 'Estetica E70',
    serial_number: 'KV2025001',
    purchase_date: '2025-02-15',
    warranty_expiry: '2030-02-15',
    location: 'Dental Treatment Room 1',
    status: 'active',
    quantity: 2,
    cost_per_unit: 847500.00,
    created_at: '2025-02-15T09:00:00Z',
    updated_at: '2025-09-10T08:45:00Z'
  },
  {
    id: '7',
    equipment_code: 'DEQ002',
    name: 'Digital Dental X-Ray',
    description: 'Digital intraoral X-ray imaging system',
    category: 'Imaging Equipment',
    department: 'dental',
    manufacturer: 'Dentsply Sirona',
    model: 'XIOS Supreme',
    serial_number: 'DS2025002',
    purchase_date: '2025-03-20',
    warranty_expiry: '2028-03-20',
    location: 'Dental Radiology Room',
    status: 'active',
    quantity: 1,
    cost_per_unit: 480250.00,
    created_at: '2025-03-20T11:15:00Z',
    updated_at: '2025-09-10T09:30:00Z'
  },
  {
    id: '8',
    equipment_code: 'DEQ003',
    name: 'Ultrasonic Scaler',
    description: 'Ultrasonic dental scaling and cleaning device',
    category: 'Cleaning Equipment',
    department: 'dental',
    manufacturer: 'EMS Dental',
    model: 'Piezon Master 700',
    serial_number: 'EMS2025003',
    purchase_date: '2025-04-10',
    warranty_expiry: '2027-04-10',
    location: 'Dental Hygiene Room',
    status: 'active',
    quantity: 3,
    cost_per_unit: 155375.00,
    created_at: '2025-04-10T14:30:00Z',
    updated_at: '2025-09-10T10:15:00Z'
  },
  {
    id: '9',
    equipment_code: 'DEQ004',
    name: 'Dental Autoclave',
    description: 'Steam sterilization unit for dental instruments',
    category: 'Sterilization Equipment',
    department: 'dental',
    manufacturer: 'Tuttnauer',
    model: '3870EA',
    serial_number: 'TT2025004',
    purchase_date: '2025-05-05',
    warranty_expiry: '2027-05-05',
    location: 'Dental Sterilization Room',
    status: 'maintenance',
    quantity: 2,
    cost_per_unit: 180800.00,
    created_at: '2025-05-05T16:20:00Z',
    updated_at: '2025-09-10T11:00:00Z'
  },
  {
    id: '10',
    equipment_code: 'DEQ005',
    name: 'Dental Compressor',
    description: 'Oil-free dental air compressor system',
    category: 'Support Equipment',
    department: 'dental',
    manufacturer: 'Air Techniques',
    model: 'AirStar 30',
    serial_number: 'AT2025005',
    purchase_date: '2025-06-18',
    warranty_expiry: '2028-06-18',
    location: 'Dental Equipment Room',
    status: 'active',
    quantity: 1,
    cost_per_unit: 271200.00,
    created_at: '2025-06-18T13:45:00Z',
    updated_at: '2025-09-10T12:30:00Z'
  }
];

export const mockEquipment = [...mockMedicalEquipment, ...mockDentalEquipment];

export const mockPatients = [
  {
    id: '1',
    patient_no: 'PAT2025001',
    first_name: 'John',
    middle_name: 'Michael',
    last_name: 'Smith',
    sex: 'Male',
    age_computed: 25,
    blood_type: 'O+',
    contact_no: '+1-555-0101',
    email: 'john.smith@email.com',
    course: 'Computer Science',
    year_level: '4th Year',
    created_at: '2025-01-10T09:00:00Z',
    updated_at: '2025-09-10T08:00:00Z'
  },
  {
    id: '2',
    patient_no: 'PAT2025002',
    first_name: 'Maria',
    middle_name: 'Elena',
    last_name: 'Rodriguez',
    sex: 'Female',
    age_computed: 32,
    blood_type: 'A+',
    contact_no: '+1-555-0102',
    email: 'maria.rodriguez@email.com',
    employee_id: 'EMP001',
    department: 'Human Resources',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-09-10T08:30:00Z'
  },
  {
    id: '3',
    patient_no: 'PAT2025003',
    first_name: 'David',
    middle_name: 'James',
    last_name: 'Johnson',
    sex: 'Male',
    age_computed: 19,
    blood_type: 'B-',
    contact_no: '+1-555-0103',
    email: 'david.johnson@email.com',
    course: 'Nursing',
    year_level: '2nd Year',
    created_at: '2025-01-20T11:15:00Z',
    updated_at: '2025-09-10T09:00:00Z'
  },
  {
    id: '4',
    patient_no: 'PAT2025004',
    first_name: 'Lisa',
    middle_name: 'Ann',
    last_name: 'Wilson',
    sex: 'Female',
    age_computed: 45,
    blood_type: 'AB+',
    contact_no: '+1-555-0104',
    employee_id: 'EMP002',
    department: 'Finance',
    created_at: '2025-02-01T14:20:00Z',
    updated_at: '2025-09-10T09:30:00Z'
  },
  {
    id: '5',
    patient_no: 'PAT2025005',
    first_name: 'Carlos',
    middle_name: 'Antonio',
    last_name: 'Martinez',
    sex: 'Male',
    age_computed: 22,
    blood_type: 'O-',
    contact_no: '+1-555-0105',
    email: 'carlos.martinez@email.com',
    course: 'Engineering',
    year_level: '3rd Year',
    created_at: '2025-02-10T16:45:00Z',
    updated_at: '2025-09-10T10:00:00Z'
  }
];

export const mockConsultations = [
  {
    id: '1',
    consultation_id: 'CON2025001',
    patient_id: '1',
    patient_name: 'John Michael Smith',
    chief_complaint: 'Headache and fever',
    diagnosis: 'Common cold',
    treatment: 'Rest, plenty of fluids, paracetamol for fever',
    consultation_date: '2025-09-10T10:00:00Z',
    doctor: 'Dr. Sarah Martinez',
    status: 'completed',
    created_at: '2025-09-10T10:00:00Z'
  },
  {
    id: '2',
    consultation_id: 'CON2025002',
    patient_id: '2',
    patient_name: 'Maria Elena Rodriguez',
    chief_complaint: 'Chest pain',
    diagnosis: 'Muscle strain',
    treatment: 'Anti-inflammatory medication, rest',
    consultation_date: '2025-09-09T14:30:00Z',
    doctor: 'Dr. Michael Thompson',
    status: 'completed',
    created_at: '2025-09-09T14:30:00Z'
  },
  {
    id: '3',
    consultation_id: 'CON2025003',
    patient_id: '3',
    patient_name: 'David James Johnson',
    chief_complaint: 'Sore throat',
    diagnosis: 'Viral pharyngitis',
    treatment: 'Throat lozenges, warm salt water gargle',
    consultation_date: '2025-09-08T09:15:00Z',
    doctor: 'Dr. Emily Rodriguez',
    status: 'completed',
    created_at: '2025-09-08T09:15:00Z'
  },
  {
    id: '4',
    consultation_id: 'CON2025004',
    patient_id: '4',
    patient_name: 'Lisa Ann Wilson',
    chief_complaint: 'Back pain',
    diagnosis: 'Lower back strain',
    treatment: 'Physical therapy, pain medication',
    consultation_date: '2025-09-07T16:00:00Z',
    doctor: 'Dr. Sarah Martinez',
    status: 'follow-up',
    created_at: '2025-09-07T16:00:00Z'
  },
  {
    id: '5',
    consultation_id: 'CON2025005',
    patient_id: '5',
    patient_name: 'Carlos Antonio Martinez',
    chief_complaint: 'Skin rash',
    diagnosis: 'Allergic dermatitis',
    treatment: 'Antihistamines, topical cream',
    consultation_date: '2025-09-06T11:20:00Z',
    doctor: 'Dr. Michael Thompson',
    status: 'completed',
    created_at: '2025-09-06T11:20:00Z'
  }
];

export const mockLogs = [
  {
    id: '1',
    action: 'Patient Registration',
    user: 'Dr. Sarah Martinez',
    details: 'New patient registered: John Michael Smith (PAT2025001)',
    timestamp: '2025-09-10T10:00:00Z',
    type: 'info'
  },
  {
    id: '2',
    action: 'Consultation Completed',
    user: 'Dr. Michael Thompson',
    details: 'Consultation completed for Maria Elena Rodriguez',
    timestamp: '2025-09-09T14:30:00Z',
    type: 'success'
  },
  {
    id: '3',
    action: 'Medicine Low Stock Alert',
    user: 'System',
    details: 'Paracetamol quantity below reorder threshold (15 remaining)',
    timestamp: '2025-09-08T08:00:00Z',
    type: 'warning'
  },
  {
    id: '4',
    action: 'Equipment Maintenance',
    user: 'James Wilson',
    details: 'Pulse Oximeter (EQP004) scheduled for maintenance',
    timestamp: '2025-09-07T16:30:00Z',
    type: 'info'
  },
  {
    id: '5',
    action: 'User Login',
    user: 'Dr. Emily Rodriguez',
    details: 'User logged into the system',
    timestamp: '2025-09-06T09:15:00Z',
    type: 'info'
  }
];

export const mockUsers = [
  {
    id: '1',
    username: 'admin.director',
    email: 'director@meditrack.com',
    first_name: 'Dr. Sarah',
    last_name: 'Martinez',
    role: 'superadmin',
    department: 'Administration',
    phone: '+1-555-0001',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-09-10T08:00:00Z',
    last_login: '2025-09-10T07:30:00Z'
  },
  {
    id: '2',
    username: 'admin.chief',
    email: 'chief@meditrack.com',
    first_name: 'Dr. Michael',
    last_name: 'Thompson',
    role: 'superadmin',
    department: 'Medical Operations',
    phone: '+1-555-0002',
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-09-10T08:00:00Z',
    last_login: '2025-09-10T06:45:00Z'
  },
  {
    id: '3',
    username: 'admin.pharmacy',
    email: 'pharmacy@meditrack.com',
    first_name: 'Dr. Emily',
    last_name: 'Rodriguez',
    role: 'admin',
    department: 'Pharmacy',
    phone: '+1-555-0003',
    is_active: true,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-09-10T08:00:00Z',
    last_login: '2025-09-10T05:20:00Z'
  },
  {
    id: '4',
    username: 'admin.supplies',
    email: 'supplies@meditrack.com',
    first_name: 'Lisa',
    last_name: 'Johnson',
    role: 'admin',
    department: 'Supply Management',
    phone: '+1-555-0004',
    is_active: true,
    created_at: '2025-02-15T00:00:00Z',
    updated_at: '2025-09-10T08:00:00Z',
    last_login: '2025-09-09T22:10:00Z'
  },
  {
    id: '5',
    username: 'admin.equipment',
    email: 'equipment@meditrack.com',
    first_name: 'James',
    last_name: 'Wilson',
    role: 'admin',
    department: 'Equipment Management',
    phone: '+1-555-0005',
    is_active: true,
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-09-10T08:00:00Z',
    last_login: '2025-09-10T04:15:00Z'
  }
];

// Function to get mock data when API is not available
export const getMockData = (type: 'medicines' | 'supplies' | 'equipment' | 'logs' | 'users' | 'patients' | 'consultations' | 'medical_medicines' | 'dental_medicines' | 'medical_supplies' | 'dental_supplies' | 'medical_equipment' | 'dental_equipment') => {
  switch (type) {
    case 'medicines':
      return { data: { data: mockMedicines, total: mockMedicines.length } };
    case 'medical_medicines':
      return { data: { data: mockMedicalMedicines, total: mockMedicalMedicines.length } };
    case 'dental_medicines':
      return { data: { data: mockDentalMedicines, total: mockDentalMedicines.length } };
    case 'supplies':
      return { data: { data: mockSupplies, total: mockSupplies.length } };
    case 'medical_supplies':
      return { data: { data: mockMedicalSupplies, total: mockMedicalSupplies.length } };
    case 'dental_supplies':
      return { data: { data: mockDentalSupplies, total: mockDentalSupplies.length } };
    case 'equipment':
      return { data: { data: mockEquipment, total: mockEquipment.length } };
    case 'medical_equipment':
      return { data: { data: mockMedicalEquipment, total: mockMedicalEquipment.length } };
    case 'dental_equipment':
      return { data: { data: mockDentalEquipment, total: mockDentalEquipment.length } };
    case 'logs':
      return { data: { data: mockLogs, total: mockLogs.length } };
    case 'users':
      return { data: { data: mockUsers, total: mockUsers.length } };
    case 'patients':
      return { data: { data: mockPatients, total: mockPatients.length } };
    case 'consultations':
      return { data: { data: mockConsultations, total: mockConsultations.length } };
    default:
      return { data: { data: [], total: 0 } };
  }
};