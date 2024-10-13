import { describe, it, expect } from "vitest";
import { makeCaller } from "../../trpc/caller";

describe("TRPC Tests", () => {
  it("should play ping pong", async () => {
    const caller = makeCaller();
    const pong = await caller.test.ping({ ping: "ping" });
    expect(pong).toBe("pong");
  });
  it("should should throw and catch errors", async () => {
    const caller = makeCaller();
    await expect(() => caller.test.error()).rejects.toThrow();
  });
});
