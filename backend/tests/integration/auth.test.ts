import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { signAccessToken } from "../../src/utils/tokens.utils.js";

describe("Auth Endpoints Integration Tests", () => {
    let csrfToken: string;
    let csrfCookie: string;

    beforeEach(async () => {
        const csrfResponse = await request(app).get("/api/auth/csrf-token");
        csrfToken = csrfResponse.body.csrfToken;
        const cookies = csrfResponse.get("Set-Cookie") || [];
        csrfCookie = cookies.find((c: string) => c.includes("x-csrf-token")) || "";
    });

    describe("CSRF Protection Security Tests", () => {
        it("should return a valid CSRF token on GET /api/auth/csrf-token", async () => {
            expect(csrfToken).toBeDefined();
            expect(typeof csrfToken).toBe("string");
            expect(csrfCookie).not.toBe("");
        });

        it("should REJECT state-changing POST requests missing CSRF header with 403", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    email: "test@example.com",
                    password: "Password123!",
                });

            expect(response.status).toBe(403);
        });

        it("should ACCEPT state-changing POST requests when valid CSRF header and cookie are present", async () => {
            const response = await request(app)
                .post("/api/auth/login")
                .set("Cookie", [csrfCookie])
                .set("x-csrf-token", csrfToken)
                .send({
                    email: "nonexistent_user_999@example.com",
                    password: "RandomPassword123!",
                });

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty("status", "error");
        });
    });

    describe("GET /api/auth/me Protected Route Middleware", () => {
        it("should reject request missing Authorization header with 401", async () => {
            const response = await request(app).get("/api/auth/me");

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("status", "failed");
            expect(response.body.message).toMatch(/Unauthorized/i);
        });

        it("should reject request with invalid/malformed token with 401", async () => {
            const response = await request(app)
                .get("/api/auth/me")
                .set("Authorization", "Bearer invalid.jwt.token");

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("status", "failed");
        });

        it("should return 404 when access token belongs to non-existent database user", async () => {
            const validToken = signAccessToken({ userId: 999999, role: "USER" });

            const response = await request(app)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${validToken}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty("status", "failed");
            expect(response.body.message).toMatch(/User not found/i);
        });
    });
});
