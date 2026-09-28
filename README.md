# Cinema E-Booking — Full Project (MySQL + React)

## Quick Start

### Start Both Servers (PowerShell)

**Backend Server (Terminal 1):**
```powershell
cd server
node index.js
```
Server runs on: http://localhost:4000

**Frontend Client (Terminal 2):**
```powershell
cd client
npm start
```
UI runs on: http://localhost:3000

### Restart Everything (PowerShell)
```powershell
# Kill all node processes and restart
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Terminal 1 - Start backend
cd server
node index.js

# Terminal 2 - Start frontend (in separate terminal)
cd client
npm start
```

## Initial Setup

### Server Setup
```bash
cd server
npm install
# Copy environment variables
cp .env.example .env
# Optional: Setup MySQL database
mysql -u cinema_user -p cinema < schema.sql
```

### Client Setup
```bash
cd client
npm install
```

## Email Configuration

The system automatically sends registration confirmation emails!

- **Development Mode**: Uses Ethereal (test email service)
  - Emails are sent and preview URLs appear in server console
  - Click the preview link to see the email
  
- **Production Mode**: Configure real email in `server/.env`
  - See `server/EMAIL_SETUP.md` for detailed instructions
  - Supports Gmail, SendGrid, and other SMTP services

## Admin Login
```
Email: admin@example.com 
Password: admin123
```

## Features

- ✅ User Registration & Login with encryption
- ✅ Email confirmation on registration
- ✅ Movie browsing and showtimes
- ✅ Multi-ticket booking system
- ✅ Promotion codes (e.g., FALL20 for 20% off)
- ✅ Secure payment information storage
- ✅ Real-time password validation
- ✅ Promotional email subscription management
- ✅ Admin dashboard (movies, showtimes, promotions)

## Tech Stack

**Frontend:**
- React 18.2.0
- React Router DOM 6.26.2
- Inline styled components

**Backend:**
- Node.js / Express
- MySQL2 with fallback to mock storage
- Nodemailer for email services
- Custom encryption module (AES-256-CBC, PBKDF2)

## Ports

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Troubleshooting

**Port already in use:**
```powershell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

**Server not responding:**
- Make sure backend (port 4000) is running first
- Then start frontend (port 3000)
- Frontend proxies API requests to backend

**Email not sending:**
- Check server console for email preview URLs
- See `server/EMAIL_SETUP.md` for configuration

## Connecting to database
```powershell
cd server
mysql -u cinema_user -p cinema
password: cinema_pass
```

## View All Tables
```
SHOW TABLES;
SELECT * FROM .....;
```