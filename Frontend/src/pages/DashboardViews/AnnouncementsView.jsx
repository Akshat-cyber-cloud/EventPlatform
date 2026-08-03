import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";
import "../Dashboard.css";

const tagStyles = {
  Alert: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", label: "⚠️ URGENT ALERT" },
  Register: { bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", label: "🎟️ REGISTRATION OPEN" },
  Payment: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", label: "💳 PAYMENT UPDATE" },
  Broadcast: { bg: "#fff8e6", color: "#b37400", border: "#ffe099", label: "📢 ANNOUNCEMENT" }
};

export default function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnnouncements(docs);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching announcements:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "Recent";
    }
  };

  const defaultAnnouncements = [
    {
      id: 'demo1',
      message: 'Global AI & Serverless Hackathon 3.0 registration is now live! Lock in your team slots early.',
      type: 'Register',
      createdAt: null
    },
    {
      id: 'demo2',
      message: 'Schedule update: William Smith Comedy Show stage doors open at 6:30 PM sharp on June 27th.',
      type: 'Broadcast',
      createdAt: null
    },
    {
      id: 'demo3',
      message: 'Payment Gateway Integration: Razorpay UPI and Cards are 100% active for instant ticket confirmation.',
      type: 'Payment',
      createdAt: null
    }
  ];

  const displayList = announcements.length > 0 ? announcements : defaultAnnouncements;

  if (loading) {
    return <div className="loader">Loading Announcements...</div>;
  }

  return (
    <motion.div
      className="view-content"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="section-title">Live Announcements</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%' }}>
        {displayList.map(a => {
          const tagInfo = tagStyles[a.type] || tagStyles.Broadcast;

          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                padding: "1.5rem 1.8rem",
                color: "#111111",
                boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{
                  background: tagInfo.bg,
                  color: tagInfo.color,
                  border: `1px solid ${tagInfo.border}`,
                  padding: "0.25rem 0.75rem",
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.5px"
                }}>
                  {tagInfo.label}
                </span>

                <span style={{ fontSize: "0.8rem", color: "#888888", fontWeight: 600 }}>
                  🕒 {formatTime(a.createdAt)}
                </span>
              </div>

              <p style={{ fontSize: "1rem", color: "#222222", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                {a.message}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
