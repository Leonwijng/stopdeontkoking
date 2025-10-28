// User role enum
export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

// User interface
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

// User creation input (for signup)
export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  username?: string; // Optional, will default to email if not provided
  role?: UserRole; // Optional, defaults to USER
}

// Login input
export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean; // Optional, for refresh token
}

// User response (for API responses, without sensitive data)
export interface UserResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: Date;
}

// User profile update input
export interface UserProfileUpdateInput {
  name?: string;
  email?: string;
  username?: string;
  password?: string;
  current_password?: string; // Required when updating password
}

// Authentication response (success/error)
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserResponse;
  errors?: Record<string, string>;
}

// JWT payload interface
export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
