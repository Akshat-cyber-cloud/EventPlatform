import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import '../styles/Section1.css';

const CountdownBox = ({ initialHours = 7, initialMinutes = 48, initialSeconds = 35 }) => {
  const [time, setTime] = useState({ hours: initialHours, minutes: initialMinutes, seconds: initialSeconds });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-container">
      <span className="countdown-label">Remaining Times</span>
      <div className="countdown-grid">
        <div className="time-block">
          <span className="time-val">{String(time.hours).padStart(2, '0')}</span>
          <span className="time-unit">Hours</span>
        </div>
        <div className="time-divider">:</div>
        <div className="time-block">
          <span className="time-val">{String(time.minutes).padStart(2, '0')}</span>
          <span className="time-unit">Minutes</span>
        </div>
        <div className="time-divider">:</div>
        <div className="time-block">
          <span className="time-val">{String(time.seconds).padStart(2, '0')}</span>
          <span className="time-unit">Seconds</span>
        </div>
      </div>
    </div>
  );
};

const Section1 = () => {
  const [activeTab, setActiveTab] = useState('Today');
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'), limit(3));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        setFeaturedEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    });
    return () => unsub();
  }, []);

  const defaultEvents = [
    {
      id: 'f1',
      title: 'Music Festival 2026',
      description: 'Experience an unforgettable night with top artists featuring glowing light shows.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      hours: 7, minutes: 48, seconds: 35
    },
    {
      id: 'f2',
      title: 'Global Tech Summit',
      description: 'Join visionaries discussing AI, Cloud and Serverless architectures.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
      hours: 12, minutes: 15, seconds: 20
    },
    {
      id: 'f3',
      title: 'Design & Code Hackathon',
      description: 'Build innovative web apps with real-time features and compete for grand prizes.',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80',
      hours: 23, minutes: 0, seconds: 45
    }
  ];

  const displayList = featuredEvents.length > 0 
    ? featuredEvents.slice(0, 3).map((e, idx) => ({
        id: e.id,
        title: e.title,
        description: e.content || 'Join this exciting live experience with top attendees.',
        image: e.image || defaultEvents[idx % 3].image,
        hours: (idx + 1) * 5,
        minutes: 30 + idx * 10,
        seconds: 45 - idx * 10
      }))
    : defaultEvents;

  return (
    <section className="events-for-you-section" id="events-for-you" data-scroll-section>
      <div className="section-header-center">
        <h2 className="section-title-clean">Events For You</h2>
        <div className="time-tabs">
          {['Today', 'Tomorrow', 'This weekend'].map(tab => (
            <button 
              key={tab} 
              className={`time-tab-pill ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="events-cards-grid">
        {displayList.map(event => (
          <motion.div 
            key={event.id}
            className="for-you-card"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card-thumb-wrapper">
              <img src={event.image} alt={event.title} className="card-thumb" />
            </div>
            <div className="card-body-clean">
              <h3 className="event-card-title">{event.title}</h3>
              <p className="event-card-desc">{event.description}</p>
              
              {/* Countdown Component */}
              <CountdownBox 
                initialHours={event.hours} 
                initialMinutes={event.minutes} 
                initialSeconds={event.seconds} 
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Section1;