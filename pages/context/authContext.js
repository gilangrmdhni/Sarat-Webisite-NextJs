import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = (token) => {
    try {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
    } catch (error) {
      console.error('Error decoding token:', error.message);
    }
  };

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
            const userData = JSON.parse(atob(token.split('.')[1]));
            setUser(userData);
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
    } catch (error) {
        throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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
