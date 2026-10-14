import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { refreshApi } from "../api/auth.api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    useEffect(() => {
        // On app mount, attempt a silent refresh to restore session
        const bootstrap = async () => {
            try {
                const data = await refreshApi();
                setAccessToken(data.accessToken);
            } catch {
                clearAuth();
            } finally {
                setIsLoading(false);
            }
        };

        bootstrap();
    }, []);

    if (isLoading) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>Loading...</div>;
    }

    return <>{children}</>;
};
