import React, { forwardRef, useState, type InputHTMLAttributes, type ButtonHTMLAttributes } from "react";

// ==========================================
// SVGs & Icons (Pure SVG, 0 Dependencies)
// ==========================================

export const ShieldIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export const LockIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

export const MailIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
    </svg>
);

export const UserIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export const KeyIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1-1-5.5 5.5A4.5 4.5 0 1 0 11 19l5.5-5.5-1-1 1.5-1.5 1.5 1.5 1.5-1.5" />
    </svg>
);

export const EyeIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const EyeOffIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
);

export const CheckCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export const AlertCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export const LogOutIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export const ArrowRightIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

export const ArrowLeftIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

// ==========================================
// Input Component with React-Hook-Form support
// ==========================================

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
    hint?: string;
    showPasswordToggle?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, hint, type = "text", showPasswordToggle = false, className = "", ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const resolvedType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

        return (
            <div className="flex flex-col gap-1.5 w-full text-left">
                <div className="flex items-center justify-between">
                    <label className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wide">
                        {label}
                    </label>
                    {hint && <span className="text-xs text-zinc-400">{hint}</span>}
                </div>

                <div className="relative group">
                    {icon && (
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-400 group-focus-within:text-yellow-300 transition-colors pointer-events-none flex items-center justify-center">
                            {icon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        type={resolvedType}
                        className={`
                            w-full rounded-xl bg-zinc-950 text-white placeholder-zinc-500 
                            text-sm sm:text-base outline-none transition-all duration-200
                            min-h-[46px] sm:min-h-[48px]
                            ${icon ? "pl-11" : "pl-4"}
                            ${showPasswordToggle ? "pr-11" : "pr-4"}
                            border
                            ${
                                error
                                    ? "border-red-500/80 bg-red-950/10 focus:border-red-400 focus:ring-2 focus:ring-red-500/30"
                                    : "border-zinc-800 hover:border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                            }
                            ${className}
                        `}
                        {...props}
                    />

                    {showPasswordToggle && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-yellow-400 transition-colors p-1 focus:outline-none focus:text-yellow-400"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                    )}
                </div>

                {error && (
                    <div className="flex items-center gap-1.5 text-xs text-red-400 mt-0.5">
                        <AlertCircleIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

// ==========================================
// Button Component
// ==========================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    variant?: "primary" | "secondary" | "ghost" | "danger";
    fullWidth?: boolean;
}

export const Button = ({
    children,
    loading = false,
    variant = "primary",
    fullWidth = true,
    className = "",
    disabled,
    ...props
}: ButtonProps) => {
    const base =
        "rounded-xl font-bold text-sm sm:text-base min-h-[46px] sm:min-h-[48px] px-6 py-3 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer select-none active:scale-[0.98]";

    const variants = {
        primary:
            "bg-yellow-400 text-black hover:bg-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:shadow-[0_0_30px_rgba(250,204,21,0.45)] border border-yellow-400",
        secondary:
            "bg-zinc-900 text-yellow-400 border border-yellow-400/40 hover:border-yellow-400 hover:bg-zinc-800/80 shadow-[0_0_15px_rgba(250,204,21,0.1)]",
        ghost:
            "bg-transparent text-zinc-300 hover:text-yellow-400 hover:bg-yellow-400/10 border border-transparent hover:border-yellow-400/20",
        danger:
            "bg-red-500/10 text-red-400 border border-red-500/40 hover:bg-red-500/20 hover:border-red-500",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
            disabled={loading || disabled}
            {...props}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-current shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Processing...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

// ==========================================
// Auth Card Layout
// ==========================================

export interface AuthCardProps {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    badge?: string;
}

export const AuthCard = ({
    icon = <ShieldIcon className="w-7 h-7 text-yellow-400" />,
    title,
    subtitle,
    children,
    badge,
}: AuthCardProps) => (
    <div className="min-h-dvh bg-black flex flex-col justify-center items-center px-4 py-8 sm:py-12 selection:bg-yellow-400 selection:text-black">
        {/* Subtle background ambient radial gradient */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-yellow-400/8 via-transparent to-transparent" />

        <div className="w-full max-w-[440px] relative z-10">
            {/* Header branding */}
            <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
                {/* Logo with pulsing glow */}
                <div className="relative mb-4 group">
                    <div className="absolute -inset-1 rounded-2xl bg-yellow-400/30 blur-md group-hover:bg-yellow-400/50 transition-all duration-300" />
                    <div className="relative w-16 h-16 rounded-2xl bg-zinc-950 border-2 border-yellow-400 flex items-center justify-center text-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.3)]">
                        {icon}
                    </div>
                </div>

                {badge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 mb-3 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                        {badge}
                    </span>
                )}

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-sm">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Main Card */}
            <div className="bg-zinc-950/95 backdrop-blur-xl rounded-2xl border border-zinc-800/90 p-5 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_30px_rgba(250,204,21,0.06)] relative overflow-hidden">
                {/* Yellow top accent highlight bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80" />
                {children}
            </div>

            {/* Footer security guarantee */}
            <div className="mt-6 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                <ShieldIcon className="w-4 h-4 text-yellow-400/70" />
                <span>Protected with In-Memory Tokens & CSRF Defense</span>
            </div>
        </div>
    </div>
);

// ==========================================
// Divider
// ==========================================

export const Divider = ({ text = "OR" }: { text?: string }) => (
    <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-zinc-800" />
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{text}</span>
        <div className="flex-1 h-px bg-zinc-800" />
    </div>
);

// ==========================================
// Alert Banner
// ==========================================

export interface AlertProps {
    message: string;
    type?: "error" | "success" | "warning" | "info";
    className?: string;
}

export const Alert = ({ message, type = "error", className = "" }: AlertProps) => {
    const config = {
        error: {
            container: "bg-red-950/40 border-red-500/50 text-red-200",
            icon: <AlertCircleIcon className="w-5 h-5 text-red-400 shrink-0" />,
        },
        success: {
            container: "bg-yellow-400/10 border-yellow-400/50 text-yellow-100",
            icon: <CheckCircleIcon className="w-5 h-5 text-yellow-400 shrink-0" />,
        },
        warning: {
            container: "bg-amber-950/40 border-amber-500/50 text-amber-200",
            icon: <AlertCircleIcon className="w-5 h-5 text-amber-400 shrink-0" />,
        },
        info: {
            container: "bg-zinc-900 border-yellow-400/30 text-zinc-200",
            icon: <ShieldIcon className="w-5 h-5 text-yellow-400 shrink-0" />,
        },
    };

    const current = config[type];

    return (
        <div
            className={`rounded-xl border p-3.5 sm:p-4 text-xs sm:text-sm font-medium flex items-start gap-3 transition-all animate-fadeIn ${current.container} ${className}`}
            role="alert"
        >
            <div className="mt-0.5">{current.icon}</div>
            <div className="flex-1 leading-relaxed">{message}</div>
        </div>
    );
};

// ==========================================
// Status Badge
// ==========================================

export const Badge = ({
    children,
    variant = "yellow",
}: {
    children: React.ReactNode;
    variant?: "yellow" | "green" | "zinc";
}) => {
    const styles = {
        yellow: "bg-yellow-400/15 text-yellow-400 border-yellow-400/40",
        green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
        zinc: "bg-zinc-800 text-zinc-300 border-zinc-700",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold font-mono border ${styles[variant]}`}
        >
            {children}
        </span>
    );
};
