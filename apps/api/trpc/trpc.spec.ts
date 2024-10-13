import { describe, it, expect } from "vitest";
import { makeCaller } from "./caller";

describe("TRPC Tests", () => {
  it("should play ping pong", async () => {
    const caller = makeCaller();
    const pong = await caller.test.ping({ ping: "ping" });
    expect(pong).toBe("pong");
  });
});
