import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserTickets } from "../../services/registrationService";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "../Dashboard.css";

export default function TicketsView() {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (currentUser?.uid) {
        const userTickets = await getUserTickets(currentUser.uid);
        setTickets(userTickets);
      }
      setLoading(false);
    };
    fetchTickets();
  }, [currentUser]);

  const handleDownloadPDF = (ticket) => {
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert("Pop-up blocker prevented printing. Please allow popups for this site.");
      return;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`TicketID: ${ticket.ticketId || 'TKT-LIVE'}, Attendee: ${currentUser?.displayName || currentUser?.email}`)}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Eventix Pass - ${ticket.title}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f5f8; padding: 40px; color: #111; }
            .ticket-box { background: #ffffff; border-radius: 16px; border: 2px solid #E87A3E; max-width: 650px; margin: 0 auto; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px; margin-bottom: 20px; }
            .brand { font-size: 24px; font-weight: 900; color: #111; }
            .brand span { color: #E87A3E; }
            .badge { background: #fff8e6; color: #b37400; border: 1px solid #ffe099; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; text-transform: uppercase; }
            .title { font-family: Georgia, serif; font-size: 26px; font-weight: 800; margin: 0 0 8px 0; color: #111; }
            .subtitle { color: #666; font-size: 14px; margin-bottom: 20px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e5e7eb; }
            .label { font-size: 11px; font-weight: 800; color: #888; text-transform: uppercase; display: block; margin-bottom: 4px; }
            .val { font-size: 15px; font-weight: 700; color: #111; }
            .qr-sec { display: flex; justify-content: space-between; align-items: center; border-top: 2px dashed #e2e8f0; pt-20; margin-top: 20px; padding-top: 20px; }
            .qr-img { width: 130px; height: 130px; border-radius: 8px; border: 1px solid #ddd; }
            .footer-note { font-size: 11px; color: #999; text-align: center; margin-top: 30px; }
            @media print { body { background: #fff; padding: 0; } .ticket-box { box-shadow: none; border-color: #111; } }
          </style>
        </head>
        <body>
          <div class="ticket-box">
            <div class="header">
              <div class="brand"><span>❖</span> Eventix Pass</div>
              <div class="badge">✓ OFFICIAL ENTRY TICKET</div>
            </div>
            
            <h1 class="title">${ticket.title}</h1>
            <div class="subtitle">📍 ${ticket.location || 'LPU Auditorium'}</div>

            <div class="grid">
              <div>
                <span class="label">DATE & TIME</span>
                <span class="val">📅 ${ticket.date || 'JUN 28, 2026'} (${ticket.time || '7:00 PM'})</span>
              </div>
              <div>
                <span class="label">TICKET ID</span>
                <span class="val" style="color: #96583A;">${ticket.ticketId || ticket.id || 'TKT-884920'}</span>
              </div>
              <div>
                <span class="label">PASS TYPE</span>
                <span class="val">${ticket.participationType?.toUpperCase() || 'INDIVIDUAL PASS'}</span>
              </div>
              <div>
                <span class="label">AMOUNT PAID</span>
                <span class="val" style="color: #16a34a;">${ticket.amount > 0 ? `₹${ticket.amount}` : 'PAID (FREE)'}</span>
              </div>
            </div>

            <div class="qr-sec">
              <div>
                <span class="label">ATTENDEE NAME</span>
                <div class="val" style="font-size: 18px;">${currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Guest Attendee'}</div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">${currentUser?.email}</div>
                ${ticket.paymentId ? `<div style="font-size: 11px; color: #888; margin-top: 8px;">TXN: ${ticket.paymentId}</div>` : ''}
              </div>
              <img src="${qrUrl}" alt="QR Code" class="qr-img" />
            </div>

            <div class="footer-note">Scan QR code at venue entrance for instant check-in. Eventix Platform.</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const sampleTickets = [
    {
      id: 'st1',
      ticketId: 'TKT-993821',
      title: 'Global AI & Serverless Hackathon 3.0',
      date: '2026-06-29',
      time: '9:00 AM',
      location: 'LPU Innovation Hub',
      participationType: 'Team',
      teamName: 'CyberCloud Innovators',
      amount: 0,
      paymentId: 'pay_N891238912',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const displayTickets = tickets.length > 0 ? tickets : sampleTickets;

  if (loading) {
    return <div className="loader">Loading Tickets...</div>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      className="view-content"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="section-title">My Event Passes ({displayTickets.length})</h3>

      <motion.div
        className="ticket-stubs-list-my-tickets"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}
      >
        {displayTickets.map(ticket => {
          const dateParts = (ticket.date || '2026-06-27').split('-');
          const yearStr = dateParts[0] || '2026';
          const monthNum = parseInt(dateParts[1] || '06', 10);
          const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          const monthStr = monthNames[monthNum - 1] || 'JUN';
          const dayStr = dateParts[2] || '27';

          return (
            <motion.div 
              key={ticket.id} 
              variants={itemVariants} 
              className="ticket-stub-card premium-ticket-stub"
              whileHover={{ y: -4, boxShadow: "0 16px 35px rgba(232, 122, 62, 0.12)" }}
              transition={{ duration: 0.2 }}
            >
              {/* Left Date Column */}
              <div className="stub-date-col">
                <div className="stub-date-box">
                  <span className="stub-month">{monthStr}</span>
                  <span className="stub-day">{dayStr}</span>
                  <span className="stub-year">{yearStr}</span>
                </div>
                <div className="stub-time-badge">
                  {ticket.time || '7:00 PM'}
                </div>
              </div>

              {/* Middle Info Column */}
              <div className="stub-info-col">
                <div className="stub-header-tags">
                  <span className="stub-category-tag">{ticket.participationType?.toUpperCase() || 'CONFIRMED PASS'}</span>
                  <span className="vip-foil-badge">✓ {ticket.ticketId || 'CONFIRMED PASS'}</span>
                </div>

                <h3 className="stub-event-title">{ticket.title}</h3>
                <p className="stub-event-subtitle">📍 {ticket.location || 'LPU Campus'} — {ticket.teamName ? `Team: ${ticket.teamName}` : 'Individual Access'}</p>

                <div className="stub-actions-group">
                  <button 
                    className="btn-get-tickets"
                    onClick={() => handleDownloadPDF(ticket)}
                  >
                    Download Pass (.PDF)
                  </button>
                  <button 
                    className="btn-view-details"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    View QR Pass
                  </button>
                  <span className="stub-price-badge">{ticket.amount > 0 ? `₹${ticket.amount}` : 'CONFIRMED'}</span>
                </div>
              </div>

              {/* Right Image Thumbnail */}
              <div className="stub-image-col">
                <div className="stub-image-container">
                  <img src={ticket.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'} alt={ticket.title} className="stub-img" />
                  <div className="ticket-notch notch-right"></div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* QR Ticket Pass Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTicket(null)}
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
              className="modal-ticket-pass"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                maxWidth: '500px',
                width: '100%',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                color: '#111111',
                padding: '2rem',
                position: 'relative',
                border: '2px solid #E87A3E'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#96583A', textTransform: 'uppercase', letterSpacing: '1px' }}>OFFICIAL EVENT TICKET PASS</span>
                  <h3 style={{ margin: '0.2rem 0 0 0', fontSize: '1.4rem', fontWeight: 800, color: '#111' }}>{selectedTicket.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  style={{ background: '#f3f4f6', border: 'none', color: '#111', width: '34px', height: '34px', borderRadius: '50%', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`TicketID: ${selectedTicket.ticketId || 'TKT-LIVE'}, Attendee: ${currentUser?.displayName || currentUser?.email}`)}`} 
                  alt="QR Code" 
                  style={{ width: '160px', height: '160px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '1rem', background: '#fff', padding: '8px' }}
                />
                <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 800, color: '#96583A', letterSpacing: '1px' }}>
                  {selectedTicket.ticketId || 'TKT-993821'}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.2rem' }}>
                  Scan at venue entry for instant check-in
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-get-tickets"
                  style={{ width: '100%', padding: '0.8rem', fontSize: '0.92rem' }}
                  onClick={() => handleDownloadPDF(selectedTicket)}
                >
                  Download (.PDF)
                </button>
                <button 
                  onClick={() => setSelectedTicket(null)}
                  style={{ background: '#f3f4f6', color: '#333', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
