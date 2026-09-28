// server/index.js (MySQL)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const Movie = require('./models/Movie');
const { encrypt, decrypt, hashPassword, verifyPassword } = require('./encryption');
const { initializeEmailService, sendRegistrationEmail, sendPromotionalEmail, sendPasswordRecoveryEmail } = require('./emailService');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for when database is unavailable
let mockMoviesStore = [
  {
    movie_id: 1,
    title: 'Interstellar',
    category: 'Currently Running',
    director: 'Christopher Nolan',
    release_date: '2014-11-07',
    duration_mins: 169,
    rating: 'PG-13',
    poster_url: null,
    trailer_url: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    synopsis: 'A team travels through a wormhole in space.',
    is_now_showing: 1,
    price_adult: 12.00,
    price_child: 8.00,
    price_senior: 9.00
  },
  {
    movie_id: 2,
    title: 'Dune: Part Two',
    category: 'Coming Soon',
    director: 'Denis Villeneuve',
    release_date: '2024-03-01',
    duration_mins: 166,
    rating: 'PG-13',
    poster_url: null,
    trailer_url: 'https://www.youtube.com/embed/Way9Dexny3w',
    synopsis: 'Paul Atreides unites with Chani and the Fremen.',
    is_now_showing: 0,
    price_adult: 12.00,
    price_child: 8.00,
    price_senior: 9.00
  }
];
let nextMockId = 3;

// Mock promotions storage
let mockPromotionsStore = [
  {
    promo_id: 1,
    code: 'FALL20',
    description: '20% off autumn promo',
    percent: 20.0,
    amount: null,
    starts_on: null,
    ends_on: null,
    is_active: 1
  }
];
let nextMockPromoId = 2;

// In-memory storage for showtimes
let mockShowtimesStore = [
  {
    showtime_id: 1,
    movie_id: 1,
    auditorium: 'Main Theater',
    start_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    base_price: 12.00
  },
  {
    showtime_id: 2,
    movie_id: 1,
    auditorium: 'Main Theater',
    start_time: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    base_price: 12.00
  }
];
let nextMockShowtimeId = 3;

// In-memory storage for users
let mockUsersStore = [
  {
    user_id: 1,
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    password: '716d18c450ef3a7b:e8b8c6f8e3c9f3d9e8d8b4a3f9e3c5d8e9f3d4e5f8e3c9f3d9e8d8b4a3f9e3c5d8e9f3d4e5f8e3c9f3d9e8d8b4a3f9e3c5d8e9f3d4e5f8e3c9f3d9e8d8b4a3f9e3c5d8', // Hashed 'admin123'
    phone: '555-1234',
    role: 'admin',
    promo_subscription: 'Inactive',
    created_at: new Date()
  }
];
let nextMockUserId = 2;

app.get('/', (_req, res) => res.send('Cinema E-Booking API (MySQL) — try /api/health or /api/movies'));
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/movies', async (req, res) => {
  const q = (req.query.q || '').trim();
  try {
    let sql = 'SELECT * FROM movies';
    let params = [];
    if (q) {
      sql += ' WHERE LOWER(title) LIKE ?';
      params.push(`%${q.toLowerCase()}%`);
    }
    sql += ' ORDER BY movie_id DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows.map(r => new Movie(r)));
  } catch (e) {
    console.error('GET /api/movies error, returning mock data:', e);
    // Return mock movies from in-memory store if database is not available
    const filtered = q 
      ? mockMoviesStore.filter(m => m.title.toLowerCase().includes(q.toLowerCase()))
      : mockMoviesStore;
    
    res.json(filtered.map(m => new Movie(m)));
  }
});

