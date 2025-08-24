import axios from '../axios.js';
import toastService from './toastService.js';

class ReferralService {
  // Get user's referral code
  async getReferralCode() {
    try {
      const response = await axios.get('/user/referral-code');
      return response.data;
    } catch (error) {
      console.error('Error fetching referral code:', error);
      throw error;
    }
  }

  // Get referral statistics
  // async getReferralStats() {
  //   try {
  //     const response = await axios.get('/user/referral-stats');
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching referral stats:', error);
  //     throw error;
  //   }
  // }

  // Get referral history
  // async getReferralHistory() {
  //   try {
  //     const response = await axios.get('/user/referral-history');
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching referral history:', error);
  //     throw error;
  //   }
  // }

  // Apply referral code
  async applyReferralCode(referralCode) {
    try {
      const response = await axios.post('/user/apply-referral', {
        referralCode: referralCode.trim()
      });
      return response.data;
    } catch (error) {
      console.error('Error applying referral code:', error);
      throw error;
    }
  }

  // Check referral status
  async getReferralStatus() {
    try {
      const response = await axios.get('/user/referral-status');
      return response.data;
    } catch (error) {
      console.error('Error checking referral status:', error);
      throw error;
    }
  }

  // Generate referral code (fallback)
  generateReferralCode() {
    const user = JSON.parse(localStorage.getItem('user'));
    const baseCode = user?.name?.toUpperCase().replace(/\s+/g, '') || 'USER';
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${baseCode}${randomSuffix}`;
  }

  // Copy referral code to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      toastService.success('Referral code copied to clipboard!');
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toastService.success('Referral code copied to clipboard!');
      return true;
    }
  }

  // Share referral code via WhatsApp
  shareOnWhatsApp(referralCode) {
    const message = `Join Mintiss using my referral code: ${referralCode}\n\nGet amazing rewards and start earning with me! 🎉\n\nSign up here: ${window.location.origin}/signup?ref=${referralCode}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // Share referral code via Telegram
  shareOnTelegram(referralCode) {
    const message = `Join Mintiss using my referral code: ${referralCode}\n\nGet amazing rewards and start earning with me! 🎉\n\nSign up here: ${window.location.origin}/signup?ref=${referralCode}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  // Share referral code via Email
  shareOnEmail(referralCode) {
    const user = JSON.parse(localStorage.getItem('user'));
    const subject = 'Join Mintiss with my referral code!';
    const body = `Hi there!\n\nI'm using Mintiss and loving it! You should join too using my referral code: ${referralCode}\n\nGet amazing rewards and start earning with me! 🎉\n\nSign up here: ${window.location.origin}/signup?ref=${referralCode}\n\nBest regards,\n${user?.name || 'Your Friend'}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
  }

  // Get demo referral data (for testing)
  getDemoReferralData() {
    return {
      referralCode: this.generateReferralCode(),
      stats: {
        totalReferrals: 5,
        activeReferrals: 3,
        pendingReferrals: 2,
        thisMonth: 1,
        totalEarnings: 250
      },
      history: [
        {
          id: 1,
          friendName: 'John Doe',
          friendEmail: 'john@example.com',
          status: 'active',
          joinedDate: '2024-01-15',
          earnings: 50
        },
        {
          id: 2,
          friendName: 'Jane Smith',
          friendEmail: 'jane@example.com',
          status: 'pending',
          joinedDate: '2024-01-20',
          earnings: 0
        },
        {
          id: 3,
          friendName: 'Mike Johnson',
          friendEmail: 'mike@example.com',
          status: 'active',
          joinedDate: '2024-01-10',
          earnings: 75
        }
      ]
    };
  }

  // Format date for display
  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Validate referral code format
  validateReferralCode(code) {
    if (!code || typeof code !== 'string') {
      return false;
    }
    
    // Basic validation: alphanumeric, 6-12 characters
    const regex = /^[A-Z0-9]{6,12}$/;
    return regex.test(code.trim().toUpperCase());
  }

  // Get referral rewards info
  getReferralRewards() {
    return {
      referrerBonus: 100, // Amount referrer gets when someone uses their code
      refereeBonus: 100,  // Amount referee gets when using someone's code
      minPurchase: 500,   // Minimum purchase amount to qualify for bonus
      maxReferrals: 50    // Maximum number of referrals per user
    };
  }
}

export default new ReferralService();
