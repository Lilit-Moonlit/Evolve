/**
 * Pure helpers for the "who are you looking for" (lookingFor) filter.
 *
 * A profile matches the filter when the filter is unset, or when the
 * profile's own `searchDetails.lookingFor` equals the selected option.
 * The filter selects on the *profile's* preference — each profile says who
 * it wants, and the filter surfaces profiles whose preference matches.
 */
export const LOOKING_FOR_OPTIONS = [
  "man",
  "woman",
  "couple_man_woman",
  "couple_woman_woman",
  "couple_man_man",
] as const;

export type LookingForOption = (typeof LOOKING_FOR_OPTIONS)[number];

/**
 * Returns true when the profile should be kept under the given filter value.
 * An unset (empty) filter keeps every profile.
 */
export function matchesLookingFor(
  profileLookingFor: string | undefined,
  filterValue: string | undefined,
): boolean {
  if (!filterValue) return true;
  return profileLookingFor === filterValue;
}

/**
 * "Кого шукаєте" (Who search) — what the CURRENT user seeks in a target.
 * Reuses the lookingFor vocabulary so the Profile editor and i18n labels
 * (`filters.lookingForOptions.*`) stay shared.
 */
export type WhoSearchOption = LookingForOption;

/** "Що шукаєте" (What search) purposes that show the Who filter. */
export type WhatSearchPurpose = "dating" | "conception" | "polyandrous";

/**
 * Pure matcher for the Who filter.
 * - "man"/"woman" → match by the profile `kind` first; legacy profiles
 *   without a kind fall back to `gender`.
 * - couple_* → match by `kind` first; legacy profiles fall back to their
 *   declared `lookingFor` (no dedicated couple gender exists).
 * - Laboratory-kind profiles are never a Who target (excluded upstream).
 * An unset (empty) filter keeps every profile.
 */
export function matchesWhoSearch(
  profile: { gender?: string; lookingFor?: string; kind?: string },
  who: string | undefined,
): boolean {
  if (!who) return true;
  if (who === "man") {
    return profile.kind ? profile.kind === "man" : profile.gender === "male";
  }
  if (who === "woman") {
    return profile.kind ? profile.kind === "woman" : profile.gender === "female";
  }
  if (profile.kind) return profile.kind === who;
  return profile.lookingFor === who;
}

/**
 * Allowed Who options for the given search purpose and the current user's
 * declared gender ("male" | "female" | other/unknown).
 *
 * - dating → all five options.
 * - conception: woman → [man]; man → [woman, couple_woman_woman].
 * - polyandrous: woman → [man, couple_man_man]; man → [woman].
 * Unknown gender falls back to the union of both gender variants.
 */
export function getWhoSearchOptions(
  purpose: WhatSearchPurpose,
  userGender: string | undefined,
): WhoSearchOption[] {
  if (purpose === "dating") {
    return ["woman", "man", "couple_man_woman", "couple_man_man", "couple_woman_woman"];
  }
  if (purpose === "conception") {
    if (userGender === "female") return ["man"];
    if (userGender === "male") return ["woman", "couple_woman_woman"];
    return ["woman", "man", "couple_woman_woman"];
  }
  // polyandrous
  if (userGender === "female") return ["man", "couple_man_man"];
  if (userGender === "male") return ["woman"];
  return ["man", "woman", "couple_man_man"];
}
