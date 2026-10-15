import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { twoFactorCodeSchema, type TwoFactorCodeInput } from "../schemas/auth.schemas";
import { verifyLogin2faApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import {
    AuthCard,
    Input,
    Button,
    Alert,
    Divider,
    KeyIcon,
    ShieldIcon,
    ArrowLeftIcon,
} from "../components/ui";

export const TwoFactorVerifyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const setAuth = useAuthStore((s) => s.setAuth);

    const tempToken = (location.state as { tempToken?: string })?.tempToken;
    const from = (location.state as { from?: string })?.from || "/dashboard";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<TwoFactorCodeInput>({
        resolver: zodResolver(twoFactorCodeSchema),
        defaultValues: {
            code: "",
        },
    });

    if (!tempToken) {
        return (
            <AuthCard
                icon={<ShieldIcon className="w-8 h-8 text-yellow-400" />}
                title="Session Expired"
                subtitle="Missing two-factor authentication session"
                badge="AUTH REQUIRED"
            >
                <div className="space-y-4">
                    <Alert
                        type="error"
                        message="No active 2FA login session found. Please sign in with your email and password first."
                    />
                    <div className="pt-2">
                        <Link to="/login" className="block w-full">
                            <Button variant="primary" fullWidth>
                                Return to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </AuthCard>
        );
    }

    const onSubmit = async (data: TwoFactorCodeInput) => {
        try {
            const result = await verifyLogin2faApi(tempToken, data.code.trim());
            setAuth(result.data.accessToken, result.data.user);
            navigate(from, { replace: true });
        } catch {
            setError("root", {
                message: "Invalid or expired verification code. Please check your authenticator app or backup codes.",
            });
        }
    };

    return (
        <AuthCard
            icon={<KeyIcon className="w-8 h-8 text-yellow-400" />}
            title="Two-Factor Verification"
            subtitle="Enter the 6-digit code from your authenticator app"
            badge="SECOND FACTOR"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {errors.root && (
                    <Alert type="error" message={errors.root.message || "2FA verification failed"} />
                )}

                <Input
                    label="Authentication Code"
                    type="text"
                    placeholder="123456"
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength={12}
                    icon={<KeyIcon className="w-5 h-5 text-yellow-400" />}
                    error={errors.code?.message}
                    hint="TOTP or Backup Code"
                    {...register("code")}
                />

                <div className="pt-2">
                    <Button type="submit" loading={isSubmitting} variant="primary">
                        Verify & Sign In
                    </Button>
                </div>
            </form>

            <Divider text="OR" />

            <div className="text-center">
                <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-yellow-400 transition-colors group"
                >
                    <ArrowLeftIcon className="w-4 h-4 text-yellow-400 group-hover:-translate-x-1 transition-transform" />
                    <span>Cancel and return to sign in</span>
                </Link>
            </div>
        </AuthCard>
    );
};

