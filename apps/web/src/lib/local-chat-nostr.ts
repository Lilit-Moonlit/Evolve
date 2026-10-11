import { SimplePool } from "nostr-tools";
import type { Event, EventTemplate, Filter, VerifiedEvent } from "nostr-tools";
import type { WindowNostr } from "nostr-tools/nip07";
import type { LocalChatGroupType, LocalChatMessage, StoredLocalChatGroup } from "./local-chat";

export const NIP29_KIND = {
  putUser: 9000,
  removeUser: 9001,
  editMetadata: 9002,
  deleteEvent: 9005,
  createGroup: 9007,
  joinRequest: 9021,
  leaveRequest: 9022,
  groupMetadata: 39000,
  groupAdmins: 39001,
  groupMembers: 39002,
} as const;

export const LOCAL_CHAT_RELAY_ENV = "VITE_NOSTR_CITY_RELAY_URL";
export const LOCAL_CHAT_RELAY_CONNECT_TIMEOUT_MS = 5000;
const NOSTR_USER_TAG = "evolve-user";
const NOSTR_NAME_TAG = "name";
const ENCRYPTED_GROUP_CONTENT_MARKER = "evolve-nip44-group/v1:";

export interface LocalChatNostrMessageInput {
  senderId: string;
  senderName: string;
  text: string;
}

export interface LocalChatNostrEventHandler {
  (event: Event): void;
}

export interface LocalChatNostrPool {
  subscribeMany(
    relays: string[],
    filter: Filter,
    params: {
      onevent: (event: Event) => void;
      oneose: () => void;
      onclose: (reasons: { url: string; reason: string }[]) => void;
      maxWait?: number;
    },
  ): { close: (reason?: string) => void };
  publish(relays: string[], event: Event): Promise<string>[];
  destroy(): void;
}

export interface LocalChatNostrOptions {
  relayUrls?: string[];
  poolFactory?: () => LocalChatNostrPool;
  signer?: WindowNostr;
  connectTimeoutMs?: number;
}

interface GroupState {
  id: string;
  cityKey: string;
  name: string;
  type: LocalChatGroupType;
  creatorId: string;
  admins: Set<string>;
  members: Set<string>;
  pending: Map<string, { userId: string; eventId: string }>;
  userIdByPubkey: Map<string, string>;
}

function getConfiguredRelayUrls(): string[] {
  const configured = import.meta.env?.VITE_NOSTR_CITY_RELAY_URL;
  return typeof configured === "string"
    ? configured
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean)
    : [];
}

function tagValue(event: Pick<Event, "tags">, name: string): string | undefined {
  return event.tags.find((tag) => tag[0] === name)?.[1];
}

function hasTag(event: Pick<Event, "tags">, name: string): boolean {
  return event.tags.some((tag) => tag[0] === name);
}

export function buildLocalChatMessageTags(
  cityKey: string,
  groupId: string,
  senderId: string,
  senderName: string,
): string[][] {
  return [
    ["t", cityKey],
    ["d", groupId],
    ["g", groupId],
    ["h", groupId],
    [NOSTR_USER_TAG, senderId],
    [NOSTR_NAME_TAG, senderName],
  ];
}

export function localChatMessageFromNostrEvent(
  event: Event,
  cityKey: string,
  groupId: string,
): LocalChatMessage | null {
  if (event.kind !== 1 || tagValue(event, "t") !== cityKey) return null;
  if (
    !event.tags.some(
      (tag) => (tag[0] === "d" || tag[0] === "g" || tag[0] === "h") && tag[1] === groupId,
    )
  ) {
    return null;
  }
  const text = event.content.trim();
  if (!text) return null;
  return {
    id: event.id,
    cityKey,
    groupId,
    senderId: tagValue(event, NOSTR_USER_TAG) ?? event.pubkey,
    senderName: tagValue(event, NOSTR_NAME_TAG) ?? event.pubkey,
    text,
    createdAt: new Date(event.created_at * 1000).toISOString(),
  };
}

export function buildNip29GroupEvents(
  cityKey: string,
  groupId: string,
  name: string,
  type: LocalChatGroupType,
  creatorId: string,
): EventTemplate[] {
  const createTags = [
    ["h", groupId],
    ["t", cityKey],
    [NOSTR_USER_TAG, creatorId],
    [NOSTR_NAME_TAG, name],
    ["type", type],
  ];
  const metadataTags = [
    ["h", groupId],
    ["name", name],
    ["about", cityKey],
    ["t", cityKey],
    ["type", type],
    ...(type === "closed" ? [["private"], ["restricted"]] : []),
  ];
  return [
    { kind: NIP29_KIND.createGroup, content: "", tags: createTags, created_at: 0 },
    { kind: NIP29_KIND.editMetadata, content: "", tags: metadataTags, created_at: 0 },
  ];
}

