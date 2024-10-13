import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";
import { storeSchema, storeIDSchema, existingStoreSchema } from "./store";

describe("Store Schema", () => {
  describe("storeSchema", () => {
    it("should validate a valid store", () => {
      const validStore = {
        id: faker.string.uuid(),
        name: faker.company.name().slice(0, 30),
      };
      const result = storeSchema.safeParse(validStore);
      expect(result.success).toBe(true);
    });

    it("should require id", () => {
      const storeWithoutId = {
        name: faker.company.name().slice(0, 30),
      };
      const result = storeSchema.safeParse(storeWithoutId);
      expect(result.success).toBe(false);
    });

    it("should require name", () => {
      const storeWithoutName = {
        id: faker.string.uuid(),
      };
      const result = storeSchema.safeParse(storeWithoutName);
      expect(result.success).toBe(false);
    });

    it("should validate name length", () => {
      const tooShortName = {
        id: faker.string.uuid(),
        name: "",
      };
      const tooLongName = {
        id: faker.string.uuid(),
        name: "a".repeat(31),
      };

      expect(storeSchema.safeParse(tooShortName).success).toBe(false);
      expect(storeSchema.safeParse(tooLongName).success).toBe(false);
    });

    it("should provide correct error messages for invalid name", () => {
      const tooShortName = {
        id: faker.string.uuid(),
        name: "",
      };
      const tooLongName = {
        id: faker.string.uuid(),
        name: "a".repeat(31),
      };

      const shortResult = storeSchema.safeParse(tooShortName);
      const longResult = storeSchema.safeParse(tooLongName);

      if (!shortResult.success) {
        expect(shortResult?.error?.errors[0]?.message).toBe("Required");
      }
      if (!longResult.success) {
        expect(longResult?.error?.errors[0]?.message).toBe(
          "Name should be less than 30 characters",
        );
      }
    });
  });

  describe("storeIDSchema", () => {
    it("should validate a valid store ID", () => {
      const validID = { id: faker.string.uuid() };
      const result = storeIDSchema.safeParse(validID);
      expect(result.success).toBe(true);
    });

    it("should reject non-string ID", () => {
      const invalidID = { id: 123 };
      const result = storeIDSchema.safeParse(invalidID);
      expect(result.success).toBe(false);
    });

    it("should reject missing ID", () => {
      const missingID = {};
      const result = storeIDSchema.safeParse(missingID);
      expect(result.success).toBe(false);
    });
  });

  describe("existingStoreSchema", () => {
    it("should validate a valid existing store", () => {
      const validExistingStore = {
        id: faker.string.uuid(),
        name: faker.company.name().slice(0, 30),
      };
      const result = existingStoreSchema.safeParse(validExistingStore);
      expect(result.success).toBe(true);
    });

    it("should require id for existing store", () => {
      const storeWithoutId = {
        name: faker.company.name().slice(0, 30),
      };
      const result = existingStoreSchema.safeParse(storeWithoutId);
      expect(result.success).toBe(false);
    });

    it("should inherit validation rules from storeSchema", () => {
      const invalidStore = {
        id: faker.string.uuid(),
        name: "", // Invalid: too short
      };
      const result = existingStoreSchema.safeParse(invalidStore);
      expect(result.success).toBe(false);
    });

    it("should allow additional properties", () => {
      const storeWithAdditionalProps = {
        id: faker.string.uuid(),
        name: faker.company.name().slice(0, 30),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = existingStoreSchema.safeParse(storeWithAdditionalProps);
      expect(result.success).toBe(true);
    });
  });
});
