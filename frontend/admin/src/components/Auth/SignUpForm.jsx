import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Check, User, IdCard, Building2, ShieldCheck, ChevronRight, GraduationCap } from "lucide-react";
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

  const set = (k, v) =>
    setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.employeeId || !form.department) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!form.agreed) { toast.error("Please accept the Terms & Conditions"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: COLORS.INDIGO }}>
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
  );
}
