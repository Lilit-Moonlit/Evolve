import { describe, expect, it } from "vitest";
import { buildLocationIndex, withLegacyOption } from "../locations";

describe("buildLocationIndex", () => {
  it("sorts countries alphabetically and dedupes", () => {
    const index = buildLocationIndex(
      [{ name: "Ukraine" }, { name: "Poland" }, { name: "Ukraine" }, { name: "" }],
      {},
    );
    expect(index.countries).toEqual(["Poland", "Ukraine"]);
  });

  it("returns sorted, deduped cities for a known country", () => {
    const index = buildLocationIndex([{ name: "Ukraine" }], {
      Ukraine: [{ name: "Kyiv" }, { name: "Lviv" }, { name: "Kyiv" }],
    });
    expect(index.citiesFor("Ukraine")).toEqual(["Kyiv", "Lviv"]);
  });

  it("returns an empty city list for an unknown country", () => {
    const index = buildLocationIndex([{ name: "Ukraine" }], {
      Ukraine: [{ name: "Kyiv" }],
    });
    expect(index.citiesFor("Germany")).toEqual([]);
  });

  it("handles empty input", () => {
    const index = buildLocationIndex([], {});
    expect(index.countries).toEqual([]);
    expect(index.citiesFor("Ukraine")).toEqual([]);
  });

  it("drops empty city names", () => {
    const index = buildLocationIndex([{ name: "Ukraine" }], {
      Ukraine: [{ name: "" }, { name: "Kyiv" }],
    });
    expect(index.citiesFor("Ukraine")).toEqual(["Kyiv"]);
  });
});

describe("withLegacyOption", () => {
  it("appends a legacy free-text value missing from the dataset", () => {
    expect(withLegacyOption(["Kyiv", "Lviv"], "Советск")).toEqual(["Kyiv", "Lviv", "Советск"]);
  });

  it("does not duplicate a value already present", () => {
    expect(withLegacyOption(["Kyiv", "Lviv"], "Kyiv")).toEqual(["Kyiv", "Lviv"]);
  });

  it("returns options unchanged for an empty value", () => {
    expect(withLegacyOption(["Kyiv"], "")).toEqual(["Kyiv"]);
  });
});
