import { useState } from "react";
import { Activity } from "lucide-react";
import { ActivityDot } from "../Common";

const PAGE_SIZE = 5;

export function RecentActivityPanel({ data = [] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const activities = data || [];
  const visible = activities.slice(0, visibleCount);
  const hasMore = visibleCount < activities.length;

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Recent Activity
        </h3>
        <Activity size={14} className="text-gray-300" />
      </div>

      <div className="space-y-3.5">
        {visible.map((a, i) => (
          <div key={i} className="flex gap-3 items-start">
            <ActivityDot type={a.type || "profile"} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 leading-snug">{a.text || a.description || "Activity"}</p>
              <p className="text-xs text-gray-400 mt-0.5">{a.time || a.timestamp || "Recently"}</p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="py-4 text-center text-sm text-gray-500">No activities yet</div>
      )}

      {hasMore && (
        <button
          onClick={handleViewMore}
          className="w-full mt-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-all"
        >
          View full activity
        </button>
      )}
    </div>
  );
}