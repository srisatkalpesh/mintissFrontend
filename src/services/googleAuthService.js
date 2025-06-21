import axios from '@/axios';

class GoogleAuthService {
    constructor() {
        this.googleAuth = null;
        this.isInitialized = false;
    }

    // Redirect to Google OAuth (this will redirect to your Laravel backend)
    redirectToGoogle() {
        const baseURL = process.env.VUE_APP_API_BASE_URL;
        window.location.href = `${baseURL}/auth/google`;
    }

    // Handle callback from Laravel backend after Google OAuth
    async handleRedirectCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            throw new Error(`Google authentication error: ${error}`);
        }

        if (code) {
            try {
                const baseURL = process.env.VUE_APP_API_BASE_URL;
                console.log("code", baseURL);
                const response = await axios.post(`${baseURL}/auth/google/callback`, {
                    code: code
                });

                const { user, token } = response.data;

                // Store user and token
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);

                // Redirect based on user type
                if (user.role === 'admin' || user.type === 'admin') {
                    window.location.href = '/admin/categories';
                } else {
                    window.location.href = '/';
                }

            } catch (error) {
                console.error('Google authentication error:', error);
                throw error;
            }
        } else {
            throw new Error('No authorization code received from Google');
        }
    }

    // Alternative method using Google Identity Services (for popup flow)
    async initialize() {
        if (this.isInitialized) return;

        return new Promise((resolve, reject) => {
            // Load Google Identity Services script
            if (window.google) {
                this.setupGoogleAuth();
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => {
                this.setupGoogleAuth();
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    setupGoogleAuth() {
        if (!window.google) return;

        this.googleAuth = window.google.accounts.oauth2.initTokenClient({
            client_id: process.env.VUE_APP_GOOGLE_CLIENT_ID,
            scope: 'email profile',
            callback: (response) => {
                this.handleGoogleCallback(response);
            },
        });

        this.isInitialized = true;
    }

    async login() {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (this.googleAuth) {
            this.googleAuth.requestAccessToken();
        }
    }

    async handleGoogleCallback(response) {
        try {
            // Get user info from Google
            const userInfo = await this.getGoogleUserInfo(response.access_token);
            
            // Send to your Laravel backend
            const baseURL = process.env.VUE_APP_API_BASE_URL;
            const backendResponse = await axios.post(`${baseURL}/auth/google/callback`, {
                access_token: response.access_token,
                user_info: userInfo
            });

            const { user, token } = backendResponse.data;

            // Store user and token
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            // Redirect based on user type
            if (user.role === 'admin' || user.type === 'admin') {
                window.location.href = '/admin/categories';
            } else {
                window.location.href = '/';
            }

        } catch (error) {
            console.error('Google authentication error:', error);
            // You can emit an event or use a callback to handle errors
            if (window.googleAuthError) {
                window.googleAuthError(error);
            }
        }
    }

    async getGoogleUserInfo(accessToken) {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Error fetching Google user info:', error);
            throw error;
        }
    }
}

export default new GoogleAuthService(); 