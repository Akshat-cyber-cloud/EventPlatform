import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import '../styles/Section3.css';

const defaultEvents = [
  {
    id: 'fe1',
    category: 'COMEDY',
    title: 'William Smith Comedy Show',
    subtitle: 'Crack a Smile — 2026 Tour',
    month: 'JUN',
    day: '27',
    year: '2026',
    date: '2026-06-27',
    time: '7:00 PM',
    location: 'LPU Main Auditorium',
    price: 499,
    image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80',
    description: 'Get ready for an evening of non-stop laughter with William Smith featuring fresh standup material and surprise guest openers.'
  },
  {
    id: 'fe2',
    category: 'CONCERT',
    title: 'Shannon Weigel Acoustic Night',
    subtitle: 'Tour: Love Me As I Love You',
    month: 'JUN',
    day: '28',
    year: '2026',
    date: '2026-06-28',
    time: '8:30 PM',
    location: 'Open Air Theatre',
    price: 899,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    description: 'An intimate musical experience with Shannon Weigel performing her chart-topping acoustic ballads live with a full string quartet.'
  },
  {
    id: 'fe3',
    category: 'HACKATHON',
    title: 'Global AI & Serverless Hackathon 3.0',
    subtitle: 'Build Next-Gen Autonomous Web Apps',
    month: 'JUN',
    day: '29',
    year: '2026',
    date: '2026-06-29',
    time: '9:00 AM',
    location: 'LPU Innovation Hub',
    price: 0,
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    description: '48-hour global coding challenge featuring top mentors, cloud infrastructure credits, and cash prizes for winning teams.'
  },
  {
    id: 'fe4',
    category: 'ROBOTICS',
    title: 'Autonomous Robotics & AI Expo',
    subtitle: 'Future Automation Showcase 2026',
    month: 'JUN',
    day: '30',
    year: '2026',
    date: '2026-06-30',
    time: '10:00 AM',
    location: 'Tech Exhibition Hall B',
    price: 299,
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    description: 'Discover the latest breakthroughs in humanoid robotics, drone automation, and machine learning from world-leading robotics labs.'
  },
  {
    id: 'fe5',
    category: 'CONCERT',
    title: 'Edward Burgess — Sax on the Beach',
    subtitle: 'Classical Summer Jazz Tour',
    month: 'JUL',
    day: '04',
    year: '2026',
    date: '2026-07-04',
    time: '8:00 PM',
    location: 'Seaside Amphitheater',
    price: 699,
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
    description: 'Soak in sunset vibes with legendary saxophonist Edward Burgess performing timeless jazz classics on the seaside amphitheater.'
  }
];

