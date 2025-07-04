/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string;
  email: string;
  name?: string;
  prn?: string;
  role?: string;
  school?: string;
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
  requiresCompletion: boolean;
}

export const SCHOOLS = {
  SCET: "School of Computer Engineering and Technology",
  SEE: "School of Electrical Engineering",
  SCE: "School of Chemical Engineering",
  SHES: "School of Humanities and Engineering Sciences",
  SMCE: "School of Mechanical and Civil Engineering",
  SD: "School of Design"
} as const;



export type SCHOOLS = keyof typeof SCHOOLS;

export interface AuthContextType extends AuthState {
  login: (email: string) => Promise<void>;
  authenticate: (token: string) => Promise<void>;
  completeSignup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
  clearMessages: () => void;
}

export interface SignupData {
  name: string;
  prn: string;
  role?: number;
  school?: string;
}

export interface LoginRequest {
  email: string;
  login_magic_link_url?: string;
  signup_magic_link_url?: string;
}

export interface AuthenticateRequest {
  token: string;
}

export interface CompleteSignupRequest {
  stytch_user_id: string;
  name: string;
  prn: string;
  role?: number;
  school?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}