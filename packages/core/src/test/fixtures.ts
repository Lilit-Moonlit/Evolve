/**
 * Test fixtures for Evolve
 */

import type { User, UserProfile, Match, Message } from "../types";

/**
 * User fixtures
 */
export const userFixtures = {
  validUser: {
    id: "123e4567-e89b-12d3-a456-426614174000",
    walletAddress: "0x1234567890123456789012345678901234567890",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as User,
  userWithoutId: {
    walletAddress: "0x1234567890123456789012345678901234567890",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as Partial<User>,
  userWithInvalidWallet: {
    id: "123e4567-e89b-12d3-a456-426614174000",
    walletAddress: "invalid",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as Partial<User>,
};

/**
 * User profile fixtures
 */
export const userProfileFixtures = {
  validProfile: {
    userId: "123e4567-e89b-12d3-a456-426614174000",
    name: "John Doe",
    age: 25,
    bio: "Looking for meaningful connections",
    avatar: "https://example.com/avatar.jpg",
    location: "New York, USA",
    interests: ["Music", "Travel", "Sports"],
    photos: ["https://example.com/photo1.jpg"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as UserProfile,
  profileWithoutName: {
    userId: "123e4567-e89b-12d3-a456-426614174000",
    age: 25,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as Partial<UserProfile>,
  profileWithTooLongBio: {
    userId: "123e4567-e89b-12d3-a456-426614174000",
    name: "John Doe",
    bio: "A".repeat(501),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as Partial<UserProfile>,
  profileWithTooManyInterests: {
    userId: "123e4567-e89b-12d3-a456-426614174000",
    name: "John Doe",
    interests: Array.from({ length: 21 }, (_, i) => `Interest ${i}`),
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as Partial<UserProfile>,
};

/**
 * Match fixtures
 */
export const matchFixtures = {
  validMatch: {
    id: "223e4567-e89b-12d3-a456-426614174000",
    user1Id: "123e4567-e89b-12d3-a456-426614174000",
    user2Id: "323e4567-e89b-12d3-a456-426614174000",
    matchScore: 85,
    status: "accepted",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as Match,
  matchWithInvalidScore: {
    id: "223e4567-e89b-12d3-a456-426614174000",
    user1Id: "123e4567-e89b-12d3-a456-426614174000",
    user2Id: "323e4567-e89b-12d3-a456-426614174000",
    matchScore: 150,
    status: "accepted",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as Partial<Match>,
  matchWithInvalidStatus: {
    id: "223e4567-e89b-12d3-a456-426614174000",
    user1Id: "123e4567-e89b-12d3-a456-426614174000",
    user2Id: "323e4567-e89b-12d3-a456-426614174000",
    matchScore: 85,
    status: "invalid",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as Partial<Match>,
};

/**
 * Message fixtures
 */
export const messageFixtures = {
  validMessage: {
    id: "423e4567-e89b-12d3-a456-426614174000",
    matchId: "223e4567-e89b-12d3-a456-426614174000",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    receiverId: "323e4567-e89b-12d3-a456-426614174000",
    content: "Hello! How are you?",
    status: "read",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    readAt: new Date("2024-01-01"),
  } as Message,
  messageWithEmptyContent: {
    id: "423e4567-e89b-12d3-a456-426614174000",
    matchId: "223e4567-e89b-12d3-a456-426614174000",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    receiverId: "323e4567-e89b-12d3-a456-426614174000",
    content: "",
    status: "sent",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as Partial<Message>,
  messageWithTooLongContent: {
    id: "423e4567-e89b-12d3-a456-426614174000",
    matchId: "223e4567-e89b-12d3-a456-426614174000",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    receiverId: "323e4567-e89b-12d3-a456-426614174000",
    content: "A".repeat(1001),
    status: "sent",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  } as Partial<Message>,
};

/**
 * API response fixtures
 */
export const apiResponseFixtures = {
  successResponse: {
    success: true,
    data: { id: "123" },
  },
  errorResponse: {
    success: false,
    error: {
      message: "An error occurred",
      code: "ERROR_CODE",
    },
  },
  paginatedResponse: {
    success: true,
    data: [],
    pagination: {
      page: 1,
      limit: 20,
      total: 100,
    },
  },
};

/**
 * Validation fixtures
 */
export const validationFixtures = {
  validEmail: "test@example.com",
  invalidEmail: "invalid-email",
  validWalletAddress: "0x1234567890123456789012345678901234567890",
  invalidWalletAddress: "invalid",
  validUrl: "https://example.com",
  invalidUrl: "invalid-url",
  validAge: 25,
  invalidAge: 15,
  validName: "John Doe",
  invalidName: "J",
  validBio: "This is a valid bio",
  invalidBio: "A".repeat(501),
};

/**
 * Web3 fixtures
 */
export const web3Fixtures = {
  validChainId: 1,
  invalidChainId: 999999,
  validTransaction: {
    to: "0x1234567890123456789012345678901234567890",
    value: "0x0",
    data: "0x",
  },
  validSignature: "0xabcdef1234567890",
  typedData: {
    domain: {
      name: "Evolve",
      version: "1",
      chainId: 1,
    },
    types: {
      Message: [
        { name: "content", type: "string" },
        { name: "timestamp", type: "uint256" },
      ],
    },
    value: {
      content: "Hello",
      timestamp: Date.now(),
    },
  },
};
