import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  LogIn,
  UserPlus,
  Mail,
  Phone,
  Lock,
  User,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginUser, signupUser } from "../../features/auth/authSlice";
import { selectAuth } from "../../features/auth/authSlice";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error, isAuthenticated } = useAppSelector(selectAuth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  //const handleToggle = () => {
  // setIsLogin(!isLogin);
  // setFormData({ name: "", email: "", phone: "", password: "" });
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let resultAction;

    if (isLogin) {
      resultAction = await dispatch(
        loginUser({
          phone: formData.phone,
          password: formData.password,
        }),
      );
    } else {
      resultAction = await dispatch(signupUser(formData));
    }

    if (
      loginUser.fulfilled.match(resultAction) ||
      signupUser.fulfilled.match(resultAction)
    ) {
      navigate("/chat");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--bg-deep)]">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-40" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-2xl border border-white/10 bg-[var(--bg-card)] backdrop-blur-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-[var(--text-muted)] text-sm">
            {isLogin
              ? "Login to access your chats"
              : "Get started with your account today"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-[var(--bg-surface)] rounded-lg p-1 mb-6 border border-white/5">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              isLogin
                ? "bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/20"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              !isLogin
                ? "bg-[var(--brand-primary)] text-white shadow-lg shadow-[var(--brand-primary)]/20"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-[var(--bg-surface)] border border-white/10 text-[var(--text-main)] pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent placeholder-gray-500 transition-all"
                required={!isLogin}
              />
            </div>
          )}

          {/* Email Field */}
          {!isLogin && (
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-[var(--bg-surface)] border border-white/10 text-[var(--text-main)] pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent placeholder-gray-500 transition-all"
                required={!isLogin}
              />
            </div>
          )}

          {/* Phone Number */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-[var(--bg-surface)] border border-white/10 text-[var(--text-main)] pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent placeholder-gray-500 transition-all"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)]" />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-[var(--bg-surface)] border border-white/10 text-[var(--text-main)] pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent placeholder-gray-500 transition-all"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white font-semibold py-3 rounded-lg shadow-lg shadow-[var(--brand-primary)]/20 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn className="h-5 w-5" /> Login
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" /> Sign Up
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
