/**
 * Companion-mode storage helpers.
 *
 * The Companion flow is localStorage-backed (single-device demo): patients
 * register under `companion_user_id`, the lab keeps a per-lab patient list and
 * a global `lab_patients` list, and the WebSocket chat server handles messaging.
 *
 * These helpers centralise the role-scoped cleanup so switching between the
 * "user" and "lab" roles never leaves stale data from the previous role behind.
 */

const USER_PROFILE_KEYS = [
  "companion_user_id",
  "user_id",
  "companion_photo",
  "companion_additional_photos",
  "companion_name",
  "companion_gender",
  "companion_city",
  "companion_email",
];

function removeKeysMatching(predicate: (key: string) => boolean): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && predicate(key)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

/** Remove all patient ("user") data, keeping language/region/role selection. */
export const clearUserData = (): void => {
  USER_PROFILE_KEYS.forEach((key) => localStorage.removeItem(key));
  removeKeysMatching((key) => key.startsWith("patient_"));
};

/** Remove all laboratory data (lab account, patients, results). */
export const clearLabData = (): void => {
  removeKeysMatching((key) => key.startsWith("lab_"));
};

/**
 * A patient as the lab sees them (stored in the global `lab_patients` list by
 * LabVerifyPatient/LabAddResult). Shape is kept loose on read because the list
 * has evolved across versions.
 */
export interface RawLabPatient {
  id?: string;
  name?: string;
  hasResult?: boolean;
  mainPhoto?: string;
  photos?: string[];
  verifiedPhotos?: { url: string; status: string }[];
  location?: string;
  stdCompatible?: boolean;
  testInfo?: string;
  addedAt?: string;
}

/** A searchable partner profile for the patient-facing Search screen. */
export interface SearchablePatient {
  id: string;
  name: string;
  photo: string | null;
  additionalPhotos: string[];
  location: string | null;
  stdCompatible: boolean;
}

/** A patient record as returned by the cross-device backend API. */
export interface CompanionPatientRecord {
  id: string;
  name: string | null;
  photo: string | null;
  additionalPhotos: string[];
  location: string | null;
  stdCompatible: boolean;
}

/** Read the global lab patient list (written by the lab verify/result flow). */
export const readLabPatients = (): RawLabPatient[] => {
  try {
    const raw = localStorage.getItem("lab_patients");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Map the lab's raw patient records into the shape the Search screen renders.
 * Pure (no I/O) so it can be unit-tested against any fixture.
 */
export const mapLabPatientsToSearchable = (raw: RawLabPatient[]): SearchablePatient[] => {
  return raw
    .filter((p): p is RawLabPatient & { id: string } => Boolean(p && p.id))
    .map((p) => ({
      id: p.id,
      name: p.name || p.id,
      photo: p.mainPhoto || null,
      additionalPhotos: (p.verifiedPhotos || [])
        .map((v) => v && v.url)
        .filter((url): url is string => Boolean(url)),
      location: p.location || null,
      stdCompatible: Boolean(p.stdCompatible),
    }));
};

/**
 * Map backend CompanionPatient records (already typed, photos as plain URLs)
 * into the shape the Search screen renders. Pure, for unit testing.
 */
export const mapCompanionRecordsToSearchable = (
  records: CompanionPatientRecord[],
): SearchablePatient[] => {
  return records
    .filter((r) => Boolean(r && r.id))
    .map((r) => ({
      id: r.id,
      name: r.name || r.id,
      photo: r.photo || null,
      additionalPhotos: Array.isArray(r.additionalPhotos) ? r.additionalPhotos : [],
      location: r.location || null,
      stdCompatible: Boolean(r.stdCompatible),
    }));
};
