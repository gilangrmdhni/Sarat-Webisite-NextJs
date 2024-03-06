// components/Navbar.js
import React, { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '../pages/authContext'; // Adjust the path based on your project structure
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  // State for managing snackbar visibility
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // Show the snackbar after logout
      setIsSnackbarOpen(true);
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/login');
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
    <>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-xxx" crossorigin="anonymous" />
      </Head>
      <nav className="bg-merah-gelap p-4 text-white">
        <div className="max-w-custom mx-auto flex items-center justify-between">
          <div className="text-start">
            <div className="text-2xl font-bold mb-2">Assalamualaikum</div>
            <div className="text-lg">{user?.body?.fullname}</div>
          </div>
          {/* Logout/signout button with icon */}
          <button
            className="text-white cursor-pointer"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
          </button>
        </div>
      </nav>

      {/* Snackbar for logout notification */}
      {isSnackbarOpen && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-md shadow-md">
          Anda telah logout. Terima kasih!
          <button className="ml-4 text-white" onClick={closeSnackbar}>
            Tutup
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
