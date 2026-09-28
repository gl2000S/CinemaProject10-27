import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageMovies(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    title:'', category:'Currently Running', director:'', trailer_url:'', synopsis:'', rating:'', release_date:'', duration_mins:'',
    price_adult: '12.00', price_child: '8.00', price_senior: '9.00'
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    fetch('/api/movies')
      .then(r=>r.json())
      .then(setList)
      .catch(()=>setList([]));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/movies/${editingId}` : '/api/movies';
    
    fetch(url, {
      method: method,
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        title: form.title,
        category: form.category,
        director: form.director || null,
        trailer_url: form.trailer_url,
        synopsis: form.synopsis,
        rating: form.rating,
        release_date: form.release_date || null,
        duration_mins: form.duration_mins ? Number(form.duration_mins) : null,
        price_adult: form.price_adult ? parseFloat(form.price_adult) : 12.00,
        price_child: form.price_child ? parseFloat(form.price_child) : 8.00,
        price_senior: form.price_senior ? parseFloat(form.price_senior) : 9.00
      })
    })
    .then(r=>{
      if(!r.ok) throw new Error('failed');
      return r.json();
    })
    .then(async (movie)=>{
      if (!editingId) {
        // Only create showtime for new movies
        try {
          const dt = new Date(Date.now() + 2*60*60*1000);
          const start = dt.toISOString().slice(0,19).replace('T',' ');
          await fetch('/api/showtimes', {
            method: 'POST',
            headers: { 'Content-Type':'application/json' },
            body: JSON.stringify({
              movie_id: movie.movieId,
              auditorium: 'Main Theater',
              start_time: start,
              base_price: 12.00
            })
          });
        } catch (_) {
          // ignore for demo
        }
      }

      setForm({title:'', category:'Currently Running', director:'', trailer_url:'', synopsis:'', rating:'', release_date:'', duration_mins:'', price_adult: '12.00', price_child: '8.00', price_senior: '9.00'});
      setEditingId(null);
      load();
      alert(editingId ? 'Movie updated successfully!' : 'Movie added successfully!');
    })
    .catch(()=>alert('Error saving movie (check server).'));
  };

  const handleEdit = (movie) => {
    setForm({
      title: movie.title,
      category: movie.category,
      director: movie.director || '',
      trailer_url: movie.trailerUrl || '',
      synopsis: movie.synopsis || '',
      rating: movie.rating || '',
      release_date: movie.releaseDate || '',
      duration_mins: movie.durationMins || '',
      price_adult: movie.priceAdult || '12.00',
      price_child: movie.priceChild || '8.00',
      price_senior: movie.priceSenior || '9.00'
    });
    setEditingId(movie.movieId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (movieId) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return;
    
    fetch(`/api/movies/${movieId}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => {
        load();
        alert('Movie deleted successfully!');
      })
      .catch(() => alert('Error deleting movie.'));
  };

  const handleCancelEdit = () => {
    setForm({title:'', category:'Currently Running', director:'', trailer_url:'', synopsis:'', rating:'', release_date:'', duration_mins:''});
    setEditingId(null);
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
      maxWidth: '700px',
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
    select: {
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
      cursor: 'pointer',
    },
    textarea: {
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
      minHeight: '100px',
      resize: 'vertical',
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
      maxWidth: '900px',
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
      padding: '16px 20px',
      marginBottom: '12px',
      color: '#ffffff',
      fontSize: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    movieInfo: {
      flex: 1,
    },
    actionButtons: {
      display: 'flex',
      gap: '8px',
    },
    editButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#ffffff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    deleteButton: {
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#ffffff',
      backgroundColor: 'rgba(229, 9, 20, 0.3)',
      border: '1px solid rgba(229, 9, 20, 0.5)',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
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
    },
    formButtons: {
      display: 'grid',
      gridTemplateColumns: editingId ? '1fr 1fr' : '1fr',
      gap: '12px',
      marginTop: '12px',
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
        <h2 style={styles.title}>Manage Movies</h2>
      </div>

      <div style={styles.formCard}>
        <form onSubmit={submit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Movie Title *</label>
            <input 
              required 
              placeholder="Enter movie title" 
              value={form.title} 
              onChange={e=>setForm({...form, title:e.target.value})}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Director</label>
            <input 
              placeholder="Enter director name" 
              value={form.director} 
              onChange={e=>setForm({...form, director:e.target.value})}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Category *</label>
            <select 
              value={form.category} 
              onChange={e=>setForm({...form, category:e.target.value})}
              style={styles.select}
            >
              <option>Currently Running</option>
              <option>Coming Soon</option>
            </select>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Rating</label>
              <input 
                placeholder="e.g., PG-13" 
                value={form.rating} 
                onChange={e=>setForm({...form, rating:e.target.value})}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Duration (mins)</label>
              <input 
                type="number"
                placeholder="e.g., 120" 
                value={form.duration_mins} 
                onChange={e=>setForm({...form, duration_mins:e.target.value})}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                style={styles.input}
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div style={{marginBottom: '24px'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#ffffff', letterSpacing: '1px'}}>Ticket Pricing</h3>
            <div style={styles.inputGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Adult Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  placeholder="12.00" 
                  style={styles.input}
                  value={form.price_adult} 
                  onChange={e=>setForm({...form, price_adult:e.target.value})}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Child Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  placeholder="8.00" 
                  style={styles.input}
                  value={form.price_child} 
                  onChange={e=>setForm({...form, price_child:e.target.value})}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Senior Price ($)</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  placeholder="9.00" 
                  style={styles.input}
                  value={form.price_senior} 
                  onChange={e=>setForm({...form, price_senior:e.target.value})}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  required
                />
              </div>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Release Date</label>
            <input 
              type="date"
              value={form.release_date} 
              onChange={e=>setForm({...form, release_date:e.target.value})}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Trailer URL (YouTube Embed) *</label>
            <input 
              required 
              placeholder="https://www.youtube.com/embed/..." 
              value={form.trailer_url} 
              onChange={e=>setForm({...form, trailer_url:e.target.value})}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Synopsis</label>
            <textarea 
              placeholder="Enter movie description..." 
              value={form.synopsis} 
              onChange={e=>setForm({...form, synopsis:e.target.value})}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formButtons}>
            <button 
              type="submit"
              style={styles.button}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              {editingId ? 'Update Movie' : 'Add Movie'}
            </button>
            {editingId && (
              <button 
                type="button"
                style={styles.cancelButton}
                onClick={handleCancelEdit}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={styles.listSection}>
        <h3 style={styles.sectionTitle}>Existing Movies</h3>
        <ul style={styles.list}>
          {Array.isArray(list) && list.length > 0 ? (
            list.map(m => (
              <li key={m.movieId} style={styles.listItem}>
                <div style={styles.movieInfo}>
                  <strong>{m.title}</strong> {m.director && `by ${m.director}`} — {m.category}
                </div>
                <div style={styles.actionButtons}>
                  <button 
                    style={styles.editButton}
                    onClick={() => handleEdit(m)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    style={styles.deleteButton}
                    onClick={() => handleDelete(m.movieId)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.5)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.3)'}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <li style={styles.listItem}>
              <div style={styles.movieInfo}>No movies yet</div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
