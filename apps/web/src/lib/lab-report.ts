// Lab Report Module
// Implements DAO-oriented lab report ingestion for STD testing flow.
// Provides email generation, parsing, and report handling.

import { parseStdTestResult, type StdTestParseResult } from "./std-parser";

// Constants for lab email routing
export const LAB_EMAIL_DOMAIN = "evolve.eth";
export const LAB_EMAIL_LOCAL = "lola";

/**
 * Generates a unique lab email address for a user.
 * Format: lola+<userId>@evolve.eth
 * The +alias is the routing key, provider-agnostic.
 */
export function generateLabEmail(userId: string): string {
  return `${LAB_EMAIL_LOCAL}+${userId}@${LAB_EMAIL_DOMAIN}`;
}

/**
 * Extracts userId from a lab email address.
 * Returns null if not a lab address or missing +alias.
 */
export function parseUserIdFromLabEmail(email: string): string | null {
  if (!email || typeof email !== "string") return null;
  const atIndex = email.indexOf("@");
  if (atIndex === -1) return null;
  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (domain !== LAB_EMAIL_DOMAIN) return null;
  if (!localPart.startsWith(LAB_EMAIL_LOCAL + "+")) return null;
  const userId = localPart.slice(LAB_EMAIL_LOCAL.length + 1);
  return userId.length > 0 ? userId : null;
}

// Supported report types
export const SUPPORTED_REPORT_TYPES = ["STD"] as const;

// Lab Report Input type
export interface LabReportInput {
  userId: string;
  source: "email" | "manual" | "api";
  rawText: string;
  reportedAt?: string;
}

// Lab Report type (stored in DB)
export interface LabReport {
  id: string;
  userId: string;
  source: string;
  rawText: string;
  parsed: StdTestParseResult | null;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

/**
 * Ingests a lab report, parses STD content, and returns a pending LabReport.
 * Pure function - does not perform I/O.
 */
export function ingestLabReport(input: LabReportInput): LabReport {
  // Parse STD test result. static import used — std-parser has no dependency
  // on this module, so there is no circular-import risk.
  let parsed: StdTestParseResult | null = null;
  try {
    parsed = parseStdTestResult(input.rawText || "");
  } catch (e) {
    console.error("Failed to parse STD result:", e);
    parsed = null;
  }

  return {
    id: crypto.randomUUID(),
    userId: input.userId,
    source: input.source,
    rawText: input.rawText,
    parsed,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}
