import { useState } from "react";
import { Menu, Search, Bell, ChevronDown, X } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { notificationsList } from "../../data/mockData";

export function Header({ onToggle }) {
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
                {notificationsList.map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-3.5 hover:bg-gray-50 flex gap-3 items-start cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: COLORS.INDIGO }} />
                    <div>
                      <p className="text-sm text-gray-700 leading-snug">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5 text-center">
                  <button className="text-xs font-semibold" style={{ color: COLORS.INDIGO }}>View all notifications</button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <button className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: COLORS.INDIGO }}
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
