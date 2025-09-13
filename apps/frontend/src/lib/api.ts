import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Backend server might be down');
      alert('Connection error: Please check if the server is running');
    }
    
    return Promise.reject(error);
  }
);

// API functions
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  profile: () => 
    api.get('/auth/profile'),
};

export const medicineApi = {
  getAll: (params?: any) => 
    api.get('/medicines', { params }),
  getById: (id: string) => 
    api.get(`/medicines/${id}`),
  create: (data: any) => 
    api.post('/medicines', data),
  update: (id: string, data: any) => 
    api.put(`/medicines/${id}`, data),
  updateStock: (id: string, quantity: number) => 
    api.patch(`/medicines/${id}/stock`, { quantity }),
  archive: (id: string) => 
    api.patch(`/medicines/${id}/archive`),
  delete: (id: string) => 
    api.delete(`/medicines/${id}`),
  getLowStock: () => 
    api.get('/medicines/low-stock'),
  getExpiring: (days?: number) => 
    api.get('/medicines/expiring', { params: { days } }),
};

export const suppliesApi = {
  getAll: (params?: any) => 
    api.get('/supplies', { params }),
  getById: (id: string) => 
    api.get(`/supplies/${id}`),
  create: (data: any) => 
    api.post('/supplies', data),
  update: (id: string, data: any) => 
    api.put(`/supplies/${id}`, data),
  updateStock: (id: string, quantity: number) => 
    api.patch(`/supplies/${id}/stock`, { quantity }),
  archive: (id: string) => 
    api.patch(`/supplies/${id}/archive`),
  delete: (id: string) => 
    api.delete(`/supplies/${id}`),
};

export const equipmentApi = {
  getAll: (params?: any) => 
    api.get('/equipment', { params }),
  getById: (id: string) => 
    api.get(`/equipment/${id}`),
  create: (data: any) => 
    api.post('/equipment', data),
  update: (id: string, data: any) => 
    api.put(`/equipment/${id}`, data),
  updateStock: (id: string, quantity: number) => 
    api.patch(`/equipment/${id}/stock`, { quantity }),
  archive: (id: string) => 
    api.patch(`/equipment/${id}/archive`),
  delete: (id: string) => 
    api.delete(`/equipment/${id}`),
};

export const logsApi = {
  getAll: (params?: any) => 
    api.get('/logs', { params }),
  create: (data: any) => 
    api.post('/logs', data),
};

// Mock admin data matching backend auth.ts users
const mockAdminUsers = [
  {
    id: '1',
    username: 'admin_user',
    email: 'admin@clinic.com',
    full_name: 'Admin User',
    role: 'admin',
    department: 'Administration',
    is_active: true,
    last_login: '2025-01-10T14:30:00Z',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2025-01-10T14:30:00Z'
  },
  {
    id: '2',
    username: 'superadmin_user',
    email: 'superadmin@clinic.com',
    full_name: 'Super Admin',
    role: 'superadmin',
    department: 'Administration',
    is_active: true,
    last_login: '2025-01-09T16:45:00Z',
    created_at: '2024-11-15T09:15:00Z',
    updated_at: '2025-01-09T16:45:00Z'
  },
  {
    id: '3',
    username: 'sarah_martinez',
    email: 'director@meditrack.com',
    full_name: 'Dr. Sarah Martinez',
    role: 'superadmin',
    department: 'Administration',
    is_active: true,
    last_login: '2025-01-11T08:20:00Z',
    created_at: '2024-10-01T12:00:00Z',
    updated_at: '2025-01-11T08:20:00Z'
  },
  {
    id: '4',
    username: 'emily_rodriguez',
    email: 'pharmacy@meditrack.com',
    full_name: 'Dr. Emily Rodriguez',
    role: 'admin',
    department: 'Pharmacy',
    is_active: true,
    last_login: '2025-01-10T13:15:00Z',
    created_at: '2024-11-20T14:30:00Z',
    updated_at: '2025-01-10T13:15:00Z'
  }
];

export const adminApi = {
  getUsers: (params?: any) => {
    // Simulate API response with filtering
    let filteredUsers = [...mockAdminUsers];
    
    if (params?.role) {
      filteredUsers = filteredUsers.filter(user => user.role === params.role);
    }
    
    if (params?.is_active !== undefined && params?.is_active !== '') {
      const isActive = params.is_active === 'true';
      filteredUsers = filteredUsers.filter(user => user.is_active === isActive);
    }
    
    return Promise.resolve({
      data: {
        success: true,
        data: filteredUsers,
        total: filteredUsers.length
      }
    });
  },
  getUserById: (id: string) => {
    const user = mockAdminUsers.find(u => u.id === id);
    return Promise.resolve({
      data: {
        success: true,
        data: user
      }
    });
  },
  createUser: (data: any) => {
    const newUser = {
      id: String(mockAdminUsers.length + 1),
      username: data.username,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      department: data.role === 'superadmin' ? 'Administration' : 'General',
      is_active: true,
      last_login: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockAdminUsers.push(newUser);
    return Promise.resolve({
      data: {
        success: true,
        data: newUser
      }
    });
  },
  updateUser: (id: string, data: any) => {
    const userIndex = mockAdminUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      mockAdminUsers[userIndex] = {
        ...mockAdminUsers[userIndex],
        ...data,
        updated_at: new Date().toISOString()
      };
    }
    return Promise.resolve({
      data: {
        success: true,
        data: mockAdminUsers[userIndex]
      }
    });
  },
  toggleUserActive: (id: string) => {
    const userIndex = mockAdminUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      mockAdminUsers[userIndex].is_active = !mockAdminUsers[userIndex].is_active;
      mockAdminUsers[userIndex].updated_at = new Date().toISOString();
    }
    return Promise.resolve({
      data: {
        success: true,
        data: mockAdminUsers[userIndex]
      }
    });
  },
  deleteUser: (id: string) => {
    const userIndex = mockAdminUsers.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      mockAdminUsers.splice(userIndex, 1);
    }
    return Promise.resolve({
      data: {
        success: true,
        message: 'User deleted successfully'
      }
    });
  },
};

export const patientApi = {
  getAll: (params?: any) => 
    api.get('/patients', { params }),
  getById: (id: string) => 
    api.get(`/patients/${id}`),
  create: (data: any) => 
    api.post('/patients', data),
  update: (id: string, data: any) => 
    api.patch(`/patients/${id}`, data),
};

export const consultationApi = {
  getAll: (params?: any) => 
    api.get('/consultations', { params }),
  getById: (id: string) => 
    api.get(`/consultations/${id}`),
  create: (data: any) => 
    api.post('/consultations', data),
  update: (id: string, data: any) => 
    api.patch(`/consultations/${id}`, data),
};

export const dashboardApi = {
  getMetrics: () => 
    api.get('/dashboard/metrics'),
};