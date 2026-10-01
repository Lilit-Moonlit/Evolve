/**
 * Photo-verification gating for the lab's patient confirmation screen.
 *
 * A lab worker must make a decision ("Match" / "Uncertain") on EVERY photo —
 * the main profile photo plus every additional photo — before the patient can
 * be confirmed into the lab's list.
 */

export type PhotoDecision = "verified" | "uncertain" | "none";

export interface PhotoEntry {
  url: string;
  status: PhotoDecision;
}

/**
 * True only when a decision has been made for the main photo (if present) and
 * for every additional photo (if any).
 */
export const canConfirmPatient = (
  hasMainPhoto: boolean,
  mainPhotoStatus: PhotoDecision,
  additionalPhotos: PhotoEntry[],
): boolean => {
  if (hasMainPhoto && mainPhotoStatus === "none") return false;
  return additionalPhotos.every((photo) => photo.status !== "none");
};
