import { describe, it, expect } from "vitest";
import {
  PROFILE_KINDS,
  kindToGender,
  kindToLookingFor,
  isLaboratoryProfile,
  kindFromGenderLookingFor,
  profileKindLabelKey,
} from "../profile-kind";

describe("PROFILE_KINDS", () => {
  it("exposes the six registration kinds", () => {
    expect(PROFILE_KINDS).toEqual([
      "woman",
      "man",
      "couple_man_woman",
      "couple_man_man",
      "couple_woman_woman",
      "laboratory",
    ]);
  });
});

describe("kindToGender", () => {
  it("maps singles to their gender", () => {
    expect(kindToGender("woman")).toBe("female");
    expect(kindToGender("man")).toBe("male");
  });

  it("maps couples and laboratory to other", () => {
    expect(kindToGender("couple_man_woman")).toBe("other");
    expect(kindToGender("couple_man_man")).toBe("other");
    expect(kindToGender("couple_woman_woman")).toBe("other");
    expect(kindToGender("laboratory")).toBe("other");
  });

  it("returns undefined for unknown/empty kinds", () => {
    expect(kindToGender(undefined)).toBeUndefined();
    expect(kindToGender("")).toBeUndefined();
    expect(kindToGender("alien")).toBeUndefined();
  });
});

describe("kindToLookingFor", () => {
  it("couples self-identify in lookingFor", () => {
    expect(kindToLookingFor("couple_man_woman")).toBe("couple_man_woman");
    expect(kindToLookingFor("couple_woman_woman")).toBe("couple_woman_woman");
  });

  it("singles and laboratories have no lookingFor derivation", () => {
    expect(kindToLookingFor("woman")).toBeUndefined();
    expect(kindToLookingFor("man")).toBeUndefined();
    expect(kindToLookingFor("laboratory")).toBeUndefined();
  });
});

describe("isLaboratoryProfile", () => {
  it("detects laboratory kind", () => {
    expect(isLaboratoryProfile({ kind: "laboratory" })).toBe(true);
    expect(isLaboratoryProfile({ kind: "woman" })).toBe(false);
    expect(isLaboratoryProfile({})).toBe(false);
    expect(isLaboratoryProfile(undefined)).toBe(false);
  });
});

describe("kindFromGenderLookingFor", () => {
  it("infers couples from legacy lookingFor", () => {
    expect(kindFromGenderLookingFor("male", "couple_man_woman")).toBe("couple_man_woman");
  });

  it("infers singles from legacy gender", () => {
    expect(kindFromGenderLookingFor("female", "man")).toBe("woman");
    expect(kindFromGenderLookingFor("male", "woman")).toBe("man");
  });

  it("returns undefined when nothing can be inferred", () => {
    expect(kindFromGenderLookingFor(undefined, undefined)).toBeUndefined();
    expect(kindFromGenderLookingFor("other", "man")).toBeUndefined();
  });
});

describe("profileKindLabelKey", () => {
  it("builds i18n keys under the profileKind namespace", () => {
    expect(profileKindLabelKey("laboratory")).toBe("profileKind.laboratory");
    expect(profileKindLabelKey("woman")).toBe("profileKind.woman");
  });
});
