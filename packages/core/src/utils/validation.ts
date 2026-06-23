/**
 * Validation utilities for Evolve
 */

/**
 * Validate Ethereum wallet address
 */
export function isValidWalletAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate age (must be between 18 and 120)
 */
export function isValidAge(age: number): boolean {
  return age >= 18 && age <= 120;
}

/**
 * Validate name (2-50 characters, letters and spaces only)
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
}

/**
 * Validate bio (max 500 characters)
 */
export function isValidBio(bio: string): boolean {
  return bio.length <= 500;
}

/**
 * Validate location (2-100 characters)
 */
export function isValidLocation(location: string): boolean {
  return location.length >= 2 && location.length <= 100;
}

/**
 * Validate match score (0-100)
 */
export function isValidMatchScore(score: number): boolean {
  return score >= 0 && score <= 100;
}

/**
 * Validate message content (1-1000 characters)
 */
export function isValidMessage(content: string): boolean {
  return content.length >= 1 && content.length <= 1000;
}

/**
 * Validate user ID (UUID format)
 */
export function isValidUserId(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Validate phone number (international format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validate date of birth (user must be at least 18 years old)
 */
export function isValidDateOfBirth(dateOfBirth: Date): boolean {
  const today = new Date();
  const minAgeDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );
  minAgeDate.setHours(23, 59, 59, 999);
  return dateOfBirth <= minAgeDate;
}

/**
 * Validate image URL (must be a valid URL with image extension)
 */
export function isValidImageUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  return imageExtensions.test(url);
}

/**
 * Validate distance (0-1000 km)
 */
export function isValidDistance(distance: number): boolean {
  return distance >= 0 && distance <= 1000;
}

/**
 * Validate interests array (max 20 interests, each max 50 characters)
 */
export function isValidInterests(interests: string[]): boolean {
  if (interests.length > 20) return false;
  return interests.every((interest) => interest.length <= 50);
}

/**
 * Validate gender (must be one of the allowed values)
 */
export function isValidGender(gender: string): boolean {
  const allowedGenders = [
    "male",
    "female",
    "non-binary",
    "other",
    "prefer-not-to-say",
  ];
  return allowedGenders.includes(gender);
}
