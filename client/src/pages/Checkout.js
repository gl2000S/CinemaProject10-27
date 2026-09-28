import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Checkout() {
  const { state } = useLocation();
  const nav = useNavigate();
  const baseTotal = state?.total ?? 0;
  const tickets = state?.tickets ?? [];
  const movie = state?.movie ?? {};

  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    savePaymentInfo: false
  });

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Load user and saved payment info
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        // Load saved payment info if available
        if (userData.saved_card_number) {
          setForm(prev => ({
            ...prev,
            cardName: userData.saved_card_name || '',
            cardNumber: userData.saved_card_number || '',
            expiry: userData.saved_card_expiry || '',
            address: userData.saved_billing_address || '',
            city: userData.saved_billing_city || '',
            state: userData.saved_billing_state || '',
            zip: userData.saved_billing_zip || '',
            savePaymentInfo: true // Auto-check if they have saved info
          }));
        }
      } catch (err) {
        console.error('Failed to load user data:', err);
      }
    }
  }, []);

  // Calculate totals with promo
  const calculateTotals = () => {
    const subtotal = tickets.reduce((sum, ticket) => sum + parseFloat(ticket.price), 0);
    let discount = 0;
    
    if (appliedPromo) {
      if (appliedPromo.percent) {
        discount = subtotal * (appliedPromo.percent / 100);
      } else if (appliedPromo.amount) {
        discount = Math.min(appliedPromo.amount, subtotal);
      }
    }
    
    const discountedSubtotal = subtotal - discount;
    const fees = 2.00;
    const tax = discountedSubtotal * 0.07;
    const total = discountedSubtotal + fees + tax;
    
    return {
      subtotal,
      discount,
      discountedSubtotal,
      fees,
      tax,
      total
    };
  };

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

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    
    setPromoError('');
    
    try {
      console.log('Validating promo code:', promoCode.trim());
      const response = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim() })
      });
      
      const data = await response.json();
      console.log('Promo validation response:', data);
      
      if (response.ok && data.valid) {
        setAppliedPromo(data);
        setPromoError('');
        setPromoCode('');
      } else {
        setPromoError(data.error || 'Invalid promotion code');
        setAppliedPromo(null);
      }
    } catch (err) {
      console.error('Promo validation error:', err);
      setPromoError('Failed to validate promotion code');
      setAppliedPromo(null);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19); // Max 16 digits + 3 spaces
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
    setForm({...form, cardNumber: formatted});
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setForm({...form, expiry: formatted});
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 4);
    setForm({...form, cvv: value});
  };

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 5);
    setForm({...form, zip: value});
  };

  const validateForm = () => {
    const cardNumberClean = form.cardNumber.replace(/\s/g, '');
    if (!form.cardName.trim()) return "Please enter the name on card";
    if (cardNumberClean.length < 13 || cardNumberClean.length > 16) return "Please enter a valid card number (13-16 digits)";
    if (form.expiry.length !== 5) return "Please enter expiry date (MM/YY)";
    if (form.cvv.length < 3) return "Please enter a valid CVV (3-4 digits)";
    if (!form.address.trim()) return "Please enter billing address";
    if (!form.city.trim()) return "Please enter city";
    if (!form.state.trim()) return "Please enter state";
    if (form.zip.length !== 5) return "Please enter a valid 5-digit ZIP code";
    return null;
  };

  const onConfirm = async (e) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    // Save payment info if checkbox is checked
    if (form.savePaymentInfo) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          console.log('Saving payment info for user:', userData.user_id);
          console.log('Payment data:', {
            saved_card_name: form.cardName,
            saved_card_number: form.cardNumber,
            saved_card_expiry: form.expiry,
            saved_billing_address: form.address,
            saved_billing_city: form.city,
            saved_billing_state: form.state,
            saved_billing_zip: form.zip
          });
          
          const response = await fetch(`/api/users/${userData.user_id}/payment`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              saved_card_name: form.cardName,
              saved_card_number: form.cardNumber,
              saved_card_expiry: form.expiry,
              saved_billing_address: form.address,
              saved_billing_city: form.city,
              saved_billing_state: form.state,
              saved_billing_zip: form.zip
            })
          });
          
          console.log('Payment save response status:', response.status);
          
          if (response.ok) {
            const updatedUser = await response.json();
            console.log('Payment saved successfully:', updatedUser);
            // Update localStorage with saved payment info
            localStorage.setItem('user', JSON.stringify(updatedUser));
          } else {
            const errorData = await response.json();
            console.error('Payment save failed:', errorData);
          }
        } catch (err) {
          console.error('Failed to save payment info:', err);
        }
      }
    }

    const totals = calculateTotals();
    const booking = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    nav("/order-confirmation", {
      state: {
        orderNo: booking,
        total: totals.total,
        tickets,
        movie,
      },
    });
  };

  const onCancel = () => {
    nav("/order-summary", { state });
  };

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
      maxWidth: '1000px',
      margin: '0 auto',
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 400px',
      gap: '32px',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
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
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '24px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 0',
      fontSize: '15px',
      color: 'rgba(255,255,255,0.8)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '20px 0',
      fontSize: '28px',
      fontWeight: '700',
      color: '#ffffff',
      marginTop: '16px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '16px',
      marginTop: '32px',
    },
    confirmButton: {
      flex: 2,
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
    cancelButton: {
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
    checkboxContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginTop: '24px',
      marginBottom: '8px',
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
      flex: 1,
    },
    checkboxHighlight: {
      color: '#E50914',
      fontWeight: '600',
      fontSize: '15px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>Checkout</div>
        <div style={styles.subtitle}>Complete your payment to confirm booking</div>
      </div>

      <div style={styles.content}>
        <div style={styles.mainGrid}>
          {/* Payment Form */}
          <div style={styles.card}>
            <div style={styles.sectionTitle}>💳 Payment Information</div>
            <form onSubmit={onConfirm}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name on Card *</label>
                <input
                  required
                  type="text"
                  value={form.cardName}
                  onChange={(e) => setForm({...form, cardName: e.target.value})}
                  placeholder="John Doe"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#E50914'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Card Number *</label>
                <input
                  required
                  type="text"
                  value={form.cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#E50914'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Expiry Date *</label>
                  <input
                    required
                    type="text"
                    value={form.expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = '#E50914'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>CVV *</label>
                  <input
                    required
                    type="text"
                    value={form.cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = '#E50914'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                  />
                </div>
              </div>

              <div style={{...styles.sectionTitle, marginTop: '40px'}}>📍 Billing Address</div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Street Address *</label>
                <input
                  required
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})}
                  placeholder="123 Main Street"
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#E50914'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>City *</label>
                  <input
                    required
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({...form, city: e.target.value})}
                    placeholder="Athens"
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = '#E50914'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>State *</label>
                  <input
                    required
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({...form, state: e.target.value.toUpperCase().substring(0, 2)})}
                    placeholder="GA"
                    style={styles.input}
                    maxLength="2"
                    onFocus={(e) => e.target.style.borderColor = '#E50914'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>ZIP Code *</label>
                <input
                  required
                  type="text"
                  value={form.zip}
                  onChange={handleZipChange}
                  placeholder="30602"
                  style={{...styles.input, maxWidth: '150px'}}
                  onFocus={(e) => e.target.style.borderColor = '#E50914'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                />
              </div>

              {/* Save Payment Info Checkbox */}
              <div style={styles.checkboxContainer}>
                <input 
                  type="checkbox"
                  id="savePaymentInfo"
                  checked={form.savePaymentInfo}
                  onChange={(e) => setForm({...form, savePaymentInfo: e.target.checked})}
                  style={styles.checkbox}
                />
                <label 
                  htmlFor="savePaymentInfo" 
                  style={styles.checkboxLabel}
                >
                  <span style={styles.checkboxHighlight}>💳 Save Payment Info</span>
                  <br />
                  <span style={{fontSize: '13px', color: 'rgba(255,255,255,0.6)'}}>
                    Securely save my payment information for faster checkout next time. Card details are encrypted for your protection.
                  </span>
                </label>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  style={styles.confirmButton}
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
                  Confirm & Pay ${calculateTotals().total.toFixed(2)}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  style={styles.cancelButton}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Order Summary</div>
              
              <div style={styles.summaryRow}>
                <span style={{fontWeight: '600'}}>Movie:</span>
                <span>{movie.title || 'N/A'}</span>
              </div>

              <div style={{marginTop: '20px', marginBottom: '20px'}}>
                <div style={{fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>
                  Tickets:
                </div>
                {tickets.map((ticket, i) => (
                  <div key={i} style={{...styles.summaryRow, borderBottom: 'none', padding: '8px 0', fontSize: '14px'}}>
                    <span>Seat {ticket.seat} - {ticket.ageCategory.charAt(0).toUpperCase() + ticket.ageCategory.slice(1)}</span>
                    <span>${parseFloat(ticket.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code Section */}
              <div style={{marginTop: '24px', marginBottom: '24px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <div style={{fontSize: '14px', fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>
                  Promo Code:
                </div>
                {!appliedPromo ? (
                  <form onSubmit={handlePromoSubmit} style={{display: 'flex', gap: '8px'}}>
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      style={{
                        flex: 1,
                        padding: '12px',
                        fontSize: '14px',
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        color: '#ffffff',
                        outline: 'none',
                        textTransform: 'uppercase'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#E50914'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '12px 20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.3)'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{fontSize: '14px', fontWeight: '600', color: '#22c55e'}}>
                        ✓ {appliedPromo.code}
                      </div>
                      <div style={{fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px'}}>
                        {appliedPromo.description}
                      </div>
                    </div>
                    <button
                      onClick={removePromo}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.6)',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '4px 8px'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#E50914'}
                      onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
                    >
                      ✕
                    </button>
                  </div>
                )}
                {promoError && (
                  <div style={{
                    marginTop: '8px',
                    fontSize: '13px',
                    color: '#E50914'
                  }}>
                    {promoError}
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div style={{borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px'}}>
                <div style={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>${calculateTotals().subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && calculateTotals().discount > 0 && (
                  <div style={{...styles.summaryRow, color: '#22c55e'}}>
                    <span>Discount ({appliedPromo.percent ? `${appliedPromo.percent}%` : `$${appliedPromo.amount}`}):</span>
                    <span>-${calculateTotals().discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={styles.summaryRow}>
                  <span>Booking Fees:</span>
                  <span>${calculateTotals().fees.toFixed(2)}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span>Tax (7%):</span>
                  <span>${calculateTotals().tax.toFixed(2)}</span>
                </div>
              </div>

              <div style={styles.totalRow}>
                <span>Total:</span>
                <span style={{color: '#E50914'}}>${calculateTotals().total.toFixed(2)}</span>
              </div>

              <div style={{marginTop: '24px', padding: '16px', backgroundColor: 'rgba(229, 9, 20, 0.1)', borderRadius: '8px', border: '1px solid rgba(229, 9, 20, 0.3)'}}>
                <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', textAlign: 'center'}}>
                  🔒 <strong style={{color: '#E50914'}}>Secure Payment</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
