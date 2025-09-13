import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Mock admin users data
const mockAdminUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@clinic.com',
    full_name: 'Dr. Admin',
    role: 'admin',
    is_active: true,
    last_login: new Date('2025-09-08T08:00:00Z'),
    created_at: new Date('2024-01-15T10:00:00Z'),
    updated_at: new Date('2025-09-08T08:00:00Z')
  },
  {
    id: '2',
    username: 'superadmin',
    email: 'superadmin@clinic.com',
    full_name: 'Super Admin',
    role: 'superadmin',
    is_active: true,
    last_login: new Date('2025-09-08T07:45:00Z'),
    created_at: new Date('2024-01-01T09:00:00Z'),
    updated_at: new Date('2025-09-08T07:45:00Z')
  },
  {
    id: '3',
    username: 'dr.smith',
    email: 'smith@clinic.com',
    full_name: 'Dr. John Smith',
    role: 'admin',
    is_active: true,
    last_login: new Date('2025-09-07T16:30:00Z'),
    created_at: new Date('2024-03-10T14:00:00Z'),
    updated_at: new Date('2025-09-07T16:30:00Z')
  },
  {
    id: '4',
    username: 'nurse.mary',
    email: 'mary@clinic.com',
    full_name: 'Nurse Mary Johnson',
    role: 'admin',
    is_active: false,
    last_login: new Date('2025-08-15T12:00:00Z'),
    created_at: new Date('2024-05-20T11:00:00Z'),
    updated_at: new Date('2025-08-20T09:00:00Z')
  },
  {
    id: '5',
    username: 'dr.wilson',
    email: 'wilson@clinic.com',
    full_name: 'Dr. Sarah Wilson',
    role: 'admin',
    is_active: true,
    last_login: new Date('2025-09-08T07:15:00Z'),
    created_at: new Date('2024-06-15T13:30:00Z'),
    updated_at: new Date('2025-09-08T07:15:00Z')
  },
  {
    id: '6',
    username: 'dr.brown',
    email: 'brown@clinic.com',
    full_name: 'Dr. Michael Brown',
    role: 'admin',
    is_active: true,
    last_login: new Date('2025-09-07T19:45:00Z'),
    created_at: new Date('2024-07-22T10:00:00Z'),
    updated_at: new Date('2025-09-07T19:45:00Z')
  },
  {
    id: '7',
    username: 'nurse.kim',
    email: 'kim@clinic.com',
    full_name: 'Nurse Kim Lee',
    role: 'admin',
    is_active: true,
    last_login: new Date('2025-09-08T06:30:00Z'),
    created_at: new Date('2024-08-05T15:20:00Z'),
    updated_at: new Date('2025-09-08T06:30:00Z')
  },
  {
    id: '8',
    username: 'dr.garcia',
    email: 'garcia@clinic.com',
    full_name: 'Dr. Maria Garcia',
    role: 'admin',
    is_active: true,
    last_login: new Date('2025-09-07T20:00:00Z'),
    created_at: new Date('2024-09-10T12:45:00Z'),
    updated_at: new Date('2025-09-07T20:00:00Z')
  }
];

router.get('/users', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, role, is_active } = req.query;
  
  let filteredUsers = [...mockAdminUsers];
  
  if (role) {
    filteredUsers = filteredUsers.filter(user => user.role === role);
  }
  
  if (is_active !== undefined) {
    filteredUsers = filteredUsers.filter(user => user.is_active === (is_active === 'true'));
  }
  
  // Sort by created_at (newest first)
  filteredUsers.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  
  const total = filteredUsers.length;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const users = filteredUsers.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
}));

router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = mockAdminUsers.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
}));

router.post('/users', asyncHandler(async (req, res) => {
  const newUser = {
    id: (mockAdminUsers.length + 1).toString(),
    ...req.body,
    is_active: true,
    last_login: null,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  mockAdminUsers.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully'
  });
}));

router.put('/users/:id', asyncHandler(async (req, res) => {
  const user = mockAdminUsers.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  Object.assign(user, req.body, { updated_at: new Date() });
  
  res.json({
    success: true,
    data: user,
    message: 'User updated successfully'
  });
}));

router.patch('/users/:id/toggle-active', asyncHandler(async (req, res) => {
  const user = mockAdminUsers.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  user.is_active = !user.is_active;
  user.updated_at = new Date();
  
  res.json({
    success: true,
    data: user,
    message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`
  });
}));

router.delete('/users/:id', asyncHandler(async (req, res) => {
  const userIndex = mockAdminUsers.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }
  
  mockAdminUsers.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'User deleted successfully'
  });
}));

export { router as adminRoutes };