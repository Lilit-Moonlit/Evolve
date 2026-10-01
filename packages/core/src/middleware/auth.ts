// Copyright (c) 2024 Evolve Protocol
// SPDX-License-Identifier: MIT

/**
 * Authentication middleware for Evolve
 */

import { AuthenticationError, AuthorizationError } from "./errorHandler";
import { SiweMessage } from "siwe";
import { verifyMessage } from "ethers"; // Use specific import for better typing
/**
 * Nonce provider interface — inject implementation from apps/web at call site.
 * packages/core must NOT depend on apps/web.
 */
export interface NonceProvider {
  getNonce(nonce: string): Promise<{ expires: number } | null>;
  markNonceUsed(nonce: string): Promise<void>;
}

export interface AuthContext {
  userId: string;
  walletAddress: string;
  timestamp: number;
}

export interface AuthToken {
  token: string;
  expiresAt: number;
}

/**
 * Generate a simple auth token (in production, use JWT)
 */
export function generateAuthToken(
  userId: string,
  walletAddress: string,
): AuthToken {
  const payload = {
    userId,
    walletAddress,
    timestamp: Date.now(),
  };
  const token = btoa(JSON.stringify(payload));
  const expiresAt = Date.now() + 3600000; // 1 hour
  return { token, expiresAt };
}

/**
 * Verify auth token
 */
export function verifyAuthToken(token: string): AuthContext {
  try {
    const payload = JSON.parse(atob(token));
    const now = Date.now();

    if (now > payload.timestamp + 3600000) {
      throw new AuthenticationError("Token expired");
    }

    return {
      userId: payload.userId,
      walletAddress: payload.walletAddress,
      timestamp: payload.timestamp,
    };
  } catch (error) {
    throw new AuthenticationError("Invalid token");
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(authContext?: AuthContext): boolean {
  return !!authContext && !!authContext.userId;
}

/**
 * Check if user has required role
 */
export function hasRole(
  authContext: AuthContext,
  requiredRole: string,
): boolean {
  // In a real implementation, this would check user roles
  return true;
}

/**
 * Check if user owns resource
 */
export function ownsResource(
  authContext: AuthContext,
  resourceOwnerId: string,
): boolean {
  return authContext.userId === resourceOwnerId;
}

/**
 * Require authentication
 */
export function requireAuth(authContext?: AuthContext): AuthContext {
  if (!isAuthenticated(authContext)) {
    throw new AuthenticationError();
  }
  return authContext!;
}

/**
 * Require specific role
 */
export function requireRole(authContext: AuthContext, role: string): void {
  requireAuth(authContext);
  if (!hasRole(authContext, role)) {
    throw new AuthorizationError("Insufficient permissions");
  }
}

/**
 * Require resource ownership
 */
export function requireOwnership(
  authContext: AuthContext,
  resourceOwnerId: string,
): void {
  requireAuth(authContext);
  if (!ownsResource(authContext, resourceOwnerId)) {
    throw new AuthorizationError("You do not own this resource");
  }
}

/**
 * Create authentication middleware
 */
export function createAuthMiddleware() {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      // Check if auth context is available
      const authContext = (this as any).authContext;

      if (!isAuthenticated(authContext)) {
        throw new AuthenticationError();
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Create role-based authorization middleware
 */
export function createRoleMiddleware(requiredRole: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const authContext = (this as any).authContext;

      requireRole(authContext, requiredRole);

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Create ownership middleware
 */
export function createOwnershipMiddleware(
  getResourceId: (...args: unknown[]) => string,
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const authContext = (this as any).authContext;
      const resourceOwnerId = getResourceId(...args);

      requireOwnership(authContext, resourceOwnerId);

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Hash wallet address for storage
 */
export async function hashWalletAddress(address: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(address.toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify wallet signature
 */
export async function verifyWalletSignature(
  address: string,
  message: string,
  signature: string,
  nonceProvider?: NonceProvider,
): Promise<{ valid: boolean; address?: string; error?: string }> {
  try {
    // Parse the SIWE message
    const siweMessage = new SiweMessage(message);
    // Verify the signature using ethers.js
    const recoveredAddress = verifyMessage(siweMessage.prepareMessage(), signature);
    // Verify the message domain matches current host
    if (siweMessage.domain !== window.location.host) {
      return { valid: false, error: "Message domain does not match current site" };
    }
    // Normalize addresses for comparison
    const normalizedRecovered = recoveredAddress.toLowerCase();
    const normalizedProvided = address.toLowerCase();
    if (normalizedRecovered !== normalizedProvided) {
      return { valid: false, error: "Signature does not match the provided address" };
    }
    // Verify the nonce is valid and not expired (if nonceProvider injected)
    if (nonceProvider) {
      const nonce = siweMessage.nonce;
      const nonceRecord = await nonceProvider.getNonce(nonce);
      if (!nonceRecord || nonceRecord.expires < Date.now()) {
        return { valid: false, error: "Nonce is invalid or expired" };
      }
      // Mark nonce as used
      await nonceProvider.markNonceUsed(nonce);
    }
    return { valid: true, address: recoveredAddress };
  } catch (error) {
    console.error('SIWE verification failed:', error);
    return { valid: false, error: error instanceof Error ? error.message : 'Verification failed' };
  }
}

/**
 * Generate nonce for wallet signature
 */
export function generateAuthNonce(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Validate wallet address format
 */
export function validateWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}