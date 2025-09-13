import { useState } from 'react';
import { authApi } from '../lib/api';

const TestApi = () => {
  const [result, setResult] = useState<string>('');
  
  const testLogin = async () => {
    try {
      console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
      const response = await authApi.login('admin@clinic.com', 'password');
      setResult('Success: ' + JSON.stringify(response.data));
    } catch (error: any) {
      console.error('Login error:', error);
      setResult('Error: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <p className="mb-4">API URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}</p>
      <button 
        onClick={testLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Test Login API
      </button>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <pre>{result}</pre>
      </div>
    </div>
  );
};

export default TestApi;