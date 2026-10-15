import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { logoutApi } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
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
    ArrowRightIcon,
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
        <div className="min-h-dvh bg-black text-white flex flex-col selection:bg-yellow-400 selection:text-black">
            {/* Top Navigation Bar */}
            <header className="border-b border-zinc-800/90 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-yellow-400/50 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.25)]">
                            <ShieldIcon className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5">
                                SHIELD<span className="text-yellow-400">AUTH</span>
                            </span>
                            <span className="hidden sm:inline-block text-[10px] font-mono text-zinc-400 uppercase tracking-widest ml-1">
                                Console v2.0
                            </span>
                        </div>
                    </div>

                    {/* Right User Bar */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                            <span className="text-xs font-mono text-zinc-300">
                                {user?.username || "Authenticated"}
                            </span>
                            <Badge variant="yellow">{user?.role || "USER"}</Badge>
                        </div>

                        <Button
                            variant="secondary"
                            onClick={handleLogout}
                            loading={isLoggingOut}
                            fullWidth={false}
                            className="!min-h-[38px] !py-1.5 !px-3.5 !text-xs sm:!text-sm hover:border-yellow-400"
                        >
                            <LogOutIcon className="w-4 h-4 text-yellow-400" />
                            <span className="hidden xs:inline">Sign Out</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                {/* Welcome Hero Banner */}
                <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 mb-8 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.6)]">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400/20 via-yellow-400 to-yellow-400/20" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 mb-3">
                                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                Active Session
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Welcome, <span className="text-yellow-400">{user?.username || "Commander"}</span>!
                            </h1>
                            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                                Your account is authenticated with in-memory tokens, encrypted double-submit CSRF protection, and silent refresh rotation.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {user?.isEmailVerified ? (
                                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs sm:text-sm font-semibold">
                                    <CheckCircleIcon className="w-4 h-4 text-yellow-400" />
                                    <span>Email Verified</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold">
                                    <AlertCircleIcon className="w-4 h-4 text-amber-400" />
                                    <span>Verification Pending</span>
                                </div>
                            )}

                            {user?.isTwoFactorEnabled ? (
                                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold">
                                    <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                                    <span>2FA Active</span>
                                </div>
                            ) : (
                                <Link to="/2fa-setup">
                                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-xs sm:text-sm font-semibold transition-colors cursor-pointer">
                                        <KeyIcon className="w-4 h-4" />
                                        <span>Enable 2FA</span>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1: Identity & Profile Details */}
                    <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between hover:border-yellow-400/40 transition-colors shadow-lg">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-white flex items-center gap-2">
                                    <UserIcon className="w-5 h-5 text-yellow-400" />
                                    Profile Identity
                                </h2>
                                <Badge variant="yellow">ID #{user?.id ?? "1"}</Badge>
                            </div>

                            <div className="space-y-3.5 mt-4">
                                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                    <div className="text-xs text-zinc-400 font-medium">Username</div>
                                    <div className="text-sm sm:text-base font-semibold text-white mt-0.5">
                                        {user?.username || "—"}
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                    <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                                        <MailIcon className="w-3.5 h-3.5 text-yellow-400" />
                                        Primary Email
                                    </div>
                                    <div className="text-sm sm:text-base font-semibold text-white mt-0.5 break-all">
                                        {user?.email || "—"}
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                    <div className="text-xs text-zinc-400 font-medium">System Role</div>
                                    <div className="text-sm sm:text-base font-semibold text-yellow-400 uppercase font-mono mt-0.5">
                                        {user?.role || "USER"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Security Architecture Status */}
                    <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between hover:border-yellow-400/40 transition-colors shadow-lg">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-white flex items-center gap-2">
                                    <ShieldIcon className="w-5 h-5 text-yellow-400" />
                                    Security Architecture
                                </h2>
                                <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/30">
                                    STAGES 20–22
                                </span>
                            </div>

                            <div className="space-y-3 mt-4">
                                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                    <CheckCircleIcon className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-semibold text-white">In-Memory Token Storage</div>
                                        <div className="text-xs text-zinc-400 mt-0.5">
                                            Access tokens stay in RAM (Zustand), never in localStorage. Eliminates XSS token extraction.
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                    <CheckCircleIcon className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-semibold text-white">HttpOnly Silent Refresh</div>
                                        <div className="text-xs text-zinc-400 mt-0.5">
                                            Axios response interceptor rotates expired tokens transparently with replay protection.
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                    <CheckCircleIcon className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-semibold text-white">Two-Factor Authentication</div>
                                        <div className="text-xs text-zinc-400 mt-0.5">
                                            TOTP-based authenticator with encrypted backup codes and intermediate login challenge.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Link to="/2fa-setup" className="block w-full">
                                <Button variant="secondary" fullWidth className="text-xs sm:text-sm">
                                    <KeyIcon className="w-4 h-4 text-yellow-400" />
                                    <span>{user?.isTwoFactorEnabled ? "Reconfigure 2FA" : "Configure 2FA"}</span>
                                    <ArrowRightIcon className="w-3.5 h-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Card 3: Session Protocol & Status */}
                    <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between hover:border-yellow-400/40 transition-colors shadow-lg md:col-span-2 lg:col-span-1">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-base font-bold text-white flex items-center gap-2">
                                    <KeyIcon className="w-5 h-5 text-yellow-400" />
                                    Session Protocol
                                </h2>
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
                            </div>

                            <div className="space-y-3 mt-4 text-xs">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                    <span className="text-zinc-400 font-medium">Session State</span>
                                    <span className="font-semibold text-yellow-400 font-mono">ACTIVE (JWT)</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                    <span className="text-zinc-400 font-medium">Refresh Cookie</span>
                                    <span className="font-semibold text-white font-mono">HttpOnly, SameSite</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                    <span className="text-zinc-400 font-medium">CSRF Protection</span>
                                    <span className="font-semibold text-yellow-400 font-mono">Double-Submit Header</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
                                    <span className="text-zinc-400 font-medium">Route Guarding</span>
                                    <span className="font-semibold text-white font-mono">RequireAuth (Protected)</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button
                                variant="danger"
                                onClick={handleLogout}
                                loading={isLoggingOut}
                                className="w-full text-xs sm:text-sm"
                            >
                                <LogOutIcon className="w-4 h-4" />
                                Terminate Current Session
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span>ShieldAuth System — Enterprise Black & Yellow Theme</span>
                    </div>
                    <div>Designed with responsive Tailwind CSS & Security Best Practices</div>
                </div>
            </footer>
        </div>
    );
};
