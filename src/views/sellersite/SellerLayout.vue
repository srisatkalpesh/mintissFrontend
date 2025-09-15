<template>
    <div class="seller-layout">
        <!-- Mobile Toggle Button -->
        <button class="btn btn-primary d-md-none sidebar-toggle" @click="toggleSidebar">
            <i class="bi bi-list"></i>
        </button>

        <!-- Sidebar -->
        <div class="sidebar" :class="{ 'show': isSidebarOpen }">
            <div class="sidebar-header">
                <div class="brand-section">
                    <div class="brand-logo">
                        <i class="bi bi-shop"></i>
                    </div>
                    <div class="brand-info">
                        <h5 class="brand-title">Seller Panel</h5>
                        <p class="brand-subtitle">Manage Your Store</p>
                    </div>
                </div>
                <button class="btn btn-close d-md-none" @click="toggleSidebar">
                    <i class="bi bi-x"></i>
                </button>
            </div>
            
            <div class="sidebar-content">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <router-link to="/seller/dashboard" class="nav-link" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-speedometer2"></i>
                            </div>
                            <span class="nav-text">Dashboard</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/seller/products" class="nav-link" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-box"></i>
                            </div>
                            <span class="nav-text">My Products</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/seller/orders" class="nav-link" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-cart-check"></i>
                            </div>
                            <span class="nav-text">Orders</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/seller/text-management" class="nav-link" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-type"></i>
                            </div>
                            <span class="nav-text">Text Management</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/seller/profile" class="nav-link" active-class="active">
                            <div class="nav-icon">
                                <i class="bi bi-person"></i>
                            </div>
                            <span class="nav-text">Profile</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                </ul>
            </div>
            
            <div class="sidebar-footer">
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="bi bi-person-circle"></i>
                    </div>
                    <div class="user-details">
                        <p class="user-name">{{ userInfo.name || 'Seller' }}</p>
                        <p class="user-role">Store Owner</p>
                    </div>
                </div>
                <button class="btn btn-logout" @click="handleLogout">
                    <i class="bi bi-box-arrow-right me-2"></i>
                    Logout
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
            <div class="content-wrapper">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<script>
import axios from '@/axios';

export default {
    name: 'SellerLayout',
    data() {
        return {
            isSidebarOpen: false,
            userInfo: {}
        }
    },
    mounted() {
        this.loadUserInfo();
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        loadUserInfo() {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                this.userInfo = user;
            } catch (error) {
                console.error('Error loading user info:', error);
                this.userInfo = { name: 'Seller' };
            }
        },
        async handleLogout() {
            try {
                await axios.get('/logout');
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Show success message
                this.showToast('Logged out successfully', 'success');
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1000);
            } catch (error) {
                console.error('Logout error:', error);
                this.showToast('Failed to logout', 'error');
            }
        },
        showToast(message, type = 'info') {
            // Create toast element
            const toast = document.createElement('div');
            toast.className = `toast-notification toast-${type}`;
            toast.innerHTML = `
                <div class="toast-content">
                    <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
                    ${message}
                </div>
                <button class="toast-close" onclick="this.parentElement.remove()">
                    <i class="bi bi-x"></i>
                </button>
            `;
            
            // Add to body
            document.body.appendChild(toast);
            
            // Show toast
            setTimeout(() => toast.classList.add('show'), 100);
            
            // Auto remove
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }
}
</script>

<style scoped>
.seller-layout {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Sidebar Styles */
.sidebar {
    width: 280px;
    min-height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
}

.sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.brand-section {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.brand-logo {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #007aff 0%, #0056b3 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: white;
    box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
}

.brand-info {
    flex: 1;
}

.brand-title {
    color: white;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.2;
}

.brand-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.2;
}

.btn-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.25rem;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.btn-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

/* Sidebar Content */
.sidebar-content {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
}

.nav {
    padding: 0 1rem;
}

.nav-item {
    margin-bottom: 0.5rem;
}

.nav-link {
    display: flex;
    align-items: center;
    padding: 1rem 1.25rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.nav-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #007aff 0%, #0056b3 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 12px;
}

.nav-link:hover::before,
.nav-link.active::before {
    opacity: 1;
}

.nav-link:hover,
.nav-link.active {
    color: white;
    transform: translateX(4px);
    box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
}

.nav-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    position: relative;
    z-index: 1;
    font-size: 1.1rem;
}

