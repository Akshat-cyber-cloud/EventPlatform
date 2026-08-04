import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ADMIN_EMAIL } from "./AdminRoute";
import { motion } from "framer-motion";
import "./Sidebar.css";

export default function Sidebar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isAdmin = currentUser && currentUser.email && currentUser.email.trim().toLowerCase() === ADMIN_EMAIL;

  const links = [
    { 
      name: "Dashboard", 
      path: "/dashboard", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
      ) 
    },
    { 
      name: "Announcements", 
      path: "/dashboard/announcements", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
      ) 
    },
    { 
      name: "My Tickets", 
      path: "/dashboard/tickets", 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
      ) 
    }
  ];

  if (isAdmin) {
    links.push({
      name: "👑 Admin Portal",
      path: "/admin",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      )
    });
  }

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <h2><span className="logo-icon-accent">❖</span> Eventix</h2>
        {isAdmin && <span className="admin-status-badge" style={{ fontSize: '0.68rem', fontWeight: 800, background: '#fff8e6', color: '#b37400', border: '1px solid #ffe099', padding: '0.15rem 0.5rem', borderRadius: '12px', marginTop: '0.4rem', display: 'inline-block', letterSpacing: '0.8px' }}>👑 ADMIN ACTIVE</span>}
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => {
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
          <span className="sidebar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          </span>
          <span className="sidebar-text">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
