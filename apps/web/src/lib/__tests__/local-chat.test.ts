import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCAL_CHAT_GROUP_IDS,
  LOCAL_CHAT_MAX_GROUP_NAME_LENGTH,
  LOCAL_CHAT_MAX_MESSAGE_LENGTH,
  type StoredLocalChatGroup,
  canAccessGroup,
  cityKeyOf,
  hasRequestedJoin,
  isDefaultLocalChatGroupId,
  isGroupAdmin,
  isValidCityKey,
  localChatChannelId,
  mergeLocalChatMessages,
  parseCityKey,
  sortLocalChatMessages,
  validateGroupName,
  validateLocalChatMessage,
} from "../local-chat";

const closedGroup: StoredLocalChatGroup = {
  id: "g1",
  cityKey: "Ukraine::Kyiv",
  name: "Kyiv parents",
  type: "closed",
  createdBy: "u-admin",
  createdAt: "2026-10-10T00:00:00.000Z",
  members: ["u-member"],
  pending: ["u-waiting"],
};

const publicGroup: StoredLocalChatGroup = {
  ...closedGroup,
  id: "g2",
  name: "Kyiv events",
  type: "public",
  members: [],
  pending: [],
};

describe("city keys", () => {
  it("builds a canonical country::city key with trimming", () => {
    expect(cityKeyOf(" Ukraine ", " Kyiv ")).toBe("Ukraine::Kyiv");
  });

  it("round-trips through parseCityKey", () => {
    expect(parseCityKey("Ukraine::Kyiv")).toEqual({ country: "Ukraine", city: "Kyiv" });
  });

  it("tolerates malformed keys without throwing", () => {
    expect(parseCityKey("Kyiv")).toEqual({ country: "", city: "Kyiv" });
  });

  it("accepts valid keys and rejects empty or multi-line ones", () => {
    expect(isValidCityKey("Ukraine::Kyiv")).toBe(true);
    expect(isValidCityKey("::Kyiv")).toBe(false);
    expect(isValidCityKey("Ukraine::")).toBe(false);
    expect(isValidCityKey("Ukraine\n::Kyiv")).toBe(false);
  });
});

describe("channels", () => {
  it("derives a stable ws channel id for a city+group stream", () => {
    expect(localChatChannelId("Ukraine::Kyiv", "all")).toBe("local:Ukraine::Kyiv:all");
  });
});

describe("default groups", () => {
  it("exposes exactly the 4 built-in thematic groups", () => {
    expect(DEFAULT_LOCAL_CHAT_GROUP_IDS).toEqual(["all", "dating", "conception", "polyandrous"]);
  });

  it("recognizes default group ids", () => {
    expect(isDefaultLocalChatGroupId("all")).toBe(true);
    expect(isDefaultLocalChatGroupId("polyandrous")).toBe(true);
    expect(isDefaultLocalChatGroupId("g1")).toBe(false);
  });
});

describe("message validation", () => {
  it("accepts normal text and trims it implicitly (length measured after trim)", () => {
    expect(validateLocalChatMessage(" hello ")).toBeNull();
  });

  it("rejects empty and whitespace-only text", () => {
    expect(validateLocalChatMessage("")).toBe("empty");
    expect(validateLocalChatMessage("   \n\t ")).toBe("empty");
  });

  it("rejects text longer than the limit", () => {
    expect(validateLocalChatMessage("a".repeat(LOCAL_CHAT_MAX_MESSAGE_LENGTH + 1))).toBe(
      "too_long",
    );
    expect(validateLocalChatMessage("a".repeat(LOCAL_CHAT_MAX_MESSAGE_LENGTH))).toBeNull();
  });
});

describe("group name validation", () => {
  it("rejects empty and whitespace-only names", () => {
    expect(validateGroupName("")).toBe("empty");
    expect(validateGroupName("   ")).toBe("empty");
  });

  it("rejects names longer than the limit", () => {
    expect(validateGroupName("n".repeat(LOCAL_CHAT_MAX_GROUP_NAME_LENGTH + 1))).toBe("too_long");
    expect(validateGroupName("n".repeat(LOCAL_CHAT_MAX_GROUP_NAME_LENGTH))).toBeNull();
  });

  it("rejects names containing the key separator", () => {
    expect(validateGroupName("a::b")).toBe("invalid");
    expect(validateGroupName("local:x")).toBe("invalid");
  });
});

describe("group membership", () => {
  it("lets everyone access a public group", () => {
    expect(canAccessGroup(publicGroup, "u-stranger")).toBe(true);
  });

  it("restricts closed groups to members and the admin", () => {
    expect(canAccessGroup(closedGroup, "u-member")).toBe(true);
    expect(canAccessGroup(closedGroup, "u-admin")).toBe(true);
    expect(canAccessGroup(closedGroup, "u-stranger")).toBe(false);
  });

  it("identifies the admin as the creator only", () => {
    expect(isGroupAdmin(closedGroup, "u-admin")).toBe(true);
    expect(isGroupAdmin(closedGroup, "u-member")).toBe(false);
  });

  it("detects pending join requests", () => {
    expect(hasRequestedJoin(closedGroup, "u-waiting")).toBe(true);
    expect(hasRequestedJoin(closedGroup, "u-stranger")).toBe(false);
  });
});

describe("message merging", () => {
  const base = [
    {
      id: "1",
      cityKey: "Ukraine::Kyiv",
      groupId: "all",
      senderId: "a",
      senderName: "A",
      text: "1",
      createdAt: "2026-10-10T01:00:00.000Z",
    },
    {
      id: "2",
      cityKey: "Ukraine::Kyiv",
      groupId: "all",
      senderId: "a",
      senderName: "A",
      text: "2",
      createdAt: "2026-10-10T02:00:00.000Z",
    },
  ];

  it("appends only unseen messages", () => {
    const merged = mergeLocalChatMessages(base, [
      base[1],
      {
        id: "3",
        cityKey: "Ukraine::Kyiv",
        groupId: "all",
        senderId: "b",
        senderName: "B",
        text: "3",
        createdAt: "2026-10-10T03:00:00.000Z",
      },
    ]);
    expect(merged.map((m) => m.id)).toEqual(["1", "2", "3"]);
  });

  it("sorts by createdAt asc with id as a tiebreaker", () => {
    const sorted = sortLocalChatMessages([
      {
        id: "b",
        cityKey: "k",
        groupId: "all",
        senderId: "a",
        senderName: "A",
        text: "",
        createdAt: "2026-10-10T02:00:00.000Z",
      },
      {
        id: "a",
        cityKey: "k",
        groupId: "all",
        senderId: "a",
        senderName: "A",
        text: "",
        createdAt: "2026-10-10T01:00:00.000Z",
      },
      {
        id: "c",
        cityKey: "k",
        groupId: "all",
        senderId: "a",
        senderName: "A",
        text: "",
        createdAt: "2026-10-10T02:00:00.000Z",
      },
    ]);
    expect(sorted.map((m) => m.id)).toEqual(["a", "b", "c"]);
  });
});
