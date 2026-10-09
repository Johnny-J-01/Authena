import { describe, it, expect } from "vitest";
import {
    generateTotpSecret,
    generateQrCodeUrl,
    generateBackupCodes,
} from "../../src/utils/totp.utils.js";

describe("TOTP & 2FA Utility Unit Tests", () => {
    it("should generate a Base32 secret key", () => {
        const secret = generateTotpSecret();

        expect(secret).toBeDefined();
        expect(typeof secret).toBe("string");
        expect(secret.length).toBeGreaterThanOrEqual(16);
    });

    it("should generate a valid Base64 QR code Data URL", async () => {
        const secret = generateTotpSecret();
        const email = "user@example.com";
        const qrCodeUrl = await generateQrCodeUrl(email, secret);

        expect(qrCodeUrl).toBeDefined();
        expect(qrCodeUrl).toMatch(/^data:image\/png;base64,/);
    });

    it("should generate 8 plain backup codes and 8 corresponding SHA-256 hashes", () => {
        const { plainCodes, hashedCodes } = generateBackupCodes();

        expect(plainCodes).toHaveLength(8);
        expect(hashedCodes).toHaveLength(8);

        plainCodes.forEach((code) => {
            expect(code).toHaveLength(8);
        });

        hashedCodes.forEach((hash) => {
            expect(hash).toHaveLength(64);
        });
    });
});
