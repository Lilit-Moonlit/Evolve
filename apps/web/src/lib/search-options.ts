/**
 * Shared option lists for search filters (Home) and profile editors
 * (Profile). Values are i18n suffixes under the `filters.*` namespace.
 */

export const SKIN_COLOR_OPTIONS = ["fair", "light", "medium", "tan", "dark", "deep"];
export const EYE_COLOR_OPTIONS = ["brown", "blue", "green", "hazel", "gray", "black"];
export const HAIR_COLOR_OPTIONS = ["black", "brown", "blonde", "red", "gray", "white", "bald"];
export const BODY_TYPE_OPTIONS = ["slim", "athletic", "average", "curvy", "muscular", "large"];

/** Search target — first Home filter: partner (man/woman) or a laboratory. */
export const SEARCH_TARGET_OPTIONS = ["man", "woman", "laboratory"] as const;
export type SearchTarget = (typeof SEARCH_TARGET_OPTIONS)[number];

/** Chip-select options with i18n label keys (for the Profile editor). */
export const chipOptions = (values: string[], labelPrefix: string) =>
  values.map((value) => ({ value, labelKey: `${labelPrefix}.${value}` }));
