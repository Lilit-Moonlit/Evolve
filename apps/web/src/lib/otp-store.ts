/**
 * In-memory OTP store for development
 * In production, this should be replaced with Redis or a database
 */

interface OTPEntry {
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
}

class OTPStore {
  private store: Map<string, OTPEntry> = new Map();
  private readonly OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ATTEMPTS = 3;

  /**
   * Generate a 6-digit OTP code
   */
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Store OTP for a phone number
   */
  storeOTP(phoneNumber: string, otp: string): void {
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MS);
    this.store.set(phoneNumber, {
      phoneNumber,
      otp,
      expiresAt,
      attempts: 0,
    });

    // Log OTP to console for DEV (not sending SMS)
    console.log(
      `[DEV] OTP for ${phoneNumber}: ${otp} (expires at ${expiresAt.toISOString()})`,
    );
  }

  /**
   * Verify OTP for a phone number
   */
  verifyOTP(phoneNumber: string, otp: string): boolean {
    const entry = this.store.get(phoneNumber);

    if (!entry) {
      console.log(`[DEV] No OTP found for ${phoneNumber}`);
      return false;
    }

    // Check if OTP has expired
    if (Date.now() > entry.expiresAt.getTime()) {
      console.log(`[DEV] OTP expired for ${phoneNumber}`);
      this.store.delete(phoneNumber);
      return false;
    }

    // Check if max attempts reached
    if (entry.attempts >= this.MAX_ATTEMPTS) {
      console.log(`[DEV] Max attempts reached for ${phoneNumber}`);
      this.store.delete(phoneNumber);
      return false;
    }

    // Verify OTP
    if (entry.otp === otp) {
      console.log(`[DEV] OTP verified for ${phoneNumber}`);
      this.store.delete(phoneNumber);
      return true;
    }

    // Increment attempts
    entry.attempts++;
    console.log(
      `[DEV] Invalid OTP for ${phoneNumber} (attempt ${entry.attempts}/${this.MAX_ATTEMPTS})`,
    );

    if (entry.attempts >= this.MAX_ATTEMPTS) {
      this.store.delete(phoneNumber);
    }

    return false;
  }

  /**
   * Check if OTP exists for a phone number
   */
  hasOTP(phoneNumber: string): boolean {
    const entry = this.store.get(phoneNumber);
    if (!entry) return false;

    // Check if expired
    if (Date.now() > entry.expiresAt.getTime()) {
      this.store.delete(phoneNumber);
      return false;
    }

    return true;
  }

  /**
   * Get remaining time for OTP in seconds
   */
  getRemainingTime(phoneNumber: string): number {
    const entry = this.store.get(phoneNumber);
    if (!entry) return 0;

    const remaining = entry.expiresAt.getTime() - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
  }

  /**
   * Clean up expired OTPs
   */
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [phoneNumber, entry] of this.store.entries()) {
      if (now > entry.expiresAt.getTime()) {
        this.store.delete(phoneNumber);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[DEV] Cleaned up ${cleaned} expired OTPs`);
    }
  }

  /**
   * Clear all OTPs (for testing)
   */
  clear(): void {
    this.store.clear();
    console.log("[DEV] Cleared all OTPs");
  }

  /**
   * Get store size (for monitoring)
   */
  size(): number {
    return this.store.size;
  }
}

// Export singleton instance
export const otpStore = new OTPStore();

// Clean up expired OTPs every 5 minutes
setInterval(
  () => {
    otpStore.cleanup();
  },
  5 * 60 * 1000,
);
