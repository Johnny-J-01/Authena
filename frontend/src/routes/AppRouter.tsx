import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../providers/AuthProvider";
import { RequireAuth, RedirectIfAuth } from "../guards/AuthGuard";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { VerifyEmailPage } from "../pages/VerifyEmailPage";
import { TwoFactorVerifyPage } from "../pages/TwoFactorVerifyPage";
import { TwoFactorSetupPage } from "../pages/TwoFactorSetupPage";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes — redirect to /dashboard if already logged in */}
                    <Route path="/login" element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
                    <Route path="/register" element={<RedirectIfAuth><RegisterPage /></RedirectIfAuth>} />
                    <Route path="/2fa-verify" element={<RedirectIfAuth><TwoFactorVerifyPage /></RedirectIfAuth>} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />

                    {/* Protected routes — redirect to /login if not authenticated */}
                    <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
                    <Route path="/2fa-setup" element={<RequireAuth><TwoFactorSetupPage /></RequireAuth>} />

                    {/* Default redirect */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};
