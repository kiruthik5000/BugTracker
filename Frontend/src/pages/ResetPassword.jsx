import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";

const ResetPassword = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = location.state?.email || searchParams.get("email") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Missing email. Please request and verify a reset code first.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setSubmitting(true);
        try {
            await resetPassword({ email, newPassword });
            setDone(true);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to reset password. Please try again.");
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

                {done ? (
                    <div className="mt-4 space-y-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
                            ✅
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">Password updated</h1>
                        <p className="text-sm text-gray-500">
                            Your password has been reset successfully. You can now sign in with your new password.
                        </p>
                        <button
                            type="button"
                            onClick={() => navigate("/auth")}
                            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            Sign In
                        </button>
                    </div>
                ) : (
                    <>
                        <h1 className="mt-3 text-xl font-semibold text-gray-800">Reset your password</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Enter a new password for your account.
                        </p>

                        {!email && (
                            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
                                No verified email found. Please{" "}
                                <Link to="/forgot-password" className="font-semibold underline">
                                    request and verify a reset code
                                </Link>.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            <label className="block text-sm font-medium text-gray-700">
                                New Password
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </label>

                            <label className="block text-sm font-medium text-gray-700">
                                Confirm Password
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                                {submitting ? "Updating..." : "Reset Password"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-xs text-gray-500">
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

export default ResetPassword;
