import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../../src/utils/password.utils.js";

describe("Password Utility Unit Tests (Argon2id)", () => {
    it("should hash a password and verify it successfully", async () => {
        const plainPassword = "MySecurePassword123!";
        const hash = await hashPassword(plainPassword);

        expect(hash).toBeDefined();
        expect(typeof hash).toBe("string");
        expect(hash).not.toEqual(plainPassword);

        const isValid = await verifyPassword(hash, plainPassword);
        expect(isValid).toBe(true);
    });

    it("should reject an incorrect password", async () => {
        const plainPassword = "MySecurePassword123!";
        const wrongPassword = "WrongPassword456!";
        const hash = await hashPassword(plainPassword);

        const isValid = await verifyPassword(hash, wrongPassword);
        expect(isValid).toBe(false);
    });

    it("should produce different hashes for the same password due to random salting", async () => {
        const password = "SamePassword123!";
        const hash1 = await hashPassword(password);
        const hash2 = await hashPassword(password);

        expect(hash1).not.toEqual(hash2);
        expect(await verifyPassword(hash1, password)).toBe(true);
        expect(await verifyPassword(hash2, password)).toBe(true);
    });
});
