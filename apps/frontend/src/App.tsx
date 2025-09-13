import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Medicines from './pages/Medicines';
import Supplies from './pages/Supplies';
import Equipment from './pages/Equipment';
import Patients from './pages/Patients';
import Consultations from './pages/Consultations';
import Logs from './pages/Logs';
import AdminManagement from './pages/AdminManagement';
import MedicalRecords from './pages/MedicalRecords';
import Profile from './pages/Profile';
import Login from './pages/Login';
import TestApi from './pages/TestApi';
import PatientConsultationFormPage from './pages/PatientConsultationForm';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test-api" element={<TestApi />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path="/admin-management" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminManagement />} />
          </Route>
          <Route path="/medicines" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Medicines />} />
          </Route>
          <Route path="/supplies" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Supplies />} />
          </Route>
          <Route path="/equipment" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Equipment />} />
          </Route>
          <Route path="/patients" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Patients />} />
          </Route>
          <Route path="/consultations" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Consultations />} />
          </Route>
          <Route path="/medical-records" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<MedicalRecords />} />
          </Route>
          <Route path="/logs" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Logs />} />
          </Route>
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Profile />} />
          </Route>
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
