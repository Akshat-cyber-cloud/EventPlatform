import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../styles/Section3.css';

const Section3 = () => {
  const navigate = useNavigate();
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);

  const featuredUpcomingEvents = [
    {
      id: 'fe1',
      category: 'COMEDY',
      title: 'William Smith Comedy Show',
      subtitle: 'Crack a Smile — 2026 Tour',
      month: 'JUN',
      day: '27',
      year: '2026',
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
      month: 'JUN',
      day: '28',
      year: '2026',
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
      month: 'JUN',
      day: '29',
      year: '2026',
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
      month: 'JUN',
      day: '30',
      year: '2026',
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
      month: 'JUL',
      day: '04',
      year: '2026',
      time: '8:00 PM',
      price: 699,
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
      description: 'Soak in sunset vibes with legendary saxophonist Edward Burgess performing timeless jazz classics on the seaside amphitheater.'
    }
  ];

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
          {featuredUpcomingEvents.map((item) => (
            <motion.div 
              key={item.id}
              className="ticket-stub-card premium-ticket-stub"
              whileHover={{ y: -4, boxShadow: "0 16px 35px rgba(232, 122, 62, 0.12)" }}
              transition={{ duration: 0.2 }}
            >
              {/* Left Column: Date & Time Badge */}
              <div className="stub-date-col">
                <div className="stub-date-box">
                  <span className="stub-month">{item.month}</span>
                  <span className="stub-day">{item.day}</span>
                  <span className="stub-year">{item.year}</span>
                </div>
                <div className="stub-time-badge">
                  {item.time}
                </div>
              </div>

              {/* Middle Column: Event Details */}
              <div className="stub-info-col">
                <div className="stub-header-tags">
                  <span className="stub-category-tag">{item.category}</span>
                  <span className="vip-foil-badge">✦ EXCLUSIVE PASS</span>
                </div>

                <h3 className="stub-event-title">{item.title}</h3>
                <p className="stub-event-subtitle">{item.subtitle}</p>

                <div className="stub-actions-group">
                  <button 
                    className="btn-get-tickets"
                    onClick={() => navigate('/dashboard')}
                  >
                    Get Tickets
                  </button>
                  <button 
                    className="btn-view-details"
                    onClick={() => setSelectedEventDetails(item)}
                  >
                    View Details
                  </button>
                  <span className="stub-price-badge">{item.price > 0 ? `₹${item.price}` : 'FREE'}</span>
                </div>
              </div>

              {/* Right Column: Ticket Image with Cutout Notches & Perforation */}
              <div className="stub-image-col">
                <div className="stub-image-container">
                  <img src={item.image} alt={item.title} className="stub-img" />
                  <div className="ticket-notch notch-right"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Events Button */}
        <div className="view-all-center">
          <button className="btn-view-all-events" onClick={() => navigate('/dashboard')}>
            View All Events &rarr;
          </button>
        </div>

        {/* Clean Minimal Footer */}
        <footer className="minimal-footer-bottom">
          <div className="footer-content-inner">
            <div className="footer-brand-col">
              <span className="footer-logo">❖ Eventix</span>
              <p className="footer-tagline">Empowering experiences that shape the future.</p>
            </div>

            <div className="footer-links-grid">
              <div className="footer-col-item">
                <h5>Explore</h5>
                <a href="#home">Home</a>
                <a href="#upcoming-list">Upcoming Events</a>
                <a href="#upcoming-list">Featured</a>
              </div>
              <div className="footer-col-item">
                <h5>Platform</h5>
                <a href="/signin">Sign In</a>
                <a href="/signup">Sign Up</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/admin">Admin Center</a>
              </div>
              <div className="footer-col-item">
                <h5>Connect</h5>
                <a href="https://twitter.com">Twitter</a>
                <a href="https://instagram.com">Instagram</a>
                <a href="https://linkedin.com">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="footer-copyright-bar">
            <p>© {new Date().getFullYear()} Eventix Inc. All rights reserved.</p>
          </div>
        </footer>
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
                  <button className="btn-get-tickets" onClick={() => navigate('/dashboard')}>
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
    </section>
  );
};

export default Section3;
