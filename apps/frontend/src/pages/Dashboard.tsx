import React from 'react';
import { 
  Activity, 
  Users, 
  Package, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Stethoscope,
  ShieldAlert,
  BarChart3,
  PieChart
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart,
  Pie,
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  mockMedicines, 
  mockSupplies, 
  mockEquipment, 
  mockUsers, 
  mockPatients, 
  mockConsultations, 
  mockLogs 
} from '../lib/mockData';

const Dashboard = () => {
  // Calculate real statistics from mock data
  const totalPatients = mockPatients.length;
  const totalConsultations = mockConsultations.length;
  const totalMedicines = mockMedicines.length;
  const totalSupplies = mockSupplies.length;
  const totalEquipment = mockEquipment.length;
  const totalUsers = mockUsers.length;
  
  // Low stock calculations
  const lowStockMedicines = mockMedicines.filter(m => m.quantity <= m.reorder_threshold);
  const lowStockSupplies = mockSupplies.filter(s => s.quantity <= s.reorder_threshold);
  const lowStockEquipment = mockEquipment.filter(e => e.quantity <= 2);
  const totalLowStock = lowStockMedicines.length + lowStockSupplies.length + lowStockEquipment.length;
  
  // Equipment status
  const maintenanceEquipment = mockEquipment.filter(e => e.status === 'maintenance').length;
  
  // Inventory value calculation
  const totalInventoryValue = 
    mockMedicines.reduce((sum, m) => sum + (m.quantity * m.unit_cost), 0) +
    mockSupplies.reduce((sum, s) => sum + (s.quantity * s.cost_per_unit), 0) +
    mockEquipment.reduce((sum, e) => sum + (e.quantity * e.cost_per_unit), 0);

  // Consultation status counts
  const completedConsultations = mockConsultations.filter(c => c.status === 'completed').length;
  const followUpConsultations = mockConsultations.filter(c => c.status === 'follow-up').length;

  // Patient demographics for pie chart
  const patientDemographics = [
    { name: 'Students', value: mockPatients.filter(p => p.course).length, color: '#3b82f6' },
    { name: 'Employees', value: mockPatients.filter(p => p.employee_id).length, color: '#10b981' },
    { name: 'Others', value: mockPatients.filter(p => !p.course && !p.employee_id).length, color: '#f59e0b' }
  ];

  // Inventory categories for bar chart
  const inventoryData = [
    { name: 'Medicines', total: totalMedicines, lowStock: lowStockMedicines.length, color: '#3b82f6' },
    { name: 'Supplies', total: totalSupplies, lowStock: lowStockSupplies.length, color: '#10b981' },
    { name: 'Equipment', total: totalEquipment, lowStock: lowStockEquipment.length, color: '#8b5cf6' }
  ];

  // Recent consultation trends (mock data for demo)
  const consultationTrends = [
    { day: 'Mon', consultations: 8 },
    { day: 'Tue', consultations: 12 },
    { day: 'Wed', consultations: 10 },
    { day: 'Thu', consultations: 15 },
    { day: 'Fri', consultations: 14 },
    { day: 'Sat', consultations: 6 },
    { day: 'Sun', consultations: 4 }
  ];

  // Generate medicine activity data from logs
  const generateMedicineActivityData = () => {
    const medicineLogs = mockLogs.filter(log => 
      log.resource_type === 'medicine' || 
      log.details.toLowerCase().includes('medicine')
    );
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activityData = days.map(day => ({
      day,
      creates: Math.floor(Math.random() * 5) + 1,
      updates: Math.floor(Math.random() * 8) + 2,
      archives: Math.floor(Math.random() * 3)
    }));
    
    return activityData;
  };

  const medicineActivityData = generateMedicineActivityData();

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Meditrack Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time insights into your medical clinic operations
          </p>
        </div>

        {/* Key Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{totalPatients}</p>
                <p className="text-sm text-green-600 mt-1">+2 this week</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultations</p>
                <p className="text-3xl font-bold text-gray-900">{totalConsultations}</p>
                <p className="text-sm text-blue-600 mt-1">{completedConsultations} completed</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Stethoscope className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inventory Items</p>
                <p className="text-3xl font-bold text-gray-900">{totalMedicines + totalSupplies + totalEquipment}</p>
                <p className="text-sm text-purple-600 mt-1">${totalInventoryValue.toFixed(0)} value</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Staff Members</p>
                <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-sm text-indigo-600 mt-1">All active</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-xl">
                <Activity className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Demographics Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Patient Demographics</h2>
              <PieChart className="h-6 w-6 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={patientDemographics}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {patientDemographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {patientDemographics.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Consultation Trends */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Weekly Consultation Trends</h2>
              <TrendingUp className="h-6 w-6 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={consultationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="consultations"
                    stroke="#3b82f6"
                    fill="url(#consultationGradient)"
                  />
                  <defs>
                    <linearGradient id="consultationGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Medicines Activity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Medicine Activity Trends</h2>
            <Package className="h-6 w-6 text-gray-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={medicineActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="creates"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="New Medicines"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="updates"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Updates"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="archives"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  name="Archives"
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New Medicines</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Archives</span>
            </div>
          </div>
        </div>

        {/* Inventory Status and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory Overview Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Inventory Overview</h2>
              <BarChart3 className="h-6 w-6 text-gray-400" />
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#3b82f6" name="Total Stock" />
                  <Bar dataKey="lowStock" fill="#ef4444" name="Low Stock" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-600">Total Stock</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">Low Stock</span>
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">System Alerts</h2>
              <ShieldAlert className="h-6 w-6 text-gray-400" />
            </div>
            <div className="space-y-4">
              {totalLowStock > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800">Low Stock Alert</p>
                      <p className="text-sm text-yellow-700">{totalLowStock} items below threshold</p>
                    </div>
                  </div>
                </div>
              )}
              
              {maintenanceEquipment > 0 && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Equipment Maintenance</p>
                      <p className="text-sm text-blue-700">{maintenanceEquipment} items need attention</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">System Status</p>
                    <p className="text-sm text-green-700">All systems operational</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Activity className="h-6 w-6 text-gray-400" />
          </div>
          <div className="space-y-4">
            {mockLogs.slice(0, 5).map((log, index) => (
              <div key={log.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  log.type === 'success' ? 'bg-green-500' :
                  log.type === 'warning' ? 'bg-yellow-500' :
                  log.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{log.action} - {log.user}</p>
                  <p className="text-xs text-gray-600">{log.details}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;