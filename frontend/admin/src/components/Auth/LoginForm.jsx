import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, X, ChevronRight, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { COLORS } from "../../constants/colors";
import { authAPI } from "../../services/api";
import authService from "../../services/authService";

export function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await authAPI.login(email, password);
      authService.setToken(response.token);
      authService.setAdmin({
        id: response._id,
        name: response.name,
        email: response.email,
      });
      toast.success("Logged in successfully!");
      onNavigate("dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed");
      setErrors({ form: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F8FAFC" }}>
      {/* Left art panel */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, #1E1B4B 0%, ${COLORS.INDIGO} 45%, #7C3AED 75%, #065F46 100%)` }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-10 bg-white" />
        <div className="absolute top-1/3 -right-12 w-56 h-56 rounded-full" style={{ background: "rgba(16,185,129,0.2)" }} />
        <div className="absolute bottom-1/3 -left-8 w-36 h-36 rounded-full" style={{ background: "rgba(129,140,248,0.25)" }} />

        {/* Glass card */}
        <div
          className="relative z-10 rounded-3xl p-10 mx-12 max-w-md text-white"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.18)" }}
            >
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              CampusIQ
            </span>
          </div>

          <h2 className="text-3xl font-extrabold mb-3 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Smarter placements,<br />powered by AI.
          </h2>
          <p className="text-white/65 text-sm leading-relaxed mb-8">
            Manage your institution's Training & Placement operations with AI-driven insights, real-time rankings, and automated workflows.
          </p>

          <div className="space-y-3">
            {[
              "AI-powered student scoring & ranking",
              "Real-time placement analytics",
              "Automated recruitment drive management",
            ].map(f => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.EMERALD }}>
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                <span className="text-sm text-white/80">{f}</span>
              </div>
            ))}
          </div>

          {/* Mini stat strip */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
            {[["1,847", "Students"], ["94%", "Placement Rate"], ["6", "Active Drives"]].map(([n, l]) => (
              <div key={l}>
                <p className="text-xl font-bold">{n}</p>
                <p className="text-xs text-white/55">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.INDIGO }}>
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              CampusIQ
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Welcome back
          </h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your T&P Officer account</p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">College Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="officer@university.edu"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-white ${
                    errors.email
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-50"
                  }`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X size={11} />{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 bg-white ${
                    errors.password
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-50"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X size={11} />{errors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setRemember(v => !v)}
                  className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all ${
                    remember ? "border-indigo-500" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: remember ? COLORS.INDIGO : "transparent" }}
                >
                  {remember && <span className="text-white text-xs">✓</span>}
                </button>
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold hover:underline" style={{ color: COLORS.INDIGO }}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ backgroundColor: COLORS.INDIGO }}
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
                : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative flex justify-center"><span className="bg-gray-50 px-3 text-xs text-gray-400">New to CampusIQ?</span></div>
          </div>

          <button
            onClick={() => onNavigate("signup")}
            className="w-full py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all text-gray-600"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
