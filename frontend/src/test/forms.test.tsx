import { describe, it, expect } from "vitest";
import {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    twoFactorCodeSchema,
} from "../schemas/auth.schemas";

describe("Stage 22 — Form Validation Schemas", () => {
    describe("loginSchema", () => {
        it("fails on empty inputs", () => {
            const result = loginSchema.safeParse({ email: "", password: "" });
            expect(result.success).toBe(false);
            if (!result.success) {
                const issues = result.error.format();
                expect(issues.email?._errors).toBeDefined();
                expect(issues.password?._errors).toBeDefined();
            }
        });

        it("fails on invalid email format", () => {
            const result = loginSchema.safeParse({
                email: "not-an-email",
                password: "validPassword123",
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.format().email?._errors[0]).toBe("Invalid email address");
            }
        });

        it("fails on password shorter than 8 characters", () => {
            const result = loginSchema.safeParse({
                email: "user@example.com",
                password: "123",
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.format().password?._errors[0]).toBe(
                    "Password must be at least 8 characters"
                );
            }
        });

        it("passes with valid email and password", () => {
            const result = loginSchema.safeParse({
                email: "security@shieldauth.com",
                password: "SuperSecretPassword123!",
            });
            expect(result.success).toBe(true);
        });
    });

    describe("registerSchema", () => {
        it("fails if username is less than 3 characters", () => {
            const result = registerSchema.safeParse({
                username: "ab",
                email: "user@example.com",
                password: "password123",
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.format().username?._errors[0]).toBe(
                    "Username must be at least 3 characters"
                );
            }
        });

        it("passes on valid username, email, and password", () => {
            const result = registerSchema.safeParse({
                username: "alice_dev",
                email: "alice@example.com",
                password: "SecurePassword2026!",
            });
            expect(result.success).toBe(true);
        });
    });

    describe("forgotPasswordSchema", () => {
        it("fails on malformed email", () => {
            const result = forgotPasswordSchema.safeParse({ email: "invalid" });
            expect(result.success).toBe(false);
        });

        it("passes on valid email", () => {
            const result = forgotPasswordSchema.safeParse({ email: "valid@example.com" });
            expect(result.success).toBe(true);
        });
    });

    describe("resetPasswordSchema", () => {
        it("fails if passwords do not match", () => {
            const result = resetPasswordSchema.safeParse({
                password: "NewPassword123",
                confirmPassword: "DifferentPassword123",
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.format().confirmPassword?._errors[0]).toBe(
                    "Passwords do not match"
                );
            }
        });

        it("passes when passwords match and meet minimum length", () => {
            const result = resetPasswordSchema.safeParse({
                password: "BrandNewSecurePassword123",
                confirmPassword: "BrandNewSecurePassword123",
            });
            expect(result.success).toBe(true);
        });
    });

    describe("twoFactorCodeSchema", () => {
        it("fails on code shorter than 6 characters", () => {
            const result = twoFactorCodeSchema.safeParse({ code: "123" });
            expect(result.success).toBe(false);
        });

        it("fails on non-alphanumeric characters", () => {
            const result = twoFactorCodeSchema.safeParse({ code: "12-34!" });
            expect(result.success).toBe(false);
        });

        it("passes on valid 6-digit TOTP code", () => {
            const result = twoFactorCodeSchema.safeParse({ code: "123456" });
            expect(result.success).toBe(true);
        });

        it("passes on alphanumeric backup code", () => {
            const result = twoFactorCodeSchema.safeParse({ code: "A1B2C3D4" });
            expect(result.success).toBe(true);
        });
    });
});

