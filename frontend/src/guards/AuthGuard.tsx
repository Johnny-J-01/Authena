import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Redirects unauthenticated users to /login, preserving intended destination
export const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const accessToken = useAuthStore((s) => s.accessToken);
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

// Redirects authenticated users away from public auth routes (e.g., login, register)
export const RedirectIfAuth = ({ children }: { children: React.ReactNode }) => {
    const accessToken = useAuthStore((s) => s.accessToken);
    const location = useLocation();

    if (accessToken) {
        const destination = (location.state as { from?: Location })?.from?.pathname || "/dashboard";
        return <Navigate to={destination} replace />;
    }

    return <>{children}</>;
};

// Enforces role-based authorization (RBAC)
export const RequireRole = ({
    role,
    children,
}: {
    role: string | string[];
    children: React.ReactNode;
}) => {
    const accessToken = useAuthStore((s) => s.accessToken);
    const user = useAuthStore((s) => s.user);
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const allowedRoles = Array.isArray(role) ? role : [role];
    const hasRole = user && allowedRoles.includes(user.role);

    if (!hasRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};
