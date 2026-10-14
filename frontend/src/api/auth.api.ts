import { apiClient } from "./client";
import type { LoginInput, RegisterInput, ForgotPasswordInput, ResetPasswordInput } from "../schemas/auth.schemas";

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
