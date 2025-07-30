import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface User {
  _id: Id<"users">;
  email: string;
  persona: "targeted" | "volume";
  createdAt: number;
  updatedAt: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, persona: "targeted" | "volume") => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loginMutation = useMutation(api.auth.loginUser);
  const registerMutation = useMutation(api.auth.registerUser);
  const userQuery = useQuery(api.auth.getUser, userId ? { userId } : "skip");

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId as Id<"users">);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Update user when query returns
  useEffect(() => {
    if (userQuery !== undefined) {
      setUser(userQuery);
      setIsLoading(false);
    }
  }, [userQuery]);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation({ email, password });
      setUserId(result.userId);
      localStorage.setItem('userId', result.userId);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, persona: "targeted" | "volume") => {
    try {
      const result = await registerMutation({ email, password, persona });
      setUserId(result.userId);
      localStorage.setItem('userId', result.userId);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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