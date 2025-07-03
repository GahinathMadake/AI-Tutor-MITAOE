/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { AuthState, AuthContextType } from '../types/auth';
import { API_BASE, getUrlParams, parseStytchError } from '../utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize with localStorage data if available
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    const storedUser = localStorage.getItem(AUTH_USER_KEY);
    
    if (storedToken && storedUser) {
      try {
        return {
          user: JSON.parse(storedUser),
          token: storedToken,
          isAuthenticated: true,
          isLoading: true, // Will validate token on mount
          error: '',
          success: ''
        };
      } catch (error) {
        // Clear invalid stored data
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: '',
      success: ''
    };
  });

  useEffect(() => {
    if (authState.isAuthenticated && authState.token && authState.user) {
      localStorage.setItem(AUTH_TOKEN_KEY, authState.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authState.user));
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [authState.isAuthenticated, authState.token, authState.user]);

  // Check for URL token on mount and route changes
  // Validate existing token on mount
  useEffect(() => {
    const validateAuthState = async () => {
      const searchParams = new URLSearchParams(location.search);
      const urlParams = getUrlParams(searchParams);
      
      // Handle magic link authentication
      if (urlParams.token && urlParams.stytch_token_type === 'magic_links') {
        setAuthState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));
        
        try {
          const response = await fetch(`${API_BASE}/auth/authenticate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: urlParams.token }),
          });

          const data = await response.json();

          if (data.success) {
            const { user, token } = data.data;
            
            setAuthState(prev => ({
              ...prev,
              user,
              token,
              isAuthenticated: true,
              success: 'Successfully authenticated via magic link!',
              isLoading: false
            }));
            
            // Navigate to dashboard and clear URL params
            navigate('/dashboard', { replace: true });
          } else {
            const errorMessage = parseStytchError(data.error);
            setAuthState(prev => ({
              ...prev,
              error: errorMessage,
              isLoading: false
            }));
            
            // Navigate to auth page and clear URL params
            navigate('/auth', { replace: true });
          }
        } catch (err) {
          setAuthState(prev => ({
            ...prev,
            error: 'Network error. Please check your connection and try again.',
            isLoading: false
          }));
          
          navigate('/auth', { replace: true });
        }
      } 
      // If we have a stored token, validate it
      else if (authState.token && authState.isAuthenticated) {
        try {
          const response = await fetch(`${API_BASE}/user/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${authState.token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              // Token is still valid, update user data
              setAuthState(prev => ({
                ...prev,
                user: data.data.user,
                isLoading: false
              }));
            } else {
              // Token is invalid, clear auth state
              setAuthState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: 'Session expired. Please log in again.',
                success: ''
              });
            }
          } else {
            // Token is invalid, clear auth state
            setAuthState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Session expired. Please log in again.',
              success: ''
            });
          }
        } catch (err) {
          // Network error, but keep existing auth state
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        // No token in URL and no stored token, just stop loading
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    validateAuthState();
  }, [location.search, navigate]);

  const login = async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await fetch(`${API_BASE}/auth/send-magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          login_magic_link_url: `${window.location.origin}/auth/authenticate`,
          signup_magic_link_url: `${window.location.origin}/auth/authenticate`
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthState(prev => ({
          ...prev,
          success: 'Magic link sent! Check your email and click the link, or enter the token below.',
          isLoading: false
        }));
      } else {
        const errorMessage = parseStytchError(data.error);
        setAuthState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false
        }));
      }
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        error: 'Network error. Please check your connection and try again.',
        isLoading: false
      }));
    }
  };

  const authenticate = async (token: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await fetch(`${API_BASE}/auth/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.success) {
        const { user, token } = data.data;
        
        setAuthState(prev => ({
          ...prev,
          user,
          token,
          isAuthenticated: true,
          success: 'Successfully authenticated!',
          isLoading: false
        }));
        
        navigate('/dashboard');
      } else {
        const errorMessage = parseStytchError(data.error);
        setAuthState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false
        }));
      }
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        error: 'Network error. Please check your connection and try again.',
        isLoading: false
      }));
    }
  };

  const updateProfile = async (firstName: string, lastName: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: '', success: '' }));

    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName
        }),
      });

      const data = await response.json();

      if (data.success) {
        const updatedUser = data.data.user;
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
          success: 'Profile updated successfully!',
          isLoading: false
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          error: data.error || 'Failed to update profile',
          isLoading: false
        }));
      }
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        error: 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
      });
    } catch (err) {
      // Continue with logout even if backend call fails
    }

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: '',
      success: ''
    });
    
    navigate('/auth');
  };

  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: '' }));

    try {
      const response = await fetch(`${API_BASE}/user/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authState.token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: '',
          success: 'Account deleted successfully'
        });
        
        navigate('/auth');
      } else {
        setAuthState(prev => ({
          ...prev,
          error: data.error || 'Failed to delete account',
          isLoading: false
        }));
      }
    } catch (err) {
      setAuthState(prev => ({
        ...prev,
        error: 'Network error. Please try again.',
        isLoading: false
      }));
    }
  };

  const setError = (error: string) => {
    setAuthState(prev => ({ ...prev, error }));
  };

  const setSuccess = (success: string) => {
    setAuthState(prev => ({ ...prev, success }));
  };

  const clearMessages = () => {
    setAuthState(prev => ({ ...prev, error: '', success: '' }));
  };

  const value: AuthContextType = {
    ...authState,
    login,
    authenticate,
    logout,
    updateProfile,
    deleteAccount,
    setError,
    setSuccess,
    clearMessages
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };