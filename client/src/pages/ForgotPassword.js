import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password has been sent to your email. Please check your inbox.');
        setEmail('');
      } else {
        setError(data.message || 'Failed to send password. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('Network error. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: '40px 20px',
    },
    formCard: {
      backgroundColor: 'rgba(26, 26, 26, 0.95)',
      borderRadius: '8px',
      padding: '48px',
      width: '100%',
      maxWidth: '440px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
    },
    title: {
      fontSize: '32px',
      fontWeight: '300',
      margin: '0 0 16px 0',
      color: '#ffffff',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontFamily: "'Metropolis', 'Inter', sans-serif",
      textAlign: 'center',
    },
    description: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.6)',
      marginBottom: '32px',
      textAlign: 'center',
      lineHeight: '1.6',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: 'rgba(255, 255, 255, 0.7)',
      letterSpacing: '0.5px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    submitButton: {
      width: '100%',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#0a0a0a',
      backgroundColor: '#ffffff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginTop: '12px',
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    messageBox: {
      padding: '14px',
      borderRadius: '4px',
      marginBottom: '20px',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center',
    },
    successMessage: {
      backgroundColor: 'rgba(76, 175, 80, 0.15)',
      color: '#4CAF50',
      border: '1px solid rgba(76, 175, 80, 0.3)',
    },
    errorMessage: {
      backgroundColor: 'rgba(229, 9, 20, 0.15)',
      color: '#E50914',
      border: '1px solid rgba(229, 9, 20, 0.3)',
    },
    linksContainer: {
      marginTop: '24px',
      textAlign: 'center',
    },
    link: {
      color: '#E50914',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'color 0.2s ease',
      letterSpacing: '0.5px',
    },
  };

  const handleInputFocus = (e) => {
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
    e.target.style.borderColor = 'rgba(229, 9, 20, 0.5)';
  };

  const handleInputBlur = (e) => {
    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
  };

  const handleButtonHover = (e, isHover) => {
    if (!isSubmitting) {
      if (isHover) {
        e.target.style.backgroundColor = '#f0f0f0';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.2)';
      } else {
        e.target.style.backgroundColor = '#ffffff';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }
    }
  };

  const handleLinkHover = (e, isHover) => {
    e.target.style.color = isHover ? '#f40612' : '#E50914';
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Forgot Password</h2>
        <p style={styles.description}>
          Enter your email address and we'll send your password to your inbox.
        </p>

        {message && (
          <div style={{...styles.messageBox, ...styles.successMessage}}>
            {message}
          </div>
        )}

        {error && (
          <div style={{...styles.messageBox, ...styles.errorMessage}}>
            {error}
          </div>
        )}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.input}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitButton,
              ...(isSubmitting ? styles.submitButtonDisabled : {})
            }}
            onMouseEnter={(e) => handleButtonHover(e, true)}
            onMouseLeave={(e) => handleButtonHover(e, false)}
          >
            {isSubmitting ? 'Sending...' : 'Send Password'}
          </button>
        </form>

        <div style={styles.linksContainer}>
          <Link
            to="/login"
            style={styles.link}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
