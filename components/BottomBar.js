import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { useAuth } from '../pages/authContext'; // Adjust the path based on your project structure

const BottomBar = () => {
  const { user, logout } = useAuth();
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // Show the snackbar after logout
      setIsSnackbarOpen(true);
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/'); // Change this to the appropriate home page URL
      }, 2000);
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  // Snackbar close handler
  const closeSnackbar = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-md flex justify-around items-center max-w-[480px] mx-auto">
      {user ? (
        // If the user is logged in, show the profile link
        <div
          className="text-red-800 text-center cursor-pointer"
          onClick={() => router.push('/Profile')}
        >
          <FontAwesomeIcon icon={faUser} size="2x" />
          <p className="text-xs">Profile</p>
        </div>
      ) : (
        // If the user is not logged in, clicking on the profile link redirects to login
        <div
          className="text-red-800 text-center cursor-pointer"
          onClick={() => router.push('/Login')}
        >
          <FontAwesomeIcon icon={faUser} size="2x" />
          <p className="text-xs">Login</p>
        </div>
      )}

      <div
        className="text-red-800 text-center cursor-pointer"
        onClick={() => router.push('/')}
      >
        <FontAwesomeIcon icon={faHome} size="2x" />
        <p className="text-xs">Home</p>
      </div>
      <div
        className="text-red-800 text-center cursor-pointer"
        onClick={handleLogout}
      >
        <FontAwesomeIcon icon={faSignOutAlt} size="2x" />
        <p className="text-xs">Logout</p>
      </div>

      {/* Snackbar for logout notification */}
      {isSnackbarOpen && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-md">
          Anda telah logout. Terima kasih!
          <button className="ml-4 text-white" onClick={closeSnackbar}>
            Tutup
          </button>
        </div>
      )}
    </div>
  );
};

export default BottomBar;
