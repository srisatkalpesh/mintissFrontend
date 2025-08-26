import axios from '@/axios';

class GoogleAuthService {
    constructor() {
        this.googleAuth = null;
        this.isInitialized = false;
        // Use a unique key to store the referral code
        this.referralStorageKey = 'googleAuthReferralCode';
    }

    // Redirect to Google OAuth (this will redirect to your Laravel backend)
    redirectToGoogle() {
        const baseURL = process.env.VUE_APP_API_BASE_URL;

        // Get referral code from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');

        // Store the referral code in localStorage before redirecting
        if (referralCode) {
            localStorage.setItem(this.referralStorageKey, referralCode);
        } else {
            // Clear the old referral code if none is present on this redirect
            localStorage.removeItem(this.referralStorageKey);
        }

        // Add referral code to the redirect URL if present
        let redirectUrl = `${baseURL}/auth/google`;
        if (referralCode) {
            redirectUrl += `?ref=${encodeURIComponent(referralCode)}`;
        }

        window.location.href = redirectUrl;
    }

    // Handle callback from Laravel backend after Google OAuth
    async handleRedirectCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            // Clear stored referral code on error
            localStorage.removeItem(this.referralStorageKey);
            throw new Error(`Google authentication error: ${error}`);
        }

        if (code) {
            try {
                const baseURL = process.env.VUE_APP_API_BASE_URL;

                // Retrieve the referral code from localStorage
                const storedReferralCode = localStorage.getItem(this.referralStorageKey);
                const callbackData = {
                    code: code,
                };

                // Add stored referral code to the payload if present
                if (storedReferralCode) {
                    callbackData.referral_code = storedReferralCode;
                }

                console.log("callbackData with referralCode:", callbackData);

                const response = await axios.post(`${baseURL}/auth/google/callback`, callbackData);

                const { user, token } = response.data;

                // Clear the stored referral code after a successful callback
                localStorage.removeItem(this.referralStorageKey);

                // Store user and token
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);

                // Redirect based on user type
                if (user.role === 'admin' || user.type === 'admin' || user.role === 'Admin' || user.type === 'Admin') {
                    window.location.href = '/admin/categories';
                } else if (user.role === 'Seller' || user.type === 'Seller' || user.role === 'seller' || user.type === 'seller') {
                    window.location.href = '/seller/dashboard';
                } else {
                    window.location.href = '/';
                }

            } catch (error) {
                console.error('Google authentication error:', error);
                // Clear stored referral code on error
                localStorage.removeItem(this.referralStorageKey);
                throw error;
            }
        } else {
            // Clear stored referral code if no code is received
            localStorage.removeItem(this.referralStorageKey);
            throw new Error('No authorization code received from Google');
        }
    }

    // Alternative method using Google Identity Services (for popup flow)
    // This part of the code already works, but we'll add the localStorage fix here for consistency
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

        // Before initiating the login, store the referral code
        const urlParams = new URLSearchParams(window.location.search);
        const referralCode = urlParams.get('ref');
        if (referralCode) {
            localStorage.setItem(this.referralStorageKey, referralCode);
        } else {
            localStorage.removeItem(this.referralStorageKey);
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
            const callbackData = {
                access_token: response.access_token,
                user_info: userInfo
            };

            // Retrieve the referral code from localStorage
            const storedReferralCode = localStorage.getItem(this.referralStorageKey);

            // Add stored referral code if present
            if (storedReferralCode) {
                callbackData.referral_code = storedReferralCode;
            }

            console.log("callbackData with referralCode:", callbackData);

            const backendResponse = await axios.post(`${baseURL}/auth/google/callback`, callbackData);

            const { user, token } = backendResponse.data;

            // Clear the stored referral code after a successful callback
            localStorage.removeItem(this.referralStorageKey);

            // Store user and token
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            // Redirect based on user type
            if (user.role === 'admin' || user.type === 'admin' || user.role === 'Admin' || user.type === 'Admin') {
                window.location.href = '/admin/categories';
            } else if (user.role === 'Seller' || user.type === 'Seller' || user.role === 'seller' || user.type === 'seller') {
                window.location.href = '/seller/dashboard';
            } else {
                window.location.href = '/';
            }

        } catch (error) {
            console.error('Google authentication error:', error);
            // Clear stored referral code on error
            localStorage.removeItem(this.referralStorageKey);
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