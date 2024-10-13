import { describe, it, expect, vi } from "vitest";
import { afterEach, beforeEach } from "vitest";
import { makeCaller } from "../../trpc/caller";
import prisma from "../../config/prisma";

// Mock prisma
vi.mock("../../config/prisma", () => ({
  default: {
    store: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe("Stores Router Tests", () => {
  const caller = makeCaller();
  const fixedDate = new Date("2020-01-01T00:00:00Z");
  const laterDate = new Date("2029-12-12T00:00:00Z");
  const testStore = {
    id: "XXX",
    name: "Test Store",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should fetch one store", async () => {
    const mockStore = {
      ...testStore,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    };
    vi.mocked(prisma.store.findUnique).mockResolvedValue(mockStore);

    const store = await caller.stores.one({ id: "XXX" });
    expect(store).toEqual(expect.objectContaining(mockStore));
    expect(store?.createdAt).toEqual(fixedDate);
    expect(store).not.null;
    expect(prisma.store.findUnique).toHaveBeenCalledWith({ where: { id: "XXX" } });
  });

  it("should fetch all stores", async () => {
    const mockStores = [
      { ...testStore, id: "XX1", createdAt: fixedDate, updatedAt: fixedDate },
      { ...testStore, id: "XX2", createdAt: fixedDate, updatedAt: fixedDate },
    ];
    vi.mocked(prisma.store.findMany).mockResolvedValue(mockStores);

    const stores = await caller.stores.all();
    expect(stores).toHaveLength(2);
    stores.forEach(store => {
      expect(store).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        })
      );
    });
    expect(prisma.store.findMany).toHaveBeenCalled();
  });

  it("should create a store", async () => {
    const data = { ...testStore };
    const result = { ...testStore, createdAt: fixedDate, updatedAt: fixedDate };
    vi.mocked(prisma.store.create).mockResolvedValue(result);
    const store = await caller.stores.create(data);
    expect(prisma.store.create).toHaveBeenCalledWith({ data });
    expect(store).toEqual(result);
  });

  it("should delete a store", async () => {
    const deletedStore = {
      ...testStore,
      createdAt: fixedDate,
      updatedAt: fixedDate,
    };
    vi.mocked(prisma.store.delete).mockResolvedValue(deletedStore);
    const store = await caller.stores.delete({ id: deletedStore.id });
    expect(prisma.store.delete).toHaveBeenCalledWith({ where: { id: deletedStore.id } });
    expect(store).toEqual(deletedStore);
  });

  it("should update a store", async () => {
    const id = testStore.id;
    const data = {
      name: testStore.name,
    };
    const updatedStore = {
      id,
      ...data,
      createdAt: fixedDate,
      updatedAt: laterDate,
    };

    vi.mocked(prisma.store.update).mockResolvedValue(updatedStore);

    const store = await caller.stores.update({ id, ...data });
    expect(store).toEqual(expect.objectContaining(updatedStore));
    expect(prisma.store.update).toHaveBeenCalledWith({
      where: { id },
      data,
    });
    expect(store.updatedAt > store.createdAt).toBe(true);
  });
});
