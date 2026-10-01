/**
 * Lab QR payload helpers for the Companion flow.
 *
 * A patient's profile renders a QR code with payload
 * `evolve://lab-patient/<userId>`. Lab staff scan it from the lab account
 * and immediately get routed to the patient's photo-verification page.
 */

/**
 * Parse the payload scanned from a patient's QR code.
 *
 * Accepts the canonical `evolve://lab-patient/<userId>` payload as well as a
 * raw userId (fallback for manual scans). Returns `null` for empty/whitespace.
 */
export const parseLabPatientPayload = (decodedText: string): string | null => {
  const match = decodedText.match(/evolve:\/\/lab-patient\/(.+)$/);
  const extractedId = match ? decodeURIComponent(match[1]) : decodedText.trim();
  return extractedId || null;
};
