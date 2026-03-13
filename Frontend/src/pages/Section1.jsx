import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Section1.css';

const Section1 = () => {
  // Stagger variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">
            Everything You Need to Run Events —<br />
            Without the Complexity
          </h2>
          <p className="features-subtitle">
            Our serverless platform automates ticketing, check-ins, analytics, and notifications so you can focus on delivering great events.
          </p>
        </div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Card 1: Smart Ticketing (Narrow) */}
          <motion.div className="feature-card card-narrow" variants={itemVariants}>
            <div className="card-visual visual-ticketing">
              <div className="visual-glow glow-orange"></div>
              <div className="mock-ui mock-command-menu">
                <div className="mock-search">
                  <span className="icon">🎟️</span>
                  <motion.span 
                    initial={{ width: 0 }} 
                    whileInView={{ width: "auto" }} 
                    transition={{ duration: 1.5, ease: "steps(15)", delay: 0.5 }}
                    style={{ overflow: 'hidden', display: 'inline-block', whiteSpace: 'nowrap' }}
                  >
                    Search tickets...
                  </motion.span>
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    |
                  </motion.span>
                </div>
                <motion.div 
                  className="mock-items"
                  initial="hidden"
                  whileInView="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1, delayChildren: 1.5 } }
                  }}
                >
                  <motion.div className="mock-item active" variants={itemVariants}>General Admission <span className="mock-shortcut">$49</span></motion.div>
                  <motion.div className="mock-item" variants={itemVariants}>VIP Pass <span className="mock-shortcut">$149</span></motion.div>
                  <motion.div className="mock-item" variants={itemVariants}>Early Bird <span className="mock-shortcut">$29</span></motion.div>
                </motion.div>
              </div>
            </div>
            <div className="card-content">
              <h3>Smart Ticketing.</h3>
              <p>Create and sell tickets instantly. Support dynamic pricing and a secure booking system.</p>
            </div>
          </motion.div>

          {/* Card 2: Real-Time Check-Ins (Wide) */}
          <motion.div className="feature-card card-wide" variants={itemVariants}>
            <div className="card-visual visual-checkin">
              <div className="visual-glow glow-blue"></div>
              <div className="mock-ui mock-kanban">
                <div className="mock-board-column">
                  <div className="column-header">Arrived</div>
                  <motion.div 
                    className="mock-task"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <div className="task-title">Jane Doe</div>
                    <div className="task-meta">VIP Pass • 10:05 AM</div>
                  </motion.div>
                  <motion.div 
                    className="mock-task"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    <div className="task-title">John Smith</div>
                    <div className="task-meta">General • 10:12 AM</div>
                  </motion.div>
                </div>
                <div className="mock-board-column dim">
                  <div className="column-header">Pending Validation</div>
                  <motion.div 
                    className="mock-task skeleton"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  ></motion.div>
                </div>
              </div>
            </div>
            <div className="card-content">
              <h3>Real-Time Check-Ins.</h3>
              <p>QR code based entry with instant attendee verification and live tracking across all gates.</p>
            </div>
          </motion.div>

          {/* Card 3: Live Analytics (Wide) */}
          <motion.div className="feature-card card-wide" variants={itemVariants}>
            <div className="card-visual visual-analytics">
              <div className="visual-glow glow-purple"></div>
              <div className="mock-ui mock-chart">
                <div className="chart-bars">
                  <motion.div className="bar" initial={{ height: 0 }} whileInView={{ height: '40%' }} transition={{ duration: 1, delay: 0.2 }}></motion.div>
                  <motion.div className="bar" initial={{ height: 0 }} whileInView={{ height: '70%' }} transition={{ duration: 1, delay: 0.3 }}></motion.div>
                  <motion.div className="bar" initial={{ height: 0 }} whileInView={{ height: '100%' }} transition={{ duration: 1, delay: 0.4 }} style={{ background: '#8a2be2' }}></motion.div>
                  <motion.div className="bar" initial={{ height: 0 }} whileInView={{ height: '60%' }} transition={{ duration: 1, delay: 0.5 }}></motion.div>
                  <motion.div className="bar" initial={{ height: 0 }} whileInView={{ height: '85%' }} transition={{ duration: 1, delay: 0.6 }}></motion.div>
                </div>
                <div className="chart-stats">
                  <div className="stat-pill"><span className="dot pink"></span> Revenue Insights</div>
                  <div className="stat-pill"><span className="dot blue"></span> Ticket Sales</div>
                </div>
              </div>
            </div>
            <div className="card-content">
              <h3>Live Analytics.</h3>
              <p>Monitor ticket sales, track attendance patterns, and gain actionable revenue insights instantly.</p>
            </div>
          </motion.div>

          {/* Card 4: Automated Notifications (Narrow) */}
          <motion.div className="feature-card card-narrow" variants={itemVariants}>
            <div className="card-visual visual-notifications">
              <div className="visual-glow glow-multi ring-spin"></div>
              <motion.div 
                className="notification-bell"
                animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              >
                <span className="bell-icon">🔔</span>
                <motion.span 
                  className="badge"
                  initial={{ scale: 0 }}
                  // whileInView={{ scale: 2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15, delay: 1 }}
                >
                  3
                </motion.span>
              </motion.div>
            </div>
            <div className="card-content">
              <h3>Automated Notifications.</h3>
              <p>Send event reminders, schedule updates, via email and push notifications automatically.</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section1;