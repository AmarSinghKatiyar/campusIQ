import { BadgePill } from "../Common";
import { COLORS } from "../../constants/colors";

export function TopStudentsTable({ data = [] }) {
  const avatarColors = [COLORS.INDIGO, COLORS.EMERALD, COLORS.PURPLE, COLORS.AMBER, COLORS.PINK];
  const students = data.length > 0 ? data : [];

  return (
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
              {["Rank", "Student", "Branch", "CGPA", "Status", "Company"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((s, idx) => {
              const badge = s.cgpa >= 9.5 ? "Exceptional" : s.cgpa >= 9.0 ? "Outstanding" : s.cgpa >= 8.5 ? "Excellent" : "Good";
              const rankBg =
                (idx + 1) === 1 ? "bg-amber-50 text-amber-600" :
                (idx + 1) === 2 ? "bg-gray-100 text-gray-500" :
                (idx + 1) === 3 ? "bg-orange-50 text-orange-600" : "bg-gray-50 text-gray-400";
              return (
                <tr
                  key={s._id || idx}
                  className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors cursor-pointer"
                >
                  <td className="px-5 py-3.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${rankBg}`}>
                      {idx + 1}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}
                      >
                        {s.name?.split(" ").map(n => n[0]).join("") || "ST"}
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
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                      {s.placementStatus || "Unplaced"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{s.companyPlaced || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {students.length === 0 && (
        <div className="py-8 text-center text-gray-500">No students found</div>
      )}
    </div>
  );
}
