# Email Service Setup (Resend Integration)

## Overview
The Pulih Klinik backend now includes Resend email integration for sending verification emails during user registration.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@pulih-klinik.id
RESEND_FROM_NAME=Pulih Klinik

# Development Email Configuration (optional)
DEV_EMAIL_ENABLED=true
DEV_EMAIL_RECIPIENT=your-test-email@example.com
```

## Configuration Details

- **RESEND_API_KEY**: Your Resend API key (get from https://resend.com)
- **RESEND_FROM_EMAIL**: The email address that will appear as the sender
- **RESEND_FROM_NAME**: The display name for the sender
- **DEV_EMAIL_ENABLED**: Enable development email redirection (true/false)
- **DEV_EMAIL_RECIPIENT**: Email address to receive all development emails

## How It Works

1. **Registration Process**: When a user registers, a verification code is generated
2. **Email Sending**: The system attempts to send the verification email via Resend
3. **Fallback**: If Resend is not configured or fails, the system falls back to console logging
4. **Error Handling**: Email sending errors are logged but don't break the registration process

## Development Mode

### Option 1: Console Logging (Default)
When `RESEND_API_KEY` is not set, the system will:
- Log verification codes to the console
- Continue with the registration process
- Allow testing without actual email sending

### Option 2: Resend with Email Redirection
For testing actual email functionality in development:
1. Set up Resend with your API key
2. Enable development email redirection:
   ```env
   RESEND_API_KEY=your_resend_api_key_here
   DEV_EMAIL_ENABLED=true
   DEV_EMAIL_RECIPIENT=your-test-email@example.com
   ```
3. All emails will be redirected to your test email address
4. You can test the full email flow without sending emails to real users

### Option 3: Full Resend (Production-like)
For production-like testing:
1. Set up Resend with your API key
2. Use your actual domain and email addresses
3. Test with real email addresses (be careful not to spam)

## Resend Setup for Development

### Quick Start with Resend
1. **Sign up**: Go to https://resend.com and create a free account
2. **Get API Key**: Copy your API key from the dashboard
3. **Use Test Domain**: Resend provides a test domain `resend.dev` for development
4. **Configure Environment**:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=onboarding@resend.dev
   RESEND_FROM_NAME=Pulih Klinik Dev
   DEV_EMAIL_ENABLED=true
   DEV_EMAIL_RECIPIENT=your-email@example.com
   ```

### Resend Free Tier Limits
- 3,000 emails per month
- 100 emails per day
- Perfect for development and testing

## Production Setup

1. Sign up for a Resend account at https://resend.com
2. Get your API key from the Resend dashboard
3. Set up your domain and verify it with Resend
4. Add the environment variables to your production environment
5. Test the email sending functionality

## Email Template

The verification email includes:
- Professional Pulih Klinik branding
- Clear verification code display
- Instructions for the user
- Security notice
- Responsive design for mobile devices

## Testing

To test email functionality:
1. Set up Resend with a valid API key
2. Register a new user
3. Check the email inbox for the verification code
4. Verify the code in the registration flow

## Troubleshooting

- **No emails received**: Check if `RESEND_API_KEY` is set correctly
- **API errors**: Verify your Resend account status and API key validity
- **Domain issues**: Ensure your sending domain is verified in Resend
- **Rate limits**: Resend has rate limits; check your usage in the dashboard
