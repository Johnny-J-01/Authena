import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPasswordSchema, type ResetPasswordInput } from "../schemas/auth.schemas";
import { resetPasswordApi } from "../api/auth.api";

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") || "";

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<ResetPasswordInput>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordInput) => {
        try {
            await resetPasswordApi(token, data);
            navigate("/login");
        } catch {
            setError("root", { message: "Reset link is invalid or expired." });
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="password" placeholder="New Password" {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}

                <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

                {errors.root && <p>{errors.root.message}</p>}

                <button type="submit" disabled={isSubmitting}>Reset Password</button>
            </form>
        </div>
    );
};
