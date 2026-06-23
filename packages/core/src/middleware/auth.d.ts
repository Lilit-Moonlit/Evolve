/**
 * Authentication middleware for Evolve
 */
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
export declare function generateAuthToken(
  userId: string,
  walletAddress: string,
): AuthToken;
/**
 * Verify auth token
 */
export declare function verifyAuthToken(token: string): AuthContext;
/**
 * Check if user is authenticated
 */
export declare function isAuthenticated(authContext?: AuthContext): boolean;
/**
 * Check if user has required role
 */
export declare function hasRole(
  authContext: AuthContext,
  requiredRole: string,
): boolean;
/**
 * Check if user owns resource
 */
export declare function ownsResource(
  authContext: AuthContext,
  resourceOwnerId: string,
): boolean;
/**
 * Require authentication
 */
export declare function requireAuth(authContext?: AuthContext): AuthContext;
/**
 * Require specific role
 */
export declare function requireRole(
  authContext: AuthContext,
  role: string,
): void;
/**
 * Require resource ownership
 */
export declare function requireOwnership(
  authContext: AuthContext,
  resourceOwnerId: string,
): void;
/**
 * Create authentication middleware
 */
export declare function createAuthMiddleware(): (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;
/**
 * Create role-based authorization middleware
 */
export declare function createRoleMiddleware(
  requiredRole: string,
): (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;
/**
 * Create ownership middleware
 */
export declare function createOwnershipMiddleware(
  getResourceId: (...args: unknown[]) => string,
): (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) => PropertyDescriptor;
/**
 * Hash wallet address for storage
 */
export declare function hashWalletAddress(address: string): Promise<string>;
/**
 * Verify wallet signature
 */
export declare function verifyWalletSignature(
  address: string,
  message: string,
  signature: string,
): Promise<boolean>;
/**
 * Generate nonce for wallet signature
 */
export declare function generateAuthNonce(): string;
/**
 * Validate wallet address format
 */
export declare function validateWalletAddress(address: string): boolean;
//# sourceMappingURL=auth.d.ts.map
