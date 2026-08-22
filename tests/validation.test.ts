import { describe, expect, it } from "vitest";
import {
  normalizeProjectName,
  validateProjectName,
} from "../src/utils/validation.js";

describe("project name normalization", () => {
  it("converts display-style names into valid package names", () => {
    expect(normalizeProjectName("SuperBlackCoffee")).toBe("superblackcoffee");
    expect(normalizeProjectName("Super Black Coffee")).toBe(
      "super-black-coffee"
    );
    expect(normalizeProjectName("Super.Black/Coffee!")).toBe(
      "super-black-coffee"
    );
  });

  it("validates the normalized project name", () => {
    expect(validateProjectName(normalizeProjectName("SuperBlackCoffee"))).toBe(
      true
    );
  });
});
