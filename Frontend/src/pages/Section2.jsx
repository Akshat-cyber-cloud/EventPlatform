import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { registerForEvent } from '../services/registrationService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Section2.css';

const categories = ['All', 'Hackathons'];

const Section2 = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Background transition logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "start center"]
  });

  const bgColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#000000", "#f8f9fa98"]
  );

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      // Real-time sync: always map current snapshot
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setEvents(docs);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredEvents = activeCategory === 'All'
    ? events
    : events.filter(e => {
      const cat = e.category?.toLowerCase() || '';
      return cat.includes('hack');
    });

  const handleRegister = async (event) => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
      // 1. Load Razorpay Script
      const loadScript = (src) => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      // 2. Create Order on Backend
      const orderRes = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: event.price || 0,
          currency: 'INR',
          receipt: `rcpt_${event.id.slice(0, 10)}_${currentUser.uid.slice(0, 10)}`
        })
      });
      const orderData = await orderRes.json();

      // 3. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "EventPlatform",
        description: `Registration for ${event.title}`,
        order_id: orderData.id,
        handler: async function (response) {
          // 4. On Success: Use registrationService
          try {
            const registrationData = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: event.price || 0,
              participationType: 'Individual', // Default for landing page
              teamMembers: [{ name: currentUser.displayName || "", email: currentUser.email, phone: "" }],
              // Metadata for ticket view
              title: event.title,
              date: event.date || 'TBD',
              location: event.location || 'TBA'
            };

            const success = await registerForEvent(currentUser.uid, event.id, registrationData);

            if (success) {
              alert('Registration Successful! See you at the event.');
            } else {
              alert("Payment successful but database update failed. Please contact support.");
            }
          } catch (err) {
            console.error("Registration Service Error:", err);
            alert("Something went wrong with the registration.");
          }
        },
        prefill: {
          email: currentUser.email,
          name: currentUser.displayName || ""
        },
        theme: {
          color: "#ff0000"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error("Registration Error:", error);
      alert("Failed to initiate registration. Is the backend running?");
    }
  };

  return (
    <motion.section
      ref={containerRef}
      style={{ backgroundColor: bgColor }}
      className="section2-container"
      id="events-explore"
      data-scroll-section
    >
      <div className="section2-inner">
        <div className="section2-header">
          <motion.h2
            className="section2-title"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Events<br />for you
          </motion.h2>

          <motion.div
            className="filter-bar"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="category-scroll">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="events-grid-innovative">
          <AnimatePresence mode='popLayout'>
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.8,
                  ease: [0.19, 1, 0.22, 1],
                  delay: index * 0.1
                }}
                className="event-card-premium"
              >
                <div className="card-visual-layer">
                  <img src={event.image || '/api/placeholder/800/500'} alt={event.title} />

                  {/* Glass Details Overlay */}
                  <div className="card-glass-details">
                    <span className="event-label">{event.category}</span>
                    <div className="price-tag">
                      <span className="from">FROM</span>
                      <span className="amount">₹{event.price || 0}</span>
                    </div>
                  </div>

                  {/* Interactive Spotlight */}
                  <div className="spotlight-overlay">
                    <button onClick={() => handleRegister(event)} className="glow-cta">
                      Register Now
                    </button>
                  </div>
                </div>

                <div className="card-text-layer">
                  <div className="date-pill">{event.date}</div>
                  <h3>{event.title}</h3>
                  <p className="loc-text">
                    <span className="pin">📍</span> {event.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!loading && filteredEvents.length === 0 && (
          <div className="empty-state-innovative">
            <div className="empty-icon">📂</div>
            <h3>No Active Events</h3>
            <p>We're currently curating new experiences. Check back soon!</p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Section2;
