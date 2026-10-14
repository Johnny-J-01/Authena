import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { resetPasswordSchema, type ResetPasswordInput } from "../schemas/auth.schemas";
import { resetPasswordApi } from "../api/auth.api";
import {
    AuthCard,
    Input,
    Button,
    Alert,
    Divider,
    LockIcon,
    ArrowLeftIcon,
    KeyIcon,
} from "../components/ui";

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") || "";

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        if (!token) {
            setError("root", { message: "Missing reset token. Please use the link sent to your email." });
            return;
        }

        try {
            await resetPasswordApi(token, data);
            navigate("/login");
        } catch {
            setError("root", {
                message: "Reset link is invalid or has expired. Please request a new recovery link.",
            });
        }
    };

    return (
        <AuthCard
            icon={<KeyIcon className="w-8 h-8 text-yellow-400" />}
            title="Set New Password"
            subtitle="Choose a strong, unique password for your account"
            badge="CREDENTIAL ROTATION"
        >
            {!token && (
                <div className="mb-4">
                    <Alert
                        type="warning"
                        message="No reset token detected in the URL. Ensure you opened the complete link from your recovery email."
                    />
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {errors.root && (
                    <Alert type="error" message={errors.root.message || "Password reset failed"} />
                )}

                <Input
                    label="New Password"
                    type="password"
                    placeholder="Min 8 characters"
                    autoComplete="new-password"
                    showPasswordToggle={true}
                    hint="Min 8 chars"
                    icon={<LockIcon className="w-5 h-5 text-yellow-400" />}
                    error={errors.password?.message}
                    {...register("password")}
                />

                <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                    showPasswordToggle={true}
                    icon={<LockIcon className="w-5 h-5 text-yellow-400" />}
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />

                <div className="pt-2">
                    <Button type="submit" loading={isSubmitting} disabled={!token} variant="primary">
                        Update Password
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
                    <span>Return to sign in</span>
                </Link>
            </div>
        </AuthCard>
    );
};
