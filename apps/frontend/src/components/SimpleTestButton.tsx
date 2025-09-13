import { useState } from 'react';

const SimpleTestButton = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setCount(count + 1);
    setMessage(`Button clicked ${count + 1} times!`);
    console.log('Simple test button clicked!', count + 1);
  };

  const handleAlert = () => {
    alert('Alert button works!');
  };

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
      <h3 className="font-semibold text-gray-900 mb-2">Button Test Area</h3>
      <div className="space-x-2 mb-2">
        <button 
          onClick={handleClick}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Counter: {count}
        </button>
        <button 
          onClick={handleAlert}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Test Alert
        </button>
      </div>
      {message && <p className="text-sm text-green-700">{message}</p>}
    </div>
  );
};

export default SimpleTestButton;