import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LightPillar from '../components/LightPillar';
import './Home.css';
const Home = () => {
  const { currentUser, logout } = useAuth();
  return (
    <div className="home-container">
      <div className="home-background">
        <LightPillar
          topColor="#5227FF"
          bottomColor="#FF9FFC"
          intensity={1}
          rotationSpeed={0.3}
          glowAmount={0.002}
          pillarWidth={3}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={25}
          interactive={false}
          mixBlendMode="screen"
          quality="high"
        />
      </div>

      <div className="home-content">
        <nav className="navbar">
          <div className="nav-logo">
            {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg> */}
            HHHH
          </div>
          <div className="nav-links">
            <h4><a href="#" className="nav-link">HOME</a></h4>
            <h4><a href="#" className="nav-link">ABOUT</a></h4>
            <h4><a href="#" className="nav-link">SERVICES</a></h4>
            <h4><a href="#" className="nav-link">PROJECTS</a></h4>
          </div>
          <div className="nav-right">
            {currentUser ? (
              <button className="nav-connect-btn" onClick={logout}>Sign Out</button>
            ) : (
              <Link to="/signin" className="nav-connect-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Sign In</Link>
            )}
          </div>
        </nav>

        <main className="hero-section">
          <h1 className="hero-title">
            Run Events at Scale —<br />Without Running Servers.
          </h1>
          <div className="hero-actions">
            <button className="btn btn-primary">Get Started</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
