import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderConfirmation(){
  const { state } = useLocation();
  const nav = useNavigate();

  const orderNo = state?.orderNo || 'ORD-TEST';
  const total = state?.total ?? 0;
  const tickets = state?.tickets || [];
  const movie = state?.movie || {};

  const when = new Date().toLocaleString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: 'numeric', 
    minute: '2-digit' 
  });

  // Add global style
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = '#0a0a0a';
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: 0,
      margin: 0,
    },
    header: {
      padding: '40px 60px',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,0.8) 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    content: {
      padding: '60px 60px',
      maxWidth: '800px',
      margin: '0 auto',
      textAlign: 'center',
    },
    successIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      border: '3px solid #22c55e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 32px',
      fontSize: '40px',
    },
    title: {
      fontSize: '42px',
      fontWeight: '600',
      margin: '0 0 16px 0',
      color: '#ffffff',
      letterSpacing: '2px',
    },
    subtitle: {
      fontSize: '18px',
      color: 'rgba(255,255,255,0.6)',
      margin: '0 0 48px 0',
      fontWeight: '300',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '24px',
      textAlign: 'left',
    },
    orderNumber: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#E50914',
      letterSpacing: '3px',
      marginBottom: '32px',
      textAlign: 'center',
      padding: '24px',
      backgroundColor: 'rgba(229, 9, 20, 0.1)',
      borderRadius: '8px',
      border: '1px solid rgba(229, 9, 20, 0.3)',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '15px',
    },
    infoLabel: {
      color: 'rgba(255,255,255,0.6)',
      fontWeight: '500',
    },
    infoValue: {
      color: '#ffffff',
      fontWeight: '600',
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '20px',
      color: '#ffffff',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
    },
    ticketItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 16px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '6px',
      marginBottom: '8px',
      fontSize: '14px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      marginTop: '40px',
    },
    homeButton: {
      flex: 1,
      padding: '18px',
      backgroundColor: '#E50914',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
    },
    bookButton: {
      flex: 1,
      padding: '18px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
    },
    emailNotice: {
      marginTop: '32px',
      padding: '16px',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '8px',
      fontSize: '14px',
      color: 'rgba(255,255,255,0.7)',
      lineHeight: '1.6',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}></div>

      <div style={styles.content}>
        {/* Success Icon */}
        <div style={styles.successIcon}>✓</div>

        {/* Title */}
        <h1 style={styles.title}>Booking Confirmed!</h1>
        <p style={styles.subtitle}>Your tickets have been successfully reserved</p>

        {/* Order Number */}
        <div style={styles.orderNumber}>{orderNo}</div>

        {/* Booking Details */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Booking Information</div>
          
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Movie:</span>
            <span style={styles.infoValue}>{movie.title || 'N/A'}</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Confirmation Time:</span>
            <span style={styles.infoValue}>{when}</span>
          </div>

          <div style={{...styles.infoRow, borderBottom: 'none'}}>
            <span style={styles.infoLabel}>Total Paid:</span>
            <span style={{...styles.infoValue, color: '#22c55e', fontSize: '18px'}}>${Number(total).toFixed(2)}</span>
          </div>
        </div>

        {/* Tickets */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Your Tickets</div>
          {tickets.map((ticket, i) => (
            <div key={i} style={styles.ticketItem}>
              <span>
                <strong>Seat {ticket.seat}</strong> - {ticket.ageCategory.charAt(0).toUpperCase() + ticket.ageCategory.slice(1)}
              </span>
              <span>${parseFloat(ticket.price).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Email Notice */}
        <div style={styles.emailNotice}>
          📧 A confirmation email with your tickets and QR code has been sent to your email address.
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
          <button
            style={styles.homeButton}
            onClick={() => nav('/')}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#c40812';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(229, 9, 20, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#E50914';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Back to Home
          </button>
          <button
            style={styles.bookButton}
            onClick={() => nav('/buy')}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Book Another Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
