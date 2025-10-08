<template>
    <div class="modern-admin-layout">
        <!-- Global Loader -->
        <GlobalLoader />
        
        <!-- Mobile Toggle Button -->
        <button class="mobile-toggle-btn" @click="toggleSidebar">
            <i class="bi bi-list"></i>
        </button>

        <!-- Sidebar -->
        <div class="modern-sidebar" :class="{ 'show': isSidebarOpen }">
            <div class="sidebar-header">
                <div class="logo-section">
                    <div class="logo-text">
                        <h5 class="logo-title">Admin Panel</h5>
                        <small class="logo-subtitle">Mintiss Management</small>
                    </div>
                </div>
                <button class="close-btn d-md-none" @click="toggleSidebar">
                    <i class="bi bi-x"></i>
                </button>
            </div>
            
            <div class="sidebar-content">
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <router-link to="/admin/users" class="nav-link">
                            <i class="bi bi-people"></i>
                            <span>Users</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/sellers" class="nav-link">
                            <i class="bi bi-shop"></i>
                            <span>Sellers</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/mintiss-values" class="nav-link">
                            <i class="bi bi-currency-dollar"></i>
                            <span>Mintiss Values</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/signup-bonus" class="nav-link">
                            <i class="bi bi-gift"></i>
                            <span>Signup Bonus</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/signup-Referral" class="nav-link">
                            <i class="bi bi-person-plus"></i>
                            <span>Referrals</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/categories" class="nav-link">
                            <i class="bi bi-tags"></i>
                            <span>Categories</span>
                            <div class="nav-indicator"></div>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/admin/hero-sections" class="nav-link">
                            <i class="bi bi-stars"></i>
                            <span>Hero Section</span>
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
                        <div class="user-name">Admin User</div>
                        <div class="user-role">Administrator</div>
                    </div>
                </div>
                <button class="btn btn-logout" @click="handleLogout">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Logout</span>
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
import toastService from '@/services/toastService';
import loaderService from '@/services/loaderService';
import GlobalLoader from '@/components/GlobalLoader.vue';

export default {
    name: 'AdminLayout',
    components: {
        GlobalLoader
    },
    data() {
        return {
            isSidebarOpen: false
        }
    },
    methods: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen;
        },
        async handleLogout() {
            try {
                await loaderService.withLoader(
                    () => axios.get('/logout'),
                    'Logging out...'
                );
                // Clear local storage
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Show success message
                toastService.success('Logged out successfully');
                // Redirect to login page
                window.location.href = '/login';
            } catch (error) {
                console.error('Logout error:', error);
                toastService.error('Failed to logout');
            }
        }
    }
}
</script>

<style scoped>
/* ===== MODERN ADMIN LAYOUT STYLES ===== */
.modern-admin-layout {
    display: flex;
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    position: relative;
}

/* Mobile Toggle Button */
.mobile-toggle-btn {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1001;
    background: linear-gradient(135deg, #1177bf, #0d5a9a);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 0.75rem;
    box-shadow: 0 4px 15px rgba(17, 119, 191, 0.3);
    transition: all 0.3s ease;
    display: none;
}

.mobile-toggle-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(17, 119, 191, 0.4);
}

.mobile-toggle-btn i {
    font-size: 1.2rem;
}

/* Modern Sidebar */
.modern-sidebar {
    width: 280px;
    min-height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    box-shadow: 4px 0 30px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header {
    padding: 2rem 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
}

.logo-section {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logo-icon {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #1177bf, #0d5a9a);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    box-shadow: 0 8px 20px rgba(17, 119, 191, 0.3);
    transition: all 0.3s ease;
}

.logo-icon:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 25px rgba(17, 119, 191, 0.4);
}

.logo-title {
    color: white;
    font-weight: 700;
    margin: 0;
    font-size: 1.1rem;
    letter-spacing: -0.5px;
}

.logo-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    margin: 0;
    font-weight: 500;
}

.close-btn {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: rgba(255, 255, 255, 0.8);
    font-size: 1.2rem;
    padding: 0.75rem;
    border-radius: 12px;
    transition: all 0.3s ease;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transform: scale(1.05);
}

.sidebar-content {
    flex: 1;
    padding: 1.5rem 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.sidebar-content::-webkit-scrollbar {
    width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
}

.nav {
    padding: 0 1.5rem;
}

.nav-item {
    margin-bottom: 0.5rem;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    font-weight: 500;
    font-size: 0.95rem;
    overflow: hidden;
}

.nav-link::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
}

.nav-link:hover::before {
    left: 100%;
}

.nav-link i {
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
    transition: all 0.3s ease;
}

.nav-link:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(8px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.nav-link:hover i {
    transform: scale(1.1);
}

.nav-link.router-link-active {
    color: white;
    background: linear-gradient(135deg, #1177bf, #0d5a9a);
    box-shadow: 0 8px 25px rgba(17, 119, 191, 0.3);
    transform: translateX(4px);
}

.nav-link.router-link-active i {
    transform: scale(1.1);
}

.nav-indicator {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.3s ease;
}

.nav-link.router-link-active .nav-indicator {
    opacity: 1;
    transform: scaleY(1);
}

.nav-indicator {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%) scaleY(0);
    width: 3px;
    height: 20px;
    background: white;
    border-radius: 2px;
    opacity: 0;
    transition: all 0.3s ease;
}

.sidebar-footer {
    padding: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
}

.user-avatar {
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
}

.user-details {
    flex: 1;
}

.user-name {
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
}

.user-role {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
}

.btn-logout {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #fca5a5;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn-logout:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
    color: #f87171;
    transform: translateY(-1px);
}

/* Main Content */
.main-content {
    flex: 1;
    margin-left: 280px;
    min-height: 100vh;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    transition: all 0.3s ease;
}

.content-wrapper {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .mobile-toggle-btn {
        display: flex;
    }
    
    .modern-sidebar {
        transform: translateX(-100%);
        width: 280px;
    }

    .modern-sidebar.show {
        transform: translateX(0);
    }
    
    .main-content {
        margin-left: 0;
    }
    
    .content-wrapper {
        padding: 1rem;
    }
}

@media (max-width: 576px) {
    .sidebar-header {
        padding: 1.5rem 1rem;
    }
    
    .logo-section {
        gap: 0.75rem;
    }
    
    .logo-icon {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }
    
    .logo-title {
        font-size: 1rem;
    }
    
    .logo-subtitle {
        font-size: 0.75rem;
    }
    
    .nav {
        padding: 0 1rem;
    }
    
    .nav-link {
        padding: 0.875rem 1rem;
        font-size: 0.9rem;
    }
    
    .content-wrapper {
        padding: 0.75rem;
    }
}

/* Animations */
@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.nav-link {
    animation: slideInLeft 0.3s ease-out;
}

.nav-link:nth-child(1) { animation-delay: 0.1s; }
.nav-link:nth-child(2) { animation-delay: 0.2s; }
.nav-link:nth-child(3) { animation-delay: 0.3s; }
.nav-link:nth-child(4) { animation-delay: 0.4s; }
.nav-link:nth-child(5) { animation-delay: 0.5s; }
.nav-link:nth-child(6) { animation-delay: 0.6s; }

/* Accessibility */
.nav-link:focus,
.close-btn:focus,
.mobile-toggle-btn:focus {
    outline: 2px solid rgba(17, 119, 191, 0.5);
    outline-offset: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .modern-admin-layout {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    }
    
    .main-content {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    }
}

/* Mobile responsive */
@media (max-width: 768px) {
    .main-content {
        margin-left: 0;
    }

    .content-wrapper {
        padding: 1rem;
    }
}
</style>