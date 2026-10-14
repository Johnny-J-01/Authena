import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyEmailApi } from "../api/auth.api";
import {
    AuthCard,
    Button,
    Alert,
    CheckCircleIcon,
    AlertCircleIcon,
    ShieldIcon,
    ArrowRightIcon,
} from "../components/ui";

export const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token") || "";

    const [status, setStatus] = useState<"loading" | "success" | "error">(() =>
        !token ? "error" : "loading"
    );
    const [errorMessage, setErrorMessage] = useState(() =>
        !token ? "No verification token was found in the link." : ""
    );

    useEffect(() => {
        if (!token) return;

        let isMounted = true;
        const verify = async () => {
            try {
                await verifyEmailApi(token);
                if (isMounted) {
                    setStatus("success");
                    setTimeout(() => navigate("/login"), 3000);
                }
            } catch {
                if (isMounted) {
                    setStatus("error");
                    setErrorMessage("Verification link is invalid, expired, or has already been used.");
                }
            }
        };

        verify();

        return () => {
            isMounted = false;
        };
    }, [token, navigate]);

    return (
        <AuthCard
            icon={
                status === "loading" ? (
                    <ShieldIcon className="w-8 h-8 text-yellow-400 animate-pulse" />
                ) : status === "success" ? (
                    <CheckCircleIcon className="w-8 h-8 text-yellow-400" />
                ) : (
                    <AlertCircleIcon className="w-8 h-8 text-red-400" />
                )
            }
            title={
                status === "loading"
                    ? "Verifying Email"
                    : status === "success"
                    ? "Verification Complete"
                    : "Verification Failed"
            }
            subtitle={
                status === "loading"
                    ? "Validating your cryptographic verification token"
                    : status === "success"
                    ? "Your identity has been confirmed"
                    : "Unable to verify your account email"
            }
            badge={
                status === "loading"
                    ? "VALIDATING"
                    : status === "success"
                    ? "VERIFIED"
                    : "TOKEN ERROR"
            }
        >
            <div className="space-y-5 text-center">
                {status === "loading" && (
                    <div className="py-6 flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-full border-4 border-zinc-800 border-t-yellow-400 animate-spin" />
                            <div className="absolute inset-0 rounded-full blur-md bg-yellow-400/20" />
                        </div>
                        <p className="text-sm text-zinc-300">
                            Connecting with auth services to finalize verification...
                        </p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-4">
                        <Alert
                            type="success"
                            message="Your email address has been successfully verified! You can now access all authenticated features."
                        />
                        <p className="text-xs sm:text-sm text-zinc-400">
                            Redirecting to login automatically in a few seconds...
                        </p>
                        <div className="pt-2">
                            <Link to="/login" className="block w-full">
                                <Button variant="primary" fullWidth>
                                    <span>Continue to Sign In</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-4">
                        <Alert
                            type="error"
                            message={errorMessage || "The verification link has expired or is invalid."}
                        />
                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                            Verification links are one-time use and expire quickly for security reasons. Please try logging in or request a new verification link.
                        </p>
                        <div className="pt-2">
                            <Link to="/login" className="block w-full">
                                <Button variant="primary" fullWidth>
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AuthCard>
    );
};
