import {
  ArrowDownRight,
  ArrowUpRight,
  User,
  Briefcase,
  Zap,
  GraduationCap,
  Check,
} from "lucide-react";
import { COLORS } from "../constants/colors";

export function PasswordStrength({ password }) {
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ["", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["", "#EF4444", "#F59E0B", COLORS.EMERALD, COLORS.INDIGO];

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

export function StatCard({
  title, value, subtitle, icon, trend, color, loading,
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

export function BadgePill({ label }) {
  const map = {
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

export function ActivityDot({ type }) {
  const map = {
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