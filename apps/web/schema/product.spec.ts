import { describe, it, expect } from "vitest";
import { faker } from "@faker-js/faker";
import {
  productSchema,
  productIDSchema,
  existingProductSchema,
} from "./product";

describe("Product Schema", () => {
  describe("productSchema", () => {
    it("should validate a valid product", () => {
      const validProduct = {
        id: faker.number.int(),
        sku: faker.string.alphanumeric(10),
        quantity: faker.number.int({ min: 0, max: 1000 }),
        description: faker.commerce.productName().slice(0, 30),
      };
      const result = productSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it("should coerce string id to number", () => {
      const product = {
        id: "123",
        description: "Valid Description",
      };
      const result = productSchema.parse(product);
      expect(result.id).toBe(123);
    });

    it("should coerce string quantity to number", () => {
      const product = {
        quantity: "50",
        description: "Valid Description",
      };
      const result = productSchema.parse(product);
      expect(result.quantity).toBe(50);
    });

    it("should allow optional fields", () => {
      const product = {
        description: "Valid Description",
      };
      const result = productSchema.safeParse(product);
      expect(result.success).toBe(true);
    });

    it("should require description", () => {
      const product = {
        id: 1,
        sku: "SKU123",
      };
      const result = productSchema.safeParse(product);
      expect(result.success).toBe(false);
    });

    it("should validate description length", () => {
      const tooShortDescription = {
        description: "",
      };
      const tooLongDescription = {
        description: "a".repeat(31),
      };

      expect(productSchema.safeParse(tooShortDescription).success).toBe(false);
      expect(productSchema.safeParse(tooLongDescription).success).toBe(false);
    });

    it("should provide correct error messages for invalid description", () => {
      const tooShortDescription = {
        description: "",
      };
      const tooLongDescription = {
        description: "a".repeat(31),
      };

      const shortResult = productSchema.safeParse(tooShortDescription);
      const longResult = productSchema.safeParse(tooLongDescription);

      if (!shortResult.success) {
        expect(shortResult.error.issues[0].message).toBe("Required");
      }
      if (!longResult.success) {
        expect(longResult.error.issues[0].message).toBe(
          "Name should be less than 30 characters",
        );
      }
    });
  });

  describe("productIDSchema", () => {
    it("should validate a valid product ID", () => {
      const validID = { id: 123 };
      const result = productIDSchema.safeParse(validID);
      expect(result.success).toBe(true);
    });

    it("should coerce string ID to number", () => {
      const stringID = { id: "456" };
      const result = productIDSchema.parse(stringID);
      expect(result.id).toBe(456);
    });

    it("should reject non-numeric ID", () => {
      const invalidID = { id: "abc" };
      const result = productIDSchema.safeParse(invalidID);
      expect(result.success).toBe(false);
    });
  });

  describe("existingProductSchema", () => {
    it("should validate a valid existing product", () => {
      const validExistingProduct = {
        id: faker.number.int(),
        sku: faker.string.alphanumeric(10),
        quantity: faker.number.int({ min: 0, max: 1000 }),
        description: faker.commerce.productName().slice(0, 30),
      };
      const result = existingProductSchema.safeParse(validExistingProduct);
      expect(result.success).toBe(true);
    });

    it("should require id for existing product", () => {
      const productWithoutId = {
        sku: "SKU123",
        description: "Valid Description",
      };
      const result = existingProductSchema.safeParse(productWithoutId);
      expect(result.success).toBe(false);
    });

    it("should inherit validation rules from productSchema", () => {
      const invalidProduct = {
        id: 1,
        description: "", // Invalid: too short
      };
      const result = existingProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });
});
