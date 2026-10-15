import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { refreshApi, getMeApi } from "../api/auth.api";
import { ShieldIcon } from "../components/ui";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const setAccessToken = useAuthStore((s) => s.setAccessToken);
    const setAuth = useAuthStore((s) => s.setAuth);
    const clearAuth = useAuthStore((s) => s.clearAuth);

    useEffect(() => {
        // On app mount, attempt a silent refresh to restore session
        const bootstrap = async () => {
            try {
                const refreshData = await refreshApi();
                setAccessToken(refreshData.accessToken);

                // Fetch user identity using the fresh access token
                try {
                    const meData = await getMeApi();
                    const user = meData?.data?.user ?? meData?.user;
                    if (user) {
                        setAuth(refreshData.accessToken, user);
                    }
                } catch {
                    // Even if getMe fails, the token is valid; user state can be loaded lazily
                }
            } catch {
                clearAuth();
            } finally {
                setIsLoading(false);
            }
        };

        bootstrap();
    }, [setAccessToken, setAuth, clearAuth]);

    if (isLoading) {
        return (
            <div className="min-h-dvh bg-black flex flex-col items-center justify-center p-4 selection:bg-yellow-400 selection:text-black">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="absolute -inset-2 rounded-2xl bg-yellow-400/20 blur-xl animate-pulse" />
                        <div className="relative w-16 h-16 rounded-2xl bg-zinc-950 border-2 border-yellow-400 flex items-center justify-center text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
                            <ShieldIcon className="w-8 h-8 text-yellow-400" />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                        <h2 className="text-lg font-bold text-white tracking-wide">
                            SHIELD<span className="text-yellow-400">AUTH</span>
                        </h2>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-400">
                        Initializing secure authentication context...
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
