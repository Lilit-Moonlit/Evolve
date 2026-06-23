import { Location } from "./types";
export declare function isValidAddress(address: string): boolean;
export declare function isValidEmail(email: string): boolean;
export declare function isValidUrl(url: string): boolean;
export declare function isValidIPFSCid(cid: string): boolean;
export declare function formatAddress(address: string, length?: number): string;
export declare function formatTimestamp(timestamp: number): string;
export declare function formatTimeAgo(timestamp: number): string;
export declare function calculateDistance(
  loc1: Location,
  loc2: Location,
): number;
export declare function isWithinDistance(
  loc1: Location,
  loc2: Location,
  maxDistance: number,
): boolean;
export declare function truncateString(str: string, maxLength: number): string;
export declare function generateId(): string;
export declare function shuffleArray<T>(array: T[]): T[];
export declare function chunkArray<T>(array: T[], chunkSize: number): T[][];
export declare function clampNumber(
  value: number,
  min: number,
  max: number,
): number;
export declare function randomInRange(min: number, max: number): number;
export declare function sleep(ms: number): Promise<void>;
export declare function retry<T>(
  fn: () => Promise<T>,
  maxRetries?: number,
  delay?: number,
): Promise<T>;
export declare function deepClone<T>(obj: T): T;
export declare function omit<T, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K>;
//# sourceMappingURL=utils.d.ts.map
