import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { RequireAuth, RedirectIfAuth, RequireRole } from "../guards/AuthGuard";
import { useAuthStore } from "../store/authStore";

describe("Stage 20 / Stage 22 — Auth Route Guards", () => {
    beforeEach(() => {
        useAuthStore.getState().clearAuth();
    });

    describe("<RequireAuth>", () => {
        it("redirects unauthenticated users to /login", () => {
            render(
                <MemoryRouter initialEntries={["/dashboard"]}>
                    <Routes>
                        <Route
                            path="/dashboard"
                            element={
                                <RequireAuth>
                                    <div>Protected Dashboard Content</div>
                                </RequireAuth>
                            }
                        />
                        <Route path="/login" element={<div>Login Page Screen</div>} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.queryByText("Protected Dashboard Content")).not.toBeInTheDocument();
            expect(screen.getByText("Login Page Screen")).toBeInTheDocument();
        });

        it("renders protected children when access token exists", () => {
            useAuthStore.getState().setAuth("valid-access-token-xyz", {
                id: 1,
                username: "alice",
                email: "alice@example.com",
                role: "user",
                isEmailVerified: true,
            });

            render(
                <MemoryRouter initialEntries={["/dashboard"]}>
                    <Routes>
                        <Route
                            path="/dashboard"
                            element={
                                <RequireAuth>
                                    <div>Protected Dashboard Content</div>
                                </RequireAuth>
                            }
                        />
                        <Route path="/login" element={<div>Login Page Screen</div>} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText("Protected Dashboard Content")).toBeInTheDocument();
            expect(screen.queryByText("Login Page Screen")).not.toBeInTheDocument();
        });
    });

    describe("<RedirectIfAuth>", () => {
        it("renders children if user is not authenticated", () => {
            render(
                <MemoryRouter initialEntries={["/login"]}>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <RedirectIfAuth>
                                    <div>Public Login Form</div>
                                </RedirectIfAuth>
                            }
                        />
                        <Route path="/dashboard" element={<div>User Dashboard</div>} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText("Public Login Form")).toBeInTheDocument();
            expect(screen.queryByText("User Dashboard")).not.toBeInTheDocument();
        });

        it("redirects authenticated users away from public auth page to /dashboard", () => {
            useAuthStore.getState().setAuth("active-token", {
                id: 2,
                username: "bob",
                email: "bob@example.com",
                role: "user",
                isEmailVerified: true,
            });

            render(
                <MemoryRouter initialEntries={["/login"]}>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <RedirectIfAuth>
                                    <div>Public Login Form</div>
                                </RedirectIfAuth>
                            }
                        />
                        <Route path="/dashboard" element={<div>User Dashboard</div>} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.queryByText("Public Login Form")).not.toBeInTheDocument();
            expect(screen.getByText("User Dashboard")).toBeInTheDocument();
        });
    });

    describe("<RequireRole>", () => {
        it("permits access when user role matches requirement", () => {
            useAuthStore.getState().setAuth("admin-token", {
                id: 99,
                username: "admin_user",
                email: "admin@corp.internal",
                role: "admin",
                isEmailVerified: true,
            });

            render(
                <MemoryRouter initialEntries={["/admin"]}>
                    <Routes>
                        <Route
                            path="/admin"
                            element={
                                <RequireRole role="admin">
                                    <div>Admin Control Panel</div>
                                </RequireRole>
                            }
                        />
                        <Route path="/dashboard" element={<div>Standard Dashboard</div>} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText("Admin Control Panel")).toBeInTheDocument();
        });

        it("redirects to /dashboard when user role does not match requirement", () => {
            useAuthStore.getState().setAuth("user-token", {
                id: 5,
                username: "standard_user",
                email: "user@corp.internal",
                role: "user",
                isEmailVerified: true,
            });

            render(
                <MemoryRouter initialEntries={["/admin"]}>
                    <Routes>
                        <Route
                            path="/admin"
                            element={
                                <RequireRole role="admin">
                                    <div>Admin Control Panel</div>
                                </RequireRole>
                            }
                        />
                        <Route path="/dashboard" element={<div>Standard Dashboard</div>} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.queryByText("Admin Control Panel")).not.toBeInTheDocument();
            expect(screen.getByText("Standard Dashboard")).toBeInTheDocument();
        });
    });
});

