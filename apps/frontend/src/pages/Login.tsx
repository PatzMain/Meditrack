import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { authApi } from '../lib/api';

const Login = () => {
  const [email, setEmail] = useState('admin@clinic.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(email, password);
      const { token, user } = response.data.data;
      
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Left side - Background with branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src="/background.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">MediTrack</h1>
            <p className="text-base text-blue-100">Professional Clinic Management System</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-4 lg:p-6 overflow-hidden">
        <div className="max-w-sm w-full mx-auto">
          {/* Logo for mobile */}
          <div className="lg:hidden flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">MediTrack</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-4 lg:p-6 space-y-4">
            <div className="text-center">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">Sign in</h2>
              <p className="text-gray-600 text-sm lg:text-base">to continue to MediTrack</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="border-t border-gray-200 pt-3">
              <p className="text-xs text-gray-600 text-center mb-2">Demo accounts:</p>
              
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setEmail('director@meditrack.com');
                    setPassword('password');
                  }}
                  className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 text-left transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-xs">Dr. Sarah Martinez</p>
                      <p className="text-xs text-gray-600">director@meditrack.com</p>
                    </div>
                    <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                      SUPER
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setEmail('pharmacy@meditrack.com');
                    setPassword('password');
                  }}
                  className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 text-left transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-xs">Dr. Emily Rodriguez</p>
                      <p className="text-xs text-gray-600">pharmacy@meditrack.com</p>
                    </div>
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                      ADMIN
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setEmail('admin@clinic.com');
                    setPassword('password');
                  }}
                  className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 text-left transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-xs">Demo User</p>
                      <p className="text-xs text-gray-600">admin@clinic.com</p>
                    </div>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                      DEMO
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-2">
            <p>&copy; 2025 MediTrack. Professional healthcare management.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;