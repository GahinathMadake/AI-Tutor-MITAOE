export interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  status: 'active' | 'pending_deletion' | 'deleted';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
  success: string;
}

export interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  authenticate: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (firstName: string, lastName: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  clearMessages: () => void;
}