import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  name?: string;
  prn?: string;
  role?: number;
  school?: string;
  created_at: string;
  status: 'active' | 'pending_deletion' | 'deleted';
}

export interface AuthenticatedRequest extends Request {
  user?: User;
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

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

// Extended Stytch types for better compatibility
export interface StytchUserName {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
}

export interface StytchEmail {
  email: string;
  email_id: string;
  verified: boolean;
}

export interface StytchUser {
  user_id: string;
  emails: StytchEmail[];
  name?: StytchUserName;
  created_at: string;
  status: string;
  phone_numbers?: any[];
  providers?: any[];
}