const Section3 = () => {
  const navigate = useNavigate();
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLiveEvents(docs);
    }, (err) => {
      console.error("Error fetching live events on home page:", err);
    });

    return () => unsubscribe();
  }, []);

  const legacyTitles = ["hack the box", "hack n hunt", "coding hackathon"];

  const firestoreNewEvents = liveEvents.filter(e => 
    !legacyTitles.some(legacy => (e.title || '').toLowerCase().includes(legacy)) &&
    !defaultEvents.some(d => d.title.toLowerCase() === (e.title || '').toLowerCase())
  );

  const displayList = [...defaultEvents, ...firestoreNewEvents];

  return (
    <section className="featured-upcoming-section" id="upcoming-list">
      <div className="featured-upcoming-container">
        {/* Header Title & Subtitle */}
        <div className="featured-header-center">
          <h2 className="featured-title-main">Upcoming Events Schedule</h2>
          <p className="featured-subtitle-sub">
            Browse through our complete calendar of upcoming concerts, hackathons, robotics expos, and live shows.
          </p>
        </div>

        {/* List of Featured Event Stub Rows */}
        <div className="ticket-stubs-list">
          {displayList.map((item) => {
            const dateParts = (item.date || '2026-06-27').split('-');
            const yearStr = item.year || dateParts[0] || '2026';
            const monthNum = parseInt(dateParts[1] || '06', 10);
            const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const monthStr = item.month || monthNames[monthNum - 1] || 'JUN';
            const dayStr = item.day || dateParts[2] || '27';

            return (
              <motion.div 
                key={item.id}
                className="ticket-stub-card premium-ticket-stub"
                whileHover={{ y: -4, boxShadow: "0 16px 35px rgba(232, 122, 62, 0.12)" }}
                transition={{ duration: 0.2 }}
              >
                {/* Left Column: Date & Time Badge */}
                <div className="stub-date-col">
                  <div className="stub-date-box">
                    <span className="stub-month">{monthStr}</span>
                    <span className="stub-day">{dayStr}</span>
                    <span className="stub-year">{yearStr}</span>
                  </div>
                  <div className="stub-time-badge">
                    {item.time || '7:00 PM'}
                  </div>
                </div>

                {/* Middle Column: Details */}
                <div className="stub-info-col">
                  <div className="stub-header-tags">
                    <span className="stub-category-tag">{(item.category || "EVENT").toUpperCase()}</span>
                    <span className="vip-foil-badge">✦ EXCLUSIVE PASS</span>
                  </div>

                  <h3 className="stub-event-title">{item.title}</h3>
                  <p className="stub-event-subtitle">{item.subtitle || item.content || `📍 ${item.location || 'LPU Campus'}`}</p>

                  <div className="stub-actions-group">
                    <button className="btn-get-tickets" onClick={() => navigate('/signin')}>
                      Get Tickets
                    </button>
                    <button className="btn-view-details" onClick={() => setSelectedEventDetails(item)}>
                      View Details
                    </button>
                    <span className="stub-price-badge">{item.price > 0 ? `₹${item.price}` : 'FREE'}</span>
                  </div>
                </div>

                {/* Right Column: Image with Cutout Notch */}
                <div className="stub-image-col">
                  <div className="stub-image-container">
                    <img src={item.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'} alt={item.title} className="stub-img" />
                    <div className="ticket-notch notch-right"></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Rich View Details Modal */}
      <AnimatePresence>
        {selectedEventDetails && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEventDetails(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <motion.div 
              className="modal-content-details"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                maxWidth: '650px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                color: '#111111',
                padding: '0',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setSelectedEventDetails(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(0,0,0,0.5)',
                  color: '#ffffff',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>

              <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                <img 
                  src={selectedEventDetails.image} 
                  alt={selectedEventDetails.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.5rem', right: '1.5rem' }}>
                  <span style={{ background: '#E87A3E', color: '#ffffff', padding: '0.3rem 0.8rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                    {selectedEventDetails.category}
                  </span>
                  <h2 style={{ color: '#ffffff', margin: '0.5rem 0 0 0', fontSize: '1.8rem', fontFamily: 'Georgia, serif', fontWeight: 800 }}>
                    {selectedEventDetails.title}
                  </h2>
                </div>
              </div>

              <div style={{ padding: '1.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8f9fa', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Date & Time</span>
                    <p style={{ margin: '0.2rem 0 0 0', fontWeight: 700, color: '#111' }}>
                      📅 {selectedEventDetails.month || 'JUN'} {selectedEventDetails.day || '27'}, {selectedEventDetails.year || '2026'} ({selectedEventDetails.time || '7:00 PM'})
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>Entry Fee</span>
                    <p style={{ margin: '0.2rem 0 0 0', fontWeight: 800, color: '#96583A', fontSize: '1.1rem' }}>
                      {selectedEventDetails.price > 0 ? `₹${selectedEventDetails.price}` : 'FREE ENTRY'}
                    </p>
                  </div>
                </div>

                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: '#333' }}>About Event</h4>
                <p style={{ color: '#555', lineHeight: 1.6, margin: '0 0 2rem 0', fontSize: '0.95rem' }}>
                  {selectedEventDetails.description || selectedEventDetails.content}
                </p>

                <button 
                  onClick={() => navigate('/signin')}
                  style={{
                    width: '100%',
                    background: '#96583A',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.9rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Proceed to Book Ticket
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Section3;
