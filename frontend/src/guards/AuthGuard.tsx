import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Redirects unauthenticated users to /login
export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const accessToken = useAuthStore((s) => s.accessToken);
    if (!accessToken) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

// Redirects already-authenticated users away from login/register
export const RedirectIfAuth = ({ children }: { children: React.ReactNode }) => {
    const accessToken = useAuthStore((s) => s.accessToken);
    if (accessToken) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
};
