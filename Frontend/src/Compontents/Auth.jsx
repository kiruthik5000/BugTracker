import React, { useState } from "react";
import AuthTitle from "./utils/AuthTitle";
import AuthButton from "./utils/AuthButton";
import { loginUser } from "../services/authService";
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
    role: "Developer",
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

    if (isLogin) {
      try {
        setIsSubmitting(true);
        await loginUser({
          username: formValues.email,
          password: formValues.password,
        });
        login();
        nav("/");
      } catch (err) {
        setError("Login failed. Please check your credentials.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12">
        <div className="grid w-full gap-10 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">
              Bug Reporter
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-50 sm:text-5xl">
              {isLogin ? "Welcome back." : "Create your workspace."}
            </h1>
            <p className="mt-4 max-w-md text-base text-slate-300">
              {isLogin
                ? "Track issues faster with clean reports, clear ownership, and smart notifications."
                : "Start a new team space, organize incoming bugs, and keep stakeholders in sync."}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
              <div className="relative flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/70 p-1">
                <span
                  className={`pointer-events-none absolute left-1 top-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm transition-transform duration-300 ${
                    isLogin ? "translate-x-0" : "translate-x-full"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                  }}
                  className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isLogin
                      ? "text-slate-900"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                  }}
                  className={`relative z-10 flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
                    !isLogin
                      ? "text-slate-900"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <div className="mt-6">
                <AuthTitle
                  title={
                    isLogin
                      ? "Sign in to your account"
                      : "Start your free account"
                  }
                  subtitle={
                    isLogin
                      ? "Use your team credentials to continue."
                      : "No credit card needed. Add a team later."
                  }
                />
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <label className="block text-sm text-slate-300">
                    Full name
                    <input
                      type="text"
                      placeholder="Alex Morgan"
                      value={formValues.name}
                      onChange={handleChange("name")}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                    />
                  </label>
                )}
                {!isLogin && (
                  <label className="block text-sm text-slate-300">
                    Role
                    <div className="relative mt-2">
                      <select
                        value={formValues.role}
                        onChange={handleChange("role")}
                        className="w-full appearance-none rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                      >
                        <option className="bg-slate-900 text-white" value="Developer">
                          Developer
                        </option>
                        <option className="bg-slate-900 text-white" value="QA">
                          QA
                        </option>
                        <option
                          className="bg-slate-900 text-white"
                          value="Product Manager"
                        >
                          Product Manager
                        </option>
                        <option className="bg-slate-900 text-white" value="Admin">
                          Admin
                        </option>
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        v
                      </span>
                    </div>
                  </label>
                )}
                <label className="block text-sm text-slate-300">
                  Username or email
                  <input
                    type="text"
                    placeholder="yourname or you@team.com"
                    value={formValues.email}
                    onChange={handleChange("email")}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  />
                </label>
                <label className="block text-sm text-slate-300">
                  Password
                  <input
                    type="password"
                    placeholder="********"
                    value={formValues.password}
                    onChange={handleChange("password")}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  />
                </label>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-slate-900/60 text-cyan-400"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-cyan-300 transition hover:text-cyan-200"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && <p className="text-xs text-rose-300">{error}</p>}

                <AuthButton>
                  {isSubmitting
                    ? "Logging in..."
                    : isLogin
                    ? "Login"
                    : "Create account"}
                </AuthButton>
              </form>

              <p className="mt-6 text-center text-xs text-slate-400">
                {isLogin ? "New here?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(isLogin ? "signup" : "login");
                    setError("");
                  }}
                  className="text-cyan-300 transition hover:text-cyan-200"
                >
                  {isLogin ? "Create one" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
