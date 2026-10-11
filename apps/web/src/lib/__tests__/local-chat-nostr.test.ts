import { describe, expect, it } from "vitest";
import { verifiedSymbol } from "nostr-tools";
import type { Event, EventTemplate, Filter, VerifiedEvent } from "nostr-tools";
import type { WindowNostr } from "nostr-tools/nip07";
import {
  LocalChatNostrClient,
  NIP29_KIND,
  buildLocalChatMessageTags,
  buildLocalChatNostrFilters,
  buildNip29GroupEvents,
  localChatMessageFromNostrEvent,
  type LocalChatNostrPool,
} from "../local-chat-nostr";

const cityKey = "Ukraine::Kyiv";
const groupId = "group-1";

class TestPool implements LocalChatNostrPool {
  readonly published: Event[] = [];
  filters: Filter[] = [];
  subscriptionClosed = false;

  subscribeMany(
    _relays: string[],
    filter: Filter,
    params: { onevent: (event: Event) => void; oneose: () => void },
  ) {
    this.filters.push(filter);
    queueMicrotask(() => params.oneose());
    return {
      close: () => {
        this.subscriptionClosed = true;
      },
    };
  }

  publish(_relays: string[], event: Event): Promise<string>[] {
    this.published.push(event);
    return [Promise.resolve(event.id)];
  }

  destroy(): void {}
}

function makeSigner(): WindowNostr {
  let nextId = 0;
  return {
    getPublicKey: async () => "a".repeat(64),
    signEvent: async (template: EventTemplate) => {
      nextId += 1;
      const event: VerifiedEvent = {
        ...template,
        pubkey: "a".repeat(64),
        id: `event-${nextId}`,
        sig: "b".repeat(128),
        [verifiedSymbol]: true,
      };
      return event;
    },
  };
}

function createClient(pool: TestPool): LocalChatNostrClient {
  return new LocalChatNostrClient({
    relayUrls: ["wss://kyiv.example.test"],
    poolFactory: () => pool,
    signer: makeSigner(),
    connectTimeoutMs: 100,
  });
}

function event(overrides: Partial<Event> = {}): Event {
  return {
    id: "event-1",
    pubkey: "c".repeat(64),
    created_at: 1_791_590_400,
    kind: 1,
    tags: buildLocalChatMessageTags(cityKey, groupId, "user-2", "Oksana"),
    content: "Hello Kyiv",
    sig: "d".repeat(128),
    ...overrides,
  };
}

describe("local chat Nostr event model", () => {
  it("tags messages with city, group, NIP-29 scope, and app sender metadata", () => {
    expect(buildLocalChatMessageTags(cityKey, groupId, "user-1", "Marta")).toEqual([
      ["t", "Ukraine::Kyiv"],
      ["d", "group-1"],
      ["g", "group-1"],
      ["h", "group-1"],
      ["evolve-user", "user-1"],
      ["name", "Marta"],
    ]);
  });

  it("normalizes matching kind-1 events and rejects events outside the room", () => {
    expect(localChatMessageFromNostrEvent(event(), cityKey, groupId)).toEqual({
      id: "event-1",
      cityKey,
      groupId,
      senderId: "user-2",
      senderName: "Oksana",
      text: "Hello Kyiv",
      createdAt: new Date(1_791_590_400_000).toISOString(),
    });
    expect(localChatMessageFromNostrEvent(event(), "Poland::Warsaw", groupId)).toBeNull();
    expect(
      localChatMessageFromNostrEvent(
        event({
          tags: [
            ["t", cityKey],
            ["d", "other"],
          ],
        }),
        cityKey,
        groupId,
      ),
    ).toBeNull();
  });

  it("filters messages by city and group and loads city metadata", () => {
    expect(buildLocalChatNostrFilters(cityKey, groupId)).toEqual(
      expect.arrayContaining([
        { kinds: [1], "#t": [cityKey], "#d": [groupId], limit: 100 },
        { kinds: [1], "#t": [cityKey], "#g": [groupId], limit: 100 },
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
      ]),
    );
  });

  it("builds NIP-29 create and metadata events with closed-group policy tags", () => {
    const [create, metadata] = buildNip29GroupEvents(
      cityKey,
      groupId,
      "Parents",
      "closed",
      "user-1",
    );
    expect(create).toMatchObject({ kind: 9007, content: "" });
    expect(create.tags).toContainEqual(["h", groupId]);
    expect(metadata).toMatchObject({ kind: 9002, content: "" });
    expect(metadata.tags).toContainEqual(["t", cityKey]);
    expect(metadata.tags).toContainEqual(["private"]);
    expect(metadata.tags).toContainEqual(["restricted"]);
    expect(metadata.tags).not.toContainEqual(["closed"]);
  });
});

