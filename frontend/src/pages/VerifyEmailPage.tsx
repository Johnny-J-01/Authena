import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmailApi } from "../api/auth.api";

export const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") || "";
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

    useEffect(() => {
        const verify = async () => {
            try {
                await verifyEmailApi(token);
                setStatus("success");
                setTimeout(() => navigate("/login"), 2000);
            } catch {
                setStatus("error");
            }
        };
        verify();
    }, [token]);

    if (status === "loading") return <p>Verifying email...</p>;
    if (status === "success") return <p>Email verified! Redirecting to login...</p>;
    return <p>Verification link is invalid or expired.</p>;
};
