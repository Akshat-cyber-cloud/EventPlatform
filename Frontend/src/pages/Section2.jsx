import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { registerForEvent } from '../services/registrationService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import emailjs from '@emailjs/browser';
import '../styles/Section2.css';

const Section2 = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'events'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const sortedDocs = docs.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setEvents(sortedDocs);
      setLoading(false);
    }, (err) => {
      console.error("Section2 Firestore Error:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const fallbackEvents = [
    {
      id: 'e1',
      title: 'The Phantom of the Opera',
      location: 'Hamilton - Live in London',
      date: '18 Feb',
      time: '12:00pm to 03:00pm',
      price: 499,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'e2',
      title: 'Sky Lantern Light Show',
      location: 'Hyde Park - London',
      date: '20 Feb',
      time: '06:00pm to 09:00pm',
      price: 799,
      image: 'https://images.unsplash.com/photo-1508997449629-303059a039c0?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'e3',
      title: 'Outdoor Music Picnic',
      location: 'Regents Park - Live',
      date: '24 Feb',
      time: '02:00pm to 07:00pm',
      price: 299,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'e4',
      title: 'Neon Underground Fest',
      location: 'Soho Arena - London',
      date: '28 Feb',
      time: '10:00pm to 04:00am',
      price: 999,
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const displayEvents = events.length > 0 ? events : fallbackEvents;

  const handleRegister = async (event) => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }

    try {
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

      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: event.price || 0,
          currency: 'INR',
          receipt: `rcpt_${event.id.slice(0, 10)}_${currentUser.uid.slice(0, 10)}`
        })
      });
      const orderData = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Eventix",
        description: `Registration for ${event.title}`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const registrationData = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: event.price || 0,
              participationType: 'Individual',
              teamMembers: [{ name: currentUser.displayName || "", email: currentUser.email, phone: "" }],
              title: event.title,
              date: event.date || 'TBD',
              location: event.location || 'TBA'
            };

            const success = await registerForEvent(currentUser.uid, event.id, registrationData);

            if (success) {
              try {
                const emailParams = {
                  user_name: currentUser.displayName || currentUser.email.split('@')[0] || "Attendee",
                  email: currentUser.email,
                  event_name: event.title,
                  event_date: event.date || 'TBD',
                  event_location: event.location || 'TBA',
                  ticket_id: response.razorpay_payment_id,
                  qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`Attendee: ${currentUser.displayName || "Attendee"}, Ticket: ${response.razorpay_payment_id}`)}`,
                  to_name: currentUser.displayName || "Attendee",
                  to_email: currentUser.email
                };

                await emailjs.send(
                  import.meta.env.VITE_EMAIL_SERVICE_ID || import.meta.env.VITE_EMAILJS_SERVICE_ID,
                  import.meta.env.VITE_EMAIL_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                  emailParams,
                  import.meta.env.VITE_EMAIL_PUBLIC_KEY || import.meta.env.VITE_EMAILJS_PUBLIC_KEY
                );
              } catch (e) {
                console.error("EmailJS send failed:", e);
              }
              alert('Registration Successful! Your ticket has been generated.');
            } else {
              alert("Payment successful but database update failed.");
            }
          } catch (err) {
            console.error("Registration error:", err);
          }
        },
        prefill: {
          email: currentUser.email,
          name: currentUser.displayName || ""
        },
        theme: {
          color: "#E87A3E"
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error("Registration initiation error:", error);
      alert("Failed to initiate checkout. Please ensure backend is running.");
    }
  };

  return (
    <section className="city-events-section" id="events-explore" data-scroll-section>
      <div className="section-container">
        <div className="section-top-bar">
          <h2 className="section-heading">Events Near By Your City</h2>
          <button className="view-all-link" onClick={() => navigate('/dashboard')}>
            View All Events &rarr;
          </button>
        </div>

        <div className="city-events-grid">
          {displayEvents.map((event) => (
            <motion.div 
              key={event.id}
              className="city-event-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="city-card-image-wrap">
                <img src={event.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'} alt={event.title} className="city-card-img" />
                <div className="date-badge-yellow">
                  <span className="badge-day">{event.date || '18 Feb'}</span>
                </div>
              </div>

              <div className="city-card-content">
                <h4 className="city-event-title">{event.title}</h4>
                <p className="city-event-loc">📍 {event.location || 'Hamilton - Live'}</p>
                <p className="city-event-time">🕒 {event.time || '12:00pm to 03:00pm'}</p>

                <div className="city-card-footer">
                  <span className="event-price-tag">
                    {event.price ? `₹${event.price}` : 'FREE'}
                  </span>
                  <button onClick={() => handleRegister(event)} className="city-buy-btn">
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Section2;
