import { describe, it, expect, vi } from "vitest";
import { afterEach, beforeEach } from "vitest";
import { makeCaller } from "../../trpc/caller";
import prisma from "../../config/prisma";

// Mock prisma
vi.mock("../../config/prisma", () => ({
  default: {
    product: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Products Router Tests", () => {
  const caller = makeCaller();
  const fixedDate = new Date("2020-01-01T00:00:00Z");
  const laterDate = new Date("2029-12-12T00:00:00Z");
  const testProduct = {
    sku: "TEST-SKU",
    quantity: 1,
    description: "Test product",
    storeId: "KEN",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should fetch one product", async () => {
    const mockProduct = {
      id: 1,
      ...testProduct,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    };
    vi.mocked(prisma.product.findUnique).mockResolvedValue(mockProduct);

    const product = await caller.products.one({ id: 1 });
    expect(product).toEqual(
      expect.objectContaining({
        id: 1,
        ...testProduct,
      })
    );
    expect(product?.createdAt).toEqual(fixedDate);
    expect(product).not.null;
    expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it("should fetch all products", async () => {
    const mockProducts = [
      { id: 1, ...testProduct, createdAt: fixedDate, updatedAt: fixedDate },
      { id: 2, ...testProduct, createdAt: fixedDate, updatedAt: fixedDate },
    ];
    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts);

    const products = await caller.products.all();
    expect(products).toHaveLength(2);
    products.forEach(product => {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          sku: expect.any(String),
          description: expect.any(String),
          quantity: expect.any(Number),
        })
      );
    });
    expect(prisma.product.findMany).toHaveBeenCalled();
  });

  it("should create a product", async () => {
    const data = testProduct;
    const result = {
      id: 9,
      ...data,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    };
    vi.mocked(prisma.product.create).mockResolvedValue(result);
    const product = await caller.products.create(data);
    expect(prisma.product.create).toHaveBeenCalledWith({
      data,
    });
    expect(product).toEqual(result);
  });

  it("should delete a product", async () => {
    const deletedProduct = {
      id: 4,
      ...testProduct,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    };
    const { id, ...data } = deletedProduct;
    vi.mocked(prisma.product.delete).mockResolvedValue(deletedProduct);

    const product = await caller.products.delete({ id });
    expect(product).toEqual(deletedProduct);
    expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id } });
  });

  it("should update a product", async () => {
    const id = 5;
    const data = { ...testProduct };
    const update = { id, ...data };
    const result = {
      id,
      ...data,
      createdAt: fixedDate,
      updatedAt: laterDate,
    };

    vi.mocked(prisma.product.update).mockResolvedValue(result);

    const product = await caller.products.update(update);
    expect(product).toEqual(expect.objectContaining(result));
    expect(prisma.product.update).toHaveBeenCalledWith({
      where: { id },
      data,
    });
    expect(product.updatedAt > product.createdAt).toBe(true);
  });
});
