import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Fetch user from database by email
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const users = await response.json();
      console.log('Fetched users:', users); // Debug log
      
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      console.log('Found user:', user); // Debug log
      
      // Verify password
      const response2 = await fetch('/api/users/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email, 
          password: password 
        })
      });
      
      const verifyResult = await response2.json();
      
      if (!response2.ok || !verifyResult.valid) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }

      // Check if user is admin
      const isAdmin = user.role === 'admin';

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify({
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        role: user.role
      }));

      // Dispatch auth change event
      window.dispatchEvent(new Event('auth-change'));

      console.log('Login successful, navigating...'); // Debug log

      // Navigate based on role
      if (isAdmin) {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
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
      fontSize: '36px',
      fontWeight: '300',
      margin: '0 0 32px 0',
      color: '#ffffff',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontFamily: "'Metropolis', 'Inter', sans-serif",
      textAlign: 'center',
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
    loginButton: {
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
    errorText: {
      fontSize: '14px',
      color: '#E50914',
      marginTop: '12px',
      textAlign: 'center',
      fontWeight: '500',
    },
    divider: {
      margin: '32px 0 24px 0',
      textAlign: 'center',
      position: 'relative',
    },
    dividerLine: {
      height: '1px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    registerSection: {
      textAlign: 'center',
    },
    registerText: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.6)',
      marginBottom: '16px',
    },
    registerButton: {
      width: '100%',
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#E50914',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      letterSpacing: '1px',
      textTransform: 'uppercase',
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

  const handleLoginButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.backgroundColor = '#f0f0f0';
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 4px 12px rgba(255, 255, 255, 0.2)';
    } else {
      e.target.style.backgroundColor = '#ffffff';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }
  };

  const handleRegisterButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.backgroundColor = '#f40612';
      e.target.style.transform = 'translateY(-2px)';
      e.target.style.boxShadow = '0 4px 12px rgba(229, 9, 20, 0.4)';
    } else {
      e.target.style.backgroundColor = '#E50914';
      e.target.style.transform = 'translateY(0)';
      e.target.style.boxShadow = 'none';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Login</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.input}
              required
            />
          </div>
          <button 
            type="submit"
            style={styles.loginButton}
            onMouseEnter={(e) => handleLoginButtonHover(e, true)}
            onMouseLeave={(e) => handleLoginButtonHover(e, false)}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p style={styles.errorText}>{error}</p>}
        </form>
        
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#E50914'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
          >
            Forgot your password?
          </button>
        </div>
        
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
        </div>
        
        <div style={styles.registerSection}>
          <p style={styles.registerText}>Not a member yet?</p>
          <button 
            style={styles.registerButton}
            onMouseEnter={(e) => handleRegisterButtonHover(e, true)}
            onMouseLeave={(e) => handleRegisterButtonHover(e, false)}
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
