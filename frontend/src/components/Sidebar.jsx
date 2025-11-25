import React from 'react';
import '../css/Sidebar.css';

const Sidebar = () => {
  const menuItems = [
    { icon: "📊", label: "Dashboard", active: true },
    { icon: "🌱", label: "Crop Health", active: false },
    { icon: "💧", label: "Irrigation", active: false },
    { icon: "🤖", label: "AI Advisor", active: false },
    { icon: "📄", label: "Reports", active: false },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">🌾</span>
        <h2>Agro<span style={{color: 'var(--primary-color)'}}>Tech</span></h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item, index) => (
          <button 
            key={index} 
            className={`menu-item ${item.active ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>© 2025 Smart Farm</p>
      </div>
    </aside>
  );
};

export default Sidebar;