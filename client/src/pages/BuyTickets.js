import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function BuyTickets(){
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [sel, setSel] = useState({movieId:'', showtimeId:'', tickets:[]});
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

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

  // load movies
  useEffect(()=>{
    fetch('/api/movies')
      .then(r=>r.json())
      .then(d=>{
        const movieList = Array.isArray(d) ? d : [];
        setMovies(movieList);
        
        // Auto-select movie from URL parameter
        const movieIdFromUrl = searchParams.get('movie_id');
        if (movieIdFromUrl && movieList.length > 0) {
          const movieExists = movieList.find(m => m.movieId === parseInt(movieIdFromUrl));
          if (movieExists) {
            setSel(prev => ({ ...prev, movieId: movieIdFromUrl }));
          }
        }
      });
  }, [searchParams]);

  // load showtimes for selected movie
  useEffect(()=>{
    if(!sel.movieId) { setShowtimes([]); return; }
    fetch(`/api/showtimes?movie_id=${sel.movieId}`)
      .then(r=>r.json())
      .then(data => {
        // Ensure data is an array
        setShowtimes(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Failed to load showtimes:', err);
        setShowtimes([]);
      });
  }, [sel.movieId]);

  const proceed = (e)=>{
    e.preventDefault();
    nav('/order-summary', { state: { selection: sel, movie: selectedMovie }});
  };

  const selectedMovie = movies.find(m => m.movieId === parseInt(sel.movieId));

  const addTicket = (seat, ageCategory) => {
    const newTicket = {
      seat,
      ageCategory,
      price: ageCategory === 'adult' ? selectedMovie.priceAdult : 
             ageCategory === 'child' ? selectedMovie.priceChild : 
             selectedMovie.priceSenior
    };
    setSel({...sel, tickets: [...sel.tickets, newTicket]});
  };

  const removeTicket = (index) => {
    const newTickets = sel.tickets.filter((_, i) => i !== index);
    setSel({...sel, tickets: newTickets});
  };

  const getSeatStyle = (seat) => {
    const isSelected = sel.tickets.some(t => t.seat === seat);
    const isHovered = hoveredSeat === seat;
    
    return {
      ...styles.seat,
      ...(isSelected ? styles.seatSelected : styles.seatAvailable),
      ...(isHovered && !isSelected ? styles.seatHovered : {}),
    };
  };

  const getTotalPrice = () => {
    return sel.tickets.reduce((sum, ticket) => sum + parseFloat(ticket.price), 0).toFixed(2);
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
      maxWidth: '1200px',
      margin: '0 auto',
    },
    section: {
      marginBottom: '48px',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '500',
      marginBottom: '20px',
      color: '#ffffff',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    stepNumber: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#E50914',
      fontSize: '16px',
      fontWeight: '600',
    },
    select: {
      width: '100%',
      maxWidth: '600px',
      padding: '16px 20px',
      fontSize: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      color: '#ffffff',
      outline: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 12px center',
      backgroundSize: '20px',
      paddingRight: '40px',
    },
    selectOption: {
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
    },
    movieInfo: {
      display: 'flex',
      gap: '24px',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      marginTop: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    moviePoster: {
      width: '120px',
      height: '180px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '40px',
    },
    movieDetails: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '8px',
    },
    movieTitle: {
      fontSize: '24px',
      fontWeight: '600',
      margin: 0,
    },
    movieMeta: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.6)',
    },
    warningText: {
      color: '#ff6b6b',
      fontSize: '14px',
      marginTop: '12px',
      padding: '12px 16px',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      borderRadius: '6px',
      border: '1px solid rgba(255, 107, 107, 0.3)',
    },
    theaterContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderRadius: '12px',
      padding: '40px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    screen: {
      margin: '0 auto 40px',
      maxWidth: '500px',
    },
    screenLabel: {
      textAlign: 'center',
      fontSize: '14px',
      color: 'rgba(255,255,255,0.5)',
      marginBottom: '12px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    screenBar: {
      height: '8px',
      background: 'linear-gradient(180deg, #E50914 0%, rgba(229, 9, 20, 0.3) 100%)',
      borderRadius: '4px 4px 0 0',
      boxShadow: '0 4px 20px rgba(229, 9, 20, 0.4)',
    },
    seatGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gap: '12px',
      maxWidth: '600px',
      margin: '0 auto',
    },
    seat: {
      aspectRatio: '1',
      border: 'none',
      borderRadius: '8px 8px 2px 2px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      position: 'relative',
      fontFamily: 'inherit',
    },
    seatAvailable: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255,255,255,0.7)',
      border: '2px solid rgba(255, 255, 255, 0.2)',
    },
    seatSelected: {
      backgroundColor: '#E50914',
      color: '#ffffff',
      border: '2px solid #E50914',
      boxShadow: '0 0 20px rgba(229, 9, 20, 0.6)',
      transform: 'scale(1.05)',
    },
    seatHovered: {
      backgroundColor: 'rgba(229, 9, 20, 0.3)',
      border: '2px solid #E50914',
      transform: 'scale(1.05)',
    },
    legend: {
      display: 'flex',
      gap: '32px',
      justifyContent: 'center',
      marginTop: '32px',
      flexWrap: 'wrap',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: 'rgba(255,255,255,0.7)',
    },
    legendBox: {
      width: '24px',
      height: '24px',
      borderRadius: '4px',
    },
    ageSelector: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '16px',
      maxWidth: '600px',
    },
    ageCard: {
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center',
    },
    ageCardSelected: {
      backgroundColor: 'rgba(229, 9, 20, 0.2)',
      border: '2px solid #E50914',
      boxShadow: '0 0 20px rgba(229, 9, 20, 0.3)',
    },
    ageTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px',
    },
    agePrice: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.6)',
    },
    summary: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    summaryTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '16px',
      paddingBottom: '12px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '12px',
      fontSize: '15px',
    },
    summaryLabel: {
      color: 'rgba(255,255,255,0.7)',
    },
    summaryValue: {
      color: '#ffffff',
      fontWeight: '500',
    },
    continueButton: {
      width: '100%',
      padding: '18px',
      backgroundColor: '#E50914',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '24px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    continueButtonDisabled: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'rgba(255,255,255,0.3)',
      cursor: 'not-allowed',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Buy Tickets</h1>
        <p style={styles.subtitle}>Select your movie, showtime, and seats</p>
      </div>

      <div style={styles.content}>
        <form onSubmit={proceed}>
          {/* Step 1: Select Movie */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>
              <span style={styles.stepNumber}>1</span>
              Choose Movie
            </div>
            <select 
              required 
              value={sel.movieId} 
            onChange={e=>setSel({...sel, movieId:e.target.value, showtimeId:'', tickets:[]})}
            style={styles.select}
            >
              <option value="">Select a movie...</option>
              {movies.map(m => <option value={m.movieId} key={m.movieId}>{m.title}</option>)}
            </select>
            
            {selectedMovie && (
              <div style={styles.movieInfo}>
                <div style={styles.moviePoster}>🎬</div>
                <div style={styles.movieDetails}>
                  <h3 style={styles.movieTitle}>{selectedMovie.title}</h3>
                  {selectedMovie.director && (
                    <div style={styles.movieMeta}>Directed by {selectedMovie.director}</div>
                  )}
                  <div style={styles.movieMeta}>
                    {selectedMovie.rating} • {selectedMovie.durationMins} mins • {selectedMovie.category}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Select Showtime */}
          {sel.movieId && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span style={styles.stepNumber}>2</span>
                Choose Showtime
              </div>
              <select 
                required 
                value={sel.showtimeId} 
              onChange={e=>setSel({...sel, showtimeId:e.target.value, tickets:[]})}
              style={styles.select}
              >
                <option value="">Select a showtime...</option>
                {(Array.isArray(showtimes) ? showtimes : []).map(s => (
                  <option value={s.showtime_id} key={s.showtime_id}>
                    {new Date(s.start_time).toLocaleString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric', 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </option>
                ))}
              </select>
              {sel.movieId && showtimes.length === 0 && (
                <div style={styles.warningText}>
                  ⚠️ No showtimes available for this movie yet. An admin can add one from the Admin Panel.
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Seats */}
          {sel.showtimeId && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span style={styles.stepNumber}>3</span>
                Select Your Seats
              </div>
              
              <div style={styles.theaterContainer}>
                <div style={styles.screen}>
                  <div style={styles.screenLabel}>Screen</div>
                  <div style={styles.screenBar}></div>
                </div>

                                <div style={styles.seatGrid}>
                  {['A', 'B', 'C'].map(row => (
                    Array.from({length:8}).map((_,i)=>{
                      const seat = `${row}${i+1}`;
                      const ticketIndex = sel.tickets.findIndex(t => t.seat === seat);
                      const isSelected = ticketIndex !== -1;
                      
                      return (
                        <button
                          type="button"
                          key={seat}
                          onClick={()=>{
                            if (isSelected) {
                              // Remove ticket
                              removeTicket(ticketIndex);
                            } else {
                              // Add ticket with default adult category
                              addTicket(seat, 'adult');
                            }
                          }}
                          onMouseEnter={() => setHoveredSeat(seat)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          style={getSeatStyle(seat)}
                        >
                          {seat}
                        </button>
                      );
                    })
                  )).flat()}
                </div>

                <div style={styles.legend}>
                  <div style={styles.legendItem}>
                    <div style={{...styles.legendBox, backgroundColor: 'rgba(255, 255, 255, 0.1)', border: '2px solid rgba(255, 255, 255, 0.2)'}}></div>
                    Available
                  </div>
                  <div style={styles.legendItem}>
                    <div style={{...styles.legendBox, backgroundColor: '#E50914', border: '2px solid #E50914'}}></div>
                    Selected
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Select Age Category */}
          {sel.tickets.length > 0 && selectedMovie && (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>
                <span style={styles.stepNumber}>4</span>
                Assign Ticket Types to Seats
              </div>
              <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: '20px'}}>
                Click on a ticket type, then click on a seat to assign that type. You can assign multiple seats to the same type.
              </p>
              
              {/* Ticket Type Buttons */}
              <div style={styles.ageSelector}>
                {[
                  { value: 'adult', label: 'Adult', price: `$${parseFloat(selectedMovie.priceAdult || 12).toFixed(2)}` },
                  { value: 'child', label: 'Child', price: `$${parseFloat(selectedMovie.priceChild || 8).toFixed(2)}` },
                  { value: 'senior', label: 'Senior', price: `$${parseFloat(selectedMovie.priceSenior || 9).toFixed(2)}` },
                ].map(age => {
                  const ticketsOfType = sel.tickets.filter(t => t.ageCategory === age.value).length;
                  return (
                    <div
                      key={age.value}
                      style={{
                        ...styles.ageCard,
                        ...(ticketsOfType > 0 ? styles.ageCardSelected : {}),
                        cursor: 'default',
                        position: 'relative'
                      }}
                    >
                      <div style={styles.ageTitle}>{age.label}</div>
                      <div style={styles.agePrice}>{age.price}</div>
                      {ticketsOfType > 0 && (
                        <div style={{fontSize: '18px', marginTop: '8px', color: '#E50914', fontWeight: '700'}}>
                          {ticketsOfType} ticket{ticketsOfType > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Ticket Assignment Interface */}
              <div style={{marginTop: '32px', padding: '24px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)'}}>
                <h3 style={{fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#ffffff'}}>Change Ticket Type for Selected Seats:</h3>
                {sel.tickets.map((ticket, index) => (
                  <div key={index} style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px'}}>
                    <span style={{fontSize: '16px', fontWeight: '600', color: '#E50914', minWidth: '60px'}}>Seat {ticket.seat}</span>
                    <div style={{display: 'flex', gap: '8px', flex: 1}}>
                      {['adult', 'child', 'senior'].map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            const newTickets = [...sel.tickets];
                            newTickets[index] = {
                              ...ticket,
                              ageCategory: type,
                              price: type === 'adult' ? selectedMovie.priceAdult : 
                                     type === 'child' ? selectedMovie.priceChild : 
                                     selectedMovie.priceSenior
                            };
                            setSel({...sel, tickets: newTickets});
                          }}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: ticket.ageCategory === type ? '#E50914' : 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            border: ticket.ageCategory === type ? '2px solid #E50914' : '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: ticket.ageCategory === type ? '600' : '400',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textTransform: 'capitalize'
                          }}
                          onMouseEnter={(e) => {
                            if (ticket.ageCategory !== type) {
                              e.target.style.backgroundColor = 'rgba(229, 9, 20, 0.3)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (ticket.ageCategory !== type) {
                              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }
                          }}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    <span style={{fontSize: '16px', fontWeight: '600', color: '#ffffff', minWidth: '70px', textAlign: 'right'}}>
                      ${parseFloat(ticket.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary & Continue */}
          {sel.tickets.length > 0 && (
            <div style={styles.section}>
              <div style={styles.summary}>
                <div style={styles.summaryTitle}>Order Summary</div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Movie:</span>
                  <span style={styles.summaryValue}>{selectedMovie?.title}</span>
                </div>
                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>Showtime:</span>
                  <span style={styles.summaryValue}>
                    {showtimes.find(s => s.showtime_id === parseInt(sel.showtimeId))
                      ? new Date(showtimes.find(s => s.showtime_id === parseInt(sel.showtimeId)).start_time).toLocaleString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric', 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })
                      : 'N/A'}
                  </span>
                </div>
                <div style={{...styles.summaryRow, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '16px'}}>
                  <span style={styles.summaryLabel}>Tickets:</span>
                </div>
                {sel.tickets.map((ticket, index) => (
                  <div key={index} style={{...styles.summaryRow, paddingLeft: '16px', fontSize: '14px'}}>
                    <span style={styles.summaryLabel}>
                      Seat {ticket.seat} - {ticket.ageCategory.charAt(0).toUpperCase() + ticket.ageCategory.slice(1)}
                    </span>
                    <span style={styles.summaryValue}>
                      ${parseFloat(ticket.price).toFixed(2)}
                      <button
                        onClick={() => removeTicket(index)}
                        style={{marginLeft: '12px', background: 'transparent', border: 'none', color: '#E50914', cursor: 'pointer', fontSize: '16px'}}
                      >
                        ✕
                      </button>
                    </span>
                  </div>
                ))}
                <div style={{...styles.summaryRow, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '16px', fontSize: '18px', fontWeight: '600'}}>
                  <span style={styles.summaryLabel}>Total:</span>
                  <span style={{...styles.summaryValue, color: '#E50914'}}>${getTotalPrice()}</span>
                </div>

                <button 
                  type="submit" 
                  disabled={!sel.movieId || !sel.showtimeId || sel.tickets.length===0}
                  style={{
                    ...styles.continueButton,
                    ...(!sel.movieId || !sel.showtimeId || sel.tickets.length===0 ? styles.continueButtonDisabled : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (sel.movieId && sel.showtimeId && sel.tickets.length > 0) {
                      e.target.style.backgroundColor = '#c40812';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(229, 9, 20, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = sel.movieId && sel.showtimeId && sel.tickets.length > 0 ? '#E50914' : 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Continue to Order Summary →
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