export function buildLocalChatNostrFilters(cityKey: string, groupId: string): Filter[] {
  return [
    { kinds: [1], "#t": [cityKey], "#d": [groupId], limit: 100 },
    { kinds: [1], "#t": [cityKey], "#g": [groupId], limit: 100 },
    { kinds: [1], "#t": [cityKey], "#h": [groupId], limit: 100 },
    { kinds: [NIP29_KIND.groupMetadata], "#t": [cityKey], limit: 500 },
    { kinds: [NIP29_KIND.groupMetadata], "#about": [cityKey], limit: 500 },
    { kinds: [NIP29_KIND.groupAdmins, NIP29_KIND.groupMembers], "#d": [groupId] },
    {
      kinds: [
        NIP29_KIND.putUser,
        NIP29_KIND.removeUser,
        NIP29_KIND.deleteEvent,
        NIP29_KIND.createGroup,
        NIP29_KIND.joinRequest,
      ],
      "#h": [groupId],
      limit: 500,
    },
  ];
}

function createGroupId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
}

function signedTemplate(template: EventTemplate, signer: WindowNostr): Promise<VerifiedEvent> {
  return signer.signEvent({
    ...template,
    created_at: Math.floor(Date.now() / 1000),
  });
}

export class LocalChatNostrClient {
  private readonly relayUrls: string[];
  private readonly pool: LocalChatNostrPool;
  private readonly signer?: WindowNostr;
  private readonly connectTimeoutMs: number;
  private readonly groups = new Map<string, GroupState>();
  private readonly pendingPubkeysByUserId = new Map<string, Map<string, string>>();
  private readonly userIdsByPubkey = new Map<string, string>();
  private identityUserId = "";

  constructor(options: LocalChatNostrOptions = {}) {
    this.relayUrls = options.relayUrls ?? getConfiguredRelayUrls();
    this.pool = (options.poolFactory ?? (() => new SimplePool()))();
    this.signer = options.signer ?? (typeof window === "undefined" ? undefined : window.nostr);
    this.connectTimeoutMs = options.connectTimeoutMs ?? LOCAL_CHAT_RELAY_CONNECT_TIMEOUT_MS;
  }

  get isConfigured(): boolean {
    return this.relayUrls.length > 0;
  }

  async setProfileIdentity(userId: string): Promise<void> {
    this.identityUserId = userId;
    if (!this.signer) return;
    const pubkey = await this.signer.getPublicKey();
    this.mapPubkey(pubkey, userId);
  }

