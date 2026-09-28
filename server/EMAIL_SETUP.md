# Email Setup Guide

## Current Status
✅ Email functionality is **WORKING** and sends automatically on user registration!

Currently using **Ethereal** (test email service) for development. Emails are being sent, but to a test inbox instead of real email addresses.

## How to Send to Real Email Addresses

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Step Verification** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)" → Type "Cinema Booking"
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `xxxx xxxx xxxx xxxx`)

3. **Update `.env` file**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=xxxx-xxxx-xxxx-xxxx  # The 16-char app password
   EMAIL_FROM="Cinema E-Booking <your-gmail@gmail.com>"
   APP_URL=http://localhost:3000
   ```

4. **Restart the server**:
   - The server will detect the Gmail settings and use real email instead of Ethereal

### Option 2: SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com (free tier: 100 emails/day)
2. Create an API key
3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key
   EMAIL_FROM="Cinema E-Booking <noreply@cinema.com>"
   APP_URL=http://localhost:3000
   ```

### Option 3: Keep Using Ethereal (Development Only)

- No setup needed!
- Emails are being sent and you can preview them
- When you see `✓ Registration email sent` in console, copy the preview URL
- Open the URL in browser to see the email
- Example: https://ethereal.email/message/...

## Testing

1. Register a new account on http://localhost:3000
2. Check the server console for:
   ```
   ✓ Registration email sent to: user@example.com
   ```
3. **With Gmail**: Check the inbox of the email you registered with
4. **With Ethereal**: Click the preview URL shown in console

## Email Features

Current emails automatically include:
- ✅ Welcome message with user's name
- ✅ Beautiful HTML design matching cinema branding
- ✅ List of features (booking, payments, promotions)
- ✅ Call-to-action button
- ✅ User's account details
- ✅ Responsive design for mobile/desktop

## Troubleshooting

### "Email service not available"
- Make sure the server restarted after adding `.env` variables
- Check that credentials are correct

### Gmail: "Username and Password not accepted"
- Make sure you're using an **App Password**, not your regular Gmail password
- App passwords are 16 characters with no spaces
- 2-Step Verification must be enabled first

### Still getting Ethereal preview URLs?
- The `.env` variables must be uncommented (remove the `#`)
- Restart the server completely
- Check server console for "Email service initialized with production settings"

## Current Behavior

When a user registers:
1. Account is created in database
2. Password is hashed for security
3. **Email is sent automatically** ← This is working!
4. User sees confirmation page
5. Email arrives in inbox (or preview URL in console)

The email system is fully automated and non-blocking - even if email fails, registration still succeeds.
