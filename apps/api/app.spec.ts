import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import express from "express";

// Import your app
import { createApp } from "./app";

describe("Express App", () => {
  let app: express.Application;

  beforeAll(() => {
    app = createApp();
  });

  it("should start and respond with hello, world!", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toBe("hello, world!");
  });

  it("should return 404 for undefined routes", async () => {
    const response = await request(app).get("/undefined-route");
    expect(response.status).toBe(404);
  });
});
