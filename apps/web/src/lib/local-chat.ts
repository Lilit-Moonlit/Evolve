/**
 * Local (city-scoped) chat domain — pure logic shared by the server
 * (apiServer endpoints + WS channels, db persistence) and the client UI.
 *
 * A "local chat" is a message stream tied to one city (the canonical
 * `Country::City` key) and one thematic group. Four thematic groups exist
 * implicitly in every city ("Всі", "Знайомства", "Зачаття",
 * "Поліандрічне зачаття"); users can additionally create their own
 * public or closed groups and admin them.
 */

export type LocalChatGroupType = "public" | "closed";

/** Built-in thematic groups present in every city by default. */
export type DefaultLocalChatGroupId = "all" | "dating" | "conception" | "polyandrous";

/** i18n keys for the built-in group labels (client-side). */
export const DEFAULT_LOCAL_CHAT_GROUP_LABEL_KEYS: Record<DefaultLocalChatGroupId, string> = {
  all: "localChat.groups.all",
  dating: "localChat.groups.dating",
  conception: "localChat.groups.conception",
  polyandrous: "localChat.groups.polyandrous",
};

export const DEFAULT_LOCAL_CHAT_GROUPS: { id: DefaultLocalChatGroupId }[] = [
  { id: "all" },
  { id: "dating" },
  { id: "conception" },
  { id: "polyandrous" },
];

export const DEFAULT_LOCAL_CHAT_GROUP_IDS: string[] = DEFAULT_LOCAL_CHAT_GROUPS.map((g) => g.id);

export function isDefaultLocalChatGroupId(id: string): boolean {
  return DEFAULT_LOCAL_CHAT_GROUP_IDS.includes(id);
}

/** A user-created thematic group as stored server-side. */
export interface StoredLocalChatGroup {
  id: string;
  cityKey: string;
  name: string;
  type: LocalChatGroupType;
  createdBy: string;
  createdAt: string;
  /** User IDs (closed groups only — public groups need no membership). */
  members: string[];
  /** User IDs awaiting admin approval (closed groups only). */
  pending: string[];
}

/** A local-chat message as persisted and returned by the API. */
export interface LocalChatMessage {
  id: string;
  cityKey: string;
  groupId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export const LOCAL_CHAT_MAX_MESSAGE_LENGTH = 2000;
export const LOCAL_CHAT_MAX_GROUP_NAME_LENGTH = 60;
export const LOCAL_CHAT_HISTORY_LIMIT = 100;

/** Canonical storage/lookup key for a city. */
export function cityKeyOf(country: string, city: string): string {
  return `${country.trim()}::${city.trim()}`;
}

/** Inverse of cityKeyOf — tolerant of malformed keys. */
export function parseCityKey(cityKey: string): { country: string; city: string } {
  const sep = cityKey.indexOf("::");
  if (sep === -1) return { country: "", city: cityKey };
  return { country: cityKey.slice(0, sep), city: cityKey.slice(sep + 2) };
}

/** True when the key has both a country and a city and no control characters. */
export function isValidCityKey(cityKey: string): boolean {
  const { country, city } = parseCityKey(cityKey);
  return country.length > 0 && city.length > 0 && !/[\n\r\t]/.test(cityKey);
}

/** WS channel id for one (city, group) stream. Shared by server + client. */
export function localChatChannelId(cityKey: string, groupId: string): string {
  return `local:${cityKey}:${groupId}`;
}

/** 1..MAX chars after trim → null, else a stable error code. */
export function validateLocalChatMessage(text: string): "empty" | "too_long" | null {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return "empty";
  if (trimmed.length > LOCAL_CHAT_MAX_MESSAGE_LENGTH) return "too_long";
  return null;
}

/**
 * Group names must be 1..60 chars (after trim) and must not smuggle the
 * key/channel separators, which would break id parsing.
 */
export function validateGroupName(name: string): "empty" | "too_long" | "invalid" | null {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return "empty";
  if (trimmed.length > LOCAL_CHAT_MAX_GROUP_NAME_LENGTH) return "too_long";
  if (trimmed.includes("::") || trimmed.includes(":")) return "invalid";
  return null;
}

/** The group admin is its creator. */
export function isGroupAdmin(group: StoredLocalChatGroup, userId: string): boolean {
  return group.createdBy === userId;
}

/** Read/write permission: public → everyone; closed → members + admin. */
export function canAccessGroup(group: StoredLocalChatGroup, userId: string): boolean {
  if (group.type === "public") return true;
  return group.members.includes(userId) || group.createdBy === userId;
}

/** True when the user has an outstanding join request for a closed group. */
export function hasRequestedJoin(group: StoredLocalChatGroup, userId: string): boolean {
  return group.pending.includes(userId);
}

/** Appends only messages whose ids are not present yet (WS + optimistic send). */
export function mergeLocalChatMessages(
  existing: LocalChatMessage[],
  incoming: LocalChatMessage[],
): LocalChatMessage[] {
  const seen = new Set(existing.map((m) => m.id));
  return [...existing, ...incoming.filter((m) => !seen.has(m.id))];
}

/** Ascending by createdAt, id as a deterministic tiebreaker. */
export function sortLocalChatMessages(messages: LocalChatMessage[]): LocalChatMessage[] {
  return [...messages].sort((a, b) => {
    const byTime = String(a.createdAt).localeCompare(String(b.createdAt));
    return byTime !== 0 ? byTime : String(a.id).localeCompare(String(b.id));
  });
}
