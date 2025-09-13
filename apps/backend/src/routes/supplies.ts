import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Mock supplies data
const mockSupplies = [
  {
    id: '1',
    supply_code: 'SUP001',
    name: 'Surgical Gloves',
    generic_name: 'Latex Gloves',
    brand_name: 'MedGlove',
    category: 'PPE',
    type: 'medical',
    form: 'Box',
    strength: 'Medium',
    quantity: 50,
    unit_cost: 12.00,
    reorder_threshold: 10,
    expiry_date: new Date('2025-12-31'),
    is_active: true,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    supply_code: 'SUP002',
    name: 'Syringes',
    generic_name: 'Disposable Syringes',
    brand_name: 'SafePoint',
    category: 'Injection Equipment',
    type: 'medical',
    form: 'Pack',
    strength: '5ml',
    quantity: 100,
    unit_cost: 8.50,
    reorder_threshold: 20,
    expiry_date: new Date('2026-06-30'),
    is_active: true,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '3',
    supply_code: 'DEN003',
    name: 'Dental Impression Material',
    generic_name: 'Alginate',
    brand_name: 'DentalFlex',
    category: 'Impression Materials',
    type: 'dental',
    form: 'Powder',
    strength: 'Regular Set',
    quantity: 25,
    unit_cost: 35.00,
    reorder_threshold: 5,
    expiry_date: new Date('2025-03-15'),
    is_active: true,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '4',
    supply_code: 'DEN004',
    name: 'Composite Filling Material',
    generic_name: 'Resin Composite',
    brand_name: 'FillMax',
    category: 'Restorative Materials',
    type: 'dental',
    form: 'Syringe',
    strength: 'A2 Shade',
    quantity: 15,
    unit_cost: 45.00,
    reorder_threshold: 3,
    expiry_date: new Date('2024-11-30'),
    is_active: true,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  }
];

router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, category, low_stock, type } = req.query;
  
  let filteredSupplies = [...mockSupplies];
  
  if (type) {
    filteredSupplies = filteredSupplies.filter(s => s.type === type);
  }
  
  if (category) {
    filteredSupplies = filteredSupplies.filter(s => 
      s.category.toLowerCase().includes(category.toString().toLowerCase())
    );
  }
  
  if (low_stock === 'true') {
    filteredSupplies = filteredSupplies.filter(s => 
      s.quantity <= s.reorder_threshold
    );
  }
  
  const total = filteredSupplies.length;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const supplies = filteredSupplies.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: supplies,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const supply = mockSupplies.find(s => s.id === req.params.id);
  
  if (!supply) {
    return res.status(404).json({
      success: false,
      error: 'Supply not found'
    });
  }
  
  res.json({
    success: true,
    data: supply
  });
}));

router.post('/', asyncHandler(async (req, res) => {
  const newSupply = {
    id: (mockSupplies.length + 1).toString(),
    supply_code: req.body.supply_code || `SUP${String(mockSupplies.length + 1).padStart(3, '0')}`,
    ...req.body,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  mockSupplies.push(newSupply);
  
  res.status(201).json({
    success: true,
    data: newSupply,
    message: 'Supply created successfully'
  });
}));

router.patch('/:id/stock', asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const supply = mockSupplies.find(s => s.id === req.params.id);
  
  if (!supply) {
    return res.status(404).json({
      success: false,
      error: 'Supply not found'
    });
  }
  
  supply.quantity = quantity;
  supply.updated_at = new Date();
  
  res.json({
    success: true,
    data: supply,
    message: 'Stock updated successfully'
  });
}));

router.put('/:id', asyncHandler(async (req, res) => {
  const supply = mockSupplies.find(s => s.id === req.params.id);
  
  if (!supply) {
    return res.status(404).json({
      success: false,
      error: 'Supply not found'
    });
  }
  
  Object.assign(supply, req.body, { updated_at: new Date() });
  
  res.json({
    success: true,
    data: supply,
    message: 'Supply updated successfully'
  });
}));

router.patch('/:id/archive', asyncHandler(async (req, res) => {
  const supply = mockSupplies.find(s => s.id === req.params.id);
  
  if (!supply) {
    return res.status(404).json({
      success: false,
      error: 'Supply not found'
    });
  }
  
  supply.is_active = false;
  supply.updated_at = new Date();
  
  res.json({
    success: true,
    data: supply,
    message: 'Supply archived successfully'
  });
}));

export { router as suppliesRoutes };