describe("LocalChatNostrClient", () => {
  it("subscribes through the configured relay and returns a close callback", async () => {
    const pool = new TestPool();
    const client = createClient(pool);
    const close = await client.subscribe(cityKey, groupId, () => undefined);
    expect(pool.filters).toEqual(buildLocalChatNostrFilters(cityKey, groupId));
    close();
    expect(pool.subscriptionClosed).toBe(true);
  });

  it("publishes a signed kind-1 message and returns its normalized row", async () => {
    const pool = new TestPool();
    const client = createClient(pool);
    const sent = await client.publish(cityKey, groupId, {
      senderId: "user-1",
      senderName: "Marta",
      text: "Hello",
    });
    expect(pool.published[0]).toMatchObject({
      kind: 1,
      content: "Hello",
      tags: expect.arrayContaining([
        ["t", cityKey],
        ["d", groupId],
        ["h", groupId],
      ]),
    });
    expect(sent).toMatchObject({ id: "event-1", senderId: "user-1", text: "Hello" });
  });

  it("publishes NIP-29 join, approval, and rejection events", async () => {
    const pool = new TestPool();
    const client = createClient(pool);
    await client.setProfileIdentity("admin-user");
    await client.requestJoin(cityKey, groupId, "member-user");
    await client.resolveJoin(cityKey, groupId, "member-user", true);
    await client.requestJoin(cityKey, groupId, "waiting-user");
    await client.resolveJoin(cityKey, groupId, "waiting-user", false);

    expect(pool.published.map((published) => published.kind)).toEqual([
      NIP29_KIND.joinRequest,
      NIP29_KIND.putUser,
      NIP29_KIND.joinRequest,
      NIP29_KIND.deleteEvent,
    ]);
    expect(pool.published[0].tags).toContainEqual(["h", groupId]);
    expect(pool.published[1].tags).toContainEqual(["p", "a".repeat(64)]);
    expect(pool.published[3].tags).toContainEqual(["e", "event-3"]);
  });

  it("publishes a NIP-29 leave request", async () => {
    const pool = new TestPool();
    await createClient(pool).leaveGroup(groupId);
    expect(pool.published[0]).toMatchObject({
      kind: NIP29_KIND.leaveRequest,
      tags: [["h", groupId]],
    });
  });

  it("encrypts closed-group messages for members and decrypts the recipient envelope", async () => {
    const pool = new TestPool();
    const signer: WindowNostr = {
      getPublicKey: async () => "a".repeat(64),
      signEvent: async (template: EventTemplate) => ({
        ...template,
        pubkey: "a".repeat(64),
        id: "private-event",
        sig: "b".repeat(128),
        [verifiedSymbol]: true,
      }),
      nip44: {
        encrypt: async () => "opaque-ciphertext",
        decrypt: async () => "Private hello",
      },
    };
    const client = new LocalChatNostrClient({
      relayUrls: ["wss://kyiv.example.test"],
      poolFactory: () => pool,
      signer,
    });
    await client.createGroup(cityKey, "Parents", "closed", "admin");

    const sent = await client.publish(cityKey, pool.published[0].tags[0][1], {
      senderId: "admin",
      senderName: "Marta",
      text: "Private hello",
    });
    const publishedMessage = pool.published[2];
    expect(publishedMessage.content).toContain("evolve-nip44-group/v1:");
    expect(publishedMessage.content).not.toContain("Private hello");
    expect(sent.text).toBe("Private hello");
    await expect(
      client.messageFromEvent(publishedMessage, cityKey, sent.groupId),
    ).resolves.toMatchObject({
      text: "Private hello",
      senderId: "admin",
    });
  });

  it("requires relay configuration and a NIP-07 signer to publish", async () => {
    const noRelay = new LocalChatNostrClient({ relayUrls: [], poolFactory: () => new TestPool() });
    await expect(noRelay.subscribe(cityKey, groupId, () => undefined)).rejects.toThrow(
      "VITE_NOSTR_CITY_RELAY_URL",
    );

    const noSigner = new LocalChatNostrClient({
      relayUrls: ["wss://kyiv.example.test"],
      poolFactory: () => new TestPool(),
    });
    await expect(
      noSigner.publish(cityKey, groupId, { senderId: "u", senderName: "User", text: "Hi" }),
    ).rejects.toThrow("NIP-07");
  });
});
