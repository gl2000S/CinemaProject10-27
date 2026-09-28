import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Registration(){
  const nav = useNavigate();
  const [form, setForm] = useState({first:'', last:'', email:'', password:'', phone:'', receivePromotions: false});
  const [errors, setErrors] = useState({first:'', last:'', email:'', password:'', phone:''});
  const [touched, setTouched] = useState({first:false, last:false, email:false, password:false, phone:false});
  
  const validateField = (field, value) => {
    switch(field) {
      case 'first':
        if (!value.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        return '';
      
      case 'last':
        if (!value.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!value.includes('@')) return 'Email must contain @';
        const emailParts = value.split('@');
        if (emailParts.length !== 2) return 'Invalid email format';
        if (!emailParts[1].includes('.')) return 'Email must contain a domain (e.g., .com)';
        if (emailParts[0].length === 0) return 'Email must have a username before @';
        const domain = emailParts[1];
        if (domain.length < 3) return 'Invalid domain';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(value)) return 'Password must contain at least one number';
        return '';
      
      case 'phone':
        // Phone is optional, only validate if provided
        if (value && value.trim()) {
          const cleaned = value.replace(/\D/g, '');
          if (cleaned.length < 10) return 'Phone number must be at least 10 digits';
        }
        return '';
      
      default:
        return '';
    }
  };
  
  const handleChange = (field, value) => {
    setForm({...form, [field]: value});
    if (touched[field]) {
      setErrors({...errors, [field]: validateField(field, value)});
    }
  };
  
  const handleBlur = (field) => {
    setTouched({...touched, [field]: true});
    setErrors({...errors, [field]: validateField(field, form[field])});
  };
  
  const submit = async (e) => { 
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {first: true, last: true, email: true, password: true, phone: true};
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = {
      first: validateField('first', form.first),
      last: validateField('last', form.last),
      email: validateField('email', form.email),
      password: validateField('password', form.password),
      phone: validateField('phone', form.phone),
    };
    setErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) return;
    
    // Create user account in the database
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.first,
          last_name: form.last,
          email: form.email,
          phone: form.phone || null,
          role: 'customer',
          promo_subscription: form.receivePromotions ? 'Active' : 'Inactive',
          password: form.password // Note: In production, password should be hashed on the server
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.error || 'Unknown error'}`);
        return;
      }
      
      // Successfully created user, navigate to confirmation
      nav('/register/confirm', { state: { email: form.email }});
    } catch (err) {
      console.error('Registration error:', err);
      alert(`Registration failed: ${err.message}`);
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
      maxWidth: '500px',
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
    rowInputs: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
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
      marginTop: '12px',
    },
    requiredNote: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.5)',
      fontStyle: 'italic',
      marginTop: '8px',
      textAlign: 'center',
    },
    errorText: {
      fontSize: '12px',
      color: '#E50914',
      marginTop: '4px',
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
    loginSection: {
      textAlign: 'center',
    },
    loginText: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.6)',
      marginBottom: '16px',
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
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '24px',
      padding: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
      marginTop: '2px',
      accentColor: '#E50914',
    },
    checkboxLabel: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '14px',
      lineHeight: '1.6',
      cursor: 'pointer',
      userSelect: 'none',
    },
    checkboxHighlight: {
      color: '#E50914',
      fontWeight: '600',
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

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.title}>Register</h2>
        <form onSubmit={submit} style={styles.form}>
          <div style={styles.rowInputs}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>First Name *</label>
              <input 
                required 
                placeholder="Enter first name" 
                value={form.first} 
                onChange={e=>handleChange('first', e.target.value)}
                onFocus={handleInputFocus}
                onBlur={(e) => { handleInputBlur(e); handleBlur('first'); }}
                style={{...styles.input, borderColor: touched.first && errors.first ? '#E50914' : 'rgba(255, 255, 255, 0.2)'}}
              />
              {touched.first && errors.first && <p style={styles.errorText}>{errors.first}</p>}
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name *</label>
              <input 
                required 
                placeholder="Enter last name" 
                value={form.last} 
                onChange={e=>handleChange('last', e.target.value)}
                onFocus={handleInputFocus}
                onBlur={(e) => { handleInputBlur(e); handleBlur('last'); }}
                style={{...styles.input, borderColor: touched.last && errors.last ? '#E50914' : 'rgba(255, 255, 255, 0.2)'}}
              />
              {touched.last && errors.last && <p style={styles.errorText}>{errors.last}</p>}
            </div>
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email *</label>
            <input 
              required 
              type="email" 
              placeholder="Enter your email" 
              value={form.email} 
              onChange={e=>handleChange('email', e.target.value)}
              onFocus={handleInputFocus}
              onBlur={(e) => { handleInputBlur(e); handleBlur('email'); }}
              style={{...styles.input, borderColor: touched.email && errors.email ? '#E50914' : 'rgba(255, 255, 255, 0.2)'}}
            />
            {touched.email && errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password *</label>
            <input 
              required 
              type="password" 
              placeholder="Create a password" 
              value={form.password} 
              onChange={e=>handleChange('password', e.target.value)}
              onFocus={handleInputFocus}
              onBlur={(e) => { handleInputBlur(e); handleBlur('password'); }}
              style={{...styles.input, borderColor: touched.password && errors.password ? '#E50914' : 'rgba(255, 255, 255, 0.2)'}}
            />
            {touched.password && errors.password && <p style={styles.errorText}>{errors.password}</p>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone (Optional)</label>
            <input 
              placeholder="Enter phone number" 
              value={form.phone} 
              onChange={e=>handleChange('phone', e.target.value)}
              onFocus={handleInputFocus}
              onBlur={(e) => { handleInputBlur(e); handleBlur('phone'); }}
              style={{...styles.input, borderColor: touched.phone && errors.phone ? '#E50914' : 'rgba(255, 255, 255, 0.2)'}}
            />
            {touched.phone && errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
          </div>
          
          {/* Promotional Emails Checkbox */}
          <div style={styles.checkboxContainer}>
            <input 
              type="checkbox"
              id="receivePromotions"
              checked={form.receivePromotions}
              onChange={(e) => setForm({...form, receivePromotions: e.target.checked})}
              style={styles.checkbox}
            />
            <label 
              htmlFor="receivePromotions" 
              style={styles.checkboxLabel}
            >
              <span style={styles.checkboxHighlight}>📧 Keep me updated!</span> I want to receive promotional emails about <strong>exclusive discounts</strong>, <strong>new movie releases</strong>, and <strong>special offers</strong>.
            </label>
          </div>
          
          <button 
            type="submit"
            style={styles.registerButton}
            onMouseEnter={(e) => handleRegisterButtonHover(e, true)}
            onMouseLeave={(e) => handleRegisterButtonHover(e, false)}
          >
            Create Account
          </button>
          <p style={styles.requiredNote}>* Required fields</p>
        </form>
        
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
        </div>
        
        <div style={styles.loginSection}>
          <p style={styles.loginText}>Already have an account?</p>
          <button 
            style={styles.loginButton}
            onMouseEnter={(e) => handleLoginButtonHover(e, true)}
            onMouseLeave={(e) => handleLoginButtonHover(e, false)}
            onClick={() => nav('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
