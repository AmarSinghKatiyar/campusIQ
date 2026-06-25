import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { COLORS } from "../../constants/colors";

export function BranchDistribution({ data = [] }) {
  const branchData = data.length > 0 ? data : [];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-0.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Branch-wise Distribution
      </h3>
      <p className="text-xs text-gray-400 mb-3">Eligible students by branch</p>
      {branchData.length > 0 && (
        <ResponsiveContainer width="100%" height={155}>
          <PieChart>
            <Pie
              data={branchData}
              cx="50%"
              cy="50%"
              innerRadius={42}
              outerRadius={68}
              paddingAngle={3}
              dataKey="count"
            >
              {branchData.map((entry, i) => (
                <Cell 
                  key={i} 
                  fill={[COLORS.INDIGO, COLORS.EMERALD, COLORS.PURPLE, COLORS.AMBER, COLORS.PINK][i % 5]} 
                />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
      <div className="space-y-2 mt-1">
        {branchData.map((b, idx) => (
          <div key={b._id || idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0" 
                style={{ backgroundColor: [COLORS.INDIGO, COLORS.EMERALD, COLORS.PURPLE, COLORS.AMBER, COLORS.PINK][idx % 5] }}
              />
              <span className="text-gray-600">{b._id || "Unknown"}</span>
            </div>
            <span className="font-bold text-gray-700">{b.count} students</span>
          </div>
        ))}
      </div>
      {branchData.length === 0 && (
        <div className="py-4 text-center text-sm text-gray-500">No branch data available</div>
      )}
    </div>
  );
}
