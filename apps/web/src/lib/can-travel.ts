/**
 * Pure helpers for the "can travel to my country" filter.
 *
 * A profile declares willingness to travel via `canTravel` plus an explicit
 * list of destination countries (`canTravelCountries`, canonical English
 * names — same vocabulary as `searchDetails.country`).
 */

export interface CanTravelProfile {
  canTravel?: boolean;
  canTravelCountries?: string[];
}

/**
 * Returns true when the profile should be kept under the "Може прибути до
 * моєї країни" filter for a searcher located in `searcherCountry`.
 *
 * - `canTravel` false/absent → never matches.
 * - Declared but EMPTY list → matches any country (legacy semantics of the
 *   bare boolean flag: "I can travel anywhere").
 * - Non-empty list → matches when the searcher's country is in the list;
 *   an unknown searcher country keeps every traveler (nothing to compare).
 */
export function matchesCanTravel(
  profile: CanTravelProfile,
  searcherCountry: string | undefined,
): boolean {
  if (!profile.canTravel) return false;
  const list = profile.canTravelCountries ?? [];
  if (list.length === 0) return true; // legacy bare flag = anywhere
  if (!searcherCountry) return true;
  return list.includes(searcherCountry);
}
