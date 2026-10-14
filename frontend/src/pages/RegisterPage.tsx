import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema, type RegisterInput } from "../schemas/auth.schemas";
import { registerApi } from "../api/auth.api";
import {
    AuthCard,
    Input,
    Button,
    Alert,
    Divider,
    MailIcon,
    LockIcon,
    UserIcon,
    ArrowRightIcon,
    ShieldIcon,
} from "../components/ui";

export const RegisterPage = () => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            await registerApi(data);
            navigate("/login");
        } catch {
            setError("root", {
                message: "Registration failed. An account with this email may already exist or system is unavailable.",
            });
        }
    };

    return (
        <AuthCard
            icon={<ShieldIcon className="w-8 h-8 text-yellow-400" />}
            title="Create Account"
            subtitle="Get started with our enterprise-grade security platform"
            badge="NEW REGISTRATION"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                {errors.root && (
                    <Alert type="error" message={errors.root.message || "Registration error"} />
                )}

                <Input
                    label="Username"
                    type="text"
                    placeholder="johndoe"
                    autoComplete="username"
                    icon={<UserIcon className="w-5 h-5 text-yellow-400" />}
                    error={errors.username?.message}
                    {...register("username")}
                />

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    icon={<MailIcon className="w-5 h-5 text-yellow-400" />}
                    error={errors.email?.message}
                    {...register("email")}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    showPasswordToggle={true}
                    hint="Min 8 characters"
                    icon={<LockIcon className="w-5 h-5 text-yellow-400" />}
                    error={errors.password?.message}
                    {...register("password")}
                />

                <div className="pt-2">
                    <Button type="submit" loading={isSubmitting} variant="primary">
                        Register Account
                    </Button>
                </div>
            </form>

            <Divider text="ALREADY REGISTERED?" />

            <div className="text-center">
                <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-yellow-400 transition-colors group"
                >
                    <span>Sign in to existing account</span>
                    <ArrowRightIcon className="w-4 h-4 text-yellow-400 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </AuthCard>
    );
};
