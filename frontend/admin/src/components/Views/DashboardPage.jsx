import { useState, useEffect } from "react";
import { MainLayout } from "../Layout/MainLayout";
import { DashboardHome } from "../Dashboard/DashboardHome";
import { StudentsView } from "./StudentsView";
import { RankingsView } from "./RankingsView";
import { PlacementsView } from "./PlacementsView";
import { ReportsView } from "./ReportsView";
import { SettingsView } from "./SettingsView";

export function DashboardPage({ onLogout }) {
  const [view, setView] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const getContent = () => {
    switch (view) {
      case "dashboard": return <DashboardHome loading={loading} />;
      case "students": return <StudentsView />;
      case "rankings": return <RankingsView />;
      case "placements": return <PlacementsView />;
      case "reports": return <ReportsView />;
      case "settings": return <SettingsView />;
      default: return <DashboardHome loading={loading} />;
    }
  };

  return (
    <MainLayout
      activeView={view}
      onNavigate={setView}
      collapsed={collapsed}
      onToggle={() => setCollapsed(v => !v)}
      onLogout={onLogout}
    >
      {getContent()}
    </MainLayout>
  );
}
