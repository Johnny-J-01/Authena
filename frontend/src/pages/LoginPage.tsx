import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginInput } from "../schemas/auth.schemas";
import { loginApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";

export const LoginPage = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
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
            setError("root", { message: "Invalid email or password" });
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="email" placeholder="Email" {...register("email")} />
                {errors.email && <p>{errors.email.message}</p>}

                <input type="password" placeholder="Password" {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}

                {errors.root && <p>{errors.root.message}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};
