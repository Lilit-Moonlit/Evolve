import { describe, it, expect } from "vitest";
import {
  canViewPhoto,
  grantPhotoAccess,
  revokePhotoAccess,
  temporaryRemainingMs,
  TEMP_PHOTO_VIEW_MS,
  photoGrantLabel,
  PhotoGrants,
} from "./photo-access";

const NOW = 1_000_000;

describe("canViewPhoto", () => {
  it("shows non-blurred photos to everyone", () => {
    expect(canViewPhoto({ photoBlurred: false }, "viewer", NOW)).toBe(true);
    expect(canViewPhoto({}, "viewer", NOW)).toBe(true);
    expect(canViewPhoto(undefined, "viewer", NOW)).toBe(true);
  });

  it("hides blurred photos without a grant", () => {
    const profile = { photoBlurred: true, photoGrants: {} as PhotoGrants };
    expect(canViewPhoto(profile, "viewer", NOW)).toBe(false);
    expect(canViewPhoto(profile, undefined, NOW)).toBe(false);
  });

  it("shows blurred photos with a permanent grant", () => {
    const grants = grantPhotoAccess(undefined, "viewer", "permanent", NOW);
    expect(canViewPhoto({ photoBlurred: true, photoGrants: grants }, "viewer", NOW)).toBe(true);
  });

  it("shows blurred photos only while a temporary grant is active", () => {
    const grants = grantPhotoAccess(undefined, "viewer", "temporary", NOW);
    const profile = { photoBlurred: true, photoGrants: grants };
    expect(canViewPhoto(profile, "viewer", NOW + TEMP_PHOTO_VIEW_MS - 1)).toBe(true);
    expect(canViewPhoto(profile, "viewer", NOW + TEMP_PHOTO_VIEW_MS + 1)).toBe(false);
  });

  it("keeps grants scoped per viewer", () => {
    const grants = grantPhotoAccess(undefined, "alice", "permanent", NOW);
    const profile = { photoBlurred: true, photoGrants: grants };
    expect(canViewPhoto(profile, "bob", NOW)).toBe(false);
  });
});

describe("grantPhotoAccess", () => {
  it("adds a permanent grant without expiry", () => {
    const grants = grantPhotoAccess(undefined, "viewer", "permanent", NOW);
    expect(grants.viewer).toEqual({
      kind: "permanent",
      grantedAt: NOW,
      expiresAt: undefined,
    });
  });

  it("adds a temporary grant with 15s expiry", () => {
    const grants = grantPhotoAccess(undefined, "viewer", "temporary", NOW);
    expect(grants.viewer.kind).toBe("temporary");
    expect(grants.viewer.expiresAt).toBe(NOW + TEMP_PHOTO_VIEW_MS);
  });

  it("merges into existing grants", () => {
    const base = grantPhotoAccess(undefined, "a", "permanent", NOW);
    const next = grantPhotoAccess(base, "b", "temporary", NOW);
    expect(Object.keys(next).sort()).toEqual(["a", "b"]);
  });

  it("does not mutate the input map", () => {
    const base: PhotoGrants = {};
    const next = grantPhotoAccess(base, "viewer", "permanent", NOW);
    expect(base.viewer).toBeUndefined();
    expect(next.viewer).toBeDefined();
  });
});

describe("revokePhotoAccess", () => {
  it("removes the viewer grant", () => {
    const base = grantPhotoAccess(undefined, "viewer", "permanent", NOW);
    const next = revokePhotoAccess(base, "viewer");
    expect(next.viewer).toBeUndefined();
  });

  it("does not mutate the input map", () => {
    const base = grantPhotoAccess(undefined, "viewer", "permanent", NOW);
    revokePhotoAccess(base, "viewer");
    expect(base.viewer).toBeDefined();
  });
});

describe("temporaryRemainingMs", () => {
  it("returns remaining time for active temporary grants", () => {
    const grants = grantPhotoAccess(undefined, "viewer", "temporary", NOW);
    const profile = { photoBlurred: true, photoGrants: grants };
    expect(temporaryRemainingMs(profile, "viewer", NOW + 5_000)).toBe(TEMP_PHOTO_VIEW_MS - 5_000);
  });

  it("returns 0 after expiry or without a temporary grant", () => {
    const temp = grantPhotoAccess(undefined, "v1", "temporary", NOW);
    const perm = grantPhotoAccess(undefined, "v2", "permanent", NOW);
    expect(
      temporaryRemainingMs(
        { photoBlurred: true, photoGrants: temp },
        "v1",
        NOW + TEMP_PHOTO_VIEW_MS,
      ),
    ).toBe(0);
    expect(temporaryRemainingMs({ photoBlurred: true, photoGrants: perm }, "v2", NOW)).toBe(0);
  });
});

describe("photoGrantLabel", () => {
  it("returns kind or none", () => {
    expect(photoGrantLabel(undefined)).toBe("none");
    expect(photoGrantLabel({ kind: "temporary", grantedAt: 1 })).toBe("temporary");
    expect(photoGrantLabel({ kind: "permanent", grantedAt: 1 })).toBe("permanent");
  });
});
