import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
    promo_subscription: 'Inactive'
  });
  const [paymentForm, setPaymentForm] = useState({
    saved_card_name: '',
    saved_card_number: '',
    saved_card_expiry: '',
    saved_billing_address: '',
    saved_billing_city: '',
    saved_billing_state: '',
    saved_billing_zip: ''
  });
  const [saving, setSaving] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [msg, setMsg] = useState(null);
  const [paymentMsg, setPaymentMsg] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordTouched, setPasswordTouched] = useState({
    currentPassword: false,
    password: false,
    confirmPassword: false
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

  // Load user data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setForm({
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          currentPassword: '',
          password: '',
          confirmPassword: '',
          promo_subscription: userData.promo_subscription || 'Inactive'
        });
        setPaymentForm({
          saved_card_name: userData.saved_card_name || '',
          saved_card_number: userData.saved_card_number || '',
          saved_card_expiry: userData.saved_card_expiry || '',
          saved_billing_address: userData.saved_billing_address || '',
          saved_billing_city: userData.saved_billing_city || '',
          saved_billing_state: userData.saved_billing_state || '',
          saved_billing_zip: userData.saved_billing_zip || ''
        });
      } catch (err) {
        console.error('Failed to parse user data:', err);
      }
    }
  }, []);

  const validatePasswordField = (field, value) => {
    switch(field) {
      case 'currentPassword':
        if (form.password || form.confirmPassword) {
          if (!value) return 'Current password is required to change password';
        }
        return '';
      
      case 'password':
        if (!value && (form.currentPassword || form.confirmPassword)) return 'New password is required';
        if (value && value.length < 8) return 'Password must be at least 8 characters';
        if (value && !/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
        if (value && !/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
        if (value && !/[0-9]/.test(value)) return 'Password must contain at least one number';
        return '';
      
      case 'confirmPassword':
        if (!value && (form.currentPassword || form.password)) return 'Please confirm your new password';
        if (value && value !== form.password) return 'Passwords do not match';
        return '';
      
      default:
        return '';
    }
  };

  const handlePasswordChange = (field, value) => {
    setForm({...form, [field]: value});
    if (passwordTouched[field]) {
      setPasswordErrors({...passwordErrors, [field]: validatePasswordField(field, value)});
    }
    // Also revalidate other password fields if they're touched
    const newErrors = {...passwordErrors};
    if (field === 'password' && passwordTouched.confirmPassword) {
      newErrors.confirmPassword = validatePasswordField('confirmPassword', form.confirmPassword);
    }
    if ((field === 'password' || field === 'confirmPassword') && passwordTouched.currentPassword) {
      newErrors.currentPassword = validatePasswordField('currentPassword', form.currentPassword);
    }
    setPasswordErrors(newErrors);
  };

  const handlePasswordBlur = (field) => {
    setPasswordTouched({...passwordTouched, [field]: true});
    setPasswordErrors({...passwordErrors, [field]: validatePasswordField(field, form[field])});
  };

  const onChange = (field, value) => {
    setForm({...form, [field]: value});
  };

  const validate = () => {
    if (!form.first_name.trim() || !form.last_name.trim() || !form.email.trim()) {
      setMsg({ type: 'error', text: 'Please fill all required fields.' });
      return false;
    }
    if (form.password || form.confirmPassword || form.currentPassword) {
      if (!form.currentPassword) {
        setMsg({ type: 'error', text: 'Please enter your current password to change it.' });
        return false;
      }
      if (!form.password || !form.confirmPassword) {
        setMsg({ type: 'error', text: 'Please enter both new password and confirmation.' });
        return false;
      }
      if (form.password !== form.confirmPassword) {
        setMsg({ type: 'error', text: 'New passwords do not match.' });
        return false;
      }
      if (form.password.length < 8) {
        setMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
        return false;
      }
    }
    return true;
  };

  const onSave = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (!validate()) return;

    if (!user?.user_id) {
      setMsg({ type: 'success', text: 'Profile updated successfully.' });
      return;
    }

    try {
      setSaving(true);

      // If changing password, verify current password first
      if (form.currentPassword || form.password || form.confirmPassword) {
        const verifyResp = await fetch('/api/users/verify-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            password: form.currentPassword
          })
        });

        if (!verifyResp.ok) {
          setMsg({ type: 'error', text: 'Current password is incorrect.' });
          setSaving(false);
          return;
        }
      }

      // Update profile (and password if provided)
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.trim(),
        promo_subscription: form.promo_subscription
      };

      // Add password to payload if changing it
      if (form.password) {
        payload.password = form.password;
      }

      const resp = await fetch(`/api/users/${user.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) throw new Error('save failed');
      
      // Update localStorage
      const updatedUser = { ...user, ...payload };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Reset password fields on success
      setForm(prev => ({
        ...prev,
        currentPassword: '',
        password: '',
        confirmPassword: ''
      }));
      setPasswordErrors({
        currentPassword: '',
        password: '',
        confirmPassword: ''
      });
      setPasswordTouched({
        currentPassword: false,
        password: false,
        confirmPassword: false
      });
      
      setMsg({ type: 'success', text: 'Profile updated successfully.' });
    } catch (e) {
      console.error(e);
      setMsg({ type: 'error', text: 'Could not save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    if (!user) return;
    setForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
      promo_subscription: user.promo_subscription || 'Inactive'
    });
    setPasswordErrors({
      currentPassword: '',
      password: '',
      confirmPassword: ''
    });
    setPasswordTouched({
      currentPassword: false,
      password: false,
      confirmPassword: false
    });
    setMsg(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19);
  };

  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentForm({...paymentForm, saved_card_number: formatted});
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setPaymentForm({...paymentForm, saved_card_expiry: formatted});
  };

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 5);
    setPaymentForm({...paymentForm, saved_billing_zip: value});
  };

  const onSavePayment = async (e) => {
    e.preventDefault();
    setPaymentMsg(null);

    if (!user?.user_id) {
      setPaymentMsg({ type: 'error', text: 'User not found.' });
      return;
    }

    try {
      setSavingPayment(true);
      const response = await fetch(`/api/users/${user.user_id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentForm)
      });

      if (!response.ok) throw new Error('Failed to save payment info');

      const updatedUser = await response.json();
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Update payment form with fresh data
      setPaymentForm({
        saved_card_name: updatedUser.saved_card_name || '',
        saved_card_number: updatedUser.saved_card_number || '',
        saved_card_expiry: updatedUser.saved_card_expiry || '',
        saved_billing_address: updatedUser.saved_billing_address || '',
        saved_billing_city: updatedUser.saved_billing_city || '',
        saved_billing_state: updatedUser.saved_billing_state || '',
        saved_billing_zip: updatedUser.saved_billing_zip || ''
      });

      setPaymentMsg({ type: 'success', text: 'Payment information saved successfully!' });
    } catch (err) {
      console.error('Payment save error:', err);
      setPaymentMsg({ type: 'error', text: 'Failed to save payment information.' });
    } finally {
      setSavingPayment(false);
    }
  };

  const onCancelPayment = () => {
    if (!user) return;
    setPaymentForm({
      saved_card_name: user.saved_card_name || '',
      saved_card_number: user.saved_card_number || '',
      saved_card_expiry: user.saved_card_expiry || '',
      saved_billing_address: user.saved_billing_address || '',
      saved_billing_city: user.saved_billing_city || '',
      saved_billing_state: user.saved_billing_state || '',
      saved_billing_zip: user.saved_billing_zip || ''
    });
    setPaymentMsg(null);
  };

  const onClearPayment = async () => {
    if (!window.confirm('Are you sure you want to remove saved payment information?')) {
      return;
    }

    setPaymentMsg(null);
    
    try {
      setSavingPayment(true);
      const response = await fetch(`/api/users/${user.user_id}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          saved_card_name: null,
          saved_card_number: null,
          saved_card_expiry: null,
          saved_billing_address: null,
          saved_billing_city: null,
          saved_billing_state: null,
          saved_billing_zip: null
        })
      });

      if (!response.ok) throw new Error('Failed to clear payment info');

      const updatedUser = await response.json();
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setPaymentForm({
        saved_card_name: '',
        saved_card_number: '',
        saved_card_expiry: '',
        saved_billing_address: '',
        saved_billing_city: '',
        saved_billing_state: '',
        saved_billing_zip: ''
      });

      setPaymentMsg({ type: 'success', text: 'Payment information removed successfully!' });
    } catch (err) {
      console.error('Payment clear error:', err);
      setPaymentMsg({ type: 'error', text: 'Failed to remove payment information.' });
    } finally {
      setSavingPayment(false);
    }
  };

  if (!form) return null;

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
      maxWidth: '800px',
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
      fontSize: '20px',
      fontWeight: '600',
      marginBottom: '24px',
      color: '#ffffff',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: 'rgba(255,255,255,0.8)',
      letterSpacing: '0.5px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '15px',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
    },
    inputDisabled: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: 'rgba(255,255,255,0.7)',
      cursor: 'not-allowed',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
    helperText: {
      fontSize: '13px',
      color: 'rgba(255,255,255,0.5)',
      marginTop: '6px',
    },
    errorText: {
      fontSize: '12px',
      color: '#E50914',
      marginTop: '4px',
      fontWeight: '500',
    },
    divider: {
      border: 'none',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      margin: '32px 0',
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      marginTop: '32px',
    },
    saveButton: {
      flex: 1,
      padding: '16px',
      backgroundColor: '#E50914',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
    },
    cancelButton: {
      flex: 1,
      padding: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
    },
    logoutButton: {
      width: '100%',
      padding: '16px',
      backgroundColor: 'rgba(229, 9, 20, 0.15)',
      color: '#E50914',
      border: '1px solid rgba(229, 9, 20, 0.3)',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      transition: 'all 0.3s ease',
    },
    message: {
      padding: '16px',
      borderRadius: '8px',
      marginTop: '24px',
      fontSize: '14px',
      fontWeight: '500',
    },
    messageSuccess: {
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      color: '#22c55e',
    },
    messageError: {
      backgroundColor: 'rgba(229, 9, 20, 0.15)',
      border: '1px solid rgba(229, 9, 20, 0.3)',
      color: '#E50914',
    },
    toggleContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '16px',
      transition: 'all 0.3s ease',
    },
    toggleLeft: {
      flex: 1,
    },
    toggleTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '6px',
    },
    toggleDescription: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.6)',
      lineHeight: '1.5',
    },
    toggleSwitch: {
      position: 'relative',
      width: '60px',
      height: '32px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    toggleSwitchActive: {
      backgroundColor: '#E50914',
      border: '1px solid #E50914',
    },
    toggleCircle: {
      position: 'absolute',
      top: '3px',
      left: '3px',
      width: '24px',
      height: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    },
    toggleCircleActive: {
      left: '31px',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      marginTop: '8px',
    },
    statusActive: {
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      color: '#22c55e',
      border: '1px solid rgba(34, 197, 94, 0.3)',
    },
    statusInactive: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255,255,255,0.6)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Account Settings</div>
        <div style={styles.subtitle}>Manage your profile information and security</div>
      </div>

      <div style={styles.content}>
        {/* Profile Information */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Profile Information</div>
          <form onSubmit={onSave}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name *</label>
              <input
                required
                value={form.first_name}
                onChange={e => onChange('first_name', e.target.value)}
                placeholder="John"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name *</label>
              <input
                required
                value={form.last_name}
                onChange={e => onChange('last_name', e.target.value)}
                placeholder="Doe"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address *</label>
              <input 
                value={form.email} 
                disabled 
                style={{...styles.input, ...styles.inputDisabled}}
              />
              <div style={styles.helperText}>Email address cannot be changed</div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                value={form.phone}
                onChange={e => onChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>

            <hr style={styles.divider} />

            <div style={styles.sectionTitle}>Change Password</div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Current Password</label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={e => handlePasswordChange('currentPassword', e.target.value)}
                onBlur={() => handlePasswordBlur('currentPassword')}
                placeholder="Enter current password"
                style={{
                  ...styles.input,
                  borderColor: passwordTouched.currentPassword && passwordErrors.currentPassword ? '#E50914' : 'rgba(255, 255, 255, 0.2)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
              />
              {passwordTouched.currentPassword && passwordErrors.currentPassword && (
                <div style={styles.errorText}>{passwordErrors.currentPassword}</div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => handlePasswordChange('password', e.target.value)}
                onBlur={() => handlePasswordBlur('password')}
                placeholder="Enter new password"
                style={{
                  ...styles.input,
                  borderColor: passwordTouched.password && passwordErrors.password ? '#E50914' : 'rgba(255, 255, 255, 0.2)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
              />
              {!passwordErrors.password && form.password && (
                <div style={styles.helperText}>
                  {form.password.length >= 8 ? '✓' : '○'} Minimum 8 characters
                  {' • '}
                  {/[A-Z]/.test(form.password) ? '✓' : '○'} Uppercase letter
                  {' • '}
                  {/[a-z]/.test(form.password) ? '✓' : '○'} Lowercase letter
                  {' • '}
                  {/[0-9]/.test(form.password) ? '✓' : '○'} Number
                </div>
              )}
              {passwordTouched.password && passwordErrors.password && (
                <div style={styles.errorText}>{passwordErrors.password}</div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => handlePasswordChange('confirmPassword', e.target.value)}
                onBlur={() => handlePasswordBlur('confirmPassword')}
                placeholder="Confirm new password"
                style={{
                  ...styles.input,
                  borderColor: passwordTouched.confirmPassword && passwordErrors.confirmPassword ? '#E50914' : 'rgba(255, 255, 255, 0.2)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
              />
              {passwordTouched.confirmPassword && passwordErrors.confirmPassword && (
                <div style={styles.errorText}>{passwordErrors.confirmPassword}</div>
              )}
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={saving}
                style={styles.saveButton}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.target.style.backgroundColor = '#c40812';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(229, 9, 20, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#E50914';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                disabled={saving}
                style={styles.cancelButton}
                onMouseEnter={(e) => {
                  if (!saving) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Cancel
              </button>
            </div>

            {msg && (
              <div style={{
                ...styles.message,
                ...(msg.type === 'error' ? styles.messageError : styles.messageSuccess)
              }}>
                {msg.text}
              </div>
            )}
          </form>
        </div>

        {/* Preferences Section */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Email Preferences</div>
          <div style={{marginBottom: '20px', color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>
            Manage how you receive promotional content and updates from us
          </div>
          
          <div 
            style={styles.toggleContainer}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'}
          >
            <div style={styles.toggleLeft}>
              <div style={styles.toggleTitle}>📧 Promotional Emails</div>
              <div style={styles.toggleDescription}>
                Receive updates about exclusive discounts, new movie releases, and special offers
              </div>
              <div style={{
                ...styles.statusBadge,
                ...(form.promo_subscription === 'Active' ? styles.statusActive : styles.statusInactive)
              }}>
                {form.promo_subscription === 'Active' ? '✓ Subscribed' : '✗ Unsubscribed'}
              </div>
            </div>
            
            <div 
              onClick={() => onChange('promo_subscription', form.promo_subscription === 'Active' ? 'Inactive' : 'Active')}
              style={{
                ...styles.toggleSwitch,
                ...(form.promo_subscription === 'Active' ? styles.toggleSwitchActive : {})
              }}
            >
              <div style={{
                ...styles.toggleCircle,
                ...(form.promo_subscription === 'Active' ? styles.toggleCircleActive : {})
              }}></div>
            </div>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(229, 9, 20, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(229, 9, 20, 0.2)',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.7)',
            lineHeight: '1.6'
          }}>
            <strong style={{color: '#E50914'}}>💡 Note:</strong> You can change this preference at any time. 
            Your subscription status will be updated immediately after clicking "Save Changes" above.
          </div>
        </div>

        {/* Payment Information Section */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>💳 Payment Information</div>
          <div style={{marginBottom: '24px', color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>
            Manage your saved payment details for faster checkout
          </div>

          <form onSubmit={onSavePayment}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Cardholder Name</label>
              <input
                type="text"
                value={paymentForm.saved_card_name}
                onChange={(e) => setPaymentForm({...paymentForm, saved_card_name: e.target.value})}
                placeholder="John Doe"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Card Number</label>
              <input
                type="text"
                value={paymentForm.saved_card_number}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Expiry Date</label>
              <input
                type="text"
                value={paymentForm.saved_card_expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                style={{...styles.input, maxWidth: '150px'}}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
              <div style={styles.helperText}>CVV is never saved for security</div>
            </div>

            <hr style={styles.divider} />

            <div style={styles.formGroup}>
              <label style={styles.label}>Billing Address</label>
              <input
                type="text"
                value={paymentForm.saved_billing_address}
                onChange={(e) => setPaymentForm({...paymentForm, saved_billing_address: e.target.value})}
                placeholder="123 Main Street"
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = '#E50914'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              />
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px'}}>
              <div style={styles.formGroup}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  value={paymentForm.saved_billing_city}
                  onChange={(e) => setPaymentForm({...paymentForm, saved_billing_city: e.target.value})}
                  placeholder="Athens"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#E50914'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>State</label>
                <input
                  type="text"
                  value={paymentForm.saved_billing_state}
                  onChange={(e) => setPaymentForm({...paymentForm, saved_billing_state: e.target.value})}
                  placeholder="GA"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#E50914'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>ZIP</label>
                <input
                  type="text"
                  value={paymentForm.saved_billing_zip}
                  onChange={handleZipChange}
                  placeholder="30602"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#E50914'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={savingPayment}
                style={styles.saveButton}
                onMouseEnter={(e) => {
                  if (!savingPayment) {
                    e.target.style.backgroundColor = '#c40812';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(229, 9, 20, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#E50914';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {savingPayment ? 'Saving...' : 'Save Payment Info'}
              </button>
              <button
                type="button"
                onClick={onCancelPayment}
                disabled={savingPayment}
                style={styles.cancelButton}
                onMouseEnter={(e) => {
                  if (!savingPayment) e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                Cancel
              </button>
              {(paymentForm.saved_card_number || user?.saved_card_number) && (
                <button
                  type="button"
                  onClick={onClearPayment}
                  disabled={savingPayment}
                  style={{...styles.cancelButton, color: '#E50914', borderColor: 'rgba(229, 9, 20, 0.3)'}}
                  onMouseEnter={(e) => {
                    if (!savingPayment) e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {paymentMsg && (
              <div style={{
                ...styles.message,
                ...(paymentMsg.type === 'error' ? styles.messageError : styles.messageSuccess)
              }}>
                {paymentMsg.text}
              </div>
            )}
          </form>
        </div>

        {/* Logout Section */}
        <div style={styles.card}>
          <div style={styles.sectionTitle}>Account Actions</div>
          <div style={{marginBottom: '16px', color: 'rgba(255,255,255,0.6)', fontSize: '14px'}}>
            Sign out of your account securely
          </div>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.25)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.15)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🚪 Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
