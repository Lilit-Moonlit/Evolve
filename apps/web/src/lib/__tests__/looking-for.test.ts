import { describe, it, expect } from "vitest";
import {
  matchesLookingFor,
  LOOKING_FOR_OPTIONS,
  matchesWhoSearch,
  getWhoSearchOptions,
} from "../looking-for";

describe("matchesLookingFor", () => {
  it("keeps every profile when the filter is unset", () => {
    expect(matchesLookingFor(undefined, undefined)).toBe(true);
    expect(matchesLookingFor("woman", undefined)).toBe(true);
    expect(matchesLookingFor("couple_man_woman", "")).toBe(true);
  });

  it("matches when the profile preference equals the filter value", () => {
    expect(matchesLookingFor("man", "man")).toBe(true);
    expect(matchesLookingFor("couple_woman_woman", "couple_woman_woman")).toBe(true);
  });

  it("excludes profiles whose preference differs from the filter", () => {
    expect(matchesLookingFor("woman", "man")).toBe(false);
    expect(matchesLookingFor("couple_man_woman", "woman")).toBe(false);
  });

  it("excludes profiles with no preference when the filter is set", () => {
    expect(matchesLookingFor(undefined, "man")).toBe(false);
    expect(matchesLookingFor("", "man")).toBe(false);
  });

  it("exposes the five supported options", () => {
    expect(LOOKING_FOR_OPTIONS).toEqual([
      "man",
      "woman",
      "couple_man_woman",
      "couple_woman_woman",
      "couple_man_man",
    ]);
  });
});

describe("matchesWhoSearch", () => {
  it("keeps every profile when the filter is unset", () => {
    expect(matchesWhoSearch({ gender: "male" }, undefined)).toBe(true);
    expect(matchesWhoSearch({ gender: "female" }, "")).toBe(true);
  });

  it("matches man/woman by the target profile gender", () => {
    expect(matchesWhoSearch({ gender: "male" }, "man")).toBe(true);
    expect(matchesWhoSearch({ gender: "female" }, "man")).toBe(false);
    expect(matchesWhoSearch({ gender: "female" }, "woman")).toBe(true);
    expect(matchesWhoSearch({ gender: "male" }, "woman")).toBe(false);
    expect(matchesWhoSearch({ gender: "other" }, "man")).toBe(false);
    expect(matchesWhoSearch({}, "woman")).toBe(false);
  });

  it("matches couple options by the profile declared couple preference", () => {
    expect(
      matchesWhoSearch({ gender: "male", lookingFor: "couple_man_woman" }, "couple_man_woman"),
    ).toBe(true);
    expect(matchesWhoSearch({ gender: "female", lookingFor: "man" }, "couple_man_woman")).toBe(
      false,
    );
    expect(matchesWhoSearch({ gender: "male" }, "couple_woman_woman")).toBe(false);
  });
});

describe("matchesWhoSearch (kind-aware)", () => {
  it("matches man/woman by profile kind", () => {
    expect(matchesWhoSearch({ kind: "man" }, "man")).toBe(true);
    expect(matchesWhoSearch({ kind: "woman" }, "man")).toBe(false);
    expect(matchesWhoSearch({ kind: "woman" }, "woman")).toBe(true);
    expect(matchesWhoSearch({ kind: "man" }, "woman")).toBe(false);
  });

  it("matches couples by profile kind", () => {
    expect(matchesWhoSearch({ kind: "couple_man_woman" }, "couple_man_woman")).toBe(true);
    expect(matchesWhoSearch({ kind: "couple_woman_woman" }, "couple_man_woman")).toBe(false);
  });

  it("kind wins over conflicting legacy gender/lookingFor", () => {
    expect(matchesWhoSearch({ kind: "woman", gender: "male" }, "man")).toBe(false);
    expect(matchesWhoSearch({ kind: "woman", gender: "male" }, "woman")).toBe(true);
    expect(
      matchesWhoSearch({ kind: "man", lookingFor: "couple_man_woman" }, "couple_man_woman"),
    ).toBe(false);
  });

  it("legacy profiles without kind still fall back to gender/lookingFor", () => {
    expect(matchesWhoSearch({ gender: "male" }, "man")).toBe(true);
    expect(matchesWhoSearch({ gender: "female" }, "woman")).toBe(true);
    expect(matchesWhoSearch({ lookingFor: "couple_man_man" }, "couple_man_man")).toBe(true);
  });

  it("laboratory kind is never a Who target", () => {
    expect(matchesWhoSearch({ kind: "laboratory" }, "man")).toBe(false);
    expect(matchesWhoSearch({ kind: "laboratory" }, "woman")).toBe(false);
    expect(matchesWhoSearch({ kind: "laboratory" }, "couple_man_woman")).toBe(false);
  });

  it("unset filter keeps laboratory profiles too (upstream filter excludes them)", () => {
    expect(matchesWhoSearch({ kind: "laboratory" }, undefined)).toBe(true);
  });
});

describe("getWhoSearchOptions", () => {
  it("dating shows all five options in spec order", () => {
    expect(getWhoSearchOptions("dating", "female")).toEqual([
      "woman",
      "man",
      "couple_man_woman",
      "couple_man_man",
      "couple_woman_woman",
    ]);
    expect(getWhoSearchOptions("dating", "male")).toHaveLength(5);
    expect(getWhoSearchOptions("dating", undefined)).toHaveLength(5);
  });

  it("conception: woman sees only man (preselected single option)", () => {
    expect(getWhoSearchOptions("conception", "female")).toEqual(["man"]);
  });

  it("conception: man sees woman + female couple", () => {
    expect(getWhoSearchOptions("conception", "male")).toEqual(["woman", "couple_woman_woman"]);
  });

  it("polyandrous: woman sees man + male couple", () => {
    expect(getWhoSearchOptions("polyandrous", "female")).toEqual(["man", "couple_man_man"]);
  });

  it("polyandrous: man sees only woman", () => {
    expect(getWhoSearchOptions("polyandrous", "male")).toEqual(["woman"]);
  });

  it("unknown gender falls back to the union of both gender variants", () => {
    expect(getWhoSearchOptions("conception", undefined)).toEqual([
      "woman",
      "man",
      "couple_woman_woman",
    ]);
    expect(getWhoSearchOptions("polyandrous", "other")).toEqual(["man", "woman", "couple_man_man"]);
  });
});
