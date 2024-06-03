import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../pages/authContext';

const BottomBar = () => {
  const { user, logout } = useAuth();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      setIsSnackbarOpen(true);
      // Mengarahkan pengguna ke halaman login
      router.push('/Login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md flex justify-around items-center max-w-[480px] mx-auto">
      {/* <div className="flex items-center justify-center">
        {user ? (
          <button className="flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-gray-300 focus:outline-none" onClick={() => router.push('/Profile')}>
            <img src="images/profile_nusa.png" alt="Profile" className="w-6 h-6" />
          </button>
        ) : (
          <button className="flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-gray-300 focus:outline-none" onClick={() => router.push('/Login')}>
            <img src="images/profile_nusa.png" alt="Login" className="w-6 h-6" />
          </button>
        )}
      </div> */}

      {/* Button Home with half of it outside BottomBar */}
      <div className="flex items-center justify-center relative mb-8">
        <button className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 flex flex-col items-center justify-center w-16 h-16 focus:outline-none" style={{ backgroundImage: 'url("images/heksagon.png")', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px' }} onClick={() => router.push('/')}>
          <img src="images/home_nusa.png" alt="Home" className="w-6 h-6" />
        </button>
      </div>

      {/* <div className="flex items-center justify-center">
        <button className="flex flex-col items-center justify-center w-12 h-12 rounded-full hover:bg-gray-300 focus:outline-none" onClick={handleLogout}>
          <img src="images/logout_nusa.png" alt="Logout" className="w-6 h-6" />
        </button>
      </div> */}

      {isSnackbarOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md text-center">
            <p>Anda telah logout. Terima kasih!</p>
            <button className="mt-2 bg-green-500 text-white py-2 px-4 rounded-md shadow-md" onClick={closeSnackbar}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomBar;
