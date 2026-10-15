import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { setup2faApi, verifySetup2faApi } from "../api/auth.api";
import { useAuthStore } from "../store/authStore";
import { twoFactorCodeSchema, type TwoFactorCodeInput } from "../schemas/auth.schemas";
import {
    AuthCard,
    Input,
    Button,
    Alert,
    Divider,
    KeyIcon,
    ShieldIcon,
    CheckCircleIcon,
    ArrowLeftIcon,
} from "../components/ui";

export const TwoFactorSetupPage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const updateUser = useAuthStore((s) => s.updateUser);

    const [isLoadingSetup, setIsLoadingSetup] = useState(true);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [totpSecret, setTotpSecret] = useState("");
    const [setupError, setSetupError] = useState("");
    const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
    const [copiedSecret, setCopiedSecret] = useState(false);
    const [copiedCodes, setCopiedCodes] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<TwoFactorCodeInput>({
        resolver: zodResolver(twoFactorCodeSchema),
        defaultValues: { code: "" },
    });

    useEffect(() => {
        let isMounted = true;
        const loadSetup = async () => {
            try {
                const response = await setup2faApi();
                if (isMounted) {
                    setQrCodeUrl(response.data.qrCodeUrl);
                    setTotpSecret(response.data.totpSecret);
                }
            } catch {
                if (isMounted) {
                    setSetupError("Failed to initiate 2FA setup. Please try again later.");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingSetup(false);
                }
            }
        };

        loadSetup();
        return () => {
            isMounted = false;
        };
    }, []);

    const onCopySecret = () => {
        navigator.clipboard.writeText(totpSecret);
        setCopiedSecret(true);
        setTimeout(() => setCopiedSecret(false), 2000);
    };

    const onCopyCodes = () => {
        if (!backupCodes) return;
        navigator.clipboard.writeText(backupCodes.join("\n"));
        setCopiedCodes(true);
        setTimeout(() => setCopiedCodes(false), 2000);
    };

    const onSubmit = async (data: TwoFactorCodeInput) => {
        try {
            const result = await verifySetup2faApi(data.code.trim(), totpSecret);
            updateUser({ isTwoFactorEnabled: true });
            setBackupCodes(result.backupCodes || []);
        } catch {
            setError("root", {
                message: "Verification code incorrect. Ensure your device clock is synchronized and re-enter the 6 digits.",
            });
        }
    };

    if (backupCodes) {
        return (
            <AuthCard
                icon={<CheckCircleIcon className="w-8 h-8 text-yellow-400" />}
                title="2FA Enabled!"
                subtitle="Two-factor authentication is now active on your account"
                badge="SETUP COMPLETE"
            >
                <div className="space-y-5">
                    <Alert
                        type="success"
                        message="Save your emergency backup codes below. Each code can only be used once if you lose access to your authenticator app."
                    />

                    <div className="p-4 rounded-xl bg-zinc-900 border border-yellow-400/30">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                                Emergency Recovery Codes
                            </span>
                            <button
                                type="button"
                                onClick={onCopyCodes}
                                className="text-xs text-yellow-400 hover:text-yellow-300 font-mono hover:underline cursor-pointer"
                            >
                                {copiedCodes ? "✓ Copied" : "Copy All"}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {backupCodes.map((code, idx) => (
                                <div
                                    key={idx}
                                    className="p-2 rounded bg-black/60 border border-zinc-800 text-center font-mono text-xs sm:text-sm text-zinc-200 selection:bg-yellow-400 selection:text-black"
                                >
                                    {code}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            variant="primary"
                            onClick={() => navigate("/dashboard")}
                            fullWidth
                        >
                            Complete & Return to Dashboard
                        </Button>
                    </div>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            icon={<ShieldIcon className="w-8 h-8 text-yellow-400" />}
            title="Setup 2FA"
            subtitle="Add an extra layer of cryptographic protection"
            badge="AUTHENTICATOR SETUP"
        >
            {setupError ? (
                <div className="space-y-4">
                    <Alert type="error" message={setupError} />
                    <Link to="/dashboard" className="block w-full">
                        <Button variant="secondary" fullWidth>
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            ) : isLoadingSetup ? (
                <div className="py-8 flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full border-4 border-zinc-800 border-t-yellow-400 animate-spin" />
                    <p className="text-xs text-zinc-400">Generating cryptographic secret...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                    {user?.isTwoFactorEnabled && (
                        <Alert
                            type="info"
                            message="2FA is already enabled on your account. Completing this will overwrite your previous authenticator configuration."
                        />
                    )}

                    {errors.root && (
                        <Alert type="error" message={errors.root.message || "Failed to verify 2FA"} />
                    )}

                    {/* QR Code Presentation */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                        <div className="p-3 bg-white rounded-xl shadow-md">
                            <QRCodeSVG
                                value={qrCodeUrl}
                                size={170}
                                level="M"
                                includeMargin={false}
                            />
                        </div>
                        <p className="text-xs text-zinc-400 text-center mt-3">
                            Scan this QR code with Google Authenticator, 1Password, or Authy.
                        </p>
                    </div>

                    {/* Manual Secret Code Fallback */}
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
                        <div className="flex items-center justify-between text-zinc-400 mb-1">
                            <span>Manual Entry Key:</span>
                            <button
                                type="button"
                                onClick={onCopySecret}
                                className="text-yellow-400 hover:text-yellow-300 font-medium hover:underline cursor-pointer"
                            >
                                {copiedSecret ? "✓ Copied" : "Copy"}
                            </button>
                        </div>
                        <div className="font-mono text-zinc-200 break-all select-all">
                            {totpSecret}
                        </div>
                    </div>

                    {/* Confirmation Input */}
                    <Input
                        label="Confirmation Code"
                        type="text"
                        placeholder="6-digit code (e.g. 123456)"
                        autoComplete="one-time-code"
                        maxLength={10}
                        icon={<KeyIcon className="w-5 h-5 text-yellow-400" />}
                        error={errors.code?.message}
                        hint="From your app"
                        {...register("code")}
                    />

                    <div className="pt-2">
                        <Button type="submit" loading={isSubmitting} variant="primary">
                            Verify & Activate 2FA
                        </Button>
                    </div>

                    <Divider text="OR" />

                    <div className="text-center">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-zinc-400 hover:text-yellow-400 transition-colors group"
                        >
                            <ArrowLeftIcon className="w-4 h-4 text-yellow-400 group-hover:-translate-x-1 transition-transform" />
                            <span>Cancel and return to dashboard</span>
                        </Link>
                    </div>
                </form>
            )}
        </AuthCard>
    );
};

