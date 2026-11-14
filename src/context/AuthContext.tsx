import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserAccount } from '../types/auth';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  registeredUsers: UserAccount[];
  login: (email: string, pass: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, pass: string, role?: string) => { success: boolean; error?: string };
  logout: () => void;
  quickLoginAsShivam: () => void;
  updateUserAccount: (updates: Partial<UserAccount>) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const STORAGE_KEY_USERS = 'taskflow_registered_users_v2';
const STORAGE_KEY_SESSION = 'taskflow_active_session_uid_v2';

const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'user-shivam',
    name: 'Shivam Jagtap',
    email: 'shivam@taskflow.dev',
    role: 'Founder & Lead Designer',
    initials: 'SJ',
    createdAt: new Date().toISOString(),
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load registered users
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load registered users', e);
    }
    return DEFAULT_USERS;
  });

  // Load active session user
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const activeUid = localStorage.getItem(STORAGE_KEY_SESSION);
      if (activeUid) {
        const usersStored = localStorage.getItem(STORAGE_KEY_USERS);
        const usersList: UserAccount[] = usersStored ? JSON.parse(usersStored) : DEFAULT_USERS;
        const match = usersList.find(u => u.id === activeUid);
        if (match) return match;
      }
    } catch (e) {
      console.error('Failed to load active session', e);
    }
    // Default to Shivam Jagtap on first visit
    return DEFAULT_USERS[0];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync users list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Failed to save users', e);
    }
  }, [registeredUsers]);

  // Sync active session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_SESSION, currentUser.id);
      } else {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      }
    } catch (e) {
      console.error('Failed to save session', e);
    }
  }, [currentUser]);

  const login = useCallback((email: string, _pass: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = registeredUsers.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, error: 'No account found with this email address.' };
    }

    setCurrentUser(user);
    setIsAuthModalOpen(false);
    return { success: true };
  }, [registeredUsers]);

  const signup = useCallback((name: string, email: string, _pass: string, role?: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, error: 'Please enter your name.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const existing = registeredUsers.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    // Compute initials
    const parts = trimmedName.split(/\s+/);
    const initials = parts.map(p => p[0]?.toUpperCase()).slice(0, 2).join('') || 'U';

    const newUser: UserAccount = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      name: trimmedName,
      email: trimmedEmail,
      role: role?.trim() || 'Product Member',
      initials,
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  }, [registeredUsers]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  }, []);

  const quickLoginAsShivam = useCallback(() => {
    const shivam = registeredUsers.find(u => u.id === 'user-shivam') || DEFAULT_USERS[0];
    setCurrentUser(shivam);
    setIsAuthModalOpen(false);
  }, [registeredUsers]);

  const updateUserAccount = useCallback((updates: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };

    if (updates.name && !updates.initials) {
      const parts = updates.name.trim().split(/\s+/);
      updated.initials = parts.map(p => p[0]?.toUpperCase()).slice(0, 2).join('') || 'SJ';
    }

    setCurrentUser(updated);
    setRegisteredUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        registeredUsers,
        login,
        signup,
        logout,
        quickLoginAsShivam,
        updateUserAccount,
        isAuthModalOpen,
        setIsAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
