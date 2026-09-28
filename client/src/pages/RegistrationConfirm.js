import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function RegistrationConfirm(){
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || 'your email';

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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      maxWidth: '600px',
      padding: '60px 40px',
      textAlign: 'center',
    },
    successIcon: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      border: '3px solid #22c55e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 40px',
      fontSize: '50px',
    },
    title: {
      fontSize: '48px',
      fontWeight: '600',
      margin: '0 0 24px 0',
      color: '#ffffff',
      letterSpacing: '2px',
    },
    message: {
      fontSize: '18px',
      color: 'rgba(255,255,255,0.7)',
      margin: '0 0 16px 0',
      lineHeight: '1.6',
    },
    emailHighlight: {
      color: '#E50914',
      fontWeight: '600',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '48px',
    },
    instructions: {
      fontSize: '15px',
      color: 'rgba(255,255,255,0.6)',
      lineHeight: '1.8',
      marginBottom: '32px',
      textAlign: 'left',
    },
    instructionItem: {
      marginBottom: '12px',
      paddingLeft: '24px',
      position: 'relative',
    },
    bullet: {
      position: 'absolute',
      left: '0',
      color: '#E50914',
      fontWeight: '600',
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
      <div style={styles.content}>
        {/* Success Icon */}
        <div style={styles.successIcon}>✓</div>

        {/* Title */}
        <h1 style={styles.title}>Registration Successful!</h1>

        {/* Message */}
        <p style={styles.message}>
          Thank you for registering with Team 4 Cinemas!
        </p>
        <p style={styles.message}>
          A verification email has been sent to <span style={styles.emailHighlight}>{email}</span>
        </p>

        {/* Instructions Card */}
        <div style={styles.card}>
          <div style={styles.instructions}>
            <div style={styles.instructionItem}>
              <span style={styles.bullet}>1.</span>
              Check your inbox for the verification email
            </div>
            <div style={styles.instructionItem}>
              <span style={styles.bullet}>2.</span>
              Click the verification link in the email
            </div>
            <div style={styles.instructionItem}>
              <span style={styles.bullet}>3.</span>
              Return here to log in and start booking tickets
            </div>
          </div>

          <button
            style={styles.button}
            onClick={() => navigate('/login')}
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
            Continue to Login
          </button>
        </div>

        <p style={{...styles.message, marginTop: '32px', fontSize: '14px'}}>
          Didn't receive the email? Check your spam folder or contact support.
        </p>
      </div>
    </div>
  );
}
