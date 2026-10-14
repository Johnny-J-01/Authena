import { useAuthStore } from "../store/authStore";
import { logoutApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
    const user = useAuthStore((s) => s.user);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutApi();
        } finally {
            clearAuth();
            navigate("/login");
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.username}!</p>
            <p>Email: {user?.email}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};
