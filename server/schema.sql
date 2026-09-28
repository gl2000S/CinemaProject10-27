-- schema.sql (MySQL)

CREATE TABLE IF NOT EXISTS movies (
  movie_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category ENUM('Currently Running', 'Coming Soon') NOT NULL,
  director VARCHAR(255) NULL,
  release_date DATE NULL,
  duration_mins INT NULL,
  rating VARCHAR(20) NULL,
  poster_url VARCHAR(1024) NULL,
  trailer_url VARCHAR(1024) NULL,
  synopsis TEXT NULL,
  is_now_showing TINYINT(1) DEFAULT 0,
  price_adult DECIMAL(8,2) DEFAULT 12.00,
  price_child DECIMAL(8,2) DEFAULT 8.00,
  price_senior DECIMAL(8,2) DEFAULT 9.00
);

CREATE TABLE IF NOT EXISTS showtimes (
  showtime_id INT AUTO_INCREMENT PRIMARY KEY,
  movie_id INT NOT NULL,
  auditorium VARCHAR(64) NOT NULL,
  start_time DATETIME NOT NULL,
  base_price DECIMAL(8,2) NOT NULL DEFAULT 10.00,
  CONSTRAINT fk_showtimes_movie
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NULL,
  phone VARCHAR(50) NULL,
  role ENUM('customer','admin') DEFAULT 'customer',
  promo_subscription ENUM('Active','Inactive') DEFAULT 'Inactive',
  saved_card_name VARCHAR(255) NULL,
  saved_card_number VARCHAR(255) NULL,
  saved_card_expiry VARCHAR(10) NULL,
  saved_billing_address VARCHAR(255) NULL,
  saved_billing_city VARCHAR(100) NULL,
  saved_billing_state VARCHAR(50) NULL,
  saved_billing_zip VARCHAR(10) NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promotions (
  promo_id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  percent DECIMAL(5,2) NULL,
  amount DECIMAL(8,2) NULL,
  starts_on DATE NULL,
  ends_on DATE NULL,
  is_active TINYINT(1) DEFAULT 1
);
-- ====== Baseline data ======

INSERT IGNORE INTO movies
  (title, category, director, release_date, duration_mins, rating, poster_url, trailer_url, synopsis, is_now_showing)
VALUES
  ('Interstellar', 'Currently Running', 'Christopher Nolan', '2014-11-07', 169, 'PG-13', NULL,
   'https://www.youtube.com/embed/zSWdZVtXT7E', 'A team travels through a wormhole in space.', 1),
  ('Dune: Part Two', 'Coming Soon', 'Denis Villeneuve', '2024-03-01', 166, 'PG-13', NULL,
   'https://www.youtube.com/embed/Way9Dexny3w', 'Paul Atreides unites with Chani and the Fremen.', 0);


INSERT IGNORE INTO promotions (code, description, percent, is_active)
VALUES ('FALL20','20% off autumn promo', 20.0, 1);

INSERT IGNORE INTO users (first_name, last_name, email, password, phone, role)
VALUES ('Admin','User','admin@example.com','admin123','555-1234','admin');

INSERT INTO showtimes (movie_id, auditorium, start_time, base_price)
SELECT m.movie_id, 'Aud 1', DATE_ADD(NOW(), INTERVAL 2 HOUR), 12.00
FROM movies m
LEFT JOIN showtimes s ON s.movie_id = m.movie_id
WHERE s.showtime_id IS NULL;
