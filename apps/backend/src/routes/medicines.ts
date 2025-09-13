import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import pool from '../config/database';

const router = Router();

// Get all medicines with filtering and pagination
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, category, low_stock, type, search } = req.query;
  
  let baseQuery = `
    SELECT id, medicine_code, name, generic_name, brand_name, category, type, 
           form, strength, quantity, unit_cost, reorder_threshold, expiry_date,
           is_active, requires_prescription, created_at, updated_at
    FROM medicines 
    WHERE is_active = true
  `;
  
  const queryParams: any[] = [];
  let paramCount = 0;
  
  if (type) {
    paramCount++;
    baseQuery += ` AND type = $${paramCount}`;
    queryParams.push(type);
  }
  
  if (category) {
    paramCount++;
    baseQuery += ` AND category ILIKE $${paramCount}`;
    queryParams.push(`%${category}%`);
  }
  
  if (search) {
    paramCount++;
    baseQuery += ` AND (name ILIKE $${paramCount} OR generic_name ILIKE $${paramCount} OR brand_name ILIKE $${paramCount})`;
    queryParams.push(`%${search}%`);
  }
  
  if (low_stock === 'true') {
    baseQuery += ` AND quantity <= reorder_threshold`;
  }
  
  // Count total records
  const countQuery = baseQuery.replace(
    'SELECT id, medicine_code, name, generic_name, brand_name, category, type, form, strength, quantity, unit_cost, reorder_threshold, expiry_date, is_active, requires_prescription, created_at, updated_at',
    'SELECT COUNT(*)'
  );
  
  const countResult = await pool.query(countQuery, queryParams);
  const total = parseInt(countResult.rows[0].count);
  
  // Add pagination
  const offset = (Number(page) - 1) * Number(limit);
  baseQuery += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
  queryParams.push(Number(limit), offset);
  
  const result = await pool.query(baseQuery, queryParams);
  
  res.json({
    success: true,
    data: result.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
}));

// Get low stock medicines
router.get('/low-stock', asyncHandler(async (req, res) => {
  const query = `
    SELECT id, medicine_code, name, generic_name, brand_name, category, type, 
           form, strength, quantity, unit_cost, reorder_threshold, expiry_date
    FROM medicines 
    WHERE is_active = true AND quantity <= reorder_threshold
    ORDER BY (quantity::float / reorder_threshold) ASC
  `;
  
  const result = await pool.query(query);
  
  res.json({
    success: true,
    data: result.rows
  });
}));

// Get expiring medicines
router.get('/expiring', asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  
  const query = `
    SELECT id, medicine_code, name, generic_name, brand_name, category, type, 
           form, strength, quantity, unit_cost, reorder_threshold, expiry_date
    FROM medicines 
    WHERE is_active = true 
      AND expiry_date IS NOT NULL 
      AND expiry_date <= CURRENT_DATE + INTERVAL '${Number(days)} days'
    ORDER BY expiry_date ASC
  `;
  
  const result = await pool.query(query);
  
  res.json({
    success: true,
    data: result.rows
  });
}));

// Get medicine by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const query = `
    SELECT id, medicine_code, name, generic_name, brand_name, category, type, 
           form, strength, quantity, unit_cost, reorder_threshold, expiry_date,
           is_active, requires_prescription, created_at, updated_at
    FROM medicines 
    WHERE id = $1 AND is_active = true
  `;
  
  const result = await pool.query(query, [req.params.id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Medicine not found'
    });
  }
  
  res.json({
    success: true,
    data: result.rows[0]
  });
}));

// Create new medicine
router.post('/', asyncHandler(async (req, res) => {
  const {
    medicine_code, name, generic_name, brand_name, category, type,
    form, strength, quantity, unit_cost, reorder_threshold, expiry_date,
    requires_prescription
  } = req.body;
  
  const query = `
    INSERT INTO medicines (
      medicine_code, name, generic_name, brand_name, category, type,
      form, strength, quantity, unit_cost, reorder_threshold, expiry_date,
      requires_prescription
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `;
  
  const values = [
    medicine_code, name, generic_name, brand_name, category, type,
    form, strength, quantity || 0, unit_cost || 0, reorder_threshold || 10,
    expiry_date, requires_prescription || false
  ];
  
  const result = await pool.query(query, values);
  
  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Medicine created successfully'
  });
}));

// Update medicine stock
router.patch('/:id/stock', asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  
  const query = `
    UPDATE medicines 
    SET quantity = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND is_active = true
    RETURNING *
  `;
  
  const result = await pool.query(query, [quantity, req.params.id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Medicine not found'
    });
  }
  
  res.json({
    success: true,
    data: result.rows[0],
    message: 'Stock updated successfully'
  });
}));

// Update medicine
router.put('/:id', asyncHandler(async (req, res) => {
  const {
    medicine_code, name, generic_name, brand_name, category, type,
    form, strength, quantity, unit_cost, reorder_threshold, expiry_date,
    requires_prescription
  } = req.body;
  
  const query = `
    UPDATE medicines 
    SET medicine_code = $1, name = $2, generic_name = $3, brand_name = $4,
        category = $5, type = $6, form = $7, strength = $8, quantity = $9,
        unit_cost = $10, reorder_threshold = $11, expiry_date = $12,
        requires_prescription = $13, updated_at = CURRENT_TIMESTAMP
    WHERE id = $14 AND is_active = true
    RETURNING *
  `;
  
  const values = [
    medicine_code, name, generic_name, brand_name, category, type,
    form, strength, quantity, unit_cost, reorder_threshold, expiry_date,
    requires_prescription, req.params.id
  ];
  
  const result = await pool.query(query, values);
  
  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Medicine not found'
    });
  }
  
  res.json({
    success: true,
    data: result.rows[0],
    message: 'Medicine updated successfully'
  });
}));

// Archive medicine (soft delete)
router.patch('/:id/archive', asyncHandler(async (req, res) => {
  const query = `
    UPDATE medicines 
    SET is_active = false, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND is_active = true
    RETURNING *
  `;
  
  const result = await pool.query(query, [req.params.id]);
  
  if (result.rows.length === 0) {
    return res.status(404).json({
      success: false,
      error: 'Medicine not found'
    });
  }
  
  res.json({
    success: true,
    data: result.rows[0],
    message: 'Medicine archived successfully'
  });
}));

export { router as medicineRoutes };