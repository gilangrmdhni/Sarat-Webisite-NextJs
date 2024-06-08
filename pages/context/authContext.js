import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async (token) => {
    try {
      const response = await fetch('https://api.nusa-sarat.nuncorp.id/api/v1/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const profileData = await response.json();
        setUser(profileData.body); // Set profile data to user state
      } else {
        console.error('Failed to fetch profile:', response.statusText);
        setError('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      setError('Error fetching profile');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchProfile(token); 
    }
  }, [fetchProfile]);

  const login = async ({ username, password }) => {
    try {
      const response = await fetch('https://api.nusa-sarat.nuncorp.id/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const token = responseData.body.token;
        localStorage.setItem('token', token);
        fetchProfile(token); 
      } else {
        const errorData = await response.json();
        console.error('Login Gagal:', errorData.message);
        setError('Login Gagal: ' + errorData.message);
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Login Gagal:', error.message);
      setError('Login failed: ' + error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchProfile, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
