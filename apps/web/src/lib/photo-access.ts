/**
 * Photo privacy helpers for Evolve.
 *
 * A profile photo can be marked as "blurred". A viewer can see the unblurred
 * photo only when the owner granted access:
 *   - temporary: visible for TEMP_PHOTO_VIEW_MS (15 s), then blurred again
 *   - permanent: visible forever (owner may revoke)
 *
 * Grants are stored on the OWNER's profile under `photoGrants`, keyed by the
 * viewer's user id.
 */

export type PhotoGrantKind = "temporary" | "permanent";

export interface PhotoGrant {
  kind: PhotoGrantKind;
  grantedAt: number;
  /** Present only for temporary grants. */
  expiresAt?: number;
}

/** Grants map keyed by viewer user id. */
export type PhotoGrants = Record<string, PhotoGrant>;

export interface PhotoAccessProfile {
  photoBlurred?: boolean;
  photoGrants?: PhotoGrants;
}

/** Duration of a temporary photo view, in milliseconds (15 s). */
export const TEMP_PHOTO_VIEW_MS = 15_000;

/**
 * Whether `viewerId` may currently see the unblurred photo.
 * Non-blurred photos are always visible.
 */
export function canViewPhoto(
  profile: PhotoAccessProfile | undefined | null,
  viewerId: string | undefined,
  now: number = Date.now(),
): boolean {
  if (!profile?.photoBlurred) return true;
  if (!viewerId) return false;
  const grant = profile.photoGrants?.[viewerId];
  if (!grant) return false;
  if (grant.kind === "permanent") return true;
  if (grant.kind === "temporary" && grant.expiresAt && grant.expiresAt > now) {
    return true;
  }
  return false;
}

/**
 * Remaining milliseconds of a temporary grant for `viewerId`.
 * Returns 0 when there is no active temporary grant.
 */
export function temporaryRemainingMs(
  profile: PhotoAccessProfile | undefined | null,
  viewerId: string | undefined,
  now: number = Date.now(),
): number {
  if (!profile?.photoBlurred || !viewerId) return 0;
  const grant = profile.photoGrants?.[viewerId];
  if (!grant || grant.kind !== "temporary" || !grant.expiresAt) return 0;
  const remaining = grant.expiresAt - now;
  return remaining > 0 ? remaining : 0;
}

/** Adds (or refreshes) a photo grant for `viewerId`. Returns a new grants map. */
export function grantPhotoAccess(
  grants: PhotoGrants | undefined,
  viewerId: string,
  kind: PhotoGrantKind,
  now: number = Date.now(),
): PhotoGrants {
  const next: PhotoGrants = { ...(grants || {}) };
  next[viewerId] = {
    kind,
    grantedAt: now,
    expiresAt: kind === "temporary" ? now + TEMP_PHOTO_VIEW_MS : undefined,
  };
  return next;
}

/** Removes any photo grant for `viewerId`. Returns a new grants map. */
export function revokePhotoAccess(grants: PhotoGrants | undefined, viewerId: string): PhotoGrants {
  const next: PhotoGrants = { ...(grants || {}) };
  delete next[viewerId];
  return next;
}

/** Human-friendly kind label (used for tests + UI metadata). */
export function photoGrantLabel(grant: PhotoGrant | undefined): "none" | PhotoGrantKind {
  if (!grant) return "none";
  return grant.kind;
}
