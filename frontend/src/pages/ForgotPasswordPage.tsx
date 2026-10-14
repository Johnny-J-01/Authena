import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "../schemas/auth.schemas";
import { forgotPasswordApi } from "../api/auth.api";
import { useState } from "react";

export const ForgotPasswordPage = () => {
    const [submitted, setSubmitted] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordInput) => {
        await forgotPasswordApi(data);
        // Always show the same generic message regardless of whether the email exists (anti-enumeration)
        setSubmitted(true);
    };

    if (submitted) {
        return <p>If that email is registered, a reset link has been sent.</p>;
    }

    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="email" placeholder="Email" {...register("email")} />
                {errors.email && <p>{errors.email.message}</p>}
                <button type="submit" disabled={isSubmitting}>Send Reset Link</button>
            </form>
        </div>
    );
};
