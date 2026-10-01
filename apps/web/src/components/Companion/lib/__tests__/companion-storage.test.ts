import { describe, it, expect, beforeEach } from "vitest";
import {
  clearUserData,
  clearLabData,
  mapLabPatientsToSearchable,
  mapCompanionRecordsToSearchable,
  readLabPatients,
  RawLabPatient,
} from "../companion-storage";

describe("companion-storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("clearUserData removes user/patient keys but keeps language/region/role", () => {
    localStorage.setItem("companion_user_id", "u1");
    localStorage.setItem("user_id", "u1");
    localStorage.setItem("companion_photo", "data:image/png;base64,AAA");
    localStorage.setItem("patient_u1_photo", "data:image/png;base64,BBB");
    localStorage.setItem("companion_role", "user");
    localStorage.setItem("companion_language", "uk");
    localStorage.setItem("companion_region", "UA");

    clearUserData();

    expect(localStorage.getItem("companion_user_id")).toBeNull();
    expect(localStorage.getItem("user_id")).toBeNull();
    expect(localStorage.getItem("companion_photo")).toBeNull();
    expect(localStorage.getItem("patient_u1_photo")).toBeNull();
    expect(localStorage.getItem("companion_role")).toBe("user");
    expect(localStorage.getItem("companion_language")).toBe("uk");
    expect(localStorage.getItem("companion_region")).toBe("UA");
  });

  it("clearLabData removes every lab_* key", () => {
    localStorage.setItem("lab_id", "l1");
    localStorage.setItem("lab_data", "{}");
    localStorage.setItem("lab_patients", "[]");
    localStorage.setItem("lab_l1_patients", "[]");
    localStorage.setItem("companion_role", "lab");

    clearLabData();

    expect(localStorage.getItem("lab_id")).toBeNull();
    expect(localStorage.getItem("lab_data")).toBeNull();
    expect(localStorage.getItem("lab_patients")).toBeNull();
    expect(localStorage.getItem("lab_l1_patients")).toBeNull();
    // Non-lab keys are untouched.
    expect(localStorage.getItem("companion_role")).toBe("lab");
  });

  it("readLabPatients returns [] for missing or invalid JSON", () => {
    expect(readLabPatients()).toEqual([]);
    localStorage.setItem("lab_patients", "not-json");
    expect(readLabPatients()).toEqual([]);
    localStorage.setItem("lab_patients", JSON.stringify({ not: "an array" }));
    expect(readLabPatients()).toEqual([]);
  });

  it("readLabPatients returns parsed array entries", () => {
    localStorage.setItem("lab_patients", JSON.stringify([{ id: "p1" }]));
    expect(readLabPatients()).toEqual([{ id: "p1" }]);
  });

  it("mapLabPatientsToSearchable maps real lab records and drops malformed ones", () => {
    const raw: RawLabPatient[] = [
      {
        id: "p1",
        name: "Patient p1",
        mainPhoto: "photo1",
        verifiedPhotos: [
          { url: "a1", status: "verified" },
          { url: "a2", status: "uncertain" },
        ],
        location: "Kyiv",
        stdCompatible: true,
      },
      { id: "p2" }, // minimal — no photo/location
      null as unknown as RawLabPatient,
    ];

    const result = mapLabPatientsToSearchable(raw);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "p1",
      name: "Patient p1",
      photo: "photo1",
      additionalPhotos: ["a1", "a2"],
      location: "Kyiv",
      stdCompatible: true,
    });
    expect(result[1]).toEqual({
      id: "p2",
      name: "p2",
      photo: null,
      additionalPhotos: [],
      location: null,
      stdCompatible: false,
    });
  });

  it("mapCompanionRecordsToSearchable maps backend patient records", () => {
    const result = mapCompanionRecordsToSearchable([
      {
        id: "p1",
        name: "Alice",
        photo: "data:image/png;base64,AAA",
        additionalPhotos: ["data:image/png;base64,BBB"],
        location: "Lviv",
        stdCompatible: true,
      },
      {
        id: "p2",
        name: null,
        photo: null,
        additionalPhotos: [],
        location: null,
        stdCompatible: false,
      },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      id: "p1",
      name: "Alice",
      photo: "data:image/png;base64,AAA",
      additionalPhotos: ["data:image/png;base64,BBB"],
      location: "Lviv",
      stdCompatible: true,
    });
    expect(result[1].name).toBe("p2");
    expect(result[1].photo).toBeNull();
  });
});
