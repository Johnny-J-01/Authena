import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginInput } from "../schemas/auth.schemas";
import { loginApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import {
    AuthCard,
    Input,
    Button,
    Alert,
    Divider,
    MailIcon,
    LockIcon,
    ArrowRightIcon,
    ShieldIcon,
} from "../components/ui";

export const LoginPage = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            const result = await loginApi(data);

            if (result.status === "2fa_required") {
                navigate("/2fa-verify", { state: { tempToken: result.tempToken } });
                return;
            }

            setAuth(result.data.accessToken, result.data.user);
            navigate("/dashboard");
        } catch {
            setError("root", { message: "Invalid email or password. Please check your credentials." });
        }
    };

    return (
        <AuthCard
            icon={<ShieldIcon className="w-8 h-8 text-yellow-400" />}
            title="Welcome Back"
            subtitle="Sign in to your high-security account"
            badge="SECURE ACCESS"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {errors.root && (
                    <Alert type="error" message={errors.root.message || "Authentication failed"} />
                )}

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    icon={<MailIcon className="w-5 h-5 text-yellow-400" />}
                    error={errors.email?.message}
                    {...register("email")}
                />

                <div>
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        showPasswordToggle={true}
                        icon={<LockIcon className="w-5 h-5 text-yellow-400" />}
                        error={errors.password?.message}
                        {...register("password")}
                    />
                    <div className="flex justify-end mt-1.5">
                        <Link
                            to="/forgot-password"
                            className="text-xs sm:text-sm font-medium text-yellow-400 hover:text-yellow-300 hover:underline transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <div className="pt-2">
                    <Button type="submit" loading={isSubmitting} variant="primary">
                        Sign In
                    </Button>
                </div>
            </form>

            <Divider text="NEW TO SHIELDAUTH?" />

            <div className="text-center">
                <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-yellow-400 transition-colors group"
                >
                    <span>Create a new secure account</span>
                    <ArrowRightIcon className="w-4 h-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </AuthCard>
    );
};
