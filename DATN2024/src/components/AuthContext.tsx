import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../interfaces/Interface';

interface AuthContextProps {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: User) => void; 
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const login = (userData: User) => setUser(userData);
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  }
  const updateUser = (userData: User) => setUser(userData);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    setIsLoading(false);
    setUser(userData);
  },[])

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {isLoading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
