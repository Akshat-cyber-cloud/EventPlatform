import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import "../Dashboard.css";

export default function EventsView() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setLoading(false);
    };
    
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="loader">Loading Events...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="view-content">
      <h3 className="section-title">Upcoming Events</h3>
      <motion.div 
        className="events-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {events.length === 0 ? (
          <motion.div variants={itemVariants} className="no-events-container">
              <p className="no-events">No upcoming events at the moment. Check back later!</p>
          </motion.div>
        ) : (
          events.map(event => (
            <motion.div key={event.id} variants={itemVariants} className="event-card">
              <div className="event-card-header">
                <h3 className="event-title">{event.title}</h3>
                <span className="event-badge">Upcoming</span>
              </div>
              <div className="event-meta">
                  <span className="event-date">📅 {event.date || 'TBD'}</span>
                  <span className="event-location">📍 {event.location || 'TBA'}</span>
              </div>
              <p className="event-content">{event.content}</p>
              
              <div className="event-footer">
                  <button className="btn btn-primary btn-full">RSVP Now</button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
