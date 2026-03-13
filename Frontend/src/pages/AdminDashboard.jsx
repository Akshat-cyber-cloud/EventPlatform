import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, orderBy, query } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleCreate = async () => {
    if (!title || !content || !date || !location) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        title,
        content,
        date,
        location,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setContent("");
      setDate("");
      setLocation("");
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <div className="dashboard-actions">
           <Link to="/dashboard" className="btn btn-secondary">View User Dashboard</Link>
           <Link to="/" className="btn btn-secondary" style={{marginLeft: '10px'}}>Home</Link>
        </div>
      </div>
      
      <div className="admin-create-form">
        <h3>Create New Event</h3>
        <div className="form-group">
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" className="admin-input" />
        </div>
        <div className="form-group-row">
            <div className="form-group">
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="admin-input" />
            </div>
            <div className="form-group">
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Event Location" className="admin-input" />
            </div>
        </div>
        <div className="form-group">
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Event Description..." className="admin-textarea" rows="4"></textarea>
        </div>
        <button onClick={handleCreate} disabled={loading} className="btn btn-primary" style={{marginTop: '1rem'}}>
            {loading ? 'Publishing...' : 'Publish Event'}
        </button>
      </div>

      <div className="events-grid" style={{marginTop: '3rem'}}>
        {events.length === 0 ? (
          <p className="no-events">No events found. Start by creating one above.</p>
        ) : (
          events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-card-header">
                <h3 className="event-title">{event.title}</h3>
                <button onClick={() => handleDelete(event.id)} className="btn-delete" title="Delete Event">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
              </div>
              <div className="event-meta">
                  <span className="event-date">📅 {event.date || 'TBD'}</span>
                  <span className="event-location">📍 {event.location || 'TBA'}</span>
              </div>
              <p className="event-content">{event.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
