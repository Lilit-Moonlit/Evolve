/**
 * City tagging utilities for Nostr relays.
 *
 * Maps between the canonical city key format (Country::City) and Nostr `t` tags
 * used by city-scoped relays to filter content by geography.
 */

/**
 * Canonical storage/lookup key for a city (mirrors apps/web/src/lib/local-chat.ts).
 * Format: "Country::City" (e.g., "Ukraine::Kyiv").
 */
export function cityKeyOf(country: string, city: string): string {
  return `${country.trim()}::${city.trim()}`;
}

/**
 * Inverse of cityKeyOf — tolerant of malformed keys.
 */
export function parseCityKey(cityKey: string): { country: string; city: string } {
  const sep = cityKey.indexOf("::");
  if (sep === -1) return { country: "", city: cityKey };
  return { country: cityKey.slice(0, sep), city: cityKey.slice(sep + 2) };
}

/**
 * True when the key has both a country and a city and no control characters.
 */
export function isValidCityKey(cityKey: string): boolean {
  const { country, city } = parseCityKey(cityKey);
  return country.length > 0 && city.length > 0 && !/[\n\r\t]/.test(cityKey);
}

/**
 * Converts a city key to a Nostr `t` tag value.
 * The `t` tag is used for topic/tag filtering on relays.
 * For city-scoped relays, the tag value is the city key itself.
 *
 * @param cityKey - The canonical city key (e.g., "Ukraine::Kyiv")
 * @returns The tag value for use in a `["t", "..."]` tag array
 */
export function cityKeyToTag(cityKey: string): string {
  if (!isValidCityKey(cityKey)) {
    throw new Error(`Invalid city key: ${cityKey}`);
  }
  return cityKey;
}

/**
 * Converts a Nostr `t` tag value back to a city key.
 * This is the inverse of cityKeyToTag.
 *
 * @param tagValue - The tag value from a `["t", "..."]` tag
 * @returns The canonical city key
 */
export function tagToCityKey(tagValue: string): string {
  if (!isValidCityKey(tagValue)) {
    throw new Error(`Invalid tag value for city key: ${tagValue}`);
  }
  return tagValue;
}

/**
 * Creates a Nostr `t` tag array for a city.
 * Used when publishing events to city-scoped relays.
 *
 * @param cityKey - The canonical city key
 * @returns A tag array `["t", cityKey]`
 */
export function createCityTag(cityKey: string): string[] {
  return ["t", cityKeyToTag(cityKey)];
}

/**
 * Extracts the city key from a Nostr event's tags.
 * Searches for the first `t` tag that matches the city key format.
 *
 * @param tags - The event's tags array
 * @returns The city key if found, null otherwise
 */
export function extractCityKeyFromTags(tags: string[][]): string | null {
  for (const tag of tags) {
    if (tag[0] === "t" && tag[1] !== undefined && isValidCityKey(tag[1])) {
      return tag[1];
    }
  }
  return null;
}
