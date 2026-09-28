import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagePromotions(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({code:'', description:'', percent:'', amount:'', starts_on:'', ends_on:'', is_active:true});
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    fetch('/api/promotions')
      .then(r=>r.json())
      .then(setList)
      .catch(()=>setList([]));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setMsg(null);
    
    const payload = {
      code: form.code,
      description: form.description || null,
      percent: form.percent ? Number(form.percent) : null,
      amount: form.amount ? Number(form.amount) : null,
      starts_on: form.starts_on || null,
      ends_on: form.ends_on || null,
      is_active: !!form.is_active
    };

    if (editing) {
      // Update existing promotion
      fetch(`/api/promotions/${editing}`, { 
        method:'PUT', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify(payload) 
      })
        .then(r=>{ if(!r.ok) throw new Error('failed'); return r.json(); })
        .then(()=>{ 
          setForm({code:'', description:'', percent:'', amount:'', starts_on:'', ends_on:'', is_active:true}); 
          setEditing(null);
          load(); 
          setMsg({ type: 'success', text: 'Promotion updated successfully!' });
        })
        .catch(()=>setMsg({ type: 'error', text: 'Error updating promotion.' }));
    } else {
      // Create new promotion
      fetch('/api/promotions', { 
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body: JSON.stringify(payload) 
      })
        .then(r=>{ if(!r.ok) throw new Error('failed'); return r.json(); })
        .then(()=>{ 
          setForm({code:'', description:'', percent:'', amount:'', starts_on:'', ends_on:'', is_active:true}); 
          load(); 
          setMsg({ type: 'success', text: 'Promotion added successfully!' });
        })
        .catch(()=>setMsg({ type: 'error', text: 'Error adding promotion.' }));
    }
  };

  const editPromotion = (promo) => {
    setForm({
      code: promo.code,
      description: promo.description || '',
      percent: promo.percent || '',
      amount: promo.amount || '',
      starts_on: promo.starts_on ? promo.starts_on.split('T')[0] : '',
      ends_on: promo.ends_on ? promo.ends_on.split('T')[0] : '',
      is_active: promo.is_active === 1 || promo.is_active === true
    });
    setEditing(promo.promo_id);
    setMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setForm({code:'', description:'', percent:'', amount:'', starts_on:'', ends_on:'', is_active:true});
    setEditing(null);
    setMsg(null);
  };

  const deletePromotion = (id, code) => {
    if (!window.confirm(`Are you sure you want to delete the promotion "${code}"?`)) {
      return;
    }

    fetch(`/api/promotions/${id}`, { method: 'DELETE' })
      .then(r => {
        if (!r.ok) throw new Error('failed');
        return r.json();
      })
      .then(() => {
        load();
        if (editing === id) {
          cancelEdit();
        }
        setMsg({ type: 'success', text: 'Promotion deleted successfully!' });
      })
      .catch(() => setMsg({ type: 'error', text: 'Error deleting promotion.' }));
  };

  const toggleActive = (promo) => {
    const payload = {
      code: promo.code,
      description: promo.description || null,
      percent: promo.percent || null,
      amount: promo.amount || null,
      starts_on: promo.starts_on || null,
      ends_on: promo.ends_on || null,
      is_active: !(promo.is_active === 1 || promo.is_active === true)
    };

    fetch(`/api/promotions/${promo.promo_id}`, { 
      method:'PUT', 
      headers:{'Content-Type':'application/json'}, 
      body: JSON.stringify(payload) 
    })
      .then(r=>{ if(!r.ok) throw new Error('failed'); return r.json(); })
      .then(()=>{ 
        load(); 
        setMsg({ 
          type: 'success', 
          text: `Promotion ${payload.is_active ? 'activated' : 'deactivated'} successfully!` 
        });
      })
      .catch(()=>setMsg({ type: 'error', text: 'Error updating promotion status.' }));
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      padding: '60px',
      fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: '#ffffff',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginBottom: '48px',
    },
    backButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      padding: '10px 20px',
      color: '#ffffff',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.3s ease',
    },
    title: {
      fontSize: '36px',
      fontWeight: '300',
      margin: '0',
      color: '#ffffff',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      fontFamily: "'Metropolis', 'Inter', sans-serif",
    },
    formCard: {
      backgroundColor: 'rgba(26, 26, 26, 0.95)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '32px',
      maxWidth: '600px',
      marginBottom: '40px',
    },
    form: {
      display: 'grid',
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
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '8px 0',
    },
    checkbox: {
      width: '20px',
      height: '20px',
      cursor: 'pointer',
    },
    button: {
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
    listSection: {
      maxWidth: '800px',
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '500',
      marginBottom: '20px',
      color: '#ffffff',
      letterSpacing: '1px',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    listItem: {
      backgroundColor: 'rgba(26, 26, 26, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      padding: '20px',
      marginBottom: '12px',
      color: '#ffffff',
      fontSize: '15px',
      transition: 'all 0.3s ease',
    },
    promoHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px',
    },
    promoInfo: {
      flex: 1,
    },
    promoCode: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#E50914',
      marginBottom: '4px',
    },
    promoDescription: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: '12px',
    },
    promoDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '12px',
      marginBottom: '16px',
      padding: '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '4px',
    },
    detailItem: {
      fontSize: '13px',
    },
    detailLabel: {
      color: 'rgba(255, 255, 255, 0.5)',
      marginBottom: '4px',
    },
    detailValue: {
      color: '#ffffff',
      fontWeight: '500',
    },
    statusBadge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    activeBadge: {
      backgroundColor: 'rgba(46, 213, 115, 0.2)',
      color: '#2ed573',
    },
    inactiveBadge: {
      backgroundColor: 'rgba(255, 71, 87, 0.2)',
      color: '#ff4757',
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
    },
    editButton: {
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    toggleButton: {
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '600',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    deleteButton: {
      padding: '8px 16px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#E50914',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    cancelButton: {
      padding: '14px 24px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginTop: '12px',
      marginRight: '12px',
    },
    messageBox: {
      padding: '16px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontWeight: '500',
      fontSize: '15px',
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

  const handleBackHover = (e, isHover) => {
    if (isHover) {
      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    } else {
      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/admin')}
          onMouseEnter={(e) => handleBackHover(e, true)}
          onMouseLeave={(e) => handleBackHover(e, false)}
        >
          ← Back
        </button>
        <h2 style={styles.title}>Manage Promotions</h2>
      </div>

      {msg && (
        <div style={{
          ...styles.messageBox,
          backgroundColor: msg.type === 'success' ? 'rgba(46, 213, 115, 0.2)' : 'rgba(255, 71, 87, 0.2)',
          color: msg.type === 'success' ? '#2ed573' : '#ff4757',
          border: `1px solid ${msg.type === 'success' ? '#2ed573' : '#ff4757'}`,
        }}>
          {msg.text}
        </div>
      )}

      <div style={styles.formCard}>
        <h3 style={{...styles.sectionTitle, marginBottom: '24px'}}>
          {editing ? `Edit Promotion: ${form.code}` : 'Add New Promotion'}
        </h3>
        
        <form onSubmit={submit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Promo Code *</label>
            <input 
              required 
              placeholder="e.g., SUMMER20" 
              value={form.code} 
              onChange={e=>setForm({...form, code:e.target.value})}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.input}
              disabled={editing}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <input 
              placeholder="e.g., 20% off summer promo" 
              value={form.description} 
              onChange={e=>setForm({...form, description:e.target.value})}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.input}
            />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Percent Off (%)</label>
              <input 
                type="number"
                placeholder="e.g., 20" 
                value={form.percent} 
                onChange={e=>setForm({...form, percent:e.target.value})}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount Off ($)</label>
              <input 
                type="number"
                step="0.01"
                placeholder="e.g., 5.00" 
                value={form.amount} 
                onChange={e=>setForm({...form, amount:e.target.value})}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={styles.input}
              />
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Start Date</label>
              <input 
                type="date"
                value={form.starts_on} 
                onChange={e=>setForm({...form, starts_on:e.target.value})}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>End Date</label>
              <input 
                type="date"
                value={form.ends_on} 
                onChange={e=>setForm({...form, ends_on:e.target.value})}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.checkboxContainer}>
            <input 
              type="checkbox" 
              id="is_active"
              checked={form.is_active} 
              onChange={e=>setForm({...form, is_active:e.target.checked})}
              style={styles.checkbox}
            />
            <label htmlFor="is_active" style={{...styles.label, cursor: 'pointer'}}>Active Promotion</label>
          </div>

          <div style={{display: 'flex', gap: '12px'}}>
            <button 
              type="submit"
              style={{...styles.button, width: editing ? 'auto' : '100%', flex: editing ? '1' : 'initial'}}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              {editing ? 'Update Promotion' : 'Add Promotion'}
            </button>
            {editing && (
              <button 
                type="button"
                onClick={cancelEdit}
                style={{...styles.cancelButton, marginTop: 0, marginRight: 0, flex: '1'}}
                onMouseEnter={(e) => handleBackHover(e, true)}
                onMouseLeave={(e) => handleBackHover(e, false)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.listSection}>
        <h3 style={styles.sectionTitle}>Existing Promotions</h3>
        <ul style={styles.list}>
          {Array.isArray(list) && list.length > 0 ? (
            list.map(p => (
              <li key={p.promo_id} style={styles.listItem}>
                <div style={styles.promoHeader}>
                  <div style={styles.promoInfo}>
                    <div style={styles.promoCode}>{p.code}</div>
                    <div style={styles.promoDescription}>{p.description || 'No description'}</div>
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    ...(p.is_active ? styles.activeBadge : styles.inactiveBadge)
                  }}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div style={styles.promoDetails}>
                  {p.percent && (
                    <div style={styles.detailItem}>
                      <div style={styles.detailLabel}>Discount</div>
                      <div style={styles.detailValue}>{p.percent}% off</div>
                    </div>
                  )}
                  {p.amount && (
                    <div style={styles.detailItem}>
                      <div style={styles.detailLabel}>Discount</div>
                      <div style={styles.detailValue}>${parseFloat(p.amount).toFixed(2)} off</div>
                    </div>
                  )}
                  {p.starts_on && (
                    <div style={styles.detailItem}>
                      <div style={styles.detailLabel}>Start Date</div>
                      <div style={styles.detailValue}>{new Date(p.starts_on).toLocaleDateString()}</div>
                    </div>
                  )}
                  {p.ends_on && (
                    <div style={styles.detailItem}>
                      <div style={styles.detailLabel}>End Date</div>
                      <div style={styles.detailValue}>{new Date(p.ends_on).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>

                <div style={styles.actionButtons}>
                  <button 
                    onClick={() => editPromotion(p)}
                    style={styles.editButton}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Edit
                  </button>
                  
                  <button 
                    onClick={() => toggleActive(p)}
                    style={{
                      ...styles.toggleButton,
                      color: p.is_active ? '#ff4757' : '#2ed573',
                      backgroundColor: p.is_active ? 'rgba(255, 71, 87, 0.1)' : 'rgba(46, 213, 115, 0.1)',
                      borderColor: p.is_active ? 'rgba(255, 71, 87, 0.3)' : 'rgba(46, 213, 115, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.opacity = '0.8';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {p.is_active ? 'Deactivate' : 'Activate'}
                  </button>

                  <button 
                    onClick={() => deletePromotion(p.promo_id, p.code)}
                    style={styles.deleteButton}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#c20710';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(229, 9, 20, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#E50914';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li style={styles.listItem}>No promotions yet</li>
          )}
        </ul>
      </div>
    </div>
  );
}
