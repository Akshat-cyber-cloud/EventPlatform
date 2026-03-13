import { motion } from "framer-motion";
import "../Dashboard.css";

export default function TicketsView() {
  return (
    <motion.div 
      className="view-content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="section-title">My Tickets</h3>
      <div className="empty-state-card">
        <div className="empty-icon">🎟️</div>
        <h4>No Tickets Yet</h4>
        <p>You haven't purchased or RSVP'd to any events yet.</p>
        <button className="btn btn-primary" style={{marginTop: '1.5rem'}}>Browse Events</button>
      </div>
    </motion.div>
  );
}
