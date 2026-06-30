import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS } from "../../constants/colors";

export function PerformanceChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { month: "Jan", score: 72, placements: 8 },
    { month: "Feb", score: 75, placements: 12 },
    { month: "Mar", score: 78, placements: 15 },
  ];

  return (
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
            <span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: COLORS.INDIGO }} />
            AI Score
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: COLORS.EMERALD }} />
            Placements
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={210}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.INDIGO} stopOpacity={0.12} />
              <stop offset="95%" stopColor={COLORS.INDIGO} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gPlace" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.EMERALD} stopOpacity={0.12} />
              <stop offset="95%" stopColor={COLORS.EMERALD} stopOpacity={0} />
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
          <Area type="monotone" dataKey="score" stroke={COLORS.INDIGO} strokeWidth={2.5} fill="url(#gScore)" name="AI Score" dot={false} />
          <Area type="monotone" dataKey="placements" stroke={COLORS.EMERALD} strokeWidth={2.5} fill="url(#gPlace)" name="Placements" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
