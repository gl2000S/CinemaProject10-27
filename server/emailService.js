const nodemailer = require('nodemailer');

// Email configuration
// For development, we'll use a test account from Ethereal (creates a fake SMTP account)
// For production, you'd use a real email service like Gmail, SendGrid, AWS SES, etc.

let transporter = null;

// Initialize the email transporter
async function initializeEmailService() {
  try {
    // Check if we have environment variables for a real email service
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Production email configuration
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      console.log('Email service initialized with production settings');
    } else {
      // Development: Create a test account on Ethereal
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('=== EMAIL SERVICE (DEVELOPMENT MODE) ===');
      console.log('Using Ethereal test account:');
      console.log('User:', testAccount.user);
      console.log('Preview emails at: https://ethereal.email');
      console.log('========================================');
    }
    
    return true;
  } catch (error) {
    console.error('Failed to initialize email service:', error);
    return false;
  }
}

// Send registration confirmation email
async function sendRegistrationEmail(userEmail, userName) {
  if (!transporter) {
    console.error('Email transporter not initialized');
    return { success: false, error: 'Email service not available' };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Cinema E-Booking" <noreply@cinemaebooking.com>',
      to: userEmail,
      subject: 'Welcome to Cinema E-Booking! 🎬',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #0a0a0a;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #1a1a1a;
              border-radius: 8px;
              overflow: hidden;
            }
            .header {
              background-color: #E50914;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              color: #ffffff;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #E50914;
              font-size: 24px;
              margin-top: 0;
            }
            .content p {
              line-height: 1.6;
              color: rgba(255, 255, 255, 0.9);
              font-size: 16px;
            }
            .features {
              background-color: rgba(255, 255, 255, 0.05);
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .features ul {
              list-style: none;
              padding: 0;
              margin: 0;
            }
            .features li {
              padding: 8px 0;
              color: rgba(255, 255, 255, 0.8);
            }
            .features li:before {
              content: "✓ ";
              color: #E50914;
              font-weight: bold;
              margin-right: 8px;
            }
            .cta-button {
              display: inline-block;
              background-color: #E50914;
              color: #ffffff;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .footer {
              background-color: #0a0a0a;
              padding: 20px;
              text-align: center;
              color: rgba(255, 255, 255, 0.5);
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 Cinema E-Booking</h1>
            </div>
            <div class="content">
              <h2>Welcome, ${userName}! 🎉</h2>
              <p>Thank you for registering with Cinema E-Booking. Your account has been successfully created!</p>
              
              <div class="features">
                <p style="margin-top: 0; font-weight: bold; color: #E50914;">You can now enjoy:</p>
                <ul>
                  <li>Browse the latest movies and showtimes</li>
                  <li>Book tickets online with ease</li>
                  <li>Save your payment information securely</li>
                  <li>Receive exclusive promotional offers</li>
                  <li>Manage your bookings and profile</li>
                </ul>
              </div>
              
              <p>Start exploring our current movies and upcoming releases. Book your tickets today and enjoy the ultimate cinema experience!</p>
              
              <center>
                <a href="${process.env.APP_URL || 'http://localhost:3000'}" class="cta-button">Start Booking Now</a>
              </center>
              
              <p style="margin-top: 30px; font-size: 14px; color: rgba(255, 255, 255, 0.6);">
                <strong>Your Account Details:</strong><br>
                Email: ${userEmail}
              </p>
            </div>
            <div class="footer">
              <p>© 2025 Cinema E-Booking. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Welcome to Cinema E-Booking, ${userName}!

Thank you for registering with Cinema E-Booking. Your account has been successfully created!

You can now enjoy:
✓ Browse the latest movies and showtimes
✓ Book tickets online with ease
✓ Save your payment information securely
✓ Receive exclusive promotional offers
✓ Manage your bookings and profile

Start exploring our current movies and upcoming releases. Book your tickets today!

Your Account Details:
Email: ${userEmail}

Visit us at: ${process.env.APP_URL || 'http://localhost:3000'}

© 2025 Cinema E-Booking. All rights reserved.
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✓ Registration email sent to:', userEmail);
    
    // If using Ethereal (development), provide preview URL
    if (nodemailer.getTestMessageUrl(info)) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('📧 Preview email at:', previewUrl);
      return { success: true, previewUrl };
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending registration email:', error);
    return { success: false, error: error.message };
  }
}

// Send promotional email (for future use)
async function sendPromotionalEmail(userEmail, userName, promoDetails) {
  if (!transporter) {
    console.error('Email transporter not initialized');
    return { success: false, error: 'Email service not available' };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Cinema E-Booking" <promotions@cinemaebooking.com>',
      to: userEmail,
      subject: `${promoDetails.title || 'Special Offer'} 🎟️`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #1a1a1a; }
            .header { background-color: #E50914; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .promo-code { background-color: rgba(229, 9, 20, 0.2); border: 2px dashed #E50914; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .promo-code .code { font-size: 32px; font-weight: bold; color: #E50914; letter-spacing: 4px; }
            .footer { background-color: #0a0a0a; padding: 20px; text-align: center; color: rgba(255, 255, 255, 0.5); font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header"><h1>🎬 Special Offer!</h1></div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>${promoDetails.message || 'We have a special offer just for you!'}</p>
              ${promoDetails.code ? `
                <div class="promo-code">
                  <p style="margin: 0 0 10px 0;">Use promo code:</p>
                  <div class="code">${promoDetails.code}</div>
                  <p style="margin: 10px 0 0 0; font-size: 14px;">Save ${promoDetails.discount || '20'}%!</p>
                </div>
              ` : ''}
              <p>Don't miss out on this amazing deal. Book your tickets today!</p>
            </div>
            <div class="footer">
              <p>© 2025 Cinema E-Booking</p>
              <p><a href="${process.env.APP_URL || 'http://localhost:3000'}/profile" style="color: #E50914;">Unsubscribe from promotional emails</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Promotional email sent to:', userEmail);
    
    if (nodemailer.getTestMessageUrl(info)) {
      return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending promotional email:', error);
    return { success: false, error: error.message };
  }
}

// Send password recovery email with plaintext password
// NOTE: This is for demo purposes only. In production, use password reset tokens instead.
async function sendPasswordRecoveryEmail(userEmail, userName, password) {
  if (!transporter) {
    console.error('Email transporter not initialized');
    return { success: false, error: 'Email service not available' };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Cinema E-Booking" <noreply@cinemaebooking.com>',
      to: userEmail,
      subject: 'Password Recovery - Cinema E-Booking 🔐',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #0a0a0a;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #1a1a1a;
              border-radius: 8px;
              overflow: hidden;
            }
            .header {
              background-color: #E50914;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 32px;
              color: #ffffff;
            }
            .content {
              padding: 40px 30px;
            }
            .content h2 {
              color: #E50914;
              font-size: 24px;
              margin-top: 0;
            }
            .content p {
              line-height: 1.6;
              color: rgba(255, 255, 255, 0.9);
              font-size: 16px;
            }
            .password-box {
              background-color: rgba(229, 9, 20, 0.15);
              border: 2px solid #E50914;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              text-align: center;
            }
            .password-box .label {
              font-size: 14px;
              color: rgba(255, 255, 255, 0.7);
              margin-bottom: 10px;
            }
            .password-box .password {
              font-size: 24px;
              font-weight: bold;
              color: #ffffff;
              letter-spacing: 2px;
              font-family: 'Courier New', monospace;
              background-color: rgba(0, 0, 0, 0.3);
              padding: 15px 20px;
              border-radius: 4px;
              display: inline-block;
            }
            .warning-box {
              background-color: rgba(255, 152, 0, 0.1);
              border-left: 4px solid #FF9800;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .warning-box p {
              margin: 0;
              color: rgba(255, 255, 255, 0.8);
              font-size: 14px;
            }
            .cta-button {
              display: inline-block;
              background-color: #E50914;
              color: #ffffff;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 4px;
              font-weight: bold;
              margin: 20px 0;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            .footer {
              background-color: #0a0a0a;
              padding: 20px;
              text-align: center;
              color: rgba(255, 255, 255, 0.5);
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Recovery</h1>
            </div>
            <div class="content">
              <h2>Hello ${userName}!</h2>
              <p>We received a request to retrieve your password for your Cinema E-Booking account.</p>
              
              <div class="password-box">
                <div class="label">Your Password:</div>
                <div class="password">${password}</div>
              </div>

              <div class="warning-box">
                <p><strong>⚠️ Security Note:</strong> We recommend changing your password after logging in. You can do this from your profile settings.</p>
              </div>

              <p style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:3000'}/login" class="cta-button">Login Now</a>
              </p>

              <p style="font-size: 14px; color: rgba(255, 255, 255, 0.6);">
                If you didn't request this password recovery, please ignore this email and ensure your account is secure.
              </p>
            </div>
            <div class="footer">
              <p>Cinema E-Booking System</p>
              <p>© 2025 Cinema E-Booking. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Password Recovery - Cinema E-Booking

Hello ${userName}!

We received a request to retrieve your password for your Cinema E-Booking account.

Your Password: ${password}

⚠️ Security Note: We recommend changing your password after logging in.

Login at: ${process.env.APP_URL || 'http://localhost:3000'}/login

If you didn't request this password recovery, please ignore this email.

© 2025 Cinema E-Booking. All rights reserved.
      `.trim(),
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✓ Password recovery email sent to:', userEmail);
    
    // If using Ethereal (development), provide preview URL
    if (nodemailer.getTestMessageUrl(info)) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('📧 Preview email at:', previewUrl);
      return { success: true, previewUrl };
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password recovery email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  initializeEmailService,
  sendRegistrationEmail,
  sendPromotionalEmail,
  sendPasswordRecoveryEmail,
};
