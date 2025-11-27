import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`
        bg-hr-card border-r border-hr-border 
        flex flex-col transition-all duration-300 ease-smooth
        ${isCollapsed ? 'w-[60px]' : 'w-[240px]'}
        flex-shrink-0 overflow-hidden relative
      `}
    >
      {/* Sidebar Header */}
      <div className="px-5 py-5 border-b border-hr-border flex items-center justify-between min-h-[70px]">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
          <span className="text-2xl flex-shrink-0">🌾</span>
          <h2 
            className={`
              text-xl font-bold text-hr-green transition-all duration-200
              ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}
            `}
          >
            Agro<span className="text-hr-text">Tech</span>
          </h2>
        </div>
        <button 
          onClick={toggleSidebar}
          className="
            bg-transparent border border-hr-border text-hr-text-secondary
            w-8 h-8 rounded-md cursor-pointer flex items-center justify-center
            transition-all duration-200 flex-shrink-0
            hover:bg-hr-hover hover:border-hr-green hover:text-hr-green
          "
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Menu Section Title */}
      <div 
        className={`
          text-hr-text-secondary text-xs uppercase font-semibold tracking-wider
          px-5 py-5 pb-2 whitespace-nowrap transition-all duration-200
          ${isCollapsed ? 'opacity-0 h-0 py-0' : 'opacity-100'}
        `}
      >
        Navigation
      </div>

      {/* Sidebar Menu */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item, index) => {
          const active = isActive(item.path);
          return (
            <button 
              key={index} 
              onClick={() => item.path !== "#" && navigate(item.path)}
              disabled={item.path === "#"}
              className={`
                flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-md
                transition-all duration-200 mb-1 relative whitespace-nowrap
                ${active 
                  ? 'bg-hr-green/10 text-hr-green font-semibold' 
                  : 'text-hr-text-secondary hover:bg-hr-hover hover:text-hr-text'
                }
                ${item.path === "#" ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              {/* Active Indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-hr-green rounded-r"></div>
              )}
              
              <span className="text-xl flex-shrink-0 w-6 text-center">{item.icon}</span>
              <span className={`transition-all duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                {item.label}
              </span>
              {item.badge && (
                <span 
                  className={`
                    bg-hr-green text-hr-darker text-xs font-bold px-1.5 py-0.5 rounded-full ml-auto
                    transition-all duration-200
                    ${isCollapsed ? 'opacity-0 absolute' : 'opacity-100'}
                  `}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar User */}
      <div className="p-5 border-t border-hr-border">
        <div className="flex items-center gap-3 px-2.5 py-2.5 bg-hr-dark rounded-lg cursor-pointer transition-all duration-200 hover:bg-hr-green/10 overflow-hidden">
          <div className="w-9 h-9 bg-hr-green text-hr-darker rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
            AF
          </div>
          <div 
            className={`
              flex-1 min-w-0 transition-all duration-200
              ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}
            `}
          >
            <div className="font-semibold text-sm text-hr-text whitespace-nowrap overflow-hidden text-ellipsis">
              Admin Farmer
            </div>
            <div className="text-xs text-hr-text-secondary whitespace-nowrap overflow-hidden text-ellipsis">
              Farm Manager
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="px-5 py-4 border-t border-hr-border text-center">
        <p 
          className={`
            text-xs text-hr-text-secondary whitespace-nowrap transition-all duration-200
            ${isCollapsed ? 'opacity-0' : 'opacity-100'}
          `}
        >
          © 2025 AgroTech Platform
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;