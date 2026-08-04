import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_EMAIL } from '../components/AdminRoute';
import './Home.css';

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = currentUser && currentUser.email && currentUser.email.trim().toLowerCase() === ADMIN_EMAIL;

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  const featuredUpcomingEvents = [
    {
      id: 'fe1',
      category: 'COMEDY',
      title: 'William Smith Comedy Show',
      subtitle: 'Crack a Smile — 2026 Tour',
      month: 'Jun',
      day: '27',
      year: '2026',
      displayDate: 'June 27th, 2026',
      time: '7:00 PM',
      price: 499,
      image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80',
      description: 'Get ready for an evening of non-stop laughter with William Smith featuring fresh standup material and surprise guest openers.'
    },
    {
      id: 'fe2',
      category: 'CONCERT',
      title: 'Shannon Weigel Acoustic Night',
      subtitle: 'Tour: Love Me As I Love You',
      month: 'Jun',
      day: '28',
      year: '2026',
      displayDate: 'June 28th, 2026',
      time: '8:30 PM',
      price: 899,
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      description: 'An intimate musical experience with Shannon Weigel performing her chart-topping acoustic ballads live with a full string quartet.'
    },
    {
      id: 'fe3',
      category: 'HACKATHON',
      title: 'Global AI & Serverless Hackathon 3.0',
      subtitle: 'Build Next-Gen Autonomous Web Apps',
      month: 'Jun',
      day: '29',
      year: '2026',
      displayDate: 'June 29th, 2026',
      time: '9:00 AM',
      price: 0,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
      description: '48-hour global coding challenge featuring top mentors, cloud infrastructure credits, and cash prizes for winning teams.'
    },
    {
      id: 'fe4',
      category: 'ROBOTICS',
      title: 'Autonomous Robotics & AI Expo',
      subtitle: 'Future Automation Showcase 2026',
      month: 'Jun',
      day: '30',
      year: '2026',
      displayDate: 'June 30th, 2026',
      time: '10:00 AM',
      price: 1299,
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      description: 'Discover the latest breakthroughs in humanoid robotics, drone automation, and machine learning from world-leading robotics labs.'
    },
    {
      id: 'fe5',
      category: 'CONCERT',
      title: 'Edward Burgess — Sax on the Beach',
      subtitle: 'Classical Summer Jazz Tour',
      month: 'Jul',
      day: '04',
      year: '2026',
      displayDate: 'July 4th, 2026',
      time: '8:00 PM',
      price: 699,
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
      description: 'Soak in sunset vibes with legendary saxophonist Edward Burgess performing timeless jazz classics on the seaside amphitheater.'
    }
  ];

  const total = featuredUpcomingEvents.length;

  // Auto-scroll every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused, total]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const activeEvent = featuredUpcomingEvents[activeIndex];
  const prevEvent = featuredUpcomingEvents[(activeIndex - 1 + total) % total];
  const nextEvent = featuredUpcomingEvents[(activeIndex + 1) % total];

  return (
    <div className="home-hero-landing" id="home">
      {/* Background Overlay */}
      <div className="hero-bg-overlay"></div>

      {/* Header Navigation */}
      <nav className="minimal-navbar">
        <div className="minimal-nav-left">
          <div className="brand-logo">
            <span className="logo-icon">❖</span> Eventix
          </div>
          <div className="minimal-nav-links">
            <a href="#home">Home</a>
            <a href="#home">Upcoming Events</a>
            <a href="#home">Packages & Pricing</a>
            <a href="#home">How It Works</a>
          </div>
        </div>

        <div className="minimal-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          {currentUser ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="minimal-btn-primary" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #fff8e6 0%, #ffe8b3 100%)', color: '#b37400', border: '1px solid #ffe099', fontWeight: 800 }}>
                  👑 Admin Portal
                </Link>
              )}
              <Link to="/dashboard" className="minimal-btn-primary" style={{ textDecoration: 'none' }}>
                Dashboard
              </Link>
              <button className="minimal-btn-primary" onClick={logout} style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff' }}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/signin" className="minimal-btn-primary" style={{ textDecoration: 'none' }}>
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Carousel Stage */}
      <div className="hero-carousel-content">
        <div className="carousel-header-center">
          <span className="carousel-badge-subtitle">• The Eventix Featured Events •</span>
          <AnimatePresence mode="wait">
            <motion.h1 
              key={activeEvent.displayDate}
              className="carousel-headline-dates"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              {activeEvent.displayDate}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* 3D Carousel Stage */}
        <div 
          className="carousel-stage-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left Side Peek Card */}
          <div className="carousel-peek-card peek-left" onClick={handlePrev}>
            <div className="peek-stub-content">
              <span className="peek-category">{prevEvent.category}</span>
              <h4 className="peek-title">{prevEvent.title}</h4>
              <span className="peek-meta">📅 {prevEvent.month} {prevEvent.day}</span>
            </div>
            <div className="peek-img-wrap">
              <img src={prevEvent.image} alt={prevEvent.title} />
            </div>
          </div>

          {/* Active Center Focused Ticket Stub Card */}
          <div className="carousel-active-card-container">
            <button className="carousel-arrow-btn arrow-left" onClick={handlePrev} aria-label="Previous Event">
              ‹
            </button>

            <AnimatePresence mode="wait">
              <motion.div 
                key={activeEvent.id}
                className="active-ticket-stub"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {/* Left Ticket Details */}
                <div className="active-stub-info">
                  <span className="active-stub-cat">{activeEvent.category}</span>
                  <h3 className="active-stub-title">{activeEvent.title}</h3>
                  <p className="active-stub-sub">{activeEvent.subtitle}</p>

                  <div className="active-stub-meta-row">
                    <span className="meta-item">📅 {activeEvent.month} {activeEvent.day}</span>
                    <span className="meta-item">🕒 {activeEvent.time}</span>
                  </div>

                  <div className="active-stub-actions">
                    <button className="btn-get-tickets-warm" onClick={() => navigate('/dashboard')}>
                      Get Tickets
                    </button>
                    <button className="btn-view-details-link" onClick={() => setSelectedEventDetails(activeEvent)}>
                      View Details
                    </button>
                  </div>
                </div>

                {/* Right Ticket Image with Curved Cutouts */}
                <div className="active-stub-img-wrap">
                  <img src={activeEvent.image} alt={activeEvent.title} className="active-stub-img" />
                  <div className="ticket-cutout cutout-left"></div>
                  <div className="ticket-cutout cutout-right"></div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button className="carousel-arrow-btn arrow-right" onClick={handleNext} aria-label="Next Event">
              ›
            </button>
          </div>

          {/* Right Side Peek Card */}
          <div className="carousel-peek-card peek-right" onClick={handleNext}>
            <div className="peek-stub-content">
              <span className="peek-category">{nextEvent.category}</span>
              <h4 className="peek-title">{nextEvent.title}</h4>
              <span className="peek-meta">📅 {nextEvent.month} {nextEvent.day}</span>
            </div>
            <div className="peek-img-wrap">
              <img src={nextEvent.image} alt={nextEvent.title} />
            </div>
          </div>
        </div>

        {/* Carousel Indicators / Dots */}
        <div className="carousel-indicators-dots">
          {featuredUpcomingEvents.map((_, idx) => (
            <button
              key={idx}
              className={`dot-pill ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedEventDetails && (
          <motion.div 
            className="details-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEventDetails(null)}
          >
            <motion.div 
              className="details-modal-card"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedEventDetails.image} alt={selectedEventDetails.title} className="modal-banner-img" />
              <div className="modal-body-content">
                <span className="modal-category">{selectedEventDetails.category}</span>
                <h2>{selectedEventDetails.title}</h2>
                <p className="modal-subtitle-text">{selectedEventDetails.subtitle}</p>
                <div className="modal-meta-row">
                  <span>📅 {selectedEventDetails.month} {selectedEventDetails.day}, {selectedEventDetails.year}</span>
                  <span>🕒 {selectedEventDetails.time}</span>
                  <span className="modal-price">{selectedEventDetails.price > 0 ? `₹${selectedEventDetails.price}` : 'FREE'}</span>
                </div>
                <p className="modal-desc">{selectedEventDetails.description}</p>
                <div className="modal-actions-row">
                  <button className="btn-get-tickets-warm" onClick={() => navigate('/dashboard')}>
                    Proceed to Register
                  </button>
                  <button className="btn-close-modal" onClick={() => setSelectedEventDetails(null)}>
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
