<template>
    <div class="admin-layout">
        <!-- Global Loader -->
        <GlobalLoader />
        
        <!-- Mobile Toggle Button -->
        <button class="btn btn-primary d-md-none sidebar-toggle" @click="toggleSidebar">
            <i class="bi bi-list"></i>
        </button>

        <!-- Sidebar -->
        <div class="sidebar" :class="{ 'show': isSidebarOpen }">
            <div class="sidebar-header">
                <div class="logo-section">
                    <div class="logo-icon">
                        <i class="bi bi-shield-check"></i>
                    </div>
                    <div class="logo-text">
                        <h5 class="mb-0">Admin Panel</h5>
                        <small class="text-muted">Mintiss Management</small>
                    </div>
                </div>
                <button class="btn btn-close d-md-none" @click="toggleSidebar">
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
.admin-layout {
    display: flex;
    min-height: 100vh;
    background: #f8fafc;
}

/* Sidebar Styles */
.sidebar {
    width: 280px;
    min-height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    transition: transform 0.3s ease;
    background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
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

.logo-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
}

.logo-text h5 {
    color: white;
    font-weight: 600;
    margin: 0;
}

.logo-text small {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.75rem;
}

.btn-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.2rem;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s ease;
}

.btn-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

.sidebar-content {
    flex: 1;
    padding: 1rem 0;
    overflow-y: auto;
}

.nav {
    padding: 0 1rem;
}

.nav-item {
    margin-bottom: 0.25rem;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
    font-weight: 500;
}

.nav-link i {
    font-size: 1.1rem;
    width: 20px;
    text-align: center;
}

.nav-link:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
}

.nav-link.router-link-active {
    color: white;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
    background: #f8fafc;
}

.content-wrapper {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

/* Mobile Toggle Button */
.sidebar-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1001;
    background: #3b82f6;
    border: none;
    color: white;
    padding: 0.75rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
}

.sidebar-toggle:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
        width: 280px;
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

    .admin-layout {
        flex-direction: column;
    }
}

/* Scrollbar Styling */
.sidebar-content::-webkit-scrollbar {
    width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
}

/* Animation for sidebar items */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.nav-item {
    animation: slideIn 0.3s ease forwards;
}

.nav-item:nth-child(1) { animation-delay: 0.1s; }
.nav-item:nth-child(2) { animation-delay: 0.2s; }
.nav-item:nth-child(3) { animation-delay: 0.3s; }
.nav-item:nth-child(4) { animation-delay: 0.4s; }
.nav-item:nth-child(5) { animation-delay: 0.5s; }
.nav-item:nth-child(6) { animation-delay: 0.6s; }
.nav-item:nth-child(7) { animation-delay: 0.7s; }
</style>