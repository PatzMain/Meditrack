import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Mock equipment data
const mockEquipment = [
  {
    id: '1',
    equipment_code: 'EQP001',
    name: 'Blood Pressure Monitor',
    generic_name: 'Sphygmomanometer',
    brand_name: 'MedTech Pro',
    category: 'Diagnostic Equipment',
    type: 'medical',
    form: 'Device',
    strength: 'Digital',
    quantity: 5,
    unit_cost: 150.00,
    reorder_threshold: 2,
    expiry_date: null,
    is_active: true,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    equipment_code: 'EQP002',
    name: 'Stethoscope',
    generic_name: 'Acoustic Stethoscope',
    brand_name: 'CardioCare',
    category: 'Diagnostic Equipment',
    type: 'medical',
    form: 'Device',
    strength: 'Professional',
    quantity: 8,
    unit_cost: 85.00,
    reorder_threshold: 3,
    expiry_date: null,
    is_active: true,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '3',
    equipment_code: 'DEN005',
    name: 'Dental X-Ray Machine',
    generic_name: 'Intraoral X-Ray Unit',
    brand_name: 'DentalVision',
    category: 'Imaging Equipment',
    type: 'dental',
    form: 'Machine',
    strength: 'Digital',
    quantity: 2,
    unit_cost: 5000.00,
    reorder_threshold: 1,
    expiry_date: null,
    is_active: true,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '4',
    equipment_code: 'DEN006',
    name: 'Dental Drill',
    generic_name: 'High-Speed Handpiece',
    brand_name: 'DrillMaster',
    category: 'Treatment Equipment',
    type: 'dental',
    form: 'Device',
    strength: 'High-Speed',
    quantity: 6,
    unit_cost: 800.00,
    reorder_threshold: 2,
    expiry_date: null,
    is_active: true,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '5',
    equipment_code: 'EQP003',
    name: 'ECG Machine',
    generic_name: 'Electrocardiograph',
    brand_name: 'HeartMonitor Plus',
    category: 'Diagnostic Equipment',
    type: 'medical',
    form: 'Machine',
    strength: '12-Lead',
    quantity: 3,
    unit_cost: 2500.00,
    reorder_threshold: 1,
    expiry_date: null,
    is_active: true,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  }
];

router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, category, low_stock, type } = req.query;
  
  let filteredEquipment = [...mockEquipment];
  
  if (type) {
    filteredEquipment = filteredEquipment.filter(e => e.type === type);
  }
  
  if (category) {
    filteredEquipment = filteredEquipment.filter(e => 
      e.category.toLowerCase().includes(category.toString().toLowerCase())
    );
  }
  
  if (low_stock === 'true') {
    filteredEquipment = filteredEquipment.filter(e => 
      e.quantity <= e.reorder_threshold
    );
  }
  
  const total = filteredEquipment.length;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const equipment = filteredEquipment.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: equipment,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const equipment = mockEquipment.find(e => e.id === req.params.id);
  
  if (!equipment) {
    return res.status(404).json({
      success: false,
      error: 'Equipment not found'
    });
  }
  
  res.json({
    success: true,
    data: equipment
  });
}));

router.post('/', asyncHandler(async (req, res) => {
  const newEquipment = {
    id: (mockEquipment.length + 1).toString(),
    equipment_code: req.body.equipment_code || `EQP${String(mockEquipment.length + 1).padStart(3, '0')}`,
    ...req.body,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  mockEquipment.push(newEquipment);
  
  res.status(201).json({
    success: true,
    data: newEquipment,
    message: 'Equipment created successfully'
  });
}));

router.patch('/:id/stock', asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const equipment = mockEquipment.find(e => e.id === req.params.id);
  
  if (!equipment) {
    return res.status(404).json({
      success: false,
      error: 'Equipment not found'
    });
  }
  
  equipment.quantity = quantity;
  equipment.updated_at = new Date();
  
  res.json({
    success: true,
    data: equipment,
    message: 'Stock updated successfully'
  });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const equipment = mockEquipment.find(e => e.id === req.params.id);
  
  if (!equipment) {
    return res.status(404).json({
      success: false,
      error: 'Equipment not found'
    });
  }
  
  Object.assign(equipment, req.body, { updated_at: new Date() });
  
  res.json({
    success: true,
    data: equipment,
    message: 'Equipment updated successfully'
  });
}));

router.patch('/:id/archive', asyncHandler(async (req, res) => {
  const equipment = mockEquipment.find(e => e.id === req.params.id);
  
  if (!equipment) {
    return res.status(404).json({
      success: false,
      error: 'Equipment not found'
    });
  }
  
  equipment.is_active = false;
  equipment.updated_at = new Date();
  
  res.json({
    success: true,
    data: equipment,
    message: 'Equipment archived successfully'
  });
}));

export { router as equipmentRoutes };