.nav-text {
    position: relative;
    z-index: 1;
    font-weight: 500;
    font-size: 0.95rem;
}

.nav-indicator {
    width: 4px;
    height: 20px;
    background: #007aff;
    border-radius: 2px;
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.3s ease;
    position: relative;
    z-index: 1;
}

.nav-link.active .nav-indicator {
    opacity: 1;
}

/* Sidebar Footer */
.sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #007aff 0%, #0056b3 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.25rem;
}

.user-details {
    flex: 1;
}

.user-name {
    color: white;
    font-weight: 600;
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.2;
}

.user-role {
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    font-size: 0.8rem;
    line-height: 1.2;
}

.btn-logout {
    width: 100%;
    background: rgba(220, 53, 69, 0.1);
    border: 1px solid rgba(220, 53, 69, 0.3);
    color: #dc3545;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-logout:hover {
    background: #dc3545;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

/* Main Content */
.main-content {
    flex: 1;
    margin-left: 280px;
    min-height: 100vh;
    transition: margin-left 0.3s ease;
}

.content-wrapper {
    padding: 2rem;
    min-height: 100vh;
}

/* Mobile Toggle Button */
.sidebar-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1001;
    background: #007aff;
    border: none;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 4px 15px rgba(0, 122, 255, 0.3);
    transition: all 0.3s ease;
}

.sidebar-toggle:hover {
    background: #0056b3;
    transform: scale(1.05);
}

/* Toast Notifications */
.toast-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 300px;
    z-index: 9999;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-left: 4px solid #007aff;
}

.toast-notification.show {
    transform: translateX(0);
}

.toast-notification.toast-success {
    border-left-color: #28a745;
}

.toast-notification.toast-error {
    border-left-color: #dc3545;
}

.toast-content {
    display: flex;
    align-items: center;
    color: #333;
    font-weight: 500;
}

.toast-close {
    background: none;
    border: none;
    color: #666;
    font-size: 1.25rem;
    padding: 0;
    margin-left: 1rem;
    cursor: pointer;
    transition: color 0.3s ease;
}

.toast-close:hover {
    color: #333;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
        width: 100%;
        max-width: 300px;
    }

    .sidebar.show {
        transform: translateX(0);
    }

    .main-content {
        margin-left: 0;
    }

    .content-wrapper {
        padding: 1rem;
    }

    .brand-section {
        gap: 0.75rem;
    }

    .brand-logo {
        width: 40px;
        height: 40px;
        font-size: 1.25rem;
    }

    .brand-title {
        font-size: 1.1rem;
    }

    .brand-subtitle {
        font-size: 0.8rem;
    }

    .nav-link {
        padding: 0.875rem 1rem;
    }

    .nav-text {
        font-size: 0.9rem;
    }

    .user-info {
        padding: 0.75rem;
    }

    .user-avatar {
        width: 35px;
        height: 35px;
        font-size: 1.1rem;
    }

    .user-name {
        font-size: 0.9rem;
    }

    .user-role {
        font-size: 0.75rem;
    }

    .toast-notification {
        min-width: 280px;
        right: 10px;
        top: 10px;
    }
}

@media (max-width: 480px) {
    .sidebar {
        width: 100%;
    }

    .content-wrapper {
        padding: 0.75rem;
    }

    .toast-notification {
        min-width: 260px;
        padding: 0.875rem 1.25rem;
    }
}

/* Scrollbar Styling */
.sidebar-content::-webkit-scrollbar {
    width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}

/* Animation for page transitions */
.content-wrapper {
    animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style> 