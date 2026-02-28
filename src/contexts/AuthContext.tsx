// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, remember: boolean) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedAuth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.isAuthenticated && authData.user) {
          setUser(authData.user);
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User, remember: boolean) => {
    setUser(userData);
    const authData = {
      isAuthenticated: true,
      user: userData,
      timestamp: new Date().toISOString()
    };
    
    if (remember) {
      localStorage.setItem('auth', JSON.stringify(authData));
    } else {
      sessionStorage.setItem('auth', JSON.stringify(authData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth');
    sessionStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};