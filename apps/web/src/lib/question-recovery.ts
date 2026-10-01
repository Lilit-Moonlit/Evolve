/**
 * Security-question based account recovery.
 *
 * Flow:
 * 1. User enters the email associated with their Evolve account.
 * 2. User answers their pre-configured security question.
 * 3. Frontend sends the email + answer to POST /api/auth/question-recover.
 * 4. Server hashes the answer (SHA-256, lowercased + trimmed) and compares
 *    it to the stored hash on the User record.
 * 5. On match → session cookie is issued, user is authenticated.
 */

export interface QuestionRecoveryResult {
  success: boolean;
  error?: string;
  user?: { id: string; email?: string; ethAddress?: string };
}

/**
 * Attempt account recovery by answering the account's security question.
 */
export async function requestQuestionRecovery(
  email: string,
  answer: string,
): Promise<QuestionRecoveryResult> {
  const res = await fetch("/api/auth/question-recover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: email.trim().toLowerCase(), answer }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    return {
      success: false,
      error: data.error || "Recovery failed",
    };
  }

  return {
    success: true,
    user: data.user,
  };
}

/**
 * Save (or update) the current user's security question + answer.
 * Authenticated-only; hashing happens server-side.
 */
export async function setSecurityQuestion(
  question: string,
  answer: string,
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("/api/auth/set-security-question", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ question: question.trim(), answer }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    return { success: false, error: data.error || "Failed to save security question" };
  }
  return { success: true };
}
