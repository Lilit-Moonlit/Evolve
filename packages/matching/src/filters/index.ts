/**
 * Filters for Evolve matching
 * Provides distance, age, and interests filtering
 */

import type { MatchingProfile, MatchFilter } from "../types";

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Filter by distance
 */
export function filterByDistance(
  profiles: MatchingProfile[],
  centerLocation: { lat: number; lon: number },
  maxDistance: number,
): MatchingProfile[] {
  return profiles.filter((profile) => {
    if (!profile.location) return false;

    const distance = calculateDistance(
      centerLocation.lat,
      centerLocation.lon,
      profile.location.lat,
      profile.location.lon,
    );

    return distance <= maxDistance;
  });
}

/**
 * Filter by age range
 */
export function filterByAge(
  profiles: MatchingProfile[],
  minAge?: number,
  maxAge?: number,
): MatchingProfile[] {
  return profiles.filter((profile) => {
    if (minAge && profile.age < minAge) return false;
    if (maxAge && profile.age > maxAge) return false;
    return true;
  });
}

/**
 * Filter by gender
 */
export function filterByGender(
  profiles: MatchingProfile[],
  gender?: string,
): MatchingProfile[] {
  if (!gender) return profiles;
  return profiles.filter((profile) => profile.gender === gender);
}

/**
 * Filter by interests
 */
export function filterByInterests(
  profiles: MatchingProfile[],
  requiredInterests: string[],
  minMatchCount: number = 1,
): MatchingProfile[] {
  if (requiredInterests.length === 0) return profiles;

  return profiles.filter((profile) => {
    const matchingInterests = profile.interests.filter((interest) =>
      requiredInterests.includes(interest),
    );
    return matchingInterests.length >= minMatchCount;
  });
}

/**
 * Filter by minimum score
 */
export function filterByMinScore(
  profiles: MatchingProfile[],
  minScore: number,
): MatchingProfile[] {
  return profiles.filter((profile) => {
    // In a real implementation, this would use pre-calculated scores
    // For now, we'll just return all profiles
    return true;
  });
}

/**
 * Exclude specific user IDs
 */
export function excludeIds(
  profiles: MatchingProfile[],
  excludeIds: string[],
): MatchingProfile[] {
  return profiles.filter((profile) => !excludeIds.includes(profile.userId));
}

/**
 * Apply all filters
 */
export function applyFilters(
  profiles: MatchingProfile[],
  filter: MatchFilter,
  centerLocation?: { lat: number; lon: number },
): MatchingProfile[] {
  let filtered = [...profiles];

  // Exclude specific IDs first
  if (filter.excludeIds && filter.excludeIds.length > 0) {
    filtered = excludeIds(filtered, filter.excludeIds);
  }

  // Filter by age
  filtered = filterByAge(filtered, filter.minAge, filter.maxAge);

  // Filter by gender
  filtered = filterByGender(filtered, filter.gender);

  // Filter by distance
  if (filter.maxDistance && centerLocation) {
    filtered = filterByDistance(filtered, centerLocation, filter.maxDistance);
  }

  // Filter by interests
  if (filter.interests && filter.interests.length > 0) {
    filtered = filterByInterests(filtered, filter.interests);
  }

  // Filter by minimum score
  if (filter.minScore) {
    filtered = filterByMinScore(filtered, filter.minScore);
  }

  return filtered;
}

/**
 * Sort profiles by distance
 */
export function sortByDistance(
  profiles: MatchingProfile[],
  centerLocation: { lat: number; lon: number },
): MatchingProfile[] {
  return [...profiles].sort((a, b) => {
    if (!a.location) return 1;
    if (!b.location) return -1;

    const distanceA = calculateDistance(
      centerLocation.lat,
      centerLocation.lon,
      a.location.lat,
      a.location.lon,
    );

    const distanceB = calculateDistance(
      centerLocation.lat,
      centerLocation.lon,
      b.location.lat,
      b.location.lon,
    );

    return distanceA - distanceB;
  });
}

/**
 * Sort profiles by age
 */
export function sortByAge(
  profiles: MatchingProfile[],
  order: "asc" | "desc" = "asc",
): MatchingProfile[] {
  return [...profiles].sort((a, b) => {
    return order === "asc" ? a.age - b.age : b.age - a.age;
  });
}

/**
 * Sort profiles by number of matching interests
 */
export function sortByInterests(
  profiles: MatchingProfile[],
  targetInterests: string[],
  order: "asc" | "desc" = "desc",
): MatchingProfile[] {
  return [...profiles].sort((a, b) => {
    const matchCountA = a.interests.filter((interest) =>
      targetInterests.includes(interest),
    ).length;

    const matchCountB = b.interests.filter((interest) =>
      targetInterests.includes(interest),
    ).length;

    return order === "asc"
      ? matchCountA - matchCountB
      : matchCountB - matchCountA;
  });
}

/**
 * Get distance between two profiles
 */
export function getDistanceBetweenProfiles(
  profile1: MatchingProfile,
  profile2: MatchingProfile,
): number | null {
  if (!profile1.location || !profile2.location) return null;

  return calculateDistance(
    profile1.location.lat,
    profile1.location.lon,
    profile2.location.lat,
    profile2.location.lon,
  );
}

/**
 * Check if profiles are within distance
 */
export function isWithinDistance(
  profile1: MatchingProfile,
  profile2: MatchingProfile,
  maxDistance: number,
): boolean {
  const distance = getDistanceBetweenProfiles(profile1, profile2);
  return distance !== null && distance <= maxDistance;
}
