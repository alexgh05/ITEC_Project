import { create } from 'zustand';
import { useAuth } from '@/providers/AuthProvider';

// This is a wrapper around the useAuth hook for compatibility
export const useAuthStore = () => {
  const auth = useAuth();
  
  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    login: auth.login,
    logout: auth.logout,
    register: auth.register,
    loading: auth.loading,
    error: auth.error
  };
}; 