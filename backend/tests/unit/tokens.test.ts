import { describe, it, expect } from "vitest";
import {
    signAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    generateVerificationToken,
    hashToken,
    signTemp2faToken,
    verifyTemp2faToken,
} from "../../src/utils/tokens.utils.js";

describe("Token Utilities Unit Tests", () => {
    describe("Access Token (JWT)", () => {
        it("should sign and verify a valid access token", () => {
            const payload = { userId: 42, role: "USER" };
            const token = signAccessToken(payload);

            expect(token).toBeDefined();
            expect(typeof token).toBe("string");

            const decoded = verifyAccessToken(token);
            expect(decoded).not.toBeNull();
            expect(decoded?.userId).toBe(42);
            expect(decoded?.role).toBe("USER");
        });

        it("should return null for an invalid access token", () => {
            const decoded = verifyAccessToken("invalid.jwt.token");
            expect(decoded).toBeNull();
        });
    });

    describe("Temp 2FA Token (JWT)", () => {
        it("should sign and verify a 2FA pending temp token", () => {
            const token = signTemp2faToken({ userId: 99 });
            const decoded = verifyTemp2faToken(token);

            expect(decoded).not.toBeNull();
            expect(decoded?.userId).toBe(99);
            expect(decoded?.stage).toBe("2FA_PENDING");
        });

        it("should reject an access token passed to verifyTemp2faToken due to stage mismatch", () => {
            const accessToken = signAccessToken({ userId: 99, role: "USER" });
            const decoded = verifyTemp2faToken(accessToken);

            expect(decoded).toBeNull();
        });
    });

    describe("Crypto Random Tokens & Hashing", () => {
        it("should generate a random hex string for refresh and verification tokens", () => {
            const refreshToken = generateRefreshToken();
            const verifyToken = generateVerificationToken();

            expect(refreshToken).toHaveLength(128); 
            expect(verifyToken).toHaveLength(128);
            expect(refreshToken).not.toEqual(verifyToken);
        });

        it("should deterministically hash tokens with SHA-256", () => {
            const token = "my-secret-random-token";
            const hash1 = hashToken(token);
            const hash2 = hashToken(token);

            expect(hash1).toEqual(hash2);
            expect(hash1).toHaveLength(64); 
        });
    });
});
