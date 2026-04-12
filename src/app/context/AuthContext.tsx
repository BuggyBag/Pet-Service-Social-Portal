import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'guest' | 'user' | 'provider';

export interface User {
  id: string;
  type: UserType;
  username?: string;
  email?: string;
  phone?: string;
  providerId?: string; // For providers, links to their provider profile
}

interface AuthContextType {
  user: User;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  signup: (data: { username: string; email: string; phone: string; password: string; isProvider?: boolean }) => Promise<boolean>;
  logout: () => void;
  isGuest: boolean;
  isProvider: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_USER: User = {
  id: 'guest',
  type: 'guest'
};

// Mock users for demo (in real app, this would be in a database)
const mockUsers = [
  {
    id: '1',
    type: 'user' as UserType,
    username: 'johndoe',
    email: 'john@example.com',
    phone: '(555) 111-2222',
    password: 'password123'
  },
  {
    id: '2',
    type: 'provider' as UserType,
    username: 'pawsitivegrooming',
    email: 'contact@pawsitivegrooming.com',
    phone: '(555) 123-4567',
    password: 'provider123',
    providerId: '1'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(GUEST_USER);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('petconnect_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user', error);
      }
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user.type !== 'guest') {
      localStorage.setItem('petconnect_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('petconnect_user');
    }
  }, [user]);

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    // Mock authentication
    const foundUser = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const signup = async (data: { 
    username: string; 
    email: string; 
    phone: string; 
    password: string;
    isProvider?: boolean;
  }): Promise<boolean> => {
    // Mock signup - in real app, this would create a new user in database
    const newUser: User = {
      id: `user_${Date.now()}`,
      type: data.isProvider ? 'provider' : 'user',
      username: data.username,
      email: data.email,
      phone: data.phone,
      providerId: data.isProvider ? `provider_${Date.now()}` : undefined
    };

    setUser(newUser);
    return true;
  };

  const logout = () => {
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
        isProvider: user.type === 'provider'
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
