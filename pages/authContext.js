import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Memperbarui state user dengan data pengguna dari local storage
      fetchUserData(token);
    }
  }, []);  

  // Fungsi untuk mendapatkan data pengguna berdasarkan token
  const fetchUserData = async (token) => {
    try {
      const response = await fetch('https://api.nusa-saim.nuncorp.id/live/api/v1/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Memperbarui state user dengan data pengguna yang diperoleh
        setUser(userData);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const login = async ({ email, password }) => {
    try {
      const response = await fetch('https://api.nusa-saim.nuncorp.id/live/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Data dari panggilan API:', userData);
        const token = response.headers.get('Authorization').replace('Bearer ', '');
        localStorage.setItem('token', token);
        console.log('Data token dari panggilan API:', token);
        // Memanggil fungsi fetchUserData untuk mendapatkan data pengguna setelah berhasil login
        fetchUserData(token);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    // Menghapus data pengguna dari state user saat logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
