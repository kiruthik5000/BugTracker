import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword, compareCode } from "../services/authService";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await forgotPassword(email.trim());
            setSent(true);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to send reset code. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError("");
        if (!/^\d{6}$/.test(code)) {
            setError("Please enter a valid 6-digit code.");
            return;
        }
        setSubmitting(true);
        try {
            await compareCode(email.trim(), code);
            navigate("/reset-password", {
                state: { email: email.trim(), code },
            });
        } catch (err) {
            setError(err?.response?.data?.message || "Invalid or expired code.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-4">
            <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-500">
                    Bug Tracker
                </p>

                {sent ? (
                    <>
                        <h1 className="mt-3 text-xl font-semibold text-gray-800">Enter reset code</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            We&apos;ve sent a 6-digit reset code to{" "}
                            <span className="font-medium text-gray-700">{email}</span>.
                        </p>

                        <form onSubmit={handleVerifyCode} className="mt-6 space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                6-Digit Reset Code
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    required
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-lg font-semibold tracking-[0.4em] text-gray-800 placeholder:tracking-normal placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </label>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Verifying..." : "Verify Code"}
                            </button>
                        </form>

                        <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                            <button
                                type="button"
                                onClick={() => {
                                    setSent(false);
                                    setCode("");
                                    setError("");
                                }}
                                className="font-medium text-blue-600 hover:text-blue-700"
                            >
                                Change email
                            </button>
                            <Link to="/auth" className="font-medium text-blue-600 hover:text-blue-700">
                                Back to Login
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="mt-3 text-xl font-semibold text-gray-800">Forgot your password?</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Enter your email address and we&apos;ll send you a 6-digit code to reset your password.
                        </p>

                        <form onSubmit={handleSendCode} className="mt-6 space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Email address
                                <input
                                    type="email"
                                    placeholder="you@team.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </label>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting ? "Sending..." : "Send Reset Code"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-xs text-gray-500">
                            Remembered your password?{" "}
                            <Link to="/auth" className="font-medium text-blue-600 hover:text-blue-700">
                                Back to Login
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
