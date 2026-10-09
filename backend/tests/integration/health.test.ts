import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Health Check API Integration Test", () => {
    it("GET /health should return 200 OK with status ok", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: "ok",
            message: "This is health page",
        });
    });

    it("GET /non-existent-route should return 404 Not Found", async () => {
        const response = await request(app).get("/api/invalid-route-xyz");

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty("status", "fail");
    });
});
