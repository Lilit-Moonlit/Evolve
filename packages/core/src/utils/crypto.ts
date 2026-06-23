/**
 * Cryptographic utilities for Evolve
 * Provides hashing, encoding, and signing functions
 */

/**
 * Hash a string using SHA-256
 */
export async function sha256Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Hash a string using SHA-512
 */
export async function sha512Hash(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Encode string to Base64
 */
export function base64Encode(input: string): string {
  try {
    return btoa(input);
  } catch (error) {
    // Handle Unicode strings
    return btoa(
      encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }),
    );
  }
}

/**
 * Decode Base64 to string
 */
export function base64Decode(input: string): string {
  try {
    return atob(input);
  } catch (error) {
    // Handle Unicode strings
    return decodeURIComponent(
      atob(input)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
  }
}

/**
 * Encode string to Base64URL (URL-safe)
 */
export function base64UrlEncode(input: string): string {
  return base64Encode(input)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Decode Base64URL to string
 */
export function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return base64Decode(base64);
}

/**
 * Encode string to Hex
 */
export function hexEncode(input: string): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  return Array.from(data)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Decode Hex to string
 */
export function hexDecode(hex: string): string {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

/**
 * Generate a random bytes array
 */
export function generateRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

/**
 * HMAC-SHA256 signature
 */
export async function hmacSha256(
  key: string,
  message: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
  const signatureArray = Array.from(new Uint8Array(signature));
  return signatureArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Verify HMAC-SHA256 signature
 */
export async function verifyHmacSha256(
  key: string,
  message: string,
  signature: string,
): Promise<boolean> {
  const computedSignature = await hmacSha256(key, message);
  return computedSignature === signature;
}

/**
 * PBKDF2 key derivation
 */
export async function pbkdf2(
  password: string,
  salt: string,
  iterations: number = 100000,
  keyLength: number = 32,
): Promise<string> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const saltData = encoder.encode(salt);

  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordData,
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltData,
      iterations,
      hash: "SHA-256",
    },
    importedKey,
    keyLength * 8,
  );

  const derivedArray = Array.from(new Uint8Array(derivedBits));
  return derivedArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate a cryptographic nonce
 */
export function generateNonce(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = generateRandomString(16);
  return `${timestamp}-${randomPart}`;
}

/**
 * Simple XOR encryption (for basic obfuscation, not secure)
 */
export function xorEncrypt(message: string, key: string): string {
  let result = "";
  for (let i = 0; i < message.length; i++) {
    result += String.fromCharCode(
      message.charCodeAt(i) ^ key.charCodeAt(i % key.length),
    );
  }
  return base64Encode(result);
}

/**
 * Simple XOR decryption (for basic obfuscation, not secure)
 */
export function xorDecrypt(encrypted: string, key: string): string {
  const message = base64Decode(encrypted);
  let result = "";
  for (let i = 0; i < message.length; i++) {
    result += String.fromCharCode(
      message.charCodeAt(i) ^ key.charCodeAt(i % key.length),
    );
  }
  return result;
}

/**
 * Generate a fingerprint for a string
 */
export async function generateFingerprint(input: string): Promise<string> {
  const hash = await sha256Hash(input);
  return hash.substring(0, 16);
}

/**
 * Compare two strings in constant time (to prevent timing attacks)
 */
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
