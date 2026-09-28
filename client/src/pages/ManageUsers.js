import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, inactive
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Check if user is admin
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    try {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'admin') {
        navigate('/');
        return;
      }
    } catch (err) {
      navigate('/login');
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMsg({ type: 'error', text: 'Failed to load users.' });
    } finally {
      setLoading(false);
    }
  };

  const togglePromoStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    
    try {
      const user = users.find(u => u.user_id === userId);
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: user.first_name,
          last_name: user.last_name,
          promo_subscription: newStatus
        })
      });

      if (!response.ok) throw new Error('Failed to update user');
      
      setMsg({ type: 'success', text: `Promotional status updated to ${newStatus}` });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setMsg({ type: 'error', text: 'Failed to update user status.' });
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete user');
      
      setMsg({ type: 'success', text: 'User deleted successfully.' });
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setMsg({ type: 'error', text: 'Failed to delete user.' });
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setMsg(null);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      user.promo_subscription === (filterStatus === 'active' ? 'Active' : 'Inactive');
    
    return matchesSearch && matchesStatus;
  });

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      padding: '40px 20px',
      fontFamily: "'Metropolis', 'Inter', 'Roboto', -apple-system, sans-serif",
    },
    header: {
      maxWidth: '1200px',
      margin: '0 auto 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
    },
    title: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#ffffff',
      margin: 0,
    },
    backButton: {
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    controls: {
      maxWidth: '1200px',
      margin: '0 auto 30px',
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap',
    },
    searchBox: {
      flex: '1 1 300px',
      padding: '12px 16px',
      fontSize: '15px',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      color: '#ffffff',
      outline: 'none',
    },
    filterButtons: {
      display: 'flex',
      gap: '10px',
    },
    filterButton: {
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    content: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    messageBox: {
      padding: '16px 20px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontWeight: '500',
      fontSize: '15px',
    },
    userGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
    },
    userCard: {
      backgroundColor: '#1a1a1a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '24px',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    userCardHover: {
      borderColor: '#E50914',
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(229, 9, 20, 0.2)',
    },
    userName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#ffffff',
      marginBottom: '8px',
    },
    userEmail: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.6)',
      marginBottom: '16px',
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '16px',
    },
    infoRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '14px',
    },
    infoLabel: {
      color: 'rgba(255, 255, 255, 0.5)',
    },
    infoValue: {
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
    activeStatus: {
      backgroundColor: 'rgba(46, 213, 115, 0.2)',
      color: '#2ed573',
    },
    inactiveStatus: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    cardActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '16px',
    },
    viewButton: {
      flex: 1,
      padding: '10px',
      fontSize: '13px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#E50914',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    },
    modalContent: {
      backgroundColor: '#1a1a1a',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '40px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    modalTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#ffffff',
      margin: 0,
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: '28px',
      cursor: 'pointer',
      padding: 0,
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'color 0.3s ease',
    },
    detailSection: {
      marginBottom: '24px',
    },
    detailLabel: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px',
      fontWeight: '600',
    },
    detailValue: {
      fontSize: '16px',
      color: '#ffffff',
      marginBottom: '4px',
    },
    divider: {
      border: 'none',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      margin: '24px 0',
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '30px',
    },
    toggleButton: {
      flex: 1,
      padding: '14px',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    deleteButton: {
      flex: 1,
      padding: '14px',
      fontSize: '14px',
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
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '20px',
    },
    emptyText: {
      fontSize: '18px',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Users</h1>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/admin')}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          Back to Dashboard
        </button>
      </div>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchBox}
          onFocus={(e) => e.target.style.borderColor = '#E50914'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
        />
        <div style={styles.filterButtons}>
          {['all', 'active', 'inactive'].map(filter => (
            <button
              key={filter}
              style={{
                ...styles.filterButton,
                backgroundColor: filterStatus === filter ? '#E50914' : 'rgba(255, 255, 255, 0.08)',
                color: filterStatus === filter ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                borderColor: filterStatus === filter ? '#E50914' : 'rgba(255, 255, 255, 0.2)',
              }}
              onClick={() => setFilterStatus(filter)}
              onMouseEnter={(e) => {
                if (filterStatus !== filter) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== filter) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }
              }}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.content}>
        {msg && (
          <div style={{
            ...styles.messageBox,
            backgroundColor: msg.type === 'success' ? 'rgba(46, 213, 115, 0.1)' : 'rgba(229, 9, 20, 0.1)',
            color: msg.type === 'success' ? '#2ed573' : '#E50914',
            border: `1px solid ${msg.type === 'success' ? '#2ed573' : '#E50914'}`
          }}>
            {msg.text}
          </div>
        )}

        {loading ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>⏳</div>
            <div style={styles.emptyText}>Loading users...</div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>👥</div>
            <div style={styles.emptyText}>
              {searchTerm || filterStatus !== 'all' ? 'No users match your filters' : 'No users found'}
            </div>
          </div>
        ) : (
          <div style={styles.userGrid}>
            {filteredUsers.map(user => (
              <div
                key={user.user_id}
                style={styles.userCard}
                onClick={() => viewUserDetails(user)}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.userCardHover);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={styles.userName}>
                  {user.first_name} {user.last_name}
                </div>
                <div style={styles.userEmail}>{user.email}</div>
                
                <div style={styles.userInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Role:</span>
                    <span style={styles.infoValue}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 Customer'}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Promotional Status:</span>
                    <span 
                      style={{
                        ...styles.statusBadge,
                        ...(user.promo_subscription === 'Active' ? styles.activeStatus : styles.inactiveStatus)
                      }}
                    >
                      {user.promo_subscription || 'Inactive'}
                    </span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Phone:</span>
                    <span style={styles.infoValue}>{user.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div style={styles.modal} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>User Details</h2>
              <button 
                style={styles.closeButton}
                onClick={closeModal}
                onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}
              >
                ×
              </button>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailLabel}>Full Name</div>
              <div style={styles.detailValue}>
                {selectedUser.first_name} {selectedUser.last_name}
              </div>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailLabel}>Email Address</div>
              <div style={styles.detailValue}>{selectedUser.email}</div>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailLabel}>Phone Number</div>
              <div style={styles.detailValue}>{selectedUser.phone || 'Not provided'}</div>
            </div>

            <div style={styles.detailSection}>
              <div style={styles.detailLabel}>User Role</div>
              <div style={styles.detailValue}>
                {selectedUser.role === 'admin' ? '👑 Administrator' : '👤 Customer'}
              </div>
            </div>

            <hr style={styles.divider} />

            <div style={styles.detailSection}>
              <div style={styles.detailLabel}>Promotional Email Subscription</div>
              <div style={styles.detailValue}>
                <span 
                  style={{
                    ...styles.statusBadge,
                    ...(selectedUser.promo_subscription === 'Active' ? styles.activeStatus : styles.inactiveStatus)
                  }}
                >
                  {selectedUser.promo_subscription || 'Inactive'}
                </span>
              </div>
            </div>

            {selectedUser.created_at && (
              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Member Since</div>
                <div style={styles.detailValue}>
                  {new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}

            {selectedUser.saved_card_name && (
              <>
                <hr style={styles.divider} />
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>Saved Payment Information</div>
                  <div style={styles.detailValue}>
                    Card Holder: {selectedUser.saved_card_name}<br />
                    Card: •••• {selectedUser.saved_card_number?.slice(-4)}<br />
                    Expiry: {selectedUser.saved_card_expiry}
                  </div>
                </div>
              </>
            )}

            {selectedUser.role !== 'admin' && (
              <div style={styles.modalActions}>
                <button
                  style={{
                    ...styles.toggleButton,
                    backgroundColor: selectedUser.promo_subscription === 'Active' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(46, 213, 115, 0.2)',
                    color: selectedUser.promo_subscription === 'Active' 
                      ? 'rgba(255, 255, 255, 0.7)' 
                      : '#2ed573',
                  }}
                  onClick={() => {
                    togglePromoStatus(selectedUser.user_id, selectedUser.promo_subscription);
                    closeModal();
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = selectedUser.promo_subscription === 'Active' 
                      ? 'rgba(255, 255, 255, 0.12)' 
                      : 'rgba(46, 213, 115, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = selectedUser.promo_subscription === 'Active' 
                      ? 'rgba(255, 255, 255, 0.08)' 
                      : 'rgba(46, 213, 115, 0.2)';
                  }}
                >
                  {selectedUser.promo_subscription === 'Active' ? 'Disable' : 'Enable'} Promos
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => deleteUser(selectedUser.user_id)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b00710'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#E50914'}
                >
                  Delete User
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
