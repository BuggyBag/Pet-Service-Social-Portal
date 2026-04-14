import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserType = 'guest' | 'user' | 'provider';

export interface User {
  id: string;
  type: UserType;
  username?: string;
  email?: string;
  phone?: string;
  providerId?: string;
}

interface AuthContextType {
  user: User;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  signup: (data: { username: string; email: string; phone: string; password: string; isProvider?: boolean }) => Promise<boolean>;
  logout: () => void;
  isGuest: boolean;
  isProvider: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER: User = { id: 'guest', type: 'guest' };

async function fetchProfile(supabaseUser: SupabaseUser): Promise<User> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  return {
    id: supabaseUser.id,
    type: (profile?.user_type as UserType) ?? 'user',
    username: profile?.username ?? supabaseUser.user_metadata?.username,
    email: supabaseUser.email,
    phone: profile?.phone,
    providerId: profile?.provider_id ?? undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(GUEST_USER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const mappedUser = await fetchProfile(session.user);
        setUser(mappedUser);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const mappedUser = await fetchProfile(session.user);
          setUser(mappedUser);
        } else {
          setUser(GUEST_USER);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    return !error;
  };

  const signup = async (data: {
    username: string;
    email: string;
    phone: string;
    password: string;
    isProvider?: boolean;
  }): Promise<boolean> => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          user_type: data.isProvider ? 'provider' : 'user',
        },
      },
    });

    if (error || !authData.user) return false;

    await supabase
      .from('profiles')
      .update({ phone: data.phone })
      .eq('id', authData.user.id);

    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(GUEST_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isGuest: user.type === 'guest',
        isProvider: user.type === 'provider',
        loading,
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