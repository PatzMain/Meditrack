import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Mock logs data
const mockLogs = [
  {
    id: '1',
    action: 'LOGIN',
    description: 'User logged in',
    user: 'Dr. Admin',
    user_role: 'admin',
    resource_type: 'auth',
    resource_id: null,
    timestamp: new Date('2025-09-08T08:00:00Z'),
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '2',
    action: 'CREATE',
    description: 'Added new medicine: Paracetamol',
    user: 'Dr. Admin',
    user_role: 'admin',
    resource_type: 'medicine',
    resource_id: '1',
    timestamp: new Date('2025-09-08T08:15:00Z'),
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '3',
    action: 'UPDATE',
    description: 'Updated medicine stock: Amoxicillin quantity changed from 15 to 14',
    user: 'Dr. Admin',
    user_role: 'admin',
    resource_type: 'medicine',
    resource_id: '2',
    timestamp: new Date('2025-09-08T08:20:00Z'),
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '4',
    action: 'CREATE',
    description: 'Added new supply: Surgical Gloves',
    user: 'Super Admin',
    user_role: 'superadmin',
    resource_type: 'supply',
    resource_id: '1',
    timestamp: new Date('2025-09-08T08:25:00Z'),
    ip_address: '192.168.1.2',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '5',
    action: 'ARCHIVE',
    description: 'Archived equipment: Old X-Ray Machine',
    user: 'Super Admin',
    user_role: 'superadmin',
    resource_type: 'equipment',
    resource_id: '10',
    timestamp: new Date('2025-09-08T08:30:00Z'),
    ip_address: '192.168.1.2',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '6',
    action: 'LOGIN',
    description: 'User logged in',
    user: 'Super Admin',
    user_role: 'superadmin',
    resource_type: 'auth',
    resource_id: null,
    timestamp: new Date('2025-09-08T07:45:00Z'),
    ip_address: '192.168.1.2',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '7',
    action: 'LOGOUT',
    description: 'User logged out',
    user: 'Dr. Admin',
    user_role: 'admin',
    resource_type: 'auth',
    resource_id: null,
    timestamp: new Date('2025-09-08T07:30:00Z'),
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  },
  {
    id: '8',
    action: 'UPDATE',
    description: 'Updated medicine information: Lidocaine expiry date changed',
    user: 'Dr. Admin',
    user_role: 'admin',
    resource_type: 'medicine',
    resource_id: '4',
    timestamp: new Date('2025-09-08T06:15:00Z'),
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
];

router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, action, resource_type, user } = req.query;
  
  let filteredLogs = [...mockLogs];
  
  if (action) {
    filteredLogs = filteredLogs.filter(log => log.action === action);
  }
  
  if (resource_type) {
    filteredLogs = filteredLogs.filter(log => log.resource_type === resource_type);
  }
  
  if (user) {
    filteredLogs = filteredLogs.filter(log => 
      log.user.toLowerCase().includes(user.toString().toLowerCase())
    );
  }
  
  // Sort by timestamp (newest first)
  filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  const total = filteredLogs.length;
  const startIndex = (Number(page) - 1) * Number(limit);
  const endIndex = startIndex + Number(limit);
  const logs = filteredLogs.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: logs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
}));

router.post('/', asyncHandler(async (req, res) => {
  const newLog = {
    id: (mockLogs.length + 1).toString(),
    ...req.body,
    timestamp: new Date()
  };
  
  mockLogs.push(newLog);
  
  res.status(201).json({
    success: true,
    data: newLog,
    message: 'Log entry created successfully'
  });
}));

export { router as logsRoutes };