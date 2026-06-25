import { LayoutDashboard, Users, Trophy, Briefcase, BarChart3, Settings, LogOut, ChevronRight, GraduationCap } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { navItems } from "../../data/mockData";

export function Sidebar({ activeView, onNavigate, collapsed, onLogout }) {
  const navItemsWithIcons = [
    { ...navItems[0], icon: <LayoutDashboard size={18} /> },
    { ...navItems[1], icon: <Users size={18} /> },
    { ...navItems[2], icon: <Trophy size={18} /> },
    { ...navItems[3], icon: <Briefcase size={18} /> },
    { ...navItems[4], icon: <BarChart3 size={18} /> },
    { ...navItems[5], icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 flex-shrink-0 ${collapsed ? "w-[68px]" : "w-[240px]"}`}
      style={{ background: "#1E1B4B" }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b ${collapsed ? "justify-center" : ""}`} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: COLORS.INDIGO }}>
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
        {navItemsWithIcons.map(item => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active ? "text-white" : "text-white/45 hover:text-white/80 hover:bg-white/5"
              } ${collapsed ? "justify-center" : ""}`}
              style={active ? { backgroundColor: COLORS.INDIGO } : {}}
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
