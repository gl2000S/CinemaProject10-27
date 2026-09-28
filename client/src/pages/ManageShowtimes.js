import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageShowtimes() {
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [form, setForm] = useState({
    movie_id: '',
    start_time: ''
  });
  const navigate = useNavigate();

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

  const loadMovies = () => {
    fetch('/api/movies')
      .then(r => r.json())
      .then(data => setMovies(Array.isArray(data) ? data : []))
      .catch(() => setMovies([]));
  };

  const loadShowtimes = () => {
    fetch('/api/showtimes')
      .then(r => r.json())
      .then(data => setShowtimes(Array.isArray(data) ? data : []))
      .catch(() => setShowtimes([]));
  };

  useEffect(() => {
    loadMovies();
    loadShowtimes();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (!form.movie_id || !form.start_time) {
      alert('Please select a movie and enter a start time.');
      return;
    }

    fetch('/api/showtimes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        movie_id: parseInt(form.movie_id),
        auditorium: 'Main Theater', // Single screen
        start_time: form.start_time,
        base_price: 12.00 // Default price, will use movie-specific pricing
      })
    })
      .then(r => {
        if (!r.ok) throw new Error('Failed to add showtime');
        return r.json();
      })
      .then(() => {
        setForm({ movie_id: '', start_time: '' });
        loadShowtimes();
        alert('Showtime added successfully!');
      })
      .catch(() => alert('Error adding showtime.'));
  };

  const handleDelete = (showtimeId) => {
    if (!window.confirm('Are you sure you want to delete this showtime?')) return;

    fetch(`/api/showtimes/${showtimeId}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => {
        loadShowtimes();
        alert('Showtime deleted successfully!');
      })
      .catch(() => alert('Error deleting showtime.'));
  };

  const getMovieTitle = (movieId) => {
    const movie = movies.find(m => m.movieId === movieId);
    return movie ? movie.title : `Movie #${movieId}`;
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
      maxWidth: '1400px',
      margin: '0 auto',
    },
    backButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '32px',
      letterSpacing: '1px',
    },
    formCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '40px',
    },
    formTitle: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '24px',
      color: '#ffffff',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '24px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.8)',
      fontWeight: '500',
      letterSpacing: '0.5px',
    },
    input: {
      padding: '14px 16px',
      fontSize: '15px',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '6px',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
    },
    select: {
      padding: '14px 16px',
      fontSize: '15px',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '6px',
      color: '#ffffff',
      outline: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
    },
    submitButton: {
      padding: '16px 32px',
      backgroundColor: '#E50914',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    listCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    listTitle: {
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
    deleteButton: {
      padding: '8px 16px',
      backgroundColor: 'rgba(229, 9, 20, 0.2)',
      color: '#E50914',
      border: '1px solid #E50914',
      borderRadius: '6px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: 'rgba(255,255,255,0.5)',
      fontSize: '15px',
    },
  };

  // Get current datetime for min attribute (format: YYYY-MM-DDTHH:MM)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Manage Showtimes</h1>
        <p style={styles.subtitle}>Add and remove movie showtimes</p>
      </div>

      <div style={styles.content}>
        <button
          style={styles.backButton}
          onClick={() => navigate('/admin')}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.target.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          ← Back to Admin Panel
        </button>

        {/* Add Showtime Form */}
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Add New Showtime</h2>
          <form onSubmit={submit}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Movie *</label>
                <select
                  required
                  value={form.movie_id}
                  onChange={e => setForm({ ...form, movie_id: e.target.value })}
                  style={styles.select}
                >
                  <option value="">Select a movie...</option>
                  {movies.map(m => (
                    <option key={m.movieId} value={m.movieId}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Start Time *</label>
                <input
                  required
                  type="datetime-local"
                  value={form.start_time}
                  onChange={e => setForm({ ...form, start_time: e.target.value })}
                  min={getMinDateTime()}
                  style={styles.input}
                />
              </div>
            </div>

            <button
              type="submit"
              style={styles.submitButton}
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
              Add Showtime
            </button>
          </form>
        </div>

        {/* Showtimes List */}
        <div style={styles.listCard}>
          <h2 style={styles.listTitle}>All Showtimes</h2>
          {showtimes.length === 0 ? (
            <div style={styles.emptyState}>
              No showtimes scheduled yet. Add one above!
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Movie</th>
                  <th style={styles.th}>Date & Time</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {showtimes.map(st => (
                  <tr key={st.showtime_id}>
                    <td style={styles.td}>{getMovieTitle(st.movie_id)}</td>
                    <td style={styles.td}>
                      {new Date(st.start_time).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={styles.td}>${parseFloat(st.base_price).toFixed(2)}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDelete(st.showtime_id)}
                        style={styles.deleteButton}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#E50914';
                          e.target.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.2)';
                          e.target.style.color = '#E50914';
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
