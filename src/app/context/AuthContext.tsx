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
const STORAGE_KEY = 'petconnect_mock_user';

// ─── Cuentas mock locales ───────────────────────────────────────────────────
// Usadas cuando Supabase no está configurado o falla.
// Las cuentas creadas con signup también se guardan aquí en localStorage.

interface MockAccount {
  id: string;
  email: string;
  password: string;
  username: string;
  phone: string;
  type: UserType;
  providerId?: string;
}

const DEFAULT_MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: 'mock-user-1',
    email: 'john@example.com',
    password: 'password123',
    username: 'John Doe',
    phone: '(555) 111-2222',
    type: 'user',
  },
  {
    id: 'mock-provider-1',
    email: 'contact@pawsitivegrooming.com',
    password: 'provider123',
    username: 'Pawsitive Grooming',
    phone: '(555) 987-6543',
    type: 'provider',
    providerId: '1',
  },
  {
    id: 'mock-provider-2',
    email: 'info@happypawsvet.com',
    password: 'provider123',
    username: 'Happy Paws Vet',
    phone: '(555) 246-8100',
    type: 'provider',
    providerId: '2',
  },
];

function getMockAccounts(): MockAccount[] {
  try {
    const stored = localStorage.getItem('petconnect_mock_accounts');
    if (stored) {
      const parsed = JSON.parse(stored) as MockAccount[];
      // Merge with defaults so defaults are always available
      const storedIds = parsed.map(a => a.id);
      const missing = DEFAULT_MOCK_ACCOUNTS.filter(a => !storedIds.includes(a.id));
      return [...DEFAULT_MOCK_ACCOUNTS.filter(a => storedIds.includes(a.id) === false), ...parsed, ...missing.filter(m => !parsed.find(p => p.email === m.email))];
    }
  } catch {}
  return [...DEFAULT_MOCK_ACCOUNTS];
}

function saveMockAccounts(accounts: MockAccount[]) {
  try {
    localStorage.setItem('petconnect_mock_accounts', JSON.stringify(accounts));
  } catch {}
}

function mockAccountToUser(acc: MockAccount): User {
  return {
    id: acc.id,
    type: acc.type,
    username: acc.username,
    email: acc.email,
    phone: acc.phone,
    providerId: acc.providerId,
  };
}

// ─── Detectar si Supabase está configurado ──────────────────────────────────
function isSupabaseConfigured(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key && url !== 'undefined' && key !== 'undefined' && url.startsWith('https://'));
}

// ─── Helpers Supabase ───────────────────────────────────────────────────────
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

// ─── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(GUEST_USER);
  const [loading, setLoading] = useState(true);
  const useSupabase = isSupabaseConfigured();

  // Restore session on mount
  useEffect(() => {
    if (useSupabase) {
      // Real Supabase session
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
    } else {
      // Mock session from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored) as User);
        }
      } catch {}
      setLoading(false);
    }
  }, [useSupabase]);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    if (useSupabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      return !error;
    }

    // Mock login
    const accounts = getMockAccounts();
    const match = accounts.find(
      a => a.email.toLowerCase() === credentials.email.toLowerCase() && a.password === credentials.password
    );

    if (!match) return false;

    const loggedIn = mockAccountToUser(match);
    setUser(loggedIn);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    return true;
  };

  // ── Signup ─────────────────────────────────────────────────────────────────
  const signup = async (data: {
    username: string;
    email: string;
    phone: string;
    password: string;
    isProvider?: boolean;
  }): Promise<boolean> => {
    if (useSupabase) {
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

      // Upsert profile row (handles both insert and update)
      await supabase.from('profiles').upsert({
        id: authData.user.id,
        username: data.username,
        phone: data.phone,
        user_type: data.isProvider ? 'provider' : 'user',
      });

      return true;
    }

    // Mock signup — check for duplicate email
    const accounts = getMockAccounts();
    const exists = accounts.find(a => a.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return false;

    const newAccount: MockAccount = {
      id: `mock-${Date.now()}`,
      email: data.email,
      password: data.password,
      username: data.username,
      phone: data.phone,
      type: data.isProvider ? 'provider' : 'user',
    };

    saveMockAccounts([...accounts, newAccount]);

    const newUser = mockAccountToUser(newAccount);
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return true;
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = async () => {
    if (useSupabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(STORAGE_KEY);
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
