// Simple encryption utility using Node.js built-in crypto module
// NOTE: This is a lightweight POC implementation, not for production use

const crypto = require('crypto');

// Use a simple secret key (in production, this should be in environment variables)
const SECRET_KEY = process.env.ENCRYPTION_KEY || 'cinema-booking-secret-key-2025';
const ALGORITHM = 'aes-256-cbc';

// Ensure key is 32 bytes for AES-256
const getKey = () => {
  return crypto.createHash('sha256').update(SECRET_KEY).digest();
};

/**
 * Encrypt a string value
 * @param {string} text - Plain text to encrypt
 * @returns {string} Encrypted text in format: iv:encryptedData
 */
function encrypt(text) {
  if (!text) return null;
  
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV and encrypted data separated by colon
    return iv.toString('hex') + ':' + encrypted;
  } catch (err) {
    console.error('Encryption error:', err);
    return null;
  }
}

/**
 * Decrypt an encrypted string
 * @param {string} encryptedText - Encrypted text in format: iv:encryptedData
 * @returns {string} Decrypted plain text
 */
function decrypt(encryptedText) {
  if (!encryptedText) return null;
  
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 2) {
      console.error('Invalid encrypted text format');
      return null;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedData = parts[1];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (err) {
    console.error('Decryption error:', err);
    return null;
  }
}

/**
 * Hash a password (one-way, cannot be decrypted)
 * @param {string} password - Plain text password
 * @returns {string} Hashed password
 */
function hashPassword(password) {
  if (!password) return null;
  
  // Use SHA-256 with salt for simple hashing (in production, use bcrypt)
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
  
  return salt + ':' + hash;
}

/**
 * Verify a password against a hash
 * @param {string} password - Plain text password to verify
 * @param {string} hashedPassword - Stored hash in format: salt:hash
 * @returns {boolean} True if password matches
 */
function verifyPassword(password, hashedPassword) {
  if (!password || !hashedPassword) return false;
  
  try {
    const parts = hashedPassword.split(':');
    if (parts.length !== 2) return false;
    
    const salt = parts[0];
    const originalHash = parts[1];
    
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha256').toString('hex');
    
    return hash === originalHash;
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

module.exports = {
  encrypt,
  decrypt,
  hashPassword,
  verifyPassword
};
