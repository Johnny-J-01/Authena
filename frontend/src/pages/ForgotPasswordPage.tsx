import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../schemas/auth.schemas";
import { forgotPasswordApi } from "../api/auth.api";
import {
    AuthCard,
    Input,
    Button,
    Alert,
    Divider,
    MailIcon,
    KeyIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
} from "../components/ui";

export const ForgotPasswordPage = () => {
    const [submitted, setSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        try {
            await forgotPasswordApi(data);
        } catch {
            // Anti-enumeration: Suppress backend errors to prevent email discovery
        } finally {
            setSubmittedEmail(data.email);
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <AuthCard
                icon={<CheckCircleIcon className="w-8 h-8 text-yellow-400" />}
                title="Recovery Email Sent"
                subtitle="Anti-enumeration security protection active"
                badge="CHECK YOUR INBOX"
            >
                <div className="space-y-4">
                    <Alert
                        type="success"
                        message={`If an account is associated with ${
                            submittedEmail || "that email"
                        }, a secure reset link has been dispatched.`}
                    />

                    <p className="text-xs sm:text-sm text-zinc-400 text-center leading-relaxed">
                        For security reasons, this link will expire in 15 minutes. Check your spam folder if you do not see it shortly.
                    </p>

                    <div className="pt-2">
                        <Link to="/login" className="block w-full">
                            <Button variant="primary" fullWidth>
                                Return to Login
                            </Button>
                        </Link>
                    </div>

                    <div className="text-center pt-2">
                        <button
                            type="button"
                            onClick={() => setSubmitted(false)}
                            className="text-xs sm:text-sm font-semibold text-yellow-400 hover:text-yellow-300 hover:underline cursor-pointer"
                        >
                            Try another email address
                        </button>
                    </div>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            icon={<KeyIcon className="w-8 h-8 text-yellow-400" />}
            title="Forgot Password"
            subtitle="Enter your verified email to receive a recovery link"
            badge="ACCOUNT RECOVERY"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    icon={<MailIcon className="w-5 h-5 text-yellow-400" />}
                    error={errors.email?.message}
                    {...register("email")}
                />

                <div className="pt-2">
                    <Button type="submit" loading={isSubmitting} variant="primary">
                        Send Recovery Link
                    </Button>
                </div>
            </form>

            <Divider text="REMEMBER YOUR CREDENTIALS?" />

            <div className="text-center">
                <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 hover:text-yellow-400 transition-colors group"
                >
                    <ArrowLeftIcon className="w-4 h-4 text-yellow-400 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to login</span>
                </Link>
            </div>
        </AuthCard>
    );
};
