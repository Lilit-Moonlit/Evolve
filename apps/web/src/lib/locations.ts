import { useEffect, useState } from "react";

/**
 * Cascading Country → City location data for search filters and the profile
 * editor. Backed by the offline `country-state-city` dataset (ban-resistant:
 * no external API calls) and lazy-loaded via a dynamic import so the heavy
 * geo data lives in a separate Vite chunk instead of the main bundle.
 */

export interface LocationIndex {
  /** All country names, sorted A-Z, deduped. */
  countries: string[];
  /** Sorted, deduped city names of one country. Unknown country → []. */
  citiesFor: (country: string) => string[];
  /** ISO 3166-1 alpha-2 code of one country (e.g. "UA"). Unknown → "". */
  isoFor: (country: string) => string;
}

/**
 * Pure index builder (unit-testable): normalizes raw country/city records
 * into sorted, deduped name lists keyed by country name.
 */
export function buildLocationIndex(
  rawCountries: { name: string; isoCode?: string }[],
  citiesByCountryName: Record<string, { name: string }[]>,
): LocationIndex {
  const countries = [...new Set(rawCountries.map((c) => c.name).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  );
  const iso = new Map<string, string>();
  for (const c of rawCountries) {
    if (c.name && c.isoCode && !iso.has(c.name)) iso.set(c.name, c.isoCode);
  }
  const cities = new Map<string, string[]>();
  for (const [country, list] of Object.entries(citiesByCountryName)) {
    cities.set(
      country,
      [...new Set(list.map((c) => c.name).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    );
  }
  return {
    countries,
    citiesFor: (country: string) => cities.get(country) ?? [],
    isoFor: (country: string) => iso.get(country) ?? "",
  };
}

let indexPromise: Promise<LocationIndex> | null = null;

/**
 * Lazily loads the full location index (cached — the dataset is parsed once
 * per session). Uses a dynamic import so the geo data is code-split.
 */
export function loadLocationIndex(): Promise<LocationIndex> {
  if (!indexPromise) {
    indexPromise = import("country-state-city").then(({ Country, City }) => {
      const rawCountries = Country.getAllCountries();
      const citiesByCountryName: Record<string, { name: string }[]> = {};
      for (const country of rawCountries) {
        citiesByCountryName[country.name] = City.getCitiesOfCountry(country.isoCode) ?? [];
      }
      return buildLocationIndex(rawCountries, citiesByCountryName);
    });
  }
  return indexPromise;
}

/**
 * React hook: resolves the location index asynchronously; returns null until
 * the (lazy) dataset chunk has loaded.
 */
export function useLocations(): LocationIndex | null {
  const [index, setIndex] = useState<LocationIndex | null>(null);
  useEffect(() => {
    let cancelled = false;
    loadLocationIndex()
      .then((idx) => {
        if (!cancelled) setIndex(idx);
      })
      .catch((e) => {
        console.warn("Failed to load location data", e);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return index;
}

/**
 * Backward-compat helper: when a stored filter/profile value is a legacy
 * free-text entry that no longer exists in the dataset, keep it selectable
 * so the saved value is not silently lost in the <select>.
 */
export function withLegacyOption(options: string[], value: string): string[] {
  if (value && !options.includes(value)) {
    return [...options, value];
  }
  return options;
}
