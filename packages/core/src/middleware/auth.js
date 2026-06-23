/**
 * Authentication middleware for Evolve
 */
import { AuthenticationError, AuthorizationError } from "./errorHandler";
/**
 * Generate a simple auth token (in production, use JWT)
 */
export function generateAuthToken(userId, walletAddress) {
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
export function verifyAuthToken(token) {
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
export function isAuthenticated(authContext) {
  return !!authContext && !!authContext.userId;
}
/**
 * Check if user has required role
 */
export function hasRole(authContext, requiredRole) {
  // In a real implementation, this would check user roles
  return true;
}
/**
 * Check if user owns resource
 */
export function ownsResource(authContext, resourceOwnerId) {
  return authContext.userId === resourceOwnerId;
}
/**
 * Require authentication
 */
export function requireAuth(authContext) {
  if (!isAuthenticated(authContext)) {
    throw new AuthenticationError();
  }
  return authContext;
}
/**
 * Require specific role
 */
export function requireRole(authContext, role) {
  requireAuth(authContext);
  if (!hasRole(authContext, role)) {
    throw new AuthorizationError("Insufficient permissions");
  }
}
/**
 * Require resource ownership
 */
export function requireOwnership(authContext, resourceOwnerId) {
  requireAuth(authContext);
  if (!ownsResource(authContext, resourceOwnerId)) {
    throw new AuthorizationError("You do not own this resource");
  }
}
/**
 * Create authentication middleware
 */
export function createAuthMiddleware() {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      // Check if auth context is available
      const authContext = this.authContext;
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
export function createRoleMiddleware(requiredRole) {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      const authContext = this.authContext;
      requireRole(authContext, requiredRole);
      return originalMethod.apply(this, args);
    };
    return descriptor;
  };
}
/**
 * Create ownership middleware
 */
export function createOwnershipMiddleware(getResourceId) {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args) {
      const authContext = this.authContext;
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
export async function hashWalletAddress(address) {
  const encoder = new TextEncoder();
  const data = encoder.encode(address.toLowerCase());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
/**
 * Verify wallet signature
 */
export async function verifyWalletSignature(address, message, signature) {
  // In a real implementation, this would use ethers.js or web3.js
  // to recover the address from the signature
  // For now, this is a placeholder
  return true;
}
/**
 * Generate nonce for wallet signature
 */
export function generateAuthNonce() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
/**
 * Validate wallet address format
 */
export function validateWalletAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
//# sourceMappingURL=auth.js.map
