import { apiClient } from "./client";
import type { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from "../schemas/auth.schemas";
import type { User } from "../store/authStore";

export interface Setup2faResponse {
    status: string;
    data: {
        totpSecret: string;
        qrCodeUrl: string;
    };
}

export interface VerifySetup2faResponse {
    status: string;
    message: string;
    backupCodes: string[];
}

export interface VerifyLogin2faResponse {
    status: string;
    message: string;
    data: {
        accessToken: string;
        user: User;
    };
}

export const getCsrfToken = async (): Promise<string> => {
    const response = await apiClient.get("/auth/csrf-token");
    return response.data.csrfToken;
};

export const registerApi = async (data: RegisterInput) => {
    const csrfToken = await getCsrfToken();
    const response = await apiClient.post("/auth/register", data, {
        headers: { "x-csrf-token": csrfToken },
    });
    return response.data;
};

export const loginApi = async (data: LoginInput) => {
    const csrfToken = await getCsrfToken();
    const response = await apiClient.post("/auth/login", data, {
        headers: { "x-csrf-token": csrfToken },
    });
    return response.data;
};

export const logoutApi = async () => {
    const csrfToken = await getCsrfToken();
    const response = await apiClient.post("/auth/logout", {}, {
        headers: { "x-csrf-token": csrfToken },
    });
    return response.data;
};

export const getMeApi = async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
};

export const refreshApi = async () => {
    const response = await apiClient.post("/auth/refresh", {}, { withCredentials: true });
    return response.data;
};

export const forgotPasswordApi = async (data: ForgotPasswordInput) => {
    const csrfToken = await getCsrfToken();
    const response = await apiClient.post("/auth/forgot-password", data, {
        headers: { "x-csrf-token": csrfToken },
    });
    return response.data;
};

export const resetPasswordApi = async (token: string, data: ResetPasswordInput) => {
    const csrfToken = await getCsrfToken();
    const response = await apiClient.post("/auth/reset-password", { token, password: data.password }, {
        headers: { "x-csrf-token": csrfToken },
    });
    return response.data;
};

export const verifyEmailApi = async (token: string) => {
    const response = await apiClient.post("/auth/verify-email", { token });
    return response.data;
};

export const setup2faApi = async (): Promise<Setup2faResponse> => {
    const csrfToken = await getCsrfToken();
    const response = await apiClient.post("/auth/2fa/setup", {}, {
        headers: { "x-csrf-token": csrfToken },
    });
    return response.data;
};

export const verifySetup2faApi = async (code: string, secret: string): Promise<VerifySetup2faResponse> => {
    const csrfToken = await getCsrfToken();
    const response = await apiClient.post(
        "/auth/2fa/verify-setup",
        { code, secret },
        { headers: { "x-csrf-token": csrfToken } }
    );
    return response.data;
};

export const verifyLogin2faApi = async (tempToken: string, code: string): Promise<VerifyLogin2faResponse> => {
    const csrfToken = await getCsrfToken();
    const response = await apiClient.post(
        "/auth/2fa/verify-login",
        { tempToken, code },
        { headers: { "x-csrf-token": csrfToken } }
    );
    return response.data;
};
