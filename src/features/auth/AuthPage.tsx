import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  UserPlus,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  Shield,
  Zap,
  User,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  loginUser,
  resetError,
  signupUser,
} from "../../features/auth/authSlice";
import { selectAuth } from "../../features/auth/authSlice";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { loading, error } = useAppSelector(selectAuth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetError());
    }
  }, [error, dispatch]);

  const handleToggle = () => {
    if (loading) {
      toast.error(
        `Please wait, ${isLogin ? "Login" : "Signup"} is in process.`,
      );
      return;
    }

    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", phone: "", password: "" });
    dispatch(resetError());
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.phone) {
      toast.error("Phone number is required.");
      return;
    }
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    if (!formData.password) {
      toast.error("Password is required.");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        toast.error("Full name is required.");
        return;
      }
      if (formData.name.trim().length < 3) {
        toast.error("Full name must be at least 3 characters.");
        return;
      }

      if (!formData.email) {
        toast.error("Email address is required.");
        return;
      }
      if (!isValidEmail(formData.email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
    }

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
      navigate("/chats");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:grid lg:grid-cols-2 bg-[var(--bg-deep)] overflow-y-auto">
      {/* Left Side  */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-center items-center p-12 border-r border-white/5">
        <div className="absolute inset-0 bg-grid-pattern pointer-events-none z-0 opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--brand-primary)]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-lg w-full space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
              Real-time chat, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] via-purple-400 to-[var(--brand-accent)]">
                simplified.
              </span>
            </h1>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed">
              Connect with friends and colleagues instantly. Experience a fast,
              secure, and seamless messaging platform.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white">
                <Shield className="h-4 w-4 text-green-400" /> End-to-End
                Encrypted
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-white">
                <Zap className="h-4 w-4 text-yellow-400" /> Lightning Fast
              </div>
            </div>
          </div>

          <div className="relative perspective-1000 mt-8 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-500">
            <div className="rounded-2xl border border-white/10 bg-[var(--bg-surface)]/60 backdrop-blur-xl p-4 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500"></div>
                <div className="h-2 w-24 bg-white/20 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-8 w-3/4 bg-white/10 rounded-lg rounded-tl-none"></div>
                <div className="h-8 w-1/2 ml-auto bg-[var(--brand-primary)]/50 rounded-lg rounded-tr-none"></div>
                <div className="h-2 w-16 ml-auto bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="min-h-screen flex flex-col items-center justify-center p-8 relative lg:min-h-0 lg:flex-1">
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--brand-accent)]/5 rounded-full blur-[80px] pointer-events-none" />
        <Link
          to="/"
          className="absolute top-8 left-8 z-20 p-2 rounded-full hover:bg-white/5 text-[var(--text-muted)] hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="w-full max-w-md z-10 animate-fade-in-up">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
          </div>

          <div className="flex bg-[var(--bg-surface)]/50 p-1 rounded-xl mb-8 border border-white/5 relative max-w-[300px]">
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-[var(--brand-primary)] shadow-lg shadow-[var(--brand-primary)]/20 transition-all duration-300 ease-in-out ${
                isLogin ? "left-1" : "left-1/2 ml-1"
              }`}
            />
            <button
              type="button"
              onClick={handleToggle}
              disabled={loading}
              className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-300 ${
                isLogin
                  ? "text-white"
                  : "text-[var(--text-muted)] hover:text-white"
              } ${loading ? "cursor-not-allowed" : ""}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleToggle}
              disabled={loading}
              className={`flex-1 relative z-10 py-2 text-sm font-medium transition-colors duration-300 ${
                !isLogin
                  ? "text-white"
                  : "text-[var(--text-muted)] hover:text-white"
              } ${loading ? "cursor-not-allowed" : ""}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--brand-primary)] transition-colors" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-[var(--bg-surface)]/30 border border-white/10 text-[var(--text-main)] pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 placeholder-[var(--text-muted)] transition-all"
                />
              </div>
            )}

            {!isLogin && (
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--brand-primary)] transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[var(--bg-surface)]/30 border border-white/10 text-[var(--text-main)] pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 placeholder-[var(--text-muted)] transition-all"
                />
              </div>
            )}

            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--brand-primary)] transition-colors" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full bg-[var(--bg-surface)]/30 border border-white/10 text-[var(--text-main)] pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 placeholder-[var(--text-muted)] transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-muted)] group-focus-within:text-[var(--brand-primary)] transition-colors" />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-[var(--bg-surface)]/30 border border-white/10 text-[var(--text-main)] pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 placeholder-[var(--text-muted)] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] hover:brightness-110 text-white font-bold py-4 rounded-xl shadow-lg shadow-[var(--brand-primary)]/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isLogin ? (
                <>
                  Login <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  Create Account <UserPlus className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
