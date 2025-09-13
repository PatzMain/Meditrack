import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Mock consultations data
const mockConsultations = [
  {
    id: '1',
    consultation_no: 'CONS-2024-0001',
    patient_id: '1',
    status: 'Completed',
    type: 'Student',
    date: new Date(),
    time_in: '09:00',
    time_out: '09:30',
    duration_minutes: 30,
    chief_complaint: 'Headache and fever',
    attending_physician: 'Dr. Johnson',
    diagnosis: ['Common Cold'],
    is_emergency: false,
    is_referred: false,
    is_admitted: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    consultation_no: 'CONS-2024-0002',
    patient_id: '2',
    status: 'In Progress',
    type: 'Employee',
    date: new Date(),
    time_in: '10:15',
    chief_complaint: 'Annual check-up',
    attending_physician: 'Dr. Smith',
    is_emergency: false,
    is_referred: false,
    is_admitted: false,
    created_at: new Date(),
    updated_at: new Date()
  }
];

router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status, physician, date } = req.query;
  
  let filteredConsultations = [...mockConsultations];
  
  if (status) {
    filteredConsultations = filteredConsultations.filter(c => 
      c.status.toLowerCase() === status.toString().toLowerCase()
    );
  }
  
  if (physician) {
    filteredConsultations = filteredConsultations.filter(c => 
      c.attending_physician.toLowerCase().includes(physician.toString().toLowerCase())
    );
  }
  
  const total = filteredConsultations.length;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const consultations = filteredConsultations.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: consultations,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const consultation = mockConsultations.find(c => c.id === req.params.id);
  
  if (!consultation) {
    return res.status(404).json({
      success: false,
      error: 'Consultation not found'
    });
  }
  
  res.json({
    success: true,
    data: consultation
  });
}));

router.post('/', asyncHandler(async (req, res) => {
  const newConsultationNo = `CONS-2024-${String(mockConsultations.length + 1).padStart(4, '0')}`;
  
  const newConsultation = {
    id: (mockConsultations.length + 1).toString(),
    consultation_no: newConsultationNo,
    ...req.body,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  mockConsultations.push(newConsultation);
  
  res.status(201).json({
    success: true,
    data: newConsultation,
    message: 'Consultation created successfully'
  });
}));

export { router as consultationRoutes };