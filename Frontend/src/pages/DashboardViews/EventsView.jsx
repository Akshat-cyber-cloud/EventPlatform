import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { registerForEvent, getUserRegisteredEventIds } from "../../services/registrationService";
import emailjs from '@emailjs/browser';
import "../Dashboard.css";

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
  }
];

export default function EventsView() {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState(new Set());

  // Modals State
  const [viewDetailsEvent, setViewDetailsEvent] = useState(null); // Rich View Details popup
  const [selectedEvent, setSelectedEvent] = useState(null);       // Book Tickets checkout popup

  const [participationType, setParticipationType] = useState('Individual');
  const [teamSize, setTeamSize] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([{ name: '', email: '', phone: '' }]);
  const [registering, setRegistering] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

    const unsubscribeEvents = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    const fetchRegistrations = async () => {
      if (currentUser?.uid) {
        const ids = await getUserRegisteredEventIds(currentUser.uid);
        setRegisteredEvents(new Set(ids));
      }
    };

    fetchRegistrations();

    return () => unsubscribeEvents();
  }, [currentUser]);

  const legacyTitles = ["hack the box", "hack n hunt", "coding hackathon"];

  const firestoreNewEvents = events.filter(e => 
    !legacyTitles.some(legacy => (e.title || '').toLowerCase().includes(legacy)) &&
    !defaultEvents.some(d => d.title.toLowerCase() === (e.title || '').toLowerCase())
  );

  const displayList = [...defaultEvents, ...firestoreNewEvents];

  const filteredEvents = displayList.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (event.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (event.category || '').toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleOpenBookingModal = (event) => {
    setViewDetailsEvent(null);
    setSelectedEvent(event);
    setParticipationType('Individual');
    setTeamSize(1);
    setTeamName('');
    setTeamMembers([{ name: currentUser?.displayName || '', email: currentUser?.email || '', phone: '' }]);
  };

  const handleCloseBookingModal = () => {
    setSelectedEvent(null);
  };

  const handlePaymentAndRegister = async () => {
    if (!currentUser || !selectedEvent) return;

    if (participationType === 'Team') {
      if (!teamName.trim()) {
        alert("Please enter a Team Name.");
        return;
      }
      if (teamMembers.some(member => !member.name.trim() || !member.email.trim() || !member.phone.trim())) {
        alert("Please fill out all details (Name, Email, Phone) for every team member.");
        return;
      }
    } else {
      if (!teamMembers[0]?.name.trim() || !teamMembers[0]?.email.trim() || !teamMembers[0]?.phone.trim()) {
        alert("Please enter your full details (Name, Email, Phone).");
        return;
      }
    }

    setRegistering(true);

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
        setRegistering(false);
        return;
      }

      const basePrice = selectedEvent.price || 0;
      const finalPrice = participationType === 'Team' ? basePrice * teamSize : basePrice;

      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalPrice,
          currency: 'INR',
          receipt: `rcpt_${selectedEvent.id.slice(0, 10)}_${currentUser.uid.slice(0, 10)}`
        })
      });
      const orderData = await orderRes.json();

      if (!orderData.id) throw new Error("Failed to create Razorpay order");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Eventix Platform",
        description: `Registration for ${selectedEvent.title}`,
        order_id: orderData.id,
        handler: async function (response) {
          const registrationData = {
            participationType,
            teamSize: participationType === 'Team' ? teamSize : 1,
            teamName: participationType === 'Team' ? teamName : null,
            teamMembers,
            paymentStatus: 'Paid',
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: finalPrice,
            title: selectedEvent.title,
            date: selectedEvent.date || 'TBD',
            location: selectedEvent.location || 'TBA',
            image: selectedEvent.image || ''
          };

          const success = await registerForEvent(currentUser.uid, selectedEvent.id, registrationData);

          if (success) {
            setRegisteredEvents(prev => new Set(prev).add(selectedEvent.id));

            try {
              const emailParams = {
                user_name: currentUser.displayName || currentUser.email.split('@')[0] || "Attendee",
                email: currentUser.email,
                event_name: selectedEvent.title,
                event_date: selectedEvent.date || 'TBD',
                event_location: selectedEvent.location || 'TBA',
                ticket_id: response.razorpay_payment_id || `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                qr_code: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`Attendee: ${currentUser.displayName || "Attendee"}, Ticket: ${response.razorpay_payment_id}`)}`,
                to_name: currentUser.displayName || "Attendee",
                to_email: currentUser.email
              };

              await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                emailParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
              );
            } catch (emailError) {
              console.error("Failed to send confirmation email:", emailError);
            }

            alert("Successfully registered! Your pass has been generated.");
            handleCloseBookingModal();
          } else {
            alert("Payment successful but database update failed. Contact support.");
          }
          setRegistering(false);
        },
        prefill: {
          email: currentUser.email,
          name: teamMembers[0]?.name || currentUser.displayName || "",
          contact: teamMembers[0]?.phone || ""
        },
        theme: {
          color: "#96583A"
        },
        modal: {
          ondismiss: function () {
            setRegistering(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error("Dashboard Registration Error:", error);
      alert("Failed to initiate registration. Is the backend running?");
      setRegistering(false);
    }
  };

  if (loading) {
    return <div className="loader">Loading Events...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="view-content">
      <h3 className="section-title">Upcoming Events</h3>

      {/* Interactive Search & Category Filter */}
      <div className="events-filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="search-input-wrapper" style={{ display: 'flex', alignItems: 'center', background: '#ffffff', borderRadius: '12px', padding: '0.85rem 1.4rem', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <span style={{ marginRight: '0.8rem', opacity: 0.6 }}>🔍</span>
          <input
            type="text"
            placeholder="Search events by title, description, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: '#111111', width: '100%', fontSize: '0.98rem' }}
          />
        </div>
        <div className="category-pills" style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {['All', 'Hackathon', 'Tech', 'Fest', 'ESports', 'Cultural'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.55rem 1.3rem',
                borderRadius: '25px',
                border: selectedCategory === cat ? '1px solid #E87A3E' : '1px solid #e5e7eb',
                background: selectedCategory === cat ? '#E87A3E' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : '#555555',
                cursor: 'pointer',
                fontWeight: selectedCategory === cat ? '700' : '500',
                fontSize: '0.88rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Horizontal Ticket Stub Cards List */}
      <motion.div
        className="ticket-stubs-list-dashboard"
        variants={containerVariants}
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}
      >
        {filteredEvents.length === 0 ? (
          <motion.div variants={itemVariants} className="no-events-container">
            <p className="no-events">No matching events found. Try adjusting your search or category filter!</p>
          </motion.div>
        ) : (
          filteredEvents.map(event => {
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
                    {event.time || '7:00 PM'}
                  </div>
                </div>

                {/* Middle Column: Event Details */}
                <div className="stub-info-col">
                  <div className="stub-header-tags">
                    <span className="stub-category-tag">{event.category || "EVENT"}</span>
                    <span className="vip-foil-badge">✦ EXCLUSIVE PASS</span>
                  </div>

                  <h3 className="stub-event-title">{event.title}</h3>
                  <p className="stub-event-subtitle">{event.content || `📍 ${event.location || 'LPU'}`}</p>

                  <div className="stub-actions-group">
                    <button
                      className="btn-get-tickets"
                      disabled={registeredEvents.has(event.id) || event.availableSeats === 0}
                      onClick={() => handleOpenBookingModal(event)}
                    >
                      {registeredEvents.has(event.id)
                        ? "✓ Registered"
                        : (event.availableSeats === 0 ? "Cluster Full" : "Get Tickets")}
                    </button>
                    <button
                      className="btn-view-details"
                      onClick={() => setViewDetailsEvent(event)}
                    >
                      View Details
                    </button>
                    <span className="stub-price-badge">{event.price > 0 ? `₹${event.price}` : 'FREE'}</span>
                  </div>
                </div>

                {/* Right Column: Ticket Image with Cutout Notch */}
                <div className="stub-image-col">
                  <div className="stub-image-container">
                    <img src={event.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'} alt={event.title} className="stub-img" />
                    <div className="ticket-notch notch-right"></div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* 1. Meaningful View Details Modal */}
      <AnimatePresence>
        {viewDetailsEvent && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewDetailsEvent(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem'
            }}
          >
            <motion.div
              className="modal-card-details"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                maxWidth: '600px',
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                color: '#111111',
                position: 'relative',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Image Banner */}
              <div style={{ position: 'relative', width: '100%', height: '220px' }}>
                <img
                  src={viewDetailsEvent.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'}
                  alt={viewDetailsEvent.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Prominent Circular Close Button */}
                <button
                  onClick={() => setViewDetailsEvent(null)}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.7)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s ease'
                  }}
                  aria-label="Close Modal"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body Content */}
              <div style={{ padding: '2rem', overflowY: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#96583A', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    {viewDetailsEvent.category || 'EVENT'}
                  </span>
                  <span className="vip-foil-badge">✦ EXCLUSIVE PASS</span>
                </div>

                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '1.8rem', fontWeight: 800, color: '#111111', margin: '0 0 0.5rem 0' }}>
                  {viewDetailsEvent.title}
                </h2>

                <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  {viewDetailsEvent.content || "Join us for an exceptional live event experience featuring top-tier speakers, mentors, performance showcases, and networking opportunities."}
                </p>

                {/* Event Highlights & Metadata */}
                <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '1.2rem', border: '1px solid #e5e7eb', marginBottom: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#888', display: 'block', marginBottom: '0.2rem' }}>DATE & TIME</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111' }}>📅 {viewDetailsEvent.date || 'JUN 28, 2026'} ({viewDetailsEvent.time || '7:00 PM'})</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#888', display: 'block', marginBottom: '0.2rem' }}>LOCATION</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111' }}>📍 {viewDetailsEvent.location || 'LPU Auditorium'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#888', display: 'block', marginBottom: '0.2rem' }}>ENTRY PRICE</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#96583A' }}>{viewDetailsEvent.price > 0 ? `₹${viewDetailsEvent.price}` : 'FREE PASS'}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#888', display: 'block', marginBottom: '0.2rem' }}>SEAT AVAILABILITY</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#22c55e' }}>{viewDetailsEvent.availableSeats || 30} Slots Remaining</span>
                  </div>
                </div>

                {/* Seat Progress Bar */}
                {viewDetailsEvent.maxSeats && (
                  <div style={{ marginBottom: '1.8rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '0.4rem' }}>
                      <span>SEAT CAPACITY</span>
                      <span>{viewDetailsEvent.availableSeats} / {viewDetailsEvent.maxSeats} LEFT</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div className="progress-bar-fill" style={{ width: `${(viewDetailsEvent.availableSeats / viewDetailsEvent.maxSeats) * 100}%`, height: '100%', background: 'linear-gradient(to right, #E87A3E, #F2994A)' }}></div>
                    </div>
                  </div>
                )}

                {/* Modal Footer Actions */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    className="btn-get-tickets"
                    style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }}
                    disabled={registeredEvents.has(viewDetailsEvent.id) || viewDetailsEvent.availableSeats === 0}
                    onClick={() => handleOpenBookingModal(viewDetailsEvent)}
                  >
                    {registeredEvents.has(viewDetailsEvent.id) ? "✓ Registered" : "Proceed to Book Ticket"}
                  </button>
                  <button
                    onClick={() => setViewDetailsEvent(null)}
                    style={{ background: '#f3f4f6', color: '#333', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Book Ticket Checkout Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              className="modal-content-booking"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                maxWidth: '520px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                color: '#111111',
                padding: '2rem',
                position: 'relative'
              }}
            >
              {/* Prominent Top-Right Close Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#111111' }}>
                  Register: {selectedEvent.title}
                </h3>
                <button
                  onClick={handleCloseBookingModal}
                  style={{
                    background: '#f3f4f6',
                    border: 'none',
                    color: '#111111',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Form Input Group */}
              <div className="form-group" style={{ marginBottom: '1.2rem' }}>
                <label style={{ color: '#333333', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Participation Type</label>
                {selectedEvent.maxTeamSize > 1 ? (
                  <select
                    value={participationType}
                    onChange={e => {
                      setParticipationType(e.target.value);
                      const defaultSize = e.target.value === 'Team' ? 2 : 1;
                      setTeamSize(defaultSize);
                      setTeamMembers(Array(defaultSize).fill().map(() => ({ name: '', email: '', phone: '' })));
                    }}
                    className="admin-input"
                    style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111', fontWeight: 600 }}
                  >
                    <option value="Individual">Individual (Solo Ticket)</option>
                    <option value="Team">Team Pass</option>
                  </select>
                ) : (
                  <input type="text" value="Individual (Solo Event)" disabled className="admin-input" style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111', fontWeight: 600 }} />
                )}
              </div>

              {participationType === 'Team' && (
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.2rem' }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ color: '#333333', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Team Name *</label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      placeholder="Enter team name"
                      className="admin-input"
                      style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ color: '#333333', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Team Size</label>
                    <select
                      value={teamSize}
                      onChange={e => {
                        const size = Number(e.target.value);
                        setTeamSize(size);
                        const newMembers = [...teamMembers];
                        if (size > newMembers.length) {
                          newMembers.push(...Array(size - newMembers.length).fill().map(() => ({ name: '', email: '', phone: '' })));
                        } else {
                          newMembers.length = size;
                        }
                        setTeamMembers(newMembers);
                      }}
                      className="admin-input"
                      style={{ background: '#f8f9fa', border: '1px solid #d1d5db', color: '#111111' }}
                    >
                      {Array.from({ length: selectedEvent.maxTeamSize - 1 }, (_, i) => i + 2).map(num => (
                        <option key={num} value={num}>{num} Members</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Participant Details Input Section */}
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <h4 style={{ color: '#111111', fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
                  {participationType === 'Team' ? 'Team Members Details *' : 'Participant Details *'}
                </h4>
                {teamMembers.map((member, index) => (
                  <div key={index} style={{ marginBottom: '1.2rem', background: '#f8f9fa', padding: '1rem', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
                    <label style={{ color: '#96583A', fontSize: '0.82rem', marginBottom: '0.6rem', display: 'block', fontWeight: 'bold' }}>
                      {participationType === 'Team' ? `Member ${index + 1}` : 'Attendee Info'}
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={e => {
                        const newMembers = [...teamMembers];
                        newMembers[index].name = e.target.value;
                        setTeamMembers(newMembers);
                      }}
                      placeholder="Full Name *"
                      className="admin-input"
                      style={{ marginBottom: '0.6rem', background: '#ffffff', border: '1px solid #d1d5db', color: '#111111' }}
                    />
                    <input
                      type="email"
                      value={member.email}
                      onChange={e => {
                        const newMembers = [...teamMembers];
                        newMembers[index].email = e.target.value;
                        setTeamMembers(newMembers);
                      }}
                      placeholder="Email Address *"
                      className="admin-input"
                      style={{ marginBottom: '0.6rem', background: '#ffffff', border: '1px solid #d1d5db', color: '#111111' }}
                    />
                    <input
                      type="tel"
                      value={member.phone}
                      onChange={e => {
                        const newMembers = [...teamMembers];
                        newMembers[index].phone = e.target.value;
                        setTeamMembers(newMembers);
                      }}
                      placeholder="Phone Number *"
                      className="admin-input"
                      style={{ background: '#ffffff', border: '1px solid #d1d5db', color: '#111111' }}
                    />
                  </div>
                ))}
              </div>

              {/* Order Breakdown Box */}
              <div style={{ background: '#f8f9fa', padding: '1.2rem', borderRadius: '12px', marginTop: '1.5rem', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#333333', fontSize: '0.9rem' }}>
                  <span>Ticket Price:</span>
                  <span style={{ fontWeight: 700 }}>{selectedEvent.price > 0 ? `₹${selectedEvent.price}` : 'Free'} {participationType === 'Team' && `x ${teamSize}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', color: '#666666', fontSize: '0.85rem' }}>
                  <span>Platform & Processing Fee:</span>
                  <span style={{ fontWeight: 700, color: '#16a34a' }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.8rem', paddingTop: '0.8rem', borderTop: '1px solid #e5e7eb', fontWeight: 800, fontSize: '1.15rem', color: '#96583A' }}>
                  <span>Total Amount:</span>
                  <span>{selectedEvent.price > 0 ? `₹${participationType === 'Team' ? selectedEvent.price * teamSize : selectedEvent.price}` : 'Free'}</span>
                </div>
              </div>

              <button
                className="btn-get-tickets"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', borderRadius: '8px' }}
                onClick={handlePaymentAndRegister}
                disabled={registering}
              >
                {registering ? 'Processing Payment...' : (selectedEvent.price > 0 ? `Pay ₹${participationType === 'Team' ? selectedEvent.price * teamSize : selectedEvent.price} & Register` : 'Confirm Free Registration')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
