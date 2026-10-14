import { create } from "zustand";

export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
}

interface AuthState {
    accessToken: string | null;
    user: User | null;
    setAuth: (accessToken: string, user: User) => void;
    setAccessToken: (accessToken: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    setAuth: (accessToken, user) => set({ accessToken, user }),
    setAccessToken: (accessToken) => set({ accessToken }),
    clearAuth: () => set({ accessToken: null, user: null }),
}));
