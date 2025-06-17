<template>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-lg border-0 rounded-4">
                    <div class="card-header bg-primary text-white rounded-top-4 p-4">
                        <h2 class="mb-0 fs-3">Profile Information</h2>
                    </div>
                    <div class="card-body p-4">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Name</label>
                                    <p class="form-control bg-light">{{ user.name }}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Email</label>
                                    <p class="form-control bg-light">{{ user.email }}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Phone</label>
                                    <p class="form-control bg-light">{{ user.phone }}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Role</label>
                                    <p class="form-control bg-light">{{ user.role }}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Mintiss Balance</label>
                                    <p class="form-control bg-light">{{ user.mintiss }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-4">
                            <button class="btn btn-danger px-4 py-2" @click="handleLogout">
                                <i class="bi bi-box-arrow-right me-2"></i>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/axios';
import toastService from '@/services/toastService';

export default {
    name: 'Profile',
    data() {
        return {
            user: JSON.parse(localStorage.getItem('user')) || {}
        }
    },
    methods: {
        async handleLogout() {
            try {
                await axios.get('/logout');
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Show success message
                toastService.success('Logged out successfully');
                // Redirect to home page with full refresh
                window.location.href = '/';
            } catch (error) {
                console.error('Logout error:', error);
                toastService.error('Failed to logout');
            }
        }
    }
}
</script>

<style scoped>
.form-control {
    border: none;
    padding: 0.75rem;
}

.btn-danger {
    background-color: #dc3545;
    border: none;
    transition: all 0.3s ease;
}

.btn-danger:hover {
    background-color: #bb2d3b;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(220, 53, 69, 0.2);
}
</style> 