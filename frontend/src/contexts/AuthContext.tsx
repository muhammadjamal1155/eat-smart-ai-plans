
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

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
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  updateNutrition: (targets: NutritionTargets) => Promise<void>;
  isAuthenticated: boolean;
}

const STORAGE_KEY = 'nutriguide_user';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (authUser: any) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is 'row not found'
        console.error('Error fetching profile:', error);
      }

      // If data exists, use it. If not, fallback to auth data
      const profile = data || {};

      const fullUser: User = {
        id: authUser.id,
        email: authUser.email || '',
        name: profile.name || authUser.user_metadata?.name || 'User',
        age: profile.age,
        weight: profile.weight,
        height: profile.height,
        goal: profile.goal,
        nutrition: profile.nutrition || {},
        lifestyle: profile.lifestyle || {},
        security: { twoFactorEnabled: false, connectedDevices: [], loginHistory: [] }
      };

      setUser(fullUser);
    } catch (err) {
      console.error('Profile fetch failed', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email: string, password: string, name: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      // Force local state update immediately
      setUser(null);
      localStorage.removeItem(STORAGE_KEY); // Clean up any local storage
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    // Local update for immediate UI feedback
    setUser(prev => prev ? { ...prev, ...updates } : null);

    // Persist to Supabase
    try {
      const dbUpdates: any = {};
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.age) dbUpdates.age = updates.age;
      if (updates.weight) dbUpdates.weight = updates.weight;
      if (updates.height) dbUpdates.height = updates.height;
      if (updates.goal) dbUpdates.goal = updates.goal;
      if (updates.lifestyle) dbUpdates.lifestyle = updates.lifestyle;
      // Note: Nutrition is handled separately or can be added here if passed

      if (Object.keys(dbUpdates).length > 0) {
        const { error } = await supabase
          .from('profiles')
          .update(dbUpdates)
          .eq('id', user.id);

        if (error) throw error;
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      // Ideally revert state here on failure
    }
  };

  const updateNutrition = async (targets: NutritionTargets) => {
    if (!user) return;

    setUser(prev => prev ? { ...prev, nutrition: { ...prev.nutrition, ...targets } } : null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nutrition: targets })
        .eq('id', user.id);

      if (error) throw error;
    } catch (err) {
      console.error('Failed to update nutrition:', err);
    }
  };

  const value = useMemo(
    () => ({
      user,
      signIn,
      signUp,
      signOut,
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
