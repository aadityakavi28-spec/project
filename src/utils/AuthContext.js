import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from './api';

const AuthContext = createContext();

// Mock test users
const MOCK_USERS = {
  'admin@example.com': {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    password: 'admin123456',
  },
  'engineer@example.com': {
    id: '2',
    email: 'engineer@example.com',
    name: 'Engineer User',
    role: 'engineer',
    password: 'engineer123456',
  },
  'demo@example.com': {
    id: '3',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'engineer',
    password: 'demo123456',
  },
};

// Generate mock token
const generateMockToken = (email) => {
  return `mock_token_${Date.now()}_${email.replace('@', '_').replace('.', '_')}`;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUsingMockAuth, setIsUsingMockAuth] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    const usingMock = localStorage.getItem('usingMockAuth');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsUsingMockAuth(usingMock === 'true');
    }
    setLoading(false);
  }, []);

  const loginWithMock = (email, password) => {
    const mockUser = MOCK_USERS[email];

    if (!mockUser || mockUser.password !== password) {
      throw new Error('Invalid email or password');
    }

    const mockToken = generateMockToken(email);
    const userData = {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
    };

    localStorage.setItem('authToken', mockToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('usingMockAuth', 'true');

    setToken(mockToken);
    setUser(userData);
    setIsUsingMockAuth(true);

    return { token: mockToken, user: userData };
  };

  const loginWithAPI = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('usingMockAuth', 'false');

      setToken(token);
      setUser(user);
      setIsUsingMockAuth(false);

      return { token, user };
    } catch (error) {
      // Fall back to mock auth if API fails
      console.warn('API login failed, falling back to mock auth');
      return loginWithMock(email, password);
    }
  };

  const login = async (email, password) => {
    return loginWithAPI(email, password);
  };

  const register = async (name, email, password, role = 'engineer') => {
    try {
      const response = await authAPI.register({ name, email, password, role });
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('usingMockAuth', 'false');

      setToken(token);
      setUser(user);
      setIsUsingMockAuth(false);

      return { token, user };
    } catch (error) {
      // Create mock user for registration if API fails
      console.warn('API registration failed, creating mock user');
      const mockToken = generateMockToken(email);
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
      };

      localStorage.setItem('authToken', mockToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('usingMockAuth', 'true');

      setToken(mockToken);
      setUser(userData);
      setIsUsingMockAuth(true);

      return { token: mockToken, user: userData };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('usingMockAuth');
    setToken(null);
    setUser(null);
    setIsUsingMockAuth(false);
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isEngineer = user?.role === 'engineer';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        isEngineer,
        isUsingMockAuth,
        MOCK_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
