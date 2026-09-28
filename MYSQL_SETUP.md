# MySQL Database Setup Guide

## Option 1: Quick Setup with Chocolatey (Recommended for Windows)

1. **Install MySQL using Chocolatey**:
   ```powershell
   choco install mysql -y
   ```

2. **Start MySQL Service**:
   ```powershell
   net start MySQL
   ```

3. **Set root password** (if prompted during installation, use a simple password like 'root' for development)

## Option 2: Manual Installation

1. **Download MySQL Installer**:
   - Go to: https://dev.mysql.com/downloads/installer/
   - Download "MySQL Installer for Windows"
   - Choose "Windows (x86, 32-bit), MSI Installer" (smaller download)

2. **Install MySQL**:
   - Run the installer
   - Choose "Developer Default" or "Server only"
   - Follow the installation wizard
   - Set root password (remember this!)
   - Start MySQL as a Windows Service

3. **Verify Installation**:
   ```powershell
   mysql --version
   ```

## After MySQL is Installed

### Step 1: Run Database Setup Script
```powershell
cd e:\CinemaProject\server
npm run setup-db
```

This will:
- Create the 'cinema' database
- Create all tables (users, movies, showtimes, promotions)
- Insert default data (admin user, sample movies)

### Step 2: Start the Server
```powershell
npm start
```

The server should now connect to MySQL instead of using mock data!

## Troubleshooting

### Error: Access Denied
- Check your .env file credentials
- Make sure MySQL root password matches
- Try connecting with: `mysql -u root -p`

### Error: Connection Refused
- Make sure MySQL service is running: `net start MySQL`
- Check if MySQL is listening on port 3306: `netstat -an | findstr 3306`

### Want to Use Different Credentials?
Edit `server/.env`:
```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_root_password
MYSQL_DB=cinema
```

Then run: `npm run setup-db`

## Alternative: Use MySQL Root User

If you want to use root user instead of creating 'cinema_user':

1. Edit `server/.env`:
   ```
   MYSQL_USER=root
   MYSQL_PASSWORD=your_root_password
   ```

2. Run setup:
   ```powershell
   npm run setup-db
   ```

## Verify Database

To check if everything is set up correctly:

```powershell
mysql -u root -p
```

Then in MySQL prompt:
```sql
USE cinema;
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM movies;
```

You should see your tables with data!
