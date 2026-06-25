import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function MainLayout({ children, activeView, onNavigate, collapsed, onToggle, onLogout }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F8FAFC" }}>
      <Sidebar
        activeView={activeView}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onLogout={onLogout}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onToggle={onToggle} />
        <main className="flex-1 overflow-y-auto px-5 py-5 lg:px-6 lg:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
