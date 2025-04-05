import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, loginWithGoogleApi, registerWithGoogleApi } from '@/lib/api';
import { useWishlistStore } from '@/store/useWishlistStore';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (name: string | null, email: string | null, password: string | null, role?: string, googleCredential?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [persistMode, setPersistMode] = useState<'local' | 'session'>('session');
  const wishlistStore = useWishlistStore();

  // Initialize auth state from storage (either localStorage or sessionStorage)
  useEffect(() => {
    // First check localStorage (Remember Me was used before)
    const localUser = localStorage.getItem('user');
    const localToken = localStorage.getItem('token');
    
    if (localUser && localToken) {
      setUser(JSON.parse(localUser));
      setToken(localToken);
      setPersistMode('local');
      setLoading(false);
      return;
    }
    
    // Then check sessionStorage (default login without Remember Me)
    const sessionUser = sessionStorage.getItem('user');
    const sessionToken = sessionStorage.getItem('token');
    
    if (sessionUser && sessionToken) {
      setUser(JSON.parse(sessionUser));
      setToken(sessionToken);
      setPersistMode('session');
    }
    
    setLoading(false);
  }, []);

  // Helper function to save auth data to the appropriate storage
  const saveAuthData = (userData: User, authToken: string, remember: boolean = false) => {
    // Clear both storages first to avoid duplication
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    
    // Save to the appropriate storage
    const storage = remember ? localStorage : sessionStorage;
    setPersistMode(remember ? 'local' : 'session');
    
    storage.setItem('user', JSON.stringify(userData));
    storage.setItem('token', authToken);
  };

  // Login function
  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = await loginUser({ email, password });
      
      // Only proceed if we get valid user data
      if (userData && userData.token) {
        // Extract the token from the response
        const token = userData.token;
        
        // Remove token from user data before storing
        const { token: _, ...userWithoutToken } = userData;
        
        // Update state
        setUser(userWithoutToken);
        setToken(token);
        
        // Store in the appropriate storage based on rememberMe
        saveAuthData(userWithoutToken, token, rememberMe);
        
        // Sync wishlist with server
        try {
          await wishlistStore.syncWithUser(token);
        } catch (error) {
          console.error('Failed to sync wishlist after login:', error);
        }
        
        return userData; // Return successful login data
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      // Set a more specific error message
      if (err.message.includes('Invalid credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      }
      console.error('Login error:', err);
      throw err; // Re-throw to let the component handle it
    } finally {
      setLoading(false);
    }
  };

  // Login with Google function
  const loginWithGoogle = async (credential: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call API to verify Google token and get user data
      const userData = await loginWithGoogleApi(credential);
      
      // Only proceed if we get valid user data
      if (userData && userData.token) {
        // Extract the token from the response
        const token = userData.token;
        
        // Remove token from user data before storing
        const { token: _, ...userWithoutToken } = userData;
        
        // Update state
        setUser(userWithoutToken);
        setToken(token);
        
        // Store in the appropriate storage (default to sessionStorage for security)
        saveAuthData(userWithoutToken, token, false);
        
        // Sync wishlist with server
        try {
          await wishlistStore.syncWithUser(token);
        } catch (error) {
          console.error('Failed to sync wishlist after Google login:', error);
        }
        
        return userData; // Return successful login data
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Google login failed. Please try again.');
      console.error('Google login error:', err);
      throw err; // Re-throw to let the component handle it
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name: string | null, email: string | null, password: string | null, role?: string, googleCredential?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let userData;
      
      // If Google credential is provided, use Google registration
      if (googleCredential) {
        userData = await registerWithGoogleApi(googleCredential, role || 'user');
      } else if (name && email && password) {
        // Regular registration with email/password
        userData = await registerUser({ name, email, password, role });
      } else {
        throw new Error('Invalid registration data');
      }
      
      // Extract the token from the response
      const token = userData.token;
      
      // Remove token from user data before storing
      const { token: _, ...userWithoutToken } = userData;
      
      // Update state
      setUser(userWithoutToken);
      setToken(token);
      
      // Store in session storage by default for new registrations
      saveAuthData(userWithoutToken, token, false);
      
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Clear both storages to ensure complete logout
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  };

  // Update user function
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    
    // Update in the current storage mode
    if (persistMode === 'local') {
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        register,
        logout,
        setUser: updateUser,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 