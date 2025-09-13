import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.get('/metrics', asyncHandler(async (req, res) => {
  const metrics = {
    totalPatients: 156,
    todayConsultations: 12,
    activeMedicines: 89,
    lowStockItems: 5,
    expiringMedicines: 3,
    equipmentItems: 45,
    maintenanceDue: 2,
    emergencyConsultations: 1,
    monthlyStats: {
      consultations: [
        { month: 'Jan', count: 234 },
        { month: 'Feb', count: 187 },
        { month: 'Mar', count: 298 },
        { month: 'Apr', count: 234 },
        { month: 'May', count: 187 },
        { month: 'Jun', count: 298 }
      ],
      medications: [
        { category: 'Analgesics', count: 45 },
        { category: 'Antibiotics', count: 32 },
        { category: 'Vitamins', count: 28 },
        { category: 'Antihistamines', count: 21 }
      ]
    },
    recentActivity: [
      {
        id: '1',
        type: 'consultation',
        description: 'New consultation for John Doe',
        timestamp: new Date(),
        user: 'Dr. Johnson'
      },
      {
        id: '2',
        type: 'medicine',
        description: 'Low stock alert: Paracetamol',
        timestamp: new Date(),
        user: 'System'
      },
      {
        id: '3',
        type: 'patient',
        description: 'New patient registered: Jane Smith',
        timestamp: new Date(),
        user: 'Nurse Mary'
      }
    ]
  };
  
  res.json({
    success: true,
    data: metrics
  });
}));

export { router as dashboardRoutes };