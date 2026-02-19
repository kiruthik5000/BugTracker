import React, { useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
    const { login } = useAuth();
    const [mode, setMode] = useState("login");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nav = useNavigate();
    const isLogin = mode === "login";

    const [formValues, setFormValues] = useState({
        name: "",
        email: "",
        password: "",
        role: "DEVELOPER",
    });

    const handleChange = (field) => (event) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            if (isLogin) {
                await loginUser({
                    username: formValues.email,
                    password: formValues.password,
                });
            } else {
                await registerUser({
                    username: formValues.name,
                    email: formValues.email,
                    password: formValues.password,
                    role: formValues.role,
                });
            }
            await login();
            nav("/");
        } catch (err) {
            setError(
                isLogin
                    ? "Login failed. Please check your credentials."
                    : "Registration failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="mx-4 grid w-full max-w-5xl gap-10 lg:grid-cols-2">
                {/* Left — Branding */}
                <div className="flex flex-col justify-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-500">
                        Bug Tracker
                    </p>
                    <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-800 sm:text-5xl">
                        {isLogin ? "Welcome back." : "Create your workspace."}
                    </h1>
                    <p className="mt-4 max-w-md text-base text-gray-500">
                        {isLogin
                            ? "Track issues faster with clean reports, clear ownership, and smart notifications."
                            : "Start a new team space, organize incoming bugs, and keep stakeholders in sync."}
                    </p>
                </div>

                {/* Right — Form Card */}
                <div className="flex items-center justify-center">
                    <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
                        {/* Toggle */}
                        <div className="relative flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 p-1">
                            <span
                                className={`pointer-events-none absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm transition-transform duration-300 ${
                                    isLogin ? "translate-x-0" : "translate-x-full"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => { setMode("login"); setError(""); }}
                                className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                                    isLogin ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode("signup"); setError(""); }}
                                className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                                    !isLogin ? "text-gray-800" : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Title */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {isLogin ? "Sign in to your account" : "Start your free account"}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                {isLogin
                                    ? "Use your team credentials to continue."
                                    : "No credit card needed. Add a team later."}
                            </p>
                        </div>

                        {/* Form */}
                        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                            {!isLogin && (
                                <label className="block text-sm font-medium text-gray-700">
                                    Full name
                                    <input
                                        type="text"
                                        placeholder="Alex Morgan"
                                        value={formValues.name}
                                        onChange={handleChange("name")}
                                        required
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                            )}
                            {!isLogin && (
                                <label className="block text-sm font-medium text-gray-700">
                                    Role
                                    <select
                                        value={formValues.role}
                                        onChange={handleChange("role")}
                                        className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="DEVELOPER">Developer</option>
                                        <option value="TESTER">Tester</option>
                                        <option value="PROJECT_MANAGER">Project Manager</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </label>
                            )}
                            <label className="block text-sm font-medium text-gray-700">
                                Username or email
                                <input
                                    type="text"
                                    placeholder="yourname or you@team.com"
                                    value={formValues.email}
                                    onChange={handleChange("email")}
                                    required
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </label>
                            <label className="block text-sm font-medium text-gray-700">
                                Password
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={formValues.password}
                                    onChange={handleChange("password")}
                                    required
                                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </label>

                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isSubmitting
                                    ? "Please wait..."
                                    : isLogin
                                    ? "Login"
                                    : "Create account"}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-xs text-gray-500">
                            {isLogin ? "New here?" : "Already have an account?"}{" "}
                            <button
                                type="button"
                                onClick={() => { setMode(isLogin ? "signup" : "login"); setError(""); }}
                                className="font-medium text-blue-600 transition hover:text-blue-700"
                            >
                                {isLogin ? "Create one" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
