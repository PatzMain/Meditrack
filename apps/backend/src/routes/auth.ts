import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Mock authentication for development
router.post('/login', asyncHandler(async (req, res) => {
  console.log('🔐 Login attempt received:', req.body);
  const { email, password } = req.body;
  
  // Mock user validation
  const validUsers = {
    'admin@clinic.com': {
      id: '1',
      email: 'admin@clinic.com',
      full_name: 'Admin User',
      role: 'admin',
      department: 'Administration',
      is_active: true,
      token: 'mock-jwt-token'
    },
    'superadmin@clinic.com': {
      id: '2',
      email: 'superadmin@clinic.com',
      full_name: 'Super Admin',
      role: 'superadmin',
      department: 'Administration',
      is_active: true,
      token: 'mock-superadmin-token'
    },
    'director@meditrack.com': {
      id: '3',
      email: 'director@meditrack.com',
      full_name: 'Dr. Sarah Martinez',
      role: 'superadmin',
      department: 'Administration',
      is_active: true,
      token: 'mock-director-token'
    },
    'pharmacy@meditrack.com': {
      id: '4',
      email: 'pharmacy@meditrack.com',
      full_name: 'Dr. Emily Rodriguez',
      role: 'admin',
      department: 'Pharmacy',
      is_active: true,
      token: 'mock-pharmacy-token'
    }
  };

  if (password === 'password' && validUsers[email]) {
    const userData = validUsers[email];
    const { token, ...user } = userData;
    
    res.json({
      success: true,
      data: {
        user,
        token
      },
      message: 'Login successful'
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
}));

router.post('/register', asyncHandler(async (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Registration not implemented yet'
  });
}));

router.get('/profile', asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      id: '1',
      email: 'admin@clinic.com',
      full_name: 'Admin User',
      role: 'admin',
      department: 'Administration',
      is_active: true
    }
  });
}));

export { router as authRoutes };