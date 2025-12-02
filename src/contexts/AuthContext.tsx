
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface NutritionTargets {
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fats?: number | null;
  fiber?: number | null;
}

export interface LifestylePreferences {
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  dietaryPreference?: string;
  allergies?: string[];
  hydrationGoal?: number | null;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: string;
  lastSync: string;
}

export interface LoginHistoryItem {
  id: string;
  device: string;
  location: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: string;
  nutrition?: NutritionTargets;
  lifestyle?: LifestylePreferences;
  timezone?: string;
  avatarColor?: string;
  security?: {
    twoFactorEnabled: boolean;
    connectedDevices: ConnectedDevice[];
    loginHistory: LoginHistoryItem[];
  };
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateNutrition: (targets: NutritionTargets) => Promise<void>;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'nutriguide_user';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const persistUser = (value: User | null) => {
  if (value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch (error) {
        console.warn('Failed to parse stored user payload, resetting.', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    persistUser(userData);
  };

  const logout = () => {
    setUser(null);
    persistUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const nextUser: User = {
        ...prev,
        ...updates,
        nutrition: {
          ...prev.nutrition,
          ...updates.nutrition,
        },
        lifestyle: {
          ...prev.lifestyle,
          ...updates.lifestyle,
        },
        security: {
          twoFactorEnabled: false,
          connectedDevices: [],
          loginHistory: [],
          ...prev.security,
          ...updates.security,
        },
      };
      persistUser(nextUser);
      return nextUser;
    });
  };

  const updateNutrition = async (targets: NutritionTargets) => {
    setUser(prev => {
      if (!prev) return prev;
      const nextUser: User = {
        ...prev,
        nutrition: {
          ...prev.nutrition,
          ...targets,
        },
      };
      persistUser(nextUser);
      return nextUser;
    });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      updateUser,
      updateNutrition,
      isAuthenticated: Boolean(user),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
