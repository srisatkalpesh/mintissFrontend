<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card shadow-lg border-0 rounded-4">
                    <div class="card-body p-4">
                        <!-- Referral Code Section -->
                        <div class="row mb-4">
                            <div class="col-lg-8">
                                <div class="card border-0 bg-light">
                                    <div class="card-body p-4">
                                        <h5 class="fw-bold mb-3">
                                            <i class="bi bi-share me-2 text-primary"></i>
                                            Your Referral Code
                                        </h5>
                                        <div class="input-group mb-3">
                                            <input type="text" class="form-control form-control-lg fw-bold text-center"
                                                :value="referralCode" readonly>
                                            <button class="btn btn-primary btn-lg" type="button"
                                                @click="copyReferralCode" :class="{ 'btn-success': copySuccess }">
                                                <i :class="copySuccess ? 'bi bi-check-lg' : 'bi bi-clipboard'"
                                                    class="me-2"></i>
                                                {{ copySuccess ? 'Copied!' : 'Copy' }}
                                            </button>
                                        </div>
                                        <div class="d-flex flex-wrap gap-2">
                                            <button class="btn btn-outline-primary btn-sm" @click="shareOnWhatsApp">
                                                <i class="bi bi-whatsapp me-1"></i> WhatsApp
                                            </button>
                                            <button class="btn btn-outline-primary btn-sm" @click="shareOnTelegram">
                                                <i class="bi bi-telegram me-1"></i> Telegram
                                            </button>
                                            <button class="btn btn-outline-primary btn-sm" @click="shareOnEmail">
                                                <i class="bi bi-envelope me-1"></i> Email
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- How It Works -->
                        <div class="mt-4">
                            <h5 class="fw-bold mb-3">
                                <i class="bi bi-question-circle me-2 text-primary"></i>
                                How It Works
                            </h5>
                            <div class="row g-3">
                                <div class="col-md-4" v-for="(step, index) in steps" :key="index">
                                    <div class="card border-0 bg-light h-100">
                                        <div class="card-body text-center p-3">
                                            <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                                                style="width: 50px; height: 50px;">
                                                <span class="fw-bold">{{ index + 1 }}</span>
                                            </div>
                                            <h6 class="fw-bold">{{ step.title }}</h6>
                                            <p class="small text-muted mb-0">{{ step.description }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import referralService from '@/services/referralService';
import toastService from '@/services/toastService';

export default {
    name: 'Referral',
    data() {
        return {
            referralCode: '',
            copySuccess: false,
            steps: [
                { title: 'Share Your Code', description: 'Share your unique referral code with friends and family' },
                { title: 'They Join', description: 'Your friends sign up using your referral code' },
                { title: 'Earn Rewards', description: 'Both you and your friend get rewards when they make their first purchase' }
            ]
        };
    },
    async mounted() {
        await this.fetchReferralData();
    },
    methods: {
        async fetchReferralData() {
            try {
                const codeResponse = await referralService.getReferralCode();
                this.referralCode = codeResponse.referral_code || codeResponse.referralCode || referralService.generateReferralCode();
            } catch (error) {
                const demoData = referralService.getDemoReferralData();
                this.referralCode = demoData.referralCode;
            }
        },
        async copyReferralCode() {
            try {
                await referralService.copyToClipboard(this.referralCode);
                this.copySuccess = true;
                setTimeout(() => { this.copySuccess = false; }, 2000);
            } catch (error) {
                toastService.error('Failed to copy referral code');
            }
        },
        shareOnWhatsApp() {
            referralService.shareOnWhatsApp(this.referralCode);
        },
        shareOnTelegram() {
            referralService.shareOnTelegram(this.referralCode);
        },
        shareOnEmail() {
            referralService.shareOnEmail(this.referralCode);
        }
    }
};
</script>

<style scoped>
.card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}
</style>
