'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = Cookies.get('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data:', e);
        Cookies.remove('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate a successful login with hardcoded data
      if (email === 'demo@example.com' && password === 'password') {
        const userData: User = {
          id: '1',
          email: 'demo@example.com',
          name: 'John Doe',
          role: 'admin',
        };
        
        // Store in cookie (expires in 7 days)
        Cookies.set('user', JSON.stringify(userData), { expires: 7 });
        setUser(userData);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
