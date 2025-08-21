import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Login failed');
          }

          const { user, token } = data.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Login failed' 
          });
          return { success: false, error: error.message };
        }
      },

      // Register action
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
          }

          const { user, token } = data.data;

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return { success: true };
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error.message || 'Registration failed' 
          });
          return { success: false, error: error.message };
        }
      },

      // Logout action
      logout: async () => {
        try {
          const token = get().token;
          if (token) {
            await fetch(`${API_BASE_URL}/auth/logout`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
          }
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      // Google Auth
      googleAuth: async () => {
        set({ isLoading: true, error: null });
        try {
          // First, wake up the server with a health check
          console.log('🔄 Checking server status before OAuth...');
          
          const healthCheck = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
            method: 'GET',
            cache: 'no-cache'
          });
          
          if (!healthCheck.ok) {
            throw new Error('Server is not responding. Please try again in a moment.');
          }
          
          console.log('✅ Server is awake, proceeding with OAuth...');
          
          // Small delay to ensure server is fully ready
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Redirect to Google OAuth endpoint
          window.location.href = `${API_BASE_URL}/auth/google`;
        } catch (error) {
          console.error('Google Auth preparation failed:', error);
          set({ 
            isLoading: false, 
            error: error.message || 'Server is starting up. Please try again in a moment.' 
          });
          return { success: false, error: error.message };
        }
      },

      // Handle Google Auth callback
      handleGoogleCallback: async (token, user) => {
        console.log('handleGoogleCallback called with:', { token: !!token, user });
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        console.log('Auth state updated, user should be authenticated');
        return { success: true };
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Initialize auth (check if user is already logged in)
      initializeAuth: () => {
        const state = get();
        // If we have a token but not authenticated status, restore it
        if (state.token && !state.isAuthenticated) {
          set({ isAuthenticated: true });
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        set({ isLoading: true });
        try {
          const token = get().token;
          const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(profileData),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Profile update failed');
          }

          set({
            user: data.data.user,
            isLoading: false
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message });
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;