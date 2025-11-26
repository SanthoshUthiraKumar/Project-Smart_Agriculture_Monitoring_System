import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: "📊", label: "Dashboard", path: "/analytics" },
    { icon: "🌱", label: "Field Monitor", path: "/analytics" },
    { icon: "💧", label: "Irrigation", path: "#", badge: "3" },
    { icon: "🤖", label: "AI Advisor", path: "#" },
    { icon: "📈", label: "Analytics", path: "/analytics" },
    { icon: "⚙️", label: "Settings", path: "#" },
  ];

  const isActive = (path) => {
    if (path === "#") return false;
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🌾</span>
        <h2>Agro<span>Tech</span></h2>
      </div>

      <div className="menu-section">Navigation</div>

      <nav className="sidebar-menu">
        {menuItems.map((item, index) => (
          <button 
            key={index} 
            className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
            onClick={() => item.path !== "#" && navigate(item.path)}
            disabled={item.path === "#"}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
            {item.badge && <span className="menu-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">AF</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">Admin Farmer</div>
          <div className="sidebar-user-role">Farm Manager</div>
        </div>
      </div>

      <div className="sidebar-footer">
        <p>© 2025 AgroTech Platform</p>
      </div>
    </aside>
  );
};

export default Sidebar;