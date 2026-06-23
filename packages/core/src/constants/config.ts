/**
 * Configuration constants for Evolve
 */

// Application settings
export const APP_NAME = "Evolve";
export const APP_VERSION = "0.1.0";
export const APP_DESCRIPTION = "Decentralized Dating Application";

// API settings
export const API_BASE_URL =
  typeof process !== "undefined" && process.env?.API_BASE_URL
    ? process.env.API_BASE_URL
    : typeof window !== "undefined" && (window as any).API_BASE_URL
      ? (window as any).API_BASE_URL
      : "http://localhost:3000";
export const API_TIMEOUT = 30000; // 30 seconds

// Match settings
export const MATCH_MIN_SCORE = 50;
export const MATCH_MAX_SCORE = 100;
export const MATCH_DEFAULT_DISTANCE = 50; // km
export const MATCH_MAX_DISTANCE = 1000; // km
export const MATCH_MAX_RESULTS = 50;

// User settings
export const USER_MIN_AGE = 18;
export const USER_MAX_AGE = 120;
export const USER_MIN_NAME_LENGTH = 2;
export const USER_MAX_NAME_LENGTH = 50;
export const USER_MAX_BIO_LENGTH = 500;
export const USER_MAX_INTERESTS = 20;
export const USER_MAX_PHOTOS = 10;

// Message settings
export const MESSAGE_MIN_LENGTH = 1;
export const MESSAGE_MAX_LENGTH = 1000;
export const MESSAGE_MAX_ATTACHMENTS = 5;
export const MESSAGE_MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB

// Pagination settings
export const PAGINATION_DEFAULT_PAGE = 1;
export const PAGINATION_DEFAULT_LIMIT = 20;
export const PAGINATION_MAX_LIMIT = 100;

// Rate limiting settings
export const RATE_LIMIT_MAX_REQUESTS = 100;
export const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute

// Cache settings
export const CACHE_DEFAULT_TTL = 300; // 5 minutes
export const CACHE_MAX_SIZE = 1000;

// File upload settings
export const UPLOAD_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const UPLOAD_ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
export const UPLOAD_ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
export const UPLOAD_MAX_IMAGES = 10;
export const UPLOAD_MAX_VIDEOS = 5;

// Web3 settings
export const WEB3_CHAIN_ID = 1; // Ethereum Mainnet
export const WEB3_REQUIRED_CONFIRMATIONS = 1;
export const WEB3_GAS_LIMIT = 300000;

// Location settings
export const LOCATION_DEFAULT_LAT = 0;
export const LOCATION_DEFAULT_LON = 0;
export const LOCATION_DEFAULT_RADIUS = 50; // km

// Notification settings
export const NOTIFICATION_MAX_QUEUE_SIZE = 100;
export const NOTIFICATION_RETRY_ATTEMPTS = 3;
export const NOTIFICATION_RETRY_DELAY = 5000; // 5 seconds

// Security settings
export const SECURITY_MIN_PASSWORD_LENGTH = 8;
export const SECURITY_MAX_PASSWORD_LENGTH = 128;
export const SECURITY_SESSION_TIMEOUT = 3600000; // 1 hour
export const SECURITY_REFRESH_TOKEN_EXPIRY = 604800000; // 7 days

// Storage settings
export const STORAGE_MAX_PROFILE_SIZE = 1024 * 1024; // 1MB
export const STORAGE_MAX_MESSAGE_SIZE = 1024 * 1024; // 1MB

// P2P settings
export const P2P_MAX_PEERS = 50;
export const P2P_DISCOVERY_INTERVAL = 60000; // 1 minute
export const P2P_HEARTBEAT_INTERVAL = 30000; // 30 seconds
export const P2P_MESSAGE_TIMEOUT = 10000; // 10 seconds

// Arweave settings
export const ARWEAVE_DEFAULT_CURRENCY = "AR";
export const ARWEAVE_MIN_CONFIRMATIONS = 10;

// Encryption settings
export const ENCRYPTION_KEY_SIZE = 256; // bits
export const ENCRYPTION_ALGORITHM = "AES-GCM";
