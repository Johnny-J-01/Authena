import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { logoutApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import {
    ShieldIcon,
    UserIcon,
    MailIcon,
    KeyIcon,
    LogOutIcon,
    CheckCircleIcon,
    AlertCircleIcon,
    Badge,
    Button,
} from "../components/ui";

export const DashboardPage = () => {
    const user = useAuthStore((s) => s.user);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logoutApi();
        } catch {
            // Even if the network call fails, always clear auth locally
        } finally {
            clearAuth();
            navigate("/login");
        }
    };

    return (
       <h1> DashBoard </h1> 
    );
};
