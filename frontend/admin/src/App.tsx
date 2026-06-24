import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Trophy, Briefcase, BarChart3, Settings,
  LogOut, Search, Bell, ChevronDown, Eye, EyeOff, Check,
  GraduationCap, Target, Zap, Activity,
  ArrowUpRight, ArrowDownRight, Menu, ChevronRight, Building2,
  Mail, Lock, User, IdCard, ShieldCheck, X,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { toast, Toaster } from "sonner";

type Page = "login" | "signup" | "dashboard";
type DashboardView = "dashboard" | "students" | "rankings" | "placements" | "reports" | "settings";

type SignUpForm = {
  fullName: string;
  email: string;
  employeeId: string;
  department: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
};

type InputFieldProps = {
  label: string;
  name: keyof SignUpForm;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  form: SignUpForm;
  setValue: (k: keyof SignUpForm, v: string | boolean) => void;
};

const INDIGO = "#4F46E5";
const EMERALD = "#10B981";

// ─── Data ─────────────────────────────────────────────────────────────────────

const topStudents = [
  { rank: 1, name: "Priya Sharma", branch: "Computer Science", cgpa: 9.8, score: 97, badge: "Exceptional" },
  { rank: 2, name: "Arjun Mehta", branch: "Electronics", cgpa: 9.6, score: 95, badge: "Outstanding" },
  { rank: 3, name: "Sneha Iyer", branch: "Information Tech.", cgpa: 9.5, score: 93, badge: "Outstanding" },
  { rank: 4, name: "Rahul Verma", branch: "Mechanical Eng.", cgpa: 9.3, score: 91, badge: "Excellent" },
  { rank: 5, name: "Kavya Nair", branch: "Computer Science", cgpa: 9.2, score: 89, badge: "Excellent" },
  { rank: 6, name: "Dev Patel", branch: "Civil Eng.", cgpa: 9.1, score: 87, badge: "Good" },
  { rank: 7, name: "Ananya Singh", branch: "Information Tech.", cgpa: 9.0, score: 86, badge: "Good" },
  { rank: 8, name: "Karan Joshi", branch: "Electronics", cgpa: 8.9, score: 84, badge: "Good" },
];

const performanceData = [
  { month: "Jan", score: 72, placements: 8 },
  { month: "Feb", score: 75, placements: 12 },
  { month: "Mar", score: 78, placements: 15 },
  { month: "Apr", score: 74, placements: 10 },
  { month: "May", score: 82, placements: 22 },
  { month: "Jun", score: 85, placements: 28 },
  { month: "Jul", score: 88, placements: 31 },
  { month: "Aug", score: 87, placements: 29 },
  { month: "Sep", score: 91, placements: 38 },
  { month: "Oct", score: 89, placements: 35 },
  { month: "Nov", score: 93, placements: 42 },
  { month: "Dec", score: 96, placements: 48 },
];

const branchData = [
  { name: "Computer Science", value: 38, color: INDIGO },
  { name: "Electronics", value: 24, color: EMERALD },
  { name: "Information Tech.", value: 18, color: "#8B5CF6" },
  { name: "Mechanical", value: 12, color: "#F59E0B" },
  { name: "Civil", value: 8, color: "#EC4899" },
];

const recentActivities = [
  { text: "Priya Sharma completed profile update", time: "2 min ago", type: "profile" },
  { text: "TCS recruitment drive registered — 45 students applied", time: "18 min ago", type: "drive" },
  { text: "New AI scores generated for Batch 2025", time: "1 hr ago", type: "ai" },
  { text: "12 new students registered via student portal", time: "2 hr ago", type: "register" },
  { text: "Infosys interview results uploaded successfully", time: "4 hr ago", type: "result" },
  { text: "Wipro drive scheduled for Dec 28, 2025", time: "6 hr ago", type: "drive" },
];

// ─── Reusable primitives ───────────────────────────────────────────────────────

function PasswordStrength({ password }: { password: string }) {
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ["", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["", "#EF4444", "#F59E0B", EMERALD, INDIGO];

  if (!password) return null;
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= strength ? colors[strength] : "#E5E7EB" }}
          />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: colors[strength] }}>
        {labels[strength]}
      </p>
    </div>
  );
}

