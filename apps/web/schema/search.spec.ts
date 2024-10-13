import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";
import { searchInput as schema, searchProps } from "./search"; // Adjust import path as needed

describe("searchInput - test the schema that validates user input for searching", () => {
  it("should return default values when no input is provided", () => {
    const result = schema.parse({});
    expect(result).toEqual({ page: 1, limit: 10 });
  });

  it("should parse valid values for page, limit, and keyword", () => {
    const page = faker.number.int({ min: 0, max: 1000 });
    const limit = faker.number.int({ min: 10, max: 500 });
    const keyword = faker.word.sample();
    const result = schema.parse({ page, limit, keyword });
    expect(result).toEqual({ page, limit, keyword });
  });

  it("should coerce string values to numbers for page and limit", () => {
    const result = schema.parse({ page: "3", limit: "100" });
    expect(result).toEqual({ page: 3, limit: 100 });
  });

  it("should apply the default value for page if it is missing", () => {
    const limit = faker.number.int({ min: 10, max: 500 });
    const result = schema.parse({ limit });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(limit);
    expect(result).not.toHaveProperty("keyword");
  });

  it("should apply the default value for limit if it is missing", () => {
    const page = faker.number.int({ min: 0, max: 1000 });
    const result = schema.parse({ page });
    expect(result.page).toBe(page);
    expect(result.limit).toBe(10);
    expect(result).not.toHaveProperty("keyword");
  });

  it("should throw an error if limit is less than 10", () => {
    expect(() => schema.parse({ limit: 9 })).toThrow("Must be >= 10");
  });

  it("should throw an error if limit is greater than 500", () => {
    expect(() => schema.parse({ limit: 501 })).toThrow("Must be <= 500");
  });

  it("should handle floating point numbers by rounding down", () => {
    const result = schema.parse({ page: 2.7, limit: 15.3 });
    expect(result).toEqual({ page: 2, limit: 15 });
  });

  it("should pass for edge cases", () => {
    const edgeCases = [
      { page: 0, limit: 10 },
      { page: 0, limit: 500 },
      { page: Number.MAX_SAFE_INTEGER, limit: 10 },
    ];
    edgeCases.forEach((input) => {
      const result = schema.parse(input);
      expect(result).toEqual(input);
      expect(result).not.toHaveProperty("keyword");
    });
  });

  it("should handle undefined keyword by not including it in the result", () => {
    const result = schema.parse({});
    expect(result).not.toHaveProperty("keyword");
  });

  it("should handle empty string keyword", () => {
    const result = schema.parse({ keyword: "" });
    expect(result.keyword).toBe("");
  });

  it("should include keyword when provided", () => {
    const keyword = faker.word.sample();
    const result = schema.parse({ keyword });
    expect(result.keyword).toBe(keyword);
  });
});

describe("searchProps - test the parsed/sanitised/modified result of search input", () => {
  it("should calculate correct offset for page 1 and default limit", () => {
    const result = searchProps.parse({ page: 1 });
    expect(result).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  it("should calculate correct offset for page 2 and default limit", () => {
    const result = searchProps.parse({ page: 2 });
    expect(result).toEqual({ page: 2, limit: 10, offset: 10 });
  });

  it("should calculate correct offset for custom page and limit", () => {
    const result = searchProps.parse({ page: 3, limit: 20 });
    expect(result).toEqual({ page: 3, limit: 20, offset: 40 });
  });

  it("should handle page 0 correctly", () => {
    const result = searchProps.parse({ page: 0, limit: 15 });
    expect(result).toEqual({ page: 0, limit: 15, offset: -15 });
  });

  it("should use default values and calculate offset correctly when no input is provided", () => {
    const result = searchProps.parse({});
    expect(result).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  it("should handle maximum allowed limit correctly", () => {
    const result = searchProps.parse({ page: 2, limit: 500 });
    expect(result).toEqual({ page: 2, limit: 500, offset: 500 });
  });

  it("should handle large page numbers correctly", () => {
    const largePage = faker.number.int({ min: 1000, max: 10000 });
    const result = searchProps.parse({ page: largePage, limit: 50 });
    expect(result).toEqual({
      page: largePage,
      limit: 50,
      offset: (largePage - 1) * 50,
    });
  });

  it("should round down floating point page numbers", () => {
    const result = searchProps.parse({ page: 3.7, limit: 15 });
    expect(result).toEqual({ page: 3, limit: 15, offset: 30 });
  });

  it("should round down floating point limit numbers and calculate offset correctly", () => {
    const result = searchProps.parse({ page: 2, limit: 25.8 });
    expect(result).toEqual({ page: 2, limit: 25, offset: 25 });
  });

  it("should include keyword in the result if provided", () => {
    const keyword = faker.word.sample();
    const result = searchProps.parse({ page: 1, limit: 20, keyword });
    expect(result).toEqual({ page: 1, limit: 20, offset: 0, keyword });
  });

  it("should handle coerced string inputs for page and limit", () => {
    const result = searchProps.parse({ page: "4", limit: "30" });
    expect(result).toEqual({ page: 4, limit: 30, offset: 90 });
  });

  it("should throw an error for invalid limit", () => {
    expect(() => searchProps.parse({ page: 1, limit: 5 })).toThrow(
      "Must be >= 10",
    );
    expect(() => searchProps.parse({ page: 1, limit: 501 })).toThrow(
      "Must be <= 500",
    );
  });
});