  async subscribe(
    cityKey: string,
    groupId: string,
    onEvent: LocalChatNostrEventHandler,
  ): Promise<() => void> {
    this.assertRelayConfigured();
    const seenEvents = new Set<string>();
    const subscriptions: { close: (reason?: string) => void }[] = [];
    let settled = false;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        subscriptions.forEach((subscription) =>
          subscription.close("local-chat relay connection timeout"),
        );
        reject(new Error("Nostr relay did not finish the initial subscription"));
      }, this.connectTimeoutMs);

      const filters = buildLocalChatNostrFilters(cityKey, groupId);
      let endOfStoredEvents = 0;
      for (const filter of filters) {
        subscriptions.push(
          this.pool.subscribeMany(this.relayUrls, filter, {
            onevent: (event) => {
              if (seenEvents.has(event.id)) return;
              seenEvents.add(event.id);
              this.ingestGroupEvent(event, cityKey);
              onEvent(event);
            },
            oneose: () => {
              endOfStoredEvents += 1;
              if (settled || endOfStoredEvents < filters.length) return;
              settled = true;
              clearTimeout(timeout);
              resolve(() =>
                subscriptions.forEach((subscription) =>
                  subscription.close("local-chat subscription closed"),
                ),
              );
            },
            onclose: (reasons) => {
              if (settled) return;
              settled = true;
              clearTimeout(timeout);
              subscriptions.forEach((subscription) =>
                subscription.close("local-chat relay closed"),
              );
              reject(
                new Error(reasons.map((item) => item.reason).join("; ") || "Nostr relay closed"),
              );
            },
            maxWait: this.connectTimeoutMs,
          }),
        );
      }
    });
  }

  async publish(
    cityKey: string,
    groupId: string,
    message: LocalChatNostrMessageInput,
  ): Promise<LocalChatMessage> {
    const group = this.groups.get(this.groupKey(cityKey, groupId));
    const content =
      group?.type === "closed"
        ? await this.encryptForGroup(group, message.text.trim())
        : message.text.trim();
    const template: EventTemplate = {
      kind: 1,
      content,
      tags: buildLocalChatMessageTags(cityKey, groupId, message.senderId, message.senderName),
      created_at: Math.floor(Date.now() / 1000),
    };
    const event = await this.publishTemplate(template);
    this.mapPubkey(event.pubkey, message.senderId);
    return {
      id: event.id,
      cityKey,
      groupId,
      senderId: message.senderId,
      senderName: message.senderName,
      text: message.text.trim(),
      createdAt: new Date(event.created_at * 1000).toISOString(),
    };
  }

  async messageFromEvent(
    event: Event,
    cityKey: string,
    groupId: string,
  ): Promise<LocalChatMessage | null> {
    if (event.kind !== 1 || tagValue(event, "t") !== cityKey) return null;
    if (
      !event.tags.some(
        (tag) => (tag[0] === "d" || tag[0] === "g" || tag[0] === "h") && tag[1] === groupId,
      )
    ) {
      return null;
    }
    let text = event.content;
    if (text.startsWith(ENCRYPTED_GROUP_CONTENT_MARKER)) {
      const recipientCiphertexts = parseEncryptedGroupContent(text);
      let ownPubkey = "";
      try {
        ownPubkey = this.signer ? await this.signer.getPublicKey() : "";
      } catch {
        return null;
      }
      const ciphertext = recipientCiphertexts?.[ownPubkey];
      if (!ciphertext || !this.signer?.nip44?.decrypt) return null;
      try {
        text = await this.signer.nip44.decrypt(event.pubkey, ciphertext);
      } catch {
        return null;
      }
    }
    if (!text.trim()) return null;
    return {
      id: event.id,
      cityKey,
      groupId,
      senderId: tagValue(event, NOSTR_USER_TAG) ?? event.pubkey,
      senderName: tagValue(event, NOSTR_NAME_TAG) ?? event.pubkey,
      text,
      createdAt: new Date(event.created_at * 1000).toISOString(),
    };
  }

  async createGroup(
    cityKey: string,
    name: string,
    type: LocalChatGroupType,
    creatorId: string,
  ): Promise<StoredLocalChatGroup> {
    const groupId = createGroupId();
    const [create, metadata] = buildNip29GroupEvents(
      cityKey,
      groupId,
      name.trim(),
      type,
      creatorId,
    );
    const createEvent = await this.publishTemplate(create);
    this.mapPubkey(createEvent.pubkey, creatorId);
    await this.publishTemplate(metadata);

    const group: StoredLocalChatGroup = {
      id: groupId,
      cityKey,
      name: name.trim(),
      type,
      createdBy: creatorId,
      createdAt: new Date().toISOString(),
      members: [creatorId],
      pending: [],
    };
    this.groups.set(this.groupKey(cityKey, groupId), {
      id: groupId,
      cityKey,
      name: group.name,
      type,
      creatorId,
      admins: new Set([createEvent.pubkey]),
      members: new Set([createEvent.pubkey]),
      pending: new Map(),
      userIdByPubkey: new Map([[createEvent.pubkey, creatorId]]),
    });
    return group;
  }

  async requestJoin(cityKey: string, groupId: string, userId: string): Promise<void> {
    const template: EventTemplate = {
      kind: NIP29_KIND.joinRequest,
      content: "",
      tags: [
        ["h", groupId],
        [NOSTR_USER_TAG, userId],
      ],
      created_at: Math.floor(Date.now() / 1000),
    };
    const event = await this.publishTemplate(template);
    this.mapPubkey(event.pubkey, userId);
    const group = this.getOrCreateGroup(cityKey, groupId);
    group.userIdByPubkey.set(event.pubkey, userId);
    group.pending.set(userId, { userId, eventId: event.id });
    this.setPendingPubkey(groupId, userId, event.pubkey);
  }

  async resolveJoin(
    cityKey: string,
    groupId: string,
    userId: string,
    approve: boolean,
  ): Promise<void> {
    const group = this.getOrCreateGroup(cityKey, groupId);
    const pending = group.pending.get(userId);
    const pubkey = pending ? this.userPubkey(group, userId) : undefined;
    if (approve) {
      if (!pubkey) throw new Error("The join request Nostr public key is unknown");
      const event = await this.publishTemplate({
        kind: NIP29_KIND.putUser,
        content: "",
        tags: [
          ["h", groupId],
          ["p", pubkey],
          [NOSTR_USER_TAG, userId],
        ],
        created_at: Math.floor(Date.now() / 1000),
      });
      group.members.add(pubkey);
      group.userIdByPubkey.set(pubkey, userId);
      this.mapPubkey(event.pubkey, this.identityUserId);
    } else {
      if (!pending) throw new Error("The join request is not available for rejection");
      await this.publishTemplate({
        kind: NIP29_KIND.deleteEvent,
        content: "",
        tags: [
          ["h", groupId],
          ["e", pending.eventId],
        ],
        created_at: Math.floor(Date.now() / 1000),
      });
    }
    group.pending.delete(userId);
  }

  async leaveGroup(groupId: string): Promise<void> {
    await this.publishTemplate({
      kind: NIP29_KIND.leaveRequest,
      content: "",
      tags: [["h", groupId]],
      created_at: Math.floor(Date.now() / 1000),
    });
  }

  listGroups(cityKey: string, currentUserId: string): StoredLocalChatGroup[] {
    return [...this.groups.values()]
      .filter((group) => group.cityKey === cityKey)
      .map((group) => {
        const creatorId =
          [...group.admins]
            .map((pubkey) => group.userIdByPubkey.get(pubkey) ?? this.userIdForPubkey(pubkey))
            .find(Boolean) ?? group.creatorId;
        const members = [...group.members].map(
          (pubkey) => group.userIdByPubkey.get(pubkey) ?? this.userIdForPubkey(pubkey) ?? pubkey,
        );
        if (group.admins.has(this.pubkeyForUserId(currentUserId))) members.push(currentUserId);
        return {
          id: group.id,
          cityKey: group.cityKey,
          name: group.name,
          type: group.type,
          createdBy: creatorId,
          createdAt: "",
          members: [...new Set(members)],
          pending: [...group.pending.values()].map((entry) => entry.userId),
        };
      });
  }

  destroy(): void {
    this.pool.destroy();
    this.groups.clear();
    this.pendingPubkeysByUserId.clear();
    this.userIdsByPubkey.clear();
  }

  private async publishTemplate(template: EventTemplate): Promise<VerifiedEvent> {
    this.assertRelayConfigured();
    if (!this.signer) throw new Error("A NIP-07 Nostr signer is required");
    const signedEvent = await signedTemplate(template, this.signer);
    const results = this.pool.publish(this.relayUrls, signedEvent);
    if (results.length === 0) throw new Error("No Nostr relay accepted the event");
    await firstFulfilled(results);
    return signedEvent;
  }

  private assertRelayConfigured(): void {
    if (this.relayUrls.length === 0) {
      throw new Error(`${LOCAL_CHAT_RELAY_ENV} is not configured`);
    }
  }

  private async encryptForGroup(group: GroupState, text: string): Promise<string> {
    if (!this.signer?.nip44?.encrypt)
      throw new Error("NIP-44 support is required for closed groups");
    const senderPubkey = await this.signer.getPublicKey();
    const recipientPubkeys = new Set([...group.members, senderPubkey]);
    const entries = await Promise.all(
      [...recipientPubkeys].map(
        async (pubkey) => [pubkey, await this.signer?.nip44?.encrypt?.(pubkey, text)] as const,
      ),
    );
    return ENCRYPTED_GROUP_CONTENT_MARKER + JSON.stringify(Object.fromEntries(entries));
  }

  private ingestGroupEvent(event: Event, cityKey: string): void {
    const groupId =
      tagValue(event, event.kind === NIP29_KIND.groupMetadata ? "d" : "h") ??
      (event.kind === NIP29_KIND.groupAdmins || event.kind === NIP29_KIND.groupMembers
        ? tagValue(event, "d")
        : undefined);
    if (!groupId) return;
    const group = this.getOrCreateGroup(cityKey, groupId);
    const userId = tagValue(event, NOSTR_USER_TAG);
    if (userId) this.mapPubkey(event.pubkey, userId, group);

    if (event.kind === NIP29_KIND.groupMetadata) {
      const eventCity = tagValue(event, "t") ?? tagValue(event, "about");
      if (eventCity && eventCity !== cityKey) return;
      group.name = tagValue(event, "name") ?? group.name;
      group.type = hasTag(event, "private") || hasTag(event, "restricted") ? "closed" : "public";
    } else if (event.kind === NIP29_KIND.groupAdmins) {
      group.admins = new Set(event.tags.filter((tag) => tag[0] === "p").map((tag) => tag[1]));
    } else if (event.kind === NIP29_KIND.groupMembers) {
      group.members = new Set(event.tags.filter((tag) => tag[0] === "p").map((tag) => tag[1]));
    } else if (event.kind === NIP29_KIND.createGroup) {
      group.creatorId = userId ?? this.userIdForPubkey(event.pubkey) ?? group.creatorId;
      group.admins.add(event.pubkey);
      group.members.add(event.pubkey);
    } else if (event.kind === NIP29_KIND.joinRequest) {
      const requestUserId = userId ?? this.userIdForPubkey(event.pubkey) ?? event.pubkey;
      group.pending.set(requestUserId, { userId: requestUserId, eventId: event.id });
      this.setPendingPubkey(groupId, requestUserId, event.pubkey);
    } else if (event.kind === NIP29_KIND.putUser) {
      const targetPubkey = event.tags.find((tag) => tag[0] === "p")?.[1];
      if (targetPubkey) {
        group.members.add(targetPubkey);
        const targetUserId = this.userIdForPubkey(targetPubkey);
        if (targetUserId) {
          group.userIdByPubkey.set(targetPubkey, targetUserId);
          group.pending.delete(targetUserId);
        }
      }
    } else if (event.kind === NIP29_KIND.removeUser) {
      const targetPubkey = event.tags.find((tag) => tag[0] === "p")?.[1];
      if (targetPubkey) group.members.delete(targetPubkey);
    } else if (event.kind === NIP29_KIND.deleteEvent) {
      const deletedId = event.tags.find((tag) => tag[0] === "e")?.[1];
      for (const [pendingUserId, request] of group.pending) {
        if (request.eventId === deletedId) group.pending.delete(pendingUserId);
      }
    }
  }

  private getOrCreateGroup(cityKey: string, groupId: string): GroupState {
    const key = this.groupKey(cityKey, groupId);
    let group = this.groups.get(key);
    if (!group) {
      group = {
        id: groupId,
        cityKey,
        name: groupId,
        type: "public",
        creatorId: "",
        admins: new Set(),
        members: new Set(),
        pending: new Map(),
        userIdByPubkey: new Map(),
      };
      this.groups.set(key, group);
    }
    return group;
  }

  private groupKey(cityKey: string, groupId: string): string {
    return `${cityKey}\u0000${groupId}`;
  }

  private mapPubkey(pubkey: string, userId: string, group?: GroupState): void {
    if (!userId) return;
    this.userIdsByPubkey.set(pubkey, userId);
    group?.userIdByPubkey.set(pubkey, userId);
    for (const current of this.groups.values()) current.userIdByPubkey.set(pubkey, userId);
    const pending = this.pendingPubkeysByUserId.get(userId) ?? new Map<string, string>();
    pending.set(group?.id ?? "", pubkey);
    this.pendingPubkeysByUserId.set(userId, pending);
  }

  private userIdForPubkey(pubkey: string): string | undefined {
    const knownUserId = this.userIdsByPubkey.get(pubkey);
    if (knownUserId) return knownUserId;
    for (const group of this.groups.values()) {
      const userId = group.userIdByPubkey.get(pubkey);
      if (userId) return userId;
    }
    return undefined;
  }

  private pubkeyForUserId(userId: string): string {
    for (const group of this.groups.values()) {
      for (const [pubkey, candidate] of group.userIdByPubkey) {
        if (candidate === userId) return pubkey;
      }
    }
    return "";
  }

  private userPubkey(group: GroupState, userId: string): string | undefined {
    return (
      [...group.userIdByPubkey].find(([, candidate]) => candidate === userId)?.[0] ??
      this.pendingPubkeysByUserId.get(userId)?.get(group.id)
    );
  }

  private setPendingPubkey(groupId: string, userId: string, pubkey: string): void {
    const pending = this.pendingPubkeysByUserId.get(userId) ?? new Map<string, string>();
    pending.set(groupId, pubkey);
    this.pendingPubkeysByUserId.set(userId, pending);
  }
}

function parseEncryptedGroupContent(content: string): Record<string, string> | null {
  try {
    const parsed: unknown = JSON.parse(content.slice(ENCRYPTED_GROUP_CONTENT_MARKER.length));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    const envelope: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value !== "string") return null;
      envelope[key] = value;
    }
    return envelope;
  } catch {
    return null;
  }
}

function firstFulfilled(promises: Promise<unknown>[]): Promise<void> {
  return new Promise((resolve, reject) => {
    let pending = promises.length;
    let lastError: unknown;
    for (const promise of promises) {
      promise.then(
        () => resolve(),
        (error: unknown) => {
          lastError = error;
          pending -= 1;
          if (pending === 0) reject(lastError);
        },
      );
    }
  });
}

export const localChatNostr = new LocalChatNostrClient();

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => localChatNostr.destroy(), { once: true });
}

declare global {
  interface Window {
    nostr?: WindowNostr;
  }
}
