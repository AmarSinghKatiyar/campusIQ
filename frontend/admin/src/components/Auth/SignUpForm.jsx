import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Check, User, IdCard, Building2, ShieldCheck, ChevronRight, GraduationCap, X } from "lucide-react";
import { toast } from "sonner";
import { InputField } from "./InputField";
import { PasswordStrength } from "../Common";
import { COLORS } from "../../constants/colors";
import { authAPI } from "../../services/api";
import authService from "../../services/authService";

export function SignUpPage({ onNavigate }) {
  const [form, setForm] = useState({
    fullName: "", email: "", employeeId: "", department: "",
    password: "", confirmPassword: "", agreed: false,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) {
      setErrors(prev => ({ ...prev, [k]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.employeeId.trim()) newErrors.employeeId = "Employee ID is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!form.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!form.agreed) newErrors.agreed = "Please accept the Terms & Conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authAPI.register({
        name: form.fullName,
        email: form.email,
        password: form.password,
      });
      authService.setToken(response.token);
      authService.setAdmin({
        id: response._id,
        name: response.name,
        email: response.email,
      });
      toast.success("Account created successfully!");
      setTimeout(() => onNavigate("dashboard"), 500);
    } catch (error) {
      toast.error(error.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F8FAFC" }}>
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, #1E1B4B 0%, ${COLORS.INDIGO} 45%, #7C3AED 75%, #065F46 100%)` }}
      >
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full opacity-10 bg-white" />
        <div className="absolute top-1/3 -right-12 w-56 h-56 rounded-full" style={{ background: "rgba(16,185,129,0.2)" }} />
        <div className="absolute bottom-1/3 -left-8 w-36 h-36 rounded-full" style={{ background: "rgba(129,140,248,0.25)" }} />

        <div
          className="relative z-10 rounded-3xl p-10 mx-12 max-w-md text-white"
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.18)" }}>
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
            Build your T&P officer workspace with AI-driven insights, real-time analytics, and a seamless placement workflow.
          </p>

          <div className="space-y-3">
            {[
              "AI-powered student scoring & ranking",
              "Real-time placement analytics",
              "Automated recruitment drive management",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.EMERALD }}>
                  <span className="text-white font-bold text-xs">✓</span>
                </div>
                <span className="text-sm text-white/80">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
            {[['1,847', 'Students'], ['94%', 'Placement Rate'], ['6', 'Active Drives']].map(([value, label]) => (
              <div key={label}>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-white/55">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[520px]">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.INDIGO }}>
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              CampusIQ
            </span>
          </div>

          <div className="text-center lg:text-left mb-6">
            <button
              onClick={() => onNavigate("login")}
              className="inline-flex items-center gap-2 mb-6 text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <ChevronRight size={14} className="rotate-180" />
              Back to sign in
            </button>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Create your account
            </h1>
            <p className="text-gray-500 text-sm">Register as a Training & Placement Officer</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <InputField label="Full Name" name="fullName" placeholder="Enter your Name" icon={<User size={15} />} form={form} setValue={set} />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X size={11} />{errors.fullName}</p>}
                </div>
                <div>
                  <InputField label="Employee ID" name="employeeId" placeholder="Enter EMP ID" icon={<IdCard size={15} />} form={form} setValue={set} />
                  {errors.employeeId && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X size={11} />{errors.employeeId}</p>}
                </div>
              </div>
              <div>
                <InputField label="College Email" name="email" type="email" placeholder="officer@university.edu.in" icon={<Mail size={15} />} form={form} setValue={set} />
                {errors.email && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X size={11} />{errors.email}</p>}
              </div>
              <div>
                <InputField label="Department" name="department" placeholder="Training & Placement Cell" icon={<Building2 size={15} />} form={form} setValue={set} />
                {errors.department && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X size={11} />{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={e => set("password", e.target.value)}
                    placeholder="Min. 8 characters"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm outline-none transition-all bg-white focus:ring-2 ${
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
                <PasswordStrength password={form.password} />
              </div>

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
                      errors.confirmPassword
                        ? "border-red-300 focus:ring-red-100"
                        : form.confirmPassword && form.confirmPassword === form.password
                          ? "border-emerald-300 focus:border-emerald-400 focus:ring-emerald-50"
                          : "border-gray-200 focus:border-indigo-400 focus:ring-indigo-50"
                    }`}
                  />
                  {form.confirmPassword && form.confirmPassword === form.password && (
                    <Check size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                  )}
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X size={11} />{errors.confirmPassword}</p>}
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                <button
                  type="button"
                  onClick={() => set("agreed", !form.agreed)}
                  className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                    form.agreed ? "border-indigo-500" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: form.agreed ? COLORS.INDIGO : "transparent" }}
                >
                  {form.agreed && <Check size={9} className="text-white" />}
                </button>
                <span className="text-sm text-gray-600">
                  I agree to CampusIQ&apos;s{" "}
                  <button type="button" className="font-semibold hover:underline" style={{ color: COLORS.INDIGO }}>
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button type="button" className="font-semibold hover:underline" style={{ color: COLORS.INDIGO }}>
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X size={11} />{errors.agreed}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
                style={{ backgroundColor: COLORS.INDIGO }}
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
                style={{ color: COLORS.INDIGO }}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
