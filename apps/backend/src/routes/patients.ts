import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Mock patients data
const mockPatients = [
  {
    id: '1',
    patient_no: '2024-0001',
    last_name: 'Doe',
    first_name: 'John',
    middle_name: 'Smith',
    sex: 'Male',
    birth_date: new Date('1990-05-15'),
    age_computed: 34,
    course: 'Computer Science',
    year_level: '4th Year',
    department: 'College of Engineering',
    contact_no: '+1234567890',
    email: 'john.doe@email.com',
    blood_type: 'O+',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    patient_no: '2024-0002',
    last_name: 'Smith',
    first_name: 'Jane',
    sex: 'Female',
    birth_date: new Date('1985-10-22'),
    age_computed: 38,
    employee_id: 'EMP-001',
    department: 'Faculty',
    contact_no: '+1234567891',
    email: 'jane.smith@email.com',
    blood_type: 'A+',
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, search, type } = req.query;
  
  let filteredPatients = [...mockPatients];
  
  if (search) {
    const searchTerm = search.toString().toLowerCase();
    filteredPatients = filteredPatients.filter(p => 
      p.first_name.toLowerCase().includes(searchTerm) ||
      p.last_name.toLowerCase().includes(searchTerm) ||
      p.patient_no.toLowerCase().includes(searchTerm)
    );
  }
  
  const total = filteredPatients.length;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const patients = filteredPatients.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: patients,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const patient = mockPatients.find(p => p.id === req.params.id);
  
  if (!patient) {
    return res.status(404).json({
      success: false,
      error: 'Patient not found'
    });
  }
  
  res.json({
    success: true,
    data: patient
  });
}));

router.post('/', asyncHandler(async (req, res) => {
  const newPatientNo = `2024-${String(mockPatients.length + 1).padStart(4, '0')}`;
  
  const newPatient = {
    id: (mockPatients.length + 1).toString(),
    patient_no: newPatientNo,
    ...req.body,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  mockPatients.push(newPatient);
  
  res.status(201).json({
    success: true,
    data: newPatient,
    message: 'Patient registered successfully'
  });
}));

export { router as patientRoutes };