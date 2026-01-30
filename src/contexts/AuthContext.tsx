/**
 * Authentication Context
 * Manages user authentication state throughout the app
 * Uses cookie-based auth with httpOnly cookies
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials } from '@/types';
import api, { getErrorMessage } from '@/lib/api';
import config from '@/config/env';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo mode
const mockUsers: Record<string, User & { password: string }> = {
  'admin@sola.dev': {
    id: '1',
    name: 'Admin User',
    email: 'admin@sola.dev',
    role: 'admin',
    password: 'admin123',
    createdAt: '2024-01-01T00:00:00Z',
  },
  'staff@sola.dev': {
    id: '2',
    name: 'Staff Member',
    email: 'staff@sola.dev',
    role: 'staff',
    password: 'staff123',
    createdAt: '2024-01-15T00:00:00Z',
  },
  'viewer@sola.dev': {
    id: '3',
    name: 'Viewer User',
    email: 'viewer@sola.dev',
    role: 'viewer',
    password: 'viewer123',
    createdAt: '2024-02-01T00:00:00Z',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (config.enableMock) {
        // In mock mode, check localStorage for session
        const storedUser = localStorage.getItem('mock_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        // Real API call
        const response = await api.get<User>('/auth/me');
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<void> => {
    if (config.enableMock) {
      // Mock login
      const mockUser = mockUsers[credentials.email];
      if (mockUser && mockUser.password === credentials.password) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = mockUser;
        setUser(userWithoutPassword);
        
        if (credentials.rememberMe) {
          localStorage.setItem('mock_user', JSON.stringify(userWithoutPassword));
        } else {
          sessionStorage.setItem('mock_user', JSON.stringify(userWithoutPassword));
        }
        return;
      }
      throw new Error('Invalid email or password');
    }

    // Real API login
    const response = await api.post<User>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    setUser(response.data);
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      if (config.enableMock) {
        localStorage.removeItem('mock_user');
        sessionStorage.removeItem('mock_user');
      } else {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', getErrorMessage(error));
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
