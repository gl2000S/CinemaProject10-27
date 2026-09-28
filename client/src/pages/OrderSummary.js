import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderSummary(){
  const { state } = useLocation();
  const nav = useNavigate();
  const sel = state?.selection || { tickets: [] };
  const movie = state?.movie || {};
  const tickets = sel.tickets || [];
  
  const subtotal = tickets.reduce((sum, ticket) => sum + parseFloat(ticket.price), 0);
  const fees = 2.00;
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + fees + tax).toFixed(2);

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
    title: {
      fontSize: '48px',
      fontWeight: '300',
      margin: '0 0 12px 0',
      color: '#ffffff',
      letterSpacing: '6px',
      textTransform: 'uppercase',
      fontFamily: "'Metropolis', 'Inter', sans-serif",
    },
    subtitle: {
      fontSize: '16px',
      color: 'rgba(255,255,255,0.6)',
      margin: 0,
      fontWeight: '300',
    },
    content: {
      padding: '40px 60px',
      maxWidth: '900px',
      margin: '0 auto',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '24px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '24px',
      color: '#ffffff',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '24px',
    },
    th: {
      textAlign: 'left',
      padding: '16px',
      borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
      color: 'rgba(255,255,255,0.7)',
      fontSize: '14px',
      fontWeight: '600',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    td: {
      padding: '16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
      fontSize: '15px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      fontSize: '16px',
      color: 'rgba(255,255,255,0.8)',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px 0',
      fontSize: '24px',
      fontWeight: '700',
      color: '#ffffff',
      borderTop: '2px solid rgba(255, 255, 255, 0.2)',
      marginTop: '16px',
    },
    button: {
      width: '100%',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Order Summary</div>
        <div style={styles.subtitle}>Review your order before proceeding to checkout</div>
      </div>

      <div style={styles.content}>
        {/* Movie Info */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Movie Details</div>
          <div style={styles.summaryRow}>
            <span>Movie:</span>
            <span style={{fontWeight: '600'}}>{movie.title || 'N/A'}</span>
          </div>
        </div>

        {/* Tickets */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Tickets</div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Seat</th>
                <th style={styles.th}>Type</th>
                <th style={{...styles.th, textAlign: 'right'}}>Price</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket, i) => (
                <tr key={i}>
                  <td style={styles.td}>{ticket.seat}</td>
                  <td style={styles.td}>
                    {ticket.ageCategory.charAt(0).toUpperCase() + ticket.ageCategory.slice(1)}
                  </td>
                  <td style={{...styles.td, textAlign: 'right'}}>${parseFloat(ticket.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Total */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Order Total</div>
          <div style={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Booking Fees:</span>
            <span>${fees.toFixed(2)}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Tax (7%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div style={styles.totalRow}>
            <span>Total:</span>
            <span style={{color: '#E50914'}}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button 
          style={styles.button}
          onClick={() => nav('/checkout', { state: { total, tickets, movie } })}
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
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
