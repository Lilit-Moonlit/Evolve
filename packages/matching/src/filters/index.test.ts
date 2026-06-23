/**
 * Tests for matching filters
 */

import type { MatchingProfile, MatchFilter } from "../types";
import {
  filterByDistance,
  filterByAge,
  filterByGender,
  filterByInterests,
  excludeIds,
  applyFilters,
  sortByDistance,
  sortByAge,
  sortByInterests,
} from "./index";

describe("Matching Filters", () => {
  const mockProfiles: MatchingProfile[] = [
    {
      userId: "user1",
      age: 25,
      gender: "male",
      location: { lat: 40.7128, lon: -74.006 },
      interests: ["Music", "Sports"],
    },
    {
      userId: "user2",
      age: 30,
      gender: "female",
      location: { lat: 40.7128, lon: -74.006 },
      interests: ["Music", "Art"],
    },
    {
      userId: "user3",
      age: 35,
      gender: "male",
      location: { lat: 41.8781, lon: -87.6298 },
      interests: ["Travel", "Food"],
    },
  ];

  describe("filterByDistance", () => {
    it("should filter profiles within max distance", () => {
      const centerLocation = { lat: 40.7128, lon: -74.006 };
      const filtered = filterByDistance(mockProfiles, centerLocation, 10);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((p) => p.userId !== "user3")).toBe(true);
    });

    it("should return all profiles if max distance is large", () => {
      const centerLocation = { lat: 40.7128, lon: -74.006 };
      const filtered = filterByDistance(mockProfiles, centerLocation, 10000);
      expect(filtered).toHaveLength(3);
    });

    it("should handle profiles without location", () => {
      const profilesWithoutLocation: MatchingProfile[] = [
        { userId: "user4", age: 25, interests: ["Music"] },
      ];
      const centerLocation = { lat: 40.7128, lon: -74.006 };
      const filtered = filterByDistance(
        profilesWithoutLocation,
        centerLocation,
        10,
      );
      expect(filtered).toHaveLength(0);
    });
  });

  describe("filterByAge", () => {
    it("should filter profiles by age range", () => {
      const filtered = filterByAge(mockProfiles, 25, 30);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((p) => p.age >= 25 && p.age <= 30)).toBe(true);
    });

    it("should filter by min age only", () => {
      const filtered = filterByAge(mockProfiles, 30);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((p) => p.age >= 30)).toBe(true);
    });

    it("should filter by max age only", () => {
      const filtered = filterByAge(mockProfiles, undefined, 30);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((p) => p.age <= 30)).toBe(true);
    });

    it("should return all profiles if no age constraints", () => {
      const filtered = filterByAge(mockProfiles);
      expect(filtered).toHaveLength(3);
    });
  });

  describe("filterByGender", () => {
    it("should filter profiles by gender", () => {
      const filtered = filterByGender(mockProfiles, "male");
      expect(filtered).toHaveLength(2);
      expect(filtered.every((p) => p.gender === "male")).toBe(true);
    });

    it("should return all profiles if no gender specified", () => {
      const filtered = filterByGender(mockProfiles);
      expect(filtered).toHaveLength(3);
    });
  });

  describe("filterByInterests", () => {
    it("should filter profiles by required interests", () => {
      const filtered = filterByInterests(mockProfiles, ["Music"], 1);
      expect(filtered).toHaveLength(2);
      expect(filtered.every((p) => p.interests.includes("Music"))).toBe(true);
    });

    it("should filter by minimum match count", () => {
      const filtered = filterByInterests(mockProfiles, ["Music", "Sports"], 2);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].userId).toBe("user1");
    });

    it("should return all profiles if no interests specified", () => {
      const filtered = filterByInterests(mockProfiles, []);
      expect(filtered).toHaveLength(3);
    });
  });

  describe("excludeIds", () => {
    it("should exclude specified user IDs", () => {
      const filtered = excludeIds(mockProfiles, ["user1", "user2"]);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].userId).toBe("user3");
    });

    it("should return all profiles if no IDs to exclude", () => {
      const filtered = excludeIds(mockProfiles, []);
      expect(filtered).toHaveLength(3);
    });
  });

  describe("applyFilters", () => {
    it("should apply all filters", () => {
      const filter: MatchFilter = {
        minAge: 25,
        maxAge: 30,
        gender: "male",
        maxDistance: 10,
        interests: ["Music"],
      };
      const centerLocation = { lat: 40.7128, lon: -74.006 };
      const filtered = applyFilters(mockProfiles, filter, centerLocation);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].userId).toBe("user1");
    });

    it("should handle empty filter", () => {
      const filter: MatchFilter = {};
      const filtered = applyFilters(mockProfiles, filter);
      expect(filtered).toHaveLength(3);
    });
  });

  describe("sortByDistance", () => {
    it("should sort profiles by distance", () => {
      const centerLocation = { lat: 40.7128, lon: -74.006 };
      const sorted = sortByDistance(mockProfiles, centerLocation);
      expect(sorted[0].userId).toBe("user1");
      expect(sorted[1].userId).toBe("user2");
      expect(sorted[2].userId).toBe("user3");
    });

    it("should handle profiles without location", () => {
      const profilesWithoutLocation: MatchingProfile[] = [
        { userId: "user4", age: 25, interests: ["Music"] },
        ...mockProfiles,
      ];
      const centerLocation = { lat: 40.7128, lon: -74.006 };
      const sorted = sortByDistance(profilesWithoutLocation, centerLocation);
      expect(sorted[sorted.length - 1].userId).toBe("user4");
    });
  });

  describe("sortByAge", () => {
    it("should sort profiles by age ascending", () => {
      const sorted = sortByAge(mockProfiles, "asc");
      expect(sorted[0].age).toBe(25);
      expect(sorted[1].age).toBe(30);
      expect(sorted[2].age).toBe(35);
    });

    it("should sort profiles by age descending", () => {
      const sorted = sortByAge(mockProfiles, "desc");
      expect(sorted[0].age).toBe(35);
      expect(sorted[1].age).toBe(30);
      expect(sorted[2].age).toBe(25);
    });
  });

  describe("sortByInterests", () => {
    it("should sort profiles by number of matching interests", () => {
      const targetInterests = ["Music", "Sports"];
      const sorted = sortByInterests(mockProfiles, targetInterests, "desc");
      expect(sorted[0].userId).toBe("user1");
      expect(sorted[1].userId).toBe("user2");
    });

    it("should sort ascending when specified", () => {
      const targetInterests = ["Music", "Sports"];
      const sorted = sortByInterests(mockProfiles, targetInterests, "asc");
      expect(sorted[sorted.length - 1].userId).toBe("user1");
    });
  });
});
