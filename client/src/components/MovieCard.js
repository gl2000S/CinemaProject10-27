import React, { useState } from 'react';

export default function MovieCard({ movie }){
  const [isHovered, setIsHovered] = useState(false);
  
  const styles = {
    card: {
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
      boxShadow: isHovered 
        ? '0 8px 24px rgba(229, 9, 20, 0.4), 0 0 40px rgba(229, 9, 20, 0.2)' 
        : '0 4px 12px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    videoContainer: {
      position: 'relative',
      paddingBottom: '56.25%',
      height: 0,
      overflow: 'hidden',
      backgroundColor: '#000',
    },
    iframe: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    content: {
      padding: '16px',
    },
    title: {
      margin: '0 0 8px 0',
      fontSize: '18px',
      fontWeight: '600',
      color: '#ffffff',
      letterSpacing: '-0.3px',
      lineHeight: '1.3',
    },
    director: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.6)',
      margin: '0 0 12px 0',
      fontStyle: 'italic',
    },
    synopsis: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.7)',
      lineHeight: '1.5',
      margin: 0,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    placeholder: {
      width: '100%',
      height: '200px',
      backgroundColor: '#2a2a2a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(255, 255, 255, 0.3)',
      fontSize: '14px',
    },
    buyButton: {
      margin: '16px auto 20px auto',
      backgroundColor: '#e50914', // Netflix-style red
      border: 'none',
      color: '#fff',
      fontWeight: 600,
      padding: '10px 18px',
      fontSize: '14px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
      width: 'fit-content',
      alignSelf: 'center',
    },
  };

  return (
    <div 
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {movie.trailerUrl ? (
        <div style={styles.videoContainer}>
          <iframe
            title={movie.title}
            src={movie.trailerUrl}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={styles.iframe}
          />
        </div>
      ) : (
        <div style={styles.placeholder}>
          🎬 No Trailer Available
        </div>
      )}
      <div style={styles.content}>
        <h3 style={styles.title}>{movie.title}</h3>
        {movie.director && <p style={styles.director}>Directed by {movie.director}</p>}
        {movie.synopsis && <p style={styles.synopsis}>{movie.synopsis}</p>}
      </div>
      <button
        style={styles.buyButton}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#b00610';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = '#e50914';
          e.target.style.transform = 'scale(1)';
        }}
        onClick={() => (window.location.href = `/buy?movie_id=${movie.movieId}`)}
      >
        Buy Tickets
      </button>
    </div>
  );
}
