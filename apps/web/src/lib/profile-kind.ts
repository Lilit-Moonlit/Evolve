/**
 * Profile kind — "ким ви є" declared at registration.
 *
 * A profile IS one of: a woman, a man, a couple (three compositions) or a
 * laboratory. The kind drives search behavior, available features and how
 * other users interact with the profile (laboratory profiles serve the
 * patient/lab chat and test-confirmation flows).
 *
 * Stored in `profile.searchDetails.kind` (JSON round-trips through db.ts —
 * no schema migration). `gender` / `lookingFor` stay synced for legacy code
 * paths (verification rules, governance) via `kindToGender` /
 * `kindToLookingFor`.
 */

export const PROFILE_KINDS = [
  "woman",
  "man",
  "couple_man_woman",
  "couple_man_man",
  "couple_woman_woman",
  "laboratory",
] as const;

export type ProfileKind = (typeof PROFILE_KINDS)[number];

/** Kind → legacy `gender` value ("male" | "female" | "other"). */
export function kindToGender(kind: string | undefined): string | undefined {
  switch (kind) {
    case "woman":
      return "female";
    case "man":
      return "male";
    case "couple_man_woman":
    case "couple_man_man":
    case "couple_woman_woman":
    case "laboratory":
      return "other";
    default:
      return undefined;
  }
}

/** Kind → legacy `lookingFor` value (only couples self-identify as couples). */
export function kindToLookingFor(kind: string | undefined): string | undefined {
  switch (kind) {
    case "couple_man_woman":
    case "couple_man_man":
    case "couple_woman_woman":
      return kind;
    default:
      return undefined;
  }
}

/** True when the profile kind is the laboratory account type. */
export function isLaboratoryProfile(searchDetails: { kind?: string } | undefined | null): boolean {
  return searchDetails?.kind === "laboratory";
}

/**
 * Legacy migration: infer the kind from pre-kind fields (gender/lookingFor).
 * Returns undefined when nothing can be inferred (caller keeps existing kind).
 */
export function kindFromGenderLookingFor(
  gender: string | undefined,
  lookingFor: string | undefined,
): ProfileKind | undefined {
  if (
    lookingFor === "couple_man_woman" ||
    lookingFor === "couple_man_man" ||
    lookingFor === "couple_woman_woman"
  ) {
    return lookingFor;
  }
  if (gender === "female") return "woman";
  if (gender === "male") return "man";
  return undefined;
}

/** i18n label key for a kind under the `profileKind` namespace. */
export function profileKindLabelKey(kind: ProfileKind): string {
  return `profileKind.${kind}`;
}
