/*
 * Pure helpers for the "testing preference" (lab vs portable) filter.
 *
 * A profile matches the filter when the filter is unset, or when the
 * profile's own `searchDetails.testingPreference` equals the selected option.
 * The filter selects on the *profile's* preference — each profile declares
 * how they prefer to do DNA/STD testing, and the filter surfaces profiles
 * whose preference matches.
 *
 * Special case: "none" means the user doesn't care/indifferent — they
 * should match any filter selection (including unset).
 */
export const TESTING_PREFERENCE_OPTIONS = ["lab", "portable", "both", "none"] as const;

export type TestingPreference = (typeof TESTING_PREFERENCE_OPTIONS)[number];

/**
 * Returns true when the profile should be kept under the given filter value.
 * An unset (empty) filter keeps every profile.
 * A profile with preference "none" matches any filter (including unset).
 * Otherwise requires exact match between profile preference and filter value.
 */
export function matchesTestingPreference(
  profilePref: string | undefined,
  filterValue: string | undefined,
): boolean {
  // Unset/empty filter matches everything
  if (!filterValue) return true;
  // "none" means user is open to any testing method
  if (profilePref === "none") return true;
  // Exact match required otherwise
  return profilePref === filterValue;
}
