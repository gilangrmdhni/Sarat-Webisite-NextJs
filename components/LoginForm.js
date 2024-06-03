import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../pages/authContext';
import { useRouter } from 'next/router';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login({ username, password });
      router.push('/HomePage'); // Atur rute yang sesuai
    } catch (error) {
      console.error('Login error:', error.message);
      setError('Username atau password salah. Silakan coba lagi.');
      setShowError(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin} className="max-w-md mx-auto p-4 rounded-md shadow-md">
        {error && (
          <p className="text-red-600 mb-4 flex items-center">
            <span className="mr-2">
              <FontAwesomeIcon icon={faExclamationCircle} />
            </span>
            {error}
          </p>
        )}
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
        </label>
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          Password:
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md"
            />
            <span
              className="absolute top-2 right-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>
        </label>
        <button type="submit" className="w-full py-2 mt-4 font-semibold text-white bg-red-700 rounded-md hover:bg-red-800">
          Login
        </button>
      </form>
      {/* Pemberitahuan popup saat login gagal */}
      {showError && (
        <div className="fixed bottom-0 right-0 mb-4 mr-4 p-4 bg-red-500 text-white rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default LoginForm;
