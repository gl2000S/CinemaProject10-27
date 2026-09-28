import React, { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard';

export default function HomePage(){
  // Add global style to remove any white edges
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.backgroundColor = '#0a0a0a';

    const syncLogin = () => setIsLoggedIn(!!localStorage.getItem('user'));
    syncLogin();

    window.addEventListener('storage', syncLogin);
    window.addEventListener('auth-change', syncLogin);

    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.backgroundColor = '';
      window.removeEventListener('storage', syncLogin);
      window.removeEventListener('auth-change', syncLogin);
    };
  }, []);
  const [movies, setMovies] = useState([]);
  const [q, setQ] = useState('');
  
  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      window.dispatchEvent(new Event('auth-change'));

    } finally {
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    const url = q ? `/api/movies?q=${encodeURIComponent(q)}` : '/api/movies';
    fetch(url)
      .then(r => { if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => setMovies(Array.isArray(data) ? data : []))
      .catch(err => { console.error('load movies failed', err); setMovies([]); });
  }, [q]);
  
  const byCat = (cat) => (Array.isArray(movies) ? movies : []).filter(m => m.category === cat);
  
  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0a0a0a',
      color: '#ffffff',
      fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: 0,
      margin: 0,
      boxSizing: 'border-box',
    },
    header: {
      padding: '40px 60px 20px 60px',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(10,10,10,0.8) 100%)',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '40px',
    },
    title: {
      fontSize: '52px',
      fontWeight: '200',
      margin: '0',
      color: '#ffffff',
      letterSpacing: '8px',
      textTransform: 'uppercase',
      fontFamily: "'Metropolis', 'Inter', sans-serif",
    },
    rightHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    searchContainer: {
      position: 'relative',
      width: '500px',
    },
    searchInput: {
      width: '100%',
      padding: '14px 20px 14px 48px',
      fontSize: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '18px',
    },
     headerButton: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.25)',
      color: '#fff',
      padding: '10px 14px',
      borderRadius: '6px',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    headerBar: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: '#000',
      padding: '10px 40px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      gap: '12px',
    },
    accountButton: {
      backgroundColor: '#fff',
      color: '#000',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      fontWeight: 600,
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.3s ease',
    },
    logoutButton: {
      backgroundColor: '#e50914',
      border: 'none',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '6px',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    section: {
      padding: '0 60px 40px 60px',
    },
    sectionTitle: {
      fontSize: '36px',
      fontWeight: '300',
      marginBottom: '32px',
      color: '#ffffff',
      letterSpacing: '4px',
      textTransform: 'uppercase',
      fontFamily: "'Metropolis', 'Inter', sans-serif",
      textAlign: 'center',
    },
    movieGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '20px',
    },
    noMovies: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '16px',
      fontStyle: 'italic',
    },
  };

  return (
    <div style={styles.container}>
     
      <div style={styles.header}>
        <h1 style={styles.title}>Team 4 Cinemas</h1>
        <div style={styles.rightHeader}>
          <div style={styles.searchContainer}>
            <span style={styles.searchIcon}>🔍</span>
            <input 
              placeholder="Search movies by title..." 
              value={q} 
              onChange={e=>setQ(e.target.value)} 
              style={styles.searchInput}
              onFocus={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
              onBlur={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>
       
         

         
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Now Playing</h2>
        <div style={styles.movieGrid}>
          {byCat('Currently Running').map(m => <MovieCard key={m.movieId} movie={m} />)}
        </div>
        {byCat('Currently Running').length===0 && <p style={styles.noMovies}>No movies currently playing.</p>}
      </div>
      
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Coming Soon</h2>
        <div style={styles.movieGrid}>
          {byCat('Coming Soon').map(m => <MovieCard key={m.movieId} movie={m} />)}
        </div>
        {byCat('Coming Soon').length===0 && <p style={styles.noMovies}>No upcoming movies.</p>}
      </div>
    </div>
  );
}
