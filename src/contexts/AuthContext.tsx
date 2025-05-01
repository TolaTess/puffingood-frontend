import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  initializeAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | undefined>();

  // Cleanup function for auth listener
  useEffect(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [unsubscribe]);

  const initializeAuth = async () => {
    if (unsubscribe) {
      // Already initialized
      return;
    }

    setLoading(true);
    try {
      const unsub = auth.onAuthStateChanged(
        (user) => {
          setUser(user);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Auth state change error:', error);
          setError('Authentication failed. Please try again.');
          setLoading(false);
        }
      );
      setUnsubscribe(() => unsub);
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError('Failed to initialize authentication. Please check your internet connection.');
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, initializeAuth }}>
      {children}
    </AuthContext.Provider>
  );
}; 