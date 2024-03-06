// components/LoginForm.js
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../pages/authContext'; // Adjust the path based on your project structure
import { useRouter } from 'next/router';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth(); // Assuming your useAuth hook has a login method
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Call the login method from the useAuth hook
      await login({ email, password });

      // If login is successful, the user state in the AuthContext will be updated
      // Redirect the user to the home page
      router.push('/'); // Change the path if your home page has a different route
    } catch (error) {
      console.error('Login error:', error.message);
      // Handle login errors if needed
    }
  };
  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-4 rounded-md shadow-md">
      <label className="block mb-2 text-sm font-semibold text-gray-600">
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 mt-1 border rounded-md" />
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
  );
};

export default LoginForm;
