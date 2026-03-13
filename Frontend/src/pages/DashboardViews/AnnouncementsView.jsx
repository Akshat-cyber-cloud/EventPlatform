import { motion } from "framer-motion";
import "../Dashboard.css";

export default function AnnouncementsView() {
  return (
    <motion.div 
      className="view-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="section-title">Announcements</h3>
      <div className="empty-state-card">
        <div className="empty-icon">📢</div>
        <h4>No Recent Announcements</h4>
        <p>Stay tuned for real-time updates from event organizers.</p>
      </div>
    </motion.div>
  );
}
