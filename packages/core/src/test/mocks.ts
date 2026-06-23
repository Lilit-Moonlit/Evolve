/**
 * Test mocks for Evolve
 */

import type { User, UserProfile, Match, Message } from "../types";

/**
 * Mock user
 */
export const mockUser: User = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  walletAddress: "0x1234567890123456789012345678901234567890",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

/**
 * Mock user profile
 */
export const mockUserProfile: UserProfile = {
  userId: "123e4567-e89b-12d3-a456-426614174000",
  name: "John Doe",
  age: 25,
  bio: "Looking for meaningful connections",
  avatar: "https://example.com/avatar.jpg",
  location: "New York, USA",
  interests: ["Music", "Travel", "Sports"],
  photos: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

/**
 * Mock match
 */
export const mockMatch: Match = {
  id: "223e4567-e89b-12d3-a456-426614174000",
  user1Id: "123e4567-e89b-12d3-a456-426614174000",
  user2Id: "323e4567-e89b-12d3-a456-426614174000",
  matchScore: 85,
  status: "accepted",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

/**
 * Mock message
 */
export const mockMessage: Message = {
  id: "423e4567-e89b-12d3-a456-426614174000",
  matchId: "223e4567-e89b-12d3-a456-426614174000",
  senderId: "123e4567-e89b-12d3-a456-426614174000",
  receiverId: "323e4567-e89b-12d3-a456-426614174000",
  content: "Hello! How are you?",
  status: "read",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  readAt: new Date("2024-01-01"),
};

/**
 * Mock wallet provider
 */
export const mockWalletProvider = {
  request: async (args: { method: string; params?: unknown[] }) => {
    switch (args.method) {
      case "eth_requestAccounts":
        return ["0x1234567890123456789012345678901234567890"];
      case "eth_accounts":
        return ["0x1234567890123456789012345678901234567890"];
      case "eth_getBalance":
        return "0x56bc75e2d63100000"; // 100 ETH in Wei
      case "eth_chainId":
        return "0x1"; // Ethereum Mainnet
      case "personal_sign":
        return "0xabcdef1234567890";
      case "eth_sendTransaction":
        return "0x1234567890abcdef";
      default:
        return null;
    }
  },
  on: (event: string, callback: (...args: unknown[]) => void) => {
    // Mock event listener
  },
  removeAllListeners: () => {
    // Mock remove listeners
  },
};

/**
 * Mock window.ethereum
 */
export const mockWindowEthereum = {
  ethereum: mockWalletProvider,
};

/**
 * Create mock user
 */
export function createMockUser(overrides?: Partial<User>): User {
  return {
    ...mockUser,
    ...overrides,
  };
}

/**
 * Create mock user profile
 */
export function createMockUserProfile(
  overrides?: Partial<UserProfile>,
): UserProfile {
  return {
    ...mockUserProfile,
    ...overrides,
  };
}

/**
 * Create mock match
 */
export function createMockMatch(overrides?: Partial<Match>): Match {
  return {
    ...mockMatch,
    ...overrides,
  };
}

/**
 * Create mock message
 */
export function createMockMessage(overrides?: Partial<Message>): Message {
  return {
    ...mockMessage,
    ...overrides,
  };
}

/**
 * Mock API response
 */
export function mockApiResponse<T>(data: T, delay: number = 100): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}

/**
 * Mock API error
 */
export function mockApiError(
  message: string,
  delay: number = 100,
): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(message)), delay),
  );
}

/**
 * Mock fetch
 */
export function mockFetch(
  response: unknown,
  delay: number = 100,
): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as Response);
    }, delay);
  });
}

/**
 * Mock fetch with error
 */
export function mockFetchError(
  message: string,
  delay: number = 100,
): Promise<Response> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
}
