import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminMain from './pages/AdminMain';
import ManageMovies from './pages/ManageMovies';
import ManageShowtimes from './pages/ManageShowtimes';
import ManagePromotions from './pages/ManagePromotions';
import ManageUsers from './pages/ManageUsers';
import Registration from './pages/Registration';
import RegistrationConfirm from './pages/RegistrationConfirm';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import EditProfile from './pages/EditProfile';
import BuyTickets from './pages/BuyTickets';
import OrderSummary from './pages/OrderSummary';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Team4Logo from './Team4Logo.png';

const Nav = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const syncUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (e) {
          console.error('Failed to parse user data:', e);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    syncUser();

    // Listen for auth changes
    window.addEventListener('storage', syncUser);
    window.addEventListener('auth-change', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('auth-change', syncUser);
    };
  }, []);

  const isAdmin = user && user.role === 'admin';

  const styles = {
    nav: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 60px',
      backgroundColor: '#0a0a0a',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      fontFamily: "'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
    },
    logoPlaceholder: {
      width: '120px',
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      overflow: 'hidden',
    },
    logoImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      transition: 'all 0.3s ease',
    },
    navLinks: {
      display: 'flex',
      gap: '28px',
      alignItems: 'center',
    },
    link: {
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'color 0.2s ease',
      letterSpacing: '0.5px',
    },
    loginButton: {
      color: '#0a0a0a',
      backgroundColor: '#ffffff',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '600',
      padding: '10px 24px',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
      letterSpacing: '0.5px',
      border: 'none',
      cursor: 'pointer',
    },
  };

  const handleLinkHover = (e, isHover) => {
    if (isHover) {
      e.target.style.color = '#E50914';
    } else {
      e.target.style.color = '#ffffff';
    }
  };

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.backgroundColor = '#f0f0f0';
      e.target.style.transform = 'translateY(-2px)';
    } else {
      e.target.style.backgroundColor = '#ffffff';
      e.target.style.transform = 'translateY(0)';
    }
  };

  const handleLogoHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
      e.currentTarget.querySelector('img').style.filter = 'brightness(1.1)';
    } else {
      e.currentTarget.querySelector('img').style.transform = 'scale(1)';
      e.currentTarget.querySelector('img').style.filter = 'brightness(1)';
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.leftSection}>
        <Link 
          to="/"
          style={styles.logoPlaceholder}
          onMouseEnter={(e) => handleLogoHover(e, true)}
          onMouseLeave={(e) => handleLogoHover(e, false)}
        >
          <img src={Team4Logo} alt="Team 4 Cinema" style={styles.logoImage} />
        </Link>
        <div style={styles.navLinks}>
          <Link 
            to="/buy" 
            style={styles.link}
            onMouseEnter={(e) => handleLinkHover(e, true)}
            onMouseLeave={(e) => handleLinkHover(e, false)}
          >
            Buy Tickets
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              style={styles.link}
              onMouseEnter={(e) => handleLinkHover(e, true)}
              onMouseLeave={(e) => handleLinkHover(e, false)}
            >
              Panel
            </Link>
          )}
        </div>
      </div>
      <Link 
        to={user ? "/profile" : "/login"}
        style={styles.loginButton}
        onMouseEnter={(e) => handleButtonHover(e, true)}
        onMouseLeave={(e) => handleButtonHover(e, false)}
      >
        {user ? 'Account' : 'Login'}
      </Link>
    </nav>
  );
};

export default function App(){
  return (
    <BrowserRouter>
      <Nav/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/buy" element={<BuyTickets/>} />
        <Route path="/order-summary" element={<OrderSummary/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/order-confirmation" element={<OrderConfirmation/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/register" element={<Registration/>} />
        <Route path="/register/confirm" element={<RegistrationConfirm/>} />
        <Route path="/profile" element={<EditProfile/>} />
        <Route path="/admin" element={<AdminMain/>} />
        <Route path="/admin/movies" element={<ManageMovies/>} />
        <Route path="/admin/showtimes" element={<ManageShowtimes/>} />
        <Route path="/admin/promotions" element={<ManagePromotions/>} />
        <Route path="/admin/users" element={<ManageUsers/>} />
      </Routes>
    </BrowserRouter>
  );
}
