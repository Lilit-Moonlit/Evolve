/**
 * General constants for Evolve
 */

// Gender options
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

// Interest categories
export const INTEREST_CATEGORIES = [
  "Music",
  "Movies",
  "Sports",
  "Travel",
  "Food",
  "Art",
  "Technology",
  "Gaming",
  "Reading",
  "Nature",
  "Fitness",
  "Photography",
  "Cooking",
  "Dancing",
  "Pets",
] as const;

// Relationship goals
export const RELATIONSHIP_GOALS = [
  { value: "casual", label: "Casual Dating" },
  { value: "serious", label: "Serious Relationship" },
  { value: "friendship", label: "Friendship" },
  { value: "activity-partner", label: "Activity Partner" },
] as const;

// Time zones
export const TIME_ZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
] as const;

// Languages
export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
] as const;

// Error messages
export const ERROR_MESSAGES = {
  INVALID_WALLET_ADDRESS: "Invalid wallet address",
  INVALID_EMAIL: "Invalid email address",
  INVALID_URL: "Invalid URL",
  INVALID_AGE: "Age must be between 18 and 120",
  INVALID_NAME: "Name must be between 2 and 50 characters",
  INVALID_BIO: "Bio must be less than 500 characters",
  INVALID_LOCATION: "Location must be between 2 and 100 characters",
  INVALID_MATCH_SCORE: "Match score must be between 0 and 100",
  INVALID_MESSAGE: "Message must be between 1 and 1000 characters",
  INVALID_USER_ID: "Invalid user ID",
  INVALID_PHONE_NUMBER: "Invalid phone number",
  INVALID_DATE_OF_BIRTH: "You must be at least 18 years old",
  INVALID_IMAGE_URL: "Invalid image URL",
  INVALID_DISTANCE: "Distance must be between 0 and 1000 km",
  INVALID_INTERESTS: "Maximum 20 interests allowed",
  INVALID_GENDER: "Invalid gender",
  FILE_TOO_LARGE: "File is too large",
  INVALID_FILE_TYPE: "Invalid file type",
  NETWORK_ERROR: "Network error occurred",
  SERVER_ERROR: "Server error occurred",
  UNAUTHORIZED: "Unauthorized access",
  FORBIDDEN: "Access forbidden",
  NOT_FOUND: "Resource not found",
  CONFLICT: "Resource conflict",
  RATE_LIMIT_EXCEEDED: "Rate limit exceeded",
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_CREATED: "Profile created successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  PROFILE_DELETED: "Profile deleted successfully",
  MATCH_CREATED: "Match created successfully",
  MATCH_ACCEPTED: "Match accepted successfully",
  MATCH_REJECTED: "Match rejected successfully",
  MESSAGE_SENT: "Message sent successfully",
  MESSAGE_DELETED: "Message deleted successfully",
  PHOTO_UPLOADED: "Photo uploaded successfully",
  PHOTO_DELETED: "Photo deleted successfully",
  SETTINGS_UPDATED: "Settings updated successfully",
  LOGOUT_SUCCESS: "Logged out successfully",
} as const;

// Notification types
export const NOTIFICATION_TYPES = [
  "match",
  "message",
  "like",
  "profile_view",
  "system",
] as const;

// Sort options
export const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "distance", label: "Nearest" },
  { value: "match_score", label: "Best Match" },
] as const;

// Filter options
export const FILTER_OPTIONS = {
  ageRange: { min: 18, max: 120 },
  distanceRange: { min: 0, max: 1000 },
  gender: GENDER_OPTIONS.map((g) => g.value),
  interests: INTEREST_CATEGORIES,
  relationshipGoals: RELATIONSHIP_GOALS.map((g) => g.value),
} as const;

// Default profile image
export const DEFAULT_PROFILE_IMAGE = "/images/default-profile.png";

// Supported image formats
export const SUPPORTED_IMAGE_FORMATS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
] as const;

// Supported video formats
export const SUPPORTED_VIDEO_FORMATS = ["mp4", "webm"] as const;

// Max file sizes (in bytes)
export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 50 * 1024 * 1024, // 50MB
  document: 5 * 1024 * 1024, // 5MB
} as const;

// Pagination limits
export const PAGINATION_LIMITS = {
  min: 1,
  max: 100,
  default: 20,
} as const;

// Search limits
export const SEARCH_LIMITS = {
  min: 1,
  max: 50,
  default: 10,
} as const;

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  short: 60, // 1 minute
  medium: 300, // 5 minutes
  long: 3600, // 1 hour
  veryLong: 86400, // 1 day
} as const;
