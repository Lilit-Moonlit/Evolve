/**
 * User type for Evolve
 * Represents a basic user in the system
 */
export interface User {
  id: string;
  walletAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User profile information
 */
export interface UserProfile {
  userId: string;
  name: string;
  age?: number;
  bio?: string;
  avatar?: string;
  location?: string;
  interests?: string[];
  photos?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User preferences for matching
 */
export interface UserPreferences {
  userId: string;
  minAge?: number;
  maxAge?: number;
  gender?: string;
  location?: string;
  maxDistance?: number;
  interests?: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User status
 */
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  DELETED = "deleted",
}
