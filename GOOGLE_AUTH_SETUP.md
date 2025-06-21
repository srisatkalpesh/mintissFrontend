# Google OAuth Authentication Setup

This guide will help you set up Google OAuth authentication for your Vue.js frontend application.

## Prerequisites

1. A Google Cloud Console account
2. Your Laravel backend with Google OAuth routes configured
3. Vue.js frontend application

## Setup Steps

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized origins:
     - `http://localhost:8080` (for development)
     - Your production domain
   - Add authorized redirect URIs:
     - `http://localhost:8080/auth/google/callback` (for development)
     - Your production callback URL
5. Copy the Client ID

### 2. Environment Variables

Create a `.env` file in your Vue.js project root and add:

```env
VUE_APP_API_BASE_URL=http://localhost:8000/api
VUE_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

Replace `your_google_client_id_here` with the Client ID from Google Cloud Console.

### 3. Laravel Backend Configuration

Make sure your Laravel backend has the following routes configured:

```php
Route::get('/auth/google', [GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
```

### 4. Testing the Integration

1. Start your Laravel backend server
2. Start your Vue.js development server: `npm run serve`
3. Navigate to `/login` or `/signup`
4. Click the "Continue with Google" button
5. Complete the Google OAuth flow

## Features Added

- Google login button on the login page
- Google signup button on the signup page
- Google OAuth callback handling
- Automatic user creation/login via Google
- Proper error handling and loading states
- Responsive design with Bootstrap styling

## Files Modified/Created

- `src/services/googleAuthService.js` - Google authentication service
- `src/views/usersite/Login.vue` - Added Google login button
- `src/views/usersite/UserSignup.vue` - Added Google signup button
- `src/views/usersite/GoogleCallback.vue` - OAuth callback handler
- `src/router/index.js` - Added Google callback route

## Troubleshooting

1. **"Invalid redirect URI" error**: Make sure your redirect URI in Google Cloud Console matches exactly
2. **CORS errors**: Ensure your Laravel backend allows requests from your frontend domain
3. **"Client ID not found"**: Verify your `VUE_APP_GOOGLE_CLIENT_ID` environment variable is set correctly
4. **Callback not working**: Check that the callback route is properly configured in your router

## Security Notes

- Never expose your Google Client Secret in the frontend
- Always use HTTPS in production
- Implement proper CSRF protection on your backend
- Validate all OAuth tokens on the server side 