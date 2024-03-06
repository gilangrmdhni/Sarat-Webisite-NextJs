import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async ({ email, password }) => {
    try {
      // Simulasikan panggilan API untuk otentikasi pengguna
      const response = await fetch('https://api.nusa-saim.nuncorp.id/live/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Jika autentikasi berhasil, atur user di state
        const userData = await response.json();
        setUser(userData);
      } else {
        // Jika autentikasi gagal, lempar error
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      // Handle other errors
    }
  };

  const logout = () => {
    // Lakukan logout, hapus data sesi pengguna dari state
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
