/**
 * DNA-based account recovery.
 *
 * Flow:
 * 1. User enters the email associated with their Evolve account.
 * 2. User pastes / uploads their DNA test result text.
 * 3. Frontend parses the text with parseDNATest() and generates a hash
 *    with generateDNAHash().
 * 4. The email + hash are sent to POST /api/auth/dna-recover.
 * 5. Server looks up the user by email, fetches their on-chain DNA profile
 *    from DNAVerification.getDNAProfile(), and compares the hashes.
 * 6. On match → session cookie is issued, user is authenticated.
 */

import { parseDNATest, generateDNAHash } from "./dna-parser";

export interface DnaRecoveryResult {
  success: boolean;
  error?: string;
  user?: { id: string; email?: string; ethAddress?: string };
}

/**
 * Attempt account recovery by proving control of a previously-registered
 * DNA profile.
 */
export async function requestDnaRecovery(
  email: string,
  dnaText: string,
): Promise<DnaRecoveryResult> {
  // 1. Parse the DNA test text on the client side first to fail fast.
  const parsed = parseDNATest(dnaText);
  if (!parsed.valid || !parsed.strProfile) {
    return {
      success: false,
      error: parsed.errors?.[0] || "Could not parse DNA test result",
    };
  }

  // 2. Generate the same hash the backend will compare against on-chain data.
  const dnaHash = await generateDNAHash(parsed.strProfile);

  // 3. Send to server.
  const res = await fetch("/api/auth/dna-recover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: email.trim().toLowerCase(), dnaHash }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    return {
      success: false,
      error: data.error || "DNA recovery failed",
    };
  }

  return {
    success: true,
    user: data.user,
  };
}
