// components/Navbar.js
import React, { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '../pages/context/authContext'; // Adjust the path based on your project structure
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, logout } = useAuth();
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


  // State for managing snackbar visibility
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);


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
            <div className="text-lg">{user?.username}</div>
          </div>
          {/* Logout/signout button with icon */}
          <button
            className="text-white cursor-pointer text-sm"
            onClick={handleLogout}
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2 text-sm" />
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
