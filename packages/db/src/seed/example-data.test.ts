import { describe, it, expect } from "vitest";

import { itemStatusSchema } from "@repo/types";

import { exampleItems, fallbackItems } from "./example-data";

describe("fallbackItems", () => {
  it("returns a stable length matching the example seed", () => {
    expect(fallbackItems()).toHaveLength(exampleItems.length);
  });

  it("returns a fresh array on every call (no shared mutable state)", () => {
    expect(fallbackItems()).not.toBe(fallbackItems());
    expect(fallbackItems()).toEqual(fallbackItems());
  });

  it("emits ISO 8601 date strings for createdAt and updatedAt", () => {
    for (const item of fallbackItems()) {
      expect(typeof item.createdAt).toBe("string");
      expect(typeof item.updatedAt).toBe("string");
      // Round-trips through Date without becoming Invalid Date.
      expect(new Date(item.createdAt).toISOString()).toBe(item.createdAt);
      expect(new Date(item.updatedAt).toISOString()).toBe(item.updatedAt);
    }
  });

  it("assigns unique ids", () => {
    const ids = fallbackItems().map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only valid item statuses", () => {
    for (const item of fallbackItems()) {
      expect(itemStatusSchema.safeParse(item.status).success).toBe(true);
    }
  });

  it("carries the seeded titles through unchanged", () => {
    const titles = fallbackItems().map((item) => item.title);
    expect(titles).toContain("Welcome to your internal tool");
    expect(titles).toEqual(exampleItems.map((item) => item.title));
  });

  it("leaves owner fields null in the DB-less fallback", () => {
    for (const item of fallbackItems()) {
      expect(item.ownerId).toBeNull();
      expect(item.ownerName).toBeNull();
    }
  });
});