function StatCard({
  title, value, subtitle, icon, trend, color, loading,
}: {
  title: string; value: string; subtitle: string; icon: React.ReactNode;
  trend?: string; color: string; loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex justify-between mb-4">
          <div className="w-11 h-11 bg-gray-100 rounded-xl" />
          <div className="w-14 h-6 bg-gray-100 rounded-full" />
        </div>
        <div className="h-8 bg-gray-100 rounded w-20 mb-2" />
        <div className="h-3.5 bg-gray-100 rounded w-28 mb-1" />
        <div className="h-3 bg-gray-100 rounded w-36" />
      </div>
    );
  }
  const positive = trend?.startsWith("+");
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}18` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        {trend && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 px-2 py-1 rounded-full ${
            positive ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"
          }`}>
            {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  );
}

function BadgePill({ label }: { label: string }) {
  const map: Record<string, string> = {
    Exceptional: "bg-indigo-50 text-indigo-700",
    Outstanding: "bg-purple-50 text-purple-700",
    Excellent: "bg-emerald-50 text-emerald-700",
    Good: "bg-amber-50 text-amber-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${map[label] ?? "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  );
}

function ActivityDot({ type }: { type: string }) {
  const map: Record<string, { icon: React.ReactNode; bg: string; fg: string }> = {
    profile: { icon: <User size={12} />, bg: "bg-indigo-50", fg: "text-indigo-600" },
    drive: { icon: <Briefcase size={12} />, bg: "bg-emerald-50", fg: "text-emerald-600" },
    ai: { icon: <Zap size={12} />, bg: "bg-purple-50", fg: "text-purple-600" },
    register: { icon: <GraduationCap size={12} />, bg: "bg-blue-50", fg: "text-blue-600" },
    result: { icon: <Check size={12} />, bg: "bg-green-50", fg: "text-green-600" },
  };
  const c = map[type] ?? map.profile;
  return (
    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${c.bg} ${c.fg}`}>
      {c.icon}
    </div>
  );
}

function InputField({ label, name, type = "text", placeholder, icon, form, setValue }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        <input
          type={type}
          value={form[name] as string}
          onChange={(e) => setValue(name, e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-sm outline-none transition-all bg-white"
        />
      </div>
    </div>
  );
}

// ─── Login ─────────────────────────────────────────────────────────────────────

function LoginPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F8FAFC" }}>
      {/* Left art panel */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #4F46E5 45%, #7C3AED 75%, #065F46 100%)" }}
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
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: EMERALD }}>
                  <Check size={11} className="text-white" />
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
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: INDIGO }}>
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
                  style={{ backgroundColor: remember ? INDIGO : "transparent" }}
                >
                  {remember && <Check size={9} className="text-white" />}
                </button>
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm font-semibold hover:underline" style={{ color: INDIGO }}>
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
              style={{ backgroundColor: INDIGO }}
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

// ─── Sign Up ───────────────────────────────────────────────────────────────────

function SignUpPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const [form, setForm] = useState<SignUpForm>({
    fullName: "", email: "", employeeId: "", department: "",
    password: "", confirmPassword: "", agreed: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k: keyof SignUpForm, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.employeeId || !form.department) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!form.agreed) { toast.error("Please accept the Terms & Conditions"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    toast.success("Account created! Redirecting to sign in...");
    setTimeout(() => onNavigate("login"), 1400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#F8FAFC" }}>
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6">
          <button
            onClick={() => onNavigate("login")}
            className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ChevronRight size={14} className="rotate-180" />
            Back to sign in
          </button>
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: INDIGO }}>
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              CampusIQ
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Create your account
          </h1>
          <p className="text-gray-500 text-sm">Register as a Training & Placement Officer</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Full Name" name="fullName" placeholder="Enter your Name" icon={<User size={15} />} form={form} setValue={set} />
              <InputField label="Employee ID" name="employeeId" placeholder="Enter EMP ID" icon={<IdCard size={15} />} form={form} setValue={set} />
            </div>
            <InputField label="College Email" name="email" type="email" placeholder="officer@university.edu.in" icon={<Mail size={15} />} form={form} setValue={set} />
            <InputField label="Department" name="department" placeholder="Training & Placement Cell" icon={<Building2 size={15} />} form={form} setValue={set} />

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 text-sm outline-none transition-all bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => set("confirmPassword", e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none transition-all bg-white focus:ring-2 ${
                    form.confirmPassword && form.confirmPassword !== form.password
                      ? "border-red-300 focus:ring-red-100"
                      : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-50"
                  }`}
                />
                {form.confirmPassword && form.confirmPassword === form.password && (
                  <Check size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
              <button
                type="button"
                onClick={() => set("agreed", !form.agreed)}
                className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                  form.agreed ? "border-indigo-500" : "border-gray-300"
                }`}
                style={{ backgroundColor: form.agreed ? INDIGO : "transparent" }}
              >
                {form.agreed && <Check size={9} className="text-white" />}
              </button>
              <span className="text-sm text-gray-600">
                I agree to CampusIQ&apos;s{" "}
                <button type="button" className="font-semibold hover:underline" style={{ color: INDIGO }}>
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" className="font-semibold hover:underline" style={{ color: INDIGO }}>
                  Privacy Policy
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
              style={{ backgroundColor: INDIGO }}
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("login")}
              className="font-semibold hover:underline"
              style={{ color: INDIGO }}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Sidebar ─────────────────────────────────────────────────────────

function Sidebar({
  activeView, onNavigate, collapsed, onLogout,
}: {
  activeView: DashboardView;
  onNavigate: (v: DashboardView) => void;
  collapsed: boolean;
  onLogout: () => void;
}) {
  const navItems: { id: DashboardView; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "students", label: "Students", icon: <Users size={18} /> },
    { id: "rankings", label: "Rankings", icon: <Trophy size={18} /> },
    { id: "placements", label: "Placements", icon: <Briefcase size={18} /> },
    { id: "reports", label: "Reports", icon: <BarChart3 size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 flex-shrink-0 ${collapsed ? "w-[68px]" : "w-[240px]"}`}
      style={{ background: "#1E1B4B" }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b ${collapsed ? "justify-center" : ""}`} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: INDIGO }}>
          <GraduationCap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-white font-extrabold text-lg tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            CampusIQ
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active ? "text-white" : "text-white/45 hover:text-white/80 hover:bg-white/5"
              } ${collapsed ? "justify-center" : ""}`}
              style={active ? { backgroundColor: INDIGO } : {}}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && active && <ChevronRight size={13} className="ml-auto opacity-60 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <button
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

// ─── Top Navigation ────────────────────────────────────────────────────────────

function TopNav({ onToggle }: { onToggle: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center px-4 gap-3 flex-shrink-0 relative z-20">
      <button
        onClick={onToggle}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 flex-shrink-0"
      >
        <Menu size={18} />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          placeholder="Search students, drives, reports..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50/80 outline-none focus:border-indigo-300 focus:bg-white transition-all"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-40 overflow-hidden">
                <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="font-bold text-gray-800 text-sm">Notifications</h4>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">3 new</span>
                </div>
                {[
                  { text: "TCS drive approved for Jan 15, 2025", time: "5 min ago" },
                  { text: "25 students completed AI assessment", time: "1 hr ago" },
                  { text: "Monthly placement report is ready", time: "3 hr ago" },
                ].map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-3.5 hover:bg-gray-50 flex gap-3 items-start cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: INDIGO }} />
                    <div>
                      <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs font-semibold" style={{ color: INDIGO }}>View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: INDIGO }}
          >
            RK
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">Dr. Rajesh Kumar</p>
            <p className="text-xs text-gray-400">T&P Officer</p>
          </div>
          <ChevronDown size={13} className="text-gray-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}

// ─── Dashboard Home Content ────────────────────────────────────────────────────

function DashboardHome({ loading }: { loading: boolean }) {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: `linear-gradient(120deg, #312E81 0%, ${INDIGO} 50%, #7C3AED 100%)` }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 right-32 w-24 h-24 rounded-full opacity-10 bg-white translate-y-8" />
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1">Tuesday, December 24, 2024</p>
          <h1 className="text-2xl font-extrabold text-white mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Good morning, Dr. Rajesh 👋
          </h1>
          <p className="text-indigo-200 text-sm">
            6 active placement drives · 3 interviews scheduled this week · 94% placement rate
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard loading={loading} title="Total Students" value="1,847" subtitle="Enrolled this academic year" icon={<Users size={20} />} trend="+12%" color={INDIGO} />
        <StatCard loading={loading} title="Eligible Students" value="1,203" subtitle="Meeting 7.0+ CGPA criteria" icon={<GraduationCap size={20} />} trend="+8%" color={EMERALD} />
        <StatCard loading={loading} title="Avg. AI Score" value="78.4" subtitle="Across all assessed students" icon={<Target size={20} />} trend="+3.2" color="#8B5CF6" />
        <StatCard loading={loading} title="Active Drives" value="6" subtitle="3 interviews scheduled this week" icon={<Briefcase size={20} />} trend="+2" color="#F59E0B" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Charts + Table */}
        <div className="xl:col-span-2 space-y-6">
          {/* Area chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Student Performance Overview
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Average AI score and confirmed placements — 2024</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: INDIGO }} />
                  AI Score
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: EMERALD }} />
                  Placements
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={performanceData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={INDIGO} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={INDIGO} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPlace" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={EMERALD} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={EMERALD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12, border: "1px solid #E2E8F0",
                    fontSize: 12, boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  }}
                />
                <Area type="monotone" dataKey="score" stroke={INDIGO} strokeWidth={2.5} fill="url(#gScore)" name="AI Score" dot={false} />
                <Area type="monotone" dataKey="placements" stroke={EMERALD} strokeWidth={2.5} fill="url(#gPlace)" name="Placements" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top students table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Top Ranked Students
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Sorted by AI Score · Batch 2025</p>
              </div>
              <button className="text-xs font-semibold px-3.5 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    {["Rank", "Student", "Branch", "CGPA", "AI Score", "Badge"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topStudents.map(s => {
                    const avatarColors = [INDIGO, EMERALD, "#8B5CF6", "#F59E0B", "#EC4899"];
                    const rankBg =
                      s.rank === 1 ? "bg-amber-50 text-amber-600" :
                      s.rank === 2 ? "bg-gray-100 text-gray-500" :
                      s.rank === 3 ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-400";
                    return (
                      <tr
                        key={s.rank}
                        className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
                      >
                        <td className="px-5 py-3.5">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${rankBg}`}>
                            {s.rank}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: avatarColors[s.rank % avatarColors.length] }}
                            >
                              {s.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{s.branch}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-bold text-gray-800">{s.cgpa}</span>
                          <span className="text-xs text-gray-400">/10</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${s.score}%`, backgroundColor: INDIGO }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-800">{s.score}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><BadgePill label={s.badge} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Pie + Activity */}
        <div className="space-y-5">
          {/* Branch distribution */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Branch-wise Distribution
            </h3>
            <p className="text-xs text-gray-400 mb-3">Eligible students by branch</p>
            <ResponsiveContainer width="100%" height={155}>
              <PieChart>
                <Pie
                  data={branchData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {branchData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-1">
              {branchData.map(b => (
                <div key={b.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                    <span className="text-gray-600">{b.name}</span>
                  </div>
                  <span className="font-bold text-gray-700">{b.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Recent Activity
              </h3>
              <Activity size={14} className="text-gray-300" />
            </div>
            <div className="space-y-3.5">
              {recentActivities.map((a, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <ActivityDot type={a.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-snug">{a.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="w-full mt-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >
              View all activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Placeholder views ─────────────────────────────────────────────────────────

function PlaceholderView({
  title, desc, icon,
}: {
  title: string; desc: string; icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-sm">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: `${INDIGO}12`, color: INDIGO }}
        >
          {icon}
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {title}
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        <button
          className="mt-6 px-6 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all"
          style={{ backgroundColor: INDIGO }}
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard Layout ──────────────────────────────────────────────────────────

function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<DashboardView>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const content = (() => {
    switch (view) {
      case "dashboard": return <DashboardHome loading={loading} />;
      case "students": return (
        <PlaceholderView
          title="Student Management"
          desc="View, filter, and manage all student profiles, eligibility status, and placement history."
          icon={<Users size={28} />}
        />
      );
      case "rankings": return (
        <PlaceholderView
          title="Student Rankings"
          desc="AI-powered ranking system based on CGPA, aptitude scores, communication, and project portfolio."
          icon={<Trophy size={28} />}
        />
      );
      case "placements": return (
        <PlaceholderView
          title="Placement Drives"
          desc="Create and manage company drives, interview schedules, selection rounds, and offer tracking."
          icon={<Briefcase size={28} />}
        />
      );
      case "reports": return (
        <PlaceholderView
          title="Reports & Analytics"
          desc="Generate placement reports, export to PDF/Excel, and view year-over-year performance trends."
          icon={<BarChart3 size={28} />}
        />
      );
      case "settings": return (
        <PlaceholderView
          title="Account Settings"
          desc="Manage your profile, notification preferences, institutional configuration, and integrations."
          icon={<Settings size={28} />}
        />
      );
    }
  })();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F8FAFC" }}>
      <Sidebar
        activeView={view}
        onNavigate={setView}
        collapsed={collapsed}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav onToggle={() => setCollapsed(v => !v)} />
        <main className="flex-1 overflow-y-auto px-5 py-5 lg:px-6 lg:py-6">
          {content}
        </main>
      </div>
    </div>
  );
}

// ─── App Root ──────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("login");

  return (
    <>
      <Toaster richColors position="top-center" closeButton />
      {page === "login" && <LoginPage onNavigate={setPage} />}
      {page === "signup" && <SignUpPage onNavigate={setPage} />}
      {page === "dashboard" && <DashboardLayout onLogout={() => setPage("login")} />}
    </>
  );
}
