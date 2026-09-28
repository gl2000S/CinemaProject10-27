import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminMain(){
  const navigate = useNavigate();
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      padding: '60px',
      fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    title: {
      fontSize: '42px',
      fontWeight: '300',
      margin: '0 0 48px 0',
      color: '#ffffff',
      letterSpacing: '4px',
      textTransform: 'uppercase',
      fontFamily: "'Metropolis', 'Inter', sans-serif",
      textAlign: 'center',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    card: {
      backgroundColor: 'rgba(26, 26, 26, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '32px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '180px',
    },
    icon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: '500',
      color: '#ffffff',
      margin: '0 0 8px 0',
      letterSpacing: '1px',
    },
    cardDesc: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.5)',
      margin: 0,
    },
    disabledCard: {
      backgroundColor: 'rgba(26, 26, 26, 0.5)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '32px',
      textAlign: 'center',
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Panel</h1>
      <div style={styles.grid}>
        <div 
          style={styles.card}
          onClick={() => navigate('/admin/movies')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(229, 9, 20, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.icon}>🎬</div>
          <h2 style={styles.cardTitle}>Manage Movies</h2>
          <p style={styles.cardDesc}>Add, edit, or remove movies from the catalog</p>
        </div>

        <div 
          style={styles.card}
          onClick={() => navigate('/admin/showtimes')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(229, 9, 20, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.icon}>🎞️</div>
          <h2 style={styles.cardTitle}>Manage Showtimes</h2>
          <p style={styles.cardDesc}>Schedule and manage movie showtimes</p>
        </div>

        <div 
          style={styles.card}
          onClick={() => navigate('/admin/promotions')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(229, 9, 20, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.icon}>🎟️</div>
          <h2 style={styles.cardTitle}>Manage Promotions</h2>
          <p style={styles.cardDesc}>Create and manage discount codes</p>
        </div>

        <div 
          style={styles.card}
          onClick={() => navigate('/admin/users')}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(229, 9, 20, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div style={styles.icon}>👥</div>
          <h2 style={styles.cardTitle}>Manage Users</h2>
          <p style={styles.cardDesc}>View and manage user accounts</p>
        </div>
      </div>
    </div>
  );
}
