'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, location: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Load saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('weatherwise_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 🔹 Login
  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('weatherwise_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('weatherwise_user', JSON.stringify(userWithoutPassword));
      return true;
    }

    return false;
  };

  // 🔹 Signup
  const signup = async (
    email: string,
    password: string,
    name: string,
    location: string
  ): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('weatherwise_users') || '[]');

    if (users.find((u: any) => u.email === email)) {
      return false; // email already exists
    }

    const newUser = {
      id: Math.random().toString(36).substring(7),
      email,
      password,
      name,
      location,
      profileImage: '', // 👈 add default image field
    };

    users.push(newUser);
    localStorage.setItem('weatherwise_users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('weatherwise_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  // 🔹 Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('weatherwise_user');
  };

  // 🔹 Update Profile (handles image, name, location, etc.)
  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('weatherwise_user', JSON.stringify(updatedUser));

      // Also update this user's record in the full users list
      const users = JSON.parse(localStorage.getItem('weatherwise_users') || '[]');
      const updatedUsers = users.map((u: any) =>
        u.email === updatedUser.email ? { ...u, ...updates } : u
      );
      localStorage.setItem('weatherwise_users', JSON.stringify(updatedUsers));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
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
