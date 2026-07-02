import React from 'react';

function DashboardIcon({ name }) {
  return <span className={`dashboard-icon icon-${name}`} aria-hidden="true" />;
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'opportunities', label: 'Opportunities', icon: 'briefcase' },
  { id: 'interviews', label: 'Interviews', icon: 'calendar' },
  // { id: 'learning', label: 'Learning', icon: 'book' },
  { id: 'assessments', label: 'Assessments', icon: 'clock' },
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const Sidebar = ({ activeView, onNavigate, onLogout }) => {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-brand">
        <span className="brand-mark">
          <DashboardIcon name="cap" />
        </span>
        <span>CampusIQ</span>
      </div>

      <nav className="dashboard-nav" aria-label="Student dashboard">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={activeView === item.id ? 'nav-item active' : 'nav-item'}
            onClick={() => onNavigate(item.id, item.label)}
          >
            <DashboardIcon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button type="button" className="sidebar-logout" onClick={onLogout}>
        <DashboardIcon name="logout" />
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
