import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/authStore";

// Mock axios.post for the silent refresh call
vi.mock("axios", async () => {
    const actual = await vi.importActual<typeof import("axios")>("axios");
    return {
        ...actual,
        default: {
            ...actual.default,
            post: vi.fn(),
            create: actual.default.create,
        },
    };
});

interface MockAxiosError extends Error {
    response?: { status: number; data: unknown };
    config?: unknown;
}

describe("Stage 18 / Stage 22 — Silent Refresh & Interceptor", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useAuthStore.getState().clearAuth();
    });

    it("attaches access token to request Authorization header", async () => {
        useAuthStore.getState().setAccessToken("test-access-token-abc");

        // Mock adapter on apiClient
        const requestSpy = vi.fn().mockResolvedValue({
            status: 200,
            data: { success: true },
            headers: {},
            config: {},
        });

        const origAdapter = apiClient.defaults.adapter;
        apiClient.defaults.adapter = async (config) => {
            requestSpy(config);
            return {
                status: 200,
                statusText: "OK",
                headers: {},
                config,
                data: { success: true },
            };
        };

        try {
            await apiClient.get("/protected-resource");
            expect(requestSpy).toHaveBeenCalled();
            const configPassed = requestSpy.mock.calls[0][0];
            expect(configPassed.headers.Authorization).toBe("Bearer test-access-token-abc");
        } finally {
            apiClient.defaults.adapter = origAdapter;
        }
    });

    it("refreshes token on 401 and retries original request", async () => {
        useAuthStore.getState().setAccessToken("expired-token");

        let callCount = 0;
        const origAdapter = apiClient.defaults.adapter;

        // Mock refresh endpoint success
        (axios.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
            data: { accessToken: "fresh-new-token-999" },
        });

        // Adapter returns 401 on first attempt, then 200 on retry
        apiClient.defaults.adapter = async (config) => {
            callCount++;
            if (callCount === 1) {
                const error = new Error("Request failed with status code 401") as MockAxiosError;
                error.response = { status: 401, data: { message: "Unauthorized" } };
                error.config = config;
                throw error;
            }

            return {
                status: 200,
                statusText: "OK",
                headers: {},
                config,
                data: { secretData: "vault-unlocked" },
            };
        };

        try {
            const res = await apiClient.get("/user/profile");
            expect(callCount).toBe(2);
            expect(axios.post).toHaveBeenCalledWith(
                "http://localhost:3000/api/auth/refresh",
                {},
                { withCredentials: true }
            );
            expect(useAuthStore.getState().accessToken).toBe("fresh-new-token-999");
            expect(res.data).toEqual({ secretData: "vault-unlocked" });
        } finally {
            apiClient.defaults.adapter = origAdapter;
        }
    });

    it("clears auth store when refresh endpoint fails on 401", async () => {
        useAuthStore.getState().setAuth("expired-token", {
            id: 1,
            username: "user1",
            email: "user1@example.com",
            role: "user",
            isEmailVerified: true,
        });

        const origAdapter = apiClient.defaults.adapter;

        // Mock refresh endpoint rejection (e.g. revoked token family)
        (axios.post as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
            new Error("Refresh token invalid or expired")
        );

        apiClient.defaults.adapter = async (config) => {
            const error = new Error("Unauthorized") as MockAxiosError;
            error.response = { status: 401, data: {} };
            error.config = config;
            throw error;
        };

        try {
            await expect(apiClient.get("/sensitive-data")).rejects.toThrow();
            // Auth store must be cleared to force user re-login
            expect(useAuthStore.getState().accessToken).toBeNull();
            expect(useAuthStore.getState().user).toBeNull();
        } finally {
            apiClient.defaults.adapter = origAdapter;
        }
    });
});
