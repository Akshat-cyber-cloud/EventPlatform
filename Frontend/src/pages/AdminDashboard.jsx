import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, deleteDoc, doc, serverTimestamp, orderBy, query, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Dashboard.css";

const defaultEvents = [
  {
    id: 'fe1',
    category: 'Comedy',
    title: 'William Smith Comedy Show',
    date: '2026-06-27',
    time: '7:00 PM',
    location: 'LPU Main Auditorium',
    price: 499,
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80',
    content: 'Get ready for an evening of non-stop laughter with William Smith featuring fresh standup material and surprise guest openers.',
    maxSeats: 500,
    availableSeats: 342,
    maxTeamSize: 1
  },
  {
    id: 'fe2',
    category: 'Concert',
    title: 'Shannon Weigel Acoustic Night',
    date: '2026-06-28',
    time: '8:30 PM',
    location: 'Open Air Theatre',
    price: 899,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    content: 'An intimate musical experience with Shannon Weigel performing her chart-topping acoustic ballads live with a full string quartet.',
    maxSeats: 300,
    availableSeats: 118,
    maxTeamSize: 1
  },
  {
    id: 'fe3',
    category: 'Hackathon',
    title: 'Global AI & Serverless Hackathon 3.0',
    date: '2026-06-29',
    time: '9:00 AM',
    location: 'LPU Innovation Hub',
    price: 0,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    content: '48-hour global coding challenge featuring top mentors, cloud infrastructure credits, and cash prizes for winning teams.',
    maxSeats: 1000,
    availableSeats: 820,
    maxTeamSize: 4
  },
  {
    id: 'fe4',
    category: 'Robotics',
    title: 'Autonomous Robotics & AI Expo',
    date: '2026-06-30',
    time: '10:00 AM',
    location: 'Tech Exhibition Hall B',
    price: 299,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    content: 'Discover the latest breakthroughs in humanoid robotics, drone automation, and machine learning from world-leading robotics labs.',
    maxSeats: 400,
    availableSeats: 250,
    maxTeamSize: 2
  },
  {
    id: 'fe5',
    category: 'Concert',
    title: 'Edward Burgess — Sax on the Beach',
    date: '2026-07-04',
    time: '8:00 PM',
    location: 'Seaside Amphitheater',
    price: 699,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    content: 'Soak in sunset vibes with legendary saxophonist Edward Burgess performing timeless jazz classics on the seaside amphitheater.',
    maxSeats: 350,
    availableSeats: 180,
    maxTeamSize: 1
  }
];

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [deletedIds, setDeletedIds] = useState(new Set());
  
  // Event Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState(0);
  const [maxTeamSize, setMaxTeamSize] = useState(1);
  const [maxSeats, setMaxSeats] = useState("");
  const [category, setCategory] = useState("Hackathon");
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);

  // Announcements State
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("Broadcast");
  const [loadingAnnouncement, setLoadingAnnouncement] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Error listening to events:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleCreate = async (e) => {
    if (e) e.preventDefault();
    if (!title.trim() || !content.trim() || !date || !location.trim()) {
      alert("Please fill out Event Title, Date, Location, and Content description.");
      return;
    }
    setLoading(true);

    let imageUrl = "";
    if (imageFile) {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.url) {
          imageUrl = data.url;
        }
      } catch (err) {
        console.error("Image upload failed:", err);
      }
      setUploadingImage(false);
    }

    try {
      await addDoc(collection(db, "events"), {
        title,
        content,
        date,
        location,
        price: Number(price),
        maxTeamSize: Number(maxTeamSize),
        maxSeats: maxSeats === "" ? null : Number(maxSeats),
        availableSeats: maxSeats === "" ? null : Number(maxSeats),
        category,
        image: imageUrl || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
        createdAt: serverTimestamp(),
      });

      alert("Event published successfully!");
      setTitle("");
      setContent("");
      setDate("");
      setLocation("");
      setPrice(0);
      setMaxTeamSize(1);
      setMaxSeats("");
      setCategory("Hackathon");
      setImageFile(null);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to publish event.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) return;
    
    // Instantly hide locally for zero latency
    setDeletedIds(prev => new Set([...prev, id]));

    if (!id.startsWith('fe')) {
      try {
        await deleteDoc(doc(db, "events", id));
      } catch (error) {
        console.warn("Firestore delete silent fallback:", error);
      }
    }
  };

  const postAnnouncement = async (e) => {
    if (e) e.preventDefault();
    if (!msg.trim()) return;
    setLoadingAnnouncement(true);
    try {
      await addDoc(collection(db, "announcements"), {
        message: msg,
        type: type,
        createdAt: serverTimestamp(),
      });
      setMsg("");
      setType("Broadcast");
      alert("Announcement broadcasted successfully!");
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("Failed to post announcement.");
    }
    setLoadingAnnouncement(false);
  };

  const legacyTitles = ["hack the box", "hack n hunt", "coding hackathon"];
  const firestoreNewEvents = events.filter(e => 
    !legacyTitles.some(legacy => (e.title || '').toLowerCase().includes(legacy)) &&
    !defaultEvents.some(d => d.title.toLowerCase() === (e.title || '').toLowerCase())
  );

  const displayList = [...defaultEvents, ...firestoreNewEvents].filter(e => !deletedIds.has(e.id));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
  };

  return (
    <div className="dashboard-layout" style={{ position: 'relative', display: 'block', padding: '0', background: '#f4f5f8' }}>
      <motion.div 
        className="dashboard-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Admin Header Bar */}
        <div className="dashboard-header-bar" style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h2 className="dashboard-welcome" style={{ fontSize: '1.7rem', color: '#111111' }}>
                Admin <span className="highlight">Control Center</span>
              </h2>
              <span className="admin-status-badge" style={{ fontSize: '0.72rem', fontWeight: 800, background: '#fff8e6', color: '#b37400', border: '1px solid #ffe099', padding: '0.25rem 0.7rem', borderRadius: '15px', letterSpacing: '0.8px' }}>
                👑 VERIFIED ADMIN
              </span>
            </div>

            <div className="dashboard-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none', background: '#f3f4f6', color: '#333333', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem' }}>
                User Dashboard
              </Link>
              <Link to="/" style={{ textDecoration: 'none', background: '#E87A3E', color: '#ffffff', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                Home Site
              </Link>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="dashboard-content-area" style={{ padding: '2.5rem 3.5rem', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'start' }}>
            
            {/* 1. Create Event Card */}
            <motion.div 
              className="admin-create-form"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderTop: '4px solid #96583A', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}
            >
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: 800, color: '#96583A' }}>
                ➕ Create & Publish Event
              </h3>

              <form onSubmit={handleCreate}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333333', marginBottom: '0.4rem' }}>Event Title *</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="e.g. ComicCon Delhi 2026" 
                    className="admin-input" 
                    style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111', fontWeight: 600 }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333333', marginBottom: '0.4rem' }}>Event Date *</label>
                    <input 
                      type="date" 
                      value={date} 
                      onChange={e => setDate(e.target.value)} 
                      className="admin-input" 
                      style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333333', marginBottom: '0.4rem' }}>Location *</label>
                    <input 
                      type="text" 
                      value={location} 
                      onChange={e => setLocation(e.target.value)} 
                      placeholder="e.g. LPU Campus / Pragati Maidan" 
                      className="admin-input" 
                      style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333333', marginBottom: '0.4rem' }}>Category</label>
                    <select 
                      value={category} 
                      onChange={e => setCategory(e.target.value)} 
                      className="admin-input" 
                      style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111', fontWeight: 600 }}
                    >
                      <option value="Hackathon">Hackathon</option>
                      <option value="Tech">Tech</option>
                      <option value="Fest">Fest</option>
                      <option value="ESports">ESports</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Comedy">Comedy</option>
                      <option value="Concert">Concert</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333333', marginBottom: '0.4rem' }}>Price (₹) [0 for FREE]</label>
                    <input 
                      type="number" 
                      value={price} 
                      onChange={e => setPrice(e.target.value)} 
                      className="admin-input" 
                      min="0" 
                      style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111', fontWeight: 600 }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333333', marginBottom: '0.4rem' }}>Max Team Size</label>
                    <input 
                      type="number" 
                      value={maxTeamSize} 
                      onChange={e => setMaxTeamSize(e.target.value)} 
                      className="admin-input" 
                      min="1" 
                      style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333333', marginBottom: '0.4rem' }}>Total Seat Capacity</label>
                    <input 
                      type="number" 
                      value={maxSeats} 
                      onChange={e => setMaxSeats(e.target.value)} 
                      placeholder="e.g. 100" 
                      className="admin-input" 
                      min="1" 
                      style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#96583A', marginBottom: '0.4rem' }}>Event Banner Image</label>
                  <div style={{ background: '#f8f9fa', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '0.9rem', position: 'relative' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={e => setImageFile(e.target.files[0])} 
                      style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', width: '100%', height: '100%' }} 
                    />
                    <span style={{ fontSize: '0.88rem', color: '#555555', fontWeight: 600 }}>
                      📷 {imageFile ? `Selected: ${imageFile.name}` : 'Click or drop image banner to upload...'}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333333', marginBottom: '0.4rem' }}>Event Description *</label>
                  <textarea 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                    placeholder="Provide full event details, agenda, rules, and highlights..." 
                    className="admin-textarea" 
                    rows={4}
                    style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111', width: '100%' }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || uploadingImage} 
                  style={{
                    width: '100%',
                    background: '#96583A',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                >
                  {loading ? (uploadingImage ? 'Uploading Image...' : 'Publishing Event...') : 'Publish Event to Platform'}
                </button>
              </form>
            </motion.div>

            {/* 2. Broadcast Announcement Card */}
            <motion.div 
              className="admin-create-form"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderTop: '4px solid #E87A3E', borderRadius: '16px', padding: '2rem', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}
            >
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: 800, color: '#E87A3E' }}>
                📢 Post Announcement
              </h3>

              <form onSubmit={postAnnouncement}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333333', marginBottom: '0.4rem' }}>Message Text *</label>
                  <textarea 
                    value={msg} 
                    onChange={e => setMsg(e.target.value)} 
                    placeholder="Write a live status update or announcement..." 
                    className="admin-textarea" 
                    rows={4}
                    style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111', width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#333333', marginBottom: '0.4rem' }}>Priority Tag</label>
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value)} 
                    className="admin-input"
                    style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111', fontWeight: 600 }}
                  >
                    <option value="Broadcast">Delta (Global Broadcast)</option>
                    <option value="Alert">Omega (Urgent Alert)</option>
                    <option value="Register">Alpha (Registration Open)</option>
                    <option value="Payment">Sigma (Finances)</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={loadingAnnouncement || !msg.trim()} 
                  style={{
                    width: '100%',
                    background: '#E87A3E',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.9rem',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                >
                  {loadingAnnouncement ? 'Posting...' : 'Broadcast Announcement'}
                </button>
              </form>
            </motion.div>
          </div>

          {/* 3. Manage Platform Events List */}
          <div style={{ marginTop: '5rem' }}>
            <h3 className="section-title">
              📋 Manage Live Platform Events ({displayList.length})
            </h3>

            <motion.div 
              className="ticket-stubs-list-admin"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <AnimatePresence mode="popLayout">
                {displayList.map(event => {
                  const dateParts = (event.date || '2026-06-27').split('-');
                  const yearStr = dateParts[0] || '2026';
                  const monthNum = parseInt(dateParts[1] || '06', 10);
                  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
                  const monthStr = monthNames[monthNum - 1] || 'JUN';
                  const dayStr = dateParts[2] || '27';

                  return (
                    <motion.div 
                      key={event.id} 
                      variants={itemVariants} 
                      layout 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      className="ticket-stub-card premium-ticket-stub"
                      style={{ background: '#ffffff', border: '1px solid #e5e7eb' }}
                    >
                      {/* Left Date Column */}
                      <div className="stub-date-col">
                        <div className="stub-date-box">
                          <span className="stub-month">{monthStr}</span>
                          <span className="stub-day">{dayStr}</span>
                          <span className="stub-year">{yearStr}</span>
                        </div>
                        <div className="stub-time-badge">
                          {event.time || '7:00 PM'}
                        </div>
                      </div>

                      {/* Middle Event Details */}
                      <div className="stub-info-col">
                        <div className="stub-header-tags">
                          <span className="stub-category-tag">{(event.category || "EVENT").toUpperCase()}</span>
                          <span className="vip-foil-badge">✦ LIVE PLATFORM EVENT</span>
                        </div>

                        <h3 className="stub-event-title">{event.title}</h3>
                        <p className="stub-event-subtitle">📍 {event.location || 'LPU'} — {event.content?.slice(0, 100) || event.description?.slice(0, 100)}...</p>

                        <div className="stub-actions-group">
                          <button 
                            onClick={() => handleDelete(event.id)} 
                            style={{
                              background: '#ef4444',
                              color: '#ffffff',
                              border: 'none',
                              padding: '0.55rem 1.2rem',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem'
                            }}
                          >
                            🗑️ Delete Event
                          </button>
                          <span className="stub-price-badge">{event.price > 0 ? `₹${event.price}` : 'FREE'}</span>
                        </div>
                      </div>

                      {/* Right Image Thumbnail */}
                      <div className="stub-image-col">
                        <div className="stub-image-container">
                          <img src={event.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'} alt={event.title} className="stub-img" />
                          <div className="ticket-notch notch-right"></div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
