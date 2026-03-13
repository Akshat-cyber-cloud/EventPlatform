import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import "./Sidebar.css";

export default function Sidebar() {
  const { logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Announcements", path: "/dashboard/announcements", icon: "🔔" },
    { name: "My Tickets", path: "/dashboard/tickets", icon: "🎟️" },
    { name: "Settings", path: "/dashboard/settings", icon: "⚙️" }
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <h2>ServerLess</h2>
      </div>
      
      <nav className="sidebar-nav">
        {links.map((link) => {
          // Exact match for dashboard, startswith for subroutes if we had deeper nesting
          const isActive = location.pathname === link.path;
          return (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="active-indicator"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-text">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={logout}>
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-text">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
