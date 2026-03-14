import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useSpring, useTransform } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LightPillar from '../components/LightPillar';
import './Home.css';

const MagneticButton = ({ children, className, ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="magnetic-wrap"
    >
      <button className={className} {...props}>
        {children}
      </button>
    </motion.div>
  );
};

const Home = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="home-container" data-scroll-section>
      <div className="grain-overlay"></div>
      <div className="home-background">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF27B3"
          intensity={0.7}
          rotationSpeed={0.2}
          glowAmount={0.002}
          pillarWidth={5}
          pillarHeight={0.6}
          noiseIntensity={0.3}
          pillarRotation={10}
          interactive={false}
          mixBlendMode="plus-lighter"
          quality="high"
        />
      </div>

      <div className="home-content">
        <nav className="navbar">
          <div className="nav-logo">EVENTIX</div>
          <div className="nav-right">
            {currentUser ? (
              <button className="nav-connect-btn" onClick={logout}>Sign Out</button>
            ) : (
              <Link to="/signin" className="nav-connect-btn" style={{ textDecoration: 'none' }}>Sign In</Link>
            )}
          </div>
        </nav>

        <main className="hero-section">
          <motion.p 
            className="hero-label-top"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            THE FUTURE OF EVENTS
          </motion.p>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
          >
            EVENTIX
          </motion.h1>

          <motion.p 
            className="hero-label-bottom"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            SCALE. INFINITE.
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <MagneticButton className="btn btn-primary">START EVENT</MagneticButton>
            <MagneticButton className="btn btn-secondary">EXPLORE</MagneticButton>
          </motion.div>
        </main>

        <div className="scroll-indicator">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