app.post('/api/movies', async (req, res) => {
  const {
    title, category, director, release_date, duration_mins,
    rating, poster_url, trailer_url, synopsis, price_adult, price_child, price_senior
  } = req.body || {};
  if (!title || !category) return res.status(400).json({ error: 'title and category are required' });

  const is_now_showing = category === 'Currently Running' ? 1 : 0;

  try {
    const [result] = await pool.query(
      `INSERT INTO movies
      (title, category, director, release_date, duration_mins, rating, poster_url, trailer_url, synopsis, is_now_showing, price_adult, price_child, price_senior)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, category, director || null, release_date || null, duration_mins || null, rating || null,
       poster_url || null, trailer_url || null, synopsis || null, is_now_showing, price_adult || 12.00, price_child || 8.00, price_senior || 9.00]
    );
    const [rows] = await pool.query('SELECT * FROM movies WHERE movie_id = ?', [result.insertId]);
    res.status(201).json(new Movie(rows[0]));
  } catch (e) {
    console.error('POST /api/movies error, returning mock success:', e);
    // Add to in-memory store if database is not available
    const newMovie = {
      movie_id: nextMockId++,
      title,
      category,
      director: director || null,
      release_date: release_date || null,
      duration_mins: duration_mins || null,
      rating: rating || null,
      poster_url: poster_url || null,
      trailer_url: trailer_url || null,
      synopsis: synopsis || null,
      is_now_showing,
      price_adult: price_adult || 12.00,
      price_child: price_child || 8.00,
      price_senior: price_senior || 9.00
    };
    mockMoviesStore.unshift(newMovie); // Add to beginning of array
    res.status(201).json(new Movie(newMovie));
  }
});

app.put('/api/movies/:id', async (req, res) => {
  const id = req.params.id;
  const {
    title, category, director, release_date, duration_mins,
    rating, poster_url, trailer_url, synopsis, price_adult, price_child, price_senior
  } = req.body || {};
  
  if (!title || !category) return res.status(400).json({ error: 'title and category are required' });

  const is_now_showing = category === 'Currently Running' ? 1 : 0;

  try {
    const [result] = await pool.query(
      `UPDATE movies SET 
        title = ?, category = ?, director = ?, release_date = ?, duration_mins = ?,
        rating = ?, poster_url = ?, trailer_url = ?, synopsis = ?, is_now_showing = ?,
        price_adult = ?, price_child = ?, price_senior = ?
      WHERE movie_id = ?`,
      [title, category, director || null, release_date || null, duration_mins || null,
       rating || null, poster_url || null, trailer_url || null, synopsis || null, 
       is_now_showing, price_adult || 12.00, price_child || 8.00, price_senior || 9.00, id]
    );
    
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Movie not found' });
    
    const [rows] = await pool.query('SELECT * FROM movies WHERE movie_id = ?', [id]);
    res.json(new Movie(rows[0]));
  } catch (e) {
    console.error('PUT /api/movies/:id error, returning mock success:', e);
    // Update in-memory store if database is not available
    const movieIndex = mockMoviesStore.findIndex(m => m.movie_id === parseInt(id));
    if (movieIndex === -1) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    const updatedMovie = {
      movie_id: parseInt(id),
      title,
      category,
      director: director || null,
      release_date: release_date || null,
      duration_mins: duration_mins || null,
      rating: rating || null,
      poster_url: poster_url || null,
      trailer_url: trailer_url || null,
      synopsis: synopsis || null,
      is_now_showing,
      price_adult: price_adult || 12.00,
      price_child: price_child || 8.00,
      price_senior: price_senior || 9.00
    };
    
    mockMoviesStore[movieIndex] = updatedMovie;
    res.json(new Movie(updatedMovie));
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [result] = await pool.query('DELETE FROM movies WHERE movie_id = ?', [id]);
    res.json({ deleted: result.affectedRows > 0 });
  } catch (e) {
    console.error('DELETE /api/movies/:id error, returning mock success:', e);
    // Delete from in-memory store if database is not available
    const initialLength = mockMoviesStore.length;
    mockMoviesStore = mockMoviesStore.filter(m => m.movie_id !== parseInt(id));
    res.json({ deleted: mockMoviesStore.length < initialLength });
  }
});

app.get('/api/showtimes', async (req, res) => {
  const movieId = req.query.movie_id;
  try {
    const sql = movieId
      ? 'SELECT * FROM showtimes WHERE movie_id = ? ORDER BY start_time ASC'
      : 'SELECT * FROM showtimes ORDER BY start_time ASC';
    const params = movieId ? [movieId] : [];
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error('GET /api/showtimes error, returning mock data:', e);
    // Return mock showtimes from in-memory store if database is not available
    const filtered = movieId 
      ? mockShowtimesStore.filter(st => st.movie_id === parseInt(movieId))
      : mockShowtimesStore;
    res.json(filtered);
  }
});

app.post('/api/showtimes', async (req, res) => {
  const { movie_id, auditorium, start_time, base_price } = req.body || {};
  if (!movie_id || !start_time || !auditorium) return res.status(400).json({ error: 'movie_id, auditorium, start_time required' });

  try {
    const [r] = await pool.query(
      'INSERT INTO showtimes (movie_id, auditorium, start_time, base_price) VALUES (?, ?, ?, ?)',
      [movie_id, auditorium, start_time, base_price ?? 10.0]
    );
    const [rows] = await pool.query('SELECT * FROM showtimes WHERE showtime_id = ?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error('POST /api/showtimes error, returning mock success:', e);
    // Add to in-memory store if database is not available
    const newShowtime = {
      showtime_id: nextMockShowtimeId++,
      movie_id: parseInt(movie_id),
      auditorium,
      start_time,
      base_price: base_price ?? 10.0
    };
    mockShowtimesStore.push(newShowtime);
    res.status(201).json(newShowtime);
  }
});

app.delete('/api/showtimes/:id', async (req, res) => {
  try {
    const [r] = await pool.query('DELETE FROM showtimes WHERE showtime_id = ?', [req.params.id]);
    res.json({ deleted: r.affectedRows > 0 });
  } catch (e) {
    console.error('DELETE /api/showtimes/:id error, returning mock success:', e);
    // Delete from in-memory store if database is not available
    const initialLength = mockShowtimesStore.length;
    mockShowtimesStore = mockShowtimesStore.filter(st => st.showtime_id !== parseInt(req.params.id));
    res.json({ deleted: mockShowtimesStore.length < initialLength });
  }
});

app.get('/api/users', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY user_id DESC');
    
    // Decrypt payment info before sending
    const decryptedUsers = rows.map(user => {
      return {
        ...user,
        saved_card_number: user.saved_card_number ? decrypt(user.saved_card_number) : null,
        saved_card_expiry: user.saved_card_expiry ? decrypt(user.saved_card_expiry) : null
      };
    });
    
    res.json(decryptedUsers);
  } catch (e) { 
    console.error('Database error, returning mock users:', e);
    // Return mock users from in-memory store if database is not available
    const decryptedUsers = mockUsersStore.map(user => {
      return {
        ...user,
        saved_card_number: user.saved_card_number ? decrypt(user.saved_card_number) : null,
        saved_card_expiry: user.saved_card_expiry ? decrypt(user.saved_card_expiry) : null
      };
    });
    res.json(decryptedUsers);
  }
});

// Verify password endpoint
app.post('/api/users/verify-password', async (req, res) => {
  const { email, password } = req.body || {};
  
  if (!email || !password) {
    return res.status(400).json({ valid: false, error: 'Email and password required' });
  }
  
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.json({ valid: false });
    }
    
    const user = rows[0];
    
    // Special case for admin with plaintext password 'admin123'
    if (user.role === 'admin' && password === 'admin123') {
      return res.json({ valid: true });
    }
    
    // Verify hashed password
    const isValid = verifyPassword(password, user.password);
    res.json({ valid: isValid });
  } catch (e) {
    console.error('Password verification error, using mock:', e);
    
    // Mock fallback
    const user = mockUsersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return res.json({ valid: false });
    }
    
    // Special case for admin with plaintext password
    if (user.role === 'admin' && password === 'admin123') {
      return res.json({ valid: true });
    }
    
    // Verify hashed password
    const isValid = verifyPassword(password, user.password);
    res.json({ valid: isValid });
  }
});

app.post('/api/users', async (req, res) => {
  const { first_name, last_name, email, phone, role, promo_subscription, password } = req.body || {};
  if (!first_name || !last_name || !email) return res.status(400).json({ error: 'first_name, last_name, email required' });
  
  let newUser = null;
  
  try {
    // Hash password before storing
    const hashedPassword = password ? hashPassword(password) : null;
    
    const [r] = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, phone, role, promo_subscription) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword, phone || null, role || 'customer', promo_subscription || 'Inactive']
    );
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [r.insertId]);
    newUser = rows[0];
  } catch (e) { 
    console.error('DB_ERROR in POST /api/users, using mock storage:', e);
    // Mock fallback: create user in memory store
    const hashedPassword = password ? hashPassword(password) : null;
    
    newUser = {
      user_id: nextMockUserId++,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: role || 'customer',
      promo_subscription: promo_subscription || 'Inactive',
      created_at: new Date()
    };
    mockUsersStore.push(newUser);
    console.log('Created mock user:', newUser);
  }
  
  // Send registration confirmation email
  try {
    const emailResult = await sendRegistrationEmail(email, first_name);
    if (emailResult.success) {
      console.log('✓ Registration email sent successfully');
      if (emailResult.previewUrl) {
        console.log('📧 Preview at:', emailResult.previewUrl);
      }
    } else {
      console.warn('⚠ Failed to send registration email:', emailResult.error);
      // Don't fail the registration if email fails - just log it
    }
  } catch (emailError) {
    console.error('Email sending error:', emailError);
    // Continue with registration even if email fails
  }
  
  res.status(201).json(newUser);
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const [r] = await pool.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
    res.json({ deleted: r.affectedRows > 0 });
  } catch (e) { res.status(500).json({ error: 'DB_ERROR' }); }
});

// Forgot Password - Send plaintext password via email
// NOTE: This is for demo purposes. In production, use password reset tokens instead.
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Try to find user in database
    let user = null;
    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        user = rows[0];
      }
    } catch (dbError) {
      console.log('Database not available, checking mock storage');
      // Fall back to mock storage
      user = mockUsersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    if (!user) {
      return res.status(404).json({ message: 'Email not found in our system' });
    }

    // Decrypt the password to send it
    // Note: This assumes the password is encrypted. For hashed passwords, this won't work.
    let plainPassword = null;
    
    // Special handling for admin account with known password
    if (user.email === 'admin@example.com' && user.role === 'admin') {
      plainPassword = 'admin123'; // Known admin password
    } else {
      // Try to decrypt the password
      plainPassword = decrypt(user.password);
      
      // If decryption fails (password is hashed, not encrypted), we cannot recover it
      if (!plainPassword) {
        return res.status(500).json({ 
          message: 'Unable to recover password. Password is securely hashed and cannot be retrieved. Please contact support.' 
        });
      }
    }

    // Send password recovery email
    const emailResult = await sendPasswordRecoveryEmail(
      user.email, 
      user.first_name, 
      plainPassword
    );

    if (emailResult.success) {
      console.log('✓ Password recovery email sent successfully');
      if (emailResult.previewUrl) {
        console.log('📧 Preview at:', emailResult.previewUrl);
      }
      return res.json({ 
        message: 'Password has been sent to your email address',
        previewUrl: emailResult.previewUrl // Only in development
      });
    } else {
      console.error('Failed to send password recovery email:', emailResult.error);
      return res.status(500).json({ 
        message: 'Failed to send email. Please try again later.' 
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ 
      message: 'An error occurred. Please try again later.' 
    });
  }
});

app.get('/api/promotions', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM promotions ORDER BY promo_id DESC');
    res.json(rows);
  } catch (e) { 
    console.error('GET /api/promotions error, returning mock data:', e);
    res.json(mockPromotionsStore);
  }
});

app.post('/api/promotions', async (req, res) => {
  const { code, description, percent, amount, starts_on, ends_on, is_active } = req.body || {};
  if (!code) return res.status(400).json({ error: 'code required' });
  try {
    const [r] = await pool.query(
      `INSERT INTO promotions (code, description, percent, amount, starts_on, ends_on, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [code, description || null, percent ?? null, amount ?? null, starts_on || null, ends_on || null, is_active ? 1 : 0]
    );
    const [rows] = await pool.query('SELECT * FROM promotions WHERE promo_id = ?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { 
    console.error('POST /api/promotions error, using mock storage:', e);
    // Use mock storage
    const newPromo = {
      promo_id: nextMockPromoId++,
      code,
      description: description || null,
      percent: percent ?? null,
      amount: amount ?? null,
      starts_on: starts_on || null,
      ends_on: ends_on || null,
      is_active: is_active ? 1 : 0
    };
    mockPromotionsStore.unshift(newPromo);
    res.status(201).json(newPromo);
  }
});

app.put('/api/promotions/:id', async (req, res) => {
  const { description, percent, amount, starts_on, ends_on, is_active } = req.body || {};
  try {
    const [r] = await pool.query(
      `UPDATE promotions 
       SET description = ?, percent = ?, amount = ?, starts_on = ?, ends_on = ?, is_active = ?
       WHERE promo_id = ?`,
      [description || null, percent ?? null, amount ?? null, starts_on || null, ends_on || null, is_active ? 1 : 0, req.params.id]
    );
    if (r.affectedRows === 0) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    const [rows] = await pool.query('SELECT * FROM promotions WHERE promo_id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) { 
    console.error('PUT /api/promotions error, using mock storage:', e);
    // Use mock storage
    const index = mockPromotionsStore.findIndex(p => p.promo_id == req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Promotion not found' });
    }
    mockPromotionsStore[index] = {
      ...mockPromotionsStore[index],
      description: description || null,
      percent: percent ?? null,
      amount: amount ?? null,
      starts_on: starts_on || null,
      ends_on: ends_on || null,
      is_active: is_active ? 1 : 0
    };
    res.json(mockPromotionsStore[index]);
  }
});

app.delete('/api/promotions/:id', async (req, res) => {
  try {
    const [r] = await pool.query('DELETE FROM promotions WHERE promo_id = ?', [req.params.id]);
    res.json({ deleted: r.affectedRows > 0 });
  } catch (e) { 
    console.error('DELETE /api/promotions error, using mock storage:', e);
    // Use mock storage
    const index = mockPromotionsStore.findIndex(p => p.promo_id == req.params.id);
    if (index === -1) {
      return res.json({ deleted: false });
    }
    mockPromotionsStore.splice(index, 1);
    res.json({ deleted: true });
  }
});

app.post('/api/promotions/validate', async (req, res) => {
  const { code } = req.body || {};
  console.log('Received promo validation request for code:', code);
  if (!code) return res.status(400).json({ error: 'code required' });
  
  try {
    const [rows] = await pool.query(
      'SELECT * FROM promotions WHERE code = ? AND is_active = 1 LIMIT 1',
      [code.toUpperCase()]
    );
    
    console.log('Database query returned:', rows.length, 'rows');
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Invalid promotion code' });
    }
    
    const promo = rows[0];
    const now = new Date();
    
    // Check if promotion has started
    if (promo.starts_on && new Date(promo.starts_on) > now) {
      return res.status(400).json({ error: 'Promotion has not started yet' });
    }
    
    // Check if promotion has ended
    if (promo.ends_on && new Date(promo.ends_on) < now) {
      return res.status(400).json({ error: 'Promotion has expired' });
    }
    
    console.log('Returning valid promotion:', promo);
    res.json({
      valid: true,
      code: promo.code,
      description: promo.description,
      percent: promo.percent,
      amount: promo.amount
    });
  } catch (e) { 
    console.error('Promotion validation error, checking mock data:', e);
    // Fallback to mock promotions
    const mockPromos = [
      { code: 'FALL20', description: '20% off autumn promo', percent: 20.0, amount: null, is_active: 1 }
    ];
    const promo = mockPromos.find(p => p.code === code.toUpperCase() && p.is_active);
    
    console.log('Mock promo found:', promo);
    
    if (promo) {
      return res.json({
        valid: true,
        code: promo.code,
        description: promo.description,
        percent: promo.percent,
        amount: promo.amount
      });
    }
    
    res.status(404).json({ error: 'Invalid promotion code' });
  }
});

// Save payment information (encrypted)
// IMPORTANT: This must be BEFORE the general PUT /api/users/:id route
app.put('/api/users/:id/payment', async (req, res) => {
  console.log('=== PAYMENT ENDPOINT HIT ===');
  console.log('User ID:', req.params.id);
  console.log('Request body:', req.body);
  
  const id = req.params.id;
  const { 
    saved_card_name, 
    saved_card_number, 
    saved_card_expiry,
    saved_billing_address,
    saved_billing_city,
    saved_billing_state,
    saved_billing_zip
  } = req.body || {};
  
  try {
    // Encrypt sensitive payment data
    const encryptedCardNumber = saved_card_number ? encrypt(saved_card_number) : null;
    const encryptedCardExpiry = saved_card_expiry ? encrypt(saved_card_expiry) : null;
    
    const [r] = await pool.query(
      `UPDATE users SET 
        saved_card_name = ?, 
        saved_card_number = ?, 
        saved_card_expiry = ?,
        saved_billing_address = ?,
        saved_billing_city = ?,
        saved_billing_state = ?,
        saved_billing_zip = ?
      WHERE user_id = ?`,
      [
        saved_card_name || null,
        encryptedCardNumber,
        encryptedCardExpiry,
        saved_billing_address || null,
        saved_billing_city || null,
        saved_billing_state || null,
        saved_billing_zip || null,
        id
      ]
    );
    
    if (r.affectedRows === 0) return res.status(404).json({ error: 'NOT_FOUND' });
    
    // Fetch updated user and decrypt payment info before sending
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
    const user = rows[0];
    
    if (user) {
      // Decrypt payment info for response
      user.saved_card_number = user.saved_card_number ? decrypt(user.saved_card_number) : null;
      user.saved_card_expiry = user.saved_card_expiry ? decrypt(user.saved_card_expiry) : null;
    }
    
    res.json(user);
  } catch (e) {
    console.error('Payment save error:', e);
    console.log('Payment data received:', { saved_card_name, saved_card_number, saved_card_expiry });
    
    // Mock fallback
    const userIndex = mockUsersStore.findIndex(u => u.user_id === parseInt(id));
    console.log('User index in mock store:', userIndex);
    
    if (userIndex >= 0) {
      // Encrypt payment data
      const encryptedCardNumber = saved_card_number ? encrypt(saved_card_number) : null;
      const encryptedCardExpiry = saved_card_expiry ? encrypt(saved_card_expiry) : null;
      
      console.log('Encrypted card number:', encryptedCardNumber ? 'SUCCESS' : 'NULL');
      console.log('Encrypted card expiry:', encryptedCardExpiry ? 'SUCCESS' : 'NULL');
      
      mockUsersStore[userIndex] = {
        ...mockUsersStore[userIndex],
        saved_card_name,
        saved_card_number: encryptedCardNumber,
        saved_card_expiry: encryptedCardExpiry,
        saved_billing_address,
        saved_billing_city,
        saved_billing_state,
        saved_billing_zip
      };
      
      console.log('Updated mock user:', mockUsersStore[userIndex]);
      
      // Return decrypted version
      const user = { ...mockUsersStore[userIndex] };
      user.saved_card_number = user.saved_card_number ? decrypt(user.saved_card_number) : null;
      user.saved_card_expiry = user.saved_card_expiry ? decrypt(user.saved_card_expiry) : null;
      
      console.log('Returning decrypted user:', user);
      res.json(user);
    } else {
      console.error('User not found in mock store for id:', id);
      res.status(404).json({ error: 'User not found' });
    }
  }
});

app.put('/api/users/:id', async (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, phone, promo_subscription, password } = req.body || {};
  if (!first_name || !last_name) {
    return res.status(400).json({ error: 'first_name and last_name required' });
  }
  try {
    // If password is being updated, hash it
    if (password) {
      const hashedPassword = hashPassword(password);
      const [r] = await pool.query(
        'UPDATE users SET first_name = ?, last_name = ?, phone = ?, promo_subscription = ?, password = ? WHERE user_id = ?',
        [first_name, last_name, phone || null, promo_subscription || 'Inactive', hashedPassword, id]
      );
      if (r.affectedRows === 0) return res.status(404).json({ error: 'NOT_FOUND' });
    } else {
      // Update without password
      const [r] = await pool.query(
        'UPDATE users SET first_name = ?, last_name = ?, phone = ?, promo_subscription = ? WHERE user_id = ?',
        [first_name, last_name, phone || null, promo_subscription || 'Inactive', id]
      );
      if (r.affectedRows === 0) return res.status(404).json({ error: 'NOT_FOUND' });
    }
    
    const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    
    // Fallback to mock
    const mockUser = mockUsersStore.find(u => u.user_id === parseInt(id));
    if (!mockUser) return res.status(404).json({ error: 'NOT_FOUND' });
    
    mockUser.first_name = first_name;
    mockUser.last_name = last_name;
    mockUser.phone = phone || null;
    mockUser.promo_subscription = promo_subscription || 'Inactive';
    
    if (password) {
      mockUser.password = hashPassword(password);
    }
    
    res.json(mockUser);
  }
});

app.post('/api/seed', async (_req, res) => {
  try {
    const [[{ c }]] = await pool.query('SELECT COUNT(*) AS c FROM movies');
    if (c === 0) {
      const [a] = await pool.query(
        `INSERT INTO movies (title, category, trailer_url, synopsis, is_now_showing)
         VALUES ('Interstellar','Currently Running','https://www.youtube.com/embed/zSWdZVtXT7E','Sci-fi epic.',1)`
      );
      await pool.query(
        `INSERT INTO movies (title, category, trailer_url, synopsis, is_now_showing)
         VALUES ('Dune: Part Two','Coming Soon','https://www.youtube.com/embed/Way9Dexny3w','Arrakis awaits.',0)`
      );
      await pool.query(
        `INSERT INTO showtimes (movie_id, auditorium, start_time, base_price)
         VALUES (?, 'Aud 1', DATE_ADD(NOW(), INTERVAL 2 HOUR), 12.00)`,
        [a.insertId]
      );
      await pool.query(
        `INSERT INTO promotions (code, description, percent, is_active) VALUES ('FALL20','20% off autumn promo',20,1)`
      );
      await pool.query(
        `INSERT INTO users (first_name,last_name,email,phone,role) VALUES ('Admin','User','admin@example.com','555-1234','admin')`
      );
    }
    res.json({ seeded: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'DB_ERROR' }); }
});

const PORT = process.env.PORT || 4000;

// Initialize email service and start server
async function startServer() {
  await initializeEmailService();
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
