// Validation utilities
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
export function isValidIPFSCid(cid) {
  return /^Qm[a-zA-Z0-9]{44}$/.test(cid) || /^b[a-z2-7]{52}$/.test(cid);
}
// Formatting utilities
export function formatAddress(address, length = 4) {
  if (!address || !isValidAddress(address)) return address;
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}
export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}
export function formatTimeAgo(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatTimestamp(timestamp);
}
// Location utilities
export function calculateDistance(loc1, loc2) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.latitude)) *
      Math.cos(toRad(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}
export function isWithinDistance(loc1, loc2, maxDistance) {
  return calculateDistance(loc1, loc2) <= maxDistance;
}
// String utilities
export function truncateString(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
// Array utilities
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
export function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
// Number utilities
export function clampNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
export function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
// Async utilities
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export async function retry(fn, maxRetries = 3, delay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(delay * (i + 1));
    }
  }
  throw new Error("Max retries exceeded");
}
// Object utilities
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
export function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}
//# sourceMappingURL=utils.js